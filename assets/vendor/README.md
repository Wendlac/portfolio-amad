# Bibliothèques tierces, auto-hébergées

Le site ne charge aucune ressource depuis un domaine tiers, polices comprises.
Ces fichiers suivent la même règle : ils sont versionnés dans le dépôt plutôt
que tirés d'un CDN. Aucune requête sortante à l'exécution, pas de dépendance à
la disponibilité d'un tiers, et la version ne change pas sous nos pieds.

| Fichier | Version | Source | Poids |
|---|---|---|---|
| `gsap.min.js` | 3.15.0 | npm `gsap` | 71 Ko |
| `ScrollTrigger.min.js` | 3.15.0 | npm `gsap` | 44 Ko |

Récupérés avec `npm pack gsap`, fichiers extraits de `dist/`.

Les deux ne sont chargés que par l'étude de cas `/projets/kalaan/`. La page
d'accueil n'a aucune dépendance tierce : sa seule ressource exécutable est
`/assets/wall/wall.js`, qui ne dépend de rien.

## Three.js a été retiré

`three.module.min.js`, `three.core.min.js` et `three.LICENSE.txt` ne servaient
qu'à l'effet WebGL de l'ancienne page d'accueil, via `assets/js/webgl-media.js`.
Cette page n'existe plus depuis que le site tient en une seule page, et ce
README prévoyait le cas : « si l'effet WebGL venait à être retiré, supprimer les
deux fichiers `three.*` : rien d'autre ne les référence ». Vérifié par un scan
d'atteignabilité avant suppression, puis fait. 733 Ko.

Pour les retrouver : ils sont dans l'historique, avant le commit qui a fait le
ménage.

## Licence

**GSAP**, licence « standard no charge » de GreenSock, bandeau conservé en tête
de `gsap.min.js` et de `ScrollTrigger.min.js`. Conditions :
<https://gsap.com/standard-license>. Elle couvre l'usage sur un site que l'on ne
fait pas payer à ses visiteurs, ce qui est le cas ici. Un produit vendu aux
utilisateurs finaux demanderait une licence commerciale.

## Mise à jour

```
npm pack gsap
```
puis extraire et recopier les deux fichiers ci-dessus, en mettant ce tableau à
jour.
