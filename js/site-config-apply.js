// Keeps the map links and Hijri dates in sync with js/config.js,
// so those details can be edited in one place.
(function () {
  'use strict';
  var C = window.WEDDING_CONFIG || {};

  var map = C.map || {};
  if (map.mapsUrl) {
    ['map-link', 'footer-map-link'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = map.mapsUrl;
    });
  }
  if (map.directionsUrl) {
    var dirEl = document.getElementById('directions-link');
    if (dirEl) dirEl.href = map.directionsUrl;
  }
  if (map.embedUrl) {
    var frame = document.getElementById('map-frame');
    if (frame) frame.src = map.embedUrl;
  }

  var ev = C.events || {};
  document.querySelectorAll('[data-hijri]').forEach(function (el) {
    var e = ev[el.getAttribute('data-hijri')];
    if (e && e.hijri) el.textContent = e.hijri;
  });
})();
