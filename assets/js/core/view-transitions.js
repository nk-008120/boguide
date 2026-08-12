(function () {
  const CATEGORIES = [
    { type: "card", test: (a) => a.matches(".hextra-card") },
    { type: "sidebar", test: (a) => a.closest(".hextra-sidebar-container") },
    { type: "search", test: (a) => a.closest(".hextra-search-results") },
    { type: "prereq", test: (a) => a.matches(".topic-meta-link.badge-custom") },
  ];

  let pendingType = null;

  document.addEventListener("click", function (e) {
    const link = e.target.closest("a[href]");
    if (!link) return;
    const match = CATEGORIES.find((c) => c.test(link));
    pendingType = match ? match.type : null;
  }, { capture: true });

  window.addEventListener("pageswap", function (e) {
    if (e.viewTransition && pendingType) {
      e.viewTransition.types.add(pendingType);
    }
  });
})();
