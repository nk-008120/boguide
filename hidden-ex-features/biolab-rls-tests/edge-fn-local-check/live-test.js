const { Image } = require('imagescript');

const UV = {
  white: { u: 0.1614, v: 0.2756 }, lgray: { u: 0.3871, v: 0.2756 },
  mgray: { u: 0.6128, v: 0.2756 }, black: { u: 0.8386, v: 0.2756 },
  sample: { u: 0.1392, v: 0.8205 }, blank: { u: 0.5570, v: 0.8205 },
};
const EXPECTED = { tl: {x:0.10,y:0.14}, tr: {x:0.90,y:0.14}, bl: {x:0.10,y:0.86}, br: {x:0.90,y:0.86} };
const FIDUCIAL_MM = 12, CARD_W_MM = 180;
function bilerp(c,u,v){const {tl,tr,bl,br}=c;return{x:tl.x*(1-u)*(1-v)+tr.x*u*(1-v)+bl.x*(1-u)*v+br.x*u*v,y:tl.y*(1-u)*(1-v)+tr.y*u*(1-v)+bl.y*(1-u)*v+br.y*u*v};}
const TRUE = { white:{r:245,g:245,b:245}, lgray:{r:194,g:194,b:194}, mgray:{r:132,g:132,b:132}, black:{r:12,g:12,b:12}, sample:{r:55,g:22,b:128}, blank:{r:232,g:226,b:214}, bg:{r:250,g:250,b:248} };

async function buildCard() {
  const W=1200,H=667;
  const img = new Image(W,H);
  img.fill(Image.rgbToColor(TRUE.bg.r,TRUE.bg.g,TRUE.bg.b));
  const fidPx = Math.round((FIDUCIAL_MM/CARD_W_MM)*W*0.8);
  for (const name of ['tl','tr','bl','br']) {
    const cx = Math.round(EXPECTED[name].x*W), cy = Math.round(EXPECTED[name].y*H);
    img.drawBox(cx-fidPx/2, cy-fidPx/2, fidPx, fidPx, Image.rgbToColor(TRUE.black.r,TRUE.black.g,TRUE.black.b));
  }
  const corners = { tl:{x:EXPECTED.tl.x*W,y:EXPECTED.tl.y*H}, tr:{x:EXPECTED.tr.x*W,y:EXPECTED.tr.y*H}, bl:{x:EXPECTED.bl.x*W,y:EXPECTED.bl.y*H}, br:{x:EXPECTED.br.x*W,y:EXPECTED.br.y*H} };
  const patchPx = Math.round(fidPx*1.6);
  for (const key of Object.keys(UV)) {
    const p = bilerp(corners, UV[key].u, UV[key].v);
    const c = TRUE[key];
    img.drawBox(p.x-patchPx/2, p.y-patchPx/2, patchPx, patchPx, Image.rgbToColor(c.r,c.g,c.b));
  }
  return await img.encodeJPEG(92);
}

async function main() {
  const jpegBytes = await buildCard();
  const b64 = Buffer.from(jpegBytes).toString('base64');
  const dataUrl = 'data:image/jpeg;base64,' + b64;

  const url = process.env.EDGE_URL;
  const anon = process.env.EDGE_ANON;

  console.log('POSTing synthetic card image to live deployed function...');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': anon, 'Authorization': 'Bearer ' + anon },
    body: JSON.stringify({ image: dataUrl, capture_conditions: 'live-deploy-smoke-test' }),
  });
  console.log('HTTP status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
}
main().catch(e => { console.error('FATAL', e); process.exit(1); });
