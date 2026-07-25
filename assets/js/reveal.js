(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var observer = null;

  function initObserver() {
    if (observer || reduceMotion || !("IntersectionObserver" in window)) return;
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
  }

  // Enregistre des éléments [data-reveal] ajoutés dynamiquement après le
  // chargement initial (ex. cartes injectées par projects-render.js).
  window.observeReveals = function (items) {
    if (!items || !items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    initObserver();
    items.forEach(function (el) { observer.observe(el); });
  };

  document.addEventListener("DOMContentLoaded", function () {
    var items = document.querySelectorAll("[data-reveal]");
    window.observeReveals(items);
  });
})();
