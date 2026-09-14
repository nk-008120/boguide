const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');

function loadPaper(paperId) {
  if (!/^[a-z0-9-]+$/.test(paperId || '')) return null;
  const filePath = path.join(process.cwd(), 'data', 'bioclash', `${paperId}.yaml`);
  if (!fs.existsSync(filePath)) return null;
  return yaml.load(fs.readFileSync(filePath, 'utf8'));
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

function componentIsCorrect(component, submitted) {
  if (submitted === undefined || submitted === null) return false;
  switch (component.type) {
    case 'mcq':
      return submitted === component.correctKey;
    case 'true_false':
      return submitted === component.correctValue;
    case 'numeric': {
      const val = Number(submitted);
      if (Number.isNaN(val)) return false;
      const tol = component.tolerance != null ? component.tolerance : 0;
      return Math.abs(val - component.expected) <= tol;
    }
    default:
      return null;
  }
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

const rateBuckets = new Map();

function rateLimit(userId, action, maxPerWindow, windowMs) {
  const key = userId + ':' + action;
  const now = Date.now();
  let bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.start > windowMs) {
    bucket = { start: now, count: 0 };
  }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  if (rateBuckets.size > 5000) {
    const cutoff = now - windowMs;
    for (const [k, v] of rateBuckets) {
      if (now - v.start > cutoff) rateBuckets.delete(k);
    }
  }
  return bucket.count > maxPerWindow;
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
  autoGrade,
  extensionPenalty,
  rateLimit,
  watermarkCode,
  newSessionToken,
  computeTotalPages
};
