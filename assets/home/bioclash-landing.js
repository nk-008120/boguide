(function () {
  function start() {
    var root = document.getElementById("bioclash-root");
    if (!root || !root.querySelector(".bioclash-landing-bg")) return;

    var NS = "http://www.w3.org/2000/svg";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !/[?&]motion=on/.test(window.location.search);
    var fine = window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches;
    var conn = navigator.connection;
    var lite = !!conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""));

    function el(name, attrs, parent) {
      var node = document.createElementNS(NS, name);
      for (var k in attrs) node.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(node);
      return node;
    }

    var WRIST = [228, 190];
    var TIP = [584, 14];

    function p(x, y) {
      return x.toFixed(1) + " " + y.toFixed(1);
    }

    function arm(t) {
      var c = [392, 84];
      var u = 1 - t;
      return [u * u * WRIST[0] + 2 * u * t * c[0] + t * t * TIP[0], u * u * WRIST[1] + 2 * u * t * c[1] + t * t * TIP[1]];
    }

    function feather(group, base, angle, length, width, shaft) {
      var rad = angle * Math.PI / 180;
      var dx = Math.cos(rad), dy = Math.sin(rad);
      var nx = -dy, ny = dx;
      var tx = base[0] + dx * length, ty = base[1] + dy * length;
      var d = "M" + p(base[0], base[1]) +
        " C" + p(base[0] + nx * width * 0.9 + dx * length * 0.35, base[1] + ny * width * 0.9 + dy * length * 0.35) +
        " " + p(tx + nx * width * 1.15 - dx * length * 0.05, ty + ny * width * 1.15 - dy * length * 0.05) +
        " " + p(tx, ty) +
        " C" + p(tx - nx * width * 1.15 - dx * length * 0.05, ty - ny * width * 1.15 - dy * length * 0.05) +
        " " + p(base[0] - nx * width * 0.9 + dx * length * 0.35, base[1] - ny * width * 0.9 + dy * length * 0.35) +
        " " + p(base[0], base[1]) + "Z";
      el("path", { d: d }, group);
      if (shaft) {
        el("path", {
          d: "M" + p(base[0] + dx * length * 0.3, base[1] + dy * length * 0.3) + " L" + p(tx - dx * length * 0.16, ty - dy * length * 0.16),
          fill: "none",
          "stroke-width": 1.2,
          opacity: 0.7
        }, group);
      }
    }

    function fan(svg, fill, count, scale, width, spread, inset, shaft) {
      var g = el("g", { fill: fill, stroke: "#fffaf0", "stroke-width": 3, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
      for (var i = 0; i < count; i++) {
        var k = count === 1 ? 0 : i / (count - 1);
        var along = Math.max(0, (k - 0.42) / 0.58);
        var pt = arm(along * spread);
        var ang = 132 - 157 * (1 - Math.pow(1 - k, 1.7));
        var rad = ang * Math.PI / 180;
        var base = [pt[0] + Math.cos(rad) * inset, pt[1] + Math.sin(rad) * inset];
        var reach = 336 - 196 * Math.pow(along, 1.25);
        feather(g, base, ang, reach * scale, width, shaft);
      }
    }

    function drawWing(side, extra) {
      var svg = el("svg", { viewBox: "0 0 600 560", "aria-hidden": "true", focusable: "false", "class": extra });
      var defs = el("defs", {}, svg);
      var id = "bcl-g-" + side + "-" + extra;
      var grad = el("radialGradient", { id: id, gradientUnits: "userSpaceOnUse", cx: 300, cy: 160, r: 300 }, defs);
      el("stop", { offset: "0", "stop-color": "#fff0a0" }, grad);
      el("stop", { offset: "0.16", "stop-color": "#ffc04a" }, grad);
      el("stop", { offset: "0.4", "stop-color": "#ff4a2a" }, grad);
      el("stop", { offset: "1", "stop-color": "#e0101c" }, grad);
      var fill = "url(#" + id + ")";
      fan(svg, fill, 19, 1, 19, 0.74, 20, true);
      fan(svg, fill, 17, 0.66, 18, 0.8, 14, true);
      fan(svg, fill, 15, 0.4, 16, 0.86, 9, false);
      fan(svg, fill, 14, 0.22, 13, 0.9, 4, false);
      el("path", {
        d: "M190 250 C176 204 196 168 232 158 C330 132 470 78 584 14 C500 84 392 142 300 176 C262 190 232 214 216 246 C208 262 196 266 190 250Z",
        fill: fill,
        stroke: "#fffaf0",
        "stroke-width": 3.2,
        "stroke-linejoin": "round"
      }, svg);
      var hatch = el("g", { fill: "none", stroke: "#fffaf0", "stroke-width": 1.3, "stroke-linecap": "round", opacity: 0.75 }, svg);
      for (var h = 0; h < 9; h++) {
        var hp = arm(0.12 + h * 0.085);
        el("path", { d: "M" + p(hp[0] - 6, hp[1] + 14) + " L" + p(hp[0] + 16, hp[1] + 24) }, hatch);
      }
      return svg;
    }

    function wing(side) {
      var wrap = document.createElement("div");
      wrap.className = "bcl-wing bcl-wing--" + side;
      wrap.appendChild(drawWing(side, "bcl-wing-bloom"));
      wrap.appendChild(drawWing(side, "bcl-wing-core"));
      return wrap;
    }

    var wings = document.createElement("div");
    wings.className = "bcl-wings";
    wings.setAttribute("aria-hidden", "true");
    wings.appendChild(wing("left"));
    wings.appendChild(wing("right"));
    var grain = document.createElement("div");
    grain.className = "bcl-grain";
    grain.setAttribute("aria-hidden", "true");
    var canvas = document.createElement("canvas");
    canvas.className = "bcl-fluid";
    canvas.setAttribute("aria-hidden", "true");
    var bg = root.querySelector(".bioclash-landing-bg");
    bg.insertAdjacentElement("afterend", grain);
    bg.insertAdjacentElement("afterend", wings);
    bg.insertAdjacentElement("afterend", canvas);

    var panels = Array.prototype.slice.call(root.querySelectorAll(".bioclash-section.bioclash-panel"));

    root.addEventListener("pointermove", function (e) {
      var panel = e.target.closest ? e.target.closest(".bioclash-section.bioclash-panel") : null;
      if (!panel) return;
      var r = panel.getBoundingClientRect();
      panel.style.setProperty("--bcl-x", (e.clientX - r.left) + "px");
      panel.style.setProperty("--bcl-y", (e.clientY - r.top) + "px");
    }, { passive: true });

    if (reduce) return;
    root.classList.add("bcl-live");

    if (fine && !lite && window.HVFluid) {
      var fluid = window.HVFluid.create(canvas);
      if (fluid) {
        fluid.setColors([1, 0.3, 0.14], [0.89, 0.71, 0.29], 0.5);
        window.addEventListener("pagehide", function () { fluid.destroy(); }, { once: true });
      }
    }

    document.addEventListener("visibilitychange", function () {
      wings.style.display = document.hidden ? "none" : "";
    });

    if (!("IntersectionObserver" in window)) return;
    var limit = window.innerHeight * 0.92;
    var targets = panels.filter(function (panel) { return panel.getBoundingClientRect().top > limit; });
    targets.forEach(function (panel) { panel.classList.add("bcl-reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        en.target.classList.add("is-in");
        setTimeout(function () { en.target.classList.remove("bcl-reveal", "is-in"); }, 1200);
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (panel) { io.observe(panel); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
