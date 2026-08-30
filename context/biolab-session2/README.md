# BiOLab Session 2 -- reference-card calibration validation

Validation checkpoint, not production code. Goal: find out whether a
reference-card-based delta calibration gives consistent-enough readings
across real phones/lighting for BiOLab to be worth building further.
Builds on `supabase/migrations/015_biolab_schema.sql` and
`016_biolab_public_photos.sql` (Session 1 -- schema/RLS only, read those
first).

## Status

- [x] Reference card design, grounded in literature review
- [x] Browser capture/analysis harness, built and self-tested against
      synthetic images
- [x] Supabase Edge Function, ported 1:1 from the harness's logic
- [ ] **Real multi-phone/lighting test data** -- pending. Everything below
      the "Real-device results" heading is a placeholder until that comes
      back. Nothing in this repo should be treated as validated until then.

## Why a printed multi-patch card, not a single white patch or tube-only

The brief flagged this as ambiguous enough to not decide unilaterally, and
asked for a literature-grounded decision rather than a guess. Search terms
and sources are listed at the bottom. Findings that shaped the design:

- **A single white/gray reference patch is explicitly reported as
  insufficient** in the HueDx paper (PLOS ONE / PMC11451979) -- they tested
  it and found a multi-patch card necessary for robust correction across
  illumination conditions.
- Multiple independent groups (HueDx; the Spyder Checkr 24 smartphone
  color-coating paper, MDPI 2025; the RGB gamut-limitations paper, PMC12528221)
  converge on **printed reference card + patch-based correction** as the
  standard approach, not on relying on an in-scene object like a control
  tube for lighting correction. I did not find any paper using a
  blank/control tube as the *lighting* reference (as opposed to the assay's
  own chemical zero-point, which is a different, legitimate use).
- However, those papers' cards are professionally manufactured with
  spectrophotometer-measured "true" Lab values per patch (X-Rite ColorChecker,
  Datacolor Spyder Checkr, custom vinyl stickers) -- their color-correction
  matrices depend on knowing that ground truth. **A student's home
  inkjet/laser printout has no such ground truth**: the printer's idea of
  "white" or "50% gray" is unknown and will vary printer-to-printer. Copying
  their approach directly (e.g. a 24-patch ColorChecker-style card) would
  be building on an assumption we can't actually satisfy at home.

**Resolution:** use a card whose patches only need to be *spectrally
neutral* (true gray/white/black), not colorimetrically known -- this is
the classic gray-card / 2-point white-balance technique, which doesn't
require a lab-measured reference and is exactly what jsonb field
`reference_white_rgb` in the Session 1 seed row already implies. The v1
card (`reference-card.html`) has 4 patches -- white, light gray, mid gray,
black -- instead of one: white+black anchor a per-channel linear
normalization (`(raw - black) / (white - black)`), and the two gray steps
are a free linearity sanity check (do they land near the expected 0.75/0.5
after normalization? see `linearity_error` in the output), not used in the
delta calculation itself.

The card *also* keeps the blank/negative-control tube in frame, used for
its own distinct purpose: the assay's chemical zero-point. `delta_r/g/b`
is `normalize(sample_tube) - normalize(blank_tube)`, i.e. both mechanisms
from the original prompt are used together for what each is actually good
for, rather than picked as competing alternatives.

Sources (search queries and fetches run this session):
- [HueDx color correction system, PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0311343) -- multi-patch necessity, ΔE precision numbers
- [HueDx, PMC11451979](https://pmc.ncbi.nlm.nih.gov/articles/PMC11451979/)
- [RGB color correction and gamut limitations in smartphone-based kinetic analysis, PMC12528221](https://pmc.ncbi.nlm.nih.gov/articles/PMC12528221/) -- Spyder Checkr 24 card, 3x3 correction matrix, ΔE before/after
- [Smartphones as portable tools for color determination using a colorimetric calibration card, MDPI 2025](https://www.mdpi.com/2079-6412/15/12/1411)
- [A Smartphone-Based Automatic Measurement Method for Colorimetric pH Detection](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5539506/)
- [A novel systems solution for accurate colorimetric measurement through smartphone AR, PMC10270580](https://pmc.ncbi.nlm.nih.gov/articles/PMC10270580/)

## Card design (`reference-card.html`)

A4-landscape printable page, 180mm x 100mm card: 4 black corner fiducials
(12mm squares, for auto-detection), a row of 4 grayscale patches, two
dashed tube slots (SAMPLE / BLANK). Print at 100% scale -- see the page's
own on-screen instructions. All patch/tube positions are hardcoded as UV
fractions (relative to the fiducial centers) in both the harness and the
edge function; if this layout changes, both must change with it.

## Capture harness (`capture-harness.html`, published as a Claude Artifact)

Deliberately **does not use `getUserMedia`** -- a live camera preview
inside a sandboxed Artifact iframe has uncertain permissions-policy
behavior I couldn't verify without a real device in the loop, and getting
it wrong would have wasted a test session. Instead it uses
`<input type="file" accept="image/*" capture="environment">`, which opens
the phone's native camera app via the OS picker on mobile browsers and
returns a normal file -- no `getUserMedia` permission prompt involved, no
sandbox risk, works the same everywhere.

Pipeline (vanilla JS, no CV/ML libraries):
1. Search a small window around each of the 4 expected corner positions
   for the darkest small square (the fiducials) -- tolerates imperfect
   framing within ~9% of frame width, and produces a 0-100 confidence
   score per corner from how much darker the found square is than its
   surround.
2. Bilinear-interpolate the 4 found corners to locate each patch/tube's
   expected pixel position, average a small pixel neighborhood there.
3. Per-channel 2-point normalize sample and blank tube readings against
   the white/black patches; `delta_r/g/b` = normalized sample minus
   normalized blank, scaled back to a 0-255-ish range to match the
   Session 1 seed row's units.
4. Log every capture (with a user-entered condition/device label) in an
   on-page table; "Copy full JSON" / "Copy summary CSV" buttons copy the
   whole log to the clipboard for pasting back into chat -- there is no
   server round-trip in this harness, deliberately, so it works without
   any deployed backend.

### Self-test (synthetic images, not real devices)

Before asking for real device time, I generated synthetic card images in
the browser (known "true" patch colors, then applied a simulated affine
lighting transform -- per-channel gain + offset, the same shape as a real
camera's white-balance/exposure response) and ran them through the exact
same `processImage()` function the harness uses. This validates the
geometry and math are bug-free; it does **not** validate real-world
camera/lighting behavior (see Known limits below) -- that's what the
pending real-device test is for.

Results (`delta_r, delta_g, delta_b` on the harness's 0-255-ish scale;
true/expected value under neutral light was -91, -170, -85):

| condition | gain | offset | delta_r | delta_g | delta_b |
|---|---|---|---|---|---|
| neutral | (1,1,1) | (0,0,0) | -91 | -170 | -85 |
| mild warm | (1.05,0.98,0.85) | (0,0,-5) | -92 | -170 | -85 |
| mild cool | (0.90,0.97,1.08) | (0,0,0) | -90 | -169 | -89 |
| moderate dim (50% brightness) | (0.5,0.5,0.5) | (0,0,0) | -90 | -169 | -86 |
| moderate warm | (0.95,0.90,0.70) | (5,0,-15) | -91 | -170 | -86 |

Across all non-clipping conditions, delta stayed within +/-4 of the
neutral-light value -- confirms the 2-point normalization algebraically
cancels any affine lighting transform (proof: white/black anchors scale by
the same gain, so gain cancels in the normalization ratio; offset cancels
in the subtraction), exactly as the delta-based approach is supposed to.

**Known limit found by the same test:** when a lighting condition pushes
the *white patch* itself into sensor/channel saturation (a bright,
warm-shifted condition drove the white patch's R channel to clip at 255),
delta shifted by up to 42 units -- because the white anchor itself is no
longer a valid measurement once clipped, the "gain cancels" proof no
longer holds (clamping is non-linear). This is a real, structural
limitation of the method, not a bug: any patch-based white-balance
approach breaks down under overexposure of the reference patch. It's the
reason the card's own instructions warn against strong direct light hitting
the card, but a home capture under bright light could still trigger it in
practice -- worth specifically checking for in the real-device test.

The quality gate (corner-detection confidence) was also verified to
correctly degrade -- a card shifted 12%+ outside the expected frame
position dropped corner confidence from 100 to <30 and flagged the capture
"poor" rather than silently returning a plausible-looking wrong answer.

## Edge Function (`supabase/functions/biolab-calibrate-delta/index.ts`)

Server-side port of the identical algorithm (Deno + the `imagescript`
library for JPEG/PNG decoding, no native deps -- should run on Supabase's
Edge Runtime as-is). **Not deployed and not independently tested** -- this
session had no Supabase CLI installed and no project credentials
(`.env` doesn't exist locally, no `supabase/config.toml`, no project
link). If the harness's client-side math and this file ever drift, treat
the harness as the validated one and re-port. To deploy once credentials
exist: `supabase functions deploy biolab-calibrate-delta`.

## Real-device results

*(pending -- to be filled in once phone/lighting test data comes back)*

## Verdict

*(pending)*

## Open items for later sessions

- Serving captured images back to viewers (signed URL vs. live-RLS) is
  explicitly out of scope here per the brief -- this prototype doesn't
  upload to Storage at all, it stays entirely client-side.
- If real-device testing confirms the white-patch-clipping failure mode
  matters in practice, Session 3+ should consider auto-exposure-lock
  guidance or a captured-image clipping check (reject/warn if any patch
  channel reads 250+) before it ever reaches the delta math.
- `capture_conditions` is kept as the pre-existing free-text field per the
  Session 1 shape; the harness populates it from the user's own text label
  rather than inventing a structured format, since Session 1's seed row
  used a plain sentence.
