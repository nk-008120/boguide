(function () {
  var VERT = [
    "#version 300 es",
    "layout(location=0) in vec2 p;",
    "uniform vec2 px;",
    "out vec2 uv; out vec2 vl; out vec2 vr; out vec2 vt; out vec2 vb;",
    "void main(){",
    "  uv = p * 0.5 + 0.5;",
    "  vl = uv - vec2(px.x, 0.0); vr = uv + vec2(px.x, 0.0);",
    "  vt = uv + vec2(0.0, px.y); vb = uv - vec2(0.0, px.y);",
    "  gl_Position = vec4(p, 0.0, 1.0);",
    "}"
  ].join("\n");

  var HEAD = "#version 300 es\nprecision highp float;\nprecision highp sampler2D;\nin vec2 uv; in vec2 vl; in vec2 vr; in vec2 vt; in vec2 vb;\nout vec4 o;\n";

  var FRAG = {
    splat: "uniform sampler2D uTarget; uniform float aspect; uniform vec3 color; uniform vec2 point; uniform float radius;\nvoid main(){ vec2 d = uv - point; d.x *= aspect; vec3 s = exp(-dot(d, d) / radius) * color; o = vec4(texture(uTarget, uv).xyz + s, 1.0); }",
    advect: "uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 px; uniform float dt; uniform float dissipation;\nvoid main(){ vec2 c = uv - dt * texture(uVelocity, uv).xy * px; o = texture(uSource, c) / (1.0 + dissipation * dt); }",
    divergence: "uniform sampler2D uVelocity;\nvoid main(){ float L = texture(uVelocity, vl).x; float R = texture(uVelocity, vr).x; float T = texture(uVelocity, vt).y; float B = texture(uVelocity, vb).y; o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0); }",
    curl: "uniform sampler2D uVelocity;\nvoid main(){ float L = texture(uVelocity, vl).y; float R = texture(uVelocity, vr).y; float T = texture(uVelocity, vt).x; float B = texture(uVelocity, vb).x; o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0); }",
    vorticity: "uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;\nvoid main(){ float L = texture(uCurl, vl).x; float R = texture(uCurl, vr).x; float T = texture(uCurl, vt).x; float B = texture(uCurl, vb).x; float C = texture(uCurl, uv).x; vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L)); f /= length(f) + 0.0001; f *= curl * C; f.y *= -1.0; vec2 v = texture(uVelocity, uv).xy + f * dt; o = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0); }",
    pressure: "uniform sampler2D uPressure; uniform sampler2D uDivergence;\nvoid main(){ float L = texture(uPressure, vl).x; float R = texture(uPressure, vr).x; float T = texture(uPressure, vt).x; float B = texture(uPressure, vb).x; float D = texture(uDivergence, uv).x; o = vec4((L + R + B + T - D) * 0.25, 0.0, 0.0, 1.0); }",
    gradient: "uniform sampler2D uPressure; uniform sampler2D uVelocity;\nvoid main(){ float L = texture(uPressure, vl).x; float R = texture(uPressure, vr).x; float T = texture(uPressure, vt).x; float B = texture(uPressure, vb).x; vec2 v = texture(uVelocity, uv).xy - vec2(R - L, T - B); o = vec4(v, 0.0, 1.0); }",
    scale: "uniform sampler2D uTarget; uniform float value;\nvoid main(){ o = value * texture(uTarget, uv); }",
    display: "uniform sampler2D uDye; uniform vec3 colorA; uniform vec3 colorB; uniform float strength;\nvoid main(){ vec2 c = max(texture(uDye, uv).rg, 0.0); float s = c.r + c.g; float a = (1.0 - exp(-s * 1.8)) * strength; vec3 col = (colorA * c.r + colorB * c.g) / max(s, 0.0001); o = vec4(col * a, a); }"
  };

  function create(canvas) {
    var gl = canvas.getContext("webgl2", { alpha: true, depth: false, stencil: false, antialias: false, premultipliedAlpha: true });
    if (!gl) return null;
    if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return null;
    var info = gl.getExtension("WEBGL_debug_renderer_info");
    var renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return null;

    var config = { sim: 128, dye: 512, velocityDissipation: 0.7, dyeDissipation: 1.5, pressure: 0.8, iterations: 18, curl: 22, radius: 0.22, force: 5200, idleMs: 7000 };

    function compile(type, source) {
      var s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }

    function program(frag) {
      var pr = gl.createProgram();
      gl.attachShader(pr, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, HEAD + frag));
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
      var u = {};
      var n = gl.getProgramParameter(pr, gl.ACTIVE_UNIFORMS);
      for (var i = 0; i < n; i++) {
        var name = gl.getActiveUniform(pr, i).name;
        u[name] = gl.getUniformLocation(pr, name);
      }
      return { pr: pr, u: u };
    }

    var P;
    try {
      P = {};
      Object.keys(FRAG).forEach(function (k) { P[k] = program(FRAG[k]); });
    } catch (err) {
      return null;
    }

    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);

    function fbo(w, h, internal, format, filter) {
      var tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
      var fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex: tex, fb: fb, w: w, h: h };
    }

    function pair(w, h, internal, format, filter) {
      var a = fbo(w, h, internal, format, filter);
      var b = fbo(w, h, internal, format, filter);
      return {
        w: w, h: h,
        get read() { return a; },
        get write() { return b; },
        swap: function () { var t = a; a = b; b = t; }
      };
    }

    function free(t) {
      if (!t) return;
      [t.read || t, t.write].forEach(function (f) {
        if (!f) return;
        gl.deleteTexture(f.tex);
        gl.deleteFramebuffer(f.fb);
      });
    }

    function size(base) {
      var aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      var min = Math.round(base);
      var max = Math.round(base * aspect);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? { w: max, h: min } : { w: min, h: max };
    }

    var velocity, dye, pressure, divergence, curl;

    function build() {
      free(velocity); free(dye); free(pressure); free(divergence); free(curl);
      var s = size(config.sim);
      var d = size(config.dye);
      velocity = pair(s.w, s.h, gl.RG16F, gl.RG, gl.LINEAR);
      dye = pair(d.w, d.h, gl.RG16F, gl.RG, gl.LINEAR);
      pressure = pair(s.w, s.h, gl.R16F, gl.RED, gl.NEAREST);
      divergence = fbo(s.w, s.h, gl.R16F, gl.RED, gl.NEAREST);
      curl = fbo(s.w, s.h, gl.R16F, gl.RED, gl.NEAREST);
    }

    function fit() {
      var scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
      var w = Math.max(2, Math.floor(window.innerWidth * scale));
      var h = Math.max(2, Math.floor(window.innerHeight * scale));
      if (canvas.width === w && canvas.height === h) return false;
      canvas.width = w;
      canvas.height = h;
      return true;
    }

    function use(p) {
      gl.useProgram(p.pr);
      return p.u;
    }

    function bind(loc, target, unit) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, target.tex);
      gl.uniform1i(loc, unit);
    }

    function draw(target) {
      if (target) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb);
        gl.viewport(0, 0, target.w, target.h);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    var colors = { a: [0.54, 0.4, 0.77], b: [0.36, 0.48, 0.35], strength: 0.4 };
    var queue = [];
    var running = false;
    var dead = false;
    var raf = 0;
    var last = 0;
    var lastInput = 0;
    var slow = 0;
    var downgraded = false;

    function splat(x, y, dx, dy, amountA, amountB) {
      var aspect = canvas.width / canvas.height;
      var u = use(P.splat);
      gl.uniform2f(u.px, 1 / velocity.w, 1 / velocity.h);
      gl.uniform1f(u.aspect, aspect);
      gl.uniform2f(u.point, x, y);
      gl.uniform1f(u.radius, (config.radius / 100) * (aspect > 1 ? aspect : 1));
      bind(u.uTarget, velocity.read, 0);
      gl.uniform3f(u.color, dx, dy, 0);
      draw(velocity.write);
      velocity.swap();
      bind(u.uTarget, dye.read, 0);
      gl.uniform3f(u.color, amountA, amountB, 0);
      draw(dye.write);
      dye.swap();
    }

    function step(dt) {
      var tx = 1 / velocity.w;
      var ty = 1 / velocity.h;
      var u = use(P.curl);
      gl.uniform2f(u.px, tx, ty);
      bind(u.uVelocity, velocity.read, 0);
      draw(curl);

      u = use(P.vorticity);
      gl.uniform2f(u.px, tx, ty);
      bind(u.uVelocity, velocity.read, 0);
      bind(u.uCurl, curl, 1);
      gl.uniform1f(u.curl, config.curl);
      gl.uniform1f(u.dt, dt);
      draw(velocity.write);
      velocity.swap();

      u = use(P.divergence);
      gl.uniform2f(u.px, tx, ty);
      bind(u.uVelocity, velocity.read, 0);
      draw(divergence);

      u = use(P.scale);
      gl.uniform2f(u.px, tx, ty);
      bind(u.uTarget, pressure.read, 0);
      gl.uniform1f(u.value, config.pressure);
      draw(pressure.write);
      pressure.swap();

      u = use(P.pressure);
      gl.uniform2f(u.px, tx, ty);
      bind(u.uDivergence, divergence, 0);
      for (var i = 0; i < config.iterations; i++) {
        bind(u.uPressure, pressure.read, 1);
        draw(pressure.write);
        pressure.swap();
      }

      u = use(P.gradient);
      gl.uniform2f(u.px, tx, ty);
      bind(u.uPressure, pressure.read, 0);
      bind(u.uVelocity, velocity.read, 1);
      draw(velocity.write);
      velocity.swap();

      u = use(P.advect);
      gl.uniform2f(u.px, tx, ty);
      gl.uniform1f(u.dt, dt);
      bind(u.uVelocity, velocity.read, 0);
      bind(u.uSource, velocity.read, 1);
      gl.uniform1f(u.dissipation, config.velocityDissipation);
      draw(velocity.write);
      velocity.swap();

      bind(u.uVelocity, velocity.read, 0);
      bind(u.uSource, dye.read, 1);
      gl.uniform1f(u.dissipation, config.dyeDissipation);
      draw(dye.write);
      dye.swap();
    }

    function render() {
      var u = use(P.display);
      gl.uniform2f(u.px, 1 / dye.w, 1 / dye.h);
      bind(u.uDye, dye.read, 0);
      gl.uniform3fv(u.colorA, colors.a);
      gl.uniform3fv(u.colorB, colors.b);
      gl.uniform1f(u.strength, colors.strength);
      draw(null);
    }

    function frame(now) {
      if (!running) return;
      var gap = now - last;
      var dt = Math.min(gap / 1000, 0.0167);
      last = now;
      slow = gap > 42 ? slow + 1 : Math.max(0, slow - 1);
      if (slow > 24) {
        slow = 0;
        if (downgraded) {
          api.destroy();
          return;
        }
        downgraded = true;
        config.sim = 64;
        config.dye = 256;
        config.iterations = 10;
        build();
      }
      if (fit()) build();
      while (queue.length) {
        var q = queue.shift();
        splat(q[0], q[1], q[2], q[3], q[4], q[5]);
      }
      if (dt > 0) step(dt);
      render();
      if (now - lastInput > config.idleMs) {
        running = false;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        build();
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function wake() {
      lastInput = performance.now();
      if (running || dead || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function push(x, y, dx, dy, amountA, amountB) {
      if (dead) return;
      if (queue.length > 24) queue.shift();
      queue.push([x, y, dx, dy, amountA, amountB]);
      wake();
    }

    var prev = null;

    function onMove(e) {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      var x = e.clientX / window.innerWidth;
      var y = 1 - e.clientY / window.innerHeight;
      if (!prev) {
        prev = [x, y];
        return;
      }
      var dx = x - prev[0];
      var dy = y - prev[1];
      prev = [x, y];
      var aspect = window.innerWidth / window.innerHeight;
      if (aspect < 1) dx *= aspect;
      if (aspect > 1) dy /= aspect;
      var speed = Math.sqrt(dx * dx + dy * dy);
      if (speed < 0.0005) return;
      var amount = Math.min(speed * 14, 1) * 0.42 + 0.04;
      var mix = (Math.sin(performance.now() * 0.0007) + 1) / 2;
      push(x, y, dx * config.force, dy * config.force, amount * mix, amount * (1 - mix));
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }

    function onLost(e) {
      e.preventDefault();
      dead = true;
      running = false;
      cancelAnimationFrame(raf);
      canvas.classList.remove("is-on");
    }

    fit();
    build();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.classList.add("is-on");

    var api = {
      setColors: function (a, b, strength) {
        colors.a = a;
        colors.b = b;
        colors.strength = strength;
      },
      burst: function (count) {
        for (var i = 0; i < count; i++) {
          var angle = Math.random() * Math.PI * 2;
          var power = 500 + Math.random() * 700;
          var mix = Math.random();
          push(0.15 + Math.random() * 0.7, 0.2 + Math.random() * 0.6, Math.cos(angle) * power, Math.sin(angle) * power, 0.5 * mix, 0.5 * (1 - mix));
        }
      },
      destroy: function () {
        dead = true;
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.classList.remove("is-on");
        var ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      }
    };
    return api;
  }

  window.HVFluid = { create: create };
})();
