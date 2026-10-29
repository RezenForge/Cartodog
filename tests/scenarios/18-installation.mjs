// Guide d'installation sur l'écran d'accueil, visible avant la connexion, adapté au téléphone.
export const title = 'Installer Cartodog sur l\'écran d\'accueil (iPhone, Android, Instagram)';
const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const AND = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36';
export default async function (T) {
  const vis = p => p.evaluate(() => { const g = $('#gate'); return { gate: !g.hidden, btn: !$('#ginst').hidden }; });
  // Ordinateur : pas de bouton
  const pc = await T.dev('PC', { balades: false });
  T.eq((await vis(pc)).btn, false, 'ordinateur : pas de bouton d\'installation');
  // iPhone Safari : les étapes Partager › Sur l'écran d'accueil › Ajouter
  const ip = await T.dev('iPhone', { balades: false, ctx: { userAgent: IOS } });
  const v = await vis(ip); T.ok(v.gate && v.btn, 'iPhone : bouton visible sur l\'écran de connexion', JSON.stringify(v));
  await ip.click('#ginst'); const t = await ip.textContent('#inw');
  T.ok(!(await ip.evaluate(() => $('#insh').hidden)), 'iPhone : le guide s\'ouvre au-dessus de la connexion');
  T.ok(/Partager/.test(t) && /Sur l'écran d'accueil/.test(t) && /Ajouter/.test(t) && /Safari/.test(t), 'iPhone : étapes Safari affichées');
  const top = await ip.evaluate(() => { const r = $('#inw').getBoundingClientRect(); const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return !!e.closest('#insh'); });
  T.ok(top, 'iPhone : le guide n\'est pas caché par l\'écran de connexion');
  await ip.click('[data-ins="x"]'); T.ok(await ip.evaluate(() => $('#insh').hidden), 'iPhone : « J\'ai compris » ferme le guide');
  // Navigateur intégré d'Instagram : ouvrir dans Safari d'abord, lien copiable
  const ig = await T.dev('Insta', { balades: false, ctx: { userAgent: IOS.replace('Safari/604.1', 'Instagram 350.0.0 (iPhone15,2; iOS 18_0; fr_FR)'), permissions: ['clipboard-read', 'clipboard-write'] } });
  await ig.click('#ginst'); const ti = await ig.textContent('#inw');
  T.ok(/Instagram/.test(ti) && /Ouvrir dans Safari/.test(ti), 'Instagram : demande d\'ouvrir dans Safari');
  await ig.click('[data-ins="copy"]'); await ig.waitForTimeout(200);
  T.eq(await ig.evaluate(() => navigator.clipboard.readText()), 'https://cartodog.fr', 'Instagram : lien copié');
  // Android Chrome : installation en un appui grâce à la proposition de Chrome
  const an = await T.dev('Android', { balades: false, ctx: { userAgent: AND } });
  T.ok((await vis(an)).btn, 'Android : bouton visible');
  const r = await an.evaluate(async () => { const e = new Event('beforeinstallprompt', { cancelable: true }); let asked = 0; e.prompt = () => { asked++; }; e.userChoice = Promise.resolve({ outcome: 'accepted' }); dispatchEvent(e);
    $('#ginst').click(); await new Promise(r => setTimeout(r, 100)); dispatchEvent(new Event('appinstalled')); return { asked, sheet: !$('#insh').hidden }; });
  T.eq(r, { asked: 1, sheet: false }, 'Android : un appui ouvre l\'installation de Chrome, sans guide');
  // Android sans proposition : étapes ⋮ › Ajouter à l'écran d'accueil
  await an.evaluate(() => { BIP = null; $('#ginst').hidden = false; $('#ginst').click(); });
  T.ok(/Ajouter à l'écran d'accueil/.test(await an.textContent('#inw')), 'Android : étapes Chrome si pas de proposition');
  // Déjà installée (plein écran) : bouton caché
  await an.evaluate(() => { const m = matchMedia; window.matchMedia = q => /display-mode/.test(q) ? { matches: true, media: q, addEventListener() {} } : m.call(window, q); instUi(); });
  T.eq((await vis(an)).btn, false, 'appli installée : bouton caché');
  // Mon compte : même entrée une fois connecté
  T.ok(await ip.evaluate(() => !$('#acinst').hidden), 'iPhone : entrée « Installer » dans Mon compte');
}
