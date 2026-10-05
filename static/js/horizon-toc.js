(function () {
  'use strict';

  var toc = document.getElementById('fr-toc');
  if (!toc) return;

  var article = document.querySelector('.fr-article');
  var bar = document.getElementById('fr-toc-bar');
  var desktop = window.matchMedia('(min-width: 1180px)');
  var OFFSET = 130;

  var items = [].slice.call(toc.querySelectorAll('a[href^="#"]'))
    .filter(function (a) { return !a.classList.contains('fr-toc-top'); })
    .map(function (a) {
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      return { link: a, target: document.getElementById(id) };
    })
    .filter(function (item) { return item.target; });

  items.forEach(function (item) {
    var story = item.target.closest('.fr-story');
    if (!story) return;
    var num = story.querySelector('.fr-story-num');
    if (!num) return;
    var badge = document.createElement('span');
    badge.className = 'fr-toc-num';
    badge.textContent = num.textContent;
    var accent = getComputedStyle(story).getPropertyValue('--accent');
    if (accent) badge.style.setProperty('--badge', accent.trim());
    item.link.insertBefore(badge, item.link.firstChild);
    item.link.classList.add('is-story');
  });

  var lab = document.querySelector('.fr-lab[id]');
  if (lab) {
    var host = items.filter(function (item) {
      var story = item.target.closest('.fr-story');
      return story && story.contains(lab);
    })[0];
    if (host) {
      var parentLi = host.link.closest('li');
      var sub = document.createElement('ul');
      var li = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + lab.id;
      link.className = 'fr-toc-sub';
      link.textContent = lab.getAttribute('data-toc-label') || 'Try the noise lab';
      li.appendChild(link);
      sub.appendChild(li);
      parentLi.appendChild(sub);
      items.splice(items.indexOf(host) + 1, 0, { link: link, target: lab });
    }
  }

  function syncOpen() {
    toc.open = desktop.matches;
  }
  syncOpen();
  if (desktop.addEventListener) desktop.addEventListener('change', syncOpen);

  items.forEach(function (item) {
    item.link.addEventListener('click', function () {
      if (!desktop.matches) toc.open = false;
    });
  });

  var current = null;
  var queued = false;

  function setActive(item) {
    if (item === current) return;
    if (current) {
      current.link.classList.remove('is-active');
      current.link.removeAttribute('aria-current');
    }
    current = item;
    if (!item) return;
    item.link.classList.add('is-active');
    item.link.setAttribute('aria-current', 'location');
    if (desktop.matches) {
      var holder = toc.querySelector('.fr-toc-inner');
      var top = item.link.offsetTop;
      if (top < holder.scrollTop || top > holder.scrollTop + holder.clientHeight - 60) {
        holder.scrollTo({ top: Math.max(0, top - 80) });
      }
    }
  }

  function update() {
    queued = false;
    var active = items[0];
    for (var i = 0; i < items.length; i++) {
      if (items[i].target.getBoundingClientRect().top <= OFFSET) active = items[i];
    }
    setActive(active);
    if (bar && article) {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var done = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      bar.style.width = (done * 100).toFixed(1) + '%';
    }
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
