// Local verification of supabase/functions/biolab-calibrate-delta/index.ts's
// ALGORITHM, run for real against the exact imagescript version (1.2.17)
// the edge function pins -- not reasoned about, actually executed.
//
// Why this exists: the edge function is NOT deployed (no Supabase CLI
// credentials in this dev environment -- see context/biolab-session2/README.md
// and this session's own report). Session 2 already proved the underlying
// 2-point normalization math algebraically and validated it client-side
// against synthetic images (capture-harness.html's self-test). What that
// self-test could NOT exercise is this file's own port: real image
// encode -> Image.decode() -> resize -> corner search -> bilinear patch
// sampling, using imagescript's actual RGBA layout and API, not a canvas
// ImageData array. This script builds synthetic reference-card images with
// imagescript itself, round-trips them through JPEG encode/decode (so real
// compression noise is present, unlike Session 2's uncompressed canvas
// test), and runs the SAME functions copied verbatim from index.ts.
//
// This is a substitute for real-device + real-deployment testing, not
// equivalent to it -- it cannot validate a real phone camera's JPEG
// encoder, sensor response, or the deployed Edge Runtime environment
// itself. Flagged as such in the session report.

const { Image } = require('imagescript');

// ---- verbatim from supabase/functions/biolab-calibrate-delta/index.ts ----

const UV = {
  white: { u: 0.1614, v: 0.2756 },
  lgray: { u: 0.3871, v: 0.2756 },
  mgray: { u: 0.6128, v: 0.2756 },
  black: { u: 0.8386, v: 0.2756 },
  sample: { u: 0.1392, v: 0.8205 },
  blank: { u: 0.5570, v: 0.8205 },
};
const EXPECTED = {
  tl: { x: 0.10, y: 0.14 },
  tr: { x: 0.90, y: 0.14 },
  bl: { x: 0.10, y: 0.86 },
  br: { x: 0.90, y: 0.86 },
};
const SEARCH_FRAC = 0.09;
const FIDUCIAL_MM = 12;
const CARD_W_MM = 180;

function clamp01(v) { return Math.max(0, Math.min(1, v)); }

function makeSampler(img) {
  const w = img.width, h = img.height;
  const data = img.bitmap;
  return {
    w, h,
    at(x, y) {
      const xi = Math.max(0, Math.min(w - 1, Math.round(x)));
      const yi = Math.max(0, Math.min(h - 1, Math.round(y)));
      const idx = (yi * w + xi) * 4;
      return { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
    },
  };
}

function avgBox(sampler, cx, cy, halfSize) {
  const { w, h } = sampler;
  const x0 = Math.max(0, Math.round(cx - halfSize)), x1 = Math.min(w - 1, Math.round(cx + halfSize));
  const y0 = Math.max(0, Math.round(cy - halfSize)), y1 = Math.min(h - 1, Math.round(cy + halfSize));
  let sr = 0, sg = 0, sb = 0, n = 0;
  const stride = Math.max(1, Math.round((x1 - x0) / 24));
  for (let y = y0; y <= y1; y += stride) {
    for (let x = x0; x <= x1; x += stride) {
      const p = sampler.at(x, y);
      sr += p.r; sg += p.g; sb += p.b; n++;
    }
  }
  if (n === 0) n = 1;
  return { r: sr / n, g: sg / n, b: sb / n, x: cx, y: cy };
}

function findDarkSquare(sampler, seedX, seedY, windowPx, boxPx) {
  const half = boxPx * 0.4;
  const step = Math.max(2, Math.round(windowPx / 22));
  const { w, h } = sampler;
  let bestLum = Infinity, bestX = seedX, bestY = seedY;
  for (let dy = -windowPx; dy <= windowPx; dy += step) {
    for (let dx = -windowPx; dx <= windowPx; dx += step) {
      const cx = seedX + dx, cy = seedY + dy;
      if (cx - half < 0 || cy - half < 0 || cx + half >= w || cy + half >= h) continue;
      const box = avgBox(sampler, cx, cy, half);
      const lum = 0.299 * box.r + 0.587 * box.g + 0.114 * box.b;
      if (lum < bestLum) { bestLum = lum; bestX = cx; bestY = cy; }
    }
  }
  const ring = [
    avgBox(sampler, seedX - windowPx, seedY, half),
    avgBox(sampler, seedX + windowPx, seedY, half),
    avgBox(sampler, seedX, seedY - windowPx, half),
    avgBox(sampler, seedX, seedY + windowPx, half),
  ];
  const bgLum = ring.reduce((s, p) => s + 0.299 * p.r + 0.587 * p.g + 0.114 * p.b, 0) / ring.length;
  const contrast = Math.max(0, bgLum - bestLum);
  const quality = Math.max(0, Math.min(100, (contrast / 120) * 100));
  return { pos: { x: bestX, y: bestY }, quality };
}

function bilerp(corners, u, v) {
  const { tl, tr, bl, br } = corners;
  return {
    x: tl.x * (1 - u) * (1 - v) + tr.x * u * (1 - v) + bl.x * (1 - u) * v + br.x * u * v,
    y: tl.y * (1 - u) * (1 - v) + tr.y * u * (1 - v) + bl.y * (1 - u) * v + br.y * u * v,
  };
}

// runCalibration(decoded imagescript Image) -> same shape as the edge function's response
function runCalibration(decoded) {
  const MAX_DIM = 1600;
  if (Math.max(decoded.width, decoded.height) > MAX_DIM) {
    const scale = MAX_DIM / Math.max(decoded.width, decoded.height);
    decoded = decoded.resize(Math.round(decoded.width * scale), Math.round(decoded.height * scale));
  }
  const sampler = makeSampler(decoded);
  const { w, h } = sampler;

  const fiducialPxGuess = Math.max(8, (FIDUCIAL_MM / CARD_W_MM) * (w * 0.8));
  const corners = {};
  const cornerQuality = {};
  for (const name of ['tl', 'tr', 'bl', 'br']) {
    const seed = EXPECTED[name];
    const found = findDarkSquare(sampler, seed.x * w, seed.y * h, SEARCH_FRAC * w, fiducialPxGuess);
    corners[name] = found.pos;
    cornerQuality[name] = found.quality;
  }
  const minQuality = Math.min(...Object.values(cornerQuality));
  const quality = minQuality > 60 ? 'good' : minQuality > 30 ? 'marginal' : 'poor';

  const sampleBoxPx = Math.max(4, fiducialPxGuess * 0.35);
  const readings = {};
  for (const key of Object.keys(UV)) {
    const p = bilerp(corners, UV[key].u, UV[key].v);
    readings[key] = avgBox(sampler, p.x, p.y, sampleBoxPx);
  }

  function norm(rgb) {
    return {
      r: clamp01((rgb.r - readings.black.r) / (readings.white.r - readings.black.r)),
      g: clamp01((rgb.g - readings.black.g) / (readings.white.g - readings.black.g)),
      b: clamp01((rgb.b - readings.black.b) / (readings.white.b - readings.black.b)),
    };
  }
  const sampleNorm = norm(readings.sample);
  const blankNorm = norm(readings.blank);
  const delta = {
    r: sampleNorm.r - blankNorm.r,
    g: sampleNorm.g - blankNorm.g,
    b: sampleNorm.b - blankNorm.b,
  };

  return {
    quality,
    corner_quality: cornerQuality,
    calibration_inputs: {
      delta_r: Math.round(delta.r * 255),
      delta_g: Math.round(delta.g * 255),
      delta_b: Math.round(delta.b * 255),
      reference_white_rgb: [readings.white.r, readings.white.g, readings.white.b].map(Math.round),
    },
  };
}

// ---- synthetic card builder (this test's own code, not from index.ts) ----

const W = 1200, H = 667; // 180mm x 100mm-ish aspect

const TRUE = {
  white: { r: 245, g: 245, b: 245 },
  lgray: { r: 194, g: 194, b: 194 },
  mgray: { r: 132, g: 132, b: 132 },
  black: { r: 12, g: 12, b: 12 },
  sample: { r: 55, g: 22, b: 128 },  // purple-ish Trinder-complex stand-in
  blank: { r: 232, g: 226, b: 214 }, // near-white/no-color
  bg: { r: 250, g: 250, b: 248 },
};

function applyLighting(rgb, gain, offset) {
  return {
    r: Math.max(0, Math.min(255, Math.round(rgb.r * gain[0] + offset[0]))),
    g: Math.max(0, Math.min(255, Math.round(rgb.g * gain[1] + offset[1]))),
    b: Math.max(0, Math.min(255, Math.round(rgb.b * gain[2] + offset[2]))),
  };
}

async function buildCard(gain, offset) {
  const img = new Image(W, H);
  const bg = applyLighting(TRUE.bg, gain, offset);
  img.fill(Image.rgbToColor(bg.r, bg.g, bg.b));

  const fidPx = Math.round((FIDUCIAL_MM / CARD_W_MM) * W * 0.8);
  const black = applyLighting(TRUE.black, gain, offset);
  for (const name of ['tl', 'tr', 'bl', 'br']) {
    const cx = Math.round(EXPECTED[name].x * W), cy = Math.round(EXPECTED[name].y * H);
    img.drawBox(cx - fidPx / 2, cy - fidPx / 2, fidPx, fidPx, Image.rgbToColor(black.r, black.g, black.b));
  }

  const corners = {
    tl: { x: EXPECTED.tl.x * W, y: EXPECTED.tl.y * H },
    tr: { x: EXPECTED.tr.x * W, y: EXPECTED.tr.y * H },
    bl: { x: EXPECTED.bl.x * W, y: EXPECTED.bl.y * H },
    br: { x: EXPECTED.br.x * W, y: EXPECTED.br.y * H },
  };
  const patchPx = Math.round(fidPx * 1.6);
  for (const key of Object.keys(UV)) {
    const p = bilerp(corners, UV[key].u, UV[key].v);
    const c = applyLighting(TRUE[key], gain, offset);
    img.drawBox(p.x - patchPx / 2, p.y - patchPx / 2, patchPx, patchPx, Image.rgbToColor(c.r, c.g, c.b));
  }

  return await img.encodeJPEG(92);
}

const CONDITIONS = [
  { name: 'neutral',        gain: [1, 1, 1],          offset: [0, 0, 0] },
  { name: 'mild warm',      gain: [1.05, 0.98, 0.85],  offset: [0, 0, -5] },
  { name: 'mild cool',      gain: [0.90, 0.97, 1.08],  offset: [0, 0, 0] },
  { name: 'moderate dim',   gain: [0.6, 0.6, 0.6],     offset: [0, 0, 0] },
  { name: 'moderate warm',  gain: [0.95, 0.90, 0.75],  offset: [5, 0, -12] },
];

async function main() {
  console.log('Local port-verification of biolab-calibrate-delta/index.ts');
  console.log('(imagescript@1.2.17, the exact version the edge function pins -- via npm, not deno.land)\n');

  const results = [];
  let baselineDelta = null;
  let failures = 0;

  for (const cond of CONDITIONS) {
    const jpegBytes = await buildCard(cond.gain, cond.offset);
    const decoded = await Image.decode(jpegBytes);
    const out = runCalibration(decoded);
    const d = out.calibration_inputs;
    results.push({ cond: cond.name, quality: out.quality, delta_r: d.delta_r, delta_g: d.delta_g, delta_b: d.delta_b });
    if (cond.name === 'neutral') baselineDelta = d;
    console.log(
      cond.name.padEnd(16) +
      ' quality=' + out.quality.padEnd(8) +
      ' delta_r=' + String(d.delta_r).padStart(4) +
      ' delta_g=' + String(d.delta_g).padStart(4) +
      ' delta_b=' + String(d.delta_b).padStart(4)
    );
  }

  console.log('\n--- checks ---');
  for (const r of results) {
    if (r.cond === 'neutral') continue;
    const dr = Math.abs(r.delta_r - baselineDelta.delta_r);
    const dg = Math.abs(r.delta_g - baselineDelta.delta_g);
    const db = Math.abs(r.delta_b - baselineDelta.delta_b);
    const within = dr <= 10 && dg <= 10 && db <= 10; // looser than Session 2's +/-4 -- JPEG compression adds real noise a canvas test didn't have
    console.log((within ? 'PASS' : 'FAIL') + ' -- ' + r.cond + ' stays within +/-10 of neutral (actual: ' + dr + ',' + dg + ',' + db + ')');
    if (!within) failures++;
    if (r.quality !== 'good') { console.log('  note: corner quality degraded to ' + r.quality); }
  }

  // Misframed-card quality gate check (mirrors Session 2's harness self-test)
  console.log('\n--- quality gate on a badly-misframed capture ---');
  const img2 = new Image(W, H);
  img2.fill(Image.rgbToColor(TRUE.bg.r, TRUE.bg.g, TRUE.bg.b));
  // Only draw 2 of 4 fiducials, and shift them, to simulate a bad capture.
  img2.drawBox(30, 30, 40, 40, Image.rgbToColor(12, 12, 12));
  const badBytes = await img2.encodeJPEG(92);
  const badDecoded = await Image.decode(badBytes);
  const badOut = runCalibration(badDecoded);
  const gateOk = badOut.quality === 'poor';
  console.log((gateOk ? 'PASS' : 'FAIL') + ' -- a badly-misframed/blank capture is flagged "poor", not silently returned as a plausible reading (actual: ' + badOut.quality + ')');
  if (!gateOk) failures++;

  console.log('\n' + (failures === 0
    ? 'ALL LOCAL PORT CHECKS PASSED. Still NOT deployed / NOT tested against a real device photo or the live Edge Runtime -- see this session\'s report.'
    : failures + ' CHECK(S) FAILED.'));
  if (failures > 0) process.exit(1);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
