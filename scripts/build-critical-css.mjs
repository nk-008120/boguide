import puppeteer from 'puppeteer-core';
import postcss from 'postcss';
import fs from 'node:fs';

const base = process.env.BASE_URL || 'http://localhost:1399';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const out = process.argv[2] || 'critical.css';
const pages = (process.env.PAGES || '').split(',').filter(Boolean);
const viewports = [{ width: 412, height: 823, isMobile: true }, { width: 1280, height: 800 }];
const schemes = ['light', 'dark'];

const stateStrip = /:(?:hover|focus|focus-visible|focus-within|active|visited|target|link|any-link|-webkit-[\w-]+|-moz-[\w-]+)(?![\w-])/g;
const elemStrip = /::?(?:before|after|first-line|first-letter)(?![\w-])|::[\w-]+(?:\([^)]*\))?/g;

function splitSelectors(sel) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of sel) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function normalise(s) {
  let r = s.replace(elemStrip, '').replace(stateStrip, '').trim();
  r = r.replace(/(^|[\s>+~(,])$/, '$1*');
  return r || '*';
}

const css = await (async () => {
  const html = await (await fetch(base + '/')).text();
  const hrefs = [...html.matchAll(/<link[^>]+href="([^"]*css\/compiled\/main[^"]*)"[^>]*>/g)].map(m => m[1]);
  if (!hrefs.length) throw new Error('main css link not found');
  const href = hrefs[0];
  return await (await fetch(new URL(href, base).href)).text();
})();

const root = postcss.parse(css);
const candidates = new Set();
root.walkRules(rule => {
  if (rule.parent && rule.parent.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return;
  for (const s of splitSelectors(rule.selector)) candidates.add(normalise(s));
});
const candList = [...candidates];

const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox'] });
const matched = new Set();
let runs = 0;
for (const vp of viewports) {
  for (const scheme of schemes) {
    for (const url of pages) {
      const p = await browser.newPage();
      await p.setCacheEnabled(false);
      await p.setViewport({ deviceScaleFactor: 1, ...vp });
      await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
      try {
        const res = await p.goto(base + url, { waitUntil: 'load', timeout: 45000 });
        if (!res || res.status() !== 200) { console.error('status', url, res && res.status()); await p.close(); continue; }
        await new Promise(r => setTimeout(r, 1200));
        const hits = await p.evaluate((list) => {
          const vh = window.innerHeight;
          const els = [document.documentElement, ...document.querySelectorAll('*')].filter(e => {
            if (e === document.documentElement || e === document.body) return true;
            if (e.getClientRects().length === 0) return true;
            const pos = getComputedStyle(e).position;
            if (pos === 'fixed' || pos === 'sticky') return true;
            return e.getBoundingClientRect().top < vh;
          });
          const out = [];
          for (let i = 0; i < list.length; i++) {
            try {
              for (const e of els) { if (e.matches(list[i])) { out.push(i); break; } }
            } catch (err) { out.push(i); }
          }
          return out;
        }, candList);
        for (const i of hits) matched.add(candList[i]);
        runs++;
      } catch (e) { console.error('skip', url, vp.width, scheme, String(e.message).slice(0, 120)); }
      await p.close();
    }
  }
}
await browser.close();

const layerOrder = [];
root.walkAtRules('layer', at => {
  for (const n of at.params.split(',').map(s => s.trim()).filter(Boolean)) if (!layerOrder.includes(n)) layerOrder.push(n);
});

function keep(rule) {
  return splitSelectors(rule.selector).some(s => matched.has(normalise(s)));
}

const clone = root.clone();
clone.walkRules(rule => {
  if (rule.parent && rule.parent.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return;
  if (!keep(rule)) rule.remove();
});
let changed = true;
while (changed) {
  changed = false;
  clone.walkAtRules(at => {
    if (['media', 'supports', 'layer', 'container', 'scope'].includes(at.name) && at.nodes && at.nodes.length === 0) { at.remove(); changed = true; }
    if (at.name === 'layer' && !at.nodes) { at.remove(); changed = true; }
  });
}
const keptText = clone.toString();
const bodyText = clone.toString();
clone.walkAtRules(at => {
  if (/keyframes$/.test(at.name)) {
    const name = at.params.trim();
    const body = bodyText.replace(at.toString(), '');
    const re = new RegExp(String.raw`(^|[^\w-])` + name.replace(/[^\w-]/g, '') + String.raw`([^\w-]|$)`);
    if (!re.test(body.replace(/@keyframes[^{]*\{/g, ''))) at.remove();
  }
});
clone.walkAtRules('font-face', at => at.remove());

const header = layerOrder.length ? '@layer ' + layerOrder.join(',') + ';\n' : '';
const result = header + clone.toString();
fs.writeFileSync(out, result);
console.log(JSON.stringify({ runs, candidates: candList.length, matched: matched.size, originalBytes: css.length, criticalBytes: result.length, layerOrder }));
