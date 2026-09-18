import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const REPO_ROOT = path.resolve(__dirname, '../..');

const { componentIsCorrect, autoGrade, extensionPenalty, seededShuffle } =
  require(path.join(REPO_ROOT, 'api/_lib/bioclash.js'));
const { recompute } = require(path.join(REPO_ROOT, 'api/submit-attempt.js'));

let failures = 0;
function check(name, cond) {
  console.log((cond ? 'PASS' : 'FAIL') + ' -- ' + name);
  if (!cond) failures++;
}

console.log('--- componentIsCorrect ---');

check('mcq: matching correctKey is correct',
  componentIsCorrect({ type: 'mcq', correctKey: 'b' }, 'b') === true);
check('mcq: non-matching key is incorrect',
  componentIsCorrect({ type: 'mcq', correctKey: 'b' }, 'a') === false);

check('true_false: matching correctValue is correct',
  componentIsCorrect({ type: 'true_false', correctValue: true }, true) === true);
check('true_false: mismatching value is incorrect',
  componentIsCorrect({ type: 'true_false', correctValue: true }, false) === false);

check('numeric: exact match with no tolerance is correct',
  componentIsCorrect({ type: 'numeric', expected: 5 }, 5) === true);
check('numeric: within tolerance is correct',
  componentIsCorrect({ type: 'numeric', expected: 5, tolerance: 0.5 }, 5.4) === true);
check('numeric: exactly at the tolerance boundary is correct',
  componentIsCorrect({ type: 'numeric', expected: 5, tolerance: 0.5 }, 5.5) === true);
check('numeric: just outside tolerance is incorrect',
  componentIsCorrect({ type: 'numeric', expected: 5, tolerance: 0.5 }, 5.51) === false);
check('numeric: a numeric-looking string is leniently converted and graded',
  componentIsCorrect({ type: 'numeric', expected: 5 }, '5') === true);
check('numeric: a non-numeric string is incorrect, not a thrown error',
  componentIsCorrect({ type: 'numeric', expected: 5 }, 'abc') === false);

check('undefined submission is always incorrect regardless of type',
  componentIsCorrect({ type: 'mcq', correctKey: 'a' }, undefined) === false);
check('null submission is always incorrect regardless of type',
  componentIsCorrect({ type: 'true_false', correctValue: true }, null) === false);

check('an ungradable component type (free_text_for_others) returns null, not false',
  componentIsCorrect({ type: 'free_text_for_others' }, 'anything') === null);

console.log('\n--- autoGrade ---');

const paper = {
  parts: [{
    id: 'part1',
    name: 'Part 1',
    blocks: [
      {
        id: 'blockA',
        type: 'question',
        components: [
          { key: 'q1', type: 'mcq', correctKey: 'b' },
          { key: 'q2', type: 'true_false', correctValue: true },
          { key: 'q3', type: 'numeric', expected: 10, tolerance: 1, marks: 3 }
        ]
      },
      {
        id: 'blockB',
        type: 'question',
        components: [
          { key: 'q4', type: 'free_text_for_others', refersTo: 'q1', marksEach: 2 }
        ]
      },
      { id: 'blockC', type: 'reveal_content', content: 'explanation text' }
    ]
  }]
};

const fullyCorrectRows = [
  { block_id: 'blockA', answer: { q1: 'b', q2: true, q3: 10.4 } },
  { block_id: 'blockB', answer: { q4: 'some free text' } },
  { block_id: 'blockC', answer: {} },
  { block_id: 'nonexistent-block', answer: { x: 1 } }
];

const resultFull = autoGrade(paper, fullyCorrectRows);
check('correct mcq/true_false/numeric answers are all counted correct',
  resultFull.autoCorrect === 3 && resultFull.autoTotal === 3);
check('marks accumulate using each component\'s own marks field, defaulting to 1',
  resultFull.autoMarksTotal === 1 + 1 + 3 && resultFull.autoMarksEarned === 1 + 1 + 3);
check('free_text_for_others is excluded from auto-grading totals entirely',
  resultFull.autoTotal === 3);
check('reveal_content blocks contribute nothing to totals',
  resultFull.autoTotal === 3 && resultFull.autoMarksTotal === 5);
check('a row referencing an unknown block_id is silently skipped, not thrown',
  true);

const partiallyWrongRows = [
  { block_id: 'blockA', answer: { q1: 'a', q2: true, q3: 50 } }
];
const resultPartial = autoGrade(paper, partiallyWrongRows);
check('wrong mcq and numeric still count toward totals but not toward earned marks',
  resultPartial.autoTotal === 3 && resultPartial.autoCorrect === 1 &&
  resultPartial.autoMarksTotal === 5 && resultPartial.autoMarksEarned === 1);

const missingAnswerRows = [{ block_id: 'blockA', answer: null }];
const resultMissing = autoGrade(paper, missingAnswerRows);
check('a null/missing answer object is treated as all-wrong, not a thrown error',
  resultMissing.autoTotal === 3 && resultMissing.autoCorrect === 0);

console.log('\n--- extensionPenalty ---');

const seasonPaper = { extensionCostSchedule: [0.10, 0.20, 0.35] };
check('0 blocks used costs nothing',
  extensionPenalty(seasonPaper, 0) === 0);
check('1 block used costs the first schedule entry (10%)',
  Math.abs(extensionPenalty(seasonPaper, 1) - 0.10) < 1e-9);
check('3 blocks used costs the full cumulative 65%, not a flat per-block rate',
  Math.abs(extensionPenalty(seasonPaper, 3) - 0.65) < 1e-9);
check('requesting more blocks than the schedule defines does not throw or overcount',
  Math.abs(extensionPenalty(seasonPaper, 10) - 0.65) < 1e-9);
check('a paper with no extensionCostSchedule always costs 0',
  extensionPenalty({}, 5) === 0);

console.log('\n--- seededShuffle ---');

const items = Array.from({ length: 10 }, (_, i) => i);

check('the same seed produces the exact same order every time',
  JSON.stringify(seededShuffle(items, 'user-1:paper-a')) === JSON.stringify(seededShuffle(items, 'user-1:paper-a')));

const orderA = seededShuffle(items, 'user-1:paper-a');
const orderB = seededShuffle(items, 'user-2:paper-a');
check('different seeds produce a different order',
  JSON.stringify(orderA) !== JSON.stringify(orderB));

check('the shuffled result is a permutation of the input, nothing dropped or duplicated',
  JSON.stringify([...orderA].sort((a, b) => a - b)) === JSON.stringify(items));

const original = [1, 2, 3, 4, 5];
const originalCopy = [...original];
seededShuffle(original, 'some-seed');
check('shuffling does not mutate the caller\'s original array',
  JSON.stringify(original) === JSON.stringify(originalCopy));

check('an empty array shuffles to an empty array without throwing',
  JSON.stringify(seededShuffle([], 'seed')) === '[]');
check('a single-element array is returned unchanged',
  JSON.stringify(seededShuffle(['only'], 'seed')) === JSON.stringify(['only']));

console.log('\n--- recompute (BiOrchive papers) ---');

const round = {
  problems: [
    {
      id: 'p1',
      number: 1,
      name: 'Problem 1',
      subjects: [{ name: 'Genetics', link: '/genetics' }, { name: 'Biochemistry', link: '/biochem' }],
      statements: [
        { letter: 'A', answer: true },
        { letter: 'B', answer: false },
        { letter: 'C', type: 'free_response' }
      ]
    },
    {
      id: 'p2',
      number: 2,
      name: 'Problem 2',
      subjects: [{ name: 'Genetics', link: '/genetics' }],
      statements: [
        { letter: 'A', type: 'numeric', expected: 7.5, tolerance: 0.2 }
      ]
    },
    {
      id: 'p3',
      number: 3,
      name: 'Problem 3',
      statements: [
        { letter: 'A', answer: true }
      ]
    }
  ]
};

const fullCreditAnswers = {
  p1: { A: true, B: false, C: 'an essay answer, ungraded' },
  p2: { A: 7.6 },
  p3: { A: true }
};

const rFull = recompute(round, fullCreditAnswers);
check('free_response statements are excluded from totalStatements and perQuestion totals',
  rFull.perQuestion[0].total === 2);
check('correct true_false-style statements count toward totalCorrect',
  rFull.perQuestion[0].correct === 2);
check('a numeric statement within tolerance is correct',
  rFull.perQuestion[1].correct === 1);
check('a statement with no explicit type defaults to gradable true_false-style comparison',
  rFull.perQuestion[2].total === 1);
check('totalStatements sums only gradable statements across all problems (2 + 1 + 1)',
  rFull.totalStatements === 4);
check('totalCorrect sums correctly across problems',
  rFull.totalCorrect === 4);

const stringNumericAnswers = { p1: {}, p2: { A: '7.6' }, p3: {} };
const rStringNumeric = recompute(round, stringNumericAnswers);
check('unlike componentIsCorrect, a numeric-looking STRING is NOT accepted here (strict typeof check)',
  rStringNumeric.perQuestion[1].correct === 0);

const missingQuestionAnswers = { p2: { A: 7.5 } };
const rMissing = recompute(round, missingQuestionAnswers);
check('a question missing entirely from the answers object is scored as all-wrong, not a thrown error',
  rMissing.perQuestion[0].correct === 0 && rMissing.perQuestion[0].total === 2);

check('a two-subject question splits its credit evenly across both subjects',
  Math.abs(rFull.subjectStats.Genetics.correct - (2 / 2 + 1 / 1)) < 1e-9 &&
  Math.abs(rFull.subjectStats.Genetics.total - (2 / 2 + 1 / 1)) < 1e-9);
check('a single-subject question contributes full weight to that subject',
  Math.abs(rFull.subjectStats.Biochemistry.correct - 1) < 1e-9 &&
  Math.abs(rFull.subjectStats.Biochemistry.total - 1) < 1e-9);
check('a question with no subjects at all contributes no subjectStats entry',
  Object.keys(rFull.subjectStats).sort().join(',') === 'Biochemistry,Genetics');

console.log('\n' + (failures === 0
  ? 'ALL CHECKS PASSED against the real, shipped grading functions.'
  : `${failures} CHECK(S) FAILED -- see above.`));
if (failures > 0) process.exit(1);
