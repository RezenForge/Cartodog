import { signup, jpegBuf } from '../lib.mjs';
export const title = 'Communauté : fil d\'une balade, j\'aime, commentaires, publication avec photo';
export default async T => {
  const p = await T.dev('A'); await signup(p, 'dylan@test.fr', 'Rezen', 'Dylan', 'Nova');
  await p.evaluate(() => { const ks = ['Bois du Taillan', 'Parc de Majolan', 'Jardin public'].map(n => Object.keys(D.cells).find(k => balName(k) === n)); ks.forEach((k, i) => D.cells[k].v.push({ id: 'w' + i, d: ['2026-10-27', '2026-10-24', '2026-10-19'][i], h: '10:00', s: 0, m: 0, t: '', pts: [] })); save(); });
  const c = await p.evaluate(() => ctr(Object.keys(D.cells).find(k => balName(k) === 'Bois du Taillan'))), S = T.S, now = Date.now(), H = 36e5;
  S.db.users.push({ id: 'u7', email: 'lea@t.fr', pw: 'x', name: 'lea_33', first: 'Léa', dog: 'Max', role: 'user', confirmed: true, meta: {} });
  S.db.objects.set('posts/u7/a.jpg', { buf: await jpegBuf(p, 'A'), type: 'image/jpeg' });
  S.db.posts.push({ id: 'x1', author: 'u7', bal: 'Bois du Taillan', bx: c[0] + 50, by: c[1], body: 'Max a adoré 🐾', photo: 'u7/a.jpg', ts: new Date(now - 3 * H).toISOString(), del: false },
    { id: 'x2', author: 'u7', bal: 'Bois du Taillan', bx: c[0], by: c[1] + 40, body: 'Flaque énorme après le pont', photo: null, ts: new Date(now - 26 * H).toISOString(), del: false });
  S.db.coms.push({ post: 'x1', author: 'u7', body: 'Top', ts: new Date(now - H).toISOString() });
  await p.click('#comb'); await p.waitForTimeout(1200);
  T.eq(await p.evaluate(() => [...$('#cmsel').options].map(o => o.text)), ['Bois du Taillan (27 oct.)', 'Parc de Majolan (24 oct.)', 'Jardin public (19 oct.)'], 'balades visitées, la plus récente d\'abord');
  T.eq(await p.evaluate(() => document.querySelectorAll('#cmls .cmp').length), 2, 'publications de la balade');
  await p.click('[data-cmlike="x2"]'); await p.waitForTimeout(300); T.ok(S.db.likes.some(l => l.post === 'x2' && l.u === 'u1'), 'j\'aime');
  await p.click('[data-cmcom="x1"]'); await p.waitForTimeout(500); await p.fill('#cmci', 'Je note pour samedi !'); await p.click('#cmsw [data-cmsend]'); await p.waitForTimeout(500);
  T.ok(S.db.coms.some(x => x.post === 'x1' && x.body === 'Je note pour samedi !'), 'commentaire envoyé'); await p.evaluate(() => { $('#cmsh').hidden = true; });
  await p.click('#cmpub'); await p.waitForTimeout(200); await p.fill('#cmtx', 'Première balade de Nova ici 🍂');
  await p.setInputFiles('#cmfile', { name: 'photo.jpg', mimeType: 'image/jpeg', buffer: await jpegBuf(p, 'NOVA') }); await p.waitForTimeout(800);
  T.ok(await p.evaluate(() => CM.draft && CM.draft.blob && CM.draft.blob.size < 400000), 'photo compressée avant envoi');
  await p.click('#cmsw [data-cmgo]'); await p.waitForTimeout(1200);
  T.ok(S.db.posts.some(x => x.author === 'u1' && x.body.startsWith('Première balade') && x.photo), 'publication avec photo');
  await p.click('[data-cmrep="x2"]').catch(() => {}); await p.waitForTimeout(200);
  if (await p.evaluate(() => !$('#rpsh').hidden)) { await p.click('#rpw [data-rp="spam"]'); await p.waitForTimeout(400); }
  T.ok((S.db.reports || []).some(r => r.kind === 'post' && r.target === 'x2'), 'publication signalée');
  await p.click('[data-cmloc]'); await p.waitForTimeout(600);
  T.ok(await p.evaluate(() => !$('#com').classList.contains('open') && sel && balName(sel) === 'Bois du Taillan'), 'voir la balade sur la carte');
};
