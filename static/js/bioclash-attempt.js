/*
 * BiOClash timed-attempt controller. Modeled on static/js/papers-attempt.js
 * (wall-clock timer off a server timestamp, DOM-swap single-page nav,
 * fullscreen tracking, beforeunload autosave) but diverges where it must:
 * question content — including which blocks even exist yet — is fetched
 * live from the server on every boot, never embedded in the page's initial
 * HTML, since nothing about a not-yet-earned reveal or a correct answer
 * may ever ship to the client ahead of time. See
 * context/ (implementation plan) for the full design rationale.
 */
(function () {
  'use strict';

  var root = document.getElementById('bioclash-attempt-root');
  if (!root) return;

  var PAPER_ID = root.getAttribute('data-paper-id');

  // Force the BiOClash dark/glowing case-file look for the duration of an
  // attempt, overriding whatever theme (including "favourite," the sitewide
  // default) the visitor has stored. This only touches the live DOM class,
  // never localStorage, so leaving this page and loading any other page
  // still respects their real stored preference on next load.
  //
  // A single one-time class swap isn't enough: assets/js/core/theme.js (a
  // project override of Hextra's own theme script) unconditionally re-reads
  // localStorage and re-applies the stored theme on every page load, as a
  // deferred script — and because that script tag loads near the end of
  // <body> while this one is embedded earlier, inside the page content, it
  // runs AFTER this file and clobbers the forced "dark" class right back to
  // "favourite" a moment later. Rather than depend on winning a script-order
  // race, a MutationObserver reasserts "dark" for as long as this page is
  // mounted, regardless of what else touches the class list or when.
  function forceDark() {
    var cl = document.documentElement.classList;
    if (cl.contains('light') || cl.contains('favourite') || !cl.contains('dark')) {
      cl.remove('light', 'favourite');
      cl.add('dark');
    }
  }

  // The navbar's theme-toggle button is sitewide chrome (rendered by the
  // theme's own layout, not something this page's content controls) and
  // stays clickable here by default. If a visitor used it while on this
  // page, assets/js/core/theme.js's click handler would call
  // localStorage.setItem('color-theme', ...) — the MutationObserver above
  // would still force this page back to dark, but the visitor's SITEWIDE
  // preference would have been silently overwritten for every other page
  // too. Marking <body> lets a scoped CSS rule (section 24 of custom.css)
  // hide the control outright for the duration of an attempt, so there is
  // no interactive path to a theme write at all here — "favourite" (or
  // whatever the visitor actually has stored) stays exactly what it was
  // the moment they leave this page.
  document.body.classList.add('bioclash-attempt-active');

  // Belt-and-suspenders on top of the CSS hide above: a capturing-phase
  // listener intercepts any click reaching the toggle or its menu options
  // — including one fired programmatically (bypassing the fact that a
  // hidden element has no real hit-testable area for an actual mouse
  // click) — and stops it before core/theme.js's own handler ever runs.
  // localStorage snapshotted once at load and force-restored afterward
  // either way, so even a change that somehow still landed doesn't stick.
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
  var timerEl = document.getElementById('bioclash-attempt-timer');
  var bodyEl = document.getElementById('bioclash-attempt-body');
  var submitBtn = document.getElementById('bioclash-attempt-submit-btn');
  var watermarkEl = document.getElementById('bioclash-attempt-watermark');

  var state = {
    attemptId: null,
    endAt: null,
    blocks: [],           // in the order the server has revealed them
    fullscreenExits: 0,
    visibilityLosses: 0,
    currentPartIndex: 0,       // which part is on screen — see renderBlocks()
    currentPartIndexSet: false, // true once boot/resume has picked a starting part
    sessionToken: null,        // anti-cheat: single-active-session — see startHeartbeat()
    superseded: false          // true once another tab/device has taken over
  };
  var timerInterval = null;
  var heartbeatInterval = null;
  var draftTimers = {};   // blockId -> debounce timeout

  function authHeaders(session) {
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session.access_token };
  }

  function apiPost(path, session, body) {
    return fetch(path, { method: 'POST', headers: authHeaders(session), body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json().then(function (json) { return { ok: r.ok, status: r.status, body: json }; }); });
  }

  function apiGet(path, session) {
    return fetch(path, { headers: { 'Authorization': 'Bearer ' + session.access_token } })
      .then(function (r) { return r.json().then(function (json) { return { ok: r.ok, status: r.status, body: json }; }); });
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

  // Anti-cheat: single-active-session enforcement. state.sessionToken is
  // (re)issued by the server on every start-attempt/attempt-state call —
  // i.e. every fresh page load — and this polls to check it's still the
  // current one. If a second tab/device opens the same attempt, ITS boot
  // call overwrites the token server-side, and this client's next
  // heartbeat comes back 409 — at which point the UI locks itself. The
  // real enforcement is server-side (save-draft/lock-block check the same
  // token before writing), this is just what makes it visible promptly
  // instead of the student only finding out when an answer silently fails
  // to save. See supabase/migrations/010_bioclash_anticheat.sql.
  function startHeartbeat(session) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(function () {
      if (!state.sessionToken) return;
      apiPost('/api/bioclash-heartbeat', session, { paperId: PAPER_ID, sessionToken: state.sessionToken }).then(function (result) {
        if (result.body && result.body.reason === 'superseded') handleSessionSuperseded();
      });
    }, 20000);
  }

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

  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement && liveScreen && !liveScreen.hidden) {
      state.fullscreenExits += 1;
    }
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && liveScreen && !liveScreen.hidden) {
      state.visibilityLosses += 1;
    }
  });

  // Anti-cheat, deterrent tier (see the matching CSS comment on
  // .bioclash-block): block copy/cut/right-click/drag-select on question
  // content specifically, while leaving every input/textarea completely
  // normal — a student must still be able to select, cut, and paste their
  // own answer text freely while editing it.
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
      fn(session);
    });
  }

  function renderWatermark(code) {
    if (!watermarkEl || !code) return;
    watermarkEl.textContent = new Array(40).fill(code).join('   ');
  }

  function renderState(data, session) {
    state.attemptId = data.attemptId;
    state.endAt = data.endAt;
    state.blocks = data.blocks || [];
    state.fullscreenExits = data.fullscreenExits || 0;
    state.visibilityLosses = data.visibilityLosses || 0;
    if (data.sessionToken) state.sessionToken = data.sessionToken;
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
    startHeartbeat(session);
    renderBlocks(session);
  }

  function componentValue(block, key) {
    return block.answer && block.answer[key];
  }

  // table: { headers: [...], rows: [[...], ...] } — reference material shown
  // as plain read-only HTML, used for both block-level tables (shared
  // context for several questions, e.g. Q9.ii's scenario/lane tables) and
  // a component's own table (e.g. Q12's primer-sequence table).
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
    // Once a block is locked, its answer is final — the inputs must both
    // show that answer AND refuse further interaction. Previously locked
    // inputs stayed enabled with nothing checked (componentValue() only
    // ever read from block.answer, which was never populated locally after
    // a lock — see the lock button handler below), so a "locked" question
    // looked blank and toggleable even though clicking it did nothing.
    // Confusing, not actually insecure. Fixed by (a) the lock handler now
    // storing the submitted answers onto the local block object, and (b)
    // disabling every input here whenever the block is locked.
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
        // The option's own key is shown (e.g. "I) ...", "A) ...") so a
        // follow-up question that refers back to a specific option by key
        // (e.g. Part A's "the flaw that rules out Workflow I") is
        // answerable at all — per-user shuffling means display position
        // alone can't identify which option is which.
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
      // free_text, fill_blank
      input = document.createElement('textarea');
      input.className = 'bioclash-freetext-input';
      input.rows = component.type === 'fill_blank' ? 1 : 3;
      if (current !== undefined) input.value = current;
      input.disabled = locked;
    }
    wrap.appendChild(input);
    return { el: wrap, input: input };
  }

  // free_text_for_others: one textbox per option NOT currently selected in
  // the sibling component named by `refersTo` — recomputed live whenever
  // that selection changes. Deliberately never a fixed set of options: a
  // fixed subset (e.g. hardcoding 4 of 5 workflow letters in the YAML, as
  // an earlier version of this did) structurally reveals the answer, since
  // the one option never asked about is trivially the correct one. `ref`
  // must already be rendered — renderBlocks() guarantees this by rendering
  // every other component first and free_text_for_others components last.
  function renderFreeTextForOthers(block, component, inputs, onChange) {
    var ref = inputs[component.refersTo];
    var wrap = document.createElement('div');
    wrap.className = 'bioclash-component bioclash-free-text-for-others';
    var saved = componentValue(block, component.key) || {}; // {optionKey: text}, persists across rebuilds
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

  function scheduleDraftSave(block, inputs, session) {
    clearTimeout(draftTimers[block.id]);
    draftTimers[block.id] = setTimeout(function () {
      var answers = collectAnswers(block, inputs);
      apiPost('/api/bioclash-save-draft', session, {
        paperId: PAPER_ID,
        blockId: block.id,
        componentAnswers: answers,
        fullscreenExits: state.fullscreenExits,
        visibilityLosses: state.visibilityLosses,
        sessionToken: state.sessionToken
      }).then(function (result) {
        // Defense in depth: the heartbeat is the primary signal, but if a
        // save happens to land in the gap before the next heartbeat fires,
        // catch the same 409 here too.
        if (result.body && result.body.reason === 'superseded') handleSessionSuperseded();
      });
    }, 800);
  }

  // A "page" is the pagination unit — usually a whole part, but a part
  // made ENTIRELY of sequential non-recoverable locks (Part A; the Data
  // Analysis section) instead gets one page PER BLOCK. Locking one block
  // in such a part used to just append the newly-revealed block further
  // down the SAME page, below the now-locked, greyed-out one the student
  // had just finished with — nothing visibly changed except more content
  // appearing off-screen, which read as "I locked it and nothing
  // happened." A reveal_content block never gets a page of its own: it has
  // no lock button and nothing to interact with, so it's shown as leading
  // context on whichever real block's page follows it instead (this is
  // how "Timeline Confirmed" + the regulatory-circuit summary become part
  // of the Data Analysis Question 2 page rather than an empty stop of
  // their own).
  //
  // Recomputed on every render rather than cached, since state.blocks
  // grows as locks fire; state.blocks is always in paper document order
  // (the server only ever appends newly-revealed blocks in that order).
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

  // A page is sealed against Prev navigation once you've moved past it if
  // EVERY block on it requires a non-recoverable lock — true for every
  // per-block chain page (Part A; each Data Analysis step) and false for
  // an ordinary part-page like Part E, where Q10.4A being non-recoverable
  // doesn't mean the rest of Part E should stop being freely browsable.
  // Q10.4A's own answer is protected at the block level regardless (a
  // locked block renders read-only — see renderComponent()).
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

  function renderPartNav(list, pageIdx, session) {
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
      renderBlocks(session);
    });

    var label = document.createElement('span');
    label.className = 'bioclash-part-nav-label';
    // The last page in `list` isn't necessarily the last page of the whole
    // paper — it's just the last one earned SO FAR. If that page's own
    // block is still an active non-recoverable lock, locking it will grow
    // `list` further (e.g. "Page 6 of 6" while sitting on the Data
    // Analysis section's final question, right before it reveals Part
    // B–F and the true count becomes 11) — showing a bare "6 of 6" reads
    // as "this is the last page," which is exactly the wrong moment to
    // imply that. The "+" marks the total as provisional whenever that's
    // the case, at every step of a reveal chain, not just this one.
    var lastPage = list[list.length - 1];
    var totalProvisional = lastPage.blocks.some(function (b) { return b.locksAfterSubmit && b.status === 'active'; });
    label.textContent = 'Page ' + (pageIdx + 1) + ' of ' + list.length + (totalProvisional ? '+' : '') + ': ' + (list[pageIdx].name || '');

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'papers-nav-btn bioclash-part-nav-btn';
    nextBtn.textContent = 'Next →';
    var nextTarget = pageIdx + 1;
    // No special-case logic needed here: the next page simply doesn't
    // exist yet if it hasn't been earned (server never sends its block),
    // so this is naturally disabled until it has been.
    nextBtn.disabled = nextTarget >= list.length;
    nextBtn.addEventListener('click', function () {
      state.currentPartIndex = nextTarget;
      renderBlocks(session);
    });

    nav.appendChild(prevBtn);
    nav.appendChild(label);
    nav.appendChild(nextBtn);
    return nav;
  }

  function renderBlocks(session) {
    if (!bodyEl) return;
    bodyEl.innerHTML = '';

    var list = pageList();
    if (!list.length) return;
    if (!state.currentPartIndexSet) {
      // First render this page load (fresh start, or a resume after
      // refresh): land on the furthest page already reached, not back at
      // Part A — a refresh shouldn't feel like starting over. Explicit
      // Prev/Next clicks and the auto-advance-on-lock below both set this
      // flag too, so this branch only ever fires once per page load.
      state.currentPartIndex = list.length - 1;
      state.currentPartIndexSet = true;
    }
    if (state.currentPartIndex >= list.length) state.currentPartIndex = list.length - 1;
    if (state.currentPartIndex < 0) state.currentPartIndex = 0;
    var pageIdx = state.currentPartIndex;
    var currentPage = list[pageIdx];

    bodyEl.appendChild(renderPartNav(list, pageIdx, session));

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
      // Pass 1: everything except free_text_for_others, so any component it
      // refers to (via refersTo) is already rendered by the time pass 2 runs.
      (block.components || []).forEach(function (component) {
        if (component.type === 'free_text_for_others') { deferred.push(component); return; }
        var rendered = renderComponent(block, component);
        inputs[component.key] = rendered;
        section.appendChild(rendered.el);
        if (block.status === 'active' && !block.locksAfterSubmit) {
          rendered.el.addEventListener('input', function () { scheduleDraftSave(block, inputs, session); });
          rendered.el.addEventListener('change', function () { scheduleDraftSave(block, inputs, session); });
        }
      });
      // Pass 2: free_text_for_others, now that its referenced sibling exists.
      deferred.forEach(function (component) {
        var onChange = (block.status === 'active' && !block.locksAfterSubmit)
          ? function () { scheduleDraftSave(block, inputs, session); }
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
          if (!window.confirm(warn + '\n\nAre you sure you want to lock this in?')) return;
          lockBtn.disabled = true;
          var answers = collectAnswers(block, inputs);
          apiPost('/api/bioclash-lock-block', session, {
            paperId: PAPER_ID,
            blockId: block.id,
            componentAnswers: answers,
            fullscreenExits: state.fullscreenExits,
            visibilityLosses: state.visibilityLosses,
            sessionToken: state.sessionToken
          }).then(function (result) {
            if (result.body && result.body.reason === 'superseded') {
              handleSessionSuperseded();
              return;
            }
            if (!result.ok) {
              window.alert(result.body.error || 'Could not lock this block.');
              lockBtn.disabled = false;
              return;
            }
            block.status = 'locked';
            // Persist what was actually submitted onto the local block
            // object — componentValue()/renderComponent() read from
            // block.answer, and locksAfterSubmit blocks never go through
            // scheduleDraftSave (which would otherwise have kept it
            // updated), so without this the just-locked answer would
            // render as blank on the very next renderBlocks() call below.
            block.answer = answers;
            // Track the FIRST newly-added block (in the server's document
            // order) — a lock can reveal many blocks at once (e.g. the
            // Data Analysis section's final lock reveals the whole of
            // Part B–F together), and jumping to whichever one happened
            // to be pushed last would land on Part F instead of Part B.
            var firstNewBlockId = null;
            (result.body.revealedBlocks || []).forEach(function (revealed) {
              // Defensive dedup: never add a block id that's already
              // present, even though the real fix is server-side
              // (initialBlocks() no longer pre-creates reveal-gated blocks).
              var already = state.blocks.some(function (b) { return b.id === revealed.id; });
              if (already) return;
              state.blocks.push(revealed);
              if (firstNewBlockId === null) firstNewBlockId = revealed.id;
            });
            // "Lock & Continue" means continue: jump straight to wherever
            // this lock's first newly-revealed block landed, rather than
            // leaving the student stranded on a now-fully-locked page with
            // nothing left to do but hunt for a Next button. A no-op when
            // that block shares the current page (e.g. q10-4a revealing
            // q10-4-rest onto the same Part E page).
            if (firstNewBlockId !== null) {
              var newIdx = findPageIndexForBlockId(pageList(), firstNewBlockId);
              if (newIdx >= 0) state.currentPartIndex = newIdx;
            }
            renderBlocks(session);
          });
        });
        section.appendChild(lockBtn);
      }

      bodyEl.appendChild(section);
    });

    bodyEl.appendChild(renderPartNav(list, pageIdx, session));
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
      '<p>' + (data.note || 'Your full result will follow separately once grading is complete.') + '</p>';
  }

  function doSubmit(silent) {
    withSession(function (session) {
      if (!silent && !window.confirm('Submit your attempt now? This cannot be undone.')) return;
      apiPost('/api/bioclash-submit-attempt', session, { paperId: PAPER_ID }).then(function (result) {
        if (!result.ok) {
          if (!silent) window.alert(result.body.error || 'Could not submit.');
          return;
        }
        renderReport(result.body);
      });
    });
  }

  if (submitBtn) submitBtn.addEventListener('click', function () { doSubmit(false); });

  // Honor-code affirmation: the Start button stays disabled until this is
  // checked (HTML also ships it `disabled` by default, so a visitor who
  // never sees this script run still can't start blind). The click
  // handler re-checks it directly too, in case the disabled attribute was
  // ever removed out from under it (e.g. via devtools) — this is a policy
  // gate, not a security boundary, so it doesn't need to be bulletproof,
  // just not trivially skippable by accident.
  if (honorCodeCheckbox && startBtn) {
    honorCodeCheckbox.addEventListener('change', function () {
      startBtn.disabled = !honorCodeCheckbox.checked;
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', function () {
      if (honorCodeCheckbox && !honorCodeCheckbox.checked) {
        if (startStatus) startStatus.textContent = 'Please confirm the affirmation above before starting.';
        return;
      }
      withSession(function (session) {
        startBtn.disabled = true;
        enterFullscreen();
        apiPost('/api/bioclash-start-attempt', session, { paperId: PAPER_ID }).then(function (result) {
          startBtn.disabled = false;
          if (!result.ok) {
            if (startStatus) startStatus.textContent = result.body.error || 'Could not start.';
            return;
          }
          renderState(result.body, session);
        });
      });
    });
  }

  window.addEventListener('beforeunload', function () {
    // Best-effort: the debounced draft save already covers normal editing;
    // this just flushes anti-cheat counters on the way out.
  });

  // Boot: check for a resumable attempt before showing the Start screen.
  withSession(function (session) {
    apiGet('/api/bioclash-attempt-state?paperId=' + encodeURIComponent(PAPER_ID), session).then(function (result) {
      if (!result.ok) {
        if (startStatus) startStatus.textContent = result.body.error || 'Could not load.';
        return;
      }
      if (result.body.status && result.body.status !== 'not_started') {
        renderState(result.body, session);
      }
      // else: leave the Start screen showing, nothing to resume yet.
    });
  });
})();
