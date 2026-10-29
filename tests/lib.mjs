// Outils communs aux scénarios de test : navigateur, faux serveur, comptes, assertions.
import { makeServer } from './fakesb.mjs';

let chromium;
try { ({ chromium } = await import('playwright')); }
catch (e) { ({ chromium } = await import('/opt/npm-tools/node_modules/playwright/index.mjs')); }
export { chromium };

// Une session de test : un faux serveur, un navigateur, des « téléphones » (pages) et une liste de vérifications.
export async function session(base, name) {
  const S = makeServer(), browser = await chromium.launch(), errs = [], checks = [], covPages = [];
  const T = {
    S, browser, errs, checks, base,
    ok(cond, label, info) { checks.push({ ok: !!cond, label, info }); return !!cond; },
    eq(a, b, label) { const ok = JSON.stringify(a) === JSON.stringify(b); checks.push({ ok, label, info: ok ? undefined : `attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)}` }); return ok; },
    async dev(who = 'A', opt = {}) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, ...(opt.ctx || {}) });
      if (opt.welcome !== true) await ctx.addInitScript(() => { const f = () => { const s = document.createElement('style'); s.textContent = '#welm{display:none!important}'; document.documentElement.appendChild(s); }; if (document.documentElement) f(); else document.addEventListener('DOMContentLoaded', f); });
      const p = await ctx.newPage();
      if (process.env.COV) { await p.coverage.startJSCoverage({ resetOnNavigation: false }); covPages.push(p); }
      p.on('pageerror', e => errs.push(who + ' : ' + e.message));
      p.on('dialog', d => d.accept(d.type() === 'prompt' ? (opt.prompt || '') : undefined));
      await p.route(/open-meteo|geopf|geo\.api|arcgis|wikipedia|fonts\.g/, r => r.abort());
      await p.route(/mrwbpalbpczdkczcoven\.supabase\.co/, r => S.handle(r));
      await p.goto(base + '/index.html'); await p.waitForFunction(() => typeof D === 'object' && typeof sync === 'function');
      await p.waitForTimeout(300);
      if (opt.balades !== false) await seed(p, opt.balades);
      return p;
    },
    async close() {
      if (process.env.COV) { const fs = await import('node:fs'); for (const p of covPages) { try { const c = (await p.coverage.stopJSCoverage()).filter(e => /index\.html/.test(e.url)); fs.mkdirSync(process.env.COV, { recursive: true }); fs.writeFileSync(`${process.env.COV}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.json`, JSON.stringify(c.map(e => ({ src: e.source.length, functions: e.functions })))); } catch (e) {} } }
      await browser.close(); },
  };
  return T;
}

// Balades publiques de démonstration (une balade = un point), à quelques km les unes des autres
export const BALADES = [['Bois du Taillan', 0, 0], ['Parc de Majolan', 1200, 0], ['Jardin public', 2600, 0], ['Parc Bordelais', 4000, 0]];
export async function seed(p, list = BALADES) {
  await p.evaluate(L => { const c = [V.cx, V.cy], k = 1 / cosAt(c[1]);
    L.forEach(([n, ox, oy], i) => { const x = c[0] + ox * k, y = c[1] + oy * k; D.paths.push({ id: 'p' + i, name: n, d: '2026-10-20', pts: [[+(x - .6).toFixed(1), +y.toFixed(1)], [+(x + .6).toFixed(1), +y.toFixed(1)]] }); });
    NG.sig = ''; save(); syncBal(); save(); }, list);
}

export const waitSync = async p => { for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => CLD.busy ? 'busy' : CLD.st); if (st === 'ok' || st === 'err') return st; await p.waitForTimeout(150); } return 'timeout'; };
export const sync = async p => { await p.evaluate(() => sync(true)); return waitSync(p); };
export const poll = p => p.evaluate(async () => { SOT.busy = false; await soPoll(); await new Promise(r => setTimeout(r, 300)); });

export async function signup(p, mail, pseudo, first, dog) {
  await p.evaluate(() => { CLD.mode = 'up'; clUi(); });
  await p.fill('#clfirst', first); await p.fill('#clname', pseudo); await p.fill('#clmail', mail); await p.fill('#clpw', 'motdepasse1');
  await p.check('#clrules'); await p.check('#clterms'); await p.click('#clgo');
  await p.waitForFunction(() => clOn(), null, { timeout: 8000 }); await waitSync(p);
  await p.evaluate(d => { const s = $('#wel [data-ob="skip"]'); if (s) s.click(); if (d) { D.prof.name = d; save(); } }, dog || '');
}
export async function login(p, mail) {
  await p.evaluate(() => { CLD.mode = 'in'; clUi(); }); await p.fill('#clmail', mail); await p.fill('#clpw', 'motdepasse1'); await p.click('#clgo');
  await p.waitForFunction(() => clOn(), null, { timeout: 8000 }); await waitSync(p);
  await p.evaluate(() => { const s = $('#wel [data-ob="skip"]'); if (s) s.click(); });
}
export async function befriend(a, b, handleB) {
  await a.evaluate(h => soRpc('friend_request', { handle: h }), handleB); await poll(b);
  await b.evaluate(async () => { for (const id of SO.rin) await soRpc('friend_respond', { other: id, ok: true }); }); await poll(a); await poll(b);
}
export const cellOf = (p, name) => p.evaluate(n => Object.keys(D.cells).find(k => rec(D.cells[k]) && balName(k) === n), name);

// Une photo JPEG fabriquée dans la page (pas de fichier image dans le dépôt)
export const jpeg = (p, label = 'PHOTO', w = 900, h = 600) => p.evaluate(([t, w, h]) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, w, h);
  gr.addColorStop(0, '#e0a040'); gr.addColorStop(1, '#3a7a2a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = 'bold 90px sans-serif'; g.fillText(t, 60, h / 2); return c.toDataURL('image/jpeg', .85); }, [label, w, h]);
export const jpegBuf = async (p, label) => Buffer.from((await jpeg(p, label)).split(',')[1], 'base64');
