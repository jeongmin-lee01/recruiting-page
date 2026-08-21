// SPECTRA — Scroll reveal + count-up, respects prefers-reduced-motion
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealTargets = document.querySelectorAll("[data-reveal]");
  if (revealTargets.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revealTargets.forEach(function (el, i) {
        el.style.transitionDelay = reduceMotion ? "0ms" : Math.min(i * 60, 240) + "ms";
        io.observe(el);
      });
    }
  }

  var counters = document.querySelectorAll("[data-counter]");
  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.dataset.counter);
      var suffix = el.dataset.suffix || "";
      var decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
      if (reduceMotion) {
        el.textContent = target.toLocaleString("ko-KR", { maximumFractionDigits: decimals }) + suffix;
        return;
      }
      var duration = 1200;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        el.textContent = value.toLocaleString("ko-KR", { maximumFractionDigits: decimals }) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var counterIo = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              run(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) { counterIo.observe(el); });
    } else {
      counters.forEach(run);
    }
  }
})();
