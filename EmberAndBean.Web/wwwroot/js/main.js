/* Ember & Bean Coffee House — demo interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var WHATSAPP_NUMBER = '27000000000';            // placeholder: international format, no +
  var EMAIL = 'hello@emberandbean.example';       // placeholder

  // Header background on scroll
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
    if (open) header.classList.add('scrolled'); else onScroll();
  }
  toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  // Active nav link while scrolling
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = document.querySelector(l.getAttribute('href')); if (s) spy.observe(s); });

    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rev.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { rev.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Accessible menu tabs (arrow keys supported)
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') n = tabs[0];
      if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  // Open / closed status (South Africa time, UTC+2)
  var HOURS = { 0: [8, 0, 13, 0], 1: [6, 30, 16, 30], 2: [6, 30, 16, 30], 3: [6, 30, 16, 30], 4: [6, 30, 16, 30], 5: [6, 30, 16, 30], 6: [7, 30, 15, 0] };
  var now = new Date(Date.now() + (new Date().getTimezoneOffset() + 120) * 60000);
  var day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes(), h = HOURS[day];
  var openM = h[0] * 60 + h[1], closeM = h[2] * 60 + h[3];
  var pill = document.getElementById('open-status');
  function fmt(hh, mm) { return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0'); }
  if (pill) {
    if (mins >= openM && mins < closeM) { pill.textContent = 'Open now \u00b7 until ' + fmt(h[2], h[3]); }
    else { pill.textContent = mins < openM ? 'Opens today at ' + fmt(h[0], h[1]) : 'Closed \u00b7 see you tomorrow'; pill.classList.add('closed'); }
  }
  document.querySelectorAll('.hours tr[data-days]').forEach(function (tr) {
    if (tr.getAttribute('data-days').split(',').indexOf(String(day)) > -1) tr.classList.add('today');
  });

  // Gallery lightbox
  var lb = document.getElementById('lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lightbox-caption');
    document.querySelectorAll('.g-item').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        lbImg.src = a.getAttribute('href');
        lbImg.alt = a.querySelector('img').alt;
        lbCap.textContent = a.getAttribute('data-caption') || '';
        lb.showModal();
      });
    });
    lb.querySelector('.lightbox-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  // Enquiry form -> WhatsApp or email (no backend)
  var form = document.getElementById('enquiry-form');
  var err = document.getElementById('form-error');
  var dateInput = document.getElementById('f-date');
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  dateInput.min = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

  var channel = 'whatsapp';
  form.querySelectorAll('button[data-channel]').forEach(function (b) {
    b.addEventListener('click', function () { channel = b.getAttribute('data-channel'); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var required = ['f-name', 'f-phone', 'f-date', 'f-time'];
    var missing = [];
    required.forEach(function (id) {
      var el = document.getElementById(id);
      var bad = !el.value.trim();
      el.setAttribute('aria-invalid', String(bad));
      if (bad) missing.push(form.querySelector('label[for="' + id + '"]').textContent.trim());
    });
    if (missing.length) {
      err.textContent = 'Please fill in: ' + missing.join(', ') + '.';
      err.hidden = false;
      document.getElementById(required.filter(function (id) { return !document.getElementById(id).value.trim(); })[0]).focus();
      return;
    }
    err.hidden = true;
    var d = new FormData(form);
    var lines = [
      'Hi Ember & Bean! New enquiry from the website:',
      '',
      'Request: ' + d.get('type'),
      'Name: ' + d.get('name'),
      'Phone: ' + d.get('phone'),
      'Date: ' + d.get('date') + ' at ' + d.get('time'),
      'Guests: ' + (d.get('guests') || '-')
    ];
    if (d.get('message')) lines.push('Message: ' + d.get('message'));
    var text = lines.join('\n');
    if (channel === 'email') {
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(d.get('type') + ' - ' + d.get('name')) + '&body=' + encodeURIComponent(text);
    } else {
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    }
  });

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
