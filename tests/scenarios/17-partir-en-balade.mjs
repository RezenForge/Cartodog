import { signup, befriend, poll, cellOf } from '../lib.mjs';
export const title = 'Bouton Balade : balade détectée, minuteur, copains prévenus, Rejoindre';
export default async T => {
  const A = await T.dev('A'), B = await T.dev('B');
  await signup(A, 'dylan@test.fr', 'Rezen', 'Dylan', 'Nova'); await signup(B, 'lea@test.fr', 'lea_33', 'Léa', 'Max'); await befriend(A, B, 'lea_33');
  const tap = (p, q) => p.evaluate(q => { const e = document.querySelector(q); if (!e) throw new Error('introuvable : ' + q); e.click(); }, q);
  const gps = (p, d) => p.evaluate(d => { const c = ctr(Object.keys(D.cells).find(k => balName(k) === 'Bois du Taillan')); me = { x: c[0] + d / cosAt(c[1]), y: c[1], acc: 8 }; watch = watch ?? 1; }, d);
  // loin de toute balade
  await gps(A, -900); await tap(A, '#found'); await A.waitForTimeout(300);
  T.ok((await A.evaluate(() => $('#wkw').innerText)).includes('Aucune balade ici'), 'hors périmètre : aucune balade');
  T.ok((await A.evaluate(() => $('#wkw').innerText)).includes('Bois du Taillan'), 'propose la plus proche');
  await tap(A, '#wkw [data-wk="x"]');
  // dans le périmètre
  await gps(A, 200); await tap(A, '#found'); await A.waitForTimeout(300);
  const t = await A.evaluate(() => $('#wkw').innerText); T.ok(t.includes('Vous êtes ici') && t.includes('Bois du Taillan'), 'balade détectée à 200 m');
  T.ok(await A.evaluate(() => $('#wknot').checked), 'copains prévenus par défaut');
  await tap(A, '#wkw [data-wk="go"]'); await A.waitForTimeout(800);
  T.ok(await A.evaluate(() => wkOn() && $('#found').classList.contains('rec') && /\d:\d\d/.test($('#found').innerText)), 'minuteur à la place du bouton');
  T.eq((T.S.db.walkN || []).map(x => [x.to, x.bal]), [[['u2'], 'Bois du Taillan']], 'notification envoyée à la copine');
  T.ok(/^#walk=u1,\d+,\d+$/.test(T.S.db.walkN[0].url), 'lien de la notification');
  await poll(B); T.ok(await B.evaluate(() => FR_()[0].st === 'walk' && FR_()[0].at && FR_()[0].at.n === 'Bois du Taillan'), 'copine : « en balade à » tout de suite');
  T.ok(await A.evaluate(() => { const k = Object.keys(D.cells).find(k => balName(k) === 'Bois du Taillan'); return D.cells[k].v.length === 1 && visited(k); }), 'visite notée au départ');
  // deuxième départ trop tôt : pas de nouvelle notification
  await A.evaluate(() => { WK.t0 -= 25 * 6e4; wkSave(); }); await tap(A, '#found'); await A.waitForTimeout(200); await tap(A, '#wkw [data-wk="end"]'); await A.waitForTimeout(500);
  const r = await A.evaluate(() => $('#wkw').innerText); T.ok(r.includes('Balade terminée') && r.includes('25'), 'bilan : durée affichée', r.replace(/\n/g, ' '));
  T.ok(await A.evaluate(() => !wkOn() && !$('#found').classList.contains('rec')), 'bouton revenu');
  T.ok(await A.evaluate(() => { const k = Object.keys(D.cells).find(k => balName(k) === 'Bois du Taillan'); return D.cells[k].v[0].s >= 25 * 60; }), 'durée enregistrée dans la visite');
  await tap(A, '#wkw [data-wk="x"]'); await tap(A, '#found'); await A.waitForTimeout(200); await tap(A, '#wkw [data-wk="go"]'); await A.waitForTimeout(500);
  T.eq(T.S.db.walkN.length, 1, 'pas de 2e notification avant 20 minutes');
  // la copine touche la notification
  let opened = ''; await B.exposeFunction('__open', u => { opened = u; }); await B.evaluate(() => { window.open = u => { __open(u); return null; }; });
  await B.evaluate(u => pushGo(u), T.S.db.walkN[0].url); await B.waitForTimeout(800);
  const ti = await B.evaluate(() => $('#wkw').innerText); T.ok(ti.includes('Nova & Dylan sont en balade') && ti.includes('Bois du Taillan'), 'fenêtre de la notification', ti.replace(/\n/g, ' '));
  T.ok(await B.evaluate(() => sel && balName(sel) === 'Bois du Taillan'), 'la balade est ouverte sur la carte');
  await tap(B, '#wkw [data-wk="join"]'); await B.waitForTimeout(600);
  T.ok(T.S.db.msgs.some(m => m.f === 'u2' && m.to === 'u1' && m.t.includes("J'arrive")), 'Rejoindre : message envoyé');
  T.ok(/google\.com\/maps\/dir/.test(opened), 'Rejoindre : itinéraire ouvert');
  // mode invisible : personne n'est prévenu
  await A.evaluate(() => { wkEnd(true); accU().vis = 'none'; save(); }); await tap(A, '#found'); await A.waitForTimeout(200);
  T.ok(await A.evaluate(() => $('#wknot').disabled && $('#wkw').innerText.includes('Mode invisible')), 'mode invisible signalé');
};
