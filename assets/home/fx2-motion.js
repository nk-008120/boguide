(function () {
  var body = document.body;
  if (!body || !body.classList.contains("fx-2")) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !/[?&]motion=on/.test(window.location.search);
  if (reduce) return;

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
  body.appendChild(ambient);
  body.appendChild(layer("div", "fx2-grain"));
})();
