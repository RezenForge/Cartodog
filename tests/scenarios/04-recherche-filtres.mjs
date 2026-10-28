import { signup, cellOf } from '../lib.mjs';
export const title = 'Loupe : toutes les balades, filtres, filtres appliqués à la carte';
export default async T => {
  const A = await T.dev('A'), B = await T.dev('B');
  await signup(A, 'dylan@test.fr', 'Rezen', 'Dylan', 'Nova'); await signup(B, 'lea@test.fr', 'lea_33', 'Léa', 'Pistache');
  for (const [n, tags] of [['Bois du Taillan', ['grande', 'pk', 'libre', 'ombre']], ['Jardin public', ['petite', 'pmr', 'pous', 'wc', 'jeux']]]) {
    const xy = await A.evaluate(n => balXY(Object.keys(D.cells).find(k => balName(k) === n)), n);
    await B.evaluate(([x, n, t]) => soRpc('bal_review', { ...x, name: n, stars: 4, body: '', tags: t }), [xy, n, tags]);
  }
  await A.evaluate(() => { BT.t = 0; }); await A.click('#srb'); await A.waitForTimeout(700);
  T.ok(await A.evaluate(() => document.activeElement.id !== 'srq'), 'le clavier ne s\'ouvre pas tout seul');
  const list = () => A.evaluate(() => [...document.querySelectorAll('#srl li[data-srk] b')].map(b => b.textContent));
  T.eq(await list(), ['Bois du Taillan', 'Jardin public', 'Parc Bordelais', 'Parc de Majolan'], 'toutes les balades, par ordre alphabétique');
  T.ok(await A.$('#srl [data-sradd]'), 'bouton « Une balade manque ? »');
  await A.click('#srf [data-srf="pous"]'); await A.waitForTimeout(200); T.eq(await list(), ['Jardin public'], 'filtre Poussette');
  await A.evaluate(() => srClose()); await A.waitForTimeout(300);
  T.eq(await A.evaluate(() => [...mapFlt()].map(k => balName(k))), ['Jardin public'], 'la carte n\'affiche que les balades filtrées');
  T.ok(await A.evaluate(() => !$('#mff').hidden && $('#mff b').textContent === '1'), 'bouton des filtres avec le nombre de balades');
  await A.click('#mff'); await A.waitForTimeout(200); T.ok(await A.evaluate(() => $('#srp').classList.contains('open')), 'le bouton des filtres ouvre la loupe');
  await A.click('#srf [data-srf="grande"]'); await A.waitForTimeout(150); T.eq(await list(), [], 'deux critères : aucune balade');
  await A.click('#srf [data-srf="petite"]'); await A.waitForTimeout(150); T.eq(await A.evaluate(() => [...SRF].sort()), ['petite', 'pous'], 'une seule durée dans les filtres');
  await A.click('#srf [data-srfx]'); await A.fill('#srq', 'bois'); await A.waitForTimeout(150); T.eq(await list(), ['Bois du Taillan'], 'recherche par nom');
  await A.click('#srl li[data-srk]'); await A.waitForTimeout(800);
  T.ok(await A.evaluate(() => sel && balName(sel) === 'Bois du Taillan' && !$('#srp').classList.contains('open')), 'choisir un résultat ouvre la fiche');
  T.ok(await A.evaluate(() => $('#mff').hidden && mapFlt() === null), 'sans filtre, toutes les balades sur la carte');
};
