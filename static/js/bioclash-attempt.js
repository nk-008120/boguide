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
  // default) the visitor has stored — this only touches the live DOM class,
  // never localStorage, so leaving this page and loading any other page
  // still respects their real stored preference on next load.
  document.documentElement.classList.remove('light', 'favourite');
  document.documentElement.classList.add('dark');

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

    state.blocks.forEach(function (block) {
      var section = document.createElement('section');
      section.className = 'bioclash-block bioclash-block-' + block.status;
      var heading = document.createElement('h3');
      heading.textContent = block.partName || '';
      section.appendChild(heading);

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
