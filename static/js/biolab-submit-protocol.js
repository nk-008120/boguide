/* biolab-submit-protocol.js -- BiOLab: submit a new community protocol.
   Depends on: papers-auth.js (PapersAuth).

   created_by is NEVER sent by this client -- it relies entirely on
   biolab_practicals.created_by's `default auth.uid()` (set in migration
   017) plus the biolab_practicals_insert_own RLS with-check
   (created_by = auth.uid()). Verified end-to-end (not just read from the
   migration) in hidden-ex-features/biolab-rls-tests/test-submit.mjs,
   including that a devtools-forged created_by (null OR another user's id)
   is rejected by RLS even when the column is column-privilege-granted.

   The disclaimer checkbox is a UI nicety, not the real gate: acknowledged_
   disclaimer is enforced by biolab_practicals_disclaimer_check (migration
   017), which rejects any insert where it isn't exactly `true` -- verified
   in the same test file by simulating a bypassed/omitted checkbox via a
   direct insert.

   Workflow PDF attachments (migration 021, biolab_protocol_attachments)
   are a post-insert step, not part of the protocol insert itself --
   biolab_protocol_attachments_insert_own's RLS with-check requires the
   protocol row to already exist and belong to the caller, and the storage
   path convention is {protocol_id}/{filename}, so protocol_id has to be
   known first. uploaded_by is never sent by this client either, same
   pattern as created_by above -- it defaults via auth.uid() and has no
   column grant (verified in
   hidden-ex-features/biolab-rls-tests/test-multi-image-and-attachments.mjs). */
(function () {
  'use strict';

  var root = document.getElementById('biolab-submit-root');
  if (!root) return;

  // UI-layer caps only -- the real limits are the bucket's own
  // file_size_limit (10MB, matched here so users get instant feedback
  // instead of a round-trip rejection) and allowed_mime_types
  // (application/pdf only, migration 021). Nothing in the DB caps the
  // number of attachments per protocol; 5 is a reasonable UI ceiling, not
  // a site-owner decision worth blocking on.
  var MAX_ATTACHMENTS = 5;
  var MAX_ATTACHMENT_MB = 10;

  var statusEl = document.getElementById('biolab-submit-status');
  var form = document.getElementById('biolab-submit-form');

  function nextURLFor(path) {
    return '/account/?next=' + encodeURIComponent(path);
  }

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
    statusEl.textContent = "Protocol submission isn't configured on this environment yet.";
    return;
  }

  var client = window.PapersAuth.getClient();

  function slugify(title) {
    var base = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
    if (!base) base = 'protocol';
    var suffix = Math.random().toString(36).slice(2, 8);
    return base + '-' + suffix;
  }

  // Not airtight (a renamed non-PDF with a spoofed MIME type could slip
  // past both checks) -- the real boundary is the Storage bucket's own
  // allowed_mime_types=[application/pdf] enforcement server-side. This is
  // just a reasonable client-side guard so people get instant feedback
  // instead of a failed upload.
  function isLikelyPDF(file) {
    var nameOk = /\.pdf$/i.test(file.name);
    var typeOk = !file.type || file.type === 'application/pdf';
    return nameOk && typeOk;
  }

  window.PapersAuth.getSession().then(function (session) {
    if (!session) {
      statusEl.innerHTML = 'Log in to submit a protocol. <a href="' + nextURLFor('/biolab/submit/') + '">Log in</a>';
      return;
    }
    statusEl.hidden = true;
    form.hidden = false;

    var userId = session.user.id;
    var attachmentInput = document.getElementById('biolab-submit-attachments');
    var attachmentPreview = document.getElementById('biolab-submit-attachments-preview');
    var selectedAttachments = []; // File[]

    function renderAttachmentPreview() {
      if (!selectedAttachments.length) {
        attachmentPreview.hidden = true;
        attachmentPreview.innerHTML = '';
        return;
      }
      attachmentPreview.hidden = false;
      attachmentPreview.innerHTML = '<ul class="biolab-submit-attachment-list">' +
        selectedAttachments.map(function (file, i) {
          var sizeMB = (file.size / (1024 * 1024)).toFixed(1);
          return (
            '<li class="biolab-submit-attachment-item">' +
            '<span class="biolab-submit-attachment-name">📄 ' + file.name.replace(/</g, '&lt;') + '</span>' +
            '<span class="biolab-feedback-hint">' + sizeMB + ' MB</span>' +
            '<button type="button" class="biolab-archive-capture-remove" data-idx="' + i + '" aria-label="Remove this file">&times;</button>' +
            '</li>'
          );
        }).join('') +
        '</ul>';
      attachmentPreview.querySelectorAll('.biolab-archive-capture-remove').forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectedAttachments.splice(Number(btn.getAttribute('data-idx')), 1);
          renderAttachmentPreview();
        });
      });
    }

    attachmentInput.addEventListener('change', function () {
      var files = Array.prototype.slice.call(attachmentInput.files || []);
      attachmentInput.value = ''; // reset so the input can be reused to add more later
      if (!files.length) return;

      var rejected = [];
      var accepted = [];
      files.forEach(function (file) {
        if (!isLikelyPDF(file)) { rejected.push(file.name + ' (not a PDF)'); return; }
        if (file.size > MAX_ATTACHMENT_MB * 1024 * 1024) { rejected.push(file.name + ' (over ' + MAX_ATTACHMENT_MB + 'MB)'); return; }
        accepted.push(file);
      });

      var room = MAX_ATTACHMENTS - selectedAttachments.length;
      if (accepted.length > room) {
        rejected.push((accepted.length - room) + ' file(s) skipped -- ' + MAX_ATTACHMENTS + ' max');
        accepted = accepted.slice(0, room);
      }

      selectedAttachments = selectedAttachments.concat(accepted);
      renderAttachmentPreview();

      if (rejected.length) {
        var msg = document.getElementById('biolab-submit-msg');
        msg.textContent = 'Skipped: ' + rejected.join(', ');
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('biolab-submit-msg');

      var title = form.title.value.trim();
      var body = form.body.value.trim();
      var category = form.category.value;
      var description = form.description.value.trim();
      var sourceAttribution = form.source_attribution.value.trim();
      var ack = document.getElementById('biolab-submit-ack').checked;

      if (!title || !body || !category) return;
      if (!ack) {
        msg.textContent = 'Please read and agree to the disclaimer above before submitting.';
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      msg.textContent = 'Publishing…';

      var row = {
        slug: slugify(title),
        title: title,
        description: description || null,
        body: body,
        source_attribution: sourceAttribution || null,
        category: category,
        acknowledged_disclaimer: ack
        // created_by intentionally omitted -- see file header.
      };

      client.from('biolab_practicals').insert(row).select('id, slug').single().then(function (result) {
        if (result.error) {
          submitBtn.disabled = false;
          msg.textContent = result.error.message;
          return;
        }
        var protocolId = result.data.id;
        var slug = result.data.slug;

        if (!selectedAttachments.length) {
          window.location.href = '/biolab/archive/?protocol=' + encodeURIComponent(slug);
          return;
        }

        // Attachments are a best-effort post-insert step -- the protocol
        // itself already published successfully above, so an attachment
        // failure here shouldn't strand the user on a stuck form; we still
        // redirect to the new protocol either way.
        msg.textContent = 'Protocol published — uploading attachment' + (selectedAttachments.length > 1 ? 's' : '') + '…';

        Promise.all(selectedAttachments.map(function (file) {
          var filename = (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2))) + '.pdf';
          var path = protocolId + '/' + filename;
          return client.storage.from('biolab-protocol-attachments').upload(path, file, { contentType: 'application/pdf' }).then(function (uploadResult) {
            if (uploadResult.error) throw uploadResult.error;
            // uploaded_by intentionally omitted -- see file header.
            return client.from('biolab_protocol_attachments').insert({
              protocol_id: protocolId,
              file_path: path,
              file_name: file.name
            });
          });
        })).catch(function () {
          // Swallow per-file errors here -- the protocol is already live
          // regardless, and there's no form left to show a retry UI in
          // once we've navigated away. Silent partial failure is an
          // acceptable trade-off for a best-effort add-on to an already-
          // successful submission, not a silent failure of the submission
          // itself.
        }).then(function () {
          window.location.href = '/biolab/archive/?protocol=' + encodeURIComponent(slug);
        });
      });
    });
  });
})();
