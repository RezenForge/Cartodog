import { signup, befriend, poll } from '../lib.mjs';
export const title = 'Rendez-vous : création, invitation, réponse, rappel, annulation';
export default async T => {
  const A = await T.dev('A'), B = await T.dev('B');
  await signup(A, 'dylan@test.fr', 'Rezen', 'Dylan', 'Nova'); await signup(B, 'lea@test.fr', 'lea_33', 'Léa', 'Max'); await befriend(A, B, 'lea_33');
  await A.click('#socb'); await A.waitForTimeout(300); await A.click('#soc [data-st="ev"]'); await A.waitForTimeout(200); await A.click('[data-sx="org"]'); await A.waitForTimeout(300);
  await A.click('#scfw [data-evgo]'); T.eq(await A.evaluate(() => $('#eve').textContent), 'Invitez au moins un copain ou un groupe', 'invité obligatoire');
  T.ok(await A.evaluate(() => { const r = $('#scfw').getBoundingClientRect(); return r.top >= 0; }), 'formulaire entièrement visible');
  await A.click('#scfw [data-evd]:nth-child(2)'); await A.click('#scfw [data-evm="90"]'); await A.fill('#evnote', 'Au portail vert'); await A.click('#scfw [data-evf]');
  await A.click('#scfw [data-evgo]'); await A.waitForTimeout(600);
  T.eq(T.S.db.events.map(e => [e.dur, e.note, e.gs.length]), [[90, 'Au portail vert', 1]], 'rendez-vous enregistré');
  await poll(B); T.eq(await B.evaluate(() => evNew()), 1, 'invitation reçue');
  await B.click('#socb'); await B.waitForTimeout(300); await B.click('#soc [data-st="ev"]'); await B.waitForTimeout(200); await B.click('#scev [data-eg$=":y"]'); await B.waitForTimeout(300);
  T.eq(T.S.db.events[0].gs.map(g => g.r), ['y'], 'réponse « je viens »');
  T.S.db.events[0].at = new Date(Date.now() + 20 * 6e4).toISOString(); await poll(B); await B.evaluate(() => evRemind());
  T.ok((await B.evaluate(() => ($('#toast') || {}).innerText || '')).includes('Rendez-vous'), 'rappel avant le rendez-vous');
  await poll(A); await A.click('#scev [data-ecx]'); await A.waitForTimeout(400); await poll(B);
  T.ok(T.S.db.events[0].x && (await B.evaluate(() => $('#scev').innerText)).includes('Annulé'), 'annulation vue par l\'invitée');
};
