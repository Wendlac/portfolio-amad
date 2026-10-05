/*
  Vitrine projets pilotée par une molette graduée.

  Le vocabulaire est celui d'un boîtier photo : une bague crantée que l'on fait
  tourner à la molette, au glisser, au clavier ou en cliquant un nom, avec une
  aimantation sur le cran le plus proche et un repère central qui matérialise la
  sélection.

  Points de structure :

  - Tous les projets sont présents dans le DOM, pas seulement l'actif. On
    n'échange pas le texte d'un panneau unique : on empile les panneaux et on
    montre le bon. Le contenu reste donc indexable et lisible par un lecteur
    d'écran, et la bascule devient un simple fondu.

  - Le rAF ne tourne que pendant un mouvement. Une bague immobile ne consomme
    rien.

  - L'effet WebGL est ailleurs (webgl-media.js) et se branche sur l'évènement
    "showcase:change". La vitrine fonctionne entièrement sans lui.

  Source de données : window.PROJECTS (assets/js/projects-data.js).
*/
(function () {
  "use strict";

  var GAP = 72;            /* espace entre deux noms, en px (écran large) */
  var GAP_NARROW = 26;     /* resserré sous 600px, pour que le nom suivant reste
                              visible au bord, sinon la bague a l'air vide et
                              rien n'indique qu'il y a d'autres projets */
  var SNAP_MS = 520;
  var WHEEL_SENSITIVITY = 0.0022;

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-showcase]");
    var projects = (window.PROJECTS || []).filter(function (p) { return p.image; });
    if (!root || projects.length === 0) return;

    var media = root.querySelector("[data-showcase-media]");
    var metaWrap = root.querySelector("[data-showcase-meta]");
    var track = root.querySelector("[data-dial-track]");
    var dial = root.querySelector("[data-dial]");
    var ticks = root.querySelectorAll("[data-dial-ticks]");
    var currentOut = root.querySelector("[data-dial-current]");
    var totalOut = root.querySelector("[data-dial-total]");
    var prevBtn = root.querySelector("[data-dial-prev]");
    var nextBtn = root.querySelector("[data-dial-next]");

    var last = projects.length - 1;
    var position = 0;        /* index flottant : 1.4 = entre le 2e et le 3e cran */
    var current = -1;        /* index sélectionné ; -1 force le premier passage */
    var spacing = 240;
    var tween = null;
    var frame = 0;
    var panels = [];
    var items = [];
    var images = [];

    /* ---------- Construction ---------- */

    function pad(n) {
      return (n + 1 < 10 ? "0" : "") + (n + 1);
    }

    projects.forEach(function (project, index) {
      var img = document.createElement("img");
      img.src = project.image;
      img.alt = project.imageAlt || "";
      img.width = 656;
      img.height = 410;
      if (index > 0) img.loading = "lazy";
      img.style.opacity = index === 0 ? "1" : "0";
      media.appendChild(img);
      images.push(img);

      var panel = document.createElement("div");
      panel.className = "showcase__panel";
      panel.hidden = index !== 0;

      var number = document.createElement("span");
      number.className = "showcase__index";
      number.textContent = pad(index);

      var title = document.createElement("h3");
      title.className = "showcase__title";
      title.textContent = project.title;

      var desc = document.createElement("p");
      desc.className = "showcase__desc";
      desc.textContent = project.description;

      var cta = document.createElement("a");
      cta.className = "btn btn--dark showcase__cta";
      cta.href = project.url;
      // Une étude de cas vit sur ce site : elle reste dans le même onglet.
      if (/^https?:/.test(project.url)) {
        cta.target = "_blank";
        cta.rel = "noopener";
      }
      cta.setAttribute("data-magnetic", "");
      cta.setAttribute("data-focus-label",
        project.type === "pdf" ? "Ouvrir le PDF"
          : project.type === "etude" ? "Ouvrir l'étude de cas"
          : "Ouvrir le site");
      cta.textContent =
        project.type === "pdf" ? "Voir le PDF"
          : project.type === "etude" ? "Voir l'étude de cas"
          : "Voir le site";

      var arrow = document.createElement("img");
      arrow.className = "btn__arrow";
      arrow.src = "/assets/icons/arrow-right-line.svg";
      arrow.alt = "";
      arrow.width = 24;
      arrow.height = 24;
      cta.appendChild(arrow);

      panel.appendChild(number);
      panel.appendChild(title);
      panel.appendChild(desc);
      panel.appendChild(cta);
      metaWrap.appendChild(panel);
      panels.push(panel);

      var item = document.createElement("button");
      item.type = "button";
      item.className = "dial__item";
      item.textContent = project.title;
      item.setAttribute("data-index", String(index));
      item.addEventListener("click", function () { goTo(index); });
      track.appendChild(item);
      items.push(item);
    });

    if (totalOut) totalOut.textContent = pad(last);
    root.hidden = false;

    /*
      La grille de cartes reste dans le balisage comme repli : elle n'est
      retirée qu'ici, une fois la vitrine réellement construite. Si ce script
      échoue avant cette ligne, le visiteur garde la liste des projets.
    */
    var fallback = document.querySelector("[data-showcase-fallback]");
    if (fallback) fallback.hidden = true;

    /* ---------- Mesure ---------- */

    /*
      L'écart entre deux crans se cale sur le nom le plus large : avec un pas
      calculé sur chaque nom, la bague accélérerait et ralentirait selon la
      longueur des titres, ce qui donne une sensation de mécanique déréglée.
    */
    function measure() {
      var widest = 0;
      items.forEach(function (item) {
        item.style.transform = "";
        widest = Math.max(widest, item.offsetWidth);
      });
      spacing = widest + (track.offsetWidth < 600 ? GAP_NARROW : GAP);
      render();
    }

    /* ---------- Rendu ---------- */

    function render() {
      var centre = track.offsetWidth / 2;

      items.forEach(function (item, index) {
        var offset = (index - position) * spacing;
        var distance = Math.abs(index - position);
        /* Les noms lointains s'effacent : sans ça la bague part en bouillie
           typographique dès qu'il y a plus de trois projets. */
        var fade = Math.max(0, 1 - distance * 0.42);
        item.style.transform =
          "translate3d(" + (centre + offset - item.offsetWidth / 2) + "px,-50%,0)";
        item.style.opacity = String(0.18 + fade * 0.82);
      });

      var shift = -position * spacing;
      for (var t = 0; t < ticks.length; t++) {
        ticks[t].style.backgroundPositionX = shift + "px";
      }
    }

    function setCurrent(index) {
      if (index === current) return;
      current = index;

      panels.forEach(function (panel, i) { panel.hidden = i !== index; });
      items.forEach(function (item, i) { item.classList.toggle("is-current", i === index); });
      images.forEach(function (img, i) { img.style.opacity = i === index ? "1" : "0"; });

      if (currentOut) currentOut.textContent = pad(index);
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === last;

      /* Signal pour webgl-media.js, et point d'accroche pour tout ce qu'on
         voudrait brancher plus tard sans toucher à ce fichier. */
      root.dispatchEvent(new CustomEvent("showcase:change", {
        detail: { index: index, image: projects[index].image, title: projects[index].title }
      }));
    }

    /* ---------- Animation ---------- */

    function loop(now) {
      frame = 0;
      if (!tween) return;

      var t = Math.min((now - tween.start) / tween.duration, 1);
      /* easeOutExpo, même courbe que --ease-out-expo côté CSS */
      var e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      position = tween.from + (tween.to - tween.from) * e;
      render();

      if (t >= 1) {
        tween = null;
        setCurrent(Math.round(position));
        return;
      }
      frame = window.requestAnimationFrame(loop);
    }

    function animateTo(value, duration) {
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || duration === 0) {
        position = value;
        render();
        setCurrent(Math.round(position));
        return;
      }
      tween = { from: position, to: value, start: performance.now(), duration: duration };
      if (!frame) frame = window.requestAnimationFrame(loop);
    }

    function clamp(value) {
      return Math.max(0, Math.min(last, value));
    }

    function goTo(index) {
      animateTo(clamp(index), SNAP_MS);
    }

    function snap() {
      animateTo(clamp(Math.round(position)), SNAP_MS);
    }

    /* ---------- Molette ---------- */

    /*
      On ne capture la molette que si la bague peut effectivement bouger dans
      ce sens. Aux deux extrémités, l'évènement repart au navigateur et la page
      défile normalement : c'est ce qui évite d'enfermer le visiteur dans un
      bandeau de 150px de haut.
    */
    var wheelIdle = 0;
    dial.addEventListener("wheel", function (event) {
      var delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      var next = position + delta * WHEEL_SENSITIVITY;

      if ((position <= 0 && next < 0) || (position >= last && next > last)) return;

      event.preventDefault();
      tween = null;
      position = clamp(next);
      render();
      setCurrent(Math.round(position));

      window.clearTimeout(wheelIdle);
      wheelIdle = window.setTimeout(snap, 140);
    }, { passive: false });

    /* ---------- Glisser ---------- */

    var dragging = false;
    var dragStartX = 0;
    var dragStartPos = 0;
    var dragMoved = false;

    dial.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "touch") return; /* le doigt fait défiler la page */
      dragging = true;
      dragMoved = false;
      dragStartX = event.clientX;
      dragStartPos = position;
      tween = null;
      dial.setPointerCapture(event.pointerId);
      dial.classList.add("is-dragging");
    });

    dial.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      var dx = event.clientX - dragStartX;
      if (Math.abs(dx) > 3) dragMoved = true;
      position = clamp(dragStartPos - dx / spacing);
      render();
      setCurrent(Math.round(position));
    });

    function endDrag(event) {
      if (!dragging) return;
      dragging = false;
      dial.classList.remove("is-dragging");
      if (dial.hasPointerCapture(event.pointerId)) dial.releasePointerCapture(event.pointerId);
      if (dragMoved) snap();
    }

    dial.addEventListener("pointerup", endDrag);
    dial.addEventListener("pointercancel", endDrag);

    /* Un glisser qui se termine sur un nom ne doit pas l'activer au passage. */
    track.addEventListener("click", function (event) {
      if (dragMoved) {
        event.preventDefault();
        event.stopPropagation();
        dragMoved = false;
      }
    }, true);

    /* ---------- Clavier et boutons ---------- */

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

    dial.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") { event.preventDefault(); goTo(current - 1); }
      else if (event.key === "ArrowRight") { event.preventDefault(); goTo(current + 1); }
      else if (event.key === "Home") { event.preventDefault(); goTo(0); }
      else if (event.key === "End") { event.preventDefault(); goTo(last); }
    });

    /* Tabuler jusqu'à un nom hors champ doit amener la bague dessus, sinon le
       focus se pose sur un élément que personne ne voit. */
    items.forEach(function (item, index) {
      item.addEventListener("focus", function () { goTo(index); });
    });

    /* ---------- Cycle de vie ---------- */

    if ("ResizeObserver" in window) {
      new ResizeObserver(measure).observe(track);
    } else {
      window.addEventListener("resize", measure);
    }

    /* Les polices arrivent après le premier rendu : sans cette remesure, l'écart
       entre les crans reste calé sur la police de repli. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }

    measure();
    setCurrent(0);
  });
})();
