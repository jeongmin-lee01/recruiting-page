// SPECTRA — GNB scroll shrink/blur + active link state
(function () {
  var gnb = document.querySelector(".gnb");
  if (!gnb) return;

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      gnb.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var current = gnb.dataset.page;
  if (current) {
    gnb.querySelectorAll(".gnb__link").forEach(function (link) {
      if (link.dataset.page === current) link.classList.add("is-active");
    });
  }
})();
