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
  var fine = window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches;

  gsap.registerPlugin(ScrollTrigger);
  if (window.ScrambleTextPlugin) gsap.registerPlugin(window.ScrambleTextPlugin);
  window.__hvStarted = true;

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
  if (fine && window.ScrambleTextPlugin) {
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

  if (fine) {
    root.addEventListener("pointermove", function (e) {
      var card = e.target.closest(".hv-frame, .hv-tile");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--px", (e.clientX - r.left) + "px");
      card.style.setProperty("--py", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
