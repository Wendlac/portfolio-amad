/*
  Grille : bascule de l'overlay + alignement optique.

  L'overlay est peuplé depuis les MÊMES variables CSS que le contenu
  (--cols), il ne peut donc pas dériver par rapport aux vraies colonnes.
*/
(function () {
  "use strict";

  /* ---- Bascule : bouton + touche « G » ---- */
  var btn = document.getElementById("gridToggle");

  function setGrid(on) {
    document.body.classList.toggle("grid-on", on);
    if (!btn) return;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    var label = btn.querySelector(".lbl");
    if (label) label.textContent = on ? "Masquer la grille" : "Voir la grille";
  }

  if (btn) {
    btn.addEventListener("click", function () {
      setGrid(!document.body.classList.contains("grid-on"));
    });
  }

  document.addEventListener("keydown", function (e) {
    if ((e.key === "g" || e.key === "G") && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      setGrid(!document.body.classList.contains("grid-on"));
    }
  });

  /* ---- Colonnes numérotées de l'overlay ---- */
  document.querySelectorAll(".guides .cols").forEach(function (host) {
    var n = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--cols").trim() || "12",
      10
    );
    for (var i = 1; i <= n; i++) {
      var col = document.createElement("div");
      col.className = "col";
      var num = document.createElement("span");
      num.textContent = i < 10 ? "0" + i : String(i);
      col.appendChild(num);
      host.appendChild(col);
    }
  });

  /*
    ---- ALIGNEMENT OPTIQUE ----
    Un grand caractère porte une approche gauche (side-bearing) : sa BOÎTE peut
    être pile sur la ligne de colonne alors que son ENCRE, elle, est rentrée.
    On mesure le décalage réel du glyphe avec la police effectivement chargée,
    puis on décale la boîte pour que l'encre tombe sur la ligne.
  */
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var SELECTOR = ".masthead, .numeral, .h2b";

  function alignInk() {
    document.querySelectorAll(SELECTOR).forEach(function (el) {
      el.style.marginLeft = "0px";
      var cs = getComputedStyle(el);
      var ch = (el.textContent || "").trim().charAt(0);
      if (!ch) return;
      if (cs.textTransform === "uppercase") ch = ch.toUpperCase();
      ctx.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
      ctx.textAlign = "left";
      var abl = ctx.measureText(ch).actualBoundingBoxLeft;
      if (isFinite(abl)) el.style.marginLeft = abl.toFixed(2) + "px";
    });
  }

  /*
    `document.fonts.ready` se résout parfois AVANT que les glyphes soient
    réellement mesurables : on mesure alors la police de repli et le décalage
    est faux (constaté : -3px au lieu de -4px). On repasse donc après deux
    trames, et à chaque fin de chargement de police.
  */
  function scheduleAlign() {
    requestAnimationFrame(function () { requestAnimationFrame(alignInk); });
  }

  alignInk();

  if (document.fonts) {
    if (document.fonts.ready) document.fonts.ready.then(scheduleAlign);
    if (document.fonts.addEventListener) {
      document.fonts.addEventListener("loadingdone", scheduleAlign);
    }
  }

  var timer;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(alignInk, 120);
  });
})();
