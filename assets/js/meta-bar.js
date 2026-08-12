/*
  Horloge de la barre méta.

  L'heure affichée est celle de Ouagadougou, pas celle du visiteur : le propos
  est de dire « voici où je suis et quelle heure il est chez moi », ce qui perd
  tout son sens si le fuseau suit le navigateur. Le Burkina Faso est à UTC+0
  toute l'année, sans heure d'été.

  Le <time> est mis à jour en place, sans aria-live : une annonce chaque seconde
  rendrait la page inutilisable au lecteur d'écran. L'attribut datetime, lui,
  est tenu à jour pour rester exploitable par une machine.
*/
(function () {
  "use strict";

  var ZONE = "Africa/Ouagadougou";

  document.addEventListener("DOMContentLoaded", function () {
    /* Plusieurs horloges par page : celle de la barre méta, et celle que
       nav.js pose au pied du panneau mobile, la barre méta étant masquée
       derrière lui quand il est ouvert. */
    var clocks = document.querySelectorAll("[data-clock]");
    if (!clocks.length) return;

    var formatter;
    try {
      formatter = new Intl.DateTimeFormat("fr-FR", {
        timeZone: ZONE,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
    } catch (error) {
      /* Environnement sans base de fuseaux : mieux vaut ne rien afficher qu'une
         heure fausse présentée comme locale. */
      Array.prototype.forEach.call(clocks, function (el) {
        var holder = el.closest(".meta-bar__time") || el.parentElement;
        if (holder) holder.hidden = true;
      });
      return;
    }

    function tick() {
      var now = new Date();
      var text = formatter.format(now);
      var stamp = now.toISOString();
      Array.prototype.forEach.call(clocks, function (el) {
        el.textContent = text;
        el.setAttribute("datetime", stamp);
      });
    }

    tick();

    /*
      Réaligné sur la seconde pleine plutôt qu'un setInterval(1000) lancé à un
      instant quelconque : sinon l'affichage saute deux secondes de temps en
      temps, ce qui se voit sur une horloge.
    */
    function schedule() {
      window.setTimeout(function () {
        tick();
        schedule();
      }, 1000 - (Date.now() % 1000));
    }

    schedule();
  });
})();
