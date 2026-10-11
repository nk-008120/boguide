(function () {
  var KEY = "fxNav";
  var SHOW_MS = 1000;
  var STALE_MS = 20000;
  var veil = null;
  var timer = 0;

  function hide() {
    clearTimeout(timer);
    if (veil) veil.className = veil.className.replace(/ is-on| is-instant/g, "");
  }

  function show(ms, instant) {
    if (!veil) {
      veil = document.createElement("div");
      veil.setAttribute("role", "status");
      veil.innerHTML = '<div class="fx-nav-card"><span class="fx-nav-ring" aria-hidden="true"><i></i><i></i></span>' +
        '<span class="fx-nav-label">BiOGuide / home</span><span class="fx-nav-title">Loading</span><span class="fx-nav-rule" aria-hidden="true"></span></div>';
      document.documentElement.appendChild(veil);
    }
    veil.className = "fx-nav-veil" + (instant ? " is-instant" : "");
    veil.offsetWidth;
    veil.className += " is-on";
    clearTimeout(timer);
    timer = setTimeout(hide, ms);
  }

  try {
    var saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
    sessionStorage.removeItem(KEY);
    var age = saved ? Date.now() - saved.t : STALE_MS;
    if (saved && location.pathname === "/" && age < STALE_MS) {
      show(Math.max(SHOW_MS - age, 250), true);
      window.addEventListener("pagereveal", function (e) {
        if (e.viewTransition) e.viewTransition.skipTransition();
      });
    }
  } catch (e) {}

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.target === "_blank" || a.hasAttribute("download") || a.origin !== location.origin) return;
    if (a.pathname !== "/" || location.pathname === "/") return;
    try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now() })); } catch (err) {}
    show(STALE_MS, false);
  });

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) hide();
  });
})();
