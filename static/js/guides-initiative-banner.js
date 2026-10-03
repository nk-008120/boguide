(function () {
  'use strict';

  var KEY = 'guides-initiative-banner-dismissed';
  var banner = document.getElementById('gi-banner');
  if (!banner) return;

  var dismissed = false;
  try {
    dismissed = sessionStorage.getItem(KEY) === '1';
  } catch (e) {}
  if (dismissed) return;

  banner.hidden = false;

  var closeBtn = banner.querySelector('.gi-banner-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      banner.hidden = true;
      try {
        sessionStorage.setItem(KEY, '1');
      } catch (e) {}
    });
  }
})();
