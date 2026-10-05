(function () {
  'use strict';

  var terms = document.querySelectorAll('.fr-term');
  if (!terms.length) return;

  var pop = null;
  var current = null;
  var pinned = false;
  var openTimer = 0;
  var closeTimer = 0;
  var lastPointer = 'mouse';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function makePop() {
    pop = el('div', 'fr-pop');
    pop.setAttribute('role', 'dialog');
    pop.tabIndex = -1;
    document.body.appendChild(pop);
    pop.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse') clearTimeout(closeTimer);
    });
    pop.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse' && !pinned) scheduleClose(260);
    });
  }

  function fill(term) {
    pop.textContent = '';
    pop.appendChild(el('span', 'fr-pop-tag', 'Quick definition'));
    pop.appendChild(el('p', 'fr-pop-name', term.getAttribute('data-name')));
    pop.appendChild(el('p', 'fr-pop-def', term.getAttribute('data-def')));
    var wiki = term.getAttribute('data-wiki');
    var note = term.getAttribute('data-note');
    if (wiki || note) {
      var row = el('div', 'fr-pop-links');
      if (wiki) {
        var w = el('a', 'fr-pop-btn', 'Wikipedia ↗');
        w.href = wiki;
        w.target = '_blank';
        w.rel = 'noopener';
        row.appendChild(w);
      }
      if (note) {
        var n = el('a', 'fr-pop-btn fr-pop-btn-note', term.getAttribute('data-note-label') || 'In your notes');
        n.href = note;
        row.appendChild(n);
      }
      pop.appendChild(row);
    }
    pop.setAttribute('aria-label', term.getAttribute('data-name'));
  }

  function place(term) {
    var rects = term.getClientRects();
    var r = rects.length ? rects[0] : term.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var w = pop.offsetWidth;
    var h = pop.offsetHeight;
    var top;
    if (r.bottom + 10 + h > vh && r.top - 10 - h > 0) {
      top = r.top - 10 - h;
      pop.setAttribute('data-side', 'top');
    } else {
      top = r.bottom + 10;
      pop.setAttribute('data-side', 'bottom');
    }
    var left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), vw - w - 12);
    pop.style.left = left + window.pageXOffset + 'px';
    pop.style.top = top + window.pageYOffset + 'px';
  }

  function open(term, pin) {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    if (!pop) makePop();
    if (current && current !== term) {
      current.classList.remove('is-active');
      current.setAttribute('aria-expanded', 'false');
    }
    current = term;
    pinned = !!pin;
    fill(term);
    place(term);
    pop.classList.add('is-open');
    term.classList.add('is-active');
    term.setAttribute('aria-expanded', 'true');
  }

  function close() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    if (!pop || !current) return;
    pop.classList.remove('is-open');
    current.classList.remove('is-active');
    current.setAttribute('aria-expanded', 'false');
    current = null;
    pinned = false;
  }

  function scheduleClose(ms) {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, ms);
  }

  function isOpenFor(term) {
    return pop && pop.classList.contains('is-open') && current === term;
  }

  Array.prototype.forEach.call(terms, function (term) {
    term.removeAttribute('title');

    term.addEventListener('pointerdown', function (e) {
      lastPointer = e.pointerType || 'mouse';
    });

    term.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
      openTimer = setTimeout(function () {
        open(term, false);
      }, 130);
    });

    term.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(openTimer);
      if (!pinned) scheduleClose(260);
    });

    term.addEventListener('click', function () {
      if (lastPointer === 'mouse') {
        open(term, true);
      } else if (isOpenFor(term)) {
        close();
      } else {
        open(term, true);
      }
    });

    term.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(term, true);
        var first = pop.querySelector('a');
        (first || pop).focus();
      }
    });

    term.addEventListener('focus', function () {
      if (term.matches(':focus-visible')) open(term, false);
    });

    term.addEventListener('blur', function () {
      if (pinned) return;
      scheduleClose(180);
    });
  });

  document.addEventListener('pointerdown', function (e) {
    if (!pop || !current) return;
    if (pop.contains(e.target) || current.contains(e.target)) return;
    close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !current) return;
    var back = current;
    var inside = pop && pop.contains(document.activeElement);
    close();
    if (inside) back.focus();
  });

  window.addEventListener('resize', close);
})();
