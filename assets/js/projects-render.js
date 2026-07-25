/*
  Construit les cartes de la section "Projets" à partir de window.PROJECTS
  (assets/js/projects-data.js). Rien ici ne doit être modifié pour ajouter
  ou retirer un projet — voir EF-02 du cahier des charges.
*/
(function () {
  "use strict";

  function badgeLabel(type) {
    return type === "pdf" ? "PDF" : "Site en ligne";
  }

  function buildCard(project) {
    var article = document.createElement("article");
    article.className = "project-card";
    article.setAttribute("data-reveal", "");

    var media = document.createElement("div");
    media.className = "project-card__media";

    var badges = document.createElement("div");
    badges.className = "project-card__badges";

    var typeBadge = document.createElement("span");
    typeBadge.className = "project-card__badge";
    typeBadge.textContent = badgeLabel(project.type);
    badges.appendChild(typeBadge);

    if (project.status === "en-cours") {
      var statusBadge = document.createElement("span");
      statusBadge.className = "project-card__badge project-card__badge--status";
      statusBadge.textContent = "En cours";
      badges.appendChild(statusBadge);
    }

    media.appendChild(badges);

    var img = document.createElement("img");
    img.src = project.image;
    img.alt = project.imageAlt || "";
    img.loading = "lazy";
    img.width = 656;
    img.height = 436;
    media.appendChild(img);

    var title = document.createElement("h3");
    title.className = "project-card__title";
    title.textContent = project.title;

    var meta = document.createElement("p");
    meta.className = "project-card__meta";
    meta.textContent = project.description;

    var cta = document.createElement("a");
    cta.className = "btn btn--dark project-card__cta";
    cta.href = project.url;
    cta.target = "_blank";
    cta.rel = "noopener";
    cta.textContent = project.type === "pdf" ? "Voir le PDF" : "Voir le site";

    article.appendChild(media);
    article.appendChild(title);
    article.appendChild(meta);
    article.appendChild(cta);

    return article;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var container = document.getElementById("projects-list");
    if (!container || !window.PROJECTS) return;

    window.PROJECTS.forEach(function (project) {
      if (!project.image) return; // EF-05 : pas d'aperçu, pas de publication
      container.appendChild(buildCard(project));
    });

    // Les cartes injectées après coup doivent être prises en compte par
    // l'observer de reveal.js, qui n'a scanné le DOM qu'au chargement initial.
    if (window.observeReveals) {
      window.observeReveals(container.querySelectorAll("[data-reveal]"));
    }
  });
})();
