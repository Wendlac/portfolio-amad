(function () {
  "use strict";

  var STORAGE_KEY = "pref-lang";

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-lang-switch] a").forEach(function (link) {
      link.addEventListener("click", function () {
        var lang = link.getAttribute("hreflang");
        if (!lang) return;
        try {
          localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
          /* stockage indisponible — le choix ne persiste pas, sans bloquer la navigation */
        }
      });
    });
  });
})();
