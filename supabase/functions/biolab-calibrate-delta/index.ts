// BiOLab: reference-card delta calibration -- Session 2 validation prototype.
//
// NOT DEPLOYED. No Supabase CLI or project credentials were available in the
// session that wrote this (no supabase/config.toml, no .env, CLI not
// installed) -- see context/biolab-session2/README.md for what was and
// wasn't possible to verify as a result. This file is the server-side port
// of the exact same algorithm implemented client-side in
// context/biolab-session2/capture-harness.html, which WAS run and validated
// (synthetic-image self-test, then real multi-phone/lighting captures --
// see the README for numbers). Port this file's math 1:1 if the two drift;
// don't treat this file as independently tested.
//
// Card geometry (uv positions of each patch/tube, relative to the 4 black
// corner fiducials) matches context/biolab-session2/reference-card.html --
// if that layout changes, these constants must change with it.
//
// Request:  POST { image: "data:image/jpeg;base64,..." }
// Response: 200 { quality, corner_quality, calibration_inputs } | 4xx { error }
// calibration_inputs matches (and additively extends) the jsonb shape
// already seeded in supabase/migrations/015_biolab_schema.sql's
// biolab_reference_results row -- delta_r/delta_g/delta_b, reference_white_rgb,
// capture_conditions are the pre-existing fields; everything else here is new.

import { Image } from "https://deno.land/x/imagescript@1.2.17/mod.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type RGB = { r: number; g: number; b: number };
type Point = { x: number; y: number };

const UV: Record<string, { u: number; v: number }> = {
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

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

// Pixel accessor over a decoded ImageScript bitmap (RGBA packed).
function makeSampler(img: Image) {
  const w = img.width, h = img.height;
  const data = img.bitmap; // Uint8Array/Uint8ClampedArray, RGBA
  return {
    w, h,
    at(x: number, y: number): RGB {
      const xi = Math.max(0, Math.min(w - 1, Math.round(x)));
      const yi = Math.max(0, Math.min(h - 1, Math.round(y)));
      const idx = (yi * w + xi) * 4;
      return { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
    },
  };
}

function avgBox(sampler: ReturnType<typeof makeSampler>, cx: number, cy: number, halfSize: number): RGB & Point {
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

function findDarkSquare(sampler: ReturnType<typeof makeSampler>, seedX: number, seedY: number, windowPx: number, boxPx: number) {
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

function bilerp(corners: Record<"tl" | "tr" | "bl" | "br", Point>, u: number, v: number): Point {
  const { tl, tr, bl, br } = corners;
  return {
    x: tl.x * (1 - u) * (1 - v) + tr.x * u * (1 - v) + bl.x * (1 - u) * v + br.x * u * v,
    y: tl.y * (1 - u) * (1 - v) + tr.y * u * (1 - v) + bl.y * (1 - u) * v + br.y * u * v,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), {
      status: 405, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const dataUrl: string | undefined = body?.image;
    if (!dataUrl || typeof dataUrl !== "string") {
      return new Response(JSON.stringify({ error: "missing image (data URL string)" }), {
        status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }
    const b64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

    let decoded = await Image.decode(bytes);
    const MAX_DIM = 1600;
    if (Math.max(decoded.width, decoded.height) > MAX_DIM) {
      const scale = MAX_DIM / Math.max(decoded.width, decoded.height);
      decoded = decoded.resize(Math.round(decoded.width * scale), Math.round(decoded.height * scale));
    }
    const sampler = makeSampler(decoded);
    const { w, h } = sampler;

    const fiducialPxGuess = Math.max(8, (FIDUCIAL_MM / CARD_W_MM) * (w * 0.8));
    const corners: Record<"tl" | "tr" | "bl" | "br", Point> = {} as never;
    const cornerQuality: Record<string, number> = {};
    for (const name of ["tl", "tr", "bl", "br"] as const) {
      const seed = EXPECTED[name];
      const found = findDarkSquare(sampler, seed.x * w, seed.y * h, SEARCH_FRAC * w, fiducialPxGuess);
      corners[name] = found.pos;
      cornerQuality[name] = found.quality;
    }
    const minQuality = Math.min(...Object.values(cornerQuality));
    const quality = minQuality > 60 ? "good" : minQuality > 30 ? "marginal" : "poor";

    const sampleBoxPx = Math.max(4, fiducialPxGuess * 0.35);
    const readings: Record<string, RGB> = {};
    for (const key of Object.keys(UV)) {
      const p = bilerp(corners, UV[key].u, UV[key].v);
      readings[key] = avgBox(sampler, p.x, p.y, sampleBoxPx);
    }

    function norm(rgb: RGB): RGB {
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
    const lgrayNorm = norm(readings.lgray), mgrayNorm = norm(readings.mgray);
    const linearityError = (
      Math.abs(lgrayNorm.r - 0.75) + Math.abs(lgrayNorm.g - 0.75) + Math.abs(lgrayNorm.b - 0.75) +
      Math.abs(mgrayNorm.r - 0.5) + Math.abs(mgrayNorm.g - 0.5) + Math.abs(mgrayNorm.b - 0.5)
    ) / 6;

    const calibration_inputs = {
      // pre-existing fields (015_biolab_schema.sql seed shape) -- kept in the same units/meaning
      delta_r: Math.round(delta.r * 255),
      delta_g: Math.round(delta.g * 255),
      delta_b: Math.round(delta.b * 255),
      reference_white_rgb: [readings.white.r, readings.white.g, readings.white.b].map(Math.round),
      capture_conditions: body?.capture_conditions ?? null,
      // additive fields -- new in Session 2, don't collide with the seed shape
      reference_black_rgb: [readings.black.r, readings.black.g, readings.black.b].map(Math.round),
      sample_tube_rgb: [readings.sample.r, readings.sample.g, readings.sample.b].map(Math.round),
      blank_tube_rgb: [readings.blank.r, readings.blank.g, readings.blank.b].map(Math.round),
      delta_normalized: delta,
      linearity_error: Math.round(linearityError * 1000) / 1000,
    };

    return new Response(
      JSON.stringify({ quality, corner_quality: cornerQuality, calibration_inputs }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
