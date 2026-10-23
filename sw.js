/**
 * Servis çalışanı: uygulama dosyalarını telefona kaydeder, böylece internet yokken de açılır.
 * Dosyaları güncellerseniz SURUM değerini bir artırın (yakit-v2, yakit-v3...).
 */
var SURUM = 'yakit-v4';
var DOSYALAR = ['./', 'index.html', 'yonetici.html', 'api.js', 'config.js',
  'manifest.webmanifest', 'yonetici.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(SURUM).then(function (c) {
      return Promise.all(DOSYALAR.map(function (d) {
        return c.add(new Request(d, { cache: 'reload' })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (adlar) {
      return Promise.all(adlar.filter(function (a) { return a !== SURUM; }).map(function (a) { return caches.delete(a); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function zamanAsimli(p, ms) {
  return new Promise(function (coz, red) {
    var z = setTimeout(function () { red(new Error('zaman aşımı')); }, ms);
    p.then(function (x) { clearTimeout(z); coz(x); }, function (er) { clearTimeout(z); red(er); });
  });
}

// Sayfa ve betikler: internet varsa en güncelini al (4 sn içinde gelmezse kayıtlıyı kullan)
function agOnce(r) {
  return zamanAsimli(fetch(r), 4000).then(function (res) {
    if (res && res.ok) {
      var kopya = res.clone();
      caches.open(SURUM).then(function (c) { c.put(r, kopya); });
    }
    return res;
  }).catch(function () {
    return caches.match(r, { ignoreSearch: true }).then(function (m) {
      if (m) return m;
      if (r.mode === 'navigate') return caches.match('index.html');
      return Response.error();
    });
  });
}

// Simgeler vb.: önce kayıtlı olan
function onbellekOnce(r) {
  return caches.match(r).then(function (m) {
    return m || fetch(r).then(function (res) {
      if (res && res.ok) { var k = res.clone(); caches.open(SURUM).then(function (c) { c.put(r, k); }); }
      return res;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var u = new URL(r.url);
  if (u.origin !== self.location.origin) return;     // Apps Script çağrılarına karışmaz
  var dinamik = r.mode === 'navigate' || /\.(html|js|webmanifest)$/.test(u.pathname) || u.pathname.slice(-1) === '/';
  e.respondWith(dinamik ? agOnce(r) : onbellekOnce(r));
});
