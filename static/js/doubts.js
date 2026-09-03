/* doubts.js -- staff-answered, image-capable academic Q&A (replaces
   discussions.js). Depends on: papers-auth.js (PapersAuth). */
(function () {
  'use strict';

  var root = document.getElementById('doubts-root');
  if (!root) return;

  var MAX_IMAGES = 3;

  var SUBJECT_LABELS = {
    'cell-biology': '🔬 Cell biology',
    genetics: '🧬 Genetics',
    evolution: '🌱 Evolution',
    ecology: '🌿 Ecology',
    physiology: '🫀 Physiology',
    biochemistry: '⚗️ Biochemistry',
    anatomy: '🦴 Anatomy',
    'taxonomy-systematics': '🗂️ Taxonomy & systematics',
    ethology: '🦉 Ethology',
    general: '💬 General / feedback'
  };

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  function getThreadIdParam() {
    var m = /[?&]thread=([^&]+)/.exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function nextURLFor(path) {
    return '/account/?next=' + encodeURIComponent(path);
  }

  function subjectHTML(subject) {
    var label = SUBJECT_LABELS[subject] || SUBJECT_LABELS.general;
    return '<span class="papers-subject-tag">' + label + '</span>';
  }

  function subjectOptionsHTML(selected) {
    return Object.keys(SUBJECT_LABELS).map(function (key) {
      return '<option value="' + key + '"' + (key === selected ? ' selected' : '') + '>' + SUBJECT_LABELS[key] + '</option>';
    }).join('');
  }

  var listView = document.getElementById('doubts-list-view');
  var detailView = document.getElementById('doubts-detail-view');
  var threadId = getThreadIdParam();

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
    var statusEl = threadId
      ? document.getElementById('doubts-detail-status')
      : document.getElementById('doubts-list-status');
    if (threadId) { listView.hidden = true; detailView.hidden = false; } else { detailView.hidden = true; }
    statusEl.textContent = "Doubts aren't configured on this environment yet.";
    return;
  }

  var client = window.PapersAuth.getClient();

  if (threadId) {
    listView.hidden = true;
    detailView.hidden = false;
    renderDetail(threadId);
  } else {
    detailView.hidden = true;
    renderList();
  }

  // -------------------------------------------------- image upload utils --

  // Re-encoding through <canvas> drops all EXIF metadata (GPS, device info,
  // timestamps) by construction, and downsizes so uploads stay small.
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

  function uploadImage(bucket, ownerId, blob) {
    var filename = (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2))) + '.jpg';
    var path = ownerId + '/' + filename;
    return client.storage.from(bucket).upload(path, blob, { contentType: 'image/jpeg' }).then(function (result) {
      if (result.error) throw result.error;
      return path;
    });
  }

  function attachImagePicker(container, opts) {
    container.innerHTML =
      '<label class="biolab-submit-label">Photos <span class="biolab-feedback-hint">(optional, up to ' + MAX_IMAGES + ')</span></label>' +
      '<input type="file" accept="image/*" capture="environment" multiple class="biolab-archive-capture-input">' +
      '<div class="biolab-archive-capture-preview" hidden></div>';

    var fileInput = container.querySelector('.biolab-archive-capture-input');
    var previewEl = container.querySelector('.biolab-archive-capture-preview');
    var selected = [];

    function renderPreview() {
      if (!selected.length) {
        previewEl.hidden = true;
        previewEl.innerHTML = '';
        return;
      }
      previewEl.hidden = false;
      previewEl.innerHTML = '<div class="biolab-archive-capture-thumbs">' +
        selected.map(function (img, i) {
          return (
            '<div class="biolab-archive-capture-thumb">' +
            '<img src="' + img.previewUrl + '" alt="Selected photo ' + (i + 1) + ' preview">' +
            '<button type="button" class="biolab-archive-capture-remove" data-idx="' + i + '" aria-label="Remove this photo">&times;</button>' +
            '</div>'
          );
        }).join('') +
        '</div>';
      previewEl.querySelectorAll('.biolab-archive-capture-remove').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var idx = Number(btn.getAttribute('data-idx'));
          URL.revokeObjectURL(selected[idx].previewUrl);
          selected.splice(idx, 1);
          renderPreview();
        });
      });
    }

    fileInput.addEventListener('change', function () {
      var files = Array.prototype.slice.call(fileInput.files || []);
      fileInput.value = '';
      if (!files.length) return;
      var room = MAX_IMAGES - selected.length;
      if (room <= 0) return;
      if (files.length > room) files = files.slice(0, room);
      previewEl.hidden = false;
      previewEl.textContent = 'Processing photo' + (files.length > 1 ? 's' : '') + '…';
      Promise.all(files.map(function (file) {
        return stripExifToJpegBlob(file).then(function (blob) {
          return { blob: blob, previewUrl: URL.createObjectURL(blob) };
        });
      })).then(function (processed) {
        selected = selected.concat(processed);
        renderPreview();
      }).catch(function (err) {
        previewEl.textContent = err.message;
      });
    });

    return {
      getBlobs: function () { return selected.map(function (s) { return s.blob; }); },
      reset: function () {
        selected.forEach(function (s) { URL.revokeObjectURL(s.previewUrl); });
        selected = [];
        renderPreview();
      }
    };
  }

  function renderImageGallery(images, urlByPath) {
    if (!images || !images.length) return '';
    var sorted = images.slice().sort(function (a, b) { return a.position - b.position; });
    var thumbs = sorted.map(function (img) {
      var url = urlByPath[img.image_path];
      if (!url) return '';
      return (
        '<a class="biolab-archive-gallery-thumb" href="' + escapeHTML(url) + '" target="_blank" rel="noopener">' +
        '<img src="' + escapeHTML(url) + '" alt="Attached photo" loading="lazy">' +
        '</a>'
      );
    }).join('');
    return thumbs ? '<div class="biolab-archive-gallery">' + thumbs + '</div>' : '';
  }

  function signImages(rows, bucket) {
    var paths = [];
    rows.forEach(function (r) { (r.images || []).forEach(function (img) { paths.push(img.image_path); }); });
    if (!paths.length) return Promise.resolve({});
    return client.storage.from(bucket).createSignedUrls(paths, 3600).then(function (result) {
      var urlByPath = {};
      ((result && result.data) || []).forEach(function (row) {
        if (row && row.path && row.signedUrl && !row.error) urlByPath[row.path] = row.signedUrl;
      });
      return urlByPath;
    });
  }

  // -------------------------------------------------------------- list --

  var allDoubts = [];

  function renderList() {
    renderNewThreadBox();

    var statusEl = document.getElementById('doubts-list-status');
    var listEl = document.getElementById('doubts-list');
    var filtersEl = document.getElementById('doubts-filters');

    filtersEl.innerHTML =
      '<select id="doubts-subject-filter" class="biolab-archive-category-select">' +
      '<option value="">All subjects</option>' + subjectOptionsHTML(null) +
      '</select>';
    var filterSelect = document.getElementById('doubts-subject-filter');
    filterSelect.addEventListener('change', applyFilter);

    client.from('doubts_feed').select('*').limit(200).then(function (result) {
      if (result.error) {
        statusEl.textContent = 'Could not load doubts right now — try refreshing.';
        return;
      }
      allDoubts = result.data || [];
      if (!allDoubts.length) {
        statusEl.textContent = 'No doubts yet — be the first to ask one.';
        return;
      }
      statusEl.hidden = true;
      listEl.hidden = false;
      applyFilter();
    }).catch(function () {
      statusEl.textContent = 'Could not load doubts right now — try refreshing.';
    });

    function applyFilter() {
      var subject = filterSelect.value;
      var filtered = subject ? allDoubts.filter(function (d) { return d.subject === subject; }) : allDoubts;
      listEl.innerHTML = filtered.length
        ? filtered.map(renderThreadCard).join('')
        : '<p class="discussions-status">No doubts in this subject yet.</p>';
    }
  }

  function renderThreadCard(t) {
    var excerpt = t.body.length > 160 ? t.body.slice(0, 160) + '…' : t.body;
    return (
      '<a class="discussions-thread-card" href="?thread=' + encodeURIComponent(t.id) + '">' +
      '<div class="discussions-thread-card-top">' +
        '<span class="discussions-thread-title">' + escapeHTML(t.title) + '</span>' +
        '<span class="discussions-badge ' + (t.is_closed ? 'discussions-badge-closed' : 'discussions-badge-open') + '">' + (t.is_closed ? 'Resolved' : 'Open') + '</span>' +
      '</div>' +
      subjectHTML(t.subject) +
      '<p class="discussions-thread-excerpt">' + escapeHTML(excerpt) + '</p>' +
      '<div class="discussions-thread-meta">' +
        window.PapersAuth.avatarHTML(t.display_name, t.avatar_url) +
        window.PapersAuth.flagHTML(t.country) +
        '<span>' + escapeHTML(t.display_name) + '</span>' +
        '<span class="discussions-meta-dot">·</span>' +
        '<span>' + t.comment_count + ' repl' + (t.comment_count === 1 ? 'y' : 'ies') + '</span>' +
        '<span class="discussions-meta-dot">·</span>' +
        '<span>' + formatDate(t.created_at) + '</span>' +
      '</div>' +
      '</a>'
    );
  }

  function renderNewThreadBox() {
    var box = document.getElementById('doubts-new-thread');
    window.PapersAuth.getSession().then(function (session) {
      if (!session) {
        box.innerHTML = '<a class="papers-nav-btn papers-nav-next" href="' + nextURLFor('/doubts/') + '">Log in to ask a doubt</a>';
        return;
      }
      box.innerHTML =
        '<form id="doubts-new-thread-form" class="discussions-form">' +
        '<input type="text" name="title" placeholder="Title" maxlength="140" required>' +
        '<select name="subject">' + subjectOptionsHTML('general') + '</select>' +
        '<textarea name="body" placeholder="What\'s your doubt?" maxlength="5000" rows="4" required></textarea>' +
        '<div class="doubts-image-picker"></div>' +
        '<button type="submit" class="papers-nav-btn papers-nav-next">Post your doubt</button>' +
        '<div class="discussions-msg" id="doubts-new-thread-msg"></div>' +
        '</form>';

      var picker = attachImagePicker(box.querySelector('.doubts-image-picker'), {});
      var form = document.getElementById('doubts-new-thread-form');
      var msg = document.getElementById('doubts-new-thread-msg');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var title = form.title.value.trim();
        var body = form.body.value.trim();
        var subject = form.subject.value;
        if (!title || !body) return;
        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        msg.textContent = 'Posting…';

        client.from('doubts').insert({ title: title, body: body, subject: subject }).select('id').single().then(function (result) {
          if (result.error) throw result.error;
          var doubtId = result.data.id;
          var blobs = picker.getBlobs();
          if (!blobs.length) return doubtId;
          return Promise.all(blobs.map(function (blob) { return uploadImage('doubt-images', doubtId, blob); }))
            .then(function (paths) {
              var rows = paths.map(function (path, i) { return { doubt_id: doubtId, image_path: path, position: i }; });
              return client.from('doubt_images').insert(rows).then(function (imgResult) {
                if (imgResult.error) throw imgResult.error;
                return doubtId;
              });
            });
        }).then(function (doubtId) {
          window.location.href = '?thread=' + encodeURIComponent(doubtId);
        }).catch(function (err) {
          submitBtn.disabled = false;
          msg.textContent = (err && err.message) || 'Could not post that doubt — try again.';
        });
      });
    });
  }

  // ------------------------------------------------------------ detail --

  function renderDetail(id) {
    var statusEl = document.getElementById('doubts-detail-status');
    var threadEl = document.getElementById('doubts-thread');

    client.from('doubts_feed').select('*').eq('id', id).single().then(function (result) {
      if (result.error || !result.data) {
        statusEl.textContent = "That doubt doesn't exist, or was removed.";
        return;
      }
      var t = result.data;
      statusEl.hidden = true;

      signImages([t], 'doubt-images').then(function (urlByPath) {
        threadEl.innerHTML =
          '<h1 class="discussions-thread-heading">' + escapeHTML(t.title) +
          ' <span class="discussions-badge ' + (t.is_closed ? 'discussions-badge-closed' : 'discussions-badge-open') + '">' + (t.is_closed ? 'Resolved' : 'Open') + '</span></h1>' +
          subjectHTML(t.subject) +
          '<div class="discussions-thread-meta">' +
            window.PapersAuth.avatarHTML(t.display_name, t.avatar_url) +
            window.PapersAuth.flagHTML(t.country) +
            '<span>' + escapeHTML(t.display_name) + '</span>' +
            '<span class="discussions-meta-dot">·</span>' +
            '<span>' + formatDate(t.created_at) + '</span>' +
          '</div>' +
          '<p class="discussions-thread-body">' + escapeHTML(t.body) + '</p>' +
          renderImageGallery(t.images, urlByPath) +
          '<div id="doubts-report-wrap" class="biolab-archive-report-wrap"></div>' +
          '<div id="doubts-resolve-wrap"></div>';
        threadEl.hidden = false;

        attachReportForm(document.getElementById('doubts-report-wrap'), id);
        attachResolveToggle(document.getElementById('doubts-resolve-wrap'), t);
        loadComments(id);
        renderCommentForm(id, t.is_closed);
      });
    }).catch(function () {
      statusEl.textContent = 'Could not load this doubt right now — try refreshing.';
    });
  }

  function attachReportForm(container, doubtId) {
    if (!container) return;
    container.innerHTML =
      '<button type="button" class="biolab-archive-report-btn">🚩 Report this doubt</button>' +
      '<div class="biolab-archive-report-form-wrap" hidden></div>';

    var btn = container.querySelector('.biolab-archive-report-btn');
    var formWrap = container.querySelector('.biolab-archive-report-form-wrap');

    btn.addEventListener('click', function () {
      if (!formWrap.hidden) { formWrap.hidden = true; return; }
      window.PapersAuth.getSession().then(function (session) {
        if (!session) {
          formWrap.innerHTML = '<p class="discussions-status">Log in to report this. <a href="' + nextURLFor('/doubts/?thread=' + doubtId) + '">Log in</a></p>';
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
          client.from('doubt_reports').insert({ doubt_id: doubtId, reason: reason }).then(function (result) {
            if (result.error) {
              msg.textContent = result.error.code === '23505'
                ? "You've already reported this — thanks, our team will review it."
                : result.error.message;
              return;
            }
            formWrap.innerHTML = '<p class="discussions-status">Reported — thanks, our team will review it.</p>';
            btn.disabled = true;
          });
        });
      });
    });
  }

  function attachResolveToggle(container, doubt) {
    if (!container) return;
    window.PapersAuth.getSession().then(function (session) {
      if (!session) return;
      window.PapersAuth.getProfile(session.user.id).then(function (profile) {
        if (!profile || !profile.is_staff) return;
        container.innerHTML =
          '<button type="button" class="biolab-archive-publish-toggle">' +
          (doubt.is_closed ? 'Reopen this doubt' : 'Mark as resolved') +
          '</button>';
        container.querySelector('.biolab-archive-publish-toggle').addEventListener('click', function (e) {
          var toggleBtn = e.currentTarget;
          toggleBtn.disabled = true;
          client.from('doubts').update({ is_closed: !doubt.is_closed }).eq('id', doubt.id).then(function (result) {
            if (result.error) { toggleBtn.disabled = false; return; }
            renderDetail(doubt.id);
          });
        });
      });
    });
  }

  function loadComments(threadId) {
    var commentsEl = document.getElementById('doubts-comments');
    client.from('doubt_replies_feed').select('*').eq('thread_id', threadId).limit(500).then(function (result) {
      if (result.error) {
        commentsEl.innerHTML = '<p class="discussions-status">Could not load replies right now — try refreshing.</p>';
        commentsEl.hidden = false;
        return;
      }
      var rows = result.data || [];
      if (!rows.length) {
        commentsEl.innerHTML = '<p class="discussions-status">No replies yet — our team typically answers within a couple of days.</p>';
        commentsEl.hidden = false;
        return;
      }
      signImages(rows, 'doubt-reply-images').then(function (urlByPath) {
        commentsEl.innerHTML = rows.map(function (c) { return renderComment(c, urlByPath); }).join('');
        commentsEl.hidden = false;
      });
    });
  }

  function renderComment(c, urlByPath) {
    return (
      '<div class="discussions-comment">' +
      '<div class="discussions-thread-meta">' +
        window.PapersAuth.avatarHTML(c.display_name, c.avatar_url) +
        window.PapersAuth.flagHTML(c.country) +
        '<span>' + escapeHTML(c.display_name) + '</span>' +
        (c.is_staff ? '<span class="biolab-badge biolab-badge-official biolab-badge-sm">✓ BiOGuide Staff</span>' : '') +
        '<span class="discussions-meta-dot">·</span>' +
        '<span>' + formatDate(c.created_at) + '</span>' +
      '</div>' +
      '<p class="discussions-comment-body">' + escapeHTML(c.body) + '</p>' +
      renderImageGallery(c.images, urlByPath) +
      '</div>'
    );
  }

  function renderCommentForm(threadId, isClosed) {
    var formWrap = document.getElementById('doubts-comment-form-wrap');
    if (isClosed) {
      formWrap.innerHTML = '<p class="discussions-status discussions-closed-note">This doubt is marked resolved — no new replies.</p>';
      return;
    }
    window.PapersAuth.getSession().then(function (session) {
      if (!session) {
        formWrap.innerHTML = '';
        return;
      }
      window.PapersAuth.getProfile(session.user.id).then(function (profile) {
        if (!profile || !profile.is_staff) {
          formWrap.innerHTML = '';
          return;
        }

        formWrap.innerHTML =
          '<form id="doubts-comment-form" class="discussions-form">' +
          '<textarea name="body" placeholder="Answer this doubt…" maxlength="3000" rows="3" required></textarea>' +
          '<div class="doubts-image-picker"></div>' +
          '<button type="submit" class="papers-nav-btn papers-nav-next">Reply</button>' +
          '<div class="discussions-msg" id="doubts-comment-msg"></div>' +
          '</form>';

        var picker = attachImagePicker(formWrap.querySelector('.doubts-image-picker'), {});
        var form = document.getElementById('doubts-comment-form');
        var msg = document.getElementById('doubts-comment-msg');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var body = form.body.value.trim();
          if (!body) return;
          var submitBtn = form.querySelector('button[type="submit"]');
          submitBtn.disabled = true;
          msg.textContent = 'Posting…';

          client.from('doubt_replies').insert({ thread_id: threadId, body: body }).select('id').single().then(function (result) {
            if (result.error) throw result.error;
            var replyId = result.data.id;
            var blobs = picker.getBlobs();
            if (!blobs.length) return;
            return Promise.all(blobs.map(function (blob) { return uploadImage('doubt-reply-images', replyId, blob); }))
              .then(function (paths) {
                var rows = paths.map(function (path, i) { return { reply_id: replyId, image_path: path, position: i }; });
                return client.from('doubt_reply_images').insert(rows).then(function (imgResult) {
                  if (imgResult.error) throw imgResult.error;
                });
              });
          }).then(function () {
            submitBtn.disabled = false;
            picker.reset();
            form.reset();
            msg.textContent = '';
            loadComments(threadId);
          }).catch(function (err) {
            submitBtn.disabled = false;
            msg.textContent = (err && err.message) || 'Could not post that reply — try again.';
          });
        });
      });
    });
  }
})();
