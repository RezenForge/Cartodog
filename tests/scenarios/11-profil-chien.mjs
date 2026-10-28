import { signup, befriend, poll, sync, jpegBuf } from '../lib.mjs';
export const title = 'Profil du chien : public, photos, rien de privé, copains / non-copains';
export default async T => {
  const A = await T.dev('A'), B = await T.dev('B'), C = await T.dev('C');
  await signup(A, 'dylan@test.fr', 'Rezen', 'Dylan', 'Nova'); await signup(B, 'lea@test.fr', 'lea_33', 'Léa', 'Pistache'); await signup(C, 'tom@test.fr', 'tom', 'Tom', 'Rocky');
  await befriend(A, B, 'lea_33');
  await A.evaluate(() => { const ks = Object.keys(D.cells).filter(k => rec(D.cells[k])); const day = n => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
    [[0, 0], [0, 1], [1, 2], [0, 5]].forEach(([i, n]) => D.cells[ks[i]].v.push({ id: rid(), d: day(n), h: '10:15', s: 0, m: 0, t: 'Présence détectée sur place', pts: [] }));
    Object.assign(D.prof, { name: 'Nova', breed: 'Borador', sx: 'f', bd: '2022-04-10', w: [{ d: day(3), kg: 24.5 }], vet: 'Dr Secret', note: 'allergie' }); save(); });
  for (let i = 0; i < 2; i++) { await A.evaluate(() => dogOpen()); const [fc] = await Promise.all([A.waitForEvent('filechooser'), A.click('#dggal [data-gadd]')]); await fc.setFiles({ name: 'g.jpg', mimeType: 'image/jpeg', buffer: await jpegBuf(A, 'G' + i) }); await A.waitForTimeout(800); await A.evaluate(() => dogClose()); }
  await sync(A); await poll(A); await A.waitForTimeout(1500);
  const card = JSON.stringify(T.S.db.dogs.get('u1'));
  T.ok(card && card.includes('Borador'), 'profil public envoyé'); T.ok(!/Secret|allergie|24,5|2022-04/.test(card), 'rien de privé dans le profil public');
  T.eq([...T.S.db.objects.keys()].filter(k => k.includes('/g-')).length, 2, '2 photos publiques réduites');
  await poll(B); await B.evaluate(() => pfOpen('u1')); await B.waitForTimeout(800); await B.click('#pfw [data-pf="dog"]'); await B.waitForTimeout(1200);
  const tb = await B.evaluate(() => $('#dgmain').innerText);
  T.ok(tb.includes('Nova') && tb.includes('Borador') && tb.includes('BALADE PRÉFÉRÉE'), 'copine : profil complet avec balade préférée');
  T.eq(await B.evaluate(() => document.querySelectorAll('#dggal .dgg.ok').length), 2, 'copine : photos visibles');
  await B.click('#dggal [data-gro]'); await B.waitForTimeout(300); T.eq(await B.evaluate(() => [$('#pv').classList.contains('open'), $('#pvd').hidden]), [true, true], 'photo d\'un autre : pas de suppression'); await B.evaluate(() => closePh());
  await C.evaluate(() => pfOpen('u1')); await C.waitForTimeout(800); await C.click('#pfw [data-pf="dog"]'); await C.waitForTimeout(1000);
  const tc = await C.evaluate(() => $('#dgmain').innerText); T.ok(tc.includes('Nova') && !tc.includes('BALADE PRÉFÉRÉE'), 'non-copain : sans balade préférée');
  await C.evaluate(() => { dogClose(); dogOpen(); }); await C.waitForTimeout(500); T.eq(await C.evaluate(() => $('#dgmain .dgnm b').textContent), 'Rocky', 'retour à son propre chien');
};
