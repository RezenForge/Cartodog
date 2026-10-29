import { signup, sync } from '../lib.mjs';
export const title = 'Repères (dangers, points utiles), menus du compte, fiche du chien, météo';
export default async T => {
  const p = await T.dev('A'); await signup(p, 'dylan@test.fr', 'Rezen', 'Dylan', 'Nova');
  // Signaler un danger à ma position
  await p.click('#rep'); await p.waitForTimeout(300);
  await p.evaluate(() => { const c = ctr(Object.keys(D.cells).find(k => balName(k) === 'Bois du Taillan')); me = { x: c[0] + 100, y: c[1], acc: 8 }; RQ.where = 'gps'; rqRender(); });      // GPS simulé (le navigateur de test refuse la position) T.ok(await p.evaluate(() => $('#rqm').classList.contains('open')), 'menu Signaler');
  T.ok(await p.$('#rqadd'), 'Signaler : ajouter une balade manquante');
  const tap = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('introuvable : ' + s); e.click(); }, sel);
  await tap('#rqm [data-rqt="dz"]'); await tap('#rqm [data-rqw="gps"]'); await tap('#rqm [data-rq="chenille"]'); await p.waitForTimeout(300);
  T.eq(await p.evaluate(() => D.marks.map(m => m.t)), ['chenille'], 'danger posé à ma position');
  await sync(p); T.eq([...T.S.db.marks.values()].map(m => m.data.t), ['chenille'], 'danger partagé');
  await p.evaluate(k => select(k), await p.evaluate(() => Object.keys(D.cells).find(k => balName(k) === 'Bois du Taillan'))); await p.waitForTimeout(500);
  T.ok(await p.evaluate(() => !$('#pdzc').hidden), 'la fiche prévient du danger proche');
  await p.click('#pdzc'); await p.waitForTimeout(200); T.ok((await p.evaluate(() => $('#pdz').innerText)).includes('danger'), 'liste des dangers proches');
  // Pose sur la carte d'un point utile
  await p.evaluate(() => { sel = null; renderPanel(); }); await p.click('#rep'); await tap('#rqm [data-rqt="ok"]'); await tap('#rqm [data-rqw="map"]'); await tap('#rqm [data-rq="water"]');
  const box = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return [r.x + r.width / 2 - 60, r.y + r.height / 2 + 40]; }); await p.mouse.click(box[0], box[1]); await p.waitForTimeout(700);
  T.eq(await p.evaluate(() => D.marks.map(m => m.t).sort()), ['chenille', 'water'], 'point utile posé sur la carte');
  // Refonte : repères retirés, plus d'onglet Chemin, « Ajouter une balade » à ma position ouvre directement le formulaire
  await p.click('#rep'); await p.waitForTimeout(200);
  const all = []; for (const t of ['dz', 'ok']) { await tap(`#rqm [data-rqt="${t}"]`); all.push(...await p.evaluate(() => [...document.querySelectorAll('#rqm [data-rq]')].map(b => b.dataset.rq))); }
  T.ok(!all.some(t => ['tick', 'viper', 'toxic', 'bramble', 'good', 'view', 'mud', 'flood', 'fallen', 'works'].includes(t)) && all.length === 21, 'repères retirés du menu', all.join(','));
  T.ok(!(await p.$('#rqm [data-rqt="st"]')), 'plus d\'onglet Chemin');
  await p.evaluate(() => { me = { ...me, acc: 8 }; }); await tap('#rqadd'); await p.waitForTimeout(200);
  T.ok(await p.evaluate(() => !$('#bash').hidden && /votre position/.test($('#baw').innerText) && !$('#rqm').classList.contains('open')), 'Ajouter une balade : formulaire direct à ma position');
  await tap('#baw [data-ba="map"]'); T.ok(await p.evaluate(() => $('#bash').hidden && !$('#admpl').hidden), 'Placer sur la carte : mode placement');
  await tap('#admpl [data-admpl]');
  // Menus du compte
  await p.evaluate(() => $('#mn').click()); await p.waitForTimeout(500); T.ok(await p.evaluate(() => $('#menu').classList.contains('open')), 'menu Mon compte');
  for (const pg of ['me', 'priv', 'map', 'data']) { await p.evaluate(g => accPage(g, true), pg); await p.waitForTimeout(150); T.ok(await p.evaluate(g => !!document.querySelector(`.acp[data-pg="${g}"]`) && document.querySelector(`.acp[data-pg="${g}"]`).getBoundingClientRect().width > 0, pg), 'page ' + pg); }
  await p.evaluate(() => accPage('priv', true)); await p.click('#acvis [data-v="none"]'); await p.waitForTimeout(200); T.eq(await p.evaluate(() => accU().vis), 'none', 'mode invisible');
  await p.evaluate(() => accPage('me', true)); await p.fill('#acpf', 'Dyl'); await p.dispatchEvent('#acpf', 'input'); await p.waitForTimeout(200); T.eq(await p.evaluate(() => accU().first), 'Dyl', 'prénom modifié');
  // Fiche du chien
  await p.evaluate(() => dogOpen()); await p.waitForTimeout(500); T.ok(await p.evaluate(() => $('#dogm').classList.contains('open') && $('#dgmain').innerText.includes('Nova')), 'fiche du chien');
  T.ok(await p.evaluate(() => dogStats().B.length >= 10), 'badges calculés'); await p.evaluate(() => dogClose());
  // Météo : sans réseau, la fenêtre s'ouvre quand même
  await p.evaluate(() => { const b = document.querySelector('#wx,#wxb,[data-ic="wx"]'); if (b) b.click(); }); await p.waitForTimeout(400);
};
