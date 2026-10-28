import { signup, befriend, poll } from '../lib.mjs';
export const title = 'Présence : rien au-delà de 500 m';
export default async T => {
  const A = await T.dev('A'), B = await T.dev('B');
  await signup(A, 'dylan@test.fr', 'Rezen', 'Dylan', 'Nova'); await signup(B, 'lea@test.fr', 'lea_33', 'Léa', 'Max'); await befriend(A, B, 'lea_33');
  const at = d => B.evaluate(d => { const c = ctr(Object.keys(D.cells).find(k => balName(k) === 'Bois du Taillan')); me = { x: c[0] - d / cosAt(c[1]), y: c[1], acc: 10 }; presTick(); const H = JSON.parse(localStorage.getItem('cartodog-here') || 'null'); if (H) { H.t -= 6 * 6e4; localStorage.setItem('cartodog-here', JSON.stringify(H)); } presTick(); soPresence(); }, d);
  await at(560); await B.waitForTimeout(300); await poll(A); T.eq(await A.evaluate(() => [...socLive()].length), 0, 'à 560 m : pas sur la balade');
  await at(450); await B.waitForTimeout(300); await poll(A); T.eq(await A.evaluate(() => [...socLive()].map(([k, o]) => [balName(k), o.cnt])), [['Bois du Taillan', 1]], 'à 450 m : sur la balade');
};
