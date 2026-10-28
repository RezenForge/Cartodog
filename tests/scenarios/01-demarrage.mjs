export const title = 'Ouverture de l\'appli, accueil, infos légales';
export default async T => {
  const p = await T.dev('A', { welcome: true, balades: false });
  T.ok(await p.evaluate(() => /^\d{4}\.\d\d\.\d\d-\d+$/.test(APP_V)), 'numéro de version présent');
  T.ok(await p.evaluate(() => $('#welm').classList.contains('open')), 'écran d\'accueil affiché au premier lancement');
  T.ok(await p.evaluate(() => cv.width > 100 && cv.height > 100), 'carte dessinée');
  T.ok(await p.evaluate(() => !$('#gate').hidden), 'connexion demandée sans compte');
  const L = await T.browser.newPage(); L.on('pageerror', e => T.errs.push('légal : ' + e.message));
  await L.goto(T.base + '/legal.html'); const txt = await L.evaluate(() => document.body.innerText);
  T.ok(txt.length > 8000, 'infos légales chargées');
  T.ok(!/sentier|boucle|itinéraire|guidage/i.test(txt), 'infos légales sans vocabulaire obsolète');
  for (const id of ['mentions', 'confidentialite', 'reglement', 'conditions']) T.ok(await L.$('#' + id), 'section ' + id);
  T.ok(await L.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'pas de défilement horizontal');
};
