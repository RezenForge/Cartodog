import { signup, sync, cellOf, jpeg } from '../lib.mjs';
export const title = 'Photo du badge : publique, vue par les autres, modération';
export default async T => {
  const two = [['Parc de Majolan', 0, 0], ['Bois voisin', 200, 0]];
  const A = await T.dev('A', { balades: two }), L = await T.dev('L', { balades: false });
  await signup(A, 'dylan@test.fr', 'Rezen', 'Dylan', 'Nova'); await signup(L, 'lea@test.fr', 'lea_33', 'Léa', 'Pistache'); await sync(A); await sync(L);
  const d = await jpeg(A, 'MAJOLAN'); await A.evaluate(async ([k, d]) => { await pPut('phM', d); await pPut('phN', d); D.cells[k].ph.push({ id: 'phM', d: today() }, { id: 'phN', d: today() }); save(); select(k); }, [await cellOf(A, 'Parc de Majolan'), d]);
  await A.waitForTimeout(3000);
  T.ok((T.S.db.covers || []).some(r => r.path === 'u1/b-phM.jpg'), 'la photo du badge part toute seule');
  T.ok(T.S.db.objects.has('avatars/u1/b-phM.jpg') && !T.S.db.objects.has('avatars/u1/b-phN.jpg'), 'seule la photo du badge est envoyée');
  await L.evaluate(() => bcLoad(true)); await L.waitForTimeout(800);
  T.eq(await L.evaluate(([a, b]) => [bcOf(a), bcOf(b)], [await cellOf(L, 'Parc de Majolan'), await cellOf(L, 'Bois voisin')]), ['u1/b-phM.jpg', null], 'vue sur la bonne balade seulement');
  await L.evaluate(k => select(k), await cellOf(L, 'Parc de Majolan')); await L.waitForTimeout(1500);
  T.ok(await L.evaluate(() => !!document.querySelector('#bpph [data-bpv] img[src]')), 'photo dans la fiche des autres');
  T.ok(await L.evaluate(k => !!bcImg(bcOf(k)), await cellOf(L, 'Parc de Majolan')), 'photo sur l\'épingle de la carte');
  // ★ sur l'autre photo : elle remplace
  await A.evaluate(() => { pvId = 'phN'; $('#pvc').click(); }); await A.waitForTimeout(2500);
  T.eq(T.S.db.covers.map(r => r.path), ['u1/b-phN.jpg'], '★ remplace la photo partagée');
  // modération
  await A.evaluate(() => { $('#menu').classList.add('open'); admOpen(); }); await A.waitForTimeout(400);
  await A.evaluate(() => document.querySelector('#adm [data-adt="con"]').click()); await A.waitForTimeout(300); await A.evaluate(() => document.querySelector('#adm [data-adck="cover"]').click()); await A.waitForTimeout(500);
  await A.evaluate(() => document.querySelector('#adm [data-ah^="cover|"]').click()); await A.waitForTimeout(500);
  await L.evaluate(() => bcLoad(true)); await L.waitForTimeout(500); T.eq(await L.evaluate(k => bcOf(k), await cellOf(L, 'Parc de Majolan')), null, 'photo masquée par la modération');
  await A.evaluate(k => bcShare(k), await cellOf(A, 'Parc de Majolan')); T.ok(T.S.db.covers[0].hidden, 'repartager la même photo ne la rétablit pas');
  await A.evaluate(k => { $('#menu').classList.remove('open'); select(k); pvId = 'phN'; $('#pvd').click(); }, await cellOf(A, 'Parc de Majolan')); await A.waitForTimeout(1200);
  T.ok(!T.S.db.objects.has('avatars/u1/b-phN.jpg'), 'photo supprimée : retirée pour les autres');
};
