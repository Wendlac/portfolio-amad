/*
  WALL — tout le contenu de la page tient dans ce fichier, en haut.
  Le balisage ne bouge pas quand le contenu change.
*/

var PROJETS = [
  { nom: "Kalaan",
    quoi: "Une application mobile qui permet de lire des documents et livres en format epub et pdf",
    annee: "2026", lien: "Etude de cas",
    /* Le Play Store est sur la page de l'étude de cas :
       play.google.com/store/apps/details?id=com.pelerain.kalaan
       La ligne mène donc à l'étude, comme sur la maquette, et le
       téléchargement est à un clic de plus. */
    url: "/projets/kalaan/" },
  { nom: "Design system Petrogest",
    quoi: "Conception du design system d’une application de gestion de stations d’essence",
    annee: "2026", lien: "Regarder le projet",
    url: "https://wendlac.github.io/petrogest-design-system/design-system.html" },
  { nom: "Site web Quotidien économique",
    quoi: "Site web du média d’information économique Quotidien économique",
    annee: "2026", lien: "Visiter le site",
    url: "https://quotidieneconomique.net/" },
  { nom: "Site web Faissel",
    quoi: "Site web d’une entreprise de vente et installation de materiel de réseaux informatiques",
    annee: "2026", lien: "Visiter le site",
    url: "https://www.faissel.com/" },
  { nom: "Site web Bil Aka Kora",
    quoi: "Projet fictif, site web de l’artiste musicien burkinabé Bil Aka Kora",
    annee: "2026", lien: "Visiter le site",
    url: "https://wendlac.github.io/bil-aka-kora/" },
  { nom: "Application web Dispoz",
    quoi: "Une application web qui permet de trouver la palette de couleurs d’un visuel",
    annee: "2026", lien: "Visiter le site",
    url: "https://wendlac.github.io/dispoz/" },
  { nom: "Site web Rakiire",
    quoi: "Site web pour le marque de vetement streetwear africain",
    annee: "2026", lien: "Visiter le site",
    url: "https://wendlac.github.io/rakiire/" }
];

/*
  Expérience professionnelle, reprise mot pour mot de la frise « Mon
  parcours » de ta page « Qui suis je? » en ligne : intitulé, employeur,
  année de début et de fin, rien d'autre. C'est volontaire là-bas, ça le
  reste ici.

  L'ordre est le tien : du plus ancien au plus récent, pour que ça se lise
  comme une progression. Ta page le justifiait aussi par le remplissage du
  rail, qui n'existe pas ici — si tu préfères le plus récent en premier,
  c'est reverse() et rien d'autre.

  Les trois postes de 2020 se chevauchent (conseil et formation menés en
  parallèle), classés par mois de début comme sur le CV. Glomira garde donc
  sa place de départ et porte « aujourd'hui », parce que la mission court
  toujours : c'est la correction que ta page porte déjà contre le PDF, qui
  la date à tort de décembre 2024.
*/
var PARCOURS = [
  { quand: "2018 – 2019",         poste: "Product Manager",
    ou: "Zeta Technologies" },
  { quand: "2019 – 2020",         poste: "Principal Product Manager",
    ou: "BAFA Tech" },
  { quand: "2020 – aujourd’hui",  poste: "Consultant Product Designer",
    ou: "Glomira" },
  { quand: "2020 – 2021",         poste: "Chief Operating Officer",
    ou: "Kumakan Studio" },
  { quand: "2020 – 2023",         poste: "Formateur Product / UI-UX Design",
    ou: "Incubateur Université Joseph Ki-Zerbo · Simplon.co · Orange Digital Center" },
  { quand: "2025",                poste: "UI / Product Designer",
    ou: "EXCELIS S.A. (ex-M2i, groupe Coris)" }
];

/*
  Les deux doublons de la maquette sont remplacés par deux titres de la
  page « Mes lectures » du site en ligne. Fanon suit Césaire parce que
  les deux se répondent, c'est déjà l'ordre retenu là-bas.
  Les autres, si tu veux échanger : L'Alchimiste (Paulo Coelho), Steve
  Jobs (Walter Isaacson), Jony Ive (Leander Kahney), So Good They Can't
  Ignore You (Cal Newport), The ONE Thing (Gary Keller).
*/
var LIVRES = [
  { titre: "Cahier d’un retour au pays natal", auteur: "Aimé Césaire" },
  { titre: "Peau noire, masques blancs",       auteur: "Frantz Fanon" },
  { titre: "L’almanack de Naval Ravikant",     auteur: "Eric Jorgenson" },
  { titre: "Steal Like an Artist",             auteur: "Austin Kleon" }
];

var LIENS = [
  /* L'adresse Google Maps est écrite dans la forme documentée par Google
     (api=1), celle qui est garantie stable : elle ouvre la fiche sur le
     web et l'application sur téléphone. Un lien copié depuis la barre
     d'adresse de Maps porte des coordonnées et un identifiant de session,
     et il casse avec le temps. */
  { icone: "lieu",     ou: "Ouagadougou",
    quoi: "C’est là que je réside (enfin, pour le moment)",
    aller: "Visiter Ouaga",
    url: "https://www.google.com/maps/search/?api=1&query=Ouagadougou%2C+Burkina+Faso" },
  { icone: "tiktok",   ou: "Sur Tiktok",
    quoi: "Vous trouverez du contenu sur le design, et mes chroniques sur la tech",
    aller: "Visiter", url: "https://www.tiktok.com/@amadloure" },
  { icone: "youtube",  ou: "Sur Youtube",
    quoi: "Vous y trouverez aussi du contenu sur le design, et mes chroniques sur la tech",
    aller: "Visiter", url: "https://www.youtube.com/@louisamad9118" },
  { icone: "linkedin", ou: "Sur linkedIn",
    quoi: "Mon espace pro où je donne mon avis sur l’industrie de la tech",
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

  /*
    La flèche bouge au survol : celle en place sort par le haut-droit, le
    long de son propre axe, et une seconde arrive du bas-gauche. D'où deux
    copies — une seule ne pourrait pas à la fois partir et revenir — dans
    une boîte qui rogne ce qui dépasse. Voir .fleche dans wall.css.
  */
  var FLECHE = '<span class="fleche" aria-hidden="true">' + I.fleche + I.fleche + "</span>";

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
      '<span class="projet__lien">' + esc(p.lien) + FLECHE + "</span>",
      p.nom + ", " + p.lien) + "</li>";
  }).join("");

  /*
    LE RYTHME D'ARRIVÉE EST LA CHRONOLOGIE.

    Les entrées n'arrivent pas à intervalle fixe : l'écart entre deux est
    proportionnel au nombre d'années qui les sépare. 70 ms de base, plus
    50 ms par année. Les trois postes de 2020 arrivent donc presque
    ensemble — ce qui est vrai, tu les menais en parallèle — et il y a un
    vrai silence avant 2025. La liste seule ne dit pas ça ; le rythme si.

    Calculé ici et non écrit en dur : si tu changes une année, la cadence
    suit. Le dernier part à 700 ms et se pose à 1,2 s.
  */
  var BASE = 70, PAR_AN = 50;
  var retard = 0, anPrecedent = null;

  document.getElementById("parcours").innerHTML = PARCOURS.map(function (p) {
    var an = parseInt(p.quand, 10);
    if (anPrecedent !== null) retard += BASE + (an - anPrecedent) * PAR_AN;
    anPrecedent = an;
    return '<li style="--retard: ' + retard + 'ms">' +
      "<span>" +
        '<span class="parcours__poste">' + esc(p.poste) + "</span>" +
        '<span class="parcours__ou">' + esc(p.ou) + "</span>" +
      "</span>" +
      '<span class="parcours__quand">' + esc(p.quand) + "</span>" +
    "</li>";
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
      '<span class="lien-ligne__aller">' + esc(l.aller) + FLECHE + "</span>",
      l.ou + ", " + l.aller) + "</li>";
  }).join("");

  /* ---------- L'arrivée de la page ----------

     L'en-tête arrive en cascade au chargement ; les sections arrivent
     quand on les atteint. Le drapeau « anime » est posé dans le <head>,
     et il n'y est pas si le système demande moins d'animations : dans ce
     cas rien de tout ceci ne tourne et la page est simplement là.

     Chaque élément n'est observé qu'une fois. Revenir en haut ne rejoue
     pas l'animation — un contenu déjà lu qui réapparaît, c'est un défaut,
     pas un effet. */

  if (document.documentElement.classList.contains("anime")) {
    var cascade = 80;   /* ms entre deux éléments de l'en-tête */

    [".avatar", ".salut", ".chapeau"].forEach(function (sel, i) {
      var el = document.querySelector(sel);
      if (el) setTimeout(function () { el.classList.add("vu"); }, i * cascade);
    });

    var guetteur = new IntersectionObserver(function (vues) {
      vues.forEach(function (v) {
        if (!v.isIntersecting) return;
        v.target.classList.add("vu");
        guetteur.unobserve(v.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });

    var tardifs = document.querySelectorAll(".section.ouvre, .fin.ouvre");
    for (var i = 0; i < tardifs.length; i++) guetteur.observe(tardifs[i]);

    /* Un lien interne emmène peut-être vers une section pas encore
       révélée. Il faut la montrer AVANT que le navigateur ne calcule où
       atterrir, et la montrer d'un coup.

       On enlève « ouvre » au lieu d'ajouter « vu » : « vu » laisse courir
       la transition, donc le bloc est encore 14px trop bas au moment du
       calcul, et le titre se posait à 66 du haut au lieu de 80 — l'écart
       exact de la translation. Sans « ouvre » il n'y a plus de
       translation du tout, et la mesure tombe juste. */
    function devoile(id) {
      var cible = document.getElementById(id);
      var bloc = cible && cible.closest(".ouvre");
      if (!bloc) return;
      bloc.classList.remove("ouvre");
      guetteur.unobserve(bloc);
    }

    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a) devoile(a.getAttribute("href").slice(1));
    });

    /* Même chose pour une adresse partagée qui porte déjà l'ancre. */
    if (location.hash.length > 1) devoile(location.hash.slice(1));
  }

  /* ---------- La jauge ----------

     Une jauge de défilement, et pas un sommaire : --avance remplit la
     barre du milieu, --fin allume le point du bas à l'arrivée.

     L'aiguille POURSUIT la valeur au lieu de s'y coller. Ce n'est pas un
     effet : sur pavé tactile les événements de défilement arrivent par
     paquets irréguliers, et la barre sautillait. En poursuite elle reste
     à environ 4 % derrière pendant un défilement courant, soit 1,4 px sur
     les 35 de la barre — invisible — et elle rattrape en ~400 ms après un
     saut d'ancre, ce qui se lit comme du poids.

     Sans .anime (pas de JS d'animation, ou le système demande moins de
     mouvement), la valeur est posée directement : pas de poursuite.

     La hauteur défilable est mesurée une fois et au redimensionnement,
     pas à chaque événement : la lire force un calcul de mise en page. Les
     révélations ne la changent pas, elles ne jouent que sur l'opacité et
     une translation. */

  var stepper = document.getElementById("stepper");
  var poursuite = document.documentElement.classList.contains("anime");
  var hauteur = 0, cible = 0, affiche = 0, tourne = false;

  function pose(v) {
    stepper.style.setProperty("--avance", v.toFixed(4));
    stepper.style.setProperty("--fin", v > 0.98 ? "1" : "0");
  }

  function suit() {
    affiche += (cible - affiche) * 0.25;
    if (Math.abs(cible - affiche) < 0.0008) { affiche = cible; tourne = false; }
    else requestAnimationFrame(suit);
    pose(affiche);
  }

  function mesure() {
    cible = hauteur > 0 ? Math.min(1, Math.max(0, window.scrollY / hauteur)) : 0;
    if (!poursuite) { affiche = cible; pose(cible); return; }
    if (!tourne) { tourne = true; requestAnimationFrame(suit); }
  }

  function remesureHauteur() {
    hauteur = document.documentElement.scrollHeight - window.innerHeight;
    mesure();
  }

  window.addEventListener("scroll", mesure, { passive: true });
  window.addEventListener("resize", remesureHauteur, { passive: true });
  remesureHauteur();
})();
