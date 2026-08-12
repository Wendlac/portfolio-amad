/*
  Navigation : menu mobile plein écran et indicateur glissant du menu de bureau.

  Le menu mobile est traité comme une amorce de film qu'on déroule : perforations
  35 mm sur les deux bords, entrées numérotées comme des plans, ouverture par un
  volet qui descend, et pied de panneau reprenant les informations techniques de
  la barre méta.

  Tout l'habillage (numéros, perforations, pied) est ajouté ICI et non dans le
  HTML : le même bloc <nav> est répété dans les sept pages du site, et le
  dupliquer sept fois garantissait qu'il finirait par diverger.
*/
(function () {
  "use strict";

  var CLOSE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'aria-hidden="true" width="22" height="22"><path d="M5 5l14 14M19 5L5 19"/></svg>';

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-mobile-nav]");
    if (!toggle || !menu) return;

    decorate(menu, toggle);

    var links = menu.querySelectorAll("a");
    var backdropTargets = [document.getElementById("main"), document.querySelector(".site-footer")];

    function isOpen() {
      return menu.getAttribute("data-open") === "true";
    }

    function setOpen(open) {
      menu.setAttribute("data-open", String(open));
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      document.documentElement.classList.toggle("is-nav-open", open);

      /*
        Le panneau fermé sort de l'ordre de tabulation par `inert`, pas par le
        visibility:hidden du CSS : celui-ci n'arrive qu'au bout du délai de
        transition, et une transition qui ne s'achève pas (onglet en
        arrière-plan) laisserait des liens invisibles atteignables au clavier.
        `inert` ne dépend d'aucun timing.
      */
      menu.inert = !open;

      /*
        Le panneau recouvre la page : sans neutraliser ce qu'il y a dessous, la
        tabulation continue de parcourir des liens invisibles. `inert` fait ça
        proprement (focus + lecteurs d'écran) ; les navigateurs qui ne le
        connaissent pas ignorent simplement la propriété.
      */
      backdropTargets.forEach(function (el) {
        if (el) el.inert = open;
      });

      if (open) {
        if (links.length) links[0].focus();
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        /* Fermeture sans rendre le focus au bouton : on part vers une autre
           page, le remettre là ferait sauter la vue au dernier moment. */
        menu.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("is-nav-open");
        menu.inert = true;
        backdropTargets.forEach(function (el) { if (el) el.inert = false; });
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) setOpen(false);
    });

    /* Passage en mise en page bureau alors que le menu est ouvert : le panneau
       disparaît en CSS, il faut défaire le verrou de défilement avec lui. */
    var desktop = window.matchMedia("(min-width: 780px)");
    var onDesktopChange = function (event) {
      if (event.matches && isOpen()) setOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onDesktopChange);
    else desktop.addListener(onDesktopChange);
  });

  /* ---------- Habillage du panneau ---------- */

  function decorate(menu, toggle) {
    var list = menu.querySelector(".mobile-nav__list");
    if (!list) return;

    /* Fermé au chargement : hors de l'ordre de tabulation dès maintenant. */
    menu.inert = true;

    toggle.insertAdjacentHTML("beforeend", CLOSE_ICON);
    toggle.lastElementChild.classList.add("nav-toggle__close");
    if (toggle.firstElementChild) toggle.firstElementChild.classList.add("nav-toggle__open");

    ["left", "right"].forEach(function (side) {
      var perf = document.createElement("span");
      perf.className = "mobile-nav__perf mobile-nav__perf--" + side;
      perf.setAttribute("aria-hidden", "true");
      menu.appendChild(perf);
    });

    Array.prototype.forEach.call(list.children, function (item, index) {
      item.classList.add("mobile-nav__item");
      /* Le délai est porté par une variable CSS plutôt que par une règle par
         rang : ajouter une entrée au menu ne demandera pas de toucher au CSS. */
      item.style.setProperty("--rank", String(index));

      var link = item.querySelector("a");
      if (!link) return;

      var num = document.createElement("span");
      num.className = "mobile-nav__num";
      num.setAttribute("aria-hidden", "true");
      num.textContent = (index + 1 < 10 ? "0" : "") + (index + 1);
      link.insertBefore(num, link.firstChild);
    });

    /*
      Pied de panneau : mêmes informations que la barre méta, qui est masquée
      derrière le panneau une fois celui-ci ouvert. Le <time> porte data-clock,
      et meta-bar.js met à jour TOUTES les horloges de la page.
    */
    var foot = document.createElement("div");
    foot.className = "mobile-nav__foot container";
    foot.innerHTML =
      '<span>Ouagadougou, (BF)</span>' +
      '<span class="mobile-nav__time"><span class="meta-bar__dot" aria-hidden="true"></span>' +
      '<time data-clock>--:--:--</time></span>' +
      '<span class="mobile-nav__foot-end">Disponible — projets 2026</span>';
    menu.appendChild(foot);
  }

  /* ---------- Indicateur glissant (menu de bureau) ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    var list = document.querySelector(".site-nav__list");
    var indicator = document.querySelector(".site-nav__indicator");
    if (!list || !indicator) return;

    var links = list.querySelectorAll("a");

    function moveTo(link) {
      indicator.style.left = link.offsetLeft + "px";
      indicator.style.width = link.offsetWidth + "px";
      indicator.style.opacity = "1";
    }

    links.forEach(function (link) {
      link.addEventListener("mouseenter", function () { moveTo(link); });
      link.addEventListener("focus", function () { moveTo(link); });
    });

    list.addEventListener("mouseleave", function () {
      indicator.style.opacity = "0";
    });

    list.addEventListener("focusout", function (e) {
      if (!list.contains(e.relatedTarget)) {
        indicator.style.opacity = "0";
      }
    });
  });
})();
