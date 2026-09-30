/**
 * ============================================================
 *  WEDDING CONFIGURATION — BADUSHA ROSHAN & FATHIMATHUL SAFA
 *  Edit this file to update dates, contacts, map and wishes-wall settings.
 * ============================================================
 */
window.WEDDING_CONFIG = {

  /* ── COUPLE (groom is always listed first) ───────────────── */
  groom: {
    firstName: 'Roshan',
    fullName:  'Badusha Roshan',
    parents:   'Mr. Basheer & Mrs. Sajitha',
    home:      "'Saras', Chudangapoyil, Kadirur",
  },
  bride: {
    firstName: 'Safa',
    fullName:  'Fathimathul Safa',
    parents:   'Mr. Thaslim P.V. & Mrs. Suhara C.K.',
    // NOTE: kept exactly as supplied. "Youth" looks unusual for an address —
    // please confirm it (it may be a typo for a place name) and edit here AND in index.html.
    home:      "'Baithul Hamd', Muzhappilangad, Youth",
  },

  /* ── DATES ──────────────────────────────────────────────────
     Hijri dates follow the Umm al-Qura calendar. They can differ by a
     day with local moon-sighting, so edit them here if needed
     (and in the matching text in index.html).                         */
  events: {
    nikkah: {
      gregorian: 'Friday, 23 October 2026',
      hijri:     '12 Jumada al-Awwal 1448 AH',
      time:      'After Asr Prayer',
      venue:     "The Groom's Residence",
      address:   "'Saras', Chudangapoyil, Kadirur",
    },
    marriage: {
      gregorian: 'Saturday, 24 October 2026',
      hijri:     '13 Jumada al-Awwal 1448 AH',
      time:      '',   // add when confirmed
      venue:     '',   // add when confirmed
    },
  },

  /* ── COUNTDOWN ──────────────────────────────────────────────
     "After Asr" has no fixed clock time, so the countdown targets
     an approximate 3:30 PM IST on the Nikkah day. Adjust as needed. */
  countdown: {
    nikkah: {
      label:  'Nikkah — After Asr Prayer',
      target: '2026-10-23T15:30:00+05:30',
    },
  },

  /* ── MAP ────────────────────────────────────────────────────
     Nikkah venue coordinates: 11°46'37.5"N 75°32'38.9"E             */
  map: {
    query:         '11°46\'37.5"N 75°32\'38.9"E',
    coordinates:   '11°46\'37.5"N 75°32\'38.9"E',
    mapsUrl:       'https://www.google.com/maps/search/?api=1&query=11%C2%B046%2737.5%22N+75%C2%B032%2738.9%22E',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=11%C2%B046%2737.5%22N+75%C2%B032%2738.9%22E',
    embedUrl:      'https://maps.google.com/maps?q=11.777083,75.544139&z=16&output=embed',
  },

  /* ── WISHES WALL ────────────────────────────────────────────
     Two modes:
     1) SHARED (recommended): create a free Firebase Realtime Database and
        paste its web-app config below. Then every guest sees every wish.
     2) NOT CONFIGURED: wishes are saved only in the visitor's own browser —
        fine for testing, but other guests will NOT see them.
     Leave `apiKey` as '' to stay in mode 2.                              */
  firebase: {
    apiKey:      '',
    authDomain:  '',
    databaseURL: '',
    projectId:   '',
    appId:       '',
  },
  wishes: {
    // Moderation: open the site with ?admin=1 and enter this password to
    // show delete buttons. CHANGE IT. (It sits in public page code, so it is a
    // convenience, not real security — also lock down your Firebase rules.)
    adminPassword: 'change-me-before-sharing',
  },

  /* ── MUSIC ──────────────────────────────────────────────── */
  music: {
    src:    'assets/music.mp3',
    volume: 0.45,
  },
};
