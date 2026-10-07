(function () {
  function start() {
    var body = document.body;
    if (!body || !body.classList.contains("fx")) return;

    var BTN = ".btn-outline, .btn-primary, .fp-btn, .cg-btn-ghost, .cg-btn-light, .papers-nav-btn, .fr-lab-btn, .fr-viz-btn, .fr-pop-btn, .fr-note-btn, .biolab-archive-calibrate-btn, .biolab-archive-publish-toggle, .biolab-archive-report-btn, .challenge-cta-link, .prep-tour-trigger, .bio-ludo-setup-btn, .bio-ludo-duel-target-btn, .cg-btn-primary, .prep-picker-result-link, .papers-nav-btn.papers-nav-next, .bio-ludo-roll-btn, .bio-ludo-end-turn-btn, .bio-ludo-duel-btn, .bio-ludo-revive-btn, .tf-quiz-submit";
    var HOT = ".card, .hextra-card, .recent-update-card, " + BTN;
    var REVEAL = ".card, .hextra-card, .recent-update-card, .biolab-hub-step, .fp-card, .fp-mini, .testimonial-quote-block";
    var current = null;
    var queued = null;

    function place(el, e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--fx-x", (e.clientX - r.left) + "px");
      el.style.setProperty("--fx-y", (e.clientY - r.top) + "px");
    }

    document.addEventListener("pointerover", function (e) {
      var el = e.target.closest ? e.target.closest(HOT) : null;
      if (!el || el === current) return;
      current = el;
      place(el, e);
    }, { passive: true });

    document.addEventListener("pointermove", function (e) {
      if (!current || queued) return;
      queued = e;
      requestAnimationFrame(function () {
        var ev = queued;
        queued = null;
        if (!current || !current.isConnected) return;
        if (current.matches(BTN)) return;
        place(current, ev);
      });
    }, { passive: true });

    document.addEventListener("pointerout", function (e) {
      if (current && !current.contains(e.relatedTarget)) current = null;
    }, { passive: true });

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !/[?&]motion=on/.test(window.location.search);
    if (reduce || !("IntersectionObserver" in window)) return;

    var limit = window.innerHeight * 0.92;
    var targets = Array.prototype.filter.call(document.querySelectorAll(REVEAL), function (el) {
      return el.getBoundingClientRect().top > limit;
    });
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add("fx-reveal"); });

    var io = new IntersectionObserver(function (entries) {
      var i = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        el.style.setProperty("--fx-d", (i * 70) + "ms");
        i++;
        el.classList.add("is-in");
        setTimeout(function () {
          el.classList.remove("fx-reveal", "is-in");
          el.style.removeProperty("--fx-d");
        }, 1300 + i * 70);
      });
    }, { rootMargin: "0px 0px -5% 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
