// Cross-document View Transitions: classifies which kind of internal link was
// just clicked (subject-index card, sidebar nav, search result, or
// prerequisite chip) so custom.css's `:active-view-transition-type()` rules
// (section 15) can give each one a distinct animated reroute instead of one
// flat sitewide crossfade. Actual `navigation: auto` opt-in lives in CSS
// (`@view-transition`) — this script only tags *which* transition to play.
// Unsupported browsers ignore the unrecognized `pageswap` event entirely and
// just navigate normally; nothing here is required for navigation to work.
(function () {
  const CATEGORIES = [
    { type: "card", test: (a) => a.matches(".hextra-card") },
    { type: "sidebar", test: (a) => a.closest(".hextra-sidebar-container") },
    { type: "search", test: (a) => a.closest(".hextra-search-results") },
    { type: "prereq", test: (a) => a.matches(".topic-meta-link.badge-custom") },
  ];

  let pendingType = null;

  // Capture phase: must run before the browser starts navigating away.
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a[href]");
    if (!link) return;
    const match = CATEGORIES.find((c) => c.test(link));
    pendingType = match ? match.type : null;
  }, { capture: true });

  // Fires on the outgoing document right before it's replaced; the type set
  // here is visible to `:active-view-transition-type()` on both the old and
  // new document while the transition plays.
  window.addEventListener("pageswap", function (e) {
    if (e.viewTransition && pendingType) {
      e.viewTransition.types.add(pendingType);
    }
  });
})();
