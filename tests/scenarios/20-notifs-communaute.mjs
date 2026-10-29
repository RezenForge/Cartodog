// Communauté : « j'aime » et commentaires préviennent l'auteur ; la notification ouvre la publication. + minuteur de balade stable.
import { signup } from '../lib.mjs';
export const title = 'Notifications j\'aime / commentaires, minuteur de balade, plein écran';
export default async T => {
  const A = await T.dev('A'), B = await T.dev('B'), C = await T.dev('C');
  await signup(A, 'a@t.fr', 'Rezen', 'Dylan', 'Nova'); await signup(B, 'b@t.fr', 'lea_33', 'Léa', 'Max'); await signup(C, 'c@t.fr', 'tom_33', 'Tom', 'Rex');
  const ids = {}; for (const [k, p] of [['A', A], ['B', B], ['C', C]]) ids[k] = await p.evaluate(() => CLD.s.user.id);
  const c = await A.evaluate(() => ctr(Object.keys(D.cells).find(k => balName(k) === 'Bois du Taillan')));
  const id = await A.evaluate(([x, y]) => soRpc('post_create', { bal: 'Bois du Taillan', bx: x, by: y, body: 'Nova dans la flaque', photo: null }), c);
  const N = () => (T.S.db.notifs || []).map(n => `${n.t}>${Object.keys(ids).find(k => ids[k] === n.to)}`);
  await B.evaluate(i => soRpc('post_like', { post: i, on: true }), id);
  T.eq(N(), ['like>A'], 'j\'aime : l\'auteur est prévenu');
  await B.evaluate(async i => { await soRpc('post_like', { post: i, on: false }); await soRpc('post_like', { post: i, on: true }); }, id);
  await A.evaluate(i => soRpc('post_like', { post: i, on: true }), id);
  T.eq(N(), ['like>A'], 'pas de 2e notification (re-like, ou j\'aime sur sa propre publication)');
  await B.evaluate(i => soRpc('post_comment', { post: i, body: 'Trop mignon' }), id);
  await C.evaluate(i => soRpc('post_comment', { post: i, body: 'Pareil pour Rex' }), id);
  T.eq(N(), ['like>A', 'com>A', 'com>A', 'com2>B'], 'commentaires : l\'auteur et ceux qui ont déjà commenté');
  T.ok(T.S.db.notifs.every(n => n.url.startsWith('#post=' + id)), 'lien vers la publication');
  // Toucher la notification : Communauté s'ouvre sur la publication, avec ses commentaires
  await A.evaluate(i => pushGo('#post=' + i + ',c'), id); await A.waitForTimeout(800);
  T.ok(await A.evaluate(i => $('#com').classList.contains('open') && !!document.querySelector(`#cmls [data-post="${i}"]`) && !$('#cmsh').hidden && /Rex/.test($('#cmsw').innerText), id), 'la notification ouvre la publication et ses commentaires');
  // Minuteur de balade : la flèche n'est pas recréée chaque seconde (son animation ne boucle plus)
  const same = await A.evaluate(async () => { WK.k = Object.keys(D.cells)[0]; WK.t0 = Date.now() - 5000; wkBtn(); const s1 = $('#found .dkar svg'); WK.t0 -= 2000; wkBtn(); const s2 = $('#found .dkar svg'); const t = $('#found .wkt').textContent; WK.k = null; WK.t0 = 0; wkBtn(); return s1 && s1 === s2 && t; });
  T.ok(same && /0?0:0?7|00:07/.test(same), 'minuteur : seul le chiffre change', String(same));
  // Plein écran : le corps colle à la fenêtre
  T.ok(await A.evaluate(() => { const r = document.body.getBoundingClientRect(); return r.top === 0 && Math.round(r.height) === innerHeight && Math.round(r.width) === innerWidth; }), 'le corps occupe exactement la fenêtre');
};
