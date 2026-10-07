(function () {
  var host = document.querySelector(".home-v2 .hv-globe");
  if (!host) return;

  var canvas = host.querySelector("canvas");
  var tip = host.querySelector(".hv-globe-tip");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !/[?&]motion=on/.test(window.location.search);
  var conn = navigator.connection;
  var lite = !!conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""));

  var CENTROIDS = { US: [-98, 39], RU: [60, 58], CA: [-100, 56], NO: [10, 61], FR: [2.5, 46.5], ID: [113, -1], MY: [102, 4], NZ: [172, -42], JP: [138, 37], CN: [104, 35], VN: [106, 16], PH: [122, 13] };
  var EXTRA = { SG: [103.8, 1.35] };
  var RAD = Math.PI / 180;

  function fail() {
    host.classList.add("is-fallback");
  }

  if (lite || !canvas || !canvas.getContext) {
    fail();
    return;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function getJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  }

  function boot() {
    var ready = window.d3 && window.d3.geoOrthographic
      ? Promise.resolve()
      : loadScript(host.dataset.d3Array).then(function () { return loadScript(host.dataset.d3Geo); });
    ready
      .then(function () { return Promise.all([getJson(host.dataset.world), getJson(host.dataset.programmes)]); })
      .then(function (res) { init(res[0], res[1].countries || {}); })
      .catch(fail);
  }

  function init(world, programmes) {
    var d3 = window.d3;
    var ctx = canvas.getContext("2d");
    var projection = d3.geoOrthographic().clipAngle(90).precision(0);
    var pather = d3.geoPath(projection);
    var graticule = d3.geoGraticule10();

    var plain = [];
    var soon = [];
    var live = [];
    var byCode = {};
    var points = [];

    world.features.forEach(function (f) {
      var code = f.properties && f.properties.c;
      var info = code && programmes[code];
      if (!info) {
        plain.push(f);
        return;
      }
      var isLive = info.status === "published" && !!info.guideUrl;
      (isLive ? live : soon).push(f);
      var entry = { code: code, info: info, feature: f, live: isLive, at: CENTROIDS[code] || d3.geoCentroid(f) };
      byCode[code] = entry;
      points.push(entry);
    });

    Object.keys(EXTRA).forEach(function (code) {
      var info = programmes[code];
      if (!info || byCode[code]) return;
      var entry = { code: code, info: info, feature: null, live: info.status === "published" && !!info.guideUrl, at: EXTRA[code] };
      byCode[code] = entry;
      points.push(entry);
    });

    var plainSet = { type: "FeatureCollection", features: plain };
    var soonSet = { type: "FeatureCollection", features: soon };
    var liveSet = { type: "FeatureCollection", features: live };

    var size = 0;
    var radius = 0;
    var dpr = 1;
    var rot = [-48, -30];
    var velocity = [0, 0];
    var target = null;
    var hovered = null;
    var pinned = null;
    var dragging = false;
    var dragMoved = 0;
    var lastPointer = null;
    var pending = null;
    var inView = true;
    var raf = 0;
    var lastTime = 0;
    var dirty = true;
    var colors = {};
    var lastDraw = 0;
    var cost = 4;
    var interval = 33;
    var calm = reduce;

    function readColors() {
      var cs = getComputedStyle(host);
      ["sea-a", "sea-b", "land", "border", "soon", "live", "hover", "glow", "grid", "ink"].forEach(function (k) {
        colors[k] = cs.getPropertyValue("--fx-globe-" + k).trim() || "#888";
      });
      dirty = true;
    }

    var stale = true;

    function resize() {
      if (!stale) return;
      stale = false;
      var w = Math.round(host.clientWidth);
      if (!w || w === size) return;
      size = w;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      radius = size / 2 - Math.max(18, size * 0.06);
      projection.translate([size / 2, size / 2]).scale(radius);
      dirty = true;
    }

    function visible(p) {
      return d3.geoDistance([-rot[0], -rot[1]], p) < Math.PI / 2 - 0.04;
    }

    function trace(obj) {
      var p = new Path2D();
      pather.context(p)(obj);
      return p;
    }

    function draw(now) {
      dirty = false;
      projection.rotate([rot[0], rot[1], 0]);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      var c = size / 2;
      var halo = radius + Math.max(18, size * 0.06);

      var glow = ctx.createRadialGradient(c, c, radius * 0.92, c, c, halo);
      glow.addColorStop(0, colors.glow);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(c, c, halo, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      var sea = ctx.createRadialGradient(c - radius * 0.38, c - radius * 0.42, radius * 0.08, c, c, radius);
      sea.addColorStop(0, colors["sea-a"]);
      sea.addColorStop(1, colors["sea-b"]);
      ctx.beginPath();
      ctx.arc(c, c, radius, 0, Math.PI * 2);
      ctx.fillStyle = sea;
      ctx.fill();

      ctx.lineWidth = 0.6;
      ctx.strokeStyle = colors.grid;
      ctx.stroke(trace(graticule));

      var pPlain = trace(plainSet);
      var pSoon = trace(soonSet);
      var pLive = trace(liveSet);
      ctx.strokeStyle = colors.border;
      ctx.fillStyle = colors.land;
      ctx.fill(pPlain);
      ctx.stroke(pPlain);
      ctx.fillStyle = colors.soon;
      ctx.fill(pSoon);
      ctx.stroke(pSoon);
      ctx.fillStyle = colors.live;
      ctx.fill(pLive);
      ctx.stroke(pLive);

      var focus = pinned || hovered;
      if (focus && focus.feature) {
        var pFocus = trace(focus.feature);
        ctx.fillStyle = focus.live ? colors.hover : colors.soon;
        ctx.fill(pFocus);
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = colors.ink;
        ctx.stroke(pFocus);
      }

      var pulse = calm ? 0.5 : (now % 2200) / 2200;
      points.forEach(function (p) {
        if (!visible(p.at)) return;
        var xy = projection(p.at);
        if (!xy) return;
        if (p.live) {
          ctx.beginPath();
          ctx.arc(xy[0], xy[1], 4 + pulse * 12, 0, Math.PI * 2);
          ctx.strokeStyle = colors.live;
          ctx.globalAlpha = 0.55 * (1 - pulse);
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(xy[0], xy[1], 4.2, 0, Math.PI * 2);
          ctx.fillStyle = colors.ink;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(xy[0], xy[1], 2.6, 0, Math.PI * 2);
          ctx.fillStyle = colors.live;
          ctx.fill();
        } else if (!p.feature) {
          ctx.beginPath();
          ctx.arc(xy[0], xy[1], 2.4, 0, Math.PI * 2);
          ctx.fillStyle = colors.soon;
          ctx.fill();
        }
      });

      ctx.beginPath();
      ctx.arc(c, c, radius, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.border;
      ctx.stroke();
    }

    function pick(x, y) {
      var best = null;
      var bestD = 15;
      points.forEach(function (p) {
        if (!p.live && p.feature) return;
        if (!visible(p.at)) return;
        var xy = projection(p.at);
        var d = Math.sqrt((xy[0] - x) * (xy[0] - x) + (xy[1] - y) * (xy[1] - y));
        if (d < bestD) {
          bestD = d;
          best = p;
        }
      });
      if (best) return best;
      var c = size / 2;
      if ((x - c) * (x - c) + (y - c) * (y - c) > radius * radius) return null;
      var ll = projection.invert([x, y]);
      if (!ll) return null;
      for (var i = 0; i < points.length; i++) {
        if (points[i].feature && d3.geoContains(points[i].feature, ll)) return points[i];
      }
      return null;
    }

    function line(cls, text) {
      var el = document.createElement("span");
      el.className = cls;
      el.textContent = text;
      return el;
    }

    function showTip(p, x, y) {
      if (!tip) return;
      tip.textContent = "";
      tip.appendChild(line("hv-globe-tip-name", (p.info.flag ? p.info.flag + " " : "") + p.info.name));
      if (p.info.programme) tip.appendChild(line("hv-globe-tip-prog", p.info.programme));
      if (p.info.stages) tip.appendChild(line("hv-globe-tip-stages", p.info.stages));
      tip.appendChild(line("hv-globe-tip-status" + (p.live ? " is-live" : ""), p.live ? "Read the guide" : "Guide coming soon"));
      tip.hidden = false;
      var w = tip.offsetWidth;
      var h = tip.offsetHeight;
      var left = Math.min(Math.max(x + 16, 4), size - w - 4);
      var top = y - h - 14;
      if (top < 4) top = y + 18;
      tip.style.transform = "translate(" + Math.round(left) + "px," + Math.round(top) + "px)";
    }

    function hideTip() {
      if (tip) tip.hidden = true;
    }

    function setHover(p, x, y) {
      if (p !== hovered) {
        hovered = p;
        dirty = true;
        canvas.style.cursor = p && p.live ? "pointer" : (dragging ? "grabbing" : "grab");
      }
      if (p) showTip(p, x, y);
      else if (!pinned) hideTip();
    }

    function local(e) {
      var r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    }

    function frame(now) {
      raf = 0;
      var dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      resize();

      if (pending) {
        var p = pending;
        pending = null;
        if (!dragging) setHover(pick(p[0], p[1]), p[0], p[1]);
      }

      if (target) {
        var dx = target[0] - rot[0];
        var dy = target[1] - rot[1];
        dx = ((dx + 540) % 360) - 180;
        rot[0] += dx * Math.min(1, dt * 4);
        rot[1] += dy * Math.min(1, dt * 4);
        if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
          target = null;
          if (pinned) {
            projection.rotate([rot[0], rot[1], 0]);
            var xy = projection(pinned.at);
            showTip(pinned, xy[0], xy[1]);
          }
        }
        dirty = true;
      } else if (!dragging) {
        if (Math.abs(velocity[0]) > 0.5 || Math.abs(velocity[1]) > 0.5) {
          rot[0] += velocity[0] * dt;
          rot[1] = Math.max(-65, Math.min(65, rot[1] + velocity[1] * dt));
          velocity[0] *= Math.pow(0.04, dt);
          velocity[1] *= Math.pow(0.04, dt);
          dirty = true;
        } else if (!hovered && !pinned && !calm) {
          rot[0] += dt * 5;
          dirty = true;
        }
      }

      var due = dragging || target || now - lastDraw >= interval;
      if ((dirty || !calm) && due) {
        var began = performance.now();
        draw(now);
        cost = cost * 0.8 + (performance.now() - began) * 0.2;
        interval = Math.max(33, Math.min(200, cost * 5));
        if (cost > 45) calm = true;
        lastDraw = now;
      }
      schedule();
    }

    function schedule() {
      if (raf || !inView || document.hidden) return;
      if (calm && !dirty && !target && !pending && !dragging) return;
      lastTime = lastTime || performance.now();
      raf = requestAnimationFrame(frame);
    }

    function kick() {
      dirty = true;
      if (!raf) lastTime = performance.now();
      schedule();
    }

    canvas.addEventListener("pointerdown", function (e) {
      dragging = true;
      dragMoved = 0;
      target = null;
      pinned = null;
      velocity = [0, 0];
      lastPointer = [e.clientX, e.clientY, performance.now()];
      canvas.style.cursor = "grabbing";
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { dragMoved = 0; }
      kick();
    });

    canvas.addEventListener("pointermove", function (e) {
      if (dragging && lastPointer) {
        var now = performance.now();
        var dx = e.clientX - lastPointer[0];
        var dy = e.clientY - lastPointer[1];
        var k = 90 / radius;
        var step = Math.max((now - lastPointer[2]) / 1000, 0.001);
        dragMoved += Math.abs(dx) + Math.abs(dy);
        rot[0] += dx * k;
        rot[1] = Math.max(-65, Math.min(65, rot[1] - dy * k));
        velocity = [dx * k / step * 0.35, -dy * k / step * 0.35];
        lastPointer = [e.clientX, e.clientY, now];
        if (dragMoved > 6) hideTip();
        kick();
        return;
      }
      pending = local(e);
      kick();
    });

    function release(e) {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      if (dragMoved <= 6 && e.type === "pointerup") {
        var at = local(e);
        var p = pick(at[0], at[1]);
        if (p && p.live) {
          window.location.href = p.info.guideUrl;
          return;
        }
        if (p) {
          pinned = p;
          showTip(p, at[0], at[1]);
        }
        velocity = [0, 0];
      }
      kick();
    }

    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);
    canvas.addEventListener("pointerleave", function () {
      if (dragging) return;
      pending = null;
      setHover(null);
      kick();
    });

    Array.prototype.forEach.call(host.querySelectorAll(".hv-globe-list a[data-code]"), function (a) {
      a.addEventListener("focus", function () {
        var p = byCode[a.getAttribute("data-code")];
        if (!p) return;
        pinned = p;
        target = [-p.at[0], -p.at[1]];
        target[1] = Math.max(-65, Math.min(65, target[1]));
        kick();
      });
      a.addEventListener("blur", function () {
        pinned = null;
        hideTip();
        kick();
      });
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) kick();
      }, { rootMargin: "80px" }).observe(host);
    }
    document.addEventListener("visibilitychange", function () { if (!document.hidden) kick(); });
    function invalidate() {
      stale = true;
      kick();
    }
    if ("ResizeObserver" in window) new ResizeObserver(invalidate).observe(host);
    window.addEventListener("resize", invalidate);
    new MutationObserver(function () { readColors(); kick(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    readColors();
    resize();
    canvas.style.cursor = "grab";
    host.classList.add("is-ready");
    kick();
  }

  if ("requestIdleCallback" in window) window.requestIdleCallback(boot, { timeout: 2500 });
  else setTimeout(boot, 700);
})();
