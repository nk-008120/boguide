(function () {
  'use strict';

  var root = document.getElementById('papers-contribute-review-root');
  if (!root) return;

  var statusEl = document.getElementById('papers-contribute-review-status');
  var listEl = document.getElementById('papers-contribute-review-list');

  function escapeHTML(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatDate(iso) {
    try { return new Date(iso).toLocaleString(); } catch (e) { return iso; }
  }

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
    statusEl.textContent = "This isn't configured on this environment yet.";
    return;
  }

  var client = window.PapersAuth.getClient();

  var TABLES = [
    { name: 'paper_contributions', label: 'Paper Submissions' },
    { name: 'content_corrections', label: 'Content Corrections' },
    { name: 'community_solutions', label: 'Community Solutions/Notes' }
  ];

  window.PapersAuth.getSession().then(function (session) {
    if (!session) {
      statusEl.innerHTML = 'Log in to view this. <a href="/account/?next=' + encodeURIComponent('/papers/contribute/review/') + '">Log in</a>';
      return;
    }
    window.PapersAuth.getProfile(session.user.id).then(function (profile) {
      if (!profile || !profile.is_staff) {
        statusEl.textContent = "This page is staff-only.";
        return;
      }
      loadQueue(session.user.id);
    });
  });

  function loadQueue(reviewerId) {
    Promise.all(TABLES.map(function (t) {
      return client.from(t.name).select('*').eq('status', 'pending').order('created_at', { ascending: true });
    })).then(function (results) {
      statusEl.hidden = true;
      listEl.hidden = false;

      var anyRows = results.some(function (r) { return (r.data || []).length > 0; });
      if (!anyRows) {
        listEl.innerHTML = '<p class="discussions-status">Nothing pending — the queue is empty.</p>';
        return;
      }

      listEl.innerHTML = TABLES.map(function (t, i) {
        var rows = (results[i] && results[i].data) || [];
        if (!rows.length) return '';
        return '<h2>' + escapeHTML(t.label) + ' (' + rows.length + ')</h2>' +
          rows.map(function (row) { return renderRow(t.name, row); }).join('');
      }).join('');

      listEl.querySelectorAll('[data-decide]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          decide(btn.getAttribute('data-table'), btn.getAttribute('data-id'), btn.getAttribute('data-decide'), reviewerId, btn);
        });
      });
    }).catch(function () {
      statusEl.hidden = false;
      statusEl.textContent = 'Could not load the queue right now — try refreshing.';
      listEl.hidden = true;
    });
  }

  function renderFields(table, row) {
    if (table === 'paper_contributions') {
      var files = '<a href="#" data-signed-file="' + escapeHTML(row.exam_file_path) + '">Exam PDF</a>';
      if (row.answer_file_path) files += ' · <a href="#" data-signed-file="' + escapeHTML(row.answer_file_path) + '">Answer key PDF</a>';
      return (
        '<p><strong>' + escapeHTML(row.olympiad) + ' ' + escapeHTML(row.year) + '</strong> — ' + escapeHTML(row.round_label) + '</p>' +
        (row.source_url ? '<p>Source: <a href="' + escapeHTML(row.source_url) + '" target="_blank" rel="noopener">' + escapeHTML(row.source_url) + '</a></p>' : '') +
        '<p><strong>License note:</strong> ' + escapeHTML(row.license_note) + '</p>' +
        '<p>' + files + '</p>'
      );
    }
    if (table === 'content_corrections') {
      return (
        '<p><strong>' + escapeHTML(row.olympiad) + ' ' + escapeHTML(row.year) + '/' + escapeHTML(row.round_id) + '/' + escapeHTML(row.problem_id) + '</strong> — field: ' + escapeHTML(row.field) + '</p>' +
        (row.current_value ? '<p><strong>Current:</strong> ' + escapeHTML(row.current_value) + '</p>' : '') +
        '<p><strong>Proposed:</strong> ' + escapeHTML(row.proposed_value) + '</p>' +
        '<p><strong>Reason:</strong> ' + escapeHTML(row.reason) + '</p>'
      );
    }
    return (
      '<p><strong>' + escapeHTML(row.olympiad) + ' ' + escapeHTML(row.year) + '/' + escapeHTML(row.round_id) + '/' + escapeHTML(row.problem_id) + '</strong></p>' +
      '<p>' + escapeHTML(row.body) + '</p>'
    );
  }

  function renderRow(table, row) {
    return (
      '<div class="discussions-thread-card papers-contribute-review-row" data-row-id="' + row.id + '">' +
      renderFields(table, row) +
      '<p class="biolab-feedback-hint">Submitted ' + formatDate(row.created_at) + '</p>' +
      '<textarea class="papers-contribute-review-notes" placeholder="Staff notes (optional)" rows="2" data-notes-for="' + row.id + '"></textarea>' +
      '<div class="papers-contribute-review-actions">' +
      '<button type="button" class="papers-nav-btn papers-nav-next" data-decide="approved" data-table="' + table + '" data-id="' + row.id + '">Approve</button>' +
      '<button type="button" class="papers-nav-btn" data-decide="rejected" data-table="' + table + '" data-id="' + row.id + '">Reject</button>' +
      '</div>' +
      '<div class="discussions-msg" data-msg-for="' + row.id + '"></div>' +
      '</div>'
    );
  }

  function decide(table, id, decision, reviewerId, btn) {
    var rowEl = listEl.querySelector('[data-row-id="' + id + '"]');
    var notesEl = rowEl.querySelector('[data-notes-for="' + id + '"]');
    var msgEl = rowEl.querySelector('[data-msg-for="' + id + '"]');
    rowEl.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
    msgEl.textContent = 'Saving…';

    client.from(table).update({
      status: decision,
      staff_notes: notesEl.value.trim() || null,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString()
    }).eq('id', id).then(function (result) {
      if (result.error) {
        rowEl.querySelectorAll('button').forEach(function (b) { b.disabled = false; });
        msgEl.textContent = result.error.message;
        return;
      }
      rowEl.style.opacity = '0.5';
      msgEl.textContent = 'Marked ' + decision + '.';
    });
  }

  listEl && listEl.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-signed-file]');
    if (!link) return;
    e.preventDefault();
    var path = link.getAttribute('data-signed-file');
    client.storage.from('paper-contributions').createSignedUrl(path, 3600).then(function (result) {
      if (result.error || !result.data) return;
      window.open(result.data.signedUrl, '_blank', 'noopener');
    });
  });
})();
