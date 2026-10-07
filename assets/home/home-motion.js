(function () {
  var root = document.querySelector(".home-v2 .hv");
  var html = document.documentElement;
  if (!root) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !/[?&]motion=on/.test(window.location.search);
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    html.classList.remove("hv-js");
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var SplitText = window.SplitText;
  var fine = window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches;

  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  if (window.ScrambleTextPlugin) gsap.registerPlugin(window.ScrambleTextPlugin);
  window.__hvStarted = true;

  var conn = navigator.connection;
  var lite = !!conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""));

  var lenis = null;
  if (fine && !lite && window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: function (t) { return 1 - Math.pow(1 - t, 4); },
      anchors: true,
      allowNestedScroll: true,
      autoRaf: false
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function readTriplet(style, name, fallback) {
    var parts = style.getPropertyValue(name).trim().split(/[\s,]+/).map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return fallback;
    return parts.map(function (v) { return v / 255; });
  }

  var fluid = null;
  var canvas = root.querySelector(".hv-fluid");
  if (fine && !lite && canvas && window.HVFluid) {
    fluid = window.HVFluid.create(canvas);
  }

  function syncTheme() {
    if (!fluid) return;
    var style = getComputedStyle(document.body);
    var strength = parseFloat(style.getPropertyValue("--fx-dye-strength")) || 0.4;
    fluid.setColors(
      readTriplet(style, "--fx-dye-a", [0.54, 0.4, 0.77]),
      readTriplet(style, "--fx-dye-b", [0.36, 0.48, 0.35]),
      strength
    );
  }

  if (fluid) {
    syncTheme();
    new MutationObserver(syncTheme).observe(html, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("pagehide", function () { fluid.destroy(); }, { once: true });
  }

  function onEnter(els, margin, cb) {
    var io = new IntersectionObserver(function (entries) {
      var batch = [];
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        batch.push(en.target);
      });
      if (batch.length) cb(batch);
    }, { rootMargin: margin });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }

  gsap.to(root.querySelector(".hv-hero"), {
    yPercent: -8,
    autoAlpha: 0.15,
    ease: "none",
    scrollTrigger: { trigger: root.querySelector(".hv-hero"), start: "top top", end: "bottom top", scrub: 0.6 }
  });

  function splitReveal(el, type, target, start, from, stagger, duration) {
    gsap.set(el, { autoAlpha: 1 });
    if (!SplitText) return;
    var items = SplitText.create(el, { type: type })[target];
    gsap.set(items, from);
    onEnter([el], start, function () {
      gsap.to(items, {
        autoAlpha: 1,
        yPercent: 0,
        rotate: 0,
        duration: duration,
        ease: "expo.out",
        stagger: stagger,
        overwrite: true,
        clearProps: "transform,opacity,visibility"
      });
    });
  }

  function splitAll() {
    gsap.utils.toArray(root.querySelectorAll("[data-split]")).forEach(function (el) {
      splitReveal(el, "words,chars", "chars", "0px 0px -10% 0px", { autoAlpha: 0, yPercent: 70, rotate: 6 }, 0.022, 0.9);
    });
    gsap.utils.toArray(root.querySelectorAll("[data-lines]")).forEach(function (el) {
      splitReveal(el, "words", "words", "0px 0px -8% 0px", { autoAlpha: 0, yPercent: 60 }, 0.014, 0.9);
    });
  }

  var splitDone = false;
  function splitOnce() {
    if (splitDone) return;
    splitDone = true;
    splitAll();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(splitOnce);
  setTimeout(splitOnce, 1500);

  onEnter(root.querySelectorAll("[data-reveal]"), "0px 0px -6% 0px", function (els) {
    els.forEach(function (el, i) {
      var side = el.getAttribute("data-reveal") === "x";
      gsap.fromTo(el,
        {
          autoAlpha: 0,
          x: side ? -48 : 0,
          y: side ? 0 : 44,
          clipPath: side ? "inset(0% 30% 0% 0%)" : "inset(18% 0% 0% 0%)"
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.15,
          ease: "expo.out",
          delay: i * 0.075,
          clearProps: "transform,clipPath"
        });
    });
  });

  var reel = root.querySelector(".hv-reel-frame");
  var reelSec = root.querySelector(".hv-reel");
  if (reel && reelSec) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "hv-reel-stroke" + (fine ? " is-rough" : ""));
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = '<defs><linearGradient id="hv-stroke-g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="hv-stroke-a"/><stop offset="1" class="hv-stroke-b"/></linearGradient>' +
      '<filter id="hv-brush" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency="0.016 0.055" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="18" xChannelSelector="R" yChannelSelector="G"/></filter></defs>' +
      '<g class="hv-stroke-set"><path class="hv-stroke hv-stroke--main"/><path class="hv-stroke hv-stroke--dry"/><path class="hv-stroke hv-stroke--dry2"/></g>';
    reelSec.insertBefore(svg, reelSec.firstChild);
    var strokes = Array.prototype.slice.call(svg.querySelectorAll("path"));
    var strokeGrad = svg.querySelector("linearGradient");
    var paint = document.createElement("span");
    paint.className = "hv-reel-paint";
    paint.setAttribute("aria-hidden", "true");
    reel.appendChild(paint);
    var cover = reel.querySelector(".hv-cover");
    var reelTl = null;
    var reelW = 0;

    var layoutReel = function () {
      var W = reelSec.clientWidth;
      var H = reelSec.clientHeight;
      if (!W || !H) return;
      reelW = W;
      var head = reelSec.querySelector(".hv-head");
      var top = head.offsetTop + head.offsetHeight;
      var fx = reel.offsetLeft + reel.offsetWidth / 2;
      var fy = reel.offsetTop + reel.offsetHeight * 0.06;
      var run = fy - top;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      strokeGrad.setAttribute("y1", top);
      strokeGrad.setAttribute("x2", W);
      strokeGrad.setAttribute("y2", fy);
      var d = "M" + (-70) + "," + (top + run * 0.3) +
        " C" + (W * 0.2) + "," + (top + run * 0.06) + " " + (W * 0.5) + "," + (top + run * 0.56) + " " + (W * 0.8) + "," + (top + run * 0.24) +
        " S" + (W * 1.06) + "," + (top + run * 0.66) + " " + (W * 0.76) + "," + (top + run * 0.76) +
        " S" + (W * 0.06) + "," + (top + run * 0.42) + " " + (W * 0.13) + "," + (top + run * 0.82) +
        " S" + (W * 0.4) + "," + (fy - run * 0.04) + " " + fx + "," + (fy + 8);
      strokes.forEach(function (p) {
        p.setAttribute("d", d);
        p.style.strokeDasharray = p.getTotalLength();
      });
      if (reelTl) {
        reelTl.scrollTrigger.kill();
        reelTl.kill();
      }
      reelTl = gsap.timeline({ scrollTrigger: { trigger: reelSec, start: "top 64%", endTrigger: reel, end: "top 16%", scrub: 0.8 } });
      strokes.forEach(function (p, i) {
        reelTl.fromTo(p, { strokeDashoffset: p.getTotalLength() }, { strokeDashoffset: 0, duration: 0.6, ease: "none" }, i * 0.035);
      });
      reelTl
        .fromTo(reel, { clipPath: "circle(0% at 50% 6%)", scale: 0.94 }, { clipPath: "circle(130% at 50% 6%)", scale: 1, duration: 0.36, ease: "power2.in" }, 0.6)
        .fromTo(paint, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2, ease: "none" }, 0.8);
    };

    var reelReady = false;
    var startReel = function () {
      if (reelReady) return;
      reelReady = true;
      layoutReel();
      if ("ResizeObserver" in window) {
        var pendingLayout = 0;
        new ResizeObserver(function () {
          if (Math.abs(reelSec.clientWidth - reelW) < 2) return;
          clearTimeout(pendingLayout);
          pendingLayout = setTimeout(layoutReel, 200);
        }).observe(reelSec);
      }
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(startReel, 60); });
    setTimeout(startReel, 1800);

    if (cover) {
      gsap.fromTo(cover,
        { scale: 1.08, yPercent: -3 },
        { scale: 1, yPercent: 2, ease: "none", scrollTrigger: { trigger: reel, start: "top bottom", end: "bottom top", scrub: 0.7 } });
    }
    if (fine) {
      var disc = reel.querySelector(".hv-reel-play");
      var discX = gsap.quickTo(disc, "x", { duration: 0.6, ease: "power3.out" });
      var discY = gsap.quickTo(disc, "y", { duration: 0.6, ease: "power3.out" });
      reel.addEventListener("pointermove", function (e) {
        var r = reel.getBoundingClientRect();
        discX(e.clientX - r.left - disc.offsetLeft - disc.offsetWidth / 2);
        discY(e.clientY - r.top - disc.offsetTop - disc.offsetHeight / 2);
      });
      reel.addEventListener("pointerleave", function () {
        discX(0);
        discY(0);
      });
    }
  }

  var SCRAMBLE = "ACGTU";
  if (window.ScrambleTextPlugin) {
    gsap.utils.toArray(root.querySelectorAll("[data-scramble]")).forEach(function (el) {
      var text = el.textContent;
      var busy = false;
      el.setAttribute("aria-label", text);
      function run() {
        if (busy) return;
        busy = true;
        gsap.to(el, {
          duration: 0.95,
          ease: "none",
          scrambleText: { text: text, chars: SCRAMBLE, speed: 0.55, revealDelay: 0.12 },
          onComplete: function () { busy = false; }
        });
      }
      onEnter([el], "0px 0px -4% 0px", run);
      if (fine) {
        var host = el.closest(".hv-head, .hv-stats div, .hv-eyebrow") || el;
        host.addEventListener("pointerenter", run);
      }
    });
  }

  gsap.utils.toArray(root.querySelectorAll(".hv-blob")).forEach(function (blob, i) {
    gsap.to(blob, {
      yPercent: [-28, 22, -40][i % 3],
      xPercent: [10, -12, 6][i % 3],
      ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 1.6 }
    });
  });

  if (fine) {
    root.addEventListener("pointermove", function (e) {
      var card = e.target.closest(".hv-frame, .hv-tile");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--px", (e.clientX - r.left) + "px");
      card.style.setProperty("--py", (e.clientY - r.top) + "px");
    }, { passive: true });

    var RANGE = 26;
    var magnets = gsap.utils.toArray(root.querySelectorAll("[data-magnetic]")).map(function (el) {
      return {
        el: el,
        on: false,
        x: gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" }),
        skew: gsap.quickTo(el, "skewX", { duration: 0.55, ease: "power3.out" }),
        scale: gsap.quickTo(el, "scale", { duration: 0.55, ease: "power3.out" })
      };
    });

    function place(el, e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--fx", (e.clientX - r.left) + "px");
      el.style.setProperty("--fy", (e.clientY - r.top) + "px");
      el.style.setProperty("--fd", (Math.sqrt(r.width * r.width + r.height * r.height) * 2.2) + "px");
    }

    magnets.forEach(function (m) {
      m.el.addEventListener("pointerenter", function (e) { place(m.el, e); });
      m.el.addEventListener("pointerleave", function (e) { place(m.el, e); });
    });

    var pointer = null;
    var queued = false;

    function pull() {
      queued = false;
      if (!pointer) return;
      magnets.forEach(function (m) {
        var r = m.el.getBoundingClientRect();
        if (r.bottom < -RANGE || r.top > window.innerHeight + RANGE) {
          if (m.on) { m.on = false; m.x(0); m.y(0); m.skew(0); m.scale(1); }
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
          m.x(dx * 0.28);
          m.y(dy * 0.38);
          m.skew(gsap.utils.clamp(-7, 7, dx * -0.06));
          m.scale(1.04);
        } else if (m.on) {
          m.on = false;
          m.x(0);
          m.y(0);
          m.skew(0);
          m.scale(1);
        }
      });
    }

    window.addEventListener("pointermove", function (e) {
      pointer = { x: e.clientX, y: e.clientY };
      if (!queued) {
        queued = true;
        requestAnimationFrame(pull);
      }
    }, { passive: true });
  }

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
