(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function fmt(n) {
    if (n == null) return null;
    return String(Math.round(n * 10) / 10);
  }

  function setFill(widget, value) {
    var fill = widget.querySelector('.page-rating-stars-fill');
    var pct = Math.max(0, Math.min(100, (value / 10) * 100));
    fill.style.width = pct + '%';
  }

  function initWidget(widget) {
    var pagePath = widget.getAttribute('data-page-path');
    var input = widget.querySelector('.page-rating-input');
    var avgEl = widget.querySelector('.page-rating-avg');
    var yourWrap = widget.querySelector('.page-rating-your');
    var yourVal = widget.querySelector('.page-rating-your-value');
    var loginCta = widget.querySelector('.page-rating-login-cta');
    var loginLink = widget.querySelector('.page-rating-login-link');
    var saving = false;

    if (loginLink) {
      loginLink.href = '/account/?next=' + encodeURIComponent(pagePath);
    }

    function loadAverage() {
      var client = window.PapersAuth && window.PapersAuth.getClient();
      if (!client) {
        avgEl.textContent = 'Ratings unavailable';
        return;
      }
      client.from('page_ratings_agg').select('avg_rating,rating_count').eq('page_path', pagePath).maybeSingle()
        .then(function (result) {
          var row = result && result.data;
          if (row && row.rating_count > 0) {
            avgEl.textContent = fmt(row.avg_rating) + '/10 average (' + row.rating_count + ' rating' + (row.rating_count === 1 ? '' : 's') + ')';
          } else {
            avgEl.textContent = 'No ratings yet';
          }
        })
        .catch(function () { avgEl.textContent = 'Ratings unavailable'; });
    }

    function applyLoggedOut() {
      input.disabled = true;
      input.value = 0;
      setFill(widget, 0);
      yourWrap.hidden = true;
      loginCta.hidden = false;
    }

    function applyLoggedIn(session) {
      loginCta.hidden = true;
      input.disabled = false;
      var client = window.PapersAuth.getClient();

      client.from('page_ratings').select('rating').eq('page_path', pagePath).eq('user_id', session.user.id).maybeSingle()
        .then(function (result) {
          var row = result && result.data;
          if (row) {
            input.value = row.rating;
            setFill(widget, row.rating);
            yourVal.textContent = fmt(row.rating) + '/10';
            yourWrap.hidden = false;
          } else {
            input.value = 0;
            setFill(widget, 0);
            yourWrap.hidden = true;
          }
        });

      input.oninput = function () {
        setFill(widget, parseFloat(input.value));
      };

      input.onchange = function () {
        if (saving) return;
        var value = parseFloat(input.value);
        saving = true;
        client.from('page_ratings').upsert({
          user_id: session.user.id,
          page_path: pagePath,
          rating: value,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,page_path' })
          .then(function (result) {
            saving = false;
            if (result && result.error) return;
            yourVal.textContent = fmt(value) + '/10';
            yourWrap.hidden = false;
            loadAverage();
          })
          .catch(function () { saving = false; });
      };
    }

    loadAverage();

    if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
      applyLoggedOut();
      return;
    }

    window.PapersAuth.getSession().then(function (session) {
      if (session) applyLoggedIn(session);
      else applyLoggedOut();
    }).catch(applyLoggedOut);

    window.PapersAuth.onChange(function (session) {
      if (session) applyLoggedIn(session);
      else applyLoggedOut();
    });
  }

  ready(function () {
    var widgets = document.querySelectorAll('.page-rating');
    for (var i = 0; i < widgets.length; i++) initWidget(widgets[i]);
  });
})();
