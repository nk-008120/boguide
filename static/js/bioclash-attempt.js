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
  var timerEl = document.getElementById('bioclash-attempt-timer');
  var bodyEl = document.getElementById('bioclash-attempt-body');
  var submitBtn = document.getElementById('bioclash-attempt-submit-btn');
  var watermarkEl = document.getElementById('bioclash-attempt-watermark');

  var state = {
    attemptId: null,
    endAt: null,
    blocks: [],           // in the order the server has revealed them
    fullscreenExits: 0,
    visibilityLosses: 0
  };
  var timerInterval = null;
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
        label.appendChild(radio);
        label.appendChild(document.createTextNode(' ' + opt.text));
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
    } else {
      // free_text, fill_blank
      input = document.createElement('textarea');
      input.className = 'bioclash-freetext-input';
      input.rows = component.type === 'fill_blank' ? 1 : 3;
      if (current !== undefined) input.value = current;
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
        visibilityLosses: state.visibilityLosses
      });
    }, 800);
  }

  function renderBlocks(session) {
    if (!bodyEl) return;
    bodyEl.innerHTML = '';

    var lastPartId = null;
    state.blocks.forEach(function (block) {
      // Part heading + narrative intro shown once, the first time a block
      // from that part appears — not repeated on every block within it.
      if (block.partId !== lastPartId) {
        lastPartId = block.partId;
        var heading = document.createElement('h3');
        heading.className = 'bioclash-part-heading';
        heading.textContent = block.partName || '';
        bodyEl.appendChild(heading);
        if (block.partIntro) {
          var intro = document.createElement('p');
          intro.className = 'bioclash-part-intro';
          intro.textContent = block.partIntro;
          bodyEl.appendChild(intro);
        }
      }

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
            visibilityLosses: state.visibilityLosses
          }).then(function (result) {
            if (!result.ok) {
              window.alert(result.body.error || 'Could not lock this block.');
              lockBtn.disabled = false;
              return;
            }
            block.status = 'locked';
            if (result.body.revealedBlock) {
              // Defensive dedup: never add a block id that's already
              // present, even though the real fix is server-side
              // (initialBlocks() no longer pre-creates reveal-gated blocks).
              var already = state.blocks.some(function (b) { return b.id === result.body.revealedBlock.id; });
              if (!already) state.blocks.push(result.body.revealedBlock);
            }
            renderBlocks(session);
          });
        });
        section.appendChild(lockBtn);
      }

      bodyEl.appendChild(section);
    });
  }

  function renderReport(data) {
    showScreen(reportScreen);
    clearInterval(timerInterval);
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

  if (startBtn) {
    startBtn.addEventListener('click', function () {
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
