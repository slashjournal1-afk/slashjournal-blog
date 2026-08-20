# LOG KEPUTUSAN — BLOG PRIBADI

**Sumber kebenaran sejak 2026-08-17.** File ini menggantikan `decisions.md`, yang sekarang jadi catatan
sejarah discovery portal berita. Kalau keduanya bertentangan, **file ini yang berlaku.**

Penanda status:

| Penanda | Arti |
| --- | --- |
| `BERLAKU` | Keputusan portal berita yang tetap benar untuk blog. Tidak perlu ditanyakan ulang |
| `BERUBAH` | Intinya bertahan, tapi alasan atau cakupannya bergeser |
| `BATAL` | Hanya masuk akal untuk media pers. Dihapus dari lingkup |
| `ASUMSI` | Saya yang menentukan, boleh digugat kapan saja tanpa dianggap perubahan lingkup |

Aturan induk tidak berubah: **belum ada code, arsitektur, database, atau UI sampai requirement selesai
dan Anda menyetujuinya.**

---

## Empat keputusan penataan ulang — 2026-08-17

| Kode | Pertanyaan | Jawaban |
| --- | --- | --- |
| **P1** | Isi blog | **Campuran beberapa jenis tulisan**, dipisah per kategori |
| **P2** | Dari mana pembaca datang | **Ditemukan lewat pencarian Google** — SEO tetap dikejar serius |
| **P3** | Monetisasi | **AdSense + Google Ad Manager dipertahankan** *(menolak rekomendasi saya)* |
| **P4** | Komentar | **Ada, wajib membuat akun** — sama seperti keputusan sebelumnya |

P3 dan P4 mempertahankan dua subsistem terbesar. Artinya penataan ulang ini **bukan penyederhanaan
besar** seperti yang biasanya terjadi saat portal berita jadi blog — yang hilang hanya bagian pers-nya.

---

## Yang hilang dari lingkup

Batal **karena proyek ini bukan media pers**:

| Yang batal | Kenapa |
| --- | --- |
| Kejar Google News | Blog pribadi bukan penerbit berita. Bukan soal kualitas — soal jenis media |
| News sitemap | Turunan Google News. Sitemap biasa tetap ada dan tetap penting |
| Live blog / liputan langsung (bagian dari C2, dan K6) | Tidak ada peristiwa berjalan untuk diliput |
| Breaking news dan trending (kategori 23) | Tidak ada |
| Cakupan nasional dan wilayah sebagai kategori (B2, B3) | Tidak relevan untuk blog |
| Kewajiban UU Pers, Pedoman Pemberitaan Media Siber, verifikasi Dewan Pers | Bukan perusahaan pers |
| Structured data `NewsArticle` | Diganti `BlogPosting` |
| Hak jawab sebagai kewajiban | Turunan Pedoman Media Siber. Kebijakan koreksi tetap ada — lihat C10 di bawah |

Batal atau tidak relevan lagi, tapi **bukan karena pivot** — ini sudah selesai sebelumnya dan hanya
dicatat di sini supaya tidak dicari-cari:

| Yang batal | Kenapa |
| --- | --- |
| C7 daftar wilayah | Sudah batal sejak B2=C, jauh sebelum pivot |
| B2c kanal internasional | Pertanyaannya lenyap bersama taxonomy wilayah, bukan karena status pers |
| E7 embargo, koordinasi tim | Sudah tidak berlaku sejak B6=1 orang |
| K1, K5 (ketegangan cakupan vs volume) | Lihat KB4 |

**Satu konsekuensi yang perlu ditegaskan.** Kewajiban registrasi dan login sebelum berkomentar tadinya
punya dasar di Pedoman Pemberitaan Media Siber. **Dasar itu sekarang hilang.** P4 tetap memilih akun
wajib, jadi keputusannya tidak berubah — tapi alasannya sekarang murni pilihan Anda ditambah
pengendalian spam, bukan kepatuhan pedoman. Perbedaan ini penting kalau nanti Anda mempertimbangkan
melonggarkannya: tidak ada pihak luar yang mengharuskannya.

**UU PDP tetap berlaku sepenuhnya.** Itu tidak bergantung pada apakah Anda pers atau bukan — begitu ada
akun pembaca dan alamat email disimpan, kewajiban pengendali data menempel pada Anda sebagai perorangan.

---

## Keputusan yang tetap berlaku tanpa perubahan

Tidak perlu ditanyakan ulang. Alasan aslinya tidak bergantung pada bentuk media.

**Bisnis dan biaya:** B1 nama belum ada, pakai placeholder yang bisa diganti dari satu tempat · **B7
perorangan, bukan badan hukum** — yang batal hanya klaim badge Dewan Pers dan akses iklan pemerintah;
yang **tetap** dan penting: tanggung jawab hukum atas isi menempel ke pribadi Anda tanpa pemisah badan
hukum, dan naik ke PT nanti tidak mengubah arsitektur apa pun · B4 gratis penuh selamanya · B5 mulai dari
nol · B6 satu orang · B8 plafon di bawah Rp 500 ribu/bulan · B9 domain menunggu nama · **BR1 logo
menunggu nama** (empat berkas, bukan satu) · **K2 `sorotan-lokal` adalah nama repositori saja**, bukan
nama produk.

**Pembaca dan tampilan:** A2 wilayah pembaca tidak dipakai untuk apa pun · **A3 di bawah 50.000
pageview/bulan** — tetap dipakai sebagai **plafon perancangan**, bukan target; dengan ritme 2–8
tulisan/bulan (P5) angka itu jauh di atas trafik yang realistis di tahun pertama, dan memang begitu
maksudnya: yang dikunci adalah "sistem tidak boleh runtuh di bawah angka ini" · A5 tanpa personalisasi,
semua pembaca melihat halaman sama · A6 patokan ponsel Android kelas menengah pada koneksi seluler ·
BR2 tone penjelas dan analitis · BR3 modern bersih, sans-serif geometris · BR4 tidak memakai portal
berita sebagai acuan visual · BR5 satu warna aksen + skala netral, hindari biru tua sebagai default.

**Konten:** B2b **URL netral tanpa kategori tanpa tanggal** — untuk blog campuran ini jadi lebih tepat
lagi, karena tulisan bisa berpindah kategori tanpa mengubah alamatnya · C3 embed YouTube saja · C4 foto
sendiri + stok gratis + ilustrasi AI berlabel, penanda jenis sumber wajib saat unggah · C5 tidak ada
sindikasi, RSS keluar tetap ada · C8 hanya Anda yang membuat kategori dan tag · C9 arsip permanen,
tulisan yang ditarik tetap punya alamat dengan keterangan.

**Iklan:** **M1 = AdSense + Google Ad Manager** — dikonfirmasi ulang oleh P3; konsekuensi yang ikut
terkunci tetap sama: **tidak ada modul advertiser, campaign, atau invoice**, dan tidak ada marketplace
iklan self-serve · M2 AdSense diajukan setelah ada isi dan traffic, bukan di hari launch · M3 aturan
penempatan (tidak di atas judul, satu ukuran pasti per lebar layar, tanpa creative mengembang, tanpa
iklan layar penuh, dimuat belakangan, tidak menyela di tengah kalimat) · M4 slot dipanggil lewat nama,
satu tempat terpusat memutuskan isinya · M6 tidak ada affiliate di awal · M7 tidak ada donasi · M8
newsletter ada tapi bukan sumber pendapatan.

**Akun pembaca:** U1 akun wajib hanya untuk berkomentar, membaca tetap bebas · U1b login lewat tautan
sekali pakai ke email, tanpa password · U2 **dua tabel akun terpisah, dua pintu login** · U3 hanya
tautan email diimplementasikan, tapi tabel dirancang agar satu akun boleh punya beberapa cara login ·
U4 nama tampilan bebas + daftar nama terlarang · U5 penghapusan akun mandiri, komentar tetap dengan nama
disamarkan, dinyatakan jelas di ketentuan · U7 hanya email dan nama tampilan yang disimpan.

**Bentuk subsistem komentar (K4) — tetap berlaku utuh, dan inilah isi konkret dari P4:** komentar hanya
aktif di tulisan yang Anda buka, **default tertutup** · semua komentar **ditahan sampai disetujui** ·
tidak ada balasan berjenjang, cukup satu tingkat · tidak ada shadow ban, tidak ada sistem reputasi,
tidak ada tingkatan moderator · tindakan yang ada hanya setujui / tolak / blokir · anti-spam otomatis
turun prioritas karena semuanya sudah lewat persetujuan manual · antrean moderasi wajib nyaman di ponsel
(CM6). Alasan tambahan moderasi pra-tayang: **B7 membuat tanggung jawab hukum atas komentar menempel ke
pribadi Anda** — itu dasar yang tidak hilang bersama status pers.

**Artikel dan CMS:** E1 status draf / terjadwal / terbit / ditarik, plus pembedaan "ditarik" vs "salah
terbit", dan aturan perpindahan ditegakkan di lapisan layanan · E3 penjadwalan sederhana · E6 tidak ada
kalender redaksi · E8 pemeriksaan wajib sebelum terbit · CM2 pratinjau di alamat asli pakai token berumur
pendek · CM3 simpan otomatis + riwayat revisi permanen · CM4 tidak ada aksi massal artikel, tapi alat
gabung/ganti nama tag wajib · CM5 dashboard empat hal saja · CM6 moderasi komentar dan penerbitan wajib
nyaman di ponsel · CM7 unggahan gambar ditolak kalau penanda jenis sumber kosong.

**Keamanan:** S1 login admin **tautan email sekali pakai + kode autentikator**, tautan admin berumur
menit, kode pemulihan dicetak di kertas dan disimpan di luar rumah, faktor kedua tidak boleh dilepas
hanya dengan akses email · **K7 selesai — tidak ada password tersimpan di seluruh sistem**, jadi
kewajiban menjaga password sebagai perorangan lenyap, bukan dikelola · S2 pembatasan laju permintaan
tautan login (per email, per sumber, plus batas keras harian) · S3 jejak audit tujuh peristiwa, disimpan
tanpa batas waktu · S4 sesi pembaca panjang, sesi admin pendek, tombol keluarkan semua perangkat · S5
halaman admin dikecualikan dari pengindeksan, pemberitahuan setiap login admin, tanpa pembatasan per
lokasi jaringan · S6 perlindungan dua formulir publik dengan pemeriksaan bot tak terlihat, bukan
teka-teki · S7 basis data tulisan adalah aset yang tidak tergantikan.

---

## Keputusan yang berubah

### `BERUBAH` A4 — target distribusi

**Dari:** kejar pencarian biasa + Google News + Discover.
**Jadi:** **pencarian biasa adalah prioritas utama dan satu-satunya yang dikejar sungguhan.**

Google News dibatalkan. Google Discover **tetap mungkin** untuk blog — Discover tidak terbatas pada
berita — tapi statusnya berubah jadi oportunistik, bukan target. Tidak ada cara mendaftar ke Discover,
trafiknya sangat tidak stabil, dan mengejarnya untuk blog campuran bukan penggunaan waktu yang baik.

**Yang tetap dilakukan karena murah dan berguna untuk pencarian juga:** gambar lebar minimal 1.200 px,
mengizinkan pratinjau gambar besar, tanggal dan kepenulisan yang jelas. Kalau Discover datang, ia datang.

### `BERUBAH` A1 — profil pembaca

**Dari:** muda 18–30, akrab media sosial.
**Jadi:** **pembaca yang datang dari pencarian dengan pertanyaan spesifik**, umur tidak jadi penentu.

P2 menggeser definisi pembaca dari demografi ke niat. Ini perubahan yang nyata: pembaca dari pencarian
tidak datang untuk menjelajah, ia datang untuk satu jawaban dan akan pergi kalau tidak menemukannya di
layar pertama.

**Konsekuensi lama yang tetap berlaku, dengan alasan baru:** mobile-first tetap benar karena mayoritas
pencarian di Indonesia dari ponsel. Kartu share yang benar tetap perlu, tapi turun prioritas — pembaca
utama datang dari hasil pencarian, bukan dari WhatsApp. Kecepatan halaman tetap kritis, sekarang karena
pembaca pencarian paling cepat menekan tombol kembali.

### `BERUBAH` K8 — bentuk longform

Kesimpulannya **sama**, alasannya berganti dan jadi lebih kuat.

Dulu: pembaca muda tidak sabar dengan artikel panjang. Sekarang: **pembaca dari pencarian datang dengan
pertanyaan dan harus bisa menemukan jawabannya tanpa membaca seluruhnya.** Keduanya menuntut hal yang
sama — ringkasan di layar pertama, subjudul tiap dua sampai tiga paragraf, paragraf pendek, daftar isi
yang mengikuti, indikator kemajuan, dan panjang yang dibatasi oleh tuntasnya bahasan, bukan oleh target
kata.

Untuk tulisan teknis satu hal ditambahkan: **jawaban ringkas didahulukan, penjelasan panjang menyusul.**
Orang yang mencari cara menyelesaikan sesuatu ingin perintahnya dulu, alasannya kemudian.

### `BERUBAH` C1 → P5 — ritme terbit `ASUMSI`

**Dari:** 1–5 artikel per hari.
**Jadi:** `ASUMSI` **2–8 tulisan per bulan**, tidak harus rata.

Tidak mengubah arsitektur — semua keputusan teknis sudah dibuat untuk volume rendah. Yang berubah hanya
harapan: halaman kategori dan halaman depan **harus tetap enak dilihat saat isinya baru tiga tulisan**,
dan itu sudah jadi keputusan terkunci sejak Batch 1.

### `BERUBAH` C2 — format tulisan

Longform dan galeri foto **tetap**. Live blog **batal**.

Ditambahkan karena P1 mencakup tulisan teknis: **blok kode dengan penyorotan sintaks** dan **tabel**.

### `BERUBAH` C6 — taxonomy

Struktur tetap: kategori + tag bebas + halaman kumpulan. Yang berubah perannya:

- **Kategori jadi pemisah jenis tulisan**, bukan pemisah topik berita. Untuk blog campuran, kategori
  adalah alat yang membuat pembaca teknis tidak tersesat di jurnal pribadi dan sebaliknya
- **"Halaman topik/dosier" berganti nama dan fungsi jadi "seri"** — kumpulan tulisan yang saling
  menyambung dan dikurasi manual. Untuk blog, ini bentuk yang lebih alami dan tetap jadi aset SEO utama
- Tag bebas tetap `noindex`, alat gabung/ganti nama tetap wajib

### `BERUBAH` E2 dan E5 — penulis

Keputusan strukturnya **tetap**: penulis adalah entitas sendiri, bukan menempel di akun login. Yang
berubah: **isinya satu baris, yaitu Anda.**

Saya tetap merekomendasikan strukturnya dipertahankan meski hanya satu penulis, karena tiga alasan yang
tidak hilang: pos bersponsor menunjuk ke bukan-penulis tanpa perlu akun palsu; tulisan tamu di masa
depan tidak perlu migrasi; dan slug penulis tetap harus masuk daftar kata terlarang B2b.

**E5 berubah bentuk:** bukan direktori penulis, melainkan **satu halaman "Tentang" yang serius.** Untuk
blog yang mengandalkan pencarian, halaman Tentang yang jelas — siapa Anda, kenapa tulisan Anda layak
dipercaya di bidangnya — adalah salah satu sinyal kredibilitas termurah yang bisa dibuat, dan blog
pribadi paling sering menyia-nyiakannya dengan satu paragraf basa-basi.

### `BERUBAH` C10 dan E4 — kebijakan koreksi, dasarnya berganti

**Isinya tetap utuh:** tiga tingkat koreksi (perbaikan ketik diam-diam / kesalahan fakta dengan catatan
koreksi terlihat / penarikan dengan keterangan di alamat aslinya), catatan koreksi tersimpan permanen,
dan tanggal terbit dipisah dari tanggal pembaruan. Fakta tidak pernah diubah tanpa keterangan.

**Yang berubah adalah dasarnya.** Di `decisions.md` alasan yang saya tulis adalah "Pedoman Media Siber
tetap layak diikuti, khususnya soal hak jawab, koreksi, dan syarat UGC". Dasar itu sekarang hilang. Yang
menggantikannya, dan menurut saya lebih kuat: **B7 tetap berlaku** — tanggung jawab hukum atas isi
menempel ke pribadi Anda, jadi jejak koreksi yang jelas adalah perlindungan Anda sendiri, bukan
kepatuhan pedoman. Ditambah C9 (arsip permanen) yang membuat setiap tulisan tetap bisa diakses selamanya
dan karenanya tetap bisa dipersoalkan selamanya.

Kesimpulannya sama, dan saya sengaja mencatat pergantian dasar ini daripada membiarkannya lewat sebagai
`BERLAKU` — supaya kalau nanti ada yang bertanya "kenapa repot-repot punya kebijakan koreksi untuk blog
pribadi", jawabannya tidak menunjuk ke aturan yang sudah tidak berlaku.

**Hak jawab sebagai kewajiban formal: batal.** Yang tetap ada hanya cara menghubungi Anda dan kesediaan
memperbaiki.

### `BERUBAH` M5 — advertorial jadi pos bersponsor

Label wajib **tetap**: penanda terlihat di kartu, di atas tulisan, dan di hasil pencarian internal;
tautan keluar berbayar ditandai; tidak membawa byline penulis.

Yang batal hanya "dikeluarkan dari news sitemap dan Google News", karena keduanya tidak ada lagi.
Penggantinya: **dikeluarkan dari feed utama, dari RSS, dan dari halaman seri.**

### `BERUBAH` U6 — daftar peran

**Dari:** Pemilik, Editor, Penulis, Moderator.
**Jadi:** **Pemilik dan Moderator** saja. Editor dan Penulis tidak punya arti di blog pribadi tanpa
kontributor luar.

Tiga aturan yang menyertainya tidak berubah: peran tidak pernah diterima dari data yang dikirim browser;
akun baru selalu mendapat peran terendah; pemeriksaan peran di lapisan layanan, bukan di tampilan.

### `BERUBAH` S8 — ketentuan penggunaan komentar

Tetap wajib ditulis, tapi dasarnya berganti: bukan lagi Pedoman Pemberitaan Media Siber, melainkan
syarat pengajuan AdSense (M2), kewajiban UU PDP, dan kejelasan aturan komentar — termasuk pernyataan
eksplisit soal apa yang terjadi pada komentar saat akun dihapus (U5).

### `BERUBAH` CM1 — tipe blok bertambah

Blok terstruktur **tetap**, dan jalur turunnya tetap **ke markdown, bukan ke HTML**.

Dari delapan tipe jadi **sepuluh**, karena P1 mencakup tulisan teknis:

| Tipe blok | Catatan |
| --- | --- |
| Paragraf | Penanda inline terbatas: tebal, miring, tautan, kode sebaris |
| Subjudul | Sumber daftar isi otomatis |
| Gambar | Wajib punya penanda jenis sumber (C4) |
| Galeri | Satu alamat untuk seluruh galeri, bukan satu alamat per foto |
| Kutipan | Sumber kartu kutipan yang bisa dibagikan |
| Penyematan | YouTube saja (C3), dimuat setelah diklik |
| Ringkasan | Wajib di tulisan panjang (K8) |
| Kotak konteks | Catatan samping, peringatan, pembaruan |
| **Kode** `BARU` | Label bahasa, penyorotan sintaks, tombol salin. Penyorotan dilakukan saat menyimpan, bukan di peramban pembaca — supaya tidak menambah beban halaman di ponsel (A6) |
| **Tabel** `BARU` | Wajib bisa digulir menyamping di layar sempit tanpa merusak tata letak |

---

## Ketegangan baru dari penataan ulang

### `DICATAT` KB1. Google Ad Manager di blog pribadi

Anda memilih mempertahankan AdSense + GAM. Keputusannya saya catat sebagai keputusan, dan biayanya saya
sebut **sekali** di sini lalu tidak diungkit lagi.

GAM adalah alat untuk penerbit yang **menjual sendiri** ruang iklannya ke pengiklan. Blog pribadi solo
hampir pasti tidak melakukan itu, jadi kemampuan utama GAM akan menganggur. Biayanya bukan uang — GAM
gratis sampai volume yang tidak akan Anda capai — tapi kerumitan: satu integrasi lagi untuk dipelihara,
satu sumber pergeseran tata letak lagi untuk dijaga, satu hal lagi yang bisa rusak dan harus didiagnosis
oleh satu orang.

**Yang saya lakukan karena keputusan ini:** lapisan perantara slot (M4) naik dari "sebaiknya ada" jadi
**wajib mutlak**, dan di roadmap GAM dinyalakan **paling akhir** — setelah AdSense berjalan dan setelah
halaman stabil. Urutan itu membuat kerumitannya datang saat Anda punya kapasitas menanganinya, bukan
saat launch.

### `PERLU RESOLUSI` KB2. Blog campuran vs ditemukan lewat pencarian

Ini ketegangan nyata antara P1 dan P2, dan saya lebih baik menyebutnya sekarang daripada Anda
menemukannya di bulan keenam.

Blog yang isinya campuran mengirim sinyal topik yang menyebar. Pencarian cenderung memperlakukan situs
yang punya kedalaman di satu bidang lebih baik daripada situs yang menyentuh banyak bidang secara
dangkal. Blog campuran bisa berhasil di pencarian — banyak yang berhasil — tapi biasanya karena **satu
kategorinya punya kedalaman sungguhan**, bukan karena semuanya rata.

**Resolusi yang saya usulkan, ditandai `ASUMSI`:**

1. **Kategori diperlakukan hampir seperti sub-blog.** Halaman kategori punya deskripsi sendiri, tulisan
   pilihan sendiri, dan daftar seri di dalamnya — bukan cuma daftar tulisan terbaru
2. **Satu kategori dipilih sebagai kategori utama** dan mendapat porsi terbesar tulisan. Ini keputusan
   editorial Anda, bukan teknis, tapi strukturnya harus mendukungnya
3. **Seri adalah tempat kedalaman menumpuk.** Lima tulisan yang saling menyambung dalam satu seri jauh
   lebih kuat di pencarian daripada lima tulisan terpisah tentang hal yang sama
4. **Jurnal pribadi dipisah tegas**, dan kalau isinya memang bukan untuk pencarian, halaman-halamannya
   boleh `noindex`. Ini bukan merendahkan tulisan pribadi — ini menjaga agar tulisan yang Anda memang
   ingin ditemukan tidak tercampur sinyalnya
5. **Halaman depan menampilkan pilihan, bukan urutan waktu.** Blog campuran yang halaman depannya
   kronologis membuat pembaca teknis melihat catatan perjalanan lebih dulu, lalu pergi

Butir 4 adalah satu-satunya yang mengubah perilaku sistem. **Diterima 2026-08-17** lewat instruksi
"continue", tanpa koreksi butir demi butir — jadi statusnya tetap `ASUMSI`, sama seperti 17 item Batch 1.
Yang terkunci karenanya:

- Kategori punya **penanda "diindeks / tidak diindeks"** sebagai data, bukan sebagai pengecualian
  hardcoded. Anda bisa mengubahnya per kategori tanpa menyentuh code
- Kategori yang tidak diindeks: halaman kategorinya `noindex`, tulisan di dalamnya `noindex`, **keluar
  dari sitemap**, tapi **tetap ada di RSS dan tetap punya alamat permanen** (C9)
- Kalau nanti satu tulisan jurnal ternyata layak dicari, penandanya di **tingkat tulisan** boleh menimpa
  penanda kategori. Tanpa ini Anda akan terpaksa memindahkan tulisan antar kategori demi indexing, dan
  itu memaksa keputusan editorial oleh alasan teknis
- **Tidak ada `noindex` yang dipasang tanpa terlihat.** Di CMS harus jelas kelihatan bahwa tulisan ini
  tidak akan muncul di pencarian, karena kesalahan `noindex` yang tidak terlihat adalah salah satu cara
  paling umum situs kehilangan trafik tanpa sadar

### `DICATAT` KB3. Akun untuk komentar di blog yang belum punya pembaca

P4 mempertahankan akun wajib. Konsekuensinya bukan teknis, tapi soal harapan: gabungan **traffic awal
nol** (B5) + **gesekan mendaftar** + **komentar ditahan sampai disetujui** berarti kolom komentar akan
kosong selama berbulan-bulan.

Itu bukan tanda fiturnya gagal. Yang saya sarankan: jangan menilai keputusan ini dari bulan-bulan
pertama, dan jangan menambahkan trik untuk membuat kolomnya terlihat ramai.

Satu hal yang perlu diputuskan di Batch 4: **kolom komentar yang kosong sebaiknya tidak ditampilkan
sebagai kotak kosong** — lebih baik satu ajakan singkat, atau tidak ditampilkan sama sekali sampai ada
komentar pertama.

### `SELESAI` KB4. Ketegangan lama yang hilang sendiri

K1 (nasional vs volume rendah), K5 (5 artikel/hari untuk satu orang), dan seluruh beban kepatuhan pers
**lenyap** karena pivot ini. K3 (tidak ada pendapatan iklan di bulan-bulan awal) tetap berlaku dan
sekarang lebih tajam — lihat KB1.

---

## Yang masih harus dikerjakan

**Batch 3 — Distribusi dan penemuan.** Belum ditulis. Harus ditulis dalam kerangka blog: SEO tanpa
Google News, pencarian internal, analytics, dan media. Ini batch paling penting sekarang karena P2
menjadikan pencarian sebagai satu-satunya jalur pembaca.

**Batch 4 — Komentar, notifikasi, newsletter.** **Menyusut banyak**, bukan tetap penuh seperti dugaan
pertama saya: bentuk subsistem komentar sudah dikunci di K4 (lihat bagian BERLAKU di atas). Yang benar-
benar tersisa hanya reaksi, banned words, tampilan kolom komentar kosong, notifikasi, dan newsletter.

**Batch 5 — Iklan, infrastruktur, teknologi, hukum, skala.** Kategori iklan **menyusut** juga, karena M1
sudah mengunci "tidak ada modul pengiklan/kampanye/invoice, tidak ada marketplace". Kategori hukum
menyusut: tidak ada kewajiban pers dan tidak ada hak jawab formal, tinggal UU PDP, kebijakan privasi,
cookie, dan ketentuan komentar. Teknologi dan infrastruktur tetap penuh.

**Lalu:** Requirement Summary → **persetujuan Anda** → baru arsitektur, database, API, UI, dan code
bertahap.

---

## Yang perlu Anda putuskan dari dokumen ini

**Tidak ada lagi.** Butir 4 KB2 diterima 2026-08-17. Lanjut ke Batch 3
(`batch-03-seo-search-analytics-media.md`).

---

## Catatan verifikasi — 2026-08-17

Dokumen ini diperiksa silang terhadap `decisions.md` setelah versi pertamanya selesai. Tujuh keputusan
lama awalnya terlewat dari klasifikasi dan sudah dimasukkan: **M1, B7, K4, K2, K7, BR1, C7.** Dua di
antaranya penting: M1 adalah keputusan lingkup terbesar di seluruh proyek, dan K4 adalah isi konkret dari
janji "komentar tetap ada".

Tiga hal juga diperbaiki: C1 sempat tercatat dua kali sebagai `BATAL` dan `BERUBAH` sekaligus; C10 dan E4
sempat ditandai `BERLAKU` padahal dasar aslinya adalah Pedoman Media Siber yang sudah batal, jadi
dasarnya diganti secara eksplisit; dan tabel `BATAL` dipecah dua supaya keputusan yang sudah tidak
berlaku **sebelum** pivot tidak terbaca seolah batal karena pivot.

Satu cacat di `decisions.md` juga ditemukan dan sudah diperbaiki di sana: heading `### Dari M1 = B`
hilang, sehingga tiga butir konsekuensi iklan terbaca seolah bagian dari keputusan komentar. Itu sebab
M1 terlewat.
