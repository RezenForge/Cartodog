// Après une connexion (même après une déconnexion depuis Mon compte), on arrive sur la carte.
import { signup, login } from '../lib.mjs';
export const title = 'Connexion : on arrive sur la carte, sans menu ouvert';
export default async function (T) {
  const open = p => p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { if (!e.id || e.hidden) return false; const s = getComputedStyle(e), r = e.getBoundingClientRect(); return s.position === 'fixed' && s.display !== 'none' && s.visibility !== 'hidden' && r.width > 200 && r.height > 200; }).map(e => e.id));
  const a = await T.dev('A');
  await signup(a, 'a@x.fr', 'aaa', 'Al', 'Rex'); await a.waitForTimeout(800);
  T.eq(await open(a), [], 'après l\'inscription : la carte');
  await a.click('#mn'); await a.waitForTimeout(300); await a.evaluate(() => accPage('me')); await a.click('#clout'); await a.waitForTimeout(1200);
  T.eq(await open(a), ['gate'], 'déconnecté depuis Mon compte : seul l\'écran de connexion');
  await login(a, 'a@x.fr'); await a.waitForTimeout(1500);
  T.eq(await open(a), [], 'reconnecté : la carte, menu fermé');
  const b = await T.dev('B'); await login(b, 'a@x.fr'); await b.waitForTimeout(1500);
  T.eq(await open(b), [], '2e téléphone : la carte');
}
