// Shared helpers for api/bioclash-*.js. Question CONTENT (text, options,
// correct answers) lives in data/bioclash/<paperId>.yaml, read fresh off
// disk per request — same "YAML is the single source of truth, the server
// recomputes from it" discipline as api/submit-attempt.js. Nothing in here
// is a database client; that stays in supabaseAdmin.js.
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

// Every block in the paper, across every part, in document order.
function allBlocks(paper) {
  const out = [];
  for (const part of paper.parts || []) {
    for (const block of part.blocks || []) {
      out.push({ ...block, partId: part.id, partName: part.name });
    }
  }
  return out;
}

function findBlock(paper, blockId) {
  return allBlocks(paper).find((b) => b.id === blockId) || null;
}

// The very first answerable (non-reveal) block(s) of the paper — what a
// fresh attempt starts with. Currently: the first part's blocks. Reveal-
// type blocks are never included here; they only ever appear via a lock.
function initialBlocks(paper) {
  const first = (paper.parts || [])[0];
  if (!first) return [];
  return (first.blocks || []).map((b) => ({ ...b, partId: first.id, partName: first.name }));
}

// Deterministic per-user shuffle, so the same user always sees the same
// option order for the same block across resumes/refreshes, without
// persisting the shuffle anywhere. mulberry32 PRNG seeded from a simple
// string hash — good enough for display-order shuffling, not a
// cryptographic use.
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

// Strip every field that would give away a correct answer, and apply
// per-user MCQ shuffling. Returns a client-safe copy of a block — this is
// the ONE function every endpoint must route block content through before
// it touches a response body.
function toClientBlock(block, userId) {
  const clean = {
    id: block.id,
    partId: block.partId,
    partName: block.partName,
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
    }
    // true_false, free_text, numeric, fill_blank: no options to shuffle,
    // and correctValue/expected/tolerance/correctKey are simply never
    // copied onto `comp` in the first place — not redacted, just absent.
    return comp;
  });
  return clean;
}

// Auto-gradable comparison for mcq / true_false / numeric components only.
// free_text is never auto-scored — offline grading only, by design.
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
      return null; // not auto-gradable (free_text, fill_blank)
  }
}

// Short, deterministic, non-reversible per-user/per-paper code rendered as
// a faint watermark on the attempt page — a deterrent/attribution tool for
// leaked screenshots, not a leak-prevention mechanism. Server-generated so
// it can't be stripped by disabling client JS.
function watermarkCode(userId, paperId) {
  return crypto.createHash('sha256').update(`${userId}:${paperId}`).digest('hex').slice(0, 8);
}

module.exports = {
  loadPaper,
  allBlocks,
  findBlock,
  initialBlocks,
  seededShuffle,
  toClientBlock,
  componentIsCorrect,
  watermarkCode
};
