// ===== WISHES WALL =====
// Shared via Firebase Realtime Database when js/config.js -> firebase is filled in;
// otherwise falls back to this browser's localStorage (visible only on this device).
(function () {
  'use strict';

  var CFG   = window.WEDDING_CONFIG || {};
  var FB    = CFG.firebase || {};
  var form  = document.getElementById('wishesForm');
  var box   = document.getElementById('wishesDisplay');
  var list  = document.getElementById('wishesList');
  var count = document.getElementById('wishesCount');
  var note  = document.getElementById('wishesNote');
  var moreC = document.getElementById('viewMoreContainer');
  var moreB = document.getElementById('viewMoreBtn');
  if (!form || !box || !list) return;

  var LIMIT = 5, showAll = false, wishes = [];
  var STORE_KEY = 'roshan-safa-wishes';
  var db = null;

  // ---- storage backend ----
  if (FB.apiKey && FB.databaseURL && typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length) firebase.initializeApp(FB);
      db = firebase.database();
    } catch (e) { console.warn('Firebase init failed, using local fallback', e); db = null; }
  }
  var shared = !!db;

  function localLoad() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch (e) { return []; }
  }
  function localSave(arr) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); return true; } catch (e) { return false; }
  }

  // ---- admin mode (?admin=1 + password) ----
  var isAdmin = false;
  (function () {
    if (new URLSearchParams(location.search).get('admin') !== '1') return;
    try { if (sessionStorage.getItem('wishesAdmin') === '1') { isAdmin = true; return; } } catch (e) {}
    var pw = (CFG.wishes || {}).adminPassword;
    if (!pw) return;
    var entered = window.prompt('Admin password:');
    if (entered === pw) { isAdmin = true; try { sessionStorage.setItem('wishesAdmin', '1'); } catch (e) {} }
    else if (entered !== null) alert('Incorrect password.');
  })();
  if (isAdmin) { var badge = document.getElementById('wishesAdminBadge'); if (badge) badge.style.display = 'inline-flex'; }

  // ---- helpers ----
  var MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  function fmt(ts) {
    var d = new Date(ts), h = d.getHours(), m = d.getMinutes();
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' AT ' + (h % 12 || 12) + ':' + (m < 10 ? '0' + m : m) + ' ' + (h >= 12 ? 'PM' : 'AM');
  }
  var COLORS = ['#8B4513', '#C9385C', '#8F6608', '#3D6B99', '#9C2F52'];
  function say(msg, ok) { note.textContent = msg; note.className = 'wishes-note ' + (ok ? 'ok' : 'err'); }

  function node(w) {
    var el = document.createElement('div');
    el.className = 'wish-item aos-animate';

    var av = document.createElement('div');
    av.className = 'wish-avatar';
    av.style.background = COLORS[(w.name.charCodeAt(0) || 0) % COLORS.length];
    var sp = document.createElement('span'); sp.textContent = w.name.charAt(0).toUpperCase(); av.appendChild(sp);

    var c = document.createElement('div'); c.className = 'wish-content';
    var a = document.createElement('div'); a.className = 'wish-author';  a.textContent = w.name;
    var m = document.createElement('div'); m.className = 'wish-message'; m.textContent = w.message;
    var t = document.createElement('div'); t.className = 'wish-time';    t.textContent = fmt(w.timestamp);
    c.appendChild(a); c.appendChild(m); c.appendChild(t);
    el.appendChild(av); el.appendChild(c);

    if (isAdmin && w.id) {
      var del = document.createElement('button');
      del.type = 'button'; del.className = 'wish-delete-btn'; del.setAttribute('aria-label', 'Delete this wish');
      del.innerHTML = '<i class="fas fa-trash-alt"></i>';
      del.addEventListener('click', function () {
        if (!window.confirm('Delete the wish from "' + w.name + '"?')) return;
        if (shared) {
          db.ref('wishes/' + w.id).remove(function (err) { if (err) alert('Could not delete: ' + err.message); });
        } else {
          wishes = wishes.filter(function (x) { return x.id !== w.id; });
          localSave(wishes); render();
        }
      });
      el.appendChild(del);
    }
    return el;
  }

  function render() {
    list.innerHTML = '';
    if (!wishes.length) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    count.textContent = wishes.length;
    wishes.slice(0, showAll ? wishes.length : LIMIT).forEach(function (w) { list.appendChild(node(w)); });
    moreC.style.display = (!showAll && wishes.length > LIMIT) ? 'block' : 'none';
  }

  // ---- load ----
  if (shared) {
    db.ref('wishes').limitToLast(200).on('value', function (snap) {
      var data = snap.val() || {};
      wishes = Object.keys(data).map(function (k) { var w = data[k]; w.id = k; return w; })
        .filter(function (w) { return w && typeof w.name === 'string' && typeof w.message === 'string'; })
        .sort(function (a, b) { return b.timestamp - a.timestamp; });
      render();
    });
  } else {
    wishes = localLoad().sort(function (a, b) { return b.timestamp - a.timestamp; });
    render();
  }

  if (moreB) moreB.addEventListener('click', function () { showAll = true; render(); });

  // ---- submit ----
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameEl = document.getElementById('wishesName');
    var msgEl  = document.getElementById('wishesMessage');
    var name = nameEl.value.trim(), message = msgEl.value.trim();

    if (!name || !message) { say('Please enter your name and a message.', false); return; }
    if (message.length > 500) { say('Please keep your message under 500 characters.', false); return; }

    var wish = { name: name.slice(0, 60), message: message, timestamp: Date.now() };
    var btn = form.querySelector('.wishes-submit-btn'), orig = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';

    function done(ok) {
      btn.disabled = false; btn.innerHTML = orig;
      if (!ok) { say('Could not save your wish. Please check your connection and try again.', false); return; }
      nameEl.value = ''; msgEl.value = '';
      say(shared ? 'Jazakallah Khair! Your wish has been added.' : 'Your wish was saved on this device only (shared wall not connected yet).', true);
    }

    if (shared) {
      db.ref('wishes').push().set(wish, function (err) { done(!err); });
    } else {
      wish.id = 'l' + wish.timestamp;
      wishes.unshift(wish);
      var ok = localSave(wishes);
      render(); done(ok);
    }
  });
})();
