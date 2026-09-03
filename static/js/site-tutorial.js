(function () {
  'use strict';

  var STORAGE_SEEN = 'bioguide_tutorial_seen';
  var SESSION_ACTIVE = 'bioguide_tutorial_active';
  var SESSION_STEP = 'bioguide_tutorial_step';

  var STEPS = [
    { page: '/', selector: '.hero-title',
      title: 'Welcome to BiOGuide',
      text: "Let's take a 60-second tour of what's here." },
    { page: '/about/', selector: '.recent-update-card',
      title: 'About & Changelog',
      text: 'Check back here any time for a running log of what’s new on BiOGuide.' },
    { page: '/biology-olympiad-preparation/', selector: '.olympiad-map-section',
      title: 'Explore National Programmes',
      text: 'Click any highlighted country on the interactive map to read about its Biology Olympiad selection process.' },
    { page: '/dashboard/', selector: '#dashboard-root',
      title: 'Study Dashboard',
      text: 'See your strengths, weaknesses, and what to study next — sign in to unlock personalized recommendations.' },
    { page: '/resources/', selector: '.book-filter',
      title: 'Study Resources',
      text: 'A graded list of recommended books and resources, filterable by topic.' },
    { page: '/papers/', selector: '.hextra-cards',
      title: 'Practice Papers',
      text: 'Browse the growing archive of translated Biology Olympiad papers, each with an interactive quiz and timed-attempt mode.' },
    { page: '/biobytes/', selector: '.testimonial-cards',
      activate: function () { clickTabByName('Testimonials'); },
      title: 'Reader Testimonials',
      text: 'Hear from real Biology Olympiad students -- from a Belgium bronze medallist to national teams -- about how BiOGuide helped them prepare.' },
    { page: '/bioclash/', selector: '#bioclash-root',
      title: 'BiOClash',
      text: 'Our independent, head-to-head biology competition. Go for WAR!' },
    { page: '/biolab/', selector: '.biolab-hero',
      title: 'BiOLab',
      text: 'A community protocol archive — read a protocol from the archive, or write and publish your own.' },
    { page: '/account/', selector: '#papers-account-root',
      title: 'Your Account',
      text: 'Create an account any time to save your progress across devices, register for BiOClash, and unlock full BiOBytes access.' },
    { page: '/about/', selector: '#contacts',
      title: 'Get in Touch',
      text: 'Have feedback, want to contribute, or interested in joining the team? Reach out via the emails listed here.' },
    { page: '/about/', selector: null, end: true,
      title: 'That’s the tour!',
      text: 'Replay it any time from the Site Tutorial badge on the homepage.' }
  ];

  var state = {
    stepIndex: -1,
    target: null,
    step: null
  };
  var repositionHandler = null;
  var keydownHandler = null;
  var resizeObserver = null;

  function normalizePath(p) {
    if (!p) return '/';
    if (p.length > 1 && p.charAt(p.length - 1) !== '/') p += '/';
    return p;
  }

  function samePage(a, b) {
    return normalizePath(a) === normalizePath(b);
  }

  function getSeenLocal() {
    try { return localStorage.getItem(STORAGE_SEEN) === '1'; } catch (e) { return false; }
  }

  function setSeenLocal() {
    try { localStorage.setItem(STORAGE_SEEN, '1'); } catch (e) {}
  }

  function isActive() {
    try { return sessionStorage.getItem(SESSION_ACTIVE) === '1'; } catch (e) { return false; }
  }

  function setActive(v) {
    try {
      if (v) sessionStorage.setItem(SESSION_ACTIVE, '1');
      else sessionStorage.removeItem(SESSION_ACTIVE);
    } catch (e) {}
  }

  function getStepIndex() {
    try { return parseInt(sessionStorage.getItem(SESSION_STEP), 10) || 0; } catch (e) { return 0; }
  }

  function setStepIndex(i) {
    try { sessionStorage.setItem(SESSION_STEP, String(i)); } catch (e) {}
  }

  function markSeenRemote(userId) {
    var c = window.PapersAuth && window.PapersAuth.getClient();
    if (!c || !userId) return;
    c.from('profiles').update({ site_tutorial_seen: true }).eq('id', userId).then(function () {});
  }

  function finishTour() {
    setActive(false);
    teardown();
    removeResumePill();
    setSeenLocal();
    if (window.PapersAuth && window.PapersAuth.isConfigured()) {
      window.PapersAuth.getSession().then(function (session) {
        if (session) markSeenRemote(session.user.id);
      });
    }
  }

  function teardown() {
    var overlay = document.getElementById('site-tutorial-overlay');
    if (overlay) overlay.remove();
    if (repositionHandler) {
      window.removeEventListener('resize', repositionHandler);
      window.removeEventListener('scroll', repositionHandler, true);
      repositionHandler = null;
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
    state.stepIndex = -1;
    state.target = null;
    state.step = null;
  }

  function removeResumePill() {
    var el = document.getElementById('site-tutorial-resume');
    if (el) el.remove();
  }

  function removeInviteToast() {
    var el = document.getElementById('site-tutorial-invite');
    if (el) el.remove();
  }

  function positionSpotlight(el, targetEl) {
    var rect = targetEl.getBoundingClientRect();
    var pad = 8;
    el.style.top = Math.max(0, rect.top - pad) + 'px';
    el.style.left = Math.max(0, rect.left - pad) + 'px';
    el.style.width = (rect.width + pad * 2) + 'px';
    el.style.height = (rect.height + pad * 2) + 'px';
    return rect;
  }

  function positionTooltip(tooltipEl, targetRect) {
    if (!targetRect) {
      tooltipEl.classList.add('is-centered');
      return;
    }
    tooltipEl.classList.remove('is-centered');
    var vh = window.innerHeight, vw = window.innerWidth;
    var ttRect = tooltipEl.getBoundingClientRect();
    var top;
    if (targetRect.bottom + 16 + ttRect.height < vh) {
      top = targetRect.bottom + 16;
    } else if (targetRect.top - 16 - ttRect.height > 0) {
      top = targetRect.top - 16 - ttRect.height;
    } else {
      top = Math.max(16, (vh - ttRect.height) / 2);
    }
    // Hard safety net: whatever branch fired above, never let the tooltip
    // (and its Next/Back/Skip controls) end up outside the viewport. A
    // target that's temporarily off-screen -- e.g. a page still reflowing
    // after images/fonts load -- must not carry the tooltip off-screen
    // with it, or the user is left with a "broken" tour they can't advance
    // or dismiss.
    top = Math.min(Math.max(16, top), Math.max(16, vh - ttRect.height - 16));
    var left = Math.min(Math.max(16, targetRect.left), vw - ttRect.width - 16);
    left = Math.max(16, left);
    tooltipEl.style.top = top + 'px';
    tooltipEl.style.left = left + 'px';
  }

  function reposition() {
    if (!state.step) return;
    var overlay = document.getElementById('site-tutorial-overlay');
    if (!overlay) return;
    var tooltip = document.getElementById('site-tutorial-tooltip');
    if (state.target) {
      if (!isReasonablyVisible(state.target.getBoundingClientRect())) {
        scrollTargetIntoView(state.target);
      }
      var spotlight = document.getElementById('site-tutorial-spotlight');
      var rect = spotlight ? positionSpotlight(spotlight, state.target) : null;
      if (tooltip) positionTooltip(tooltip, rect);
    } else if (tooltip) {
      positionTooltip(tooltip, null);
    }
  }

  function buildOverlay(step, target, index) {
    teardown();
    state.stepIndex = index;
    state.target = target;
    state.step = step;

    var overlay = document.createElement('div');
    overlay.className = 'site-tutorial-overlay';
    overlay.id = 'site-tutorial-overlay';

    if (target) {
      var spotlight = document.createElement('div');
      spotlight.className = 'site-tutorial-spotlight';
      spotlight.id = 'site-tutorial-spotlight';
      overlay.appendChild(spotlight);
    } else {
      var dim = document.createElement('div');
      dim.className = 'site-tutorial-dim';
      overlay.appendChild(dim);
    }

    var tooltip = document.createElement('div');
    tooltip.className = 'site-tutorial-tooltip';
    tooltip.id = 'site-tutorial-tooltip';

    var stepLabel = document.createElement('div');
    stepLabel.className = 'site-tutorial-tooltip-step';
    stepLabel.textContent = 'Step ' + (index + 1) + ' of ' + STEPS.length;
    tooltip.appendChild(stepLabel);

    var title = document.createElement('h3');
    title.className = 'site-tutorial-tooltip-title';
    title.textContent = step.title;
    tooltip.appendChild(title);

    var text = document.createElement('p');
    text.className = 'site-tutorial-tooltip-text';
    text.textContent = step.text;
    tooltip.appendChild(text);

    var controls = document.createElement('div');
    controls.className = 'site-tutorial-tooltip-controls';

    var skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.className = 'site-tutorial-btn site-tutorial-btn-ghost';
    skipBtn.textContent = 'Skip';
    skipBtn.addEventListener('click', finishTour);
    controls.appendChild(skipBtn);

    var nav = document.createElement('div');
    nav.className = 'site-tutorial-tooltip-nav';

    if (index > 0) {
      var backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'site-tutorial-btn site-tutorial-btn-back';
      backBtn.textContent = 'Back';
      backBtn.addEventListener('click', function () { goBack(index); });
      nav.appendChild(backBtn);
    }

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'site-tutorial-btn site-tutorial-btn-next';
    nextBtn.textContent = step.end ? 'Done' : 'Next';
    nextBtn.addEventListener('click', function () { goNext(index); });
    nav.appendChild(nextBtn);

    controls.appendChild(nav);
    tooltip.appendChild(controls);
    overlay.appendChild(tooltip);
    document.body.appendChild(overlay);

    reposition();

    repositionHandler = debounce(reposition, 80);
    window.addEventListener('resize', repositionHandler);
    window.addEventListener('scroll', repositionHandler, true);

    // Late-loading images/fonts on the target page can reflow content
    // after we've already measured -- reposition() (called above and by
    // this observer) re-measures the target fresh and clamps to the
    // viewport every time, so this just keeps the highlight glued to a
    // moving target without ever needing to yank the page around.
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(repositionHandler);
      resizeObserver.observe(document.body);
    }

    keydownHandler = function (e) {
      if (e.key === 'Escape') finishTour();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') goNext(index);
      else if (e.key === 'ArrowLeft' && index > 0) goBack(index);
    };
    document.addEventListener('keydown', keydownHandler);
  }

  function isReasonablyVisible(rect) {
    var vh = window.innerHeight, vw = window.innerWidth;
    return rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;
  }

  function scrollTargetIntoView(target) {
    // Elements taller than the viewport (e.g. a page's whole root wrapper)
    // can't be meaningfully centered -- block:'center' on those causes a
    // huge, disruptive scroll jump. Align to the top instead.
    var rect = target.getBoundingClientRect();
    var tall = rect.height > window.innerHeight;
    target.scrollIntoView({ block: tall ? 'start' : 'center', behavior: 'auto' });
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  // A freshly-loaded page can still be reflowing (lazy images, web fonts,
  // below-the-fold content) for a beat after its first paint. Measuring
  // and scrolling to a target before that settles is what stranded the
  // tooltip off-screen on /about/ -- so wait for the page to stop resizing
  // (or maxWait, whichever comes first) before we ever touch scroll
  // position or measure anything.
  function waitForStableLayout(callback, maxWait) {
    var done = false;
    var settleTimer = null;
    var ro = null;
    function finish() {
      if (done) return;
      done = true;
      clearTimeout(maxTimer);
      clearTimeout(settleTimer);
      if (ro) ro.disconnect();
      callback();
    }
    var maxTimer = setTimeout(finish, maxWait);
    function scheduleSettle() {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(finish, 200);
    }
    if (window.ResizeObserver) {
      ro = new ResizeObserver(scheduleSettle);
      ro.observe(document.body);
    } else {
      scheduleSettle();
    }
  }

  function clickTabByName(name) {
    var btns = document.querySelectorAll('button[role="tab"]');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].textContent.trim() === name) {
        btns[i].click();
        return true;
      }
    }
    return false;
  }

  function proceedWithStep(step, index) {
    if (!step.selector) {
      buildOverlay(step, null, index);
      return;
    }
    if (!document.querySelector(step.selector)) {
      // Selector not found on this page for some reason -- don't strand
      // the user on a blank spotlight, just advance.
      goNext(index);
      return;
    }
    waitForStableLayout(function () {
      // Re-query: the page may have changed shape (or the element removed)
      // during the wait.
      var target = document.querySelector(step.selector);
      if (!target) { goNext(index); return; }
      scrollTargetIntoView(target);
      buildOverlay(step, target, index);
    }, 1200);
  }

  function showStep(index) {
    var step = STEPS[index];
    if (!step) { finishTour(); return; }
    if (step.activate) {
      // A step that needs to click something first (e.g. switch a
      // client-side tab) has to wait for that widget's own script to be
      // ready. Our script sits in <head> and runs via defer -- which
      // executes before body-end scripts like the theme's tab handler --
      // so calling activate() immediately can click a button nothing is
      // listening to yet. window 'load' fires after every script on the
      // page has run, so it's the safe point to act.
      if (document.readyState === 'complete') {
        step.activate();
        proceedWithStep(step, index);
      } else {
        window.addEventListener('load', function () {
          step.activate();
          proceedWithStep(step, index);
        }, { once: true });
      }
    } else {
      proceedWithStep(step, index);
    }
  }

  function goNext(currentIndex) {
    var nextIndex = currentIndex + 1;
    if (nextIndex >= STEPS.length) { finishTour(); return; }
    var cur = STEPS[currentIndex];
    var next = STEPS[nextIndex];
    setStepIndex(nextIndex);
    if (samePage(cur.page, next.page)) {
      showStep(nextIndex);
    } else {
      location.href = next.page;
    }
  }

  function goBack(currentIndex) {
    if (currentIndex <= 0) return;
    var prevIndex = currentIndex - 1;
    var cur = STEPS[currentIndex];
    var prev = STEPS[prevIndex];
    setStepIndex(prevIndex);
    if (samePage(cur.page, prev.page)) {
      showStep(prevIndex);
    } else {
      location.href = prev.page;
    }
  }

  function startTour() {
    removeInviteToast();
    removeResumePill();
    setActive(true);
    setStepIndex(0);
    var first = STEPS[0];
    if (samePage(location.pathname, first.page)) {
      showStep(0);
    } else {
      location.href = first.page;
    }
  }

  function showResumePill(step) {
    if (document.getElementById('site-tutorial-resume')) return;
    var el = document.createElement('a');
    el.id = 'site-tutorial-resume';
    el.className = 'site-tutorial-resume-pill';
    el.href = step.page;
    el.textContent = '↩ Resume site tour';
    document.body.appendChild(el);
  }

  function showInviteToast() {
    if (document.getElementById('site-tutorial-invite')) return;
    var el = document.createElement('div');
    el.id = 'site-tutorial-invite';
    el.className = 'site-tutorial-invite-toast';

    var msg = document.createElement('span');
    msg.textContent = 'New here? Take a 60-second tour of BiOGuide.';
    el.appendChild(msg);

    var actions = document.createElement('div');
    actions.className = 'site-tutorial-invite-actions';

    var dismissBtn = document.createElement('button');
    dismissBtn.type = 'button';
    dismissBtn.className = 'site-tutorial-btn site-tutorial-btn-ghost';
    dismissBtn.textContent = 'Maybe later';
    dismissBtn.addEventListener('click', function () {
      el.remove();
      setSeenLocal();
      if (window.PapersAuth && window.PapersAuth.isConfigured()) {
        window.PapersAuth.getSession().then(function (session) {
          if (session) markSeenRemote(session.user.id);
        });
      }
    });
    actions.appendChild(dismissBtn);

    var startBtn = document.createElement('button');
    startBtn.type = 'button';
    startBtn.className = 'site-tutorial-btn site-tutorial-btn-primary';
    startBtn.textContent = 'Start tour';
    startBtn.addEventListener('click', startTour);
    actions.appendChild(startBtn);

    el.appendChild(actions);
    document.body.appendChild(el);
  }

  function checkEligibilityAndMaybeInvite() {
    if (getSeenLocal()) return;
    if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
      showInviteToast();
      return;
    }
    window.PapersAuth.getSession().then(function (session) {
      if (!session) { showInviteToast(); return; }
      window.PapersAuth.getProfile(session.user.id).then(function (profile) {
        // Staff already know the site -- and showing this alongside the
        // staff-welcome toast (static/js/staff-welcome.js) would stack two
        // toasts in the same bottom-right corner, so they're excluded from
        // the tour invite entirely rather than just visually avoided.
        if (profile && (profile.site_tutorial_seen || profile.is_staff)) {
          setSeenLocal();
          return;
        }
        showInviteToast();
      });
    });
  }

  function init() {
    if (isActive()) {
      var idx = getStepIndex();
      var step = STEPS[idx];
      if (step && samePage(location.pathname, step.page)) {
        showStep(idx);
      } else if (step) {
        showResumePill(step);
      }
    } else {
      checkEligibilityAndMaybeInvite();
    }

    var badge = document.getElementById('tutorial-replay-badge');
    if (badge) {
      badge.addEventListener('click', function () {
        setActive(false);
        teardown();
        removeResumePill();
        removeInviteToast();
        startTour();
      });
    }
  }

  window.SiteTutorial = { start: startTour };

  init();
})();
