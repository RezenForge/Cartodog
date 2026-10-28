// Lance tous les scénarios (ou ceux passés en argument) contre index.html, avec un faux serveur Supabase en mémoire.
// Usage : node tests/run.mjs            → tout
//         node tests/run.mjs recherche  → les scénarios dont le nom contient « recherche »
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { session } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname), f = path.join(root, u === '/' ? 'index.html' : u);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;

const want = process.argv.slice(2), dir = path.join(here, 'scenarios');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mjs')).sort().filter(f => !want.length || want.some(w => f.includes(w)));
let fail = 0; const t0 = Date.now();
for (const f of files) {
  const mod = await import(path.join(dir, f)), T = await session(base, f), s0 = Date.now(); let crash = null;
  try { await mod.default(T); } catch (e) { crash = e; }
  await T.close().catch(() => {});
  const bad = T.checks.filter(c => !c.ok), errs = T.errs;
  const ok = !crash && !bad.length && !errs.length; if (!ok) fail++;
  console.log(`${ok ? '✅' : '❌'} ${f.replace('.mjs', '')} · ${mod.title || ''} (${T.checks.length} vérifications, ${((Date.now() - s0) / 1000).toFixed(1)} s)`);
  bad.forEach(c => console.log(`   ✗ ${c.label}${c.info ? ' — ' + c.info : ''}`));
  errs.forEach(e => console.log('   ✗ erreur JavaScript : ' + e.split('\n')[0]));
  if (crash) console.log('   ✗ arrêt : ' + String(crash.message || crash).split('\n')[0]);
}
server.close();
console.log(`\n${files.length - fail}/${files.length} scénarios réussis en ${Math.round((Date.now() - t0) / 1000)} s`);
process.exit(fail ? 1 : 0);
