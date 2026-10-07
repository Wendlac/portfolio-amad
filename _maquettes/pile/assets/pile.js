/*
  LE CLASSEUR — ouverture d’un dossier.

  Le déroulé, en quatre temps. Chacun est une valeur de body[data-phase],
  ce qui veut dire que toute la chorégraphie est dans le CSS et que ce
  fichier ne fait qu'avancer l'horloge.

    monte    360ms   le panneau du loader monte et couvre l'écran
    traits   540ms   les cinq traits se tirent, décalés de 56ms
    sort     420ms   le panneau sort par le haut ; la page est déjà en
                     place dessous, donc elle est découverte, pas affichée
    (rien)           la page ouverte a la main

  Total ~1,3s. C'est long pour un chargement, c'est juste pour un rituel
  d'ouverture — et c'est exactement ce qu'on demande ici : la page ne
  s'affiche pas, elle s'ouvre.

  En mouvement réduit, les quatre temps sont sautés d'un coup.
*/
(function () {
  "use strict";

  var body = document.body;
  var loader = document.getElementById("loader");
  var page = document.getElementById("page");
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)");

  var TEMPS = { monte: 360, traits: 540, sort: 420 };

  /* ---------- Contenu des pages ----------
     Un seul endroit à éditer. Les projets reprennent les données réelles
     du site, voir assets/js/projects-data.js. */

  var PROJETS = [
    {
      titre: "Kalaan",
      quoi: "Application mobile de lecture, publiée sur le Play Store",
      rendu: "Conception produit, UI, illustrations",
      image: "/assets/img/projects/kalaan.png",
      url: "/projets/kalaan/",
      sortie: "Étude"
    },
    {
      titre: "Faissel",
      quoi: "Site vitrine d'un prestataire en réseau informatique",
      rendu: "Design d'interfaces et développement assisté par IA",
      image: "/assets/img/projects/faissel.webp",
      url: "https://www.faissel.com/",
      sortie: "Site"
    },
    {
      titre: "Quotidien économique",
      quoi: "Site de presse en ligne, actualité économique",
      rendu: "Design d'interfaces et développement assisté par IA",
      image: "/assets/img/projects/quotidien-economique.webp",
      url: "https://quotidieneconomique.net/",
      sortie: "Site"
    },
    {
      titre: "Dispoz",
      quoi: "Outil d'extraction de palette de couleurs à partir d'une image",
      rendu: "Design d'interfaces et développement assisté par IA",
      image: "/assets/img/projects/dispoz.webp",
      url: "https://wendlac.github.io/dispoz/",
      sortie: "Outil"
    }
  ];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function listeProjets() {
    return '<ul class="projets">' + PROJETS.map(function (p, i) {
      var externe = p.url.indexOf("http") === 0;
      return '<li class="projet">' +
        '<a class="projet__lien" href="' + esc(p.url) + '"' +
           (externe ? ' target="_blank" rel="noopener"' : "") +
           ">" +
          '<span class="projet__corps"><h3 class="projet__titre">' + esc(p.titre) + "</h3>" +
            '<p class="projet__quoi">' + esc(p.quoi) + "</p></span>" +
          '<span class="etiquette projet__rendu">' + esc(p.rendu) + "</span>" +
          '<span class="etiquette etiquette--ink projet__sortie">' + esc(p.sortie) + " &rarr;</span>" +
          /* l'aperçu vit dans la réserve du dossier : il n'apparaît donc
             qu'une fois celui-ci levé, dans la place que la levée dégage,
             et il ne recouvre jamais ce qu'on est en train de lire */
          '<span class="projet__apercu" aria-hidden="true">' +
            '<img src="' + esc(p.image) + '" alt="" loading="lazy">' +
          "</span>" +
        "</a></li>";
    }).join("") + "</ul>";
  }

  function coquille(quoi) {
    return '<div class="coquille">' +
      '<p class="etiquette etiquette--ink">Section non encore dessinée</p>' +
      '<p class="etiquette">' + esc(quoi) + "</p></div>";
  }

  var PAGES = {
    projets: {
      num: "01",
      titre: "Projets",
      corps: listeProjets
    },
    lectures: {
      num: "02",
      titre: "Mes lectures",
      corps: function () { return coquille("Les livres et ce que j'en retiens."); }
    },
    profil: {
      num: "03",
      titre: "Qui suis je?",
      corps: function () { return coquille("Le parcours, la méthode, le collectif Kraafte."); }
    },
  };

  /* ---------- Ouverture ---------- */

  var dossierAppelant = null;

  function phase(nom) {
    if (nom) body.dataset.phase = nom;
    else delete body.dataset.phase;
  }

  function remplir(cle) {
    var p = PAGES[cle];
    document.getElementById("page-titre").textContent = p.titre;
    document.getElementById("page-corps").innerHTML = p.corps();
    document.getElementById("loader-section").textContent = p.titre;
  }

  var enveloppe = document.querySelector(".enveloppe");

  /* La page ouverte est un dialogue modal : tant qu'elle est là, la pile
     derrière ne doit être ni tabulable ni défilable. Sans ça, on tabule
     dans des dossiers qu'on ne voit plus, et la molette fait glisser le
     fond sous la page. */
  function fond(actif) {
    enveloppe.inert = !actif;
    document.documentElement.style.overflow = actif ? "" : "hidden";
  }

  function ouvrir(cle, dossier) {
    if (body.dataset.ouvert) return;
    dossierAppelant = dossier;
    body.dataset.ouvert = cle;
    fond(false);

    if (reduit.matches) {
      remplir(cle);
      page.scrollTop = 0;
      document.getElementById("fermer").focus();
      return;
    }

    phase("monte");
    setTimeout(function () {
      phase("traits");
      // la page est montée pendant que le panneau la cache
      remplir(cle);
      page.scrollTop = 0;
      setTimeout(function () {
        phase("sort");
        setTimeout(function () {
          phase(null);
          document.getElementById("fermer").focus();
        }, TEMPS.sort);
      }, TEMPS.traits);
    }, TEMPS.monte);
  }

  function fermer() {
    if (!body.dataset.ouvert) return;
    delete body.dataset.ouvert;
    phase(null);
    fond(true);
    if (dossierAppelant) { dossierAppelant.focus(); dossierAppelant = null; }
  }

  document.querySelectorAll(".dossier__ouvrir").forEach(function (b) {
    b.addEventListener("click", function () { ouvrir(b.dataset.sheet, b); });
  });

  document.getElementById("fermer").addEventListener("click", fermer);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && body.dataset.ouvert) fermer();
  });

  /* ---------- La grille, à la demande ----------
     Montrer la grille fait partie du propos : c'est la méthode suisse
     rendue visible. */

  var bascule = document.getElementById("bascule-grille");
  bascule.addEventListener("click", function () {
    var on = body.dataset.grille === "true";
    body.dataset.grille = on ? "false" : "true";
    bascule.setAttribute("aria-pressed", on ? "false" : "true");
    bascule.textContent = on ? "Afficher la grille" : "Masquer la grille";
  });
})();
