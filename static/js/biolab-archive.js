/* biolab-archive.js -- BiOLab protocol archive: browse/search list + protocol detail.
   Depends on: papers-auth.js (PapersAuth). Read-only except the report control. */
(function () {
  'use strict';

  var root = document.getElementById('biolab-archive-root');
  if (!root) return;

  // UI-layer cap only -- nothing in the DB enforces a max image count per
  // submission (biolab_submission_images has no such constraint).
  var MAX_RESULT_IMAGES = 5;

  var CATEGORY_LABELS = {
    physiology: '🫀 Physiology',
    biochemistry: '⚗️ Biochemistry',
    'molecular-biology': '🧬 Molecular biology',
    microbiology: '🦠 Microbiology',
    ecology: '🌿 Ecology',
    genetics: '🧫 Genetics',
    anatomy: '🦴 Anatomy',
    other: '✨ Other'
  };

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  function getParam(name) {
    var re = new RegExp('[?&]' + name + '=([^&]+)');
    var m = re.exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function nextURLFor(path) {
    return '/account/?next=' + encodeURIComponent(path);
  }

  function categoryHTML(category) {
    if (!category || !CATEGORY_LABELS[category]) return '';
    return '<span class="papers-subject-tag biolab-archive-category-tag">' + CATEGORY_LABELS[category] + '</span>';
  }

  // is_official is the ONE trust signal here -- never render this as a subtle
  // color difference alone, always pair the icon+color with an explicit label.
  // Cards use a shorter label (card grid columns are too narrow for the full
  // phrase without overlapping the title); the detail page -- which has the
  // room, and is what actually establishes trust before someone follows a
  // protocol -- always gets the full, unambiguous phrase.
  function badgeHTML(isOfficial, compact) {
    if (isOfficial) {
      return '<span class="biolab-badge biolab-badge-official">✓ BiOGuide-Verified</span>';
    }
    var label = compact ? '○ Community' : '○ Community — Not Staff-Reviewed';
    return '<span class="biolab-badge biolab-badge-community">' + label + '</span>';
  }

  function attributionLine(p) {
    var parts = [];
    if (p.source_attribution) {
      parts.push('<span class="biolab-archive-attribution">Source: ' + escapeHTML(p.source_attribution) + '</span>');
    }
    if (p.author_user_id) {
      parts.push(
        '<span class="biolab-archive-author">' +
        window.PapersAuth.avatarHTML(p.author_display_name, p.author_avatar_url) +
        window.PapersAuth.flagHTML(p.author_country) +
        '<span>' + escapeHTML(p.author_display_name || 'A BiOGuide member') + '</span>' +
        '</span>'
      );
    } else {
      parts.push('<span class="biolab-archive-author">BiOGuide staff</span>');
    }
    return parts.join('<span class="discussions-meta-dot">·</span>');
  }

  var listView = document.getElementById('biolab-archive-list-view');
  var detailView = document.getElementById('biolab-archive-detail-view');
  var slug = getParam('protocol');

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
    var statusEl = slug
      ? document.getElementById('biolab-archive-detail-status')
      : document.getElementById('biolab-archive-list-status');
    if (slug) { listView.hidden = true; detailView.hidden = false; } else { detailView.hidden = true; }
    statusEl.textContent = "The protocol archive isn't configured on this environment yet.";
    return;
  }

  var client = window.PapersAuth.getClient();

  if (slug) {
    listView.hidden = true;
    detailView.hidden = false;
    renderDetail(slug);
  } else {
    detailView.hidden = true;
    renderList();
  }

  // ---------------------------------------------------------------- list --

  var allProtocols = [];

  function renderList() {
    var statusEl = document.getElementById('biolab-archive-list-status');
    var emptyEl = document.getElementById('biolab-archive-list-empty');
    var listEl = document.getElementById('biolab-archive-list');
    var searchEl = document.getElementById('biolab-archive-search');
    var categoryEl = document.getElementById('biolab-archive-category');

    client.from('biolab_public_protocols').select('*').limit(300).then(function (result) {
      if (result.error) {
        statusEl.textContent = 'Could not load the archive right now — try refreshing.';
        return;
      }
      allProtocols = result.data || [];
      statusEl.hidden = true;
      if (!allProtocols.length) {
        emptyEl.textContent = 'No protocols published yet.';
        emptyEl.hidden = false;
        return;
      }
      listEl.hidden = false;
      applyFilters();
    }).catch(function () {
      statusEl.textContent = 'Could not load the archive right now — try refreshing.';
    });

    var debounceTimer = null;
    searchEl.addEventListener('input', function () {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(applyFilters, 120);
    });
    categoryEl.addEventListener('change', applyFilters);

    function applyFilters() {
      var q = searchEl.value.trim().toLowerCase();
      var cat = categoryEl.value;
      var filtered = allProtocols.filter(function (p) {
        if (cat && p.category !== cat) return false;
        if (!q) return true;
        var haystack = [p.title, p.description, p.source_attribution, p.author_display_name]
          .filter(Boolean).join(' ').toLowerCase();
        return haystack.indexOf(q) !== -1;
      });

      if (!filtered.length) {
        listEl.hidden = true;
        emptyEl.hidden = false;
        return;
      }
      emptyEl.hidden = true;
      listEl.hidden = false;
      listEl.innerHTML = filtered.map(renderCard).join('');
    }
  }

  function renderCard(p) {
    var desc = p.description || (p.body ? p.body.slice(0, 160) : 'No description yet.');
    if (desc.length > 160) desc = desc.slice(0, 160) + '…';
    return (
      '<a class="biolab-archive-card" href="?protocol=' + encodeURIComponent(p.slug) + '">' +
      '<div class="biolab-archive-card-top">' +
        '<span class="biolab-archive-card-title">' + escapeHTML(p.title) + '</span>' +
        badgeHTML(p.is_official, true) +
      '</div>' +
      '<p class="biolab-archive-card-desc">' + escapeHTML(desc) + '</p>' +
      '<div class="biolab-archive-card-meta">' +
        categoryHTML(p.category) +
        (p.source_attribution ? '<span class="biolab-archive-card-attr">' + escapeHTML(p.source_attribution) + '</span>' : '') +
      '</div>' +
      '</a>'
    );
  }

  // -------------------------------------------------------------- detail --

  function renderDetail(protocolSlug) {
    var statusEl = document.getElementById('biolab-archive-detail-status');
    var articleEl = document.getElementById('biolab-archive-protocol');

    client.from('biolab_public_protocols').select('*').eq('slug', protocolSlug).single().then(function (result) {
      if (result.error || !result.data) {
        statusEl.textContent = "That protocol doesn't exist, or was removed.";
        return;
      }
      var p = result.data;
      statusEl.hidden = true;

      var bodyHTML = p.body
        ? '<div class="biolab-archive-body">' + escapeHTML(p.body) + '</div>'
        : '<p class="biolab-archive-body-empty">This protocol doesn\'t have full written instructions yet' + (p.description ? ' beyond the summary above.' : '.') + '</p>';

      articleEl.innerHTML =
        '<div class="biolab-archive-detail-head">' +
          '<h1 class="biolab-archive-title">' + escapeHTML(p.title) + '</h1>' +
          badgeHTML(p.is_official) +
        '</div>' +
        '<div class="biolab-archive-detail-meta">' +
          categoryHTML(p.category) +
          attributionLine(p) +
          '<span class="discussions-meta-dot">·</span>' +
          '<span>' + formatDate(p.created_at) + '</span>' +
        '</div>' +
        (p.is_official ? '' :
          '<div class="biolab-caution-box biolab-archive-caution">' +
            '<span class="biolab-caution-label">⚠️ Not staff-reviewed</span>' +
            '<p>This protocol was published immediately by its author with no BiOGuide staff review. Use your own judgment and follow your own institution\'s safety rules. If something looks wrong or unsafe, report it below.</p>' +
          '</div>'
        ) +
        (p.description ? '<p class="biolab-archive-description">' + escapeHTML(p.description) + '</p>' : '') +
        bodyHTML +
        '<div id="biolab-archive-report-protocol" class="biolab-archive-report-wrap"></div>' +
        '<div id="biolab-archive-attachments" class="biolab-archive-section"></div>' +
        '<div id="biolab-archive-reference" class="biolab-archive-section"></div>' +
        '<div id="biolab-archive-feedback" class="biolab-archive-section"></div>' +
        '<div id="biolab-archive-feedback-form" class="biolab-archive-section"></div>' +
        '<div id="biolab-archive-results" class="biolab-archive-section"></div>' +
        '<div id="biolab-archive-result-form" class="biolab-archive-section"></div>';

      articleEl.hidden = false;

      attachReportForm(document.getElementById('biolab-archive-report-protocol'), {
        table: 'biolab_protocol_reports',
        idField: 'protocol_id',
        idValue: p.id,
        buttonLabel: '🚩 Report this protocol',
        nextPath: '/biolab/archive/?protocol=' + encodeURIComponent(p.slug)
      });

      loadAttachments(p.id);
      loadReferenceResult(p.id);
      loadFeedback(p.id);
      loadResults(p.id);
      attachFeedbackForm(p.id);
      attachResultForm(p.id);
    }).catch(function () {
      statusEl.textContent = 'Could not load this protocol right now — try refreshing.';
    });
  }

  // Attachments are a submission-time-only, mostly-absent feature -- most
  // protocols won't have one, so absence renders nothing (no empty-state
  // clutter), matching loadReferenceResult's pattern just below. Visibility
  // rides entirely on RLS (biolab_protocol_attachments_select_public and
  // the matching storage policy, migration 021): a removed protocol's
  // detail page never reaches this call in the first place (renderDetail
  // bails out earlier once biolab_public_protocols excludes it), and the
  // storage policy independently has NO owner exception for this bucket
  // (unlike biolab-captures) -- verified live, see this session's report.
  function loadAttachments(protocolId) {
    var el = document.getElementById('biolab-archive-attachments');
    client.from('biolab_protocol_attachments').select('file_path, file_name').eq('protocol_id', protocolId).order('created_at').then(function (result) {
      var rows = (result && result.data) || [];
      if (!rows.length) return;
      var paths = rows.map(function (r) { return r.file_path; });
      client.storage.from('biolab-protocol-attachments').createSignedUrls(paths, 3600).then(function (signedResult) {
        var urlByPath = {};
        ((signedResult && signedResult.data) || []).forEach(function (row) {
          if (row && row.path && row.signedUrl && !row.error) urlByPath[row.path] = row.signedUrl;
        });
        var items = rows.map(function (r) {
          var url = urlByPath[r.file_path];
          if (!url) return '';
          return (
            '<a class="biolab-archive-attachment-link" href="' + escapeHTML(url) + '" target="_blank" rel="noopener" download="' + escapeHTML(r.file_name) + '">' +
            '📄 <span class="biolab-archive-attachment-name">' + escapeHTML(r.file_name) + '</span>' +
            '</a>'
          );
        }).join('');
        if (!items) return;
        el.innerHTML =
          '<h2>Workflow PDF' + (rows.length > 1 ? 's' : '') + '</h2>' +
          '<div class="biolab-archive-attachment-list">' + items + '</div>';
      });
    });
  }

  function loadReferenceResult(protocolId) {
    var el = document.getElementById('biolab-archive-reference');
    client.from('biolab_reference_results').select('*').eq('practical_id', protocolId).then(function (result) {
      var rows = (result && result.data) || [];
      if (!rows.length) return; // absence is the common case -- no empty-state clutter
      el.innerHTML = '<h2>BiOGuide Reference Result</h2>' + rows.map(function (r) {
        return (
          '<div class="biolab-archive-reference-card">' +
          '<span class="biolab-archive-reference-value">' + escapeHTML(r.result_value) + (r.result_unit ? ' ' + escapeHTML(r.result_unit) : '') + '</span>' +
          (r.notes ? '<p class="biolab-archive-reference-notes">' + escapeHTML(r.notes) + '</p>' : '') +
          '</div>'
        );
      }).join('');
    });
  }

  function loadFeedback(protocolId) {
    var el = document.getElementById('biolab-archive-feedback');
    el.innerHTML = '<h2>Feedback</h2><p class="discussions-status">Loading feedback…</p>';
    client.from('biolab_protocol_feedback_feed').select('*').eq('protocol_id', protocolId).limit(500).then(function (result) {
      if (result.error) {
        el.innerHTML = '<h2>Feedback</h2><p class="discussions-status">Could not load feedback right now.</p>';
        return;
      }
      var rows = result.data || [];
      var body = rows.length
        ? '<div class="discussions-comments">' + rows.map(renderFeedbackComment).join('') + '</div>'
        : '<p class="discussions-status">No feedback yet.</p>';
      el.innerHTML = '<h2>Feedback</h2>' + body;
    });
  }

  function renderFeedbackComment(c) {
    return (
      '<div class="discussions-comment">' +
      '<div class="discussions-thread-meta">' +
        window.PapersAuth.avatarHTML(c.display_name, c.avatar_url) +
        window.PapersAuth.flagHTML(c.country) +
        '<span>' + escapeHTML(c.display_name) + '</span>' +
        '<span class="discussions-meta-dot">·</span>' +
        '<span>' + formatDate(c.created_at) + '</span>' +
      '</div>' +
      '<p class="discussions-comment-body">' + escapeHTML(c.comment) + '</p>' +
      '</div>'
    );
  }

  function loadResults(protocolId) {
    var el = document.getElementById('biolab-archive-results');
    el.innerHTML = '<h2>Results</h2><p class="discussions-status">Loading results…</p>';

    PapersAuth.getSession().then(function (session) {
      var userId = session && session.user ? session.user.id : null;

      var ownPromise = userId
        ? client.from('biolab_submissions').select('*').eq('practical_id', protocolId).eq('user_id', userId)
        : Promise.resolve({ data: [] });
      var publicPromise = client.from('biolab_public_submissions').select('*').eq('practical_id', protocolId).limit(200);

      Promise.all([ownPromise, publicPromise]).then(function (results) {
        var ownResult = results[0];
        var publicResult = results[1];
        if ((ownResult && ownResult.error) || (publicResult && publicResult.error)) {
          el.innerHTML = '<h2>Results</h2><p class="discussions-status">Could not load results right now.</p>';
          return;
        }
        var own = (ownResult && ownResult.data) || [];
        var others = ((publicResult && publicResult.data) || []).filter(function (s) {
          return s.user_id !== userId;
        });

        if (!own.length && !others.length) {
          el.innerHTML = '<h2>Results</h2><p class="discussions-status">No submitted results yet.</p>';
          return;
        }

        // Own submissions come from a direct biolab_submissions select,
        // which no longer carries any image data (image_path was dropped
        // from that table in migration 021) -- fetch this user's own
        // images separately, keyed by submission_id. RLS on
        // biolab_submission_images allows the owner to see their own rows
        // regardless of publish state, same as the submission row itself.
        var ownIds = own.map(function (s) { return s.id; });
        var ownImagesPromise = ownIds.length
          ? client.from('biolab_submission_images').select('submission_id, image_path, position').in('submission_id', ownIds)
          : Promise.resolve({ data: [] });
        var ownProfilePromise = userId ? PapersAuth.getProfile(userId) : Promise.resolve(null);

        Promise.all([ownProfilePromise, ownImagesPromise]).then(function (r) {
          var ownProfile = r[0];
          var ownImagesResult = r[1];
          if (ownImagesResult && ownImagesResult.error) {
            el.innerHTML = '<h2>Results</h2><p class="discussions-status">Could not load results right now.</p>';
            return;
          }

          var imagesBySubmission = {};
          (ownImagesResult.data || []).forEach(function (row) {
            (imagesBySubmission[row.submission_id] = imagesBySubmission[row.submission_id] || []).push(row);
          });
          own.forEach(function (s) { s.images = imagesBySubmission[s.id] || []; });
          // others come from biolab_public_submissions, which already
          // aggregates images as a jsonb array (021) -- just guard null.
          others.forEach(function (s) { s.images = s.images || []; });

          // One batched signed-URL request for every image on the page --
          // the bucket is private, so a plain public URL would 403.
          var allPaths = [];
          own.concat(others).forEach(function (s) {
            s.images.forEach(function (img) { allPaths.push(img.image_path); });
          });
          var signedUrlPromise = allPaths.length
            ? client.storage.from('biolab-captures').createSignedUrls(allPaths, 3600)
            : Promise.resolve({ data: [] });

          signedUrlPromise.then(function (signedResult) {
            var urlByPath = {};
            ((signedResult && signedResult.data) || []).forEach(function (row) {
              if (row && row.path && row.signedUrl && !row.error) urlByPath[row.path] = row.signedUrl;
            });

            var html = '<h2>Results</h2><div class="biolab-archive-results-list">';
            own.forEach(function (s) {
              html += renderResultCard(s, ownProfile, true, userId, urlByPath);
            });
            others.forEach(function (s) {
              html += renderResultCard(s, s, false, userId, urlByPath);
            });
            html += '</div>';
            el.innerHTML = html;

            others.forEach(function (s) {
              attachReportForm(document.getElementById('biolab-archive-report-sub-' + s.id), {
                table: 'biolab_submission_reports',
                idField: 'submission_id',
                idValue: s.id,
                buttonLabel: '🚩 Report',
                nextPath: window.location.pathname + window.location.search
              });
            });

            el.querySelectorAll('.biolab-archive-publish-toggle').forEach(function (btn) {
              btn.addEventListener('click', function () {
                var subId = btn.getAttribute('data-sub-id');
                var nowPublished = btn.getAttribute('data-published') === '1';
                btn.disabled = true;
                client.from('biolab_submissions').update({ is_published: !nowPublished }).eq('id', subId).then(function (result) {
                  if (result.error) {
                    btn.disabled = false;
                    return;
                  }
                  loadResults(protocolId);
                });
              });
            });
          });
        });
      }).catch(function () {
        el.innerHTML = '<h2>Results</h2><p class="discussions-status">Could not load results right now.</p>';
      });
    });
  }

  // is_removed/is_published visibility is a SUBMISSION-level concept only
  // (per the task's own load-bearing constraint) -- images inherit their
  // parent submission's visibility wholesale via biolab_submission_images'
  // RLS; there is no per-image moderation or per-image publish toggle here.
  function renderImageGallery(images, urlByPath) {
    if (!images || !images.length) return '';
    var sorted = images.slice().sort(function (a, b) { return a.position - b.position; });
    var thumbs = sorted.map(function (img) {
      var url = urlByPath[img.image_path];
      if (!url) return '';
      return (
        '<a class="biolab-archive-gallery-thumb" href="' + escapeHTML(url) + '" target="_blank" rel="noopener">' +
        '<img src="' + escapeHTML(url) + '" alt="Submitted result photo" loading="lazy">' +
        '</a>'
      );
    }).join('');
    return thumbs ? '<div class="biolab-archive-gallery">' + thumbs + '</div>' : '';
  }

  function renderResultCard(s, profileLike, isOwn, viewerUserId, urlByPath) {
    var name = isOwn ? 'You' : (profileLike.display_name || 'A BiOGuide member');
    var avatar = isOwn
      ? window.PapersAuth.avatarHTML(profileLike && profileLike.display_name, profileLike && profileLike.avatar_url)
      : window.PapersAuth.avatarHTML(profileLike.display_name, profileLike.avatar_url);
    var flag = isOwn
      ? window.PapersAuth.flagHTML(profileLike && profileLike.country)
      : window.PapersAuth.flagHTML(profileLike.country);

    var tags = '';
    if (s.is_verified) tags += '<span class="biolab-badge biolab-badge-official biolab-badge-sm">✓ BiOGuide-Verified</span>';
    if (isOwn) tags += '<span class="biolab-archive-visibility-tag ' + (s.is_published ? 'is-public' : 'is-private') + '">' + (s.is_published ? 'Public' : 'Private — only you can see this') + '</span>';
    // is_removed is staff-only (set from the Supabase dashboard, never
    // client-writable -- see migration 020); own query is a direct table
    // select so a removed row still reaches the owner, just tagged.
    if (isOwn && s.is_removed) tags += '<span class="biolab-archive-visibility-tag is-removed">Removed by staff — a report against this was actioned</span>';

    var reportSlot = (!isOwn) ? '<div id="biolab-archive-report-sub-' + s.id + '" class="biolab-archive-report-wrap biolab-archive-report-wrap-sm"></div>' : '';
    // is_published is the one field a submitter can change after insert
    // (grant update (is_published) on biolab_submissions -- see 015); this
    // toggle is the only UI for it, own results only.
    var toggleSlot = isOwn
      ? '<button type="button" class="biolab-archive-publish-toggle" data-sub-id="' + s.id + '" data-published="' + (s.is_published ? '1' : '0') + '">' + (s.is_published ? 'Make private' : 'Make public') + '</button>'
      : '';

    return (
      '<div class="biolab-archive-result-card">' +
      '<div class="biolab-archive-result-top">' +
        '<div class="biolab-archive-result-who">' + avatar + flag + '<span>' + escapeHTML(name) + '</span></div>' +
        '<span class="biolab-archive-result-value">' + escapeHTML(s.result_value != null ? String(s.result_value) : '—') + (s.result_unit ? ' ' + escapeHTML(s.result_unit) : '') + '</span>' +
      '</div>' +
      (tags ? '<div class="biolab-archive-result-tags">' + tags + '</div>' : '') +
      renderImageGallery(s.images, urlByPath) +
      '<div class="biolab-archive-result-date">' + formatDate(s.captured_at) + '</div>' +
      reportSlot +
      toggleSlot +
      '</div>'
    );
  }

  // ------------------------------------------------------------- report --

  function attachReportForm(container, opts) {
    if (!container) return;
    container.innerHTML =
      '<button type="button" class="biolab-archive-report-btn">' + opts.buttonLabel + '</button>' +
      '<div class="biolab-archive-report-form-wrap" hidden></div>';

    var btn = container.querySelector('.biolab-archive-report-btn');
    var formWrap = container.querySelector('.biolab-archive-report-form-wrap');

    btn.addEventListener('click', function () {
      if (!formWrap.hidden) { formWrap.hidden = true; return; }
      PapersAuth.getSession().then(function (session) {
        if (!session) {
          formWrap.innerHTML = '<p class="discussions-status">Log in to report this. <a href="' + nextURLFor(opts.nextPath) + '">Log in</a></p>';
          formWrap.hidden = false;
          return;
        }
        formWrap.innerHTML =
          '<form class="discussions-form biolab-archive-report-form">' +
          '<textarea name="reason" placeholder="What\'s wrong with this?" maxlength="1000" rows="3" required></textarea>' +
          '<button type="submit" class="papers-nav-btn papers-nav-next">Submit report</button>' +
          '<div class="discussions-msg biolab-archive-report-msg"></div>' +
          '</form>';
        formWrap.hidden = false;

        var form = formWrap.querySelector('form');
        var msg = formWrap.querySelector('.biolab-archive-report-msg');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var reason = form.reason.value.trim();
          if (!reason) return;
          msg.textContent = 'Submitting…';
          var row = {};
          row[opts.idField] = opts.idValue;
          row.reason = reason;
          client.from(opts.table).insert(row).then(function (result) {
            if (result.error) {
              if (result.error.code === '23505') {
                msg.textContent = "You've already reported this — thanks, our team will review it.";
              } else {
                msg.textContent = result.error.message;
              }
              return;
            }
            formWrap.innerHTML = '<p class="discussions-status">Reported — thanks, our team will review it.</p>';
            btn.disabled = true;
          });
        });
      });
    });
  }

  // ---------------------------------------------------- submit feedback --

  function attachFeedbackForm(protocolId) {
    var container = document.getElementById('biolab-archive-feedback-form');
    if (!container) return;
    PapersAuth.getSession().then(function (session) {
      if (!session) {
        container.innerHTML = '<p class="discussions-status">Log in to leave feedback. <a href="' + nextURLFor('/biolab/archive/?protocol=' + encodeURIComponent(getParam('protocol') || '')) + '">Log in</a></p>';
        return;
      }
      container.innerHTML =
        '<form class="discussions-form biolab-archive-feedback-form">' +
        '<textarea name="comment" placeholder="Ran this yourself? Leave feedback for other students…" maxlength="2000" rows="3" required></textarea>' +
        '<button type="submit" class="papers-nav-btn papers-nav-next">Post feedback</button>' +
        '<div class="discussions-msg biolab-archive-feedback-msg"></div>' +
        '</form>';

      var form = container.querySelector('form');
      var msg = container.querySelector('.biolab-archive-feedback-msg');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var comment = form.comment.value.trim();
        if (!comment) return;
        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        msg.textContent = 'Posting…';
        // user_id intentionally omitted -- biolab_protocol_feedback.user_id
        // defaults to auth.uid() and RLS forces it; a spoofed user_id is
        // rejected (verified in hidden-ex-features/biolab-rls-tests/test-submit.mjs).
        client.from('biolab_protocol_feedback').insert({ protocol_id: protocolId, comment: comment }).then(function (result) {
          submitBtn.disabled = false;
          if (result.error) {
            msg.textContent = result.error.message;
            return;
          }
          form.reset();
          msg.textContent = '';
          loadFeedback(protocolId);
        });
      });
    });
  }

  // ------------------------------------------------------ submit result --

  // Re-encoding through <canvas> drops all EXIF metadata (GPS, device
  // info, timestamps) by construction -- canvas.toBlob() never carries it
  // through -- which is the "EXIF stripped from all uploads" baseline
  // locked for this feature. Also downsizes to a sane max dimension so
  // captures don't balloon the biolab-captures bucket.
  function stripExifToJpegBlob(file) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        var MAX_DIM = 1600;
        var scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        var canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(function (blob) {
          if (!blob) { reject(new Error('Could not process that image.')); return; }
          resolve(blob);
        }, 'image/jpeg', 0.9);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Could not load that image.')); };
      img.src = url;
    });
  }

  function blobToDataURL(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error('Could not read that image.')); };
      reader.readAsDataURL(blob);
    });
  }

  // Path convention {user_id}/{filename}, matching the Storage RLS in
  // 015/016 (auth.uid()::text = foldername(name)[1] gates both insert and
  // the owner-read policy; the published-read policy in 016 is separate).
  function uploadCapture(userId, blob) {
    var filename = (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2))) + '.jpg';
    var path = userId + '/' + filename;
    return client.storage.from('biolab-captures').upload(path, blob, { contentType: 'image/jpeg' }).then(function (result) {
      if (result.error) throw result.error;
      return path;
    });
  }

  // Calls the Session 2 edge function (supabase/functions/biolab-calibrate-delta).
  // As of this session it may not be deployed yet -- callers must handle
  // rejection gracefully and fall back to manual entry, not treat this as
  // a hard dependency.
  function callCalibrateEdgeFunction(dataUrl, accessToken) {
    var url = window.__SUPABASE_URL.replace(/\/$/, '') + '/functions/v1/biolab-calibrate-delta';
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': window.__SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + (accessToken || window.__SUPABASE_ANON_KEY)
      },
      body: JSON.stringify({ image: dataUrl })
    }).then(function (res) {
      if (!res.ok) return res.json().then(function (j) { throw new Error((j && j.error) || ('HTTP ' + res.status)); });
      return res.json();
    });
  }

  function attachResultForm(protocolId) {
    var container = document.getElementById('biolab-archive-result-form');
    if (!container) return;
    PapersAuth.getSession().then(function (session) {
      if (!session) {
        container.innerHTML = '<p class="discussions-status">Log in to submit your own result against this protocol. <a href="' + nextURLFor('/biolab/archive/?protocol=' + encodeURIComponent(getParam('protocol') || '')) + '">Log in</a></p>';
        return;
      }
      var userId = session.user.id;

      container.innerHTML =
        '<h2>Submit your result</h2>' +
        '<form class="discussions-form biolab-archive-result-form">' +
        '<label class="biolab-submit-label">Result value</label>' +
        '<input type="number" step="any" name="result_value" placeholder="e.g. 3.25">' +
        '<label class="biolab-submit-label">Unit <span class="biolab-feedback-hint">(optional)</span></label>' +
        '<input type="text" name="result_unit" maxlength="40" placeholder="e.g. mmol/L">' +

        '<div class="biolab-archive-capture-box">' +
          '<label class="biolab-submit-label">Photos <span class="biolab-feedback-hint">(optional, up to ' + MAX_RESULT_IMAGES + ' -- add one at a time or select several at once; EXIF metadata is stripped from every photo before upload)</span></label>' +
          '<p class="biolab-archive-framing-note">📷 Before you take or choose your photos: frame each one tight on the sample/card only. Don\'t include your face, other people, or anything in the background (room, whiteboard, ID badge, etc.) that could identify you or your location -- this applies to every photo you attach, not just the first.</p>' +
          '<input type="file" accept="image/*" capture="environment" multiple class="biolab-archive-capture-input">' +
          '<div class="biolab-archive-capture-preview" hidden></div>' +
          '<button type="button" class="biolab-archive-calibrate-btn" hidden>🔬 Run guided calibration on the first photo</button>' +
          '<div class="biolab-archive-calibrate-status"></div>' +
          '<p class="biolab-archive-capture-note">For protocols with a colorimetric (color-based) readout, guided calibration reads reference-card deltas from your first photo to help you determine your result -- it doesn\'t compute the final value for you, since that depends on your own assay\'s calibration curve. Any other photos you attach are just extra reference images, not calibrated.</p>' +
        '</div>' +

        '<p class="biolab-archive-privacy-note">Your result stays private -- visible only to you -- until you choose to make it public from the list above.</p>' +
        '<button type="submit" class="papers-nav-btn papers-nav-next">Submit result</button>' +
        '<div class="discussions-msg biolab-archive-result-msg"></div>' +
        '</form>';

      var form = container.querySelector('form');
      var msg = container.querySelector('.biolab-archive-result-msg');
      var fileInput = container.querySelector('.biolab-archive-capture-input');
      var previewEl = container.querySelector('.biolab-archive-capture-preview');
      var calibrateBtn = container.querySelector('.biolab-archive-calibrate-btn');
      var calibrateStatus = container.querySelector('.biolab-archive-calibrate-status');

      // { blob: Blob, previewUrl: string }[], in selection/upload order --
      // index 0 is "the calibration photo" (see the calibrate button above).
      var selectedImages = [];
      var calibrationInputs = {};

      function renderCapturePreview() {
        if (!selectedImages.length) {
          previewEl.hidden = true;
          previewEl.innerHTML = '';
          calibrateBtn.hidden = true;
          return;
        }
        previewEl.hidden = false;
        previewEl.innerHTML = '<div class="biolab-archive-capture-thumbs">' +
          selectedImages.map(function (img, i) {
            return (
              '<div class="biolab-archive-capture-thumb">' +
              '<img src="' + img.previewUrl + '" alt="Selected photo ' + (i + 1) + ' preview">' +
              '<button type="button" class="biolab-archive-capture-remove" data-idx="' + i + '" aria-label="Remove this photo">&times;</button>' +
              (i === 0 ? '<span class="biolab-archive-capture-thumb-tag">Calibration photo</span>' : '') +
              '</div>'
            );
          }).join('') +
          '</div>';
        calibrateBtn.hidden = false;
        previewEl.querySelectorAll('.biolab-archive-capture-remove').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = Number(btn.getAttribute('data-idx'));
            URL.revokeObjectURL(selectedImages[idx].previewUrl);
            selectedImages.splice(idx, 1);
            calibrationInputs = {};
            calibrateStatus.textContent = '';
            renderCapturePreview();
          });
        });
      }

      fileInput.addEventListener('change', function () {
        var files = Array.prototype.slice.call(fileInput.files || []);
        fileInput.value = ''; // reset so the same input can be reused to add more photos later
        if (!files.length) return;

        var room = MAX_RESULT_IMAGES - selectedImages.length;
        if (room <= 0) {
          calibrateStatus.textContent = 'You can attach up to ' + MAX_RESULT_IMAGES + ' photos.';
          return;
        }
        if (files.length > room) {
          calibrateStatus.textContent = 'Only added ' + room + ' more photo' + (room === 1 ? '' : 's') + ' -- ' + MAX_RESULT_IMAGES + ' max.';
          files = files.slice(0, room);
        }

        previewEl.hidden = false;
        previewEl.textContent = 'Processing photo' + (files.length > 1 ? 's' : '') + '…';

        Promise.all(files.map(function (file) {
          return stripExifToJpegBlob(file).then(function (blob) {
            return { blob: blob, previewUrl: URL.createObjectURL(blob) };
          });
        })).then(function (processed) {
          selectedImages = selectedImages.concat(processed);
          renderCapturePreview();
        }).catch(function (err) {
          previewEl.textContent = err.message;
        });
      });

      calibrateBtn.addEventListener('click', function () {
        if (!selectedImages.length) return;
        calibrateBtn.disabled = true;
        calibrateStatus.textContent = 'Calibrating…';
        blobToDataURL(selectedImages[0].blob).then(function (dataUrl) {
          return callCalibrateEdgeFunction(dataUrl, session.access_token);
        }).then(function (data) {
          calibrationInputs = data.calibration_inputs || {};
          var deltaText = (calibrationInputs.delta_r != null)
            ? ('Δr=' + calibrationInputs.delta_r + ' Δg=' + calibrationInputs.delta_g + ' Δb=' + calibrationInputs.delta_b)
            : 'Calibration data captured.';
          calibrateStatus.textContent = 'Quality: ' + (data.quality || 'unknown') + ' — ' + deltaText + '. These values will be attached to your submission.';
          calibrateBtn.disabled = false;
        }).catch(function (err) {
          calibrateStatus.textContent = 'Guided calibration isn\'t available right now (' + err.message + ') — you can still submit a manual result and attach your photos.';
          calibrateBtn.disabled = false;
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var resultValue = form.result_value.value.trim();
        var resultUnit = form.result_unit.value.trim();
        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        msg.textContent = 'Submitting…';

        // Upload every selected image first (order preserved -- Promise.all
        // resolves in input order regardless of completion order), THEN
        // insert the submission row, THEN insert one biolab_submission_images
        // row per uploaded path. Images must come after the submission
        // insert because biolab_submission_images_insert_own's RLS with-check
        // requires the parent submission to already exist and belong to us.
        var uploadPromise = selectedImages.length
          ? Promise.all(selectedImages.map(function (img) { return uploadCapture(userId, img.blob); }))
          : Promise.resolve([]);

        uploadPromise.then(function (imagePaths) {
          // user_id and is_published intentionally omitted -- user_id
          // defaults to auth.uid() and RLS forces it (verified in
          // test-submit.mjs); is_published defaults to false (private)
          // and is only ever changed later via the Make public toggle.
          var row = {
            practical_id: protocolId,
            result_value: resultValue === '' ? null : Number(resultValue),
            result_unit: resultUnit || null,
            calibration_inputs: calibrationInputs
          };
          return client.from('biolab_submissions').insert(row).select('id').single().then(function (result) {
            if (result.error) throw result.error;
            if (!imagePaths.length) return;
            var imageRows = imagePaths.map(function (path, i) {
              return { submission_id: result.data.id, image_path: path, position: i };
            });
            return client.from('biolab_submission_images').insert(imageRows).then(function (imgResult) {
              if (imgResult.error) throw imgResult.error;
            });
          });
        }).then(function () {
          submitBtn.disabled = false;
          selectedImages.forEach(function (img) { URL.revokeObjectURL(img.previewUrl); });
          selectedImages = [];
          form.reset();
          renderCapturePreview();
          calibrationInputs = {};
          msg.textContent = 'Submitted — private by default, see it in the list above.';
          loadResults(protocolId);
        }).catch(function (err) {
          submitBtn.disabled = false;
          msg.textContent = (err && err.message) || 'Could not submit that result — try again.';
        });
      });
    });
  }
})();
