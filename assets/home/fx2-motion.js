(function () {
  var body = document.body;
  var html = document.documentElement;
  if (!body || !body.classList.contains("fx-2") || !window.gsap) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !/[?&]motion=on/.test(window.location.search);
  if (reduce) return;

  var gsap = window.gsap;
  var SplitText = window.SplitText;
  var fine = window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches;
  var conn = navigator.connection;
  var lite = !!conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""));
  if (SplitText) gsap.registerPlugin(SplitText);

  function layer(tag, cls) {
    var el = document.createElement(tag);
    el.className = cls;
    el.setAttribute("aria-hidden", "true");
    return el;
  }

  var ambient = layer("div", "fx2-ambient");
  ["a", "b", "c"].forEach(function (k) {
    var blob = layer("div", "fx2-blob fx2-blob--" + k);
    blob.appendChild(document.createElement("i"));
    ambient.appendChild(blob);
  });
  var canvas = layer("canvas", "fx2-fluid");
  var grain = layer("div", "fx2-grain");
  body.appendChild(ambient);
  body.appendChild(canvas);
  body.appendChild(grain);

  if (fine && !lite && window.Lenis) {
    var lenis = new window.Lenis({
      duration: 1.1,
      easing: function (t) { return 1 - Math.pow(1 - t, 4); },
      anchors: true,
      allowNestedScroll: true,
      autoRaf: false
    });
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function triplet(style, name, fallback) {
    var parts = style.getPropertyValue(name).trim().split(/[\s,]+/).map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return fallback;
    return parts.map(function (v) { return v / 255; });
  }

  var fluid = fine && !lite && window.HVFluid ? window.HVFluid.create(canvas) : null;
  if (fluid) {
    var sync = function () {
      var style = getComputedStyle(body);
      fluid.setColors(
        triplet(style, "--fx-dye-a", [0.54, 0.4, 0.77]),
        triplet(style, "--fx-dye-b", [0.36, 0.48, 0.35]),
        parseFloat(style.getPropertyValue("--fx-dye-strength")) || 0.3
      );
    };
    sync();
    new MutationObserver(sync).observe(html, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("pagehide", function () { fluid.destroy(); }, { once: true });
  }

  function onEnter(els, margin, cb) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        cb(en.target);
      });
    }, { rootMargin: margin });
    els.forEach(function (el) { io.observe(el); });
  }

  function splitHeadings() {
    if (!SplitText) return;
    var limit = window.innerHeight * 0.9;
    var heads = Array.prototype.filter.call(document.querySelectorAll("#content h2"), function (el) {
      return el.getBoundingClientRect().top > limit && !el.closest(".hextra-card, .card, [hidden]") && el.textContent.trim().length < 80;
    }).slice(0, 14);
    heads.forEach(function (el) {
      var chars = SplitText.create(el, { type: "words,chars" }).chars;
      gsap.set(chars, { autoAlpha: 0, yPercent: 60, rotate: 5 });
    });
    onEnter(heads, "0px 0px -8% 0px", function (el) {
      gsap.to(el.querySelectorAll("div > div"), {
        autoAlpha: 1,
        yPercent: 0,
        rotate: 0,
        duration: 0.85,
        ease: "expo.out",
        stagger: 0.02,
        clearProps: "transform,opacity,visibility"
      });
    });
  }

  var split = false;
  function splitOnce() {
    if (split) return;
    split = true;
    splitHeadings();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(splitOnce);
  setTimeout(splitOnce, 1500);

  if (fine) {
    var RANGE = 24;
    var magnets = Array.prototype.map.call(document.querySelectorAll("#content .btn-outline, #content .btn-primary, #content .fp-btn, #content .cg-btn, #content .prep-picker-result-link, #content .prep-tour-trigger, #content .papers-nav-btn"), function (el) {
      if (el.closest(".card")) return null;
      return {
        el: el,
        on: false,
        x: gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" }),
        skew: gsap.quickTo(el, "skewX", { duration: 0.55, ease: "power3.out" })
      };
    }).filter(Boolean);

    var pointer = null;
    var queued = false;

    function pull() {
      queued = false;
      if (!pointer) return;
      magnets.forEach(function (m) {
        var r = m.el.getBoundingClientRect();
        if (r.bottom < -RANGE || r.top > window.innerHeight + RANGE) {
          if (m.on) { m.on = false; m.x(0); m.y(0); m.skew(0); }
          return;
        }
        var ox = Number(gsap.getProperty(m.el, "x")) || 0;
        var oy = Number(gsap.getProperty(m.el, "y")) || 0;
        var left = r.left - ox;
        var top = r.top - oy;
        var gapX = Math.max(left - pointer.x, 0, pointer.x - (left + r.width));
        var gapY = Math.max(top - pointer.y, 0, pointer.y - (top + r.height));
        if (Math.sqrt(gapX * gapX + gapY * gapY) <= RANGE) {
          var dx = pointer.x - (left + r.width / 2);
          var dy = pointer.y - (top + r.height / 2);
          m.on = true;
          m.x(dx * 0.26);
          m.y(dy * 0.36);
          m.skew(gsap.utils.clamp(-6, 6, dx * -0.05));
        } else if (m.on) {
          m.on = false;
          m.x(0);
          m.y(0);
          m.skew(0);
        }
      });
    }

    if (magnets.length) {
      window.addEventListener("pointermove", function (e) {
        pointer = { x: e.clientX, y: e.clientY };
        if (!queued) {
          queued = true;
          requestAnimationFrame(pull);
        }
      }, { passive: true });
    }
  }
})();
