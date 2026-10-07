/*
  LA CARTE — un seul tableau à éditer, comme dans assets/js/projects-data.js.

  titre   : nom du projet
  resume  : la phrase courte, carte repliée (celle de la maquette)
  detail  : la phrase longue, carte dépliée
  annee   : facultative — la ligne n'apparaît pas si c'est null
  role    : facultatif, idem
  image   : le visuel du dépliant
  cta     : libellé de la barre d'action
  url     : où elle mène
*/
var PROJETS = [
  {
    titre: "Kalaan",
    resume: "Application mobile qui permet de lire des livres en format epub et pdf.",
    detail: "Kalaan est une application sur Android qui permet de lire des documents en format PDf et epub.",
    annee: "2026",
    role: "Ui design, developpement assisté par IA de la version 1",
    image: "/assets/img/projects/kalaan.png",
    imageAlt: "Bannière de Kalaan : le logotype, la promesse « Lis tes livres, tiens ta série » et l'écureuil mascotte",
    cta: "Télécharger Kalaan",
    // TODO : lien Play Store, que je n'ai pas.
    url: "/projets/kalaan/"
  },
  {
    titre: "Faissel",
    resume: "Site vitrine d'un prestataire en réseau informatique, son catalogue de matériel et de services.",
    detail: "Faissel est le site vitrine d'un prestataire en réseau informatique : son catalogue de matériel et de services, consultable par ses clients.",
    annee: null,
    role: "Design d'interfaces et développement assisté par IA",
    image: "/assets/img/projects/faissel.webp",
    imageAlt: "Page d'accueil du site Faissel, présentant ses solutions réseau pour entreprises",
    cta: "Voir le site",
    url: "https://www.faissel.com/"
  },
  {
    titre: "Quotidien économique",
    resume: "Site de presse en ligne, dédié à l'actualité économique.",
    detail: "Quotidien économique est un site de presse en ligne, dédié à l'actualité économique.",
    annee: null,
    role: "Design d'interfaces et développement assisté par IA",
    image: "/assets/img/projects/quotidien-economique.webp",
    imageAlt: "Page d'accueil du site Quotidien économique, un média d'actualité économique",
    cta: "Voir le site",
    url: "https://quotidieneconomique.net/"
  },
  {
    titre: "Dispoz",
    resume: "Outil web qui extrait une palette de couleurs à partir d'une image.",
    detail: "Dispoz est un outil web qui extrait une palette de couleurs à partir d'une image.",
    annee: null,
    role: "Design d'interfaces et développement assisté par IA",
    image: "/assets/img/projects/dispoz.webp",
    imageAlt: "Page d'accueil de Dispoz, un outil d'extraction de palette de couleurs à partir d'une image",
    cta: "Ouvrir Dispoz",
    url: "https://wendlac.github.io/dispoz/"
  }
];

(function () {
  "use strict";

  /* Icônes Phosphor, tracés d'origine (viewBox 256). */
  function ic(d, poids) {
    return '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">' +
           '<path d="' + d + '"/></svg>';
  }
  var ICONES = {
    precedent: ic("M201.75,30.52a20,20,0,0,0-20.3.53L68,102V40a12,12,0,0,0-24,0V216a12,12,0,0,0,24,0V154l113.45,71A20,20,0,0,0,212,208.12V47.88A19.86,19.86,0,0,0,201.75,30.52ZM188,200.73,71.7,128,188,55.27Z"),
    suivant: ic("M200,28a12,12,0,0,0-12,12v62l-113.45-71A20,20,0,0,0,44,47.88V208.12A20,20,0,0,0,74.55,225L188,154v62a12,12,0,0,0,24,0V40A12,12,0,0,0,200,28ZM68,200.73V55.27L184.3,128Z"),
    croix: ic("M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"),
    annee: ic("M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z"),
    role: ic("M224,40V76a8,8,0,0,1-16,0V48H180a8,8,0,0,1,0-16h36A8,8,0,0,1,224,40Zm-8,132a8,8,0,0,0-8,8v28H180a8,8,0,0,0,0,16h36a8,8,0,0,0,8-8V180A8,8,0,0,0,216,172ZM76,208H48V180a8,8,0,0,0-16,0v36a8,8,0,0,0,8,8H76a8,8,0,0,0,0-16ZM40,84a8,8,0,0,0,8-8V48H76a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8V76A8,8,0,0,0,40,84Zm136,92a8,8,0,0,1-6.41-3.19,52,52,0,0,0-83.2,0,8,8,0,1,1-12.8-9.62A67.94,67.94,0,0,1,101,141.51a40,40,0,1,1,53.94,0,67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,176,176Zm-48-40a24,24,0,1,0-24-24A24,24,0,0,0,128,136Z"),
    sortie: ic("M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z")
  };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var carte = document.getElementById("carte");
  var n = PROJETS.length;
  var courant = 0;

  var el = {
    img:      document.getElementById("c-image"),
    titre:    document.getElementById("c-titre"),
    resume:   document.getElementById("c-resume"),
    texte:    document.getElementById("c-texte"),
    meta:     document.getElementById("c-meta"),
    cta:      document.getElementById("c-cta"),
    etat:     document.getElementById("c-etat"),
    declench: document.getElementById("c-declencheur")
  };

  function ligneMeta(icone, texte) {
    return texte ? "<li>" + ICONES[icone] + "<span>" + esc(texte) + "</span></li>" : "";
  }

  function remplir(i) {
    var p = PROJETS[i];
    var externe = p.url.indexOf("http") === 0;

    el.img.src = p.image;
    el.img.alt = p.imageAlt;
    el.titre.textContent = p.titre;
    el.resume.textContent = p.resume;
    el.texte.textContent = p.detail;
    el.meta.innerHTML = ligneMeta("annee", p.annee) + ligneMeta("role", p.role);
    el.cta.href = p.url;
    el.cta.innerHTML = esc(p.cta) + ICONES.sortie;
    if (externe) { el.cta.target = "_blank"; el.cta.rel = "noopener"; }
    else { el.cta.removeAttribute("target"); el.cta.removeAttribute("rel"); }

    el.declench.setAttribute("aria-label", p.titre + ", voir le détail du projet");
    el.etat.textContent = "Projet " + (i + 1) + " sur " + n + " : " + p.titre;
  }

  function aller(pas) {
    courant = (courant + pas + n) % n;
    remplir(courant);
  }

  function ouvrir(oui) {
    carte.dataset.ouverte = oui ? "true" : "false";
    setTimeout(function () {
      if (carte.dataset.ouverte === "true") document.getElementById("c-fermer").focus();
      else el.declench.focus();
    }, 120);
  }

  el.declench.addEventListener("click", function () { ouvrir(true); });
  document.getElementById("c-fermer").addEventListener("click", function () { ouvrir(false); });

  document.querySelectorAll("[data-pas]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();          // ne pas déplier en changeant de projet
      aller(parseInt(b.dataset.pas, 10));
    });
  });

  /* ---------- Menu ---------- */

  var pilule = document.getElementById("pilule");
  var body = document.body;

  function menu(ouvert) {
    body.classList.toggle("menu-ouvert", ouvert);
    pilule.setAttribute("aria-expanded", ouvert ? "true" : "false");
    pilule.textContent = ouvert ? "Fermer" : "Menu";
    if (ouvert) {
      setTimeout(function () {
        var a = document.querySelector(".menu a");
        if (a && body.classList.contains("menu-ouvert")) a.focus();
      }, 300);
    } else { pilule.focus(); }
  }

  pilule.addEventListener("click", function () {
    menu(!body.classList.contains("menu-ouvert"));
  });

  /* Échap ferme ce qui est ouvert : le menu d'abord, sinon la carte. */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (body.classList.contains("menu-ouvert")) menu(false);
    else if (carte.dataset.ouverte === "true") ouvrir(false);
  });

  /* Flèches : on circule entre les projets, carte repliée. */
  document.addEventListener("keydown", function (e) {
    if (carte.dataset.ouverte === "true" || body.classList.contains("menu-ouvert")) return;
    if (e.key === "ArrowRight") aller(1);
    else if (e.key === "ArrowLeft") aller(-1);
  });

  document.getElementById("c-fermer").innerHTML = ICONES.croix;
  document.querySelector('[data-pas="-1"] .ic').innerHTML = ICONES.precedent;
  document.querySelector('[data-pas="1"] .ic').innerHTML = ICONES.suivant;

  remplir(0);
})();
