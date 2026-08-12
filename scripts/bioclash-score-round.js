#!/usr/bin/env node
// Hand-run helper (NOT a live API endpoint) that turns a round's raw
// graded scores + extension-block usage into the three numbers
// bioclash_results now stores per student: raw_score, z_score, and
// time_normalized_z. Full formula/rationale: context/bioclash-season-
// points-plan.md. This never runs automatically — a round can only be
// scored once its open window has closed and every attempt is fully
// graded (most marks are manually graded free-text, same as always), so
// this is meant to be run by hand against a JSON file compiled
// from the grading pass, exactly the "hand it to you" workflow
// already established for bioclash_results entry generally.
//
// Usage:
//   node scripts/bioclash-score-round.js <paperId> <inputFile.json> [seasonYear] [seasonWeight]
//
// inputFile.json shape — one entry per student who completed the round:
//   [
//     { "userId": "...", "displayName": "...", "rawScore": 132, "blocksUsed": 0 },
//     { "userId": "...", "displayName": "...", "rawScore": 98,  "blocksUsed": 2 },
//     ...
//   ]
//
// Prints a human-readable table (for sanity-checking) plus CSV ready to
// paste values from into bioclash_results (season_year, round_id,
// user_id, raw_score, z_score, time_normalized_z, season_weight columns —
// season/placement/score_label/awarded_at still need filling in by hand
// as before, this script only computes the three standardized numbers).
const fs = require('fs');
const path = require('path');
const { loadPaper } = require('../api/_lib/bioclash');

function fail(msg) {
  console.error('Error: ' + msg);
  process.exit(1);
}

const [, , paperId, inputPath, seasonYearArg, seasonWeightArg] = process.argv;
if (!paperId || !inputPath) {
  fail('usage: node scripts/bioclash-score-round.js <paperId> <inputFile.json> [seasonYear] [seasonWeight]');
}

const paper = loadPaper(paperId);
if (!paper) fail(`unknown paper "${paperId}" (checked data/bioclash/${paperId}.yaml)`);

const costSchedule = paper.extensionCostSchedule || [];
const bonusCeiling = paper.extensionBonusCeiling || 0;

let entries;
try {
  entries = JSON.parse(fs.readFileSync(path.resolve(inputPath), 'utf8'));
} catch (e) {
  fail(`could not read/parse ${inputPath}: ${e.message}`);
}
if (!Array.isArray(entries) || entries.length === 0) {
  fail('input file must be a non-empty JSON array');
}
for (const e of entries) {
  if (!e.userId || typeof e.rawScore !== 'number' || typeof e.blocksUsed !== 'number') {
    fail(`every entry needs userId, numeric rawScore, numeric blocksUsed — got ${JSON.stringify(e)}`);
  }
}

// Marginal cost of having used exactly `blocksUsed` blocks — cumulative
// sum of the schedule's first `blocksUsed` marginal entries. Using more
// blocks than the schedule has entries for costs the full schedule sum
// (shouldn't happen if maxExtensionBlocks === costSchedule.length, but
// don't silently under-charge if the YAML is ever inconsistent).
function costFor(blocksUsed) {
  let total = 0;
  for (let i = 0; i < Math.min(blocksUsed, costSchedule.length); i++) total += costSchedule[i];
  if (blocksUsed > costSchedule.length) {
    total += costSchedule.reduce((a, b) => a + b, 0) - total; // remainder, degenerate case
  }
  return total;
}

const n = entries.length;
const mean = entries.reduce((sum, e) => sum + e.rawScore, 0) / n;
// Population standard deviation (divide by n, not n-1) — the round's
// actual full field, not a sample of a larger population. See the season
// plan doc for why this is the chosen convention.
const variance = entries.reduce((sum, e) => sum + Math.pow(e.rawScore - mean, 2), 0) / n;
const stdev = Math.sqrt(variance);

const extendedCount = entries.filter((e) => e.blocksUsed > 0).length;
const q = n > 0 ? extendedCount / n : 0; // fraction of the field that used >=1 block

const results = entries.map((e) => {
  const z = stdev > 0 ? (e.rawScore - mean) / stdev : 0;
  const cost = costFor(e.blocksUsed);
  const bonus = e.blocksUsed === 0 ? bonusCeiling * q : 0;
  const timeNormalizedZ = z - cost + bonus;
  return { ...e, z, cost, bonus, timeNormalizedZ };
});

results.sort((a, b) => b.timeNormalizedZ - a.timeNormalizedZ);

console.log(`\nRound: ${paperId}  |  n=${n}  mean=${mean.toFixed(2)}  stdev=${stdev.toFixed(2)}  extension-uptake q=${(q * 100).toFixed(0)}%\n`);
console.log(
  ['rank', 'userId', 'displayName', 'raw', 'blocks', 'z', 'cost', 'bonus', 'timeNormZ']
    .map((h) => h.padEnd(12)).join('')
);
results.forEach((r, i) => {
  console.log(
    [
      String(i + 1), r.userId, r.displayName || '', String(r.rawScore), String(r.blocksUsed),
      r.z.toFixed(3), r.cost.toFixed(3), r.bonus.toFixed(3), r.timeNormalizedZ.toFixed(3)
    ].map((v) => String(v).padEnd(12)).join('')
  );
});

const seasonYear = seasonYearArg || '';
const seasonWeight = seasonWeightArg || '';
console.log('\nCSV (season_year,round_id,user_id,raw_score,z_score,time_normalized_z,season_weight):');
console.log('season_year,round_id,user_id,raw_score,z_score,time_normalized_z,season_weight');
results.forEach((r) => {
  console.log([seasonYear, paperId, r.userId, r.rawScore, r.z.toFixed(4), r.timeNormalizedZ.toFixed(4), seasonWeight].join(','));
});
console.log('\n(placement/score_label/season/awarded_at still need filling in by hand, as before.)\n');
