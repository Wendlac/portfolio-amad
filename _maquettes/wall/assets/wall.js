/*
  WALL — tout le contenu de la page tient dans ce fichier, en haut.
  Le balisage ne bouge pas quand le contenu change.
*/

var PROJETS = [
  { nom: "Kalaan",
    quoi: "Une application mobile qui permet de lire des documents et livres en format epub et pdf",
    annee: "2026", lien: "Etude de cas",
    // TODO : lien Play Store, que je n'ai pas.
    url: "/projets/kalaan/" },
  { nom: "Design system Petrogest",
    quoi: "Conception du design system d'une application de gestion de stations d'essence",
    annee: "2026", lien: "Regarder le projet",
    url: null },
  { nom: "Site web Quotidien économique",
    quoi: "Site web du média d'information économique Quotidien économique",
    annee: "2026", lien: "Visiter le site",
    url: "https://quotidieneconomique.net/" },
  { nom: "Site web Faissel",
    quoi: "Site web d'une entreprise de vente et installation de materiel de réseaux informatiques",
    annee: "2026", lien: "Visiter le site",
    url: "https://www.faissel.com/" },
  { nom: "Site web Bil Aka Kora",
    quoi: "Projet fictif, site web de l'artiste musicien burkinabé Bil Aka Kora",
    annee: "2026", lien: "Visiter le site",
    url: null },
  { nom: "Application web Dispoz",
    quoi: "Une application web qui permet de trouver la palette de couleurs d'un visuel",
    annee: "2026", lien: "Visiter le site",
    url: "https://wendlac.github.io/dispoz/" },
  { nom: "Site web Rakiire",
    quoi: "Site web pour le marque de vetement streetwear africain",
    annee: "2026", lien: "Visiter le site",
    url: null }
];

var LIVRES = [
  { titre: "Cahier d'un retour au pays natal", auteur: "Aimé Cesaire" },
  { titre: "L'almanack de Naval Ravikant",     auteur: "Eric Jorgenson" },
  { titre: "Cahier d'un retour au pays natal", auteur: "Aimé Cesaire" },
  { titre: "Cahier d'un retour au pays natal", auteur: "Aimé Cesaire" }
];

var LIENS = [
  { icone: "lieu",     ou: "Ouagadougou",
    quoi: "C'est là que je réside (enfin, pour le moment)",
    aller: "Visiter Ouaga", url: null },
  { icone: "tiktok",   ou: "Sur Tiktok",
    quoi: "Vous trouverez du contenu sur le design, et mes chroniques sur la tech",
    aller: "Visiter", url: null },
  { icone: "youtube",  ou: "Sur Tiktok",
    quoi: "Vous y trouverez aussi du contenu sur le design, et mes chroniques sur la tech",
    aller: "Visiter", url: null },
  { icone: "linkedin", ou: "Sur linkedIn",
    quoi: "Mon espace pro où je donne mon avis sur l'industrie de la tech",
    aller: "Visiter", url: "https://www.linkedin.com/in/amad-louis-loure" },
  { icone: "email",    ou: "Par email",
    quoi: "Si vous avez un projet ou prendre contact",
    aller: "hello@amadlouis.site", url: "mailto:hello@amadlouis.site" }
];

(function () {
  "use strict";

  /* Icônes Phosphor, tracés d'origine (viewBox 256). */
  function ic(d) {
    return '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="' + d + '"/></svg>';
  }
  var I = {
    annee: ic("M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z"),
    fleche: ic("M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"),
    lieu: ic("M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"),
    tiktok: ic("M224,72a48.05,48.05,0,0,1-48-48,8,8,0,0,0-8-8H128a8,8,0,0,0-8,8V156a20,20,0,1,1-28.57-18.08A8,8,0,0,0,96,130.69V88a8,8,0,0,0-9.4-7.88C50.91,86.48,24,119.1,24,156a76,76,0,0,0,152,0V116.29A103.25,103.25,0,0,0,224,128a8,8,0,0,0,8-8V80A8,8,0,0,0,224,72Zm-8,39.64a87.19,87.19,0,0,1-43.33-16.15A8,8,0,0,0,160,102v54a60,60,0,0,1-120,0c0-25.9,16.64-49.13,40-57.6v27.67A36,36,0,1,0,136,156V32h24.5A64.14,64.14,0,0,0,216,87.5Z"),
    youtube: ic("M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z"),
    linkedin: ic("M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"),
    email: ic("M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z")
  };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* Une ligne sans URL reste une ligne, pas un lien mort : on ne met un
     <a> que là où il y a vraiment où aller. */
  function enveloppe(url, classe, dedans, titre) {
    if (!url) return '<div class="' + classe + '">' + dedans + "</div>";
    var ext = url.indexOf("http") === 0;
    return '<a class="' + classe + '" href="' + esc(url) + '"' +
           (ext ? ' target="_blank" rel="noopener"' : "") +
           (titre ? ' aria-label="' + esc(titre) + '"' : "") + ">" + dedans + "</a>";
  }

  document.getElementById("projets").innerHTML = PROJETS.map(function (p) {
    return "<li>" + enveloppe(p.url, "projet",
      "<span>" +
        '<h3 class="projet__nom">' + esc(p.nom) + "</h3>" +
        '<p class="projet__quoi">' + esc(p.quoi) + "</p>" +
      "</span>" +
      '<span class="projet__annee">' + I.annee + esc(p.annee) + "</span>" +
      '<span class="projet__lien">' + esc(p.lien) + I.fleche + "</span>",
      p.nom + ", " + p.lien) + "</li>";
  }).join("");

  document.getElementById("livres").innerHTML = LIVRES.map(function (l) {
    return "<li>" +
      '<span class="livre__titre">' + esc(l.titre) + "</span>" +
      '<span class="livre__auteur">' + esc(l.auteur) + "</span>" +
    "</li>";
  }).join("");

  document.getElementById("liens").innerHTML = LIENS.map(function (l) {
    return "<li>" + enveloppe(l.url, "lien-ligne",
      '<span class="lien-ligne__ou">' + I[l.icone] + esc(l.ou) + "</span>" +
      '<span class="lien-ligne__quoi">' + esc(l.quoi) + "</span>" +
      '<span class="lien-ligne__aller">' + esc(l.aller) + I.fleche + "</span>",
      l.ou + ", " + l.aller) + "</li>";
  }).join("");

  /* ---------- Le stepper ----------
     Il suit le défilement. --avance remplit la barre du milieu, --fin
     allume le point du bas quand on touche la fin. */

  var stepper = document.getElementById("stepper");
  var tic = false;

  function majStepper() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    stepper.style.setProperty("--avance", p.toFixed(3));
    stepper.style.setProperty("--fin", p > 0.98 ? "1" : "0");
    tic = false;
  }

  window.addEventListener("scroll", function () {
    if (!tic) { tic = true; requestAnimationFrame(majStepper); }
  }, { passive: true });

  window.addEventListener("resize", majStepper, { passive: true });
  majStepper();
})();
