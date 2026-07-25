(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-mobile-nav]");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      var open = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  });

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
