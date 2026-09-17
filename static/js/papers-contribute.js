(function () {
  'use strict';

  var root = document.getElementById('papers-contribute-root');
  if (!root) return;

  var MAX_FILE_MB = 10;

  var statusEl = document.getElementById('papers-contribute-status');
  var tabs = root.querySelectorAll('.papers-contribute-tab');
  var panels = root.querySelectorAll('.papers-contribute-panel');
  var forms = [
    document.getElementById('paper-contribution-form'),
    document.getElementById('content-correction-form'),
    document.getElementById('community-solution-form')
  ];

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      var name = tab.getAttribute('data-tab');
      panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== name; });
    });
  });

  function nextURLFor(path) {
    return '/account/?next=' + encodeURIComponent(path);
  }

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
    statusEl.textContent = "Contributions aren't configured on this environment yet.";
    return;
  }

  var client = window.PapersAuth.getClient();

  function isLikelyPDF(file) {
    var nameOk = /\.pdf$/i.test(file.name);
    var typeOk = !file.type || file.type === 'application/pdf';
    return nameOk && typeOk;
  }

  function setMsg(el, text, isError) {
    el.textContent = text;
    el.classList.toggle('discussions-msg-error', !!isError);
  }

  function friendlyInsertError(error) {
    if (error && /row-level security/i.test(error.message || '')) {
      return "Submission failed -- you may already have 5 pending submissions of this type awaiting review. Wait for one to be reviewed before submitting more.";
    }
    return (error && error.message) || 'Submission failed.';
  }

  window.PapersAuth.getSession().then(function (session) {
    if (!session) {
      statusEl.innerHTML = 'Log in to contribute. <a href="' + nextURLFor('/papers/contribute/') + '">Log in</a>';
      return;
    }
    statusEl.hidden = true;
    forms.forEach(function (f) { if (f) f.hidden = false; });

    var userId = session.user.id;

    var paperForm = document.getElementById('paper-contribution-form');
    if (paperForm) {
      paperForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = document.getElementById('paper-contribution-msg');

        var olympiad = paperForm.olympiad.value.trim();
        var year = paperForm.year.value.trim();
        var roundLabel = paperForm.round_label.value.trim();
        var sourceUrl = paperForm.source_url.value.trim();
        var licenseNote = paperForm.license_note.value.trim();
        var examInput = document.getElementById('pc-exam-file');
        var answerInput = document.getElementById('pc-answer-file');
        var examFile = examInput.files[0];
        var answerFile = answerInput.files[0];

        if (!olympiad || !year || !roundLabel || !licenseNote || !examFile) return;
        if (!isLikelyPDF(examFile)) { setMsg(msg, 'The exam file must be a PDF.', true); return; }
        if (examFile.size > MAX_FILE_MB * 1024 * 1024) { setMsg(msg, 'Exam PDF is over ' + MAX_FILE_MB + 'MB.', true); return; }
        if (answerFile) {
          if (!isLikelyPDF(answerFile)) { setMsg(msg, 'The answer key file must be a PDF.', true); return; }
          if (answerFile.size > MAX_FILE_MB * 1024 * 1024) { setMsg(msg, 'Answer key PDF is over ' + MAX_FILE_MB + 'MB.', true); return; }
        }

        var submitBtn = paperForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        setMsg(msg, 'Uploading…', false);

        function uploadOne(file) {
          var filename = (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2))) + '.pdf';
          var path = userId + '/' + filename;
          return client.storage.from('paper-contributions').upload(path, file, { contentType: 'application/pdf' }).then(function (result) {
            if (result.error) throw result.error;
            return path;
          });
        }

        Promise.all([uploadOne(examFile), answerFile ? uploadOne(answerFile) : Promise.resolve(null)])
          .then(function (paths) {
            setMsg(msg, 'Submitting…', false);
            return client.from('paper_contributions').insert({
              olympiad: olympiad,
              year: year,
              round_label: roundLabel,
              source_url: sourceUrl || null,
              license_note: licenseNote,
              exam_file_path: paths[0],
              answer_file_path: paths[1]
            });
          })
          .then(function (result) {
            if (result.error) {
              submitBtn.disabled = false;
              setMsg(msg, friendlyInsertError(result.error), true);
              return;
            }
            if (window.PostHogEvents) window.PostHogEvents.trackContributionSubmitted('paper_contribution');
            paperForm.reset();
            submitBtn.disabled = false;
            setMsg(msg, 'Submitted -- thanks! Staff will review the license and, if it checks out, ingest it into the archive.', false);
          })
          .catch(function (err) {
            submitBtn.disabled = false;
            setMsg(msg, (err && err.message) || 'Upload failed.', true);
          });
      });
    }

    var correctionForm = document.getElementById('content-correction-form');
    if (correctionForm) {
      correctionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = document.getElementById('content-correction-msg');

        var row = {
          olympiad: correctionForm.olympiad.value.trim(),
          year: correctionForm.year.value.trim(),
          round_id: correctionForm.round_id.value.trim(),
          problem_id: correctionForm.problem_id.value.trim(),
          field: correctionForm.field.value,
          current_value: correctionForm.current_value.value.trim() || null,
          proposed_value: correctionForm.proposed_value.value.trim(),
          reason: correctionForm.reason.value.trim()
        };
        if (!row.olympiad || !row.year || !row.round_id || !row.problem_id || !row.field || !row.proposed_value || !row.reason) return;

        var submitBtn = correctionForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        setMsg(msg, 'Submitting…', false);

        client.from('content_corrections').insert(row).then(function (result) {
          if (result.error) {
            submitBtn.disabled = false;
            setMsg(msg, friendlyInsertError(result.error), true);
            return;
          }
          if (window.PostHogEvents) window.PostHogEvents.trackContributionSubmitted('content_correction');
          correctionForm.reset();
          submitBtn.disabled = false;
          setMsg(msg, 'Submitted -- thanks, staff will review it.', false);
        });
      });
    }

    var solutionForm = document.getElementById('community-solution-form');
    if (solutionForm) {
      solutionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = document.getElementById('community-solution-msg');

        var row = {
          olympiad: solutionForm.olympiad.value.trim(),
          year: solutionForm.year.value.trim(),
          round_id: solutionForm.round_id.value.trim(),
          problem_id: solutionForm.problem_id.value.trim(),
          body: solutionForm.body.value.trim()
        };
        if (!row.olympiad || !row.year || !row.round_id || !row.problem_id || !row.body) return;

        var submitBtn = solutionForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        setMsg(msg, 'Submitting…', false);

        client.from('community_solutions').insert(row).then(function (result) {
          if (result.error) {
            submitBtn.disabled = false;
            setMsg(msg, friendlyInsertError(result.error), true);
            return;
          }
          if (window.PostHogEvents) window.PostHogEvents.trackContributionSubmitted('community_solution');
          solutionForm.reset();
          submitBtn.disabled = false;
          setMsg(msg, 'Submitted -- thanks, staff will review it.', false);
        });
      });
    }
  });
})();
