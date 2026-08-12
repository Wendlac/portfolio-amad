/*
  Curseur « collimateur d'autofocus ».

  Quatre équerres suivent le pointeur, puis se verrouillent sur l'élément
  survolé en épousant sa boîte — comme un appareil qui accroche son sujet. Un
  libellé optionnel ([data-focus-label]) s'affiche sous la cible.

  Deux partis pris :

  1. Le curseur natif n'est jamais masqué. Beaucoup de sites le remplacent ; si
     le script échoue ou qu'une frame saute, l'utilisateur se retrouve alors
     sans pointeur. Ici les équerres viennent en surcouche, le pointeur système
     reste la référence.

  2. Rien ne s'affiche sans pointeur fin (voir la media query dans motion.css).
     Au doigt il n'y a pas de survol, et l'anneau resterait figé où le dernier
     appui l'a laissé.
*/
(function () {
  "use strict";

  var fine = window.matchMedia("(pointer: fine)").matches;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduceMotion) return;

  var SIZE_FREE = 26;      /* côté de l'anneau au repos, en px */
  var PADDING = 10;        /* marge autour d'une cible verrouillée */
  var EASE = 0.18;         /* fraction du chemin parcourue par frame */

  document.addEventListener("DOMContentLoaded", function () {
    var ring = document.createElement("div");
    ring.className = "focus-ring";
    ring.setAttribute("aria-hidden", "true");

    var corners = {};
    ["tl", "tr", "bl", "br"].forEach(function (key) {
      var corner = document.createElement("span");
      corner.className = "focus-ring__corner focus-ring__corner--" + key;
      ring.appendChild(corner);
      corners[key] = corner;
    });

    var label = document.createElement("span");
    label.className = "focus-ring__label";
    ring.appendChild(label);
    document.body.appendChild(ring);

    /* État visé (target) et état affiché (shown) : l'écart entre les deux est
       comblé un peu à chaque frame, c'est ce qui donne l'inertie. */
    var target = { x: -100, y: -100, w: SIZE_FREE, h: SIZE_FREE };
    var shown = { x: -100, y: -100, w: SIZE_FREE, h: SIZE_FREE };
    var locked = null;
    var visible = false;
    var frame = 0;

    function selectorTargets() {
      return "a[href], button:not([disabled]), [data-focus]";
    }

    function lockOn(el) {
      locked = el;
      ring.classList.add("is-locked");
      var text = el.getAttribute("data-focus-label");
      label.textContent = text || "";
      label.style.display = text ? "" : "none";
    }

    function release() {
      locked = null;
      ring.classList.remove("is-locked");
      label.textContent = "";
    }

    document.addEventListener("pointermove", function (event) {
      if (event.pointerType !== "mouse") return;

      if (!visible) {
        visible = true;
        ring.classList.add("is-active");
      }

      target.x = event.clientX;
      target.y = event.clientY;

      var hit = event.target.closest ? event.target.closest(selectorTargets()) : null;
      if (hit !== locked) {
        if (hit) lockOn(hit);
        else release();
      }
    });

    document.addEventListener("pointerleave", function () {
      visible = false;
      ring.classList.remove("is-active");
    });

    /*
      La boîte de la cible est relue à chaque frame, pas seulement à
      l'accrochage : un élément peut bouger sous le curseur (scroll, molette de
      la vitrine, animation d'apparition) et les équerres doivent le suivre.
    */
    function measure() {
      if (!locked || !locked.isConnected) {
        if (locked) release();
        target.w = SIZE_FREE;
        target.h = SIZE_FREE;
        return;
      }
      var rect = locked.getBoundingClientRect();
      target.x = rect.left + rect.width / 2;
      target.y = rect.top + rect.height / 2;
      target.w = rect.width + PADDING * 2;
      target.h = rect.height + PADDING * 2;
    }

    function render() {
      measure();

      shown.x += (target.x - shown.x) * EASE;
      shown.y += (target.y - shown.y) * EASE;
      shown.w += (target.w - shown.w) * EASE;
      shown.h += (target.h - shown.h) * EASE;

      var halfW = shown.w / 2;
      var halfH = shown.h / 2;

      ring.style.transform = "translate3d(" + shown.x + "px," + shown.y + "px,0)";
      corners.tl.style.transform = "translate(" + (-halfW) + "px," + (-halfH) + "px)";
      corners.tr.style.transform = "translate(" + (halfW - 10) + "px," + (-halfH) + "px)";
      corners.bl.style.transform = "translate(" + (-halfW) + "px," + (halfH - 10) + "px)";
      corners.br.style.transform = "translate(" + (halfW - 10) + "px," + (halfH - 10) + "px)";
      label.style.transform = "translate(-50%," + halfH + "px)";

      frame = window.requestAnimationFrame(render);
    }

    frame = window.requestAnimationFrame(render);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
      } else {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(render);
      }
    });
  });
})();
