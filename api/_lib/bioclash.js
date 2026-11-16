const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');
const { rateLimit } = require('./rateLimit');
const { authenticate } = require('./auth');
const paperVault = require('./paperVault');

const paperCache = new Map();

function readPaperSource(paperId) {
  const filePath = path.join(process.cwd(), 'data', 'bioclash', `${paperId}.yaml`);
  if (fs.existsSync(filePath)) return fs.readFileSync(filePath, 'utf8');
  const vaultPath = `${filePath}.enc`;
  if (!fs.existsSync(vaultPath)) return null;
  try {
    return paperVault.decrypt(fs.readFileSync(vaultPath, 'utf8'), paperId, paperVault.keyringFromEnv()).toString('utf8');
  } catch (err) {
    console.error(`[bioclash] could not open encrypted paper "${paperId}": ${err.code || err.name}`);
    return null;
  }
}

function loadPaper(paperId) {
  if (typeof paperId !== 'string' || !/^[a-z0-9-]+$/.test(paperId)) return null;
  if (paperCache.has(paperId)) return paperCache.get(paperId);
  const source = readPaperSource(paperId);
  if (source == null) return null;
  const paper = yaml.load(source);
  paperCache.set(paperId, paper);
  return paper;
}

function allBlocks(paper) {
  const out = [];
  for (const part of paper.parts || []) {
    for (const block of part.blocks || []) {
      out.push({ ...block, partId: part.id, partName: part.name, partIntro: part.intro || null });
    }
  }
  return out;
}

function findBlock(paper, blockId) {
  return allBlocks(paper).find((b) => b.id === blockId) || null;
}

function asArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function gatedBlockIds(paper) {
  const set = new Set();
  for (const block of allBlocks(paper)) {
    for (const id of asArray(block.reveals)) set.add(id);
  }
  return set;
}

function gatedPartIds(paper) {
  const set = new Set();
  for (const block of allBlocks(paper)) {
    for (const id of asArray(block.revealsParts)) set.add(id);
  }
  return set;
}

function initialBlocks(paper) {
  const gatedIds = gatedBlockIds(paper);
  const gatedParts = gatedPartIds(paper);
  return allBlocks(paper).filter((b) => !gatedIds.has(b.id) && !gatedParts.has(b.partId));
}

function blocksRevealedByLock(paper, block) {
  const directTargets = new Set(asArray(block.reveals));
  const partTargets = new Set(asArray(block.revealsParts));
  if (directTargets.size === 0 && partTargets.size === 0) return [];
  const gatedIds = gatedBlockIds(paper);
  const out = [];
  for (const b of allBlocks(paper)) {
    if (directTargets.has(b.id)) {
      out.push(b);
    } else if (partTargets.has(b.partId) && !gatedIds.has(b.id)) {
      out.push(b);
    }
  }
  return out;
}

function seededShuffle(items, seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let seed = h >>> 0;
  function next() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toClientBlock(block, userId) {
  const clean = {
    id: block.id,
    partId: block.partId,
    partName: block.partName,
    partIntro: block.partIntro || null,
    label: block.label || null,
    table: block.table || null,
    tables: block.tables || null,
    images: block.images || null,
    type: block.type,
    locksAfterSubmit: !!block.locksAfterSubmit,
    lockWarning: block.lockWarning || null
  };
  if (block.type === 'reveal_content') {
    clean.content = block.content;
    return clean;
  }
  clean.components = (block.components || []).map((c) => {
    const comp = {
      key: c.key,
      type: c.type,
      marks: c.marks,
      prompt: c.prompt,
      imageRef: c.imageRef || null,
      table: c.table || null
    };
    if (c.type === 'mcq') {
      const seed = `${userId}:${block.id}:${c.key}`;
      comp.options = seededShuffle((c.options || []).map((o) => ({ key: o.key, text: o.text })), seed);
    } else if (c.type === 'free_text_for_others') {
      comp.refersTo = c.refersTo;
      comp.marksEach = c.marksEach;
      comp.promptTemplate = c.promptTemplate;
    }

    return comp;
  });
  return clean;
}

function componentMaxMarks(paper, component) {
  if (component.marksEach && component.refersTo) {
    const referenced = allBlocks(paper)
      .flatMap((b) => b.components || [])
      .find((c) => c.key === component.refersTo);
    if (referenced && referenced.options) {
      return component.marksEach * (referenced.options.length - 1);
    }
  }
  return component.marks || 1;
}

function numericValue(submitted) {
  if (typeof submitted === 'number') return Number.isFinite(submitted) ? submitted : null;
  if (typeof submitted !== 'string' || submitted.trim() === '') return null;
  const val = Number(submitted);
  return Number.isFinite(val) ? val : null;
}

function componentIsCorrect(component, submitted) {
  const missing = submitted === undefined || submitted === null;
  switch (component.type) {
    case 'mcq':
      return !missing && submitted === component.correctKey;
    case 'true_false':
      return !missing && submitted === component.correctValue;
    case 'numeric': {
      const val = numericValue(submitted);
      if (val === null) return false;
      const tol = component.tolerance != null ? component.tolerance : 0;
      return Math.abs(val - component.expected) <= tol;
    }
    default:
      return null;
  }
}

const MAX_ANSWER_TEXT = 5000;
const MAX_ANSWER_JSON = 50000;
const MAX_SUB_ANSWERS = 30;

function cleanScalar(value) {
  if (typeof value === 'boolean') return { value };
  if (typeof value === 'number') return Number.isFinite(value) ? { value } : { error: 'Answers must be finite numbers' };
  if (typeof value === 'string') {
    return value.length <= MAX_ANSWER_TEXT ? { value } : { error: 'Answers are limited to ' + MAX_ANSWER_TEXT + ' characters' };
  }
  return { error: 'Unsupported answer value' };
}

function sanitizeAnswers(paperBlock, raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { error: 'componentAnswers must be an object' };
  let size;
  try {
    size = JSON.stringify(raw).length;
  } catch (e) {
    return { error: 'componentAnswers could not be read' };
  }
  if (size > MAX_ANSWER_JSON) return { error: 'Answers are too large' };
  const components = new Map((paperBlock.components || []).map((c) => [c.key, c]));
  const answers = {};
  for (const key of Object.keys(raw)) {
    const component = components.get(key);
    if (!component) continue;
    const value = raw[key];
    if (value === null || value === undefined) continue;
    if (component.type === 'free_text_for_others') {
      if (typeof value !== 'object' || Array.isArray(value)) return { error: 'Unsupported answer value' };
      const subKeys = Object.keys(value);
      if (subKeys.length > MAX_SUB_ANSWERS) return { error: 'Too many answers' };
      const nested = {};
      for (const sub of subKeys) {
        if (sub.length > 64 || typeof value[sub] !== 'string') return { error: 'Unsupported answer value' };
        const cleaned = cleanScalar(value[sub]);
        if (cleaned.error) return cleaned;
        nested[sub] = cleaned.value;
      }
      answers[key] = nested;
      continue;
    }
    const cleaned = cleanScalar(value);
    if (cleaned.error) return cleaned;
    answers[key] = cleaned.value;
  }
  return { answers };
}

async function raiseCounters(admin, attemptId, fullscreenExits, visibilityLosses) {
  const updates = [['fullscreen_exits', fullscreenExits], ['visibility_losses', visibilityLosses]];
  for (const [column, raw] of updates) {
    if (!Number.isFinite(raw) || raw < 0) continue;
    const value = Math.min(Math.floor(raw), 100000);
    await admin.from('bioclash_attempts').update({ [column]: value }).eq('id', attemptId).lt(column, value);
  }
}

const FIGURE_BUCKET = 'bioclash-figures';
const FIGURE_PREFIX = 'private:';
const FIGURE_TTL_SECONDS = 3 * 60 * 60;

function privatePath(ref) {
  return typeof ref === 'string' && ref.startsWith(FIGURE_PREFIX) ? ref.slice(FIGURE_PREFIX.length) : null;
}

async function signBlockFigures(admin, blocks) {
  const paths = new Set();
  for (const block of blocks) {
    for (const img of block.images || []) {
      const p = img && privatePath(img.src);
      if (p) paths.add(p);
    }
    for (const comp of block.components || []) {
      const p = privatePath(comp.imageRef);
      if (p) paths.add(p);
    }
  }
  if (paths.size === 0) return blocks;
  const { data, error } = await admin.storage.from(FIGURE_BUCKET).createSignedUrls([...paths], FIGURE_TTL_SECONDS);
  if (error) throw error;
  const signed = new Map();
  for (const item of data || []) {
    if (item && item.path && item.signedUrl) signed.set(item.path, item.signedUrl);
  }
  const resolve = (ref) => {
    const p = privatePath(ref);
    return p ? signed.get(p) || null : ref;
  };
  return blocks.map((block) => ({
    ...block,
    images: block.images ? block.images.map((img) => (img && typeof img.src === 'string' ? { ...img, src: resolve(img.src) } : img)) : block.images,
    components: block.components ? block.components.map((comp) => ({ ...comp, imageRef: resolve(comp.imageRef) })) : block.components
  }));
}

function computeTotalPages(paper) {
  const blocks = allBlocks(paper);
  const byPart = {};
  for (const b of blocks) (byPart[b.partId] = byPart[b.partId] || []).push(b);
  const chainParts = {};
  for (const pid of Object.keys(byPart)) {
    chainParts[pid] = byPart[pid].every((b) => b.locksAfterSubmit || b.type === 'reveal_content');
  }
  let pages = 0;
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (chainParts[block.partId]) {
      if (block.type === 'reveal_content') { i++; continue; }
      pages += 1;
      i += 1;
    } else {
      const pid = block.partId;
      while (i < blocks.length && blocks[i].partId === pid) i++;
      pages += 1;
    }
  }
  return pages;
}

function autoGrade(paper, attemptBlockRows) {
  let autoCorrect = 0;
  let autoTotal = 0;
  let autoMarksEarned = 0;
  let autoMarksTotal = 0;
  for (const row of attemptBlockRows) {
    const paperBlock = findBlock(paper, row.block_id);
    if (!paperBlock || paperBlock.type === 'reveal_content') continue;
    for (const component of paperBlock.components || []) {
      const result = componentIsCorrect(component, (row.answer || {})[component.key]);
      if (result === null) continue;
      const marks = component.marks || 1;
      autoTotal += 1;
      autoMarksTotal += marks;
      if (result) {
        autoCorrect += 1;
        autoMarksEarned += marks;
      }
    }
  }
  return { autoCorrect, autoTotal, autoMarksEarned, autoMarksTotal };
}

function extensionPenalty(paper, blocksUsed) {
  const schedule = paper.extensionCostSchedule || [];
  return schedule.slice(0, blocksUsed).reduce((a, b) => a + b, 0);
}

function watermarkCode(userId, paperId) {
  return crypto.createHash('sha256').update(`${userId}:${paperId}`).digest('hex').slice(0, 16);
}

function newSessionToken() {
  return crypto.randomUUID();
}

module.exports = {
  loadPaper,
  allBlocks,
  findBlock,
  initialBlocks,
  blocksRevealedByLock,
  seededShuffle,
  toClientBlock,
  componentIsCorrect,
  componentMaxMarks,
  sanitizeAnswers,
  raiseCounters,
  signBlockFigures,
  autoGrade,
  extensionPenalty,
  rateLimit,
  authenticate,
  watermarkCode,
  newSessionToken,
  computeTotalPages
};
