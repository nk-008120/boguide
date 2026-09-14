(function () {
  'use strict';

  var KEY = 'bioclash-s1-banner-dismissed';
  var banner = document.getElementById('bioclash-registration-banner');
  if (!banner) return;

  var dismissed = false;
  try {
    dismissed = sessionStorage.getItem(KEY) === '1';
  } catch (e) {}
  if (dismissed) return;

  banner.hidden = false;

  var closeBtn = banner.querySelector('.bioclash-registration-banner-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      banner.hidden = true;
      try {
        sessionStorage.setItem(KEY, '1');
      } catch (e) {}
    });
  }
})();
