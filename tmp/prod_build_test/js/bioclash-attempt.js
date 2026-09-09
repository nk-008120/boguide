(function () {
  'use strict';

  var root = document.getElementById('bioclash-attempt-root');
  if (!root) return;

  var PAPER_ID = root.getAttribute('data-paper-id');

  var RECORDING_UPLOAD_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSckhuzgocCdJklygS8cs-CVqa9E8rXOE_l0pnCGKc_ZsabQpA/viewform?usp=publish-editor';

  function forceDark() {
    var cl = document.documentElement.classList;
    if (cl.contains('light') || cl.contains('favourite') || !cl.contains('dark')) {
      cl.remove('light', 'favourite');
      cl.add('dark');
    }
  }

  document.body.classList.add('bioclash-attempt-active');

  var themeAtLoad = localStorage.getItem('color-theme');
  document.addEventListener('click', function (e) {
    if (e.target.closest('.hextra-theme-toggle, .hextra-theme-toggle-options')) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);
  new MutationObserver(function () {
    if (localStorage.getItem('color-theme') !== themeAtLoad) {
      if (themeAtLoad === null) localStorage.removeItem('color-theme');
      else localStorage.setItem('color-theme', themeAtLoad);
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  forceDark();
  new MutationObserver(forceDark).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  var startScreen = document.getElementById('bioclash-attempt-start');
  var liveScreen = document.getElementById('bioclash-attempt-live');
  var reportScreen = document.getElementById('bioclash-attempt-report');
  var startBtn = document.getElementById('bioclash-attempt-start-btn');
  var startStatus = document.getElementById('bioclash-attempt-start-status');
  var honorCodeCheckbox = document.getElementById('bioclash-attempt-honor-code');
  var directiveCheckboxes = Array.prototype.slice.call(document.querySelectorAll('.bioclash-directive-checkbox'));
  var timerEl = document.getElementById('bioclash-attempt-timer');
  var bodyEl = document.getElementById('bioclash-attempt-body');
  var submitBtn = document.getElementById('bioclash-attempt-submit-btn');
  var extendBtn = document.getElementById('bioclash-attempt-extend-btn');
  var watermarkEl = document.getElementById('bioclash-attempt-watermark');

  var state = {
    attemptId: null,
    endAt: null,
    blocks: [],
    fullscreenExits: 0,
    visibilityLosses: 0,
    currentPartIndex: 0,
    currentPartIndexSet: false,
    sessionToken: null,
    accessToken: null,
    superseded: false,
    totalPages: null,
    reachedFinalPageLocally: false,
    extensionBlocksUsed: 0,
    maxExtensionBlocks: 0,
    extensionBlockMinutes: 0,
    extensionCostSchedule: [],
    lockFlowActive: false
  };
  var timerInterval = null;
  var heartbeatInterval = null;
  var draftTimers = {};

  function authHeaders(session) {
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session.access_token };
  }

  function apiPost(path, body) {
    return window.PapersAuth.getSession().then(function (session) {
      if (!session) return { ok: false, status: 401, body: { error: 'Invalid session' } };
      state.accessToken = session.access_token;
      return fetch(path, { method: 'POST', headers: authHeaders(session), body: JSON.stringify(body || {}) })
        .then(function (r) { return r.json().then(function (json) { return { ok: r.ok, status: r.status, body: json }; }); });
    });
  }

  function apiGet(path) {
    return window.PapersAuth.getSession().then(function (session) {
      if (!session) return { ok: false, status: 401, body: { error: 'Invalid session' } };
      state.accessToken = session.access_token;
      return fetch(path, { headers: { 'Authorization': 'Bearer ' + session.access_token } })
        .then(function (r) { return r.json().then(function (json) { return { ok: r.ok, status: r.status, body: json }; }); });
    });
  }

  function showScreen(el) {
    [startScreen, liveScreen, reportScreen].forEach(function (s) { if (s) s.hidden = (s !== el); });
  }

  function formatDuration(ms) {
    if (ms < 0) ms = 0;
    var totalSec = Math.floor(ms / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    return (h > 0 ? h + ':' : '') + pad(m) + ':' + pad(s);
  }

  function tickTimer() {
    var remaining = new Date(state.endAt).getTime() - Date.now();
    if (timerEl) {
      timerEl.textContent = formatDuration(remaining);
      timerEl.classList.toggle('bioclash-timer-low', remaining < 5 * 60000);
    }
    if (remaining <= 0) {
      clearInterval(timerInterval);
      doSubmit(true);
    }
  }

  function startHeartbeat() {
    clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(function () {
      if (!state.sessionToken) return;
      apiPost('/api/bioclash-heartbeat', { paperId: PAPER_ID, sessionToken: state.sessionToken }).then(function (result) {
        if (result.body && result.body.reason === 'superseded') handleSessionSuperseded();
      });
    }, 20000);
  }

  function markFinalPageReached() {
    if (state.reachedFinalPageLocally) return;
    state.reachedFinalPageLocally = true;
    if (!state.sessionToken) return;
    apiPost('/api/bioclash-heartbeat', { paperId: PAPER_ID, sessionToken: state.sessionToken, reachedFinalPage: true });
  }

  function updateExtendButton() {
    if (!extendBtn) return;
    var remaining = state.maxExtensionBlocks - state.extensionBlocksUsed;
    if (!state.maxExtensionBlocks || remaining <= 0) {
      extendBtn.hidden = true;
      return;
    }
    var nextCost = state.extensionCostSchedule[state.extensionBlocksUsed];
    extendBtn.hidden = false;
    extendBtn.disabled = false;
    extendBtn.textContent = '+' + state.extensionBlockMinutes + ' min' +
      (nextCost != null ? ' (costs ~' + nextCost.toFixed(2) + ' Z)' : '');
  }

  function requestExtension() {
    if (!extendBtn) return;
    var nextCost = state.extensionCostSchedule[state.extensionBlocksUsed];
    var warn = 'Requesting +' + state.extensionBlockMinutes + ' minutes will cost ' +
      (nextCost != null ? 'approximately ' + nextCost.toFixed(2) : 'a') +
      ' point off this round’s standardized ranking once results are finalized. ' +
      'This cannot be undone.\n\nContinue?';
    if (!window.confirm(warn)) return;
    extendBtn.disabled = true;
    apiPost('/api/bioclash-request-extension', { paperId: PAPER_ID, sessionToken: state.sessionToken }).then(function (result) {
      if (result.body && result.body.reason === 'superseded') {
        handleSessionSuperseded();
        return;
      }
      if (!result.ok) {
        window.alert(result.body.error || 'Could not grant extension.');
        extendBtn.disabled = false;
        return;
      }
      state.endAt = result.body.endAt;
      state.extensionBlocksUsed = result.body.extensionBlocksUsed;
      updateExtendButton();
    });
  }
  if (extendBtn) extendBtn.addEventListener('click', requestExtension);

  function handleSessionSuperseded() {
    if (state.superseded) return;
    state.superseded = true;
    clearInterval(heartbeatInterval);
    clearInterval(timerInterval);
    if (!liveScreen) return;
    liveScreen.querySelectorAll('input, textarea, button').forEach(function (el) { el.disabled = true; });
    var banner = document.createElement('div');
    banner.className = 'bioclash-superseded-banner';
    banner.textContent = '⛔ This attempt is now open in another tab or device. This session has been locked. Close this tab, or reload to reclaim it here instead.';
    liveScreen.insertBefore(banner, liveScreen.firstChild);
  }

  function enterFullscreen() {
    var el = document.documentElement;
    var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (req) { try { req.call(el).catch(function () {}); } catch (e) {} }
  }

  function applyContentBlur() {
    document.body.classList.add('bioclash-attempt-blurred');
  }
  function removeContentBlur() {
    document.body.classList.remove('bioclash-attempt-blurred');
  }

  document.addEventListener('fullscreenchange', function () {
    if (!liveScreen || liveScreen.hidden) return;
    if (!document.fullscreenElement) {
      state.fullscreenExits += 1;

      if (!state.lockFlowActive) applyContentBlur();
    } else {
      removeContentBlur();
    }
  });
  document.addEventListener('visibilitychange', function () {
    if (!liveScreen || liveScreen.hidden) return;
    if (document.hidden) {
      state.visibilityLosses += 1;
      if (!state.lockFlowActive) applyContentBlur();
    } else {
      removeContentBlur();
    }
  });
  window.addEventListener('focus', function () {
    if (liveScreen && !liveScreen.hidden) removeContentBlur();
  });

  function isEditableTarget(el) {
    return !!(el && el.closest && el.closest('input, textarea'));
  }
  ['copy', 'cut', 'contextmenu', 'selectstart', 'dragstart'].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
      if (!liveScreen || liveScreen.hidden) return;
      if (!liveScreen.contains(e.target)) return;
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    }, true);
  });

  function withSession(fn) {
    if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
      if (startStatus) startStatus.textContent = 'Login is not configured in this environment.';
      return;
    }
    window.PapersAuth.getSession().then(function (session) {
      if (!session) {
        if (startStatus) {
          startStatus.innerHTML = 'You need to be logged in for this. <a href="/account/?next=' + encodeURIComponent(location.pathname) + '">Log in</a>';
        }
        return;
      }
      state.accessToken = session.access_token;
      fn(session);
    });
  }

  function renderWatermark(code) {
    if (!watermarkEl || !code) return;
    watermarkEl.textContent = new Array(40).fill(code).join('   ');
  }

  function renderState(data) {
    state.attemptId = data.attemptId;
    state.endAt = data.endAt;
    state.blocks = data.blocks || [];
    state.fullscreenExits = data.fullscreenExits || 0;
    state.visibilityLosses = data.visibilityLosses || 0;
    if (data.sessionToken) state.sessionToken = data.sessionToken;
    if (data.totalPages) state.totalPages = data.totalPages;

    if (data.reachedFinalPage) state.reachedFinalPageLocally = true;
    state.extensionBlocksUsed = data.extensionBlocksUsed || 0;
    state.maxExtensionBlocks = data.maxExtensionBlocks || 0;
    state.extensionBlockMinutes = data.extensionBlockMinutes || 0;
    state.extensionCostSchedule = data.extensionCostSchedule || [];
    renderWatermark(data.watermark);

    if (data.status === 'submitted') {
      renderReport(data);
      return;
    }
    if (data.status === 'expired') {
      renderReport(data);
      return;
    }

    showScreen(liveScreen);
    clearInterval(timerInterval);
    timerInterval = setInterval(tickTimer, 1000);
    tickTimer();
    startHeartbeat();
    updateExtendButton();
    renderBlocks();
  }

  function componentValue(block, key) {
    return block.answer && block.answer[key];
  }

  function renderTable(tableData) {
    var wrap = document.createElement('div');
    wrap.className = 'bioclash-table-wrap';
    var table = document.createElement('table');
    table.className = 'bioclash-ref-table';
    if (tableData.headers) {
      var thead = document.createElement('thead');
      var hr = document.createElement('tr');
      tableData.headers.forEach(function (h) {
        var th = document.createElement('th');
        th.textContent = h;
        hr.appendChild(th);
      });
      thead.appendChild(hr);
      table.appendChild(thead);
    }
    var tbody = document.createElement('tbody');
    (tableData.rows || []).forEach(function (row) {
      var tr = document.createElement('tr');
      row.forEach(function (cell) {
        var td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function renderComponent(block, component) {
    var wrap = document.createElement('div');
    wrap.className = 'bioclash-component';
    var prompt = document.createElement('p');
    prompt.className = 'bioclash-component-prompt';
    prompt.textContent = component.prompt + (component.marks ? ' [' + component.marks + ']' : '');
    wrap.appendChild(prompt);

    if (component.imageRef) {
      var img = document.createElement('img');
      img.src = component.imageRef;
      img.className = 'bioclash-component-image';
      img.alt = '';
      wrap.appendChild(img);
    }

    if (component.table) wrap.appendChild(renderTable(component.table));

    var current = componentValue(block, component.key);
    var input;

    var locked = block.status === 'locked';

    if (component.type === 'mcq') {
      var optWrap = document.createElement('div');
      optWrap.className = 'bioclash-mcq-options';
      component.options.forEach(function (opt) {
        var label = document.createElement('label');
        label.className = 'bioclash-mcq-option';
        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = block.id + '-' + component.key;
        radio.value = opt.key;
        radio.checked = current === opt.key;
        radio.disabled = locked;
        label.appendChild(radio);

        label.appendChild(document.createTextNode(' ' + opt.key + ') ' + opt.text));
        optWrap.appendChild(label);
      });
      input = optWrap;
    } else if (component.type === 'true_false') {
      var tfWrap = document.createElement('div');
      tfWrap.className = 'bioclash-tf-options';
      [true, false].forEach(function (val) {
        var label = document.createElement('label');
        label.className = 'bioclash-tf-option';
        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = block.id + '-' + component.key;
        radio.value = String(val);
        radio.checked = current === val;
        radio.disabled = locked;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(' ' + (val ? 'TRUE' : 'FALSE')));
        tfWrap.appendChild(label);
      });
      input = tfWrap;
    } else if (component.type === 'numeric') {
      input = document.createElement('input');
      input.type = 'number';
      input.step = 'any';
      input.className = 'bioclash-numeric-input';
      if (current !== undefined) input.value = current;
      input.disabled = locked;
    } else {
      input = document.createElement('textarea');
      input.className = 'bioclash-freetext-input';
      input.rows = component.type === 'fill_blank' ? 1 : 3;
      if (current !== undefined) input.value = current;
      input.disabled = locked;
    }
    wrap.appendChild(input);
    return { el: wrap, input: input };
  }

  function renderFreeTextForOthers(block, component, inputs, onChange) {
    var ref = inputs[component.refersTo];
    var wrap = document.createElement('div');
    wrap.className = 'bioclash-component bioclash-free-text-for-others';
    var saved = componentValue(block, component.key) || {};
    var boxes = {};

    function optionKeys() {
      if (!ref) return [];
      return Array.prototype.map.call(ref.input.querySelectorAll('input[type=radio]'), function (r) { return r.value; });
    }
    function selectedKey() {
      if (!ref) return null;
      var checked = ref.input.querySelector('input:checked');
      return checked ? checked.value : null;
    }
    function flushBoxesToSaved() {
      Object.keys(boxes).forEach(function (k) { saved[k] = boxes[k].value; });
    }

    function rebuild() {
      flushBoxesToSaved();
      wrap.innerHTML = '';
      boxes = {};
      var sel = selectedKey();
      if (!sel) {
        var hint = document.createElement('p');
        hint.className = 'bioclash-component-hint';
        hint.textContent = 'Pick an answer above first — the questions for the other options appear here.';
        wrap.appendChild(hint);
        return;
      }
      optionKeys().filter(function (k) { return k !== sel; }).forEach(function (k) {
        var p = document.createElement('p');
        p.className = 'bioclash-component-prompt';
        p.textContent = component.promptTemplate.replace('{option}', k) + (component.marksEach ? ' [' + component.marksEach + ']' : '');
        wrap.appendChild(p);
        var ta = document.createElement('textarea');
        ta.className = 'bioclash-freetext-input';
        ta.rows = 2;
        ta.value = saved[k] || '';
        ta.addEventListener('input', function () { saved[k] = ta.value; onChange(); });
        wrap.appendChild(ta);
        boxes[k] = ta;
      });
    }

    rebuild();
    if (ref) ref.input.addEventListener('change', rebuild);

    return {
      el: wrap,
      getAnswer: function () {
        flushBoxesToSaved();
        var sel = selectedKey();
        var out = {};
        optionKeys().filter(function (k) { return k !== sel; }).forEach(function (k) {
          if (saved[k]) out[k] = saved[k];
        });
        return out;
      }
    };
  }

  function collectAnswers(block, inputs) {
    var answers = {};
    (block.components || []).forEach(function (component) {
      var entry = inputs[component.key];
      if (!entry) return;
      if (component.type === 'mcq' || component.type === 'true_false') {
        var checked = entry.el.querySelector('input:checked');
        if (!checked) return;
        answers[component.key] = component.type === 'true_false' ? checked.value === 'true' : checked.value;
      } else if (component.type === 'free_text_for_others') {
        answers[component.key] = entry.getAnswer();
      } else if (component.type === 'numeric') {
        if (entry.input.value !== '') answers[component.key] = Number(entry.input.value);
      } else {
        if (entry.input.value !== '') answers[component.key] = entry.input.value;
      }
    });
    return answers;
  }

  function scheduleDraftSave(block, inputs) {
    clearTimeout(draftTimers[block.id]);
    draftTimers[block.id] = setTimeout(function () {
      var answers = collectAnswers(block, inputs);
      apiPost('/api/bioclash-save-draft', {
        paperId: PAPER_ID,
        blockId: block.id,
        componentAnswers: answers,
        fullscreenExits: state.fullscreenExits,
        visibilityLosses: state.visibilityLosses,
        sessionToken: state.sessionToken
      }).then(function (result) {
        if (result.body && result.body.reason === 'superseded') handleSessionSuperseded();
      });
    }, 800);
  }

  function pageList() {
    var byPart = {};
    state.blocks.forEach(function (b) { (byPart[b.partId] = byPart[b.partId] || []).push(b); });
    var chainParts = {};
    Object.keys(byPart).forEach(function (pid) {
      chainParts[pid] = byPart[pid].every(function (b) { return b.locksAfterSubmit || b.type === 'reveal_content'; });
    });

    var pages = [];
    var partSeen = {};
    var pendingReveals = [];
    var i = 0;
    while (i < state.blocks.length) {
      var block = state.blocks[i];
      if (chainParts[block.partId]) {
        if (block.type === 'reveal_content') {
          pendingReveals.push(block);
          i++;
          continue;
        }
        var leading = pendingReveals.filter(function (r) { return r.partId === block.partId; });
        pendingReveals = pendingReveals.filter(function (r) { return r.partId !== block.partId; });
        pages.push({
          id: block.id,
          partId: block.partId,
          name: block.partName,
          intro: partSeen[block.partId] ? null : block.partIntro,
          leading: leading,
          blocks: [block]
        });
        partSeen[block.partId] = true;
        i++;
      } else {
        var pid = block.partId;
        var group = [];
        while (i < state.blocks.length && state.blocks[i].partId === pid) {
          group.push(state.blocks[i]);
          i++;
        }
        pages.push({
          id: pid,
          partId: pid,
          name: block.partName,
          intro: partSeen[pid] ? null : block.partIntro,
          leading: [],
          blocks: group
        });
        partSeen[pid] = true;
      }
    }
    return pages;
  }

  function pageIsSealed(page) {
    return page.blocks.every(function (b) { return b.locksAfterSubmit || b.type === 'reveal_content'; });
  }

  function findPageIndexForBlockId(list, blockId) {
    for (var i = 0; i < list.length; i++) {
      var page = list[i];
      if (page.blocks.some(function (b) { return b.id === blockId; })) return i;
      if (page.leading.some(function (b) { return b.id === blockId; })) return i;
    }
    return -1;
  }

  function renderPartNav(list, pageIdx) {
    var nav = document.createElement('div');
    nav.className = 'bioclash-part-nav';

    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'papers-nav-btn bioclash-part-nav-btn';
    prevBtn.textContent = '← Previous';
    var prevTarget = pageIdx - 1;
    var prevDisabled = prevTarget < 0 || pageIsSealed(list[prevTarget]);
    prevBtn.disabled = prevDisabled;
    prevBtn.title = prevDisabled && prevTarget >= 0
      ? 'This question is non-recoverable and already behind you.'
      : '';
    prevBtn.addEventListener('click', function () {
      state.currentPartIndex = prevTarget;
      renderBlocks();
    });

    var label = document.createElement('span');
    label.className = 'bioclash-part-nav-label';

    var total = state.totalPages || list.length;
    label.textContent = 'Page ' + (pageIdx + 1) + ' of ' + total + ': ' + (list[pageIdx].name || '');

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'papers-nav-btn bioclash-part-nav-btn';
    nextBtn.textContent = 'Next →';
    var nextTarget = pageIdx + 1;

    nextBtn.disabled = nextTarget >= list.length;
    nextBtn.addEventListener('click', function () {
      state.currentPartIndex = nextTarget;
      renderBlocks();
    });

    nav.appendChild(prevBtn);
    nav.appendChild(label);
    nav.appendChild(nextBtn);
    return nav;
  }

  function renderBlocks() {
    if (!bodyEl) return;
    bodyEl.innerHTML = '';

    var list = pageList();
    if (!list.length) return;
    if (!state.currentPartIndexSet) {
      state.currentPartIndex = list.length - 1;
      state.currentPartIndexSet = true;
    }
    if (state.currentPartIndex >= list.length) state.currentPartIndex = list.length - 1;
    if (state.currentPartIndex < 0) state.currentPartIndex = 0;
    var pageIdx = state.currentPartIndex;
    var currentPage = list[pageIdx];

    if (state.totalPages && pageIdx === state.totalPages - 1) markFinalPageReached();
    if (submitBtn) {
      submitBtn.disabled = !state.reachedFinalPageLocally;
      submitBtn.title = state.reachedFinalPageLocally
        ? ''
        : 'You must reach the final page of the paper at least once before you can submit.';
    }

    bodyEl.appendChild(renderPartNav(list, pageIdx));

    var heading = document.createElement('h3');
    heading.className = 'bioclash-part-heading';
    heading.textContent = currentPage.name || '';
    bodyEl.appendChild(heading);
    if (currentPage.intro) {
      var intro = document.createElement('p');
      intro.className = 'bioclash-part-intro';
      intro.textContent = currentPage.intro;
      bodyEl.appendChild(intro);
    }

    var visibleBlocks = currentPage.leading.concat(currentPage.blocks);
    visibleBlocks.forEach(function (block) {
      var section = document.createElement('section');
      section.className = 'bioclash-block bioclash-block-' + block.status;
      if (block.label) {
        var label = document.createElement('h4');
        label.className = 'bioclash-block-label';
        label.textContent = block.label;
        section.appendChild(label);
      }
      if (block.table) section.appendChild(renderTable(block.table));
      (block.tables || []).forEach(function (t) {
        if (t.title) {
          var tTitle = document.createElement('p');
          tTitle.className = 'bioclash-table-title';
          tTitle.textContent = t.title;
          section.appendChild(tTitle);
        }
        section.appendChild(renderTable(t));
      });
      (block.images || []).forEach(function (imgSpec) {
        var figWrap = document.createElement('figure');
        figWrap.className = 'bioclash-block-figure';
        var img = document.createElement('img');
        img.src = imgSpec.src;
        img.className = 'bioclash-component-image';
        img.alt = imgSpec.caption || '';
        figWrap.appendChild(img);
        if (imgSpec.caption) {
          var cap = document.createElement('figcaption');
          cap.textContent = imgSpec.caption;
          figWrap.appendChild(cap);
        }
        section.appendChild(figWrap);
      });

      if (block.lockWarning && block.status === 'active') {
        var warnBanner = document.createElement('p');
        warnBanner.className = 'bioclash-nonrecoverable-banner';
        warnBanner.textContent = '⛔ NON-RECOVERABLE — ' + block.lockWarning;
        section.appendChild(warnBanner);
      }

      if (block.type === 'reveal_content') {
        var content = document.createElement('div');
        content.className = 'bioclash-reveal-content';
        content.textContent = block.content;
        section.appendChild(content);
        bodyEl.appendChild(section);
        return;
      }

      var inputs = {};
      var deferred = [];

      (block.components || []).forEach(function (component) {
        if (component.type === 'free_text_for_others') { deferred.push(component); return; }
        var rendered = renderComponent(block, component);
        inputs[component.key] = rendered;
        section.appendChild(rendered.el);
        if (block.status === 'active' && !block.locksAfterSubmit) {
          rendered.el.addEventListener('input', function () { scheduleDraftSave(block, inputs); });
          rendered.el.addEventListener('change', function () { scheduleDraftSave(block, inputs); });
        }
      });

      deferred.forEach(function (component) {
        var onChange = (block.status === 'active' && !block.locksAfterSubmit)
          ? function () { scheduleDraftSave(block, inputs); }
          : function () {};
        var rendered = renderFreeTextForOthers(block, component, inputs, onChange);
        inputs[component.key] = rendered;
        section.appendChild(rendered.el);
      });

      if (block.status === 'locked') {
        var lockedNote = document.createElement('p');
        lockedNote.className = 'bioclash-locked-note';
        lockedNote.textContent = '🔒 Locked — this answer is final for this attempt.';
        section.appendChild(lockedNote);
      } else if (block.locksAfterSubmit) {
        var lockBtn = document.createElement('button');
        lockBtn.type = 'button';
        lockBtn.className = 'papers-nav-btn bioclash-lock-btn';
        lockBtn.textContent = 'Lock & Continue';
        lockBtn.addEventListener('click', function () {
          var warn = block.lockWarning || 'Once you continue, you cannot change this answer.';
          state.lockFlowActive = true;
          if (!window.confirm(warn + '\n\nAre you sure you want to lock this in?')) {
            state.lockFlowActive = false;
            return;
          }
          lockBtn.disabled = true;
          var answers = collectAnswers(block, inputs);
          apiPost('/api/bioclash-lock-block', {
            paperId: PAPER_ID,
            blockId: block.id,
            componentAnswers: answers,
            fullscreenExits: state.fullscreenExits,
            visibilityLosses: state.visibilityLosses,
            sessionToken: state.sessionToken
          }).then(function (result) {
            if (result.body && result.body.reason === 'superseded') {
              state.lockFlowActive = false;
              handleSessionSuperseded();
              return;
            }
            if (!result.ok) {
              state.lockFlowActive = false;
              window.alert(result.body.error || 'Could not lock this block.');
              lockBtn.disabled = false;
              return;
            }
            block.status = 'locked';

            block.answer = answers;

            var firstNewBlockId = null;
            (result.body.revealedBlocks || []).forEach(function (revealed) {
              var already = state.blocks.some(function (b) { return b.id === revealed.id; });
              if (already) return;
              state.blocks.push(revealed);
              if (firstNewBlockId === null) firstNewBlockId = revealed.id;
            });

            if (firstNewBlockId !== null) {
              var newIdx = findPageIndexForBlockId(pageList(), firstNewBlockId);
              if (newIdx >= 0) state.currentPartIndex = newIdx;
            }
            renderBlocks();

            if (block.id !== 'q10-4a') {
              window.scrollTo({ top: 0, behavior: 'auto' });
              enterFullscreen();
            }
            state.lockFlowActive = false;
          });
        });
        section.appendChild(lockBtn);
      }

      bodyEl.appendChild(section);
    });

    bodyEl.appendChild(renderPartNav(list, pageIdx));
  }

  function renderReport(data) {
    showScreen(reportScreen);
    clearInterval(timerInterval);
    clearInterval(heartbeatInterval);
    if (!reportScreen) return;
    reportScreen.innerHTML =
      '<h2>Submitted</h2>' +
      '<p>Auto-gradable score (partial — most of this paper is graded offline): ' +
      (data.autoScoreCorrect != null ? data.autoScoreCorrect + ' / ' + data.autoScoreTotal : '—') + '</p>' +
      '<p>' + (data.note || 'Your full result will follow separately once grading is complete.') + '</p>' +
      '<div class="bioclash-recording-upload">' +
      '<p><strong>Your attempt is not verified yet.</strong> Upload your full front-camera ' +
      'recording of this attempt to the folder below as soon as possible. Results are only ' +
      'verified once this recording has been reviewed — an unverified attempt may still be ' +
      'scored, but whether it is announced or considered at all is entirely at BiOGuide\'s ' +
      'discretion.</p>' +
      '<p><a href="' + RECORDING_UPLOAD_URL + '" target="_blank" rel="noopener" class="papers-nav-btn">Upload your recording</a></p>' +
      '</div>';
  }

  function doSubmit(silent) {
    if (!silent && !state.reachedFinalPageLocally) {
      window.alert('You must reach the final page of the paper at least once before you can submit.');
      return;
    }
    if (!silent && !window.confirm('Submit your attempt now? This cannot be undone.')) return;
    apiPost('/api/bioclash-submit-attempt', { paperId: PAPER_ID, force: !!silent }).then(function (result) {
      if (!result.ok) {
        if (!silent) window.alert(result.body.error || 'Could not submit.');
        return;
      }
      renderReport(result.body);
    });
  }

  if (submitBtn) submitBtn.addEventListener('click', function () { doSubmit(false); });

  function allDirectivesConfirmed() {
    return !!honorCodeCheckbox && honorCodeCheckbox.checked &&
      directiveCheckboxes.every(function (cb) { return cb.checked; });
  }
  function updateStartButtonGate() {
    if (startBtn) startBtn.disabled = !allDirectivesConfirmed();
  }
  if (honorCodeCheckbox) honorCodeCheckbox.addEventListener('change', updateStartButtonGate);
  directiveCheckboxes.forEach(function (cb) { cb.addEventListener('change', updateStartButtonGate); });

  if (startBtn) {
    startBtn.addEventListener('click', function () {
      if (!allDirectivesConfirmed()) {
        if (startStatus) startStatus.textContent = 'Please confirm every item above before starting.';
        return;
      }
      withSession(function () {
        startBtn.disabled = true;
        enterFullscreen();
        apiPost('/api/bioclash-start-attempt', { paperId: PAPER_ID }).then(function (result) {
          startBtn.disabled = false;
          if (!result.ok) {
            if (startStatus) startStatus.textContent = result.body.error || 'Could not start.';
            return;
          }
          renderState(result.body);
        });
      });
    });
  }

  window.addEventListener('beforeunload', function () {
    if (state.sessionToken && state.accessToken && liveScreen && !liveScreen.hidden) {
      fetch('/api/bioclash-log-tab-close', {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + state.accessToken },
        body: JSON.stringify({ paperId: PAPER_ID, sessionToken: state.sessionToken })
      });
    }
  });

  withSession(function () {
    apiPost('/api/bioclash-attempt-state', { paperId: PAPER_ID }).then(function (result) {
      if (!result.ok) {
        if (startStatus) startStatus.textContent = result.body.error || 'Could not load.';
        return;
      }
      if (result.body.status && result.body.status !== 'not_started') {
        renderState(result.body);
      }
    });
  });
})();
