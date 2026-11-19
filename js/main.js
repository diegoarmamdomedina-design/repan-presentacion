// REPAN · Presentación web: video, barra compacta y animaciones de entrada.
(function () {
  "use strict";

  var video = document.getElementById("repan-video");
  var cover = document.getElementById("video-cover");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Video ----------
  function hideCover() {
    if (cover) cover.hidden = true;
  }

  function showCover() {
    if (cover) cover.hidden = false;
  }

  function playVideo() {
    if (!video) return;
    hideCover();
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      // Si el navegador bloquea la reproducción, quedan visibles los controles nativos.
      attempt.catch(function () {});
    }
  }

  if (video && cover) {
    cover.addEventListener("click", playVideo);
    video.addEventListener("play", hideCover);
    video.addEventListener("ended", function () {
      if (document.fullscreenElement || document.webkitFullscreenElement) return;
      video.currentTime = 0;
      showCover();
    });
  }

  // Botones "Ver video": bajan hasta el video y lo reproducen (el toque habilita el sonido).
  var playLinks = document.querySelectorAll("[data-play-video]");
  for (var i = 0; i < playLinks.length; i++) {
    playLinks[i].addEventListener("click", function (event) {
      if (!video) return;
      event.preventDefault();
      var section = document.getElementById("video");
      if (section) {
        section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
      if (history.replaceState) history.replaceState(null, "", "#video");
      playVideo();
    });
  }

  // ---------- Barra compacta ----------
  var topbar = document.getElementById("topbar");
  var hero = document.getElementById("inicio");

  function setTopbar(visible) {
    if (!topbar) return;
    topbar.classList.toggle("is-visible", visible);
    topbar.setAttribute("aria-hidden", visible ? "false" : "true");
    var links = topbar.querySelectorAll("a");
    for (var j = 0; j < links.length; j++) {
      links[j].tabIndex = visible ? 0 : -1;
    }
  }

  if ("IntersectionObserver" in window) {
    if (topbar && hero) {
      new IntersectionObserver(function (entries) {
        setTopbar(!entries[0].isIntersecting);
      }, { threshold: 0, rootMargin: "-90px 0px 0px 0px" }).observe(hero);
    }

    // ---------- Animaciones de entrada ----------
    if (!reduceMotion) {
      var items = document.querySelectorAll(".reveal");
      document.documentElement.classList.add("reveal-ready");
      var revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      for (var k = 0; k < items.length; k++) revealer.observe(items[k]);
    }
  }
})();
