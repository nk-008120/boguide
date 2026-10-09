(function () {
  function start() {
    var root = document.getElementById("bioclash-leaderboard-root") || document.getElementById("bioclash-round-leaderboard-root");
    var bg = root && root.querySelector(".bioclash-leaderboard-bg, .bioclash-round-leaderboard-bg");
    var round = !!root && root.id === "bioclash-round-leaderboard-root";
    if (!bg) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !/[?&]motion=on/.test(window.location.search);
    var fine = window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches;
    var conn = navigator.connection;
    var lite = !!conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""));

    function layer(tag, cls) {
      var node = document.createElement(tag);
      node.className = cls;
      node.setAttribute("aria-hidden", "true");
      bg.insertAdjacentElement("afterend", node);
      return node;
    }

    layer("div", "hof-grain");
    var canvas = layer("canvas", "hof-fluid");

    var PANEL = ".bioclash-leaderboard-panel, .bioclash-panel";
    root.addEventListener("pointermove", function (e) {
      var panel = e.target.closest ? e.target.closest(PANEL) : null;
      if (!panel) return;
      var r = panel.getBoundingClientRect();
      panel.style.setProperty("--hof-x", (e.clientX - r.left) + "px");
      panel.style.setProperty("--hof-y", (e.clientY - r.top) + "px");
    }, { passive: true });

    if (reduce) return;
    root.classList.add("hof-live");

    if (fine && !lite && window.HVFluid) {
      var fluid = window.HVFluid.create(canvas);
      if (fluid) {
        if (round) fluid.setColors([1, 0.3, 0.14], [0.89, 0.71, 0.29], 0.5);
        else fluid.setColors([0.62, 0.45, 1], [0.89, 0.71, 0.29], 0.5);
        window.addEventListener("pagehide", function () { fluid.destroy(); }, { once: true });
      }
    }

    if (!("IntersectionObserver" in window)) return;
    var limit = window.innerHeight * 0.92;
    var targets = Array.prototype.filter.call(root.querySelectorAll(".bioclash-leaderboard-panel, .bioclash-panel, .bioclash-champions-section"), function (el) {
      return el.getBoundingClientRect().top > limit;
    });
    targets.forEach(function (el) { el.classList.add("hof-reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        en.target.classList.add("is-in");
        setTimeout(function () { en.target.classList.remove("hof-reveal", "is-in"); }, 1200);
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
