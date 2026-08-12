# Bibliothèques tierces, auto-hébergées

Le site ne charge aucune ressource depuis un domaine tiers, polices comprises.
Ces fichiers suivent la même règle : ils sont versionnés dans le dépôt plutôt
que tirés d'un CDN. Aucune requête sortante à l'exécution, pas de dépendance à
la disponibilité d'un tiers, et la version ne change pas sous nos pieds.

| Fichier | Version | Source | Poids |
|---|---|---|---|
| `three.module.min.js` | 0.185.1 | npm `three` | 357 Ko |
| `three.core.min.js` | 0.185.1 | npm `three` (importé par le précédent) | 376 Ko |
| `gsap.min.js` | 3.15.0 | npm `gsap` | 71 Ko |
| `ScrollTrigger.min.js` | 3.15.0 | npm `gsap` | 44 Ko |

Récupérés avec `npm pack three gsap`, fichiers extraits de `build/` et `dist/`.

## Three.js n'est jamais chargé au démarrage

Les deux fichiers `three.*` pèsent 733 Ko bruts (~180 Ko une fois compressés),
c'est beaucoup pour un portfolio. Ils sont donc chargés en `import()` dynamique,
et seulement quand la vitrine projets approche de l'écran ET que WebGL répond
présent (voir `assets/js/webgl-media.js`). Une première visite qui ne descend
jamais jusqu'aux projets ne les télécharge pas.

Si l'effet WebGL venait à être retiré, supprimer les deux fichiers `three.*` :
rien d'autre ne les référence.

## Licences

- **Three.js**, MIT, voir `three.LICENSE.txt`.
- **GSAP**, licence « standard no charge » de GreenSock, bandeau conservé en
  tête de `gsap.min.js` et de `ScrollTrigger.min.js`. Conditions :
  <https://gsap.com/standard-license>. Elle couvre l'usage sur un site que l'on
  ne fait pas payer à ses visiteurs, ce qui est le cas ici. Un produit vendu
  aux utilisateurs finaux demanderait une licence commerciale.

## Mise à jour

```
npm pack three gsap
```
puis extraire et recopier les quatre fichiers ci-dessus, en mettant ce tableau à
jour.
