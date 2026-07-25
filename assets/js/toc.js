(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var toc = document.querySelector("[data-case-toc]");
    if (!toc || !("IntersectionObserver" in window)) return;

    var links = toc.querySelectorAll("a[href^='#']");
    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) sections.push({ link: link, section: section });
    });
    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = sections.find(function (s) { return s.section === entry.target; });
          if (!match) return;
          if (entry.isIntersecting) {
            sections.forEach(function (s) { s.link.removeAttribute("aria-current"); });
            match.link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(function (s) { observer.observe(s.section); });
  });
})();
