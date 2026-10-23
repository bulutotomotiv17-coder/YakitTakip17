/**
 * Apps Script'teki google.script.run çağrılarını internet üzerinden yapan katman.
 * Sayfalardaki google.script.run.withSuccessHandler(...).withFailureHandler(...).islem(...) kodu aynen çalışır.
 */
(function () {
  var ADRES = String(window.YAKIT_API || '');

  function cagri(fn, args, ok, hata) {
    var bitti = false;
    function basari(d) { if (bitti) return; bitti = true; if (ok) ok(d); }
    function basarisiz(m) { if (bitti) return; bitti = true; if (hata) hata({ message: m }); }

    if (!ADRES || /^BURAYA/.test(ADRES)) { setTimeout(function () { basarisiz('Sunucu adresi ayarlanmamış (config.js).'); }, 0); return; }
    if (navigator.onLine === false) { setTimeout(function () { basarisiz('İnternet bağlantısı yok.'); }, 0); return; }

    var ctl = window.AbortController ? new AbortController() : null;
    var zt = setTimeout(function () { if (ctl) ctl.abort(); basarisiz('Sunucu yanıt vermedi.'); }, 300000);

    fetch(ADRES, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },   // basit istek: tarayıcı ön kontrol (CORS preflight) yapmaz
      body: JSON.stringify({ fn: fn, args: args }),
      redirect: 'follow',
      signal: ctl ? ctl.signal : undefined
    }).then(function (r) { return r.text(); })
      .then(function (t) {
        clearTimeout(zt);
        var j;
        try { j = JSON.parse(t); } catch (e) { return basarisiz('Sunucudan geçersiz yanıt geldi.'); }
        if (j && j.ok) basari(j.data); else basarisiz((j && j.hata) || 'Bilinmeyen hata.');
      })
      .catch(function () { clearTimeout(zt); basarisiz('Bağlantı kurulamadı.'); });
  }

  function insa(ok, hata) {
    return new Proxy({}, {
      get: function (_, ad) {
        if (typeof ad !== 'string') return undefined;
        if (ad === 'withSuccessHandler') return function (f) { return insa(f, hata); };
        if (ad === 'withFailureHandler') return function (f) { return insa(ok, f); };
        return function () { cagri(ad, Array.prototype.slice.call(arguments), ok, hata); };
      }
    });
  }

  window.google = { script: { run: insa(null, null) } };
})();
