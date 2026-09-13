(function () {
  'use strict';

  var STEPS = [
    { selector: '#prep-picker', title: 'Find Your Path',
      text: "Answer two quick questions and we'll point you to the right guide, starting resource, and study plan." },
    { selector: '.prep-jump-nav', title: 'Jump Anywhere',
      text: 'Prefer to browse? Use these links to skip straight to any section.' },
    { selector: '.olympiad-map-section', title: 'Explore National Programmes',
      text: "Every highlighted country links to a first-hand account of that olympiad's selection path." },
    { selector: '#tier-accordions', title: 'Dig Into the Syllabus',
      text: 'Each tier and topic is collapsed by default. Click any heading to expand it.' },
    { selector: '#study-plans', title: 'Pick Your Plan', end: true,
      text: 'Once you know your timeline, this table maps it to a concrete week-by-week guide.' }
  ];

  var state = { index: -1, target: null };
  var repositionHandler = null;
  var keydownHandler = null;
  var resizeObserver = null;

  function isReasonablyVisible(rect) {
    var vh = window.innerHeight, vw = window.innerWidth;
    return rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;
  }

  function scrollTargetIntoView(target) {
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
    top = Math.min(Math.max(16, top), Math.max(16, vh - ttRect.height - 16));
    var left = Math.min(Math.max(16, targetRect.left), vw - ttRect.width - 16);
    left = Math.max(16, left);
    tooltipEl.style.top = top + 'px';
    tooltipEl.style.left = left + 'px';
  }

  function reposition() {
    if (state.index < 0 || !state.target) return;
    var overlay = document.getElementById('prep-tour-overlay');
    if (!overlay) return;
    if (!isReasonablyVisible(state.target.getBoundingClientRect())) {
      scrollTargetIntoView(state.target);
    }
    var spotlight = document.getElementById('prep-tour-spotlight');
    var tooltip = document.getElementById('prep-tour-tooltip');
    var rect = spotlight ? positionSpotlight(spotlight, state.target) : null;
    if (tooltip && rect) positionTooltip(tooltip, rect);
  }

  function teardown() {
    var overlay = document.getElementById('prep-tour-overlay');
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
    state.index = -1;
    state.target = null;
  }

  function finish() {
    teardown();
  }

  function buildOverlay(step, target, index) {
    teardown();
    state.index = index;
    state.target = target;

    var overlay = document.createElement('div');
    overlay.className = 'site-tutorial-overlay';
    overlay.id = 'prep-tour-overlay';

    var spotlight = document.createElement('div');
    spotlight.className = 'site-tutorial-spotlight';
    spotlight.id = 'prep-tour-spotlight';
    overlay.appendChild(spotlight);

    var tooltip = document.createElement('div');
    tooltip.className = 'site-tutorial-tooltip';
    tooltip.id = 'prep-tour-tooltip';

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
    skipBtn.addEventListener('click', finish);
    controls.appendChild(skipBtn);

    var nav = document.createElement('div');
    nav.className = 'site-tutorial-tooltip-nav';

    if (index > 0) {
      var backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'site-tutorial-btn site-tutorial-btn-back';
      backBtn.textContent = 'Back';
      backBtn.addEventListener('click', function () { goTo(index - 1); });
      nav.appendChild(backBtn);
    }

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'site-tutorial-btn site-tutorial-btn-next';
    nextBtn.textContent = step.end ? 'Done' : 'Next';
    nextBtn.addEventListener('click', function () {
      if (step.end) finish(); else goTo(index + 1);
    });
    nav.appendChild(nextBtn);

    controls.appendChild(nav);
    tooltip.appendChild(controls);
    overlay.appendChild(tooltip);
    document.body.appendChild(overlay);

    reposition();

    repositionHandler = debounce(reposition, 80);
    window.addEventListener('resize', repositionHandler);
    window.addEventListener('scroll', repositionHandler, true);

    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(repositionHandler);
      resizeObserver.observe(document.body);
    }

    keydownHandler = function (e) {
      if (e.key === 'Escape') finish();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (step.end) finish(); else goTo(index + 1);
      } else if (e.key === 'ArrowLeft' && index > 0) goTo(index - 1);
    };
    document.addEventListener('keydown', keydownHandler);
  }

  function goTo(index) {
    var step = STEPS[index];
    if (!step) { finish(); return; }
    var target = document.querySelector(step.selector);
    if (!target) {
      goTo(index + 1);
      return;
    }
    scrollTargetIntoView(target);
    buildOverlay(step, target, index);
  }

  function start() {
    goTo(0);
  }

  function init() {
    var trigger = document.getElementById('prep-tour-trigger');
    if (!trigger) return;
    var globalActive = false;
    try { globalActive = sessionStorage.getItem('bioguide_tutorial_active') === '1'; } catch (e) {}
    if (globalActive) {
      trigger.hidden = true;
      return;
    }
    trigger.addEventListener('click', start);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
