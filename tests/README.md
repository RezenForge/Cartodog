# Tests de Cartodog

Des scénarios automatiques qui ouvrent l'appli dans un vrai navigateur (Chromium) et la font utiliser par plusieurs « promeneurs » à la fois, contre un faux serveur Supabase en mémoire (`fakesb.mjs`). Rien n'est envoyé au vrai serveur.

## Lancer

```sh
npm install --no-save playwright && npx playwright install chromium   # une seule fois
node tests/run.mjs                 # tous les scénarios (~2 min 30)
node tests/run.mjs recherche admin # seulement ceux dont le nom contient ces mots
```

Chaque scénario affiche ✅ ou ❌, avec la vérification qui a échoué. Une erreur JavaScript dans la page fait aussi échouer le scénario.

## Ajouter un scénario

Créer `tests/scenarios/NN-nom.mjs` :

```js
import { signup } from '../lib.mjs';
export const title = 'Ce que ça vérifie';
export default async T => {
  const A = await T.dev('A');                 // un téléphone, avec 4 balades de démo
  await signup(A, 'dylan@test.fr', 'Rezen', 'Dylan', 'Nova');   // dylan@test.fr = administrateur du faux serveur
  T.ok(await A.evaluate(() => clOn()), 'connecté');
  T.eq(T.S.db.users.length, 1, 'un compte sur le serveur');
};
```

Quand une fonction du serveur change (Supabase), il faut refléter le changement dans `fakesb.mjs`.
