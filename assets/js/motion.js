/*
  Micro-animations transversales, sur GSAP + ScrollTrigger.

  Quatre choses, toutes optionnelles :
  - les titres d'affichage se composent lettre par lettre à l'apparition ;
  - les boutons sombres deviennent légèrement magnétiques sous la souris ;
  - le portrait dérive au scroll, plus lentement que la page ;
  - la page s'ouvre en fondu et se referme avant de naviguer.

  Rien ici n'est nécessaire à la lecture du site. Si GSAP n'est pas là, le
  fichier sort immédiatement et tout reste en place, les titres sont déjà
  visibles dans le HTML, ce sont les animations qui viennent après coup, jamais
  l'inverse. C'est aussi pour ça qu'on ne pose jamais d'opacité 0 en CSS sur du
  contenu : une animation qui ne se déclenche pas ne doit pas pouvoir effacer
  du texte.
*/
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var gsap = window.gsap;
  var hasScrollTrigger = !!(gsap && window.ScrollTrigger);
  if (hasScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  document.addEventListener("DOMContentLoaded", function () {
    /* Sans dépendance : doit tourner même si GSAP n'a pas été chargé. */
    rackFocus();

    if (!gsap) return;

    if (!reduceMotion) {
      magneticButtons();
      portraitDrift();
    }
    timeline();
    pageTransitions();
  });

  /* ---------- Mise au point des titres ---------- */

  /*
    Se contente de poser une classe à l'entrée dans le champ ; toute
    l'animation est dans motion.css (@keyframes rack-focus), et le commentaire
    là-bas explique pourquoi. Une seule fois par titre : un titre qui
    refait sa mise au point à chaque passage devient un tic.
  */
  function rackFocus() {
    var targets = document.querySelectorAll("[data-focus-in]");
    if (!targets.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-focusing");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Frise du parcours ---------- */

  /*
    Le trait plein se remplit au scroll et les pastilles s'allument au passage.
    Appelé même en mouvement réduit : dans ce cas ScrollTrigger ne fait que
    poser une classe au bon moment, sans rien animer, l'information « où en
    suis-je dans la frise » reste utile, c'est le mouvement qui ne l'est pas.
  */
  function timeline() {
    if (!hasScrollTrigger) return;

    var list = document.querySelector("[data-timeline]");
    if (!list) return;

    var progress = list.querySelector("[data-timeline-progress]");
    var entries = list.querySelectorAll(".timeline__entry");

    if (progress && !reduceMotion) {
      gsap.to(progress, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: list,
          start: "top 65%",
          end: "bottom 80%",
          scrub: 0.4
        }
      });
    }

    entries.forEach(function (entry) {
      window.ScrollTrigger.create({
        trigger: entry,
        start: "top 70%",
        onEnter: function () { entry.classList.add("is-passed"); },
        onLeaveBack: function () { entry.classList.remove("is-passed"); }
      });
    });
  }

  /* ---------- Boutons magnétiques ---------- */

  /*
    Le bouton suit le curseur sur un tiers de l'écart, plafonné : au-delà, il se
    décolle visiblement de sa place et la cible devient plus difficile à
    atteindre qu'un bouton immobile, l'effet se retourne contre l'utilisateur.
  */
  function magneticButtons() {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      var moveX = gsap.quickTo(btn, "x", { duration: 0.5, ease: "expo.out" });
      var moveY = gsap.quickTo(btn, "y", { duration: 0.5, ease: "expo.out" });
      var LIMIT = 14;

      btn.addEventListener("pointermove", function (event) {
        var rect = btn.getBoundingClientRect();
        var dx = event.clientX - (rect.left + rect.width / 2);
        var dy = event.clientY - (rect.top + rect.height / 2);
        moveX(gsap.utils.clamp(-LIMIT, LIMIT, dx * 0.35));
        moveY(gsap.utils.clamp(-LIMIT, LIMIT, dy * 0.35));
      });

      btn.addEventListener("pointerleave", function () {
        moveX(0);
        moveY(0);
      });
    });
  }

  /* ---------- Dérive du portrait ---------- */

  function portraitDrift() {
    if (!hasScrollTrigger) return;

    document.querySelectorAll("[data-drift]").forEach(function (el) {
      gsap.to(el, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6
        }
      });
    });
  }

  /* ---------- Ouverture et fermeture de page ---------- */

  /*
    Un fondu au départ vers une autre page du site, pour éviter le clignotement
    blanc entre deux chargements. Volontairement conservateur : on ne détourne
    que les clics simples, sur des liens internes, sans modificateur, un
    ctrl-clic, un clic milieu, une ancre ou un lien externe passent tout droit.
    Et le fondu est court : si la page suivante est lente, mieux vaut un flash
    qu'une attente ajoutée à une attente.
  */
  /*
    Le fondu d'OUVERTURE est en CSS (voir @keyframes page-in dans motion.css),
    pas ici. Piloté par GSAP, il commençait par poser opacity:0 sur le <body> et
    comptait sur le rAF pour revenir à 1 : dans un onglet ouvert en arrière-plan
    le rAF est gelé, et la page restait entièrement blanche jusqu'à ce qu'on lui
    donne le focus. Une animation CSS, elle, se termine toujours.

    Ne reste ici que la fermeture, qui n'a pas ce défaut : si le JS ne s'exécute
    pas, le lien fonctionne normalement, sans fondu.
  */
  function pageTransitions() {
    if (reduceMotion) return;

    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var link = event.target.closest && event.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      var url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      if (url.href === window.location.href) return;

      event.preventDefault();

      /*
        On a pris la main sur le clic : il faut désormais GARANTIR la
        navigation. Si le rAF se fige entre-temps (onglet passé en arrière-plan
        pendant le fondu), onComplete ne viendra jamais et le lien serait mort.
        D'où le garde-fou : le premier des deux qui arrive navigue.
      */
      var navigated = false;
      function go() {
        if (navigated) return;
        navigated = true;
        window.location.href = url.href;
      }

      window.setTimeout(go, 400);
      gsap.to(document.body, { opacity: 0, duration: 0.22, ease: "power1.in", onComplete: go });
    });

    /*
      Retour arrière depuis le cache du navigateur : la page revient avec
      l'opacité 0 laissée par le fondu de départ. Il faut la remettre à la main.
    */
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) gsap.set(document.body, { opacity: 1 });
    });
  }
})();
