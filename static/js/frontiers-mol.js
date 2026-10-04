(function () {
  'use strict';

  var root = document.getElementById('fr-mol');
  if (!root || root.getAttribute('data-ready')) return;
  root.setAttribute('data-ready', '1');

  var BINDER = '#e0457b';
  var TOXIN = '#1f9bb5';
  var host = root.querySelector('.fr-mol-canvas');
  var status = root.querySelector('.fr-viz-status');
  var buttons = {};
  var viewer = null;
  var flags = { surface: false, interface: false, spin: true };
  var started = false;
  var surfaceId = null;
  var surfacePending = false;

  function loadScript(url, done, fail) {
    var s = document.createElement('script');
    s.src = url;
    s.onload = done;
    s.onerror = fail;
    document.head.appendChild(s);
  }

  function backgroundHex() {
    var m = getComputedStyle(host).backgroundColor.match(/\d+/g);
    if (!m) return '#faf7f0';
    return '#' + m.slice(0, 3).map(function (v) {
      var h = Number(v).toString(16);
      return h.length === 1 ? '0' + h : h;
    }).join('');
  }

  function fallback(message) {
    status.textContent = message;
    status.hidden = false;
  }

  function setSurface(on) {
    if (on && surfaceId == null && !surfacePending) {
      surfacePending = true;
      viewer.addSurface($3Dmol.SurfaceType.VDW, { opacity: 0.62, color: TOXIN }, { chain: 'B' }).then(function (id) {
        surfacePending = false;
        if (flags.surface) {
          surfaceId = id;
        } else {
          viewer.removeSurface(id);
        }
        viewer.render();
      });
    } else if (!on && surfaceId != null) {
      viewer.removeSurface(surfaceId);
      surfaceId = null;
      viewer.render();
    }
  }

  function apply() {
    viewer.setStyle({}, {});
    viewer.setStyle({ chain: 'A' }, { cartoon: { color: BINDER } });
    viewer.setStyle({ chain: 'B' }, { cartoon: { color: TOXIN } });
    if (flags.interface) {
      viewer.addStyle({ chain: 'A', within: { distance: 4.5, sel: { chain: 'B' } } }, { stick: { radius: 0.2, colorscheme: 'magentaCarbon' } });
      viewer.addStyle({ chain: 'B', within: { distance: 4.5, sel: { chain: 'A' } } }, { stick: { radius: 0.2, colorscheme: 'cyanCarbon' } });
    }
    viewer.spin(flags.spin);
    viewer.render();
    setSurface(flags.surface);
  }

  function refreshButtons() {
    Object.keys(buttons).forEach(function (key) {
      buttons[key].setAttribute('aria-pressed', flags[key] ? 'true' : 'false');
      buttons[key].classList.toggle('is-on', flags[key]);
    });
  }

  function wire() {
    ['surface', 'interface', 'spin'].forEach(function (key) {
      var b = root.querySelector('[data-mol="' + key + '"]');
      buttons[key] = b;
      b.addEventListener('click', function () {
        flags[key] = !flags[key];
        refreshButtons();
        apply();
      });
    });
    var reset = root.querySelector('[data-mol="reset"]');
    reset.addEventListener('click', function () {
      viewer.zoomTo();
      viewer.render();
    });
    refreshButtons();
  }

  function init() {
    fetch(root.getAttribute('data-pdb'))
      .then(function (r) {
        if (!r.ok) throw new Error('structure file missing');
        return r.text();
      })
      .then(function (pdb) {
        try {
          viewer = $3Dmol.createViewer(host, { backgroundColor: backgroundHex() });
        } catch (e) {
          fallback('This browser could not start the 3D viewer (WebGL is needed). The structure is PDB entry 9BK5 on rcsb.org.');
          return;
        }
        viewer.addModel(pdb, 'pdb');
        status.hidden = true;
        new MutationObserver(function () {
          viewer.setBackgroundColor(backgroundHex());
          viewer.render();
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        wire();
        apply();
        viewer.zoomTo();
        viewer.render();
      })
      .catch(function () {
        fallback('The structure could not be loaded. It is PDB entry 9BK5 on rcsb.org.');
      });
  }

  function start() {
    if (started) return;
    started = true;
    loadScript('/vendor/3dmol/3Dmol-min.js', init, function () {
      fallback('The 3D viewer library could not be loaded.');
    });
  }

  if ('IntersectionObserver' in window) {
    var near = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        near.disconnect();
        start();
      }
    }, { rootMargin: '600px 0px' });
    near.observe(root);
  } else {
    start();
  }
})();
