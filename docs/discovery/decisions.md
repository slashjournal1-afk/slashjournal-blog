# LOG KEPUTUSAN — Discovery `CATATAN SEJARAH`

> ## ⚠️ 2026-08-17 — ARAH BERUBAH KE BLOG PRIBADI
>
> Proyek bukan lagi portal berita. **Seluruh isi di bawah ini adalah log keputusan portal berita** dan
> disimpan utuh sebagai catatan sejarah — jangan dihapus, karena sebagian besar alasan teknisnya masih
> berlaku dan menghemat pekerjaan menanyakan ulang. Nilai file ini sekarang ada di **alasan** tiap
> keputusan, bukan di statusnya.
>
> **Sumber kebenaran sekarang `decisions-blog.md`**, tempat setiap keputusan di bawah sudah diberi
> penanda `BERLAKU` / `BERUBAH` / `BATAL`. Kalau file ini bertentangan dengannya, `decisions-blog.md`
> yang benar.
>
> Yang perlu diketahui saat membaca file ini: **M1 (AdSense + Google Ad Manager) dan seluruh keputusan
> komentar di K4 tetap berlaku** — dikonfirmasi ulang oleh user saat pivot. Yang batal adalah bagian
> pers-nya: Google News, news sitemap, live blog, breaking news, cakupan nasional, dan kewajiban UU Pers
> serta Pedoman Pemberitaan Media Siber. **B7 (perorangan) tetap berlaku**, termasuk konsekuensinya bahwa
> tanggung jawab hukum atas isi dan komentar menempel ke pribadi.

Format: kode pertanyaan · jawaban · tanggal · catatan. `ASUMSI` = saya yang menentukan karena user
menjawab "rekomendasi", boleh digugat kapan saja. `REVISI` = jawaban yang berubah setelah dibahas;
konsekuensi lama dibatalkan dan pembatalannya dicatat.

---

## Batch 1 — jawaban yang sudah masuk

| Kode | Pertanyaan | Jawaban | Tanggal |
| --- | --- | --- | --- |
| **B1** | Nama portal | **Belum ada — pakai placeholder** | 2026-08-16 |
| **B2** | Cakupan geografis | **C — Nasional, wilayah jadi satu kategori biasa** | 2026-08-16 |
| **B2b** | Kategori masuk URL? | **URL netral** — tanpa kategori, tanpa tanggal | 2026-08-16 |
| **B3** | Positioning *(sebagian)* | **Berita umum lintas kanal, bukan niche** | 2026-08-16 |
| **B4** | Gratis atau premium | **A — Gratis penuh, selamanya** | 2026-08-16 |
| **B6** | Ukuran tim redaksi | **1 orang (solo)** | 2026-08-16 |
| **B7** | Badan hukum | **Perorangan dulu** | 2026-08-16 |
| **B8** | Plafon biaya infrastruktur | **Di bawah Rp 500 ribu / bulan** | 2026-08-16 |
| **A3** | Target traffic 12 bulan | **Di bawah 50.000 pageview/bulan** | 2026-08-16 |
| **C1** | Volume terbit per hari | **A — 1–5 artikel/hari** (rencana pakai ujung bawah, lihat K5) | 2026-08-16 |
| **C2** | Format wajib saat launch | **Longform/liputan khusus + galeri foto + live blog** | 2026-08-16 |
| **C3** | Video | **Embed YouTube saja** | 2026-08-16 |
| **C6** | Kedalaman taxonomy | **Kategori + tag bebas + halaman topik** (tanpa subkategori) | 2026-08-16 |
| **K6** | Cakupan live blog | **Versi hemat, dibangun setelah launch** | 2026-08-16 |
| **M1** | Model iklan | **B — AdSense + Google Ad Manager** | 2026-08-16 |
| **U1** | Akun pembaca | `REVISI` **Akun wajib, tapi hanya untuk komentar** — semula A | 2026-08-16 |
| **U1b** | Cara login pembaca | `REVISI` **Tautan sekali pakai ke email, tanpa password** — semula email+password | 2026-08-16 |
| **A4** | Google News & Discover | **Kejar ketiganya** — pencarian biasa + News + Discover | 2026-08-16 |
| **A1** | Profil pembaca | **Muda 18–30, akrab media sosial** | 2026-08-16 |
| **B5** | Migrasi konten lama | **Tidak ada — mulai dari nol** | 2026-08-16 |
| **BR2** | Tone editorial | **Penjelas dan analitis** | 2026-08-16 |
| **BR3** | Arah visual | **Modern bersih — sans-serif, geometris** | 2026-08-16 |
| **C4** | Sumber foto | **Foto sendiri + stok gratis + ilustrasi AI berlabel** | 2026-08-16 |
| **M5** | Advertorial | **Diterima, berlabel jelas, di luar feed berita** | 2026-08-16 |
| **(14)** | Komentar | **Wajib login · hanya di artikel yang dibuka editor · ditahan sampai disetujui** | 2026-08-16 |

**Sisa 17 pertanyaan (B2c, B9, A2, A5, A6, BR1, BR4, BR5, C5, C9, C10, M2, M3, M4, M6, M7, M8):**
diisi rekomendasi di `batch-01-sisa-asumsi.md` dan **diterima tanpa koreksi pada 2026-08-16** lewat
instruksi "lanjutkan". Tetap ditandai `ASUMSI` — diterima sebagai satu paket, bukan dikonfirmasi butir
demi butir, jadi menggugatnya nanti tidak dianggap perubahan lingkup.
**Tidak berlaku:** C7 (daftar wilayah) — dibatalkan oleh B2=C. C8 terjawab otomatis oleh B6=1.
**Terhalang B1:** B9 (domain) dan BR1 (logo) — bentuknya sudah diputuskan, isinya menunggu nama.

---

## ✅ BATCH 1 SELESAI — 2026-08-16

Sebelas blocker terjawab, 15 pertanyaan lain terjawab langsung, 17 sisanya diterima sebagai `ASUMSI`.
Tidak ada lagi pertanyaan Batch 1 yang menahan pekerjaan berikutnya. Lanjut ke **Batch 2 — Editorial,
User, CMS, Security** (`batch-02-editorial-user-cms-security.md`).

Tiga konflik ditutup sebagai **risiko yang disadari**, bukan masalah yang hilang: K3 (tidak ada
pendapatan iklan di bulan-bulan awal), K5 (volume realistis 1–2 artikel/hari, bukan 5), K8 (bentuk
longform penjelas). Ketiganya diterima lewat "lanjutkan" tanpa koreksi. Kalau salah satunya ternyata
tidak sesuai maksud, itu perlu dibuka lagi **sebelum** Phase 6 (UI publik) untuk K8, dan sebelum
Phase 12 (roadmap) untuk K3 dan K5.

---

## `REVISI` U1 berubah dari A ke B — akun ada, tapi terbatas

Jawaban awal U1=A ("tidak perlu akun sama sekali") **dibatalkan**. Keputusan barunya: pembaca harus
registrasi dan login **kalau ingin berkomentar**, dan hanya untuk itu. Membaca artikel tetap tanpa
login. Setara opsi **B**, tapi dipersempit.

### Kenapa ini keputusan yang wajar, bukan cuma preferensi

Pedoman Pemberitaan Media Siber (Dewan Pers) mengatur Isi Buatan Pengguna: media siber mewajibkan
pengguna melakukan registrasi keanggotaan dan login sebelum dapat mempublikasikan UGC, serta wajib
mencantumkan syarat dan ketentuan UGC. Jadi komentar wajib login **sejalan dengan pedoman yang berlaku
di industri pers Indonesia**, bukan hambatan yang dibuat-buat.

Itu **pedoman Dewan Pers, bukan undang-undang**. Penegakannya lewat mekanisme Dewan Pers, dan jadi
relevan kalau portal ini mengejar verifikasi Dewan Pers — berkaitan dengan B7 yang belum dijawab.

### Yang kembali masuk lingkup (sebelumnya sudah saya hapus)

| Yang kembali | Konsekuensinya |
| --- | --- |
| Autentikasi pembaca | Registrasi, login, verifikasi email, lupa password, sesi |
| Kategori (14) Comment & Moderation | **Kembali penuh** — batal dihapus dari Batch 4 |
| Moderasi | Antrean moderasi, kata terlarang, anti-spam, lapor komentar, blokir pengguna |
| Kewajiban perlindungan data pribadi | **Kembali berat.** Ada email, password, dan komentar milik orang — UU PDP berlaku penuh |
| Syarat & ketentuan UGC | Halaman tersendiri, wajib menurut Pedoman Media Siber |

### Yang tetap di luar lingkup

Akun **hanya** untuk komentar. Tidak ikut masuk kecuali diminta: bookmark, riwayat baca, follow
kategori/penulis, personalisasi homepage, notifikasi per pembaca, tier/level pembaca.

Menahan diri di sini penting: begitu akun ada, godaan menempelkan fitur ke akun jadi besar, dan tiap
fitur menambah data pribadi yang harus dilindungi.

---

## Yang terkunci oleh tiap jawaban

### Dari B1 = placeholder

- Nama portal, tagline, dan domain **harus bisa diganti dari satu tempat terpusat**. Tidak boleh
  ditulis berulang di judul halaman, metadata share, template email, footer, dan structured data
- Logo dan identitas visual (BR1–BR3) **ditunda**, bukan diabaikan. Sampai nama ada, saya pakai
  penanda netral, bukan mengarang nama lalu Anda terikat padanya
- `sorotan-lokal` diperlakukan sebagai **nama repositori saja**, bukan nama produk
- B9 (domain) belum bisa dijawab sebelum nama ada

### Dari B2 = C (nasional)

- Wilayah **bukan** dimensi taxonomy. Cukup satu kategori "Daerah"/"Nusantara" seperti kategori lain
- Tidak ada homepage per wilayah, tidak ada hak akses redaksi per wilayah, tidak ada penargetan iklan
  per wilayah sebagai fitur inti
- Sitemap tidak perlu dipecah per wilayah
- C7 (daftar wilayah) **tidak berlaku** — dilewati

### Dari B2b = URL netral

Ini keputusan paling permanen di seluruh Batch 1, dan bentuknya sekarang terkunci:

- Alamat artikel **tidak memuat kategori dan tidak memuat tanggal**. Bentuknya satu segmen tetap +
  slug (bentuk persisnya ditentukan di phase arsitektur, tapi sifatnya sudah terkunci)
- **Satu artikel boleh punya lebih dari satu kategori.** Tidak ada kewajiban memilih satu kategori
  utama. Ini yang membuat cakupan "umum lintas kanal" tidak jadi masalah — artikel ekonomi-politik
  tidak perlu dipaksa memilih
- **Mengubah kategori artikel tidak mengubah alamatnya.** Tidak ada utang redirect dari
  pengorganisasian ulang taxonomy. Ini kebebasan besar: Anda boleh merapikan kategori kapan saja
  setelah tahu mana yang benar-benar terpakai
- Kategori dan halaman topik adalah **navigasi dan pengumpul**, bukan bagian dari identitas artikel
- Karena URL tidak memuat tanggal, **artikel evergreen tidak terlihat kedaluwarsa** — sejalan dengan
  strategi dari K1
- Konsekuensi yang harus ditangani: slug harus unik untuk seluruh portal, dan tidak boleh bertabrakan
  dengan nama kategori atau halaman sistem. Perlu daftar kata terlarang untuk slug
- Karena alamat tidak menunjukkan rubrik, **navigasi dan breadcrumb harus bekerja lebih keras** untuk
  memberi konteks. Ini masuk requirement UI Phase 6

### Dari B3 + penyelesaian K1 (nasional umum, target traffic realistis)

- **Positioning:** berita umum lintas kanal, bukan portal niche
- Konsekuensi paling nyata: **banyak kategori dengan isi sedikit.** Halaman kategori harus dirancang
  tetap layak dilihat saat isinya sedikit — bukan grid kosong. Requirement UI Phase 6
- **Halaman topik/dosier naik jadi fitur inti**, bukan nice-to-have. Kata kunci ekor panjang bertumpu
  pada beberapa topik yang digali berulang, dan halaman topik adalah tempat nilainya menumpuk
- **Konten evergreen dan explainer dapat porsi besar.** Berita cepat kalah otomatis pada volume ini
- **Jumlah kategori awal ditahan.** Mulai sedikit, tambah setelah ada isi. Detail di C6
- **Target traffic (A3) belum ditetapkan** — yang sudah diputuskan hanya bahwa ekspektasinya realistis

### Dari B4 = A (gratis penuh, selamanya)

Ini menghapus satu subsistem utuh. Yang **tidak** dibangun dan tidak disiapkan tempatnya:

- Tingkat akses / status premium pada artikel
- Integrasi pembayaran (Midtrans/Xendit), langganan, penanganan gagal bayar
- Penanda paywall pada structured data dan seluruh aturan SEO paywall
- Penjagaan berlapis pada query publik supaya konten berbayar tidak bocor
- Membership dan donasi

Yang perlu disadari, dicatat sekali lalu tidak diungkit lagi: kalau nanti berubah pikiran, ini
**migrasi database plus audit ulang seluruh query publik**, bukan penambahan fitur. Tapi pada kondisi
solo + biaya di bawah Rp 500 ribu, memilih ini **defensibel** — satu subsistem lebih sedikit untuk
dirawat satu orang, dan tidak ada gunanya menyiapkan tempat untuk sesuatu yang tidak akan dipakai.

**Konsekuensi ke akun pembaca:** karena tidak ada premium, satu-satunya alasan akun pembaca ada adalah
**komentar**. Lihat K4 — ini yang membuat perhitungannya berubah.

### Dari B6 = 1 orang (solo)

Ini jawaban yang paling banyak menyederhanakan CMS, dan sekaligus yang paling banyak menambah risiko
operasional:

- **Tidak ada alur review berlapis.** Draft → terbit. Tidak ada tahap "menunggu review", tidak ada
  penugasan, tidak ada persetujuan editor
- **Sistem peran dibuat minimal tapi bisa tumbuh.** Arah rekomendasinya: peran disimpan sebagai data
  sejak awal supaya penambahan orang nanti tidak perlu migrasi, tapi hanya satu peran yang benar-benar
  dipakai saat launch. Bentuk persisnya ditentukan di phase database — dicatat di sini sebagai arah,
  bukan desain
- **Tidak ada embargo, tidak ada jadwal redaksi bersama.** Penjadwalan terbit tetap berguna untuk satu
  orang (menulis malam, terbit pagi), tapi bukan alat koordinasi
- **Jejak audit tetap berguna** meski solo — untuk melacak apa yang diubah kapan, bukan untuk
  mengawasi orang lain. Prioritasnya rendah
- **CMS harus cepat dipakai, bukan lengkap.** Untuk satu orang yang menulis tiap hari, jumlah klik
  untuk menerbitkan satu artikel lebih penting daripada kelengkapan fitur. Requirement UI Phase 7
- **Risiko utamanya: moderasi komentar harian.** Lihat K4
- **Volume realistis lebih rendah dari 5/hari.** Lihat K5

### Dari B8 = di bawah Rp 500 ribu/bulan

Ini plafon yang ketat tapi masuk akal untuk tahap ini. Yang **tertutup** olehnya:

- **Video self-host tertutup.** Penyimpanan dan bandwidth video melebihi plafon ini sendirian. C3
  praktis hanya bisa embed — masih perlu dikonfirmasi, tapi pilihannya sudah menyempit
- **Mesin pencari terkelola terpisah tertutup** di awal. Sejalan dengan C1=A yang memang belum
  membutuhkannya
- **Database dengan replika baca tertutup.** Satu instance saja
- **Pemantauan kelas berbayar tertutup** — pakai yang gratis
- Yang **harus tetap ada** dalam plafon itu: hosting yang **mengizinkan penggunaan komersial**,
  database dengan backup otomatis, penyimpanan gambar + CDN, dan pengiriman email untuk verifikasi
  akun. Keempatnya bisa masuk di bawah Rp 500 ribu, tapi tidak ada ruang untuk pemborosan
- **Peringatan yang diulang karena penting:** paket "hobby"/gratis dari banyak penyedia **melarang
  penggunaan komersial**. Portal yang memasang iklan termasuk komersial. Jadi plafon murah ≠ paket
  gratis — harus paket berbayar termurah yang izinnya jelas
- **Optimisasi gambar jadi wajib, bukan opsional.** Pada plafon ini, foto berukuran asli akan
  menghabiskan kuota bandwidth lebih cepat daripada yang diperkirakan

### Dari A3 = di bawah 50.000 pageview/bulan

Angka ini dipakai sebagai **angka perancangan**, bukan sebagai target ambisi. Yang terkunci olehnya:

- **Satu database tanpa replika baca cukup.** Tidak perlu pemisahan baca/tulis
- **Caching sederhana cukup:** halaman disiapkan sebelumnya, disegarkan saat artikel berubah. Tidak
  perlu lapisan cache tersendiri di depan database
- **Penghitung view tetap harus dirancang benar**, bukan karena traffic besar, tapi karena cara yang
  salah (memperbarui baris artikel setiap kali dibaca) mulai terasa jauh sebelum 50.000/bulan kalau
  ada satu artikel yang ramai sendiri. Mekanismenya diputuskan di phase database
- Plafon Rp 500 ribu/bulan **sangat cukup** pada angka ini — ada ruang aman, bukan pas-pasan
- **Naik kelas nanti tidak butuh perombakan.** Yang berubah hanya kelas hosting dan database. Ini
  konsekuensi langsung dari memilih pendekatan sederhana sekarang, bukan kebetulan

### Dari C2 = longform + galeri foto + live blog

Tiga format ini menentukan **jumlah template dan jenis structured data**, dan masing-masing punya
konsekuensi berbeda:

**Longform / liputan khusus** — paling sejalan dengan strategi evergreen dan halaman topik. Butuh
template tersendiri dengan subjudul berjenjang, kutipan besar, pembagian bab, dan daftar isi yang
mengikuti saat digulir. Ini format yang paling pantas dapat perhatian desain, karena satu artikel bagus
bisa menarik pencarian bertahun-tahun.

**Galeri foto** — murah dibuat dan cocok untuk volume solo. Butuh: pengaturan ukuran gambar yang ketat
(plafon bandwidth tipis), navigasi antar foto yang nyaman di layar sentuh, keterangan per foto, dan
kredit foto per foto — bukan per artikel. Tanpa aturan ukuran yang ketat, galeri adalah cara tercepat
menghabiskan kuota bandwidth.

**Live blog** — dipilih meski saya sarankan tidak. Diterima, tapi **cakupannya harus dipersempit**
supaya bisa dijalankan sendirian. Lihat K6.

**Yang tidak diambil:** infografis. Tidak perlu template khusus untuk itu.

### Dari C3 = embed YouTube saja

- **Tidak ada penyimpanan video, tidak ada transcoding, tidak ada bandwidth video.** Satu-satunya
  pilihan yang masuk di plafon B8
- Penyematan **harus dimuat belakangan** (setelah pembaca menggulir ke arahnya atau menekan tombol
  putar), bukan saat halaman dibuka. Pemutar YouTube berat, dan memuatnya di awal merusak kecepatan
  halaman — masalah nyata pada pembaca Android kelas menengah
- Sebelum diputar, tampilkan gambar sampul dengan ukuran tetap supaya tata letak tidak bergeser
- Pemutar dan iklan di dalam video **milik YouTube**, bukan Anda. Ini konsekuensi yang diterima
- Video **tidak** jadi jenis konten tersendiri — hanya elemen di dalam artikel. Tidak ada halaman
  kanal video, tidak ada sitemap video di awal

### Dari K4 = komentar di artikel pilihan, ditahan sampai disetujui

Ini bentuk komentar yang bisa dijalankan sendirian, dan yang terkunci olehnya:

- **Komentar tidak otomatis aktif.** Setiap artikel punya penanda apakah komentarnya dibuka. Bawaannya
  tertutup
- **Tidak ada komentar yang tayang tanpa dilihat manusia.** Semua masuk antrean dulu. Ini menghapus
  seluruh kelas risiko: tidak ada pencemaran nama baik, ujaran kebencian, atau spam yang pernah tampil
  di situs meski beberapa menit
- **Anti-spam otomatis tetap berguna** tapi turun prioritas — perannya menyaring antrean supaya lebih
  pendek, bukan menjaga gerbang
- **Antrean moderasi harus enak dipakai di ponsel.** Untuk satu orang, memeriksa komentar akan terjadi
  di sela-sela waktu, bukan di depan komputer. Requirement UI Phase 7
- **Tidak perlu shadow ban, tidak perlu sistem reputasi pengguna, tidak perlu moderasi berjenjang.**
  Cukup: setujui, tolak, blokir akun
- **Balasan berjenjang (nested reply) sebaiknya tidak diambil** di awal. Pada moderasi pra-tayang,
  percakapan berjenjang jadi aneh karena balasan bisa muncul sebelum komentar yang dibalas
- Yang tetap wajib: **halaman syarat dan ketentuan UGC**, dan kebijakan privasi yang menjelaskan data
  apa yang disimpan dari pemilik akun
- Efek yang harus diterima: **jumlah komentar akan sedikit.** Login + moderasi pra-tayang + hanya di
  artikel pilihan = hambatan berlapis. Itu memang yang dibeli untuk keamanan. Jangan menilainya gagal
  karena jumlahnya kecil

### Dari M1 = B (AdSense + Google Ad Manager)

`heading ini hilang sampai 2026-08-17 sehingga tiga butir di bawah terbaca seolah bagian dari K4`

- Perlu lapisan perantara slot iklan sejak awal, dengan GAM sebagai penyedia utama dan AdSense sebagai
  pengisi sisa permintaan
- Belum ada modul pengiklan/kampanye/invoice. Tempatnya disiapkan di desain database, modulnya tidak
  dibangun
- Tidak ada marketplace self-serve

### Dari C6 = kategori + tag bebas + halaman topik

Tiga lapisan dengan tugas berbeda, dan pembagian tugasnya harus dijaga supaya tidak saling makan:

- **Kategori** — rubrik tetap, jumlahnya sedikit, jadi navigasi utama. Bisa ditambah/dirapikan kapan
  saja tanpa mengubah alamat artikel (keuntungan dari B2b netral)
- **Tag** — bebas dibuat, tugasnya menghubungkan artikel terkait dan membantu pencarian internal
- **Halaman topik** — dikurasi manual, ini aset SEO utama. Bukan hasil otomatis dari tag

**Yang wajib ada karena tag bebas dipilih:**

- **Halaman tag sebaiknya tidak diindeks mesin pencari.** Pada 1–2 artikel/hari, tag bebas akan
  menghasilkan banyak halaman berisi satu artikel. Halaman semacam itu tidak membantu peringkat dan
  memperbesar jumlah halaman tipis. Tag tetap berguna — perannya di dalam situs, bukan di pencarian
- **Alat menggabungkan dan mengganti nama tag wajib ada di CMS.** Satu orang yang menulis tiap hari
  pasti akan membuat "ekonomi" dan "perekonomian", atau "PPN" dan "pajak pertambahan nilai". Tanpa alat
  penggabung, taxonomy jadi berantakan dalam beberapa bulan dan membersihkannya manual menyakitkan
- **Saran tag saat menulis** — menampilkan tag yang sudah ada saat diketik. Ini pencegahan paling
  murah untuk masalah di atas
- **C8 (siapa boleh membuat tag) terjawab otomatis oleh B6=1:** hanya Anda. Tapi aturannya tetap perlu
  ada di sistem peran supaya penambahan orang nanti tidak langsung merusak taxonomy

**Yang tidak dibangun:** subkategori. Dua tingkat baru berguna kalau satu kategori sudah punya ratusan
artikel — pada volume ini bertahun-tahun lagi, dan B2b netral membuat penambahannya nanti murah.

### Dari B7 = perorangan

- **Verifikasi Dewan Pers belum bisa dikejar.** UU Pers mensyaratkan perusahaan pers berbentuk badan
  hukum Indonesia. Konsekuensinya untuk sekarang: **halaman Tentang Kami dan Redaksi tidak boleh
  mengklaim status yang belum dimiliki** — tidak ada lencana "terverifikasi Dewan Pers", tidak ada
  klaim sebagai perusahaan pers berbadan hukum. Klaim palsu jauh lebih merugikan daripada tidak
  punya klaim
- **Iklan pemerintah/APBD tertutup.** Tidak masalah sekarang karena M1=B (AdSense+GAM) memang tidak
  mengandalkan itu
- **Penerima pembayaran iklan adalah pribadi Anda.** AdSense bisa dibayarkan ke perorangan
- **Tanggung jawab hukum atas konten menempel ke pribadi.** Tidak ada pemisah badan hukum. Ini yang
  membuat keputusan moderasi pra-tayang di K4 jadi lebih tepat, bukan cuma lebih hati-hati
- **Pedoman Media Siber tetap layak diikuti** meski belum jadi perusahaan pers terverifikasi —
  khususnya soal hak jawab, koreksi, dan syarat & ketentuan UGC. Ini praktik baik yang murah, dan
  memudahkan kalau nanti naik ke PT
- Naik ke PT nanti **tidak mengubah arsitektur** — hanya isi halaman statis dan data penerima
  pembayaran

### `REVISI` Dari U1b = tautan sekali pakai ke email, tanpa password

Jawaban pertama (email + password) **dibatalkan** setelah saya menawarkan opsi yang sebelumnya lupa
saya sebutkan. Keputusan finalnya: pembaca memasukkan email, menerima tautan masuk yang berlaku sekali
dan kedaluwarsa. **Tidak ada password yang pernah dibuat atau disimpan.**

Ini mempertahankan motif asli user — mandiri, tidak menggantung ke Google — sekaligus menghapus seluruh
kelas risiko.

**Yang hilang dari lingkup dibanding email + password:**

- Penyimpanan dan pelindungan password → tidak ada password sama sekali
- Alur lupa password → tidak relevan; tiap masuk memang lewat email
- Verifikasi email terpisah → menyatu dengan mekanisme masuk. Kalau tautannya diklik, emailnya terbukti
- Risiko kebocoran password → nol. Yang bisa bocor tinggal alamat email, dan itu bukan rahasia
- Serangan mencoba password satu per satu → tidak ada yang bisa dicoba

**Yang tetap wajib:**

| Yang wajib dibangun | Kenapa |
| --- | --- |
| Token sekali pakai dengan masa berlaku pendek | Tautan yang tidak kedaluwarsa atau bisa dipakai berulang = kunci yang tergeletak di kotak masuk |
| Pembatasan laju permintaan tautan | Tanpa ini, alamat email orang lain bisa dibanjiri tautan |
| Pengiriman email transaksional yang layak | Sekarang lebih kritis, bukan kurang — email **adalah** cara masuknya. Kalau mendarat di spam, tidak ada yang bisa berkomentar. SMTP mentah dari server sendiri hampir selalu masuk spam |
| Sesi yang cukup panjang | Kalau sesi cepat habis, pembaca harus buka email berulang kali dan menyerah |

**Kolom data pembaca ditahan seminimal mungkin:** alamat email dan satu nama tampilan. Tidak ada nama
lengkap, tanggal lahir, nomor telepon, jenis kelamin, atau foto profil. Setiap kolom tambahan adalah
kewajiban UU PDP tambahan tanpa manfaat yang sepadan.

Dampak ke K7: **selesai.** Kombinasi paling berisiko di Batch 1 (solo + tanggung jawab pribadi +
menyimpan password) sudah tidak ada.

### Dari C4 = foto sendiri + stok gratis + ilustrasi AI berlabel

Tiga sumber, dan masing-masing punya aturan yang harus ditegakkan **di dalam CMS**, bukan cuma di
kepala:

- **Kolom kredit dan sumber wajib diisi sebelum artikel bisa terbit.** Tanpa pemaksaan di CMS, kredit
  akan terlewat pada hari yang sibuk — dan kredit yang terlewat adalah masalah lisensi, bukan
  kelalaian kecil
- **Ilustrasi AI wajib diberi label yang terlihat pembaca**, dan label itu bukan pilihan. Aturan
  mutlaknya: **ilustrasi AI tidak boleh dipakai seolah-olah foto peristiwa nyata.** Untuk topik abstrak
  (inflasi, kebijakan, konsep) boleh; untuk menggambarkan kejadian, orang, atau tempat nyata, tidak
- Konsekuensi teknisnya: setiap gambar butuh penanda jenis sumber (jepretan sendiri / stok / AI), dan
  penanda itu menentukan label apa yang tampil
- **Stok gratis butuh pencatatan lisensi.** "Gratis" bukan berarti tanpa syarat — beberapa menuntut
  atribusi. Menyimpan tautan sumber per gambar jauh lebih murah daripada mencarinya lagi setahun
  kemudian saat ada keluhan
- Selaras dengan B8: tidak ada langganan kantor berita, jadi tidak ada kewajiban kredit kontraktual
  yang rumit — tapi juga tidak ada foto peristiwa yang benar-benar relevan kecuali Anda ambil sendiri
- **Pengaturan ukuran gambar tetap wajib ketat** karena plafon bandwidth tipis (lihat B8), dan karena
  A4 menuntut gambar utama minimal 1200 piksel lebar

### Dari BR2 = penjelas dan analitis

Ini jawaban yang paling menyatu dengan semua keputusan lain: longform (C2), evergreen (K1), halaman
topik (C6), volume rendah (C1). Pada 1–2 artikel/hari, kecepatan pasti kalah — penjelasan yang lebih
baik masih bisa menang.

Yang terkunci untuk desain (dipakai di Phase 6, dicatat sekarang supaya tidak hilang):

- **Tipografi untuk membaca lama**, bukan untuk memindai judul. Ukuran huruf isi artikel lebih besar
  dari kebiasaan portal cepat, jarak antar baris lega, lebar kolom baca dibatasi
- **Judul boleh lebih panjang** karena tugasnya menjelaskan, bukan memancing. Ini mengubah perhitungan
  tata letak: kartu artikel harus rapi pada judul dua sampai tiga baris, bukan satu
- **Butuh elemen struktural yang tidak dipunya portal cepat:** ringkasan "apa yang perlu Anda tahu" di
  awal, kotak konteks/latar belakang di tengah, daftar isi untuk artikel panjang, dan tautan ke
  halaman topik terkait
- **Waktu baca dan tanggal pembaruan ditampilkan**, karena pembaca artikel penjelas memang menakar
  dulu sebelum masuk
- **Tidak ada elemen clickbait**: tidak ada "Anda tidak akan percaya", tidak ada judul yang menahan
  informasi, tidak ada artikel yang dipecah jadi banyak halaman
- Efek ke iklan: gaya ini menuntut halaman yang tenang, jadi aturan penempatan iklan di M3 harus
  ditegakkan lebih keras — iklan yang menyela di tengah kalimat merusak justru pada format ini

### Dari A1 = muda 18–30, akrab media sosial + BR3 = modern bersih

Digabung dengan BR2 (penjelas dan analitis), tiga jawaban ini membentuk **satu posisi produk yang
jelas dan tidak dimiliki portal besar mana pun di Indonesia**: portal penjelas untuk pembaca muda,
dengan tampilan bersih dan mengutamakan ponsel. Ini kabar baik — Detik dan Kompas bermain di kecepatan
dan keluasan, bukan di sini. Perbedaannya bukan dibuat-buat, dan tidak butuh volume besar untuk
dipertahankan.

Tapi kombinasi ini juga menciptakan satu ketegangan nyata dengan C2 (longform). Diselesaikan di K8.

**Yang terkunci untuk desain (Phase 6):**

- **Ponsel bukan "juga didukung", tapi tempat utama.** Perancangan dimulai dari layar sempit, versi
  layar lebar menyusul — bukan sebaliknya
- **Berbagi ke WhatsApp dan Instagram harus semudah mungkin.** Ini sumber traffic terbesar untuk
  pembaca muda di Indonesia, jauh di atas pencarian. Konsekuensi konkretnya: gambar pratinjau share
  harus benar dan menarik untuk **setiap** artikel, kutipan yang bisa dibagikan sebagai gambar, dan
  tombol berbagi yang tidak disembunyikan
- **Waktu muat jadi kritis, bukan cuma bagus.** Pembaca muda datang dari tautan di aplikasi chat, pada
  koneksi seluler, di ponsel Android kelas menengah. Halaman yang berat kehilangan mereka sebelum
  terbaca — dan ini bertumpuk dengan aturan iklan di M3

**Risiko BR3 yang harus ditangani secara sadar:** "modern bersih" adalah arah yang paling mudah
berakhir terlihat seperti template. Saya sudah menyampaikan risiko itu waktu bertanya, dan jawabannya
tetap ini — jadi tugasnya bukan mengubah arah, tapi membuatnya tidak generik. Cara yang akan dipakai
di Phase 6: pilihan huruf yang punya karakter (bukan huruf bawaan sistem), perbedaan ukuran yang tegas
antara judul dan isi, satu warna aksen yang dipakai konsisten dan hemat, dan satu elemen tanda tangan
yang muncul di seluruh situs. Identitas datang dari sedikit keputusan yang tegas, bukan dari banyak
hiasan.

**Efek ke A5 (personalisasi) yang perlu diputuskan nanti:** pembaca muda terbiasa dengan umpan yang
menyesuaikan diri. Tapi personalisasi bertentangan dengan halaman yang bisa disiapkan sebelumnya —
dan itu fondasi yang sudah dikunci oleh A3 dan B8. Rekomendasi saya nanti: tanpa personalisasi, tapi
dengan "paling banyak dibaca" dan "topik yang sedang berjalan" yang sama untuk semua orang.

### Dari B5 = tidak ada konten lama

- Tidak perlu alat impor, tidak perlu peta redirect dari alamat lama, tidak perlu pembersihan data
  warisan
- Tidak ada nilai pencarian yang perlu dipindahkan — artinya juga **tidak ada nilai pencarian awal
  sama sekali.** Portal mulai dari nol di mata mesin pencari, dan itu memperkuat catatan di K3: jangan
  berharap traffic maupun pendapatan di bulan-bulan pertama
- Keuntungan tersembunyi: **struktur URL yang sudah dipilih di B2b bisa langsung benar sejak artikel
  pertama.** Tidak ada kompromi dengan alamat lama

### Dari M5 = advertorial diterima, berlabel jelas, di luar feed berita

Ini menjadikan advertorial **satu-satunya sumber pendapatan yang bisa dikejar sebelum AdSense disetujui.**
Yang wajib menyertainya:

- **Jenis konten tersendiri**, bukan artikel biasa dengan penanda. Advertorial punya aturan tampilan,
  aturan tautan, dan aturan distribusi yang berbeda
- **Label yang terlihat pembaca tanpa harus dicari** — di kartu artikel, di bagian atas halaman
  artikel, dan di hasil pencarian internal. Bukan tulisan kecil abu-abu di bawah
- **Tautan ke pengiklan wajib ditandai sebagai bersponsor** supaya tidak dianggap upaya memanipulasi
  peringkat. Tautan berbayar yang tidak ditandai adalah salah satu pelanggaran yang paling jelas di
  mata mesin pencari
- **Dikeluarkan dari:** feed berita, sitemap berita, Google News, dan halaman topik. Boleh muncul di
  arsip dan pencarian internal
- **Nama pengiklan harus tercatat** meski belum ada modul CRM/invoice. Cukup satu kolom, bukan
  subsistem — konsisten dengan M1=B yang menunda modul pengiklan
- **Penulis advertorial tidak ditampilkan sebagai jurnalis.** Kalau ada halaman penulis, advertorial
  tidak masuk ke riwayat tulisan siapa pun

Catatan yang jujur soal ekspektasi: pada target di bawah 50.000 pageview/bulan, pembeli advertorial
kemungkinan usaha kecil atau merek niche, dan tarifnya sederhana. Tetap sumber pendapatan yang paling
bisa dijangkau lebih dulu, tapi bukan jumlah yang mengubah keadaan.


### Dari A4 = kejar ketiganya (pencarian biasa + Google News + Discover)

Perlu diperjelas karena pertanyaannya mungkin terbaca seolah pilih-satu: **ketiganya tidak bersaing.**
Peringkat pencarian biasa adalah fondasinya, dan News serta Discover dibangun di atas pekerjaan yang
sama. Jadi jawaban ini bukan menambah tiga beban — hanya satu pekerjaan dengan sedikit tambahan.

Yang dikerjakan sejak awal:

| Pekerjaan | Melayani |
| --- | --- |
| Structured data artikel yang benar (termasuk penulis dan tanggal) | Ketiganya |
| Judul, deskripsi, dan kanonikal yang bersih | Ketiganya |
| Kecepatan halaman dan tata letak yang tidak bergeser | Ketiganya |
| Sitemap standar | Pencarian biasa |
| Sitemap berita terpisah | Google News |
| Gambar utama minimal 1200 piksel lebar | Discover terutama |
| Izin pratinjau gambar besar | Discover terutama |
| Halaman penulis dengan riwayat tulisan | Kredibilitas — membantu ketiganya |

Dua hal yang harus jujur dicatat supaya ekspektasinya benar:

1. **Discover tidak bisa didaftarkan.** Tidak ada formulir, tidak ada pengajuan. Yang bisa dilakukan
   hanya memenuhi syarat teknis dan menulis hal yang layak muncul. Ini memperbesar kemungkinan, bukan
   membeli tempat
2. **Traffic dari Discover sangat tidak stabil.** Bisa melonjak lalu hilang tanpa sebab yang jelas.
   Jangan jadikan dasar perhitungan pendapatan — perlakukan sebagai bonus. Untuk portal ini, fondasi
   yang bisa diandalkan tetap pencarian ekor panjang dari artikel evergreen



---

## Konflik dan catatan terbuka

### `SELESAI` K1. Cakupan nasional vs volume 1–5 artikel/hari

Diselesaikan 2026-08-16: tetap nasional dan tetap umum, dengan ekspektasi traffic yang sadar rendah di
tahun pertama, bertumpu pada kata kunci ekor panjang dan halaman topik.

### `SELESAI` K2. Nama folder `sorotan-lokal` vs cakupan nasional

Diselesaikan 2026-08-16: nama belum ada, pakai placeholder. `sorotan-lokal` = nama repositori.

### `DITERIMA SEBAGAI RISIKO` K3. Revenue tidak akan aktif di awal

M1=B (GAM) menghindari migrasi nanti, tapi kemampuan utama GAM — banyak sumber permintaan, kampanye
direct, prioritas line item — belum terpakai pada tahap awal. Tambahan ~1–2 minggu kerja dibanding
AdSense saja. Perlu dikonfirmasi bahwa ini disengaja.

Yang lebih penting, dan sekarang lebih tajam karena B4=gratis penuh dan B6=solo: **iklan adalah
satu-satunya sumber pendapatan**, dan iklan tidak akan aktif saat launch. AdSense butuh persetujuan,
dan situs dengan sedikit artikel sering ditolak di percobaan pertama. Pada volume solo yang realistis,
portal butuh beberapa bulan sebelum layak diajukan. Artinya biaya di bawah Rp 500 ribu/bulan itu
**keluar dari kantong sendiri selama beberapa bulan pertama** — jumlahnya kecil, tapi harus disadari,
bukan ditemukan belakangan.

### `SELESAI` K4. Seluruh sistem akun ada untuk satu fitur — apakah sepadan

Diselesaikan 2026-08-16: **komentar hanya di artikel yang dibuka editor, dan semua ditahan sampai
disetujui.** Akun pembaca tetap ada dan tetap wajib untuk berkomentar. Konsekuensinya dicatat di bagian
"Dari K4" di atas. Catatan pertimbangan di bawah disimpan supaya alasannya tetap terlacak.

Ini bukan konflik teknis. Ini soal apakah biayanya sepadan, dan B6=solo mengubah perhitungannya.

Setelah B4=gratis penuh, **satu-satunya alasan akun pembaca ada adalah komentar.** Yang dibayar untuk
fitur itu: autentikasi lengkap, verifikasi email, lupa password, penanganan penyalahgunaan akun,
antrean moderasi, anti-spam, halaman syarat & ketentuan UGC, dan kewajiban UU PDP penuh atas email +
password + tulisan orang lain.

Lalu B6=1: **satu orang** yang menulis, mengedit, menerbitkan, mengurus SEO, dan mengelola iklan —
juga harus memeriksa komentar **setiap hari**, karena komentar bermasalah yang dibiarkan tampil adalah
risiko reputasi dan, untuk isu sensitif, risiko hukum.

Ada tiga efek yang berlawanan dan semuanya nyata:

**Meringankan:** registrasi adalah hambatan. Spam bot berkurang drastis, dan komentar yang masuk
biasanya lebih bertanggung jawab karena terikat identitas.

**Memberatkan:** komentar butuh perhatian manusia harian, tidak bisa ditunda seminggu.

**Yang sering mengejutkan:** hambatan registrasi menekan jumlah komentar sangat banyak. Portal kecil
yang mewajibkan login sering berakhir dengan kolom komentar kosong di hampir semua artikel — yang
terlihat lebih buruk daripada tidak punya kolom komentar sama sekali.

Yang sudah diputuskan sebagai jalan keluarnya: **komentar tidak otomatis aktif, dan tidak ada yang
tayang tanpa dilihat manusia.** Dua hambatan itu yang membuat fitur ini bisa bertahan di tangan satu
orang. Harganya jumlah komentar yang sedikit — diterima secara sadar.

### `DITERIMA SEBAGAI CATATAN` K5. Volume 1–5 artikel/hari untuk satu orang

C1=A dijawab sebelum B6=1 diketahui. Untuk satu orang yang juga mengurus SEO, gambar, iklan, dan
moderasi, **5 artikel per hari tidak berkelanjutan** dalam hitungan bulan. Yang realistis untuk solo
adalah 1–2 artikel/hari, dengan lonjakan sesekali.

Arsitekturnya **tidak berubah** — 1/hari dan 5/hari sama-sama masuk kategori volume rendah, dan
keputusan teknis yang sudah dikunci (tanpa queue, pencarian bawaan database) tetap benar. Yang berubah
adalah dua hal non-teknis:

1. **Kelayakan AdSense datang lebih lambat.** Pada 1–2/hari, jumlah artikel yang pantas diajukan butuh
   beberapa bulan lebih lama
2. **Strategi konten harus lebih memihak evergreen.** Pada 1–2 artikel/hari, mengejar berita harian
   hampir pasti kalah; artikel yang tetap relevan berbulan-bulan adalah satu-satunya cara volume
   sekecil itu menumpuk nilai

Tidak perlu mengubah jawaban C1. Cukup dicatat bahwa perencanaan memakai **ujung bawah** rentang itu,
bukan ujung atas.

### `SELESAI` K6. Live blog dipilih meski disarankan tidak — cakupannya dipersempit

Diselesaikan 2026-08-16: **versi hemat, dibangun setelah launch.** Struktur datanya dirancang sekarang
(artikel dengan rangkaian pembaruan bertanda waktu) supaya menambahkannya nanti bukan migrasi;
tampilannya tidak masuk lingkup launch. Pertimbangan di bawah disimpan supaya alasannya terlacak.

C2 memasukkan live blog. Saya sudah menyampaikan bahwa liputan langsung sulit dijalankan sendirian, dan
jawabannya tetap live blog. **Diterima** — tapi istilah "live blog" mencakup dua hal yang biayanya
sangat berbeda, dan yang mahal itu tidak muat di plafon B8.

**Versi hemat** — halaman artikel dengan rangkaian pembaruan bertanda waktu, urutan terbaru di atas.
Pembaca menekan segarkan atau halaman menyegarkan diri setiap beberapa puluh detik. Tidak ada koneksi
terbuka ke server. Ini murah, cocok di plafon Rp 500 ribu, dan cukup untuk 90% kebutuhan liputan
berjalan seperti sidang, pengumuman resmi, atau hasil pertandingan.

**Versi mahal** — pembaruan terdorong ke pembaca seketika lewat koneksi terbuka. Butuh infrastruktur
yang mempertahankan ribuan koneksi hidup sekaligus, dan itu **melebihi plafon B8** dan tidak sejalan
dengan pendekatan halaman-disiapkan-sebelumnya yang sudah dikunci oleh A3 dan C1.

Ada juga pertanyaan operasional yang lebih menentukan daripada teknisnya: **live blog mengunci satu
orang selama beberapa jam.** Selama Anda meliput langsung, tidak ada artikel lain yang ditulis dan tidak
ada komentar yang dimoderasi. Untuk solo, live blog realistis dipakai beberapa kali setahun untuk
peristiwa besar — bukan fitur mingguan. Membangunnya tetap masuk akal kalau ekspektasinya begitu.

Yang perlu diputuskan: versi hemat atau versi mahal, dan apakah live blog dibangun di launch atau
ditunda sampai peristiwa pertama yang benar-benar membutuhkannya. **→ Diputuskan: versi hemat,
ditunda.**

### `DITERIMA SEBAGAI ASUMSI` K8. Pembaca muda (A1) vs longform (C2)

Ini ketegangan nyata, tapi bukan kontradiksi — dan sudah ada pola yang terbukti berhasil.

**Masalahnya:** pembaca 18–30 yang datang dari WhatsApp dan Instagram membaca dalam potongan pendek,
di antara hal lain, di ponsel. Longform menuntut perhatian berkelanjutan. Kalau longform dibangun
dengan asumsi pembaca akan membaca dari awal sampai akhir, sebagian besar pembaca muda akan keluar di
paragraf ketiga dan artikel itu jadi sia-sia.

**Penyelesaian yang saya usulkan — bukan mengubah jawaban, tapi mengubah bentuk longform-nya:**

Artikel penjelas panjang **dirancang untuk memberi nilai walau tidak dibaca habis.** Konkretnya:

1. **Ringkasan di layar pertama.** Tiga sampai lima poin "yang perlu Anda tahu" sebelum badan artikel.
   Pembaca yang berhenti di situ tetap mendapat sesuatu — dan kalau tertarik, lanjut
2. **Subjudul setiap dua sampai tiga paragraf**, bukan setiap sepuluh. Artikel jadi bisa dipindai, dan
   pembaca bisa melompat ke bagian yang dia butuhkan
3. **Paragraf pendek.** Dua sampai empat baris di layar ponsel, bukan blok padat
4. **Kutipan atau angka kunci yang bisa dibagikan sebagai gambar.** Ini yang membuat artikel panjang
   tetap hidup di media sosial — orang membagikan satu poin, bukan seluruh artikel
5. **Indikator kemajuan baca dan daftar isi yang mengikuti** di artikel panjang, supaya pembaca tahu
   apa yang tersisa dan tidak merasa terjebak
6. **Panjang tetap dibatasi.** "Longform" di sini berarti lengkap dan tuntas, bukan panjang demi
   panjang. Artikel yang menjelaskan satu hal dengan tuntas dalam 900 kata lebih baik daripada 2.500
   kata yang berputar

**Kenapa saya yakin ini bekerja:** model "penjelas untuk pembaca muda" sudah terbukti dijalankan
beberapa media di Indonesia dan luar negeri. Yang tidak bekerja adalah longform bergaya jurnal akademis
yang disodorkan ke pembaca media sosial.

**Yang perlu konfirmasi Anda:** apakah pendekatan di atas sesuai maksud Anda, atau Anda memang ingin
longform gaya klasik (naratif panjang, tanpa ringkasan di depan). Kalau maksudnya yang kedua, A1
sebaiknya ditinjau ulang — karena keduanya sulit dilayani sekaligus.

Sampai dikonfirmasi, saya pakai pendekatan di atas sebagai `ASUMSI`.

**Diterima 2026-08-16** lewat "lanjutkan", tanpa koreksi. Enam butir di atas jadi masukan wajib untuk
Phase 6 (UI publik) dan menentukan template artikel longform. Kalau ternyata yang dimaksud adalah
longform naratif klasik, ini harus dibuka lagi sebelum Phase 6 — setelah itu biayanya jadi perancangan
ulang template, bukan perubahan keputusan.

### `SELESAI` K7. Menyimpan password sebagai perorangan

Diselesaikan 2026-08-16 dengan mengganti cara login: **tautan sekali pakai ke email, tanpa password.**
Karena tidak ada password yang disimpan, tidak ada password yang bisa bocor. Kombinasi paling berisiko
di Batch 1 (solo + tanggung jawab pribadi + menyimpan password) sudah tidak ada.

Yang tersisa dan tetap harus dijaga: kolom data pembaca ditahan seminimal mungkin (email + nama
tampilan), dan pengiriman email harus benar-benar andal — karena email sekarang **adalah** pintu
masuknya, bukan cuma verifikasi.

Catatan historis supaya alasannya terlacak: jawaban pertama adalah email + password, dan itu masuk akal
sebagai keinginan untuk mandiri dari pihak ketiga. Yang berubah bukan motifnya — hanya caranya, setelah
saya menawarkan opsi yang seharusnya sudah saya tawarkan sejak awal.

---

## Pertanyaan Batch 1 yang masih terbuka

Tidak ada lagi yang mengunci arsitektur. Sisanya mengisi detail:

| Kelompok | Kode | Isi |
| --- | --- | --- |
| Business | B2c, B9 | kanal internasional, nama domain |
| Audience | A2, A5, A6 | wilayah pembaca, personalisasi, perangkat |
| Branding | BR1, BR4, BR5 | logo, referensi visual pembanding, warna |
| Content | C5, C9, C10 | sindikasi, arsip, kebijakan koreksi |
| Monetization | M2, M3, M4, M6, M7, M8 | AdSense, aturan penempatan, ukuran slot, affiliate, dan sisanya |

Tidak ada satu pun dari 17 item ini yang mengubah arsitektur. Semuanya sudah **diisi rekomendasi**
di `batch-01-sisa-asumsi.md`, ditandai `ASUMSI`, untuk ditinjau dan dikoreksi.

Dua di antaranya **terhalang B1** (nama belum ada): BR1 (logo) dan B9 (domain).
**Sudah terjawab otomatis:** C8 oleh B6=1 · C7 dibatalkan oleh B2=C.

`SELESAI 2026-08-16` — seluruh 17 item diterima tanpa koreksi lewat instruksi "lanjutkan".

---

# BATCH 2 — Editorial · User · CMS · Security

Dokumen pertanyaan: `batch-02-editorial-user-cms-security.md`.

## Empat blocker Batch 2 — terjawab semua 2026-08-16

| Kode | Pertanyaan | Jawaban | Tanggal |
| --- | --- | --- | --- |
| **CM1** | Bentuk penyimpanan isi artikel | **Blok terstruktur** | 2026-08-16 |
| **U2** | Akun redaksi vs akun pembaca | **Dua tabel terpisah, dua pintu login** | 2026-08-16 |
| **E2** | Entitas penulis | **Tabel penulis sendiri, boleh ditautkan ke akun** | 2026-08-16 |
| **S1** | Cara login admin | **Tautan sekali pakai ke email + kode autentikator** | 2026-08-16 |

Keempatnya sesuai rekomendasi saya.

**Sebelas pertanyaan Batch 2 lainnya sudah terjawab otomatis oleh Batch 1** — tabel pemetaannya ada di
awal `batch-02-...md`. Ringkasnya: tidak ada tahap review (B6=1), tidak ada tier pembaca (B4=A), tidak
ada bookmark/follow/riwayat baca (U1 dipersempit), tidak ada personalisasi (A5), data pembaca hanya
email + nama tampilan, dan status "ditarik" wajib ada (C9).

### Dari CM1 = blok terstruktur

Artikel bukan gumpalan markup, melainkan **daftar berurutan berisi blok bertipe**. Delapan tipe saja
saat launch — paragraf, subjudul, gambar, galeri, kutipan, penyematan, ringkasan, kotak konteks — dan
sengaja **bukan** pembangun halaman serba bisa.

**Yang terkunci:**

- **Iklan hanya bisa disisipkan di antara blok.** Ini yang membuat aturan M3 ("tidak menyela di tengah
  kalimat") ditegakkan oleh struktur data, bukan oleh kehati-hatian saat menulis
- **Daftar isi dibangun dari blok subjudul**, bukan dari membedah HTML. Ini prasyarat K8
- **Kartu kutipan yang bisa dibagikan dibangun dari blok kutipan** — juga prasyarat K8
- **Galeri adalah blok kelas satu**, bukan markup yang ditulis tangan. Ini yang membuat C2 (galeri foto)
  jadi fitur, bukan tambalan
- **Blok bisa ditandai bersponsor** satu per satu, memenuhi M5
- **Redesign di tahun kedua mengganti komponen perender tanpa menyentuh satu baris data artikel.** Ini
  keuntungan terbesarnya, dan yang paling mudah diabaikan saat memilih
- **Isi blok paragraf memakai penanda inline yang terbatas** (tebal, miring, tautan) — bukan HTML bebas.
  Karena tidak ada HTML dari editor, permukaan penyaringan markup ikut hilang
- **Setiap blok butuh validasi sendiri**, dan validasinya di lapisan layanan. Blok gambar tanpa penanda
  jenis sumber harus ditolak di situ (C4), bukan diingatkan di tampilan

**Yang jadi lebih mahal, dan diterima:** editornya harus dibangun, tidak bisa ambil yang siap pakai.
Ini pekerjaan Phase 7 yang nyata dan harus masuk roadmap dengan jujur.

**Catatan pelarian:** kalau di Phase 7 ternyata membangun editor blok terlalu berat untuk jadwal,
turunnya **ke markdown, bukan ke HTML** — karena markdown bisa dimigrasi otomatis ke blok, HTML tidak.
Jalur turun itu harus dicatat di roadmap, bukan diputuskan mendadak saat kepepet.

### Dari U2 = dua tabel terpisah

Akun redaksi dan akun pembaca adalah dua hal berbeda dengan dua pintu login berbeda.

**Yang terkunci:**

- **Tidak ada jalur naik peran dari pembaca ke redaksi.** Bukan dijaga oleh pemeriksaan izin — memang
  tidak ada jalannya. Ini menutup pola kegagalan paling umum di sistem seperti ini, yaitu kolom peran
  yang ikut diterima dari data yang dikirim browser
- **Dua jenis sesi**, dengan kebijakan berbeda (lihat S4: pembaca panjang, admin pendek)
- **Dua alur autentikasi** harus dibangun dan dipelihara. Ini biayanya, dan diterima
- **Pemeriksaan izin di lapisan layanan, bukan di tampilan.** Menyembunyikan menu bukan keamanan;
  endpoint yang menunya disembunyikan tetap bisa dipanggil langsung
- Peran (U6) tetap didefinisikan sebagai data di sisi redaksi — **Pemilik, Editor, Penulis, Moderator**
  — tapi hanya Pemilik yang diimplementasikan
- Sedikit melawan arus pustaka autentikasi yang umumnya berasumsi satu tabel pengguna. Konsekuensi:
  pemilihan pustaka di Batch 5 harus mempertimbangkan ini, **bukan sebaliknya**

### Dari E2 = entitas penulis terpisah

Artikel menunjuk ke data Penulis, bukan ke akun login.

**Yang terkunci:**

- **Halaman profil penulis jadi mungkin** — dengan biodata, foto, tautan sosial, dan daftar artikel.
  Untuk A4 (mengejar Google News dan Discover), ini salah satu sinyal kredibilitas termurah yang ada
- Halaman penulis **diindeks**, berbeda dari halaman tag yang sengaja `noindex`. Isinya orisinal
  (biodata) dan jumlahnya sedikit, jadi tidak menimbulkan masalah halaman tipis
- **Advertorial menunjuk ke bukan-penulis.** Atribusi pengiklan disimpan di tempat berbeda dan tidak
  pernah tampil sebagai byline — memenuhi M5 tanpa perlu membuat akun palsu
- Penulis punya slug sendiri, jadi **daftar kata terlarang untuk slug (B2b) harus mencakup ruang nama
  penulis juga** — kalau tidak, penulis bernama tertentu bisa bertabrakan dengan alamat halaman sistem
- Penulis tamu di masa depan tidak perlu akun login. C5 memang menutup kontributor luar untuk sekarang,
  tapi tempatnya sudah ada tanpa biaya tambahan

### Dari S1 = tautan email + kode autentikator

**Yang terkunci:**

- **Tidak ada password yang disimpan di seluruh sistem** — sifat yang sudah dipilih di U1b dipertahankan
  utuh, termasuk untuk akun admin
- **Email jatuh tidak berarti CMS jatuh.** Ini seluruh alasan keputusan ini ada
- **Tautan login admin berumur menit, bukan jam**, sekali pakai. Jauh lebih pendek daripada tautan
  pembaca
- **Kode pemulihan dicetak di kertas dan disimpan di luar rumah.** Kode pemulihan yang hanya ada di
  dalam perangkat yang bisa hilang bukan pemulihan
- Pendaftaran faktor kedua dilakukan sekali, dan **tidak boleh bisa dilepas hanya dengan akses email** —
  kalau bisa, faktor keduanya tidak ada artinya
- Mesin tautan email dipakai bersama oleh dua pintu, tapi **kebijakannya berbeda per pintu** (umur
  tautan, pembatasan laju). Jadi satu implementasi, dua konfigurasi

## Pertanyaan Batch 2 tingkat dua — `ASUMSI`, menunggu koreksi

Delapan item ini sudah diisi rekomendasi di `batch-02-...md` dan tidak mengubah arsitektur:
**CM2** (pratinjau di alamat asli pakai token) · **CM6** (moderasi komentar dan penerbitan wajib nyaman
di ponsel; editor lengkap tidak perlu) · **E3** (penjadwalan sederhana) · **E8** (pemeriksaan wajib
sebelum terbit — usulan tambahan saya) · **U3** (hanya tautan email, tapi tabel akun dirancang agar
satu akun boleh punya beberapa cara login) · **U4** (nama tampilan bebas + daftar nama terlarang) ·
**U5** (komentar tetap, nama disamarkan; harus ditulis di ketentuan penggunaan) · **S4** (sesi pembaca
panjang, sesi admin pendek).

Yang **tidak punya versi alternatif** dan sudah jadi kewajiban: S2 (pembatasan laju permintaan tautan
login), S6 (perlindungan dua formulir publik), E1 (status artikel), E4 (alur koreksi), U7 (data pembaca
minimal), CM3 (simpan otomatis + riwayat revisi), CM7 (penanda jenis sumber gambar wajib saat unggah).

**Ditunda dengan sengaja:** S7 (backup) ke Batch 5 · S8 (ketentuan penggunaan komentar) ke Batch 4 ·
detail media ke Batch 3.

