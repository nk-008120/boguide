/*
 * Focus/fullscreen reading mode for individual BiOrchive question pages
 * (layouts/papers/question.html). Two jobs:
 *   1. True Fullscreen API, kept alive across Previous/Next by turning those
 *      links into fetch+DOM-swap "navigation" (same fetch-and-strip trick
 *      static/js/papers-attempt.js already uses against these same pages),
 *      since a real page load would drop fullscreen.
 *   2. Auto-fit: shrink the question (via a scale transform, so measurement
 *      stays accurate regardless of the theme's rem-based typography) until
 *      it fits the viewport without scrolling; if it can't fit even at the
 *      smallest readable size, fall back to an internal scroll on just the
 *      content pane, chrome stays put.
 */
(function () {
  'use strict';

  var root = document.getElementById('focus-reader-root');
  if (!root) return;

  var contentEl = document.getElementById('focus-reader-content');
  var contentWrap = document.querySelector('.focus-reader-content-wrap');
  var topnavEl = document.getElementById('focus-reader-topnav');
  var fsBtn = document.getElementById('focus-reader-fs-btn');

  var cache = {};
  var swapping = false;

  // ---- relocate the existing Previous/Next nav into the top bar ----
  function relocateNav(container) {
    var nav = container.querySelector('.papers-quiz-nav');
    topnavEl.innerHTML = '';
    if (nav) topnavEl.appendChild(nav);
  }

  // ---- innerHTML swaps don't execute <script> tags; force re-execution ----
  function runScripts(container) {
    container.querySelectorAll('script').forEach(function (old) {
      var fresh = document.createElement('script');
      for (var i = 0; i < old.attributes.length; i++) {
        fresh.setAttribute(old.attributes[i].name, old.attributes[i].value);
      }
      fresh.textContent = old.textContent;
      old.parentNode.replaceChild(fresh, old);
    });
  }

  // ---- auto-fit shrink ----
  var SCALE_STEPS = [1, 0.92, 0.85, 0.78, 0.72, 0.66, 0.6];
  var fitTimer;

  function fitContentNow() {
    if (!contentWrap || !contentEl) return;
    contentWrap.classList.remove('focus-reader-scroll');
    var available = contentWrap.clientHeight;
    if (!available) return;
    for (var i = 0; i < SCALE_STEPS.length; i++) {
      contentEl.style.setProperty('--focus-scale', SCALE_STEPS[i]);
      if (contentEl.getBoundingClientRect().height <= available) return;
    }
    contentWrap.classList.add('focus-reader-scroll');
  }

  function fitContent() {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitContentNow, 30);
  }

  function watchImages(container) {
    container.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) img.addEventListener('load', fitContent, { once: true });
    });
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitContentNow, 150);
  });
  window.addEventListener('load', fitContent);

  // ---- fullscreen ----
  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
  }
  function enterFullscreen() {
    var el = document.documentElement;
    var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (req) { try { req.call(el).catch(function () {}); } catch (e) {} }
  }
  function exitFullscreen() {
    var ex = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (ex) { try { ex.call(document).catch(function () {}); } catch (e) {} }
  }
  function updateFsBtn() {
    if (!fsBtn) return;
    fsBtn.textContent = isFullscreen() ? '⛶ Exit Fullscreen' : '⛶ Fullscreen';
  }
  if (fsBtn) {
    fsBtn.addEventListener('click', function () {
      if (isFullscreen()) exitFullscreen(); else enterFullscreen();
    });
  }
  ['fullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange'].forEach(function (ev) {
    document.addEventListener(ev, function () {
      updateFsBtn();
      fitContent();
    });
  });

  // ---- SPA Previous/Next ----
  function extractFragment(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return { content: doc.getElementById('focus-reader-content'), title: doc.title };
  }

  function fetchQuestion(url) {
    if (cache[url]) return Promise.resolve(cache[url]);
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('bad response');
      return r.text();
    }).then(function (html) {
      var frag = extractFragment(html);
      if (!frag.content) throw new Error('no content in response');
      cache[url] = frag;
      return frag;
    });
  }

  function applyFragment(frag) {
    contentEl.innerHTML = frag.content.innerHTML;
    if (frag.title) document.title = frag.title;
    relocateNav(contentEl);
    runScripts(contentEl);
    wireNavLinks();
    watchImages(contentEl);
    contentWrap.scrollTop = 0;
    fitContent();
  }

  function goTo(url, push) {
    if (swapping) return;
    swapping = true;
    fetchQuestion(url).then(function (frag) {
      applyFragment(frag);
      if (push) history.pushState({ focusReader: true }, frag.title || '', url);
      swapping = false;
    }).catch(function () {
      swapping = false;
      window.location.href = url;
    });
  }

  function wireNavLinks() {
    var links = topnavEl.querySelectorAll('a.papers-nav-prev, a.papers-nav-next');
    links.forEach(function (a) {
      if (a.dataset.focusWired) return;
      a.dataset.focusWired = '1';
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href) return;
        e.preventDefault();
        goTo(href, true);
      });
    });
  }

  window.addEventListener('popstate', function () {
    goTo(window.location.pathname, false);
  });

  // ---- init ----
  relocateNav(contentEl);
  wireNavLinks();
  watchImages(contentEl);
  fitContent();
})();
