import { signup, sync, poll } from '../lib.mjs';
export const title = 'Sécurité : aucun contenu piégé (HTML) n\'est exécuté';
export default async T => {
  const X = '<img src=x onerror=__x()>', p = await T.dev('A', { balades: false });
  await p.evaluate(() => { window.__hits = 0; window.__x = () => { window.__hits++; }; });
  await signup(p, 'dylan@test.fr', 'Rezen', 'Dylan', 'Nova');
  const c = await p.evaluate(() => [V.cx, V.cy]), S = T.S, iso = () => new Date().toISOString();
  S.db.users.push({ id: 'u2', email: 'evil@t.fr', pw: 'x', name: X, first: X, dog: X, sp: X, bio: X, role: 'user', confirmed: true, meta: {} });
  S.db.fr.push({ a: 'u2', b: 'u1', st: 'accepted' });
  S.db.pres.set('u2', { st: 'on', walk: true, since: iso(), bal: X, bx: c[0], by: c[1], seen: iso() });
  S.db.groups.push({ id: 'g9-0000', name: X, ic: '<b>i</b>', owner: 'u2', closed: false, ms: [{ u: 'u2', on: true }, { u: 'u1', on: true }] });
  S.db.msgs.push({ id: 1, f: 'u2', to: 'u1', g: null, t: X, m: { kn: X, x: c[0], y: c[1] }, ts: iso() }, { id: 2, f: 'u2', to: null, g: 'g9-0000', t: X, m: null, ts: iso() });
  S.db.events.push({ id: 'e9-0000', owner: 'u2', g: 'g9-0000', bal: X, bx: c[0], by: c[1], pk: X, at: new Date(Date.now() + 864e5).toISOString(), dur: 60, note: X, x: false, gs: [{ u: 'u1', r: '' }] });
  S.db.posts.push({ id: 'x9', author: 'u2', bal: X, bx: c[0], by: c[1], body: X, photo: null, ts: iso(), del: false }); S.db.coms.push({ post: 'x9', author: 'u2', body: X, ts: iso() });
  S.db.trails.set('t9', { id: 't9', data: { name: X, d: '2026-10-20', pts: [[c[0] - .6, c[1]], [c[0] + .6, c[1]]] }, status: 'public', author: 'u2', deleted: false, updated_at: iso() });
  S.db.marks.set('m9', { id: 'm9', data: { t: 'dz', x: c[0] + 20, y: c[1] + 20, note: X, d: '2026-10-27' }, author: 'u2', deleted: false, updated_at: iso() });
  (S.db.revs ||= []).push({ u: 'u2', bx: Math.round(c[0]), by: Math.round(c[1]), name: X, stars: 3, body: X, tags: ['pk'], ts: iso() });
  await p.evaluate(async () => { SOT.busy = false; SOT.bt = 0; await soPoll(); }); await sync(p); await p.waitForTimeout(500);
  const steps = [
    ['Copains', () => socOpen()], ['Messages', () => { SOC.tab = 'ms'; socRender(); }], ['Rendez-vous', () => { SOC.tab = 'ev'; socRender(); }],
    ['Demandes', () => faOpen('req')], ['Conversation', () => { faClose(); chatOpen('u2'); }], ['Groupe', () => { chatClose(); chatOpen('g9-0000'); }],
    ['Fiche groupe', () => { chatClose(); grpOpen('g9-0000'); }], ['Profil', () => { grpClose(); socClose(); pfOpen('u2'); }],
    ['Communauté', () => { pfClose(); comOpen(); }], ['Commentaires', () => cmComments('x9')], ['Recherche', () => { comClose(); srOpen(); $('#srq').value = 'x'; srRender(); }],
    ['Fiche balade', () => { srClose(); const k = Object.keys(D.cells).find(k => rec(D.cells[k])); if (k) select(k); }], ['Repère', () => openMark('m9')], ['Carte', () => draw()],
  ];
  for (const [n, f] of steps) { await p.evaluate(f).catch(e => T.errs.push(n + ' : ' + e.message)); await p.waitForTimeout(400); }
  T.eq(await p.evaluate(() => window.__hits), 0, 'aucun code injecté exécuté (14 écrans)');
};
