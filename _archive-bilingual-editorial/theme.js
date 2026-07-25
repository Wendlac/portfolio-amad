(function () {
  "use strict";

  var STORAGE_KEY = "pref-theme";
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function store(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* stockage indisponible (navigation privée) — le choix ne persiste pas, sans bloquer */
    }
  }

  applyTheme(getStored());

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var currentlyDark = current ? current === "dark" : systemDark;
      var next = currentlyDark ? "light" : "dark";
      applyTheme(next);
      store(next);
      toggle.setAttribute("aria-pressed", String(next === "dark"));
    });

    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var current = root.getAttribute("data-theme");
    var isDark = current ? current === "dark" : systemDark;
    toggle.setAttribute("aria-pressed", String(isDark));
  });
})();
