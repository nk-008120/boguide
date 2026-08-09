/*
 * Drives content/discussions/index.md — a single static page acting as
 * both the thread list and every thread's detail view, since Hugo builds
 * statically and threads are created at runtime (same "one URL, JS-driven
 * screens" idea as the papers Timed Attempt flow). Which screen shows is
 * decided purely by a `?thread=<uuid>` query param, read client-side —
 * list view if absent, detail view if present. Plain query-string links
 * (not pushState) so this works with zero client routing: every "view"
 * is just the same page reloaded with a different query string.
 *
 * Read (threads + comments) is open to everyone via discussion_threads_feed
 * / discussion_comments_feed (supabase/migrations/007_discussions.sql).
 * Writing (new thread, new comment) requires login, same as every other
 * write path on this site — PapersAuth + the existing /account/?next=
 * redirect pattern. Closing a thread is owner-only, done by hand in the
 * Supabase SQL editor (see SETUP.md) — nothing in this file can close one.
 */
(function () {
  'use strict';

  var root = document.getElementById('discussions-root');
  if (!root) return;

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

  var listView = document.getElementById('discussions-list-view');
  var detailView = document.getElementById('discussions-detail-view');
  var threadId = getThreadIdParam();

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
    var statusEl = threadId
      ? document.getElementById('discussions-detail-status')
      : document.getElementById('discussions-list-status');
    if (threadId) { listView.hidden = true; detailView.hidden = false; } else { detailView.hidden = true; }
    statusEl.textContent = "Discussions aren't configured on this environment yet.";
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

  // ==================================================================
  // List view
  // ==================================================================
  function renderList() {
    renderNewThreadBox();

    var statusEl = document.getElementById('discussions-list-status');
    var listEl = document.getElementById('discussions-list');

    client.from('discussion_threads_feed').select('*').limit(100).then(function (result) {
      if (result.error) {
        statusEl.textContent = 'Could not load discussions right now — try refreshing.';
        return;
      }
      var rows = result.data || [];
      if (!rows.length) {
        statusEl.textContent = 'No discussions yet — be the first to start one.';
        return;
      }
      listEl.innerHTML = rows.map(renderThreadCard).join('');
      listEl.hidden = false;
      statusEl.hidden = true;
    }).catch(function () {
      statusEl.textContent = 'Could not load discussions right now — try refreshing.';
    });
  }

  function renderThreadCard(t) {
    var excerpt = t.body.length > 160 ? t.body.slice(0, 160) + '…' : t.body;
    return (
      '<a class="discussions-thread-card" href="?thread=' + encodeURIComponent(t.id) + '">' +
      '<div class="discussions-thread-card-top">' +
        '<span class="discussions-thread-title">' + escapeHTML(t.title) + '</span>' +
        '<span class="discussions-badge ' + (t.is_closed ? 'discussions-badge-closed' : 'discussions-badge-open') + '">' + (t.is_closed ? 'Closed' : 'Open') + '</span>' +
      '</div>' +
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
    var box = document.getElementById('discussions-new-thread');
    window.PapersAuth.getSession().then(function (session) {
      if (!session) {
        box.innerHTML = '<a class="papers-nav-btn papers-nav-next" href="' + nextURLFor('/discussions/') + '">Log in to start a discussion</a>';
        return;
      }
      box.innerHTML =
        '<form id="discussions-new-thread-form" class="discussions-form">' +
        '<input type="text" name="title" placeholder="Title" maxlength="140" required>' +
        '<textarea name="body" placeholder="What\'s on your mind?" maxlength="5000" rows="4" required></textarea>' +
        '<button type="submit" class="papers-nav-btn papers-nav-next">Start a discussion</button>' +
        '<div class="discussions-msg" id="discussions-new-thread-msg"></div>' +
        '</form>';

      var form = document.getElementById('discussions-new-thread-form');
      var msg = document.getElementById('discussions-new-thread-msg');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var title = form.title.value.trim();
        var body = form.body.value.trim();
        if (!title || !body) return;
        msg.textContent = 'Posting…';
        client.from('discussion_threads').insert({ title: title, body: body }).select('id').single().then(function (result) {
          if (result.error) {
            msg.textContent = result.error.message;
            return;
          }
          window.location.href = '?thread=' + encodeURIComponent(result.data.id);
        });
      });
    });
  }

  // ==================================================================
  // Detail view
  // ==================================================================
  function renderDetail(id) {
    var statusEl = document.getElementById('discussions-detail-status');
    var threadEl = document.getElementById('discussions-thread');
    var commentsEl = document.getElementById('discussions-comments');
    var formWrap = document.getElementById('discussions-comment-form-wrap');

    client.from('discussion_threads_feed').select('*').eq('id', id).single().then(function (result) {
      if (result.error || !result.data) {
        statusEl.textContent = "That discussion doesn't exist, or was removed.";
        return;
      }
      var t = result.data;
      statusEl.hidden = true;

      threadEl.innerHTML =
        '<h1 class="discussions-thread-heading">' + escapeHTML(t.title) +
        ' <span class="discussions-badge ' + (t.is_closed ? 'discussions-badge-closed' : 'discussions-badge-open') + '">' + (t.is_closed ? 'Closed' : 'Open') + '</span></h1>' +
        '<div class="discussions-thread-meta">' +
          window.PapersAuth.avatarHTML(t.display_name, t.avatar_url) +
          window.PapersAuth.flagHTML(t.country) +
          '<span>' + escapeHTML(t.display_name) + '</span>' +
          '<span class="discussions-meta-dot">·</span>' +
          '<span>' + formatDate(t.created_at) + '</span>' +
        '</div>' +
        '<p class="discussions-thread-body">' + escapeHTML(t.body) + '</p>';
      threadEl.hidden = false;

      loadComments(id);
      renderCommentForm(id, t.is_closed);
    }).catch(function () {
      statusEl.textContent = 'Could not load this discussion right now — try refreshing.';
    });
  }

  function loadComments(threadId) {
    var commentsEl = document.getElementById('discussions-comments');
    client.from('discussion_comments_feed').select('*').eq('thread_id', threadId).limit(500).then(function (result) {
      if (result.error) {
        commentsEl.innerHTML = '<p class="discussions-status">Could not load replies right now — try refreshing.</p>';
        commentsEl.hidden = false;
        return;
      }
      var rows = result.data || [];
      if (!rows.length) {
        commentsEl.innerHTML = '<p class="discussions-status">No replies yet.</p>';
      } else {
        commentsEl.innerHTML = rows.map(renderComment).join('');
      }
      commentsEl.hidden = false;
    });
  }

  function renderComment(c) {
    return (
      '<div class="discussions-comment">' +
      '<div class="discussions-thread-meta">' +
        window.PapersAuth.avatarHTML(c.display_name, c.avatar_url) +
        window.PapersAuth.flagHTML(c.country) +
        '<span>' + escapeHTML(c.display_name) + '</span>' +
        '<span class="discussions-meta-dot">·</span>' +
        '<span>' + formatDate(c.created_at) + '</span>' +
      '</div>' +
      '<p class="discussions-comment-body">' + escapeHTML(c.body) + '</p>' +
      '</div>'
    );
  }

  function renderCommentForm(threadId, isClosed) {
    var formWrap = document.getElementById('discussions-comment-form-wrap');
    if (isClosed) {
      formWrap.innerHTML = '<p class="discussions-status discussions-closed-note">This thread is closed — no new replies.</p>';
      return;
    }
    window.PapersAuth.getSession().then(function (session) {
      if (!session) {
        formWrap.innerHTML = '<a class="papers-nav-btn papers-nav-next" href="' + nextURLFor('/discussions/?thread=' + threadId) + '">Log in to reply</a>';
        return;
      }
      formWrap.innerHTML =
        '<form id="discussions-comment-form" class="discussions-form">' +
        '<textarea name="body" placeholder="Add a reply…" maxlength="3000" rows="3" required></textarea>' +
        '<button type="submit" class="papers-nav-btn papers-nav-next">Reply</button>' +
        '<div class="discussions-msg" id="discussions-comment-msg"></div>' +
        '</form>';

      var form = document.getElementById('discussions-comment-form');
      var msg = document.getElementById('discussions-comment-msg');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var body = form.body.value.trim();
        if (!body) return;
        msg.textContent = 'Posting…';
        client.from('discussion_comments').insert({ thread_id: threadId, body: body }).then(function (result) {
          if (result.error) {
            msg.textContent = result.error.message;
            return;
          }
          form.reset();
          msg.textContent = '';
          loadComments(threadId);
        });
      });
    });
  }
})();
