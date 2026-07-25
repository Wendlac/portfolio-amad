/*
  Structure de données centralisée pour la section "Projets" (accueil).
  Pour ajouter / retirer un projet : éditer ce tableau uniquement, ne pas
  toucher au balisage (index.html) ni au script de rendu (projects-render.js).

  Champs :
  - title       : titre du projet
  - description : une seule ligne — nature du projet, rôle tenu (pas d'année,
                   choix délibéré pour garder le portfolio intemporel)
  - type        : "site" (lien vers le livrable hébergé) | "pdf" (document PDF)
  - url         : lien externe vers le livrable réel
  - image       : chemin vers l'aperçu (obligatoire — un projet sans image
                   d'aperçu ne doit pas être ajouté ici, cf. EF-05 du cahier
                   des charges)
  - imageAlt    : texte alternatif de l'aperçu
  - status      : null | "en-cours" (étiquette optionnelle pour un projet pas
                   encore finalisé)

  Ordre du tableau = ordre d'affichage (curation manuelle, pas de tri auto).
*/

window.PROJECTS = [
  {
    title: "Faissel",
    // Site vitrine pour un prestataire réseau informatique : catalogue de
    // matériel + services, consultable par ses clients.
    description: "Site vitrine pour catalogue de matériel et services, design UI et développement",
    type: "site",
    url: "https://www.faissel.com/",
    image: "/assets/img/projects/faissel.webp",
    imageAlt: "Page d'accueil du site Faissel, présentant ses solutions réseau pour entreprises",
    status: null
  },
  {
    title: "Quotidien économique",
    description: "Site web de presse en ligne, design UI et développement",
    type: "site",
    url: "https://quotidieneconomique.net/",
    image: "/assets/img/projects/quotidien-economique.webp",
    imageAlt: "Page d'accueil du site Quotidien économique, un média d'actualité économique",
    status: null
  },
  {
    title: "Dispoz",
    // Outil web : extraction de palette de couleurs à partir d'une image
    // uploadée, destiné aux designers/développeurs. Développé par Amad Louis.
    description: "Outil d'extraction de palette de couleurs, design UI et développement",
    type: "site",
    url: "https://wendlac.github.io/dispoz/",
    image: "/assets/img/projects/dispoz.webp",
    imageAlt: "Page d'accueil de Dispoz, un outil d'extraction de palette de couleurs à partir d'une image",
    status: null
  }

  // Évolution prévue (cahier des charges §8) : ajouter Pelerain ici avec
  // status: "en-cours" une fois les écrans principaux finalisés.
];
