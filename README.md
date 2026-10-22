# Cartodog

Carnet de balade canine : cartographier les forêts, tracer ses sentiers et promener son chien en sécurité.

Application web mobile en un seul fichier (`index.html`), installable sur l'écran d'accueil du téléphone. Les données restent sur l'appareil (stockage local), avec import / export en JSON.

## Fonctionnalités

- **Carte satellite** avec routes IGN en gris léger, limites des communes, boussole et mode hors connexion (zones enregistrées).
- **Sentiers** tracés au GPS ou à la main ; les sentiers qui se touchent forment automatiquement une seule **balade**.
- **Balades guidées** : choix d'une durée et d'un parking de départ, l'appli propose une boucle parking → parking qui contourne les dangers signalés. L'allure s'affine à chaque sortie.
- **Sorties** enregistrées (durée, distance, tracé), rattachées à des **lieux de balade**.
- **Repères** : points d'eau, parkings, zones de liberté… et **dangers** (tiques, chenilles, vipère, chasse…) valables 24 h, confirmés ou retirés sur place.
- **Météo** : bloc à côté de la boussole avec alertes (pluie, orage, chaleur, rafales, nuit), confort de balade sur 8 jours, avertissement au départ si quelque chose est prévu pendant la sortie.
- **Profil du chien** : photo, race, âge, suivi du poids, vétérinaire, journal de balade.
- **Guide du promeneur** : dangers pour le chien, gestes de premiers secours, numéros des centres antipoison vétérinaires.
- **Partage d'une balade** (sentiers, parkings, dangers) sous forme de fichier à importer.

## Utilisation

Ouvrir `index.html` dans un navigateur, de préférence servi en `https://` (nécessaire pour le GPS). Pour une publication simple : **GitHub Pages** (Settings ▸ Pages ▸ branche `main`, dossier racine), puis « Ajouter à l'écran d'accueil » depuis le téléphone.

## Données externes

Fonds satellite Esri World Imagery, données IGN (Géoplateforme : routes BD TOPO, BD Forêt, altimétrie), API Géo (communes), Open-Meteo (météo), Wikipédia (images du guide).

Le guide ne remplace pas l'avis d'un vétérinaire.
