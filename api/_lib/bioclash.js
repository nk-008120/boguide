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
      out.push({ ...block, partId: part.id, partName: part.name, partIntro: part.intro || null });
    }
  }
  return out;
}

function findBlock(paper, blockId) {
  return allBlocks(paper).find((b) => b.id === blockId) || null;
}

// A block's `reveals` (block ids) and `revealsParts` (part ids) fields may
// each be a single string or an array — normalise to an array either way.
function asArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

// Every block id that is the `reveals` target of some other block, across
// the whole paper.
function gatedBlockIds(paper) {
  const set = new Set();
  for (const block of allBlocks(paper)) {
    for (const id of asArray(block.reveals)) set.add(id);
  }
  return set;
}

// Every part id that is the `revealsParts` target of some other block,
// across the whole paper.
function gatedPartIds(paper) {
  const set = new Set();
  for (const block of allBlocks(paper)) {
    for (const id of asArray(block.revealsParts)) set.add(id);
  }
  return set;
}

// Every block in the ENTIRE paper EXCEPT any block that is itself gated —
// either it's the specific `reveals` target of some other block, or its
// whole part is the `revealsParts` target of some other block. That
// exclusion is the whole point — a reveal-gated block must never be
// reachable until its gating lock actually fires. Everything else starts
// visible together, not part by part: ordinary "recoverable" questions (the
// paper's own term — answerable and revisable at any point) carry no
// secret-dependent information, so there's no security reason to drip-feed
// them in; a real timed paper lets you see and navigate the whole thing
// too, except specifically-locked sections.
//
// (Two bugs fixed here 2026-08-10, both from the same root cause — this
// function used to only ever return part 1's blocks:
// 1. The "Timeline Confirmed" reveal (part-a-reveal) was visible from the
//    very start, before Part A was ever locked — the ORIGINAL version of
//    this fix (scoping to part 1, still excluding reveals targets) closed
//    that specific leak.
// 2. But scoping to "part 1 only" also meant NOTHING beyond Part A could
//    ever become reachable — Part B's block isn't the `reveals` target of
//    anything, so once Part A's reveal appeared, the attempt was
//    permanently stuck with no way to proceed. This version fixes that by
//    spanning every part, not just the first.
//
// `revealsParts` was added 2026-08-11 so a single lock — the end of the
// Data Analysis section — can gate ALL of Part B–F at once (closing the
// "scroll ahead and read the whole paper" leak: previously every
// recoverable part was visible from the very start, which included Part
// B's intro text giving away Part A's non-recoverable answer). A block
// whose part is bulk-revealed this way still respects its OWN `reveals`
// gate underneath — e.g. q10-4-rest stays hidden even once Part E at large
// is revealed, until q10-4a is separately locked.)
function initialBlocks(paper) {
  const gatedIds = gatedBlockIds(paper);
  const gatedParts = gatedPartIds(paper);
  return allBlocks(paper).filter((b) => !gatedIds.has(b.id) && !gatedParts.has(b.partId));
}

// Every block that locking `block` reveals: its own explicit `reveals`
// target(s), plus every block belonging to any part named in
// `revealsParts` — except a block that is STILL gated by some OTHER lock's
// `reveals` (see initialBlocks' comment above; q10-4-rest is the running
// example). Used by bioclash-lock-block.js so a single lock can hand back
// more than one newly-visible block.
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
      // No options of its own — options are computed client-side at render
      // time from the sibling component named in refersTo, restricted to
      // whichever ones are NOT currently selected there. See
      // bioclash-attempt.js's renderFreeTextForOthers().
      comp.refersTo = c.refersTo;
      comp.marksEach = c.marksEach;
      comp.promptTemplate = c.promptTemplate;
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
  blocksRevealedByLock,
  seededShuffle,
  toClientBlock,
  componentIsCorrect,
  watermarkCode
};
