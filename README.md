# YAKIT TAKİP

Şoför ekranı, yönetici paneli ve fiş okuma. Veri tabanı Google E-Tablo'da, işlemler Google Apps Script'te çalışır.

## Klasör
- `index.html` : şoför ekranı (PIN girişi, çevrimdışı kayıt, fiş fotoğrafı, telefona kurulum)
- `yonetici.html` : yönetici paneli (raporlar, şoförler, araçlar, kayıtlar, ayarlar)
- `config.js` : Apps Script /exec adresi
- `sw.js` : internet yokken uygulamanın açılması. Dosyaları değiştirirseniz `SURUM` değerini artırın.
- `api.js`, `*.webmanifest`, `icon-*.png` : bağlantı katmanı ve uygulama simgesi
- `apps-script/` : Google tarafına yapıştırılacak dosyalar (Code.gs, Admin.gs, Fis.gs, Ikon.gs, Index.html, Admin.html, appsscript.json)

## Kurulum (güncelleme)
1. E-Tablo > Uzantılar > Apps Script. `apps-script/` içindeki her dosyayı aynı adla yapıştırın (yeni dosya: `Fis`, `Code`, `Admin`, `Ikon`; HTML: `Index`, `Admin`). Eski/uyumsuz dosyaları silin.
2. Çalıştır > `kur` (bir kez), menüden "Yönetici şifresi belirle".
3. Dağıt > Dağıtımları yönet > düzenle (kalem) > Sürüm: **Yeni sürüm** > Dağıt. Böylece /exec adresi değişmez.
4. Bu klasörün içindekileri GitHub deponuza yükleyin (eskilerin üzerine yazın). `config.js` içindeki adres sizin dağıtımınızınki olmalı.
5. Yönetici paneli > Ayarlar > "Fiş okuma": Gemini anahtarını (aistudio.google.com) yapıştırın, açın, "Bağlantıyı dene".
6. Telefonlarda uygulamayı bir kez açıp yenileyin (yeni sürüm yüklensin).

## Fiş
Şoför "📷 Fiş fotoğrafı çek" der; fotoğraf küçültülür, Gemini tarih/litre/tutar/istasyonu okur ve forma yazar (mavi alanlar). Şoför kontrol eder, KM'yi girer, Kaydet'e basar. Değerler onaysız kaydedilmez. Fotoğraf `Yakit Raporlari/_fisler/PLAKA/` klasörüne kaydedilir, bağlantısı Kayıtlar sayfasının K sütununa ve Excel raporlarındaki "Fiş" sütununa yazılır. İnternet yokken fotoğraf kayıtla birlikte telefonda bekler.
