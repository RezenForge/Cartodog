import { signup, login, waitSync } from '../lib.mjs';
export const title = 'Inscription, règlement, conditions, connexion sur un 2e appareil';
export default async T => {
  const p = await T.dev('A');
  await p.evaluate(() => { CLD.mode = 'up'; clUi(); });
  T.ok(await p.$('.rgbox'), 'règlement affiché à l\'inscription');
  T.eq(await p.evaluate(() => document.querySelectorAll('.rgbox li').length), 10, '10 règles résumées');
  await p.fill('#clfirst', 'Dylan'); await p.fill('#clname', 'Rezen'); await p.fill('#clmail', 'dylan@test.fr'); await p.fill('#clpw', 'motdepasse1'); await p.check('#clterms');
  await p.click('#clgo'); await p.waitForTimeout(200);
  T.eq(await p.textContent('#clerr'), 'Cochez la case pour accepter le règlement de la communauté', 'règlement obligatoire');
  await p.uncheck('#clterms'); await p.check('#clrules'); await p.click('#clgo'); await p.waitForTimeout(200);
  T.eq(await p.textContent('#clerr'), 'Cochez la case pour accepter les conditions', 'conditions obligatoires');
  await p.check('#clterms'); await p.click('#clgo'); await p.waitForFunction(() => clOn()); await waitSync(p);
  const u = T.S.db.users[0];
  T.ok(u.meta.terms && u.meta.terms === await p.evaluate(() => TERMS_V), 'version des conditions enregistrée');
  T.eq([u.name, u.first], ['Rezen', 'Dylan'], 'pseudo et prénom envoyés');
  await p.click('.rgbox [data-lg="reglement"]').catch(() => {});
  // ancien membre : on lui redemande d'accepter
  u.meta.terms = '2000-01-01'; await p.evaluate(() => termsCheck()); await p.waitForTimeout(300);
  T.ok(await p.evaluate(() => !$('#lgacc').hidden && document.querySelectorAll('#lgrg li').length === 10), 'ré-acceptation avec le règlement');
  await p.check('#lgck'); await p.click('#lgok'); await p.waitForTimeout(400);
  T.ok(await p.evaluate(() => $('#lgacc').hidden), 'ré-acceptation enregistrée'); T.eq(u.meta.terms, await p.evaluate(() => TERMS_V), 'nouvelle version notée');
  // filtres et réglages suivent sur un autre appareil
  await p.evaluate(() => { SRF.clear(); SRF.add('tpetite'); SRF.add('pk'); srfSave(); }); await p.evaluate(() => sync(true)); await waitSync(p);
  const q = await T.dev('B'); await login(q, 'dylan@test.fr');
  T.eq(await q.evaluate(() => [...SRF].sort()), ['pk', 'tpetite'], 'filtres retrouvés sur le 2e appareil');
  await q.evaluate(() => clSignOut()); await q.waitForTimeout(300);
  T.ok(await q.evaluate(() => !clOn() && !$('#gate').hidden), 'déconnexion');
};
