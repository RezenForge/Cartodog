// Message rapide « 🧭 Ma position » : ma position s'affiche 10 minutes sur la carte du copain.
import { signup, befriend, poll } from '../lib.mjs';
export const title = 'Message rapide « Ma position » visible 10 min sur la carte du copain';
export default async T => {
  const A = await T.dev('A'), B = await T.dev('B');
  await signup(A, 'a@t.fr', 'Rezen', 'Dylan', 'Nova'); await signup(B, 'b@t.fr', 'lea_33', 'Léa', 'Pistache');
  await befriend(A, B, 'lea_33'); const idB = await B.evaluate(() => CLD.s.user.id), idA = await A.evaluate(() => CLD.s.user.id);
  T.ok(await A.evaluate(() => !!document.querySelector('#scch .scchq [data-q="pos"]')), 'bouton « 🧭 Ma position »');
  const pos = await A.evaluate(id => { const c = [V.cx + 40, V.cy - 30]; me = { x: c[0], y: c[1], acc: 9 }; socOpen(); chatOpen(id); document.querySelector('#scch .scchq [data-q="pos"]').click(); return c; }, idB);
  await A.waitForTimeout(500);
  T.ok(/Position partagée/.test(await A.evaluate(() => $('#scchl').innerText)), 'bulle « Position partagée » chez moi');
  await poll(B); await B.waitForTimeout(300);
  const r = await B.evaluate(() => posShared().map(m => ({ f: m.f, x: m.pos.x, y: m.pos.y })));
  T.eq(r, [{ f: idA, x: Math.round(pos[0] * 10) / 10, y: Math.round(pos[1] * 10) / 10 }], 'le copain reçoit ma position');
  // dessin : l'anneau doré autour de l'avatar à l'endroit exact
  const px = await B.evaluate(([x, y]) => { socClose(); V.cx = x; V.cy = y; draw(); const [sx, sy] = scrOf(x, y), d = window.devicePixelRatio || 1, c = cv.getContext('2d').getImageData(Math.round(sx * d), Math.round((sy - 28) * d), 1, 1).data; return [c[0], c[1], c[2]]; }, pos);
  T.ok(px[0] > 200 && px[1] > 160, 'avatar affiché sur la carte du copain', px.join(','));
  T.ok(await B.evaluate(([x, y]) => { const [sx, sy] = scrOf(x, y); return !!posAt(sx, sy); }, pos), 'avatar touchable');
  // au bout de 10 minutes, il disparaît
  await B.evaluate(() => Object.values(SO.th).forEach(L => L.forEach(m => { if (m.pos) m.ts -= 11 * 6e4; })));
  T.eq(await B.evaluate(() => posShared().length), 0, 'disparaît après 10 minutes');
  // sans GPS : pas d'envoi
  await A.evaluate(() => { me = null; document.querySelector('#scch .scchq [data-q="pos"]').click(); }); await A.waitForTimeout(200);
  T.eq(await A.evaluate(id => (SO.th[id] || []).filter(m => m.pos).length, idB), 1, 'sans GPS, rien n\'est envoyé');
};
