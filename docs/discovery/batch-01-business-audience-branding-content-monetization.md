# BATCH 1 — Business · Audience · Branding · Content · Monetization

Prioritas tiap pertanyaan: **[MUST]** wajib dijawab sebelum lanjut · **[SHOULD]** sebaiknya sekarang,
bisa ditunda satu batch · **[NICE]** boleh dijawab "nanti saja" · **[MUST jika ...]** wajib hanya kalau
syaratnya terpenuhi, kalau tidak lewati saja

Tanda **`🔒 BLOCKER`** artinya: pertanyaan ini tidak punya default yang aman. Kalau saya tebak dan
tebakan saya salah, biayanya bukan refactor kecil.

Cara jawab: `B2: B`, atau `B2: rekomendasi`, atau jawab bebas. Tidak perlu urut, tidak perlu lengkap
sekali jalan.

---

# 1. BUSINESS MODEL

## B1. Nama portal `[MUST]`

Folder project ini bernama `sorotan-lokal`. Saya tidak mau berasumsi — itu nama final, nama kerja,
atau kebetulan saja?

**Kenapa penting:** nama masuk ke domain, logo, `Organization` schema, alamat pengirim email,
watermark foto, nama entitas di halaman About, dan boilerplate footer. Mengganti nama setelah launch
berarti menyentuh puluhan file plus reset sebagian brand recognition di hasil pencarian.

- **A)** "Sorotan Lokal" sudah final
- **B)** Nama kerja saja, final belakangan — pakai placeholder dulu
- **C)** Nama lain (tulis nama yang diinginkan)
- **D)** Belum ada nama, tolong bantu buat beberapa opsi

**Rekomendasi:** kunci satu nama sekarang walau sifatnya sementara. Kalau memang belum yakin, pilih
**B** — dan saya usulkan nama situs disimpan di satu tempat terpusat, tidak ditulis ulang di
banyak berkas, supaya penggantian nanti murah. Bentuk teknisnya diputuskan nanti bersama stack.

---

## B2. Cakupan geografis `[MUST]` `🔒 BLOCKER`

**Ini pertanyaan paling menentukan di seluruh Batch 1.**

**Kenapa penting — pakai bahasa sederhana:** kalau portal Anda hanya meliput satu kota, "wilayah"
cuma label tambahan di artikel. Tapi kalau Anda meliput banyak kota, wilayah berubah jadi **dimensi
kedua** yang setara dengan kategori. Setiap artikel jadi punya dua koordinat: *kategori × wilayah*
(misalnya Ekonomi × Surabaya). Konsekuensinya berantai:

- Bentuk URL bisa berubah — `/ekonomi/judul` vs `/surabaya/ekonomi/judul` (ini pertanyaan tersendiri,
  lihat **B2b**)
- Perlu **homepage per wilayah dengan alamatnya sendiri** (`/surabaya`), bukan satu homepage yang
  isinya berubah diam-diam tergantung siapa yang membuka. Bedanya penting dan saya bahas di A5
- Sitemap biasanya dipecah per wilayah supaya mudah dipantau per desk. *Catatan supaya tidak salah
  paham: batas teknis sitemap adalah 50.000 URL per berkas dan cara standar memecahnya adalah per
  rentang tanggal. Pemecahan per wilayah itu pilihan pengelolaan, bukan keharusan ukuran*
- Pengiklan lokal ingin membeli "banner Surabaya saja" — sistem iklan harus paham wilayah
- Redaksi butuh hak akses per wilayah — editor Malang tidak boleh publish untuk desk Surabaya

Semua itu keputusan struktural. Menambahkannya setelah 5.000 artikel terbit = migrasi URL besar.

| Opsi | Model | Contoh | Biaya build |
| --- | --- | --- | --- |
| **A** | Hyperlocal satu kota/kabupaten | Portal berita Kota Malang saja | Paling murah — wilayah tidak perlu jadi taxonomy |
| **B** | Regional satu provinsi, banyak kota | Jatim dengan desk Surabaya, Malang, Kediri | Sedang — wilayah jadi taxonomy kelas satu, tetap satu domain |
| **C** | Nasional, wilayah sebagai satu kategori biasa | Kompas/CNN model: ada kanal "Regional" | Sedang — wilayah cuma kategori |
| **D** | Nasional + jaringan daerah bersubdomain | Tribunnews: `surabaya.tribunnews.com` | **Paling mahal** — praktis multi-tenant, tiap daerah punya homepage, redaksi, dan revenue sendiri |

**Rekomendasi:** **B** atau **C**, tergantung ambisi. Alasannya:

- **D jangan diambil sekarang.** Model subdomain butuh redaksi terpisah per daerah untuk terisi. Kalau
  belum ada 30+ jurnalis tersebar, subsite akan tampak kosong — dan halaman kategori kosong itu
  merugikan SEO, bukan menguntungkan. D bisa ditambahkan nanti *asalkan* wilayah sudah jadi taxonomy
  kelas satu sejak awal (itu yang opsi B siapkan).
- Kalau nama portalnya benar-benar "Sorotan Lokal", **B** paling cocok: identitas lokal yang jelas,
  wilayah sebagai dimensi nyata, tapi tetap satu domain sehingga seluruh otoritas SEO menumpuk di satu
  tempat — bukan terpecah ke 20 subdomain lemah.

Kalau jawabannya B, C, atau D, saya juga butuh daftar wilayahnya — itu ditanyakan terpisah di **C7**.

---

## B2b. Apakah kategori dan wilayah masuk ke dalam URL artikel `[MUST]` `🔒 BLOCKER`

**Kenapa ini pertanyaan sendiri:** ini sebenarnya *penentu* struktur URL, dan sering dianggap sudah
otomatis padahal tidak. Dua pendekatan sama-sama dipakai portal besar:

- **A) URL memuat kategori** — `/ekonomi/harga-cabai-naik`. Konsekuensinya: satu artikel **harus**
  punya tepat satu kategori utama, karena kalau bisa masuk dua kategori maka ada dua alamat untuk satu
  isi yang sama, dan itu masalah duplikasi di mata Google. Keuntungannya: URL mengandung kata kunci
  dan struktur situs terlihat jelas
- **B) URL netral** — `/berita/harga-cabai-naik` atau `/2026/08/harga-cabai-naik`. Konsekuensinya:
  satu artikel **boleh** masuk banyak kategori tanpa masalah duplikasi, dan memindahkan artikel antar
  kategori tidak mengubah URL-nya. Keuntungannya: fleksibel secara editorial. Kerugiannya: URL
  kurang deskriptif
- **C) Gabungan** — URL netral untuk artikel, tapi kategori dan wilayah tetap punya halaman sendiri
  yang bisa diindeks

**Rekomendasi:** **A** kalau kategori Anda stabil dan editorialnya disiplin (paling umum di portal
berita Indonesia dan paling kuat untuk SEO). **C** kalau Anda memperkirakan artikel sering perlu masuk
lebih dari satu kanal. Yang penting: **jangan pilih A lalu memaksakan artikel punya banyak kategori** —
itu kombinasi yang menimbulkan masalah duplikasi.

Kalau wilayah juga masuk URL (`/surabaya/ekonomi/judul`), berlaku hal yang sama: satu artikel satu
wilayah utama.

---

## B2c. Ada kanal internasional atau tidak `[SHOULD]`

Anda menyebut "lokal, nasional, internasional, atau kombinasi". B2 di atas hanya menutup lokal sampai
nasional, jadi ini saya pisahkan.

- **A)** Tidak ada berita internasional sama sekali
- **B)** Ada, tapi sekadar kanal "Dunia" berisi rangkuman dari sumber lain
- **C)** Ada dan serius — mengutip kantor berita asing secara rutin

**Kenapa penting:** kalau **B** atau **C**, muncul kebutuhan yang tidak ada di berita lokal — lisensi
atau izin kutip dari sumber asing, kewajiban atribusi, penanganan artikel terjemahan (yang punya
aturan kanonikal sendiri), dan kemungkinan butuh dukungan dua bahasa. Ini bersinggungan dengan C5 tapi
tidak sama: C5 soal mengutip sumber Indonesia, ini soal materi asing.

**Rekomendasi:** **A** untuk launch. Kanal internasional yang isinya rangkuman terjemahan adalah
konten yang paling sulit dimenangkan di pencarian, sekaligus paling berisiko soal hak cipta.

---

## B3. Niche atau berita umum `[MUST]`

**Kenapa penting:** menentukan jumlah kategori, profil kompetisi, dan realisme target traffic. Portal
umum bersaing dengan Detik di semua kata kunci — nyaris tidak mungkin dimenangkan pemain baru. Portal
niche bisa mendominasi kata kunci sempit dalam hitungan bulan.

- **A)** Berita umum (politik, ekonomi, olahraga, hiburan, semua)
- **B)** Umum tapi dengan wilayah sebagai pembeda — "semua berita, tapi tentang daerah kami"
- **C)** Niche satu tema (misal: ekonomi daerah, pertanian, pendidikan, otomotif)
- **D)** Umum dengan 1–2 kanal unggulan yang jadi ciri khas

**Rekomendasi:** **B** atau **D**. Kekuatan portal baru bukan di keluasan tapi di **kedalaman yang
tidak digarap pemain besar**. Detik tidak menulis soal APBD kabupaten Anda; Anda bisa. Itu kata kunci
yang bisa dimenangkan, dan justru kata kunci itu yang menarik pengiklan lokal — bukan traffic viral
yang tidak punya pembeli.

---

## B4. Gratis, atau ada konten berbayar `[MUST]` `🔒 BLOCKER`

**Kenapa penting:** paywall bukan fitur yang bisa "ditambah nanti" tanpa rasa sakit. Yang dibutuhkan:
konsep entitlement (siapa berhak baca apa), billing berlangganan, penanganan gagal bayar, refund, dan
— ini yang sering dilupakan — **aturan khusus Google.**

Penjelasan sederhana soal aturan Google: kalau Anda menyembunyikan isi artikel dari pembaca tapi tetap
menunjukkannya ke Googlebot, itu *cloaking* dan bisa membuat situs dihukum. Cara yang benar adalah
menandai artikel berbayar secara eksplisit di structured data — menyatakan artikel ini tidak bebas
diakses, **dan** menunjuk bagian mana dari halaman yang terkunci. Dua-duanya perlu; menyatakan
"berbayar" tanpa menunjuk bagiannya tidak cukup.

Dua hal yang perlu Anda tahu supaya ekspektasinya tepat: penandaan ini melindungi Anda dari tuduhan
cloaking, tapi **tidak menjamin** artikel berlangganan akan diindeks atau berperingkat sebaik artikel
gratis. Dan sejak beberapa tahun lalu Google tidak lagi mewajibkan sejumlah artikel gratis per hari,
jadi Anda bebas menentukan seberapa longgar sampelnya.

- **A)** 100% gratis, sepenuhnya bergantung iklan
- **B)** Gratis sekarang, **tapi tempatnya sudah disiapkan** — paywall belum dibangun
- **C)** Gratis + tier premium sejak hari pertama
- **D)** Tanpa paywall, tapi ada membership (perk: tanpa iklan, newsletter khusus, akses event)

> **Ketergantungan:** opsi **C** mustahil kalau U1 (akun pembaca) dijawab A atau D. Konten premium
> butuh cara mengenali siapa pembacanya. Kalau Anda ingin C, U1 otomatis harus B atau C.

**Rekomendasi:** **B** — ini jawaban termurah yang tetap benar. Yang saya usulkan: artikel punya
konsep *tingkat akses* sejak awal, dan keputusan boleh-baca diambil di **satu tempat terpusat**, bukan
diulang di setiap halaman. Nilainya selalu "gratis" sampai Anda memutuskan sebaliknya. Bentuk kolom dan
tabelnya diputuskan nanti saat desain database, bukan sekarang.

Kenapa satu tempat terpusat itu penting: menambahkan paywall pada sistem yang tidak menyiapkan
tempatnya berarti mengaudit ulang **setiap jalur yang menampilkan isi artikel** — RSS, sitemap, hasil
pencarian, "artikel terkait", preview di homepage, bahkan API kalau ada. Satu jalur yang lupa diaudit
= konten bayar bocor gratis.

---

## B5. Badan hukum dan status pers `[SHOULD]`

**Kenapa penting:** di Indonesia ini bukan formalitas administratif, tapi menentukan akses revenue.

- Iklan pemerintah daerah (belanja APBD untuk publikasi) umumnya mensyaratkan badan hukum PT dan
  verifikasi Dewan Pers. Untuk portal lokal, ini sering **sumber pendapatan yang lebih besar daripada
  AdSense.**
- Verifikasi Dewan Pers juga jadi sinyal kepercayaan yang memperkuat halaman About dan Pedoman Media
  Siber — dan halaman itu termasuk yang dinilai Google untuk E-E-A-T.
- Status ini memengaruhi isi halaman legal yang harus dibuat, jadi berpengaruh ke pekerjaan nyata.

Pertanyaan: (a) sudah ada PT/CV atau belum? (b) sudah/berencana verifikasi Dewan Pers? (c) target
iklan pemerintah daerah?

**Rekomendasi:** kalau targetnya iklan pemerintah, urus PT dan verifikasi sejak awal — prosesnya lama
dan bisa berjalan paralel dengan development. Saya rancang halaman legal, susunan redaksi, dan
Editorial Policy dengan format yang biasa diminta pada proses verifikasi. *Catatan: ini bukan nasihat
hukum — untuk syarat resminya tolong konfirmasi ke konsultan atau langsung ke Dewan Pers.*

---

## B6. Ukuran tim redaksi `[MUST]` `🔒 BLOCKER`

**Kenapa penting:** ini menentukan **kedalaman editorial workflow**, dan salah menilainya merusak
produk dari dua arah. Workflow 6 tahap (Writer → Editor → Senior Editor → Fact Checker → Chief Editor
→ Publish) pada tim 2 orang bikin publish satu berita perlu 4 klik yang semuanya dilakukan orang yang
sama — redaksi akan cari jalan pintas dan workflow-nya jadi hiasan. Sebaliknya, tim 15 orang tanpa
tahap review akan menerbitkan hal yang tidak seharusnya terbit.

- **A)** Solo — saya sendiri yang menulis dan menerbitkan
- **B)** Kecil — 2–4 orang, peran saling tumpang tindih
- **C)** Sedang — 5–15 orang, ada pemisahan penulis dan editor
- **D)** Besar — 15+ orang, berlapis, mungkin per desk/wilayah
- **E)** Mulai solo, rencana tumbuh ke C dalam setahun

**Rekomendasi:** jawab kondisi **hari ini**, jangan kondisi aspirasi. Yang saya usulkan: daftar role
dibuat lengkap sejak awal supaya penambahan orang nanti tidak perlu migrasi, tapi **workflow yang
aktif** disesuaikan ukuran tim sekarang. Menambah tahap review idealnya jadi perubahan konfigurasi,
bukan perubahan struktur — dan itu bisa dicapai kalau alur status artikel dirancang benar sejak awal.
Detail role-nya kita bahas di Batch 2.

---

## B7. Target launch `[MUST]`

- **A)** Secepat mungkin — MVP minimal, sisanya menyusul
- **B)** 1–2 bulan
- **C)** 3–6 bulan, boleh matang
- **D)** Tidak ada tenggat, kualitas dulu

**Kenapa penting:** menentukan apa yang masuk MVP dan apa yang ditunda. Kalau A atau B, saya susun
roadmap agar portal bisa terbit dengan CMS sederhana + halaman publik + SEO dasar dulu, sementara
sistem iklan, analytics, dan komentar menyusul. Yang penting: fondasi database tetap lengkap sejak
awal supaya penambahan nanti tidak jadi migrasi.

---

## B8. Plafon biaya bulanan `[MUST]` `🔒 BLOCKER untuk pilihan stack`

**Kenapa penting:** ini yang memutuskan apakah rekomendasi teknologi saya realistis atau cuma indah di
atas kertas. Beberapa komponen butuh proses yang menyala terus-menerus dan tidak bisa dititipkan pada
layanan gratisan. Video self-host butuh bandwidth yang bisa meledak biayanya justru saat Anda sukses.

*Nama produk di tabel ini hanya ilustrasi kelas harga supaya angkanya konkret. Pilihan stack yang
sebenarnya diputuskan di Batch 5, setelah pertanyaan ini, A3, dan C1 terjawab.*

| Opsi | Kisaran | Kira-kira dapat apa |
| --- | --- | --- |
| **A** | < $25/bln | Paket berbayar termurah dari satu penyedia hosting + database managed kecil + object storage. Cukup untuk launch traffic kecil, ada batasannya |
| **B** | $50–100/bln | Hosting berbayar + database managed + object storage + cache. **Sweet spot untuk portal lokal serius** |
| **C** | $200–500/bln | VPS/cluster managed, mesin pencari terpisah, replika baca, monitoring |
| **D** | > $500/bln | Skala nasional, multi-region, CDN penuh |
| **E** | Belum tahu | Saya rancang agar bisa mulai di A dan naik tanpa membongkar arsitektur |

**Catatan penting soal opsi A:** paket "hobby"/gratis dari banyak penyedia hosting **melarang
penggunaan komersial** di syarat layanannya. Portal berita yang memasang iklan termasuk komersial, jadi
memakai paket gratis berisiko dihentikan sepihak. Kalau memilih A, yang saya maksud adalah paket
berbayar termurah — bukan paket gratis.

**Rekomendasi:** **B**, dan saya rancang supaya bisa berangkat dari A. Prinsipnya: tidak ada komponen
yang hanya bisa jalan di satu vendor. Kalau hosting jadi mahal saat traffic naik, harus bisa pindah
tanpa menulis ulang aplikasi.

---

## B9. Konten lama yang perlu dipindahkan `[SHOULD]`

**Kenapa penting:** kalau ada situs lama (WordPress atau lainnya) yang sudah diindeks, URL lamanya
punya nilai SEO yang **wajib dipertahankan**. Itu berarti: peta redirect 301, mempertahankan slug
lama, memindahkan gambar, dan menjaga tanggal terbit asli. Ini pekerjaan tersendiri yang harus masuk
roadmap, bukan improvisasi di hari launch.

- **A)** Tidak ada, benar-benar mulai dari nol
- **B)** Ada situs lama, kontennya perlu dipindah (sebutkan platform + perkiraan jumlah artikel)
- **C)** Ada situs lama, tapi kontennya dibuang saja
- **D)** Ada konten di platform lain (Medium, Instagram, Facebook Page) yang mau dipindah

---

# 2. TARGET AUDIENCE

## A1. Profil pembaca utama `[MUST]`

**Kenapa penting:** menentukan tingkat kepadatan informasi, ukuran font, gaya bahasa, dan format apa
yang diprioritaskan. Pembaca 45+ butuh font lebih besar dan struktur sederhana; pembaca 18–30 lebih
banyak datang dari share media sosial dan lebih toleran pada layout padat.

Tolong ceritakan empat hal:

- **A1a.** Rentang usia dan pekerjaan/latar mereka
- **A1b.** **Wilayah tempat pembaca berada** — dan kira-kira berapa porsi pembaca dari **luar** wilayah
  liputan Anda. Ini beda dari B2: portal Kota Malang bisa punya banyak pembaca perantau di Jakarta atau
  luar negeri. Kalau porsinya besar, itu memengaruhi penargetan iklan per wilayah, pemilihan lokasi
  server/CDN, dan seberapa berguna A5
- **A1c.** **Berita apa yang paling sering mereka cari** — ini beda dari B3 (apa yang *akan Anda
  liput*). Yang saya tanya di sini adalah sisi permintaan. Jawabannya menentukan kategori mana yang
  layak dapat posisi utama di homepage, dan nantinya jadi masukan untuk formula trending
- **A1d.** Kenapa mereka akan membaca portal Anda dan bukan portal besar

Kalau belum yakin, sebut saja tebakan terbaik Anda — nanti data analytics yang akan mengoreksi.

---

## A2. Perangkat `[MUST]`

- **A)** Mobile-first — asumsi 80–90% pembaca dari HP
- **B)** Campuran seimbang
- **C)** Desktop-first (jarang untuk berita, kecuali audiens kantoran/B2B)

**Rekomendasi:** **A**, hampir pasti. Portal berita Indonesia umumnya 85–92% mobile. Implikasi nyata
yang saya terapkan: budget performa dipatok pada HP Android kelas menengah-bawah di jaringan 4G tidak
stabil, bukan pada laptop dengan wifi kantor. Praktisnya — batas ukuran JavaScript per halaman,
gambar wajib format modern, dan **slot iklan harus punya tinggi tetap** supaya halaman tidak
"melompat" saat iklan muncul (ini salah satu penyebab utama skor Core Web Vitals portal berita jelek).

---

## A3. Target traffic 12 bulan `[MUST]` `🔒 BLOCKER`

**Kenapa penting:** ini menentukan mesin yang dibangun. Beda 10.000 dan 1.000.000 pageview per hari
bukan beda ukuran server, tapi beda arsitektur.

| Opsi | Skala | Yang dibutuhkan |
| --- | --- | --- |
| **A** | < 10rb PV/hari | Satu Postgres, cache sederhana, search bawaan Postgres. Selesai |
| **B** | 10rb–100rb PV/hari | Redis untuk cache, indexing serius, revalidasi terjadwal, gambar via CDN |
| **C** | 100rb–1jt PV/hari | Replika baca, search terpisah, queue untuk pekerjaan berat, agregasi view counter |
| **D** | > 1jt PV/hari | Multi-region, CDN penuh, tabel analytics terpisah, hitung view secara batch |

**Rekomendasi:** rancang untuk **B**, siapkan jalur naik ke **C**.

Satu contoh konkret kenapa angka ini harus diputuskan sekarang: **penghitung view artikel.** Cara
naifnya adalah memperbarui baris artikel setiap kali dibuka. Pada satu berita viral, ribuan pembaruan
per detik menumpuk di baris yang sama — dan yang membunuh bukan sekadar "banyak tulisan", tapi antrean
kunci baris (setiap pembaruan harus menunggu yang sebelumnya selesai), plus sampah versi lama yang
menumpuk di dalam tabel dan membuat query lain ikut melambat. Gejalanya bukan mati mendadak, tapi situs
yang makin lambat justru di jam paling ramai.

Cara yang benar: hitungan ditampung di penyimpanan cepat khusus (counter di cache) atau dicatat sebagai
deretan event yang cuma ditambah tanpa mengubah baris lama, lalu dijumlahkan berkala. Yang **tidak**
bisa dipakai adalah menampung hitungan di memori aplikasi — kalau nanti hostingnya berumur pendek dan
banyak instance, hitungan itu hilang setiap kali instance mati. Keputusan ini mengubah cara data view
disimpan, jadi lebih baik diputuskan sekarang daripada setelah ada angka view yang harus dipertahankan.

---

## A4. Dari mana traffic akan datang `[MUST]`

**Kenapa penting:** setiap sumber traffic menuntut optimasi berbeda, dan tidak semuanya bisa
diprioritaskan sekaligus.

- **A)** Google Search — butuh struktur kategori/tag/topik yang kuat, internal linking rapi
- **B)** Google News — kanal berita khusus. Yang menentukan di sini adalah kecepatan terbit,
  konsistensi, dan kejelasan identitas redaksi. *Catatan: structured data sangat disarankan dan jadi
  syarat untuk beberapa tampilan khusus, tapi bukan gerbang masuk — Google News tidak mensyaratkannya*
- **C)** Google Discover — feed rekomendasi di aplikasi Google. Tidak bisa didaftarkan, hanya bisa
  dilayakkan. Prasyarat praktisnya: gambar besar (panduan Google menyebut lebar minimal 1.200px) dan
  mengizinkan preview gambar ukuran besar. Ini memperbesar kemungkinan tampil, bukan jaminan
- **D)** Share WhatsApp & Facebook — butuh OG image bagus, judul yang bertahan saat dipotong, dan
  halaman yang langsung terbaca di koneksi lambat
- **E)** Direct/loyal — butuh newsletter, notifikasi, akun pembaca
- **F)** Kombinasi (sebutkan mana yang utama)

**Rekomendasi:** untuk portal lokal Indonesia, urutan realistisnya **D → A → C → B → E**. Share
WhatsApp sering jadi sumber terbesar dan paling sering diabaikan secara teknis.

Kalau **C (Discover)** jadi prioritas, konsekuensinya cukup keras dan sebaiknya Anda sadari sekarang:
standar foto naik drastis — setiap artikel praktis wajib punya satu gambar besar berkualitas, yang
berarti beban kerja tambahan untuk redaksi setiap hari, bukan sekadar setelan teknis. Halaman profil
penulis yang lengkap dan kredibel juga jadi jauh lebih penting (ini soal kepercayaan pembaca dan
penilaian kualitas, bukan karena ada penanda teknis yang diwajibkan).

---

## A5. Feed yang dipersonalisasi `[NICE]`

Pembaca melihat homepage berbeda sesuai minat/lokasi?

**Rekomendasi:** **A5 jangan di MVP.** Personalisasi bertabrakan langsung dengan caching — halaman yang
berbeda untuk setiap orang tidak bisa disimpan sebagai satu salinan siap pakai, dan simpanan itulah
alasan utama portal berita bisa cepat sekaligus murah.

Perlu dibedakan dari hal yang mirip tapi aman: **homepage per wilayah** (`/surabaya`, `/malang`) bukan
personalisasi — itu halaman berbeda dengan alamat berbeda, masing-masing tetap bisa disimpan dan
disajikan cepat. Yang mahal adalah satu alamat yang isinya berubah-ubah tergantung siapa yang membuka.
Kalau nanti benar-benar butuh personalisasi, cara yang tepat adalah satu blok kecil yang diisi
belakangan di dalam halaman yang tetap tersimpan — bukan homepage yang berbeda total.

---

## A6. Gaya bahasa `[SHOULD]`

- **A)** Formal, bahasa baku, standar jurnalistik ketat
- **B)** Semi-formal — baku tapi enak dibaca
- **C)** Santai, ringan, dekat dengan gaya media sosial

**Kenapa relevan secara teknis:** memengaruhi panjang judul yang wajar, apakah butuh field subjudul,
dan pola penulisan yang saya pakai untuk semua teks antarmuka (label, tombol, pesan error) agar
konsisten dengan suara redaksi.

---

# 3. BRANDING

## BR1. Aset identitas visual `[MUST]`

- **A)** Sudah ada logo + warna + font, saya kirimkan
- **B)** Ada logo saja, warna dan tipografi tolong dibuat
- **C)** Belum ada apa-apa — tolong rancang identitas lengkap
- **D)** Ada tapi mau diperbarui

**Kenapa penting:** ini bukan soal estetika saja. Logo dibutuhkan dalam **beberapa ukuran wajib**
untuk hal-hal yang berdampak SEO: `Organization` schema butuh logo dengan rasio dan ukuran minimum
tertentu, Google News butuh versi persegi, favicon butuh beberapa resolusi, dan OG image butuh
template 1200×630. Kalau kita tahu ini dari awal, semuanya dibuat sekali dengan benar.

**Rekomendasi:** kalau **C**, saya buat sistem token warna dan tipografi lebih dulu (bukan langsung
logo), karena itu yang mengikat seluruh tampilan. Logo bisa menyusul tanpa menghambat development.

---

## BR2. Karakter editorial dan implikasinya ke tampilan `[MUST]`

**Kenapa penting:** karakter editorial menentukan **kepadatan layout** — dan kepadatan layout adalah
keputusan desain paling menentukan di portal berita, karena ia menentukan berapa banyak berita yang
terlihat sebelum pembaca perlu menggulir.

| Opsi | Karakter | Wujud visualnya |
| --- | --- | --- |
| **A** | Broadsheet berwibawa | Judul serif, spasi lega, sedikit berita di atas layar, kesan "bisa dipercaya" |
| **B** | Cepat dan padat | Sans-serif, banyak headline di atas layar, ringkas, kesan "selalu ada yang baru" |
| **C** | Penjelas / analitis | Longform nyaman dibaca, banyak grafik dan data, kesan "memahami isu" |
| **D** | Lokal hangat | Foto menonjol, nama tempat jelas, terasa dekat dengan pembaca |

**Rekomendasi:** untuk portal lokal, **D dengan disiplin B**. Foto dan nama tempat yang menonjol
membangun kedekatan (itu keunggulan Anda atas portal nasional), tapi kepadatan tetap perlu supaya
halaman depan tidak terasa sepi ketika baru ada 8 berita hari itu. Ini juga alasan saya akan
menghindari layout yang "runtuh" saat konten sedikit — masalah nyata portal baru yang jarang dibahas.

---

## BR3. Referensi visual `[SHOULD]`

Dari daftar portal yang Anda sebut (Detik, Liputan6, Kompas, CNN Indonesia, Tempo, Tribunnews, CNBC
Indonesia): mana yang **layout-nya** Anda suka, dan mana yang tidak? Sebutkan alasannya walau
sederhana ("Kompas kelihatan rapi", "Detik terlalu ramai").

Ini bukan untuk menyalin — desain dan code akan orisinal. Ini untuk memahami selera Anda soal
kepadatan, ukuran foto, dan agresivitas iklan, supaya saya tidak menebak.

---

## BR4. Domain `[MUST]`

- **A)** Sudah punya (sebutkan)
- **B)** Belum, tolong bantu pertimbangkan
- **C)** Sudah punya tapi mau ganti

**Kenapa penting:** domain memengaruhi konfigurasi kanonikal, sitemap, cookie, CORS, dan konfigurasi
email. Pertimbangan praktis: `.id` memberi sinyal geografis dan kredibilitas lokal tapi lebih mahal
dan butuh syarat administratif; `.com` lebih mudah dan netral. Untuk portal lokal Indonesia, `.co.id`
atau `.id` biasanya sepadan.

---

## BR5. Mode gelap `[NICE]`

**Rekomendasi:** ya, tapi dikerjakan dengan cara yang benar sejak awal — semua warna lewat token, tak
ada warna yang ditulis langsung di komponen. Kalau begitu, mode gelap jadi pekerjaan setengah hari
kapan pun diminta. Kalau tidak, jadi pekerjaan seminggu.

---

# 4. CONTENT

## C1. Volume terbit per hari `[MUST]` `🔒 BLOCKER`

**Kenapa penting:** ini mengunci tiga hal teknis sekaligus — cara halaman dihasilkan (di-render saat
diminta vs disiapkan sebelumnya), teknologi pencarian, dan apakah redaksi butuh sistem antrean.

| Opsi | Volume | Konsekuensi teknis |
| --- | --- | --- |
| **A** | 1–5 artikel/hari | Halaman bisa disiapkan sebelumnya, search bawaan database cukup, tanpa queue |
| **B** | 5–20 artikel/hari | Perlu strategi revalidasi terjadwal, search bawaan database masih cukup |
| **C** | 20–50 artikel/hari | Perlu cache berlapis, search mulai perlu mesin terpisah, queue untuk tugas berat |
| **D** | 50–200+ artikel/hari | Skala Detik. Perlu semuanya, plus pemisahan baca/tulis database |

**Rekomendasi:** jawab kondisi realistis 6 bulan pertama, bukan target.

Satu koreksi terhadap anggapan umum, supaya Anda tidak salah membelanjakan uang: **yang memaksa portal
berita memakai mesin pencari terpisah biasanya bukan jumlah artikel.** Pencarian bawaan database
sanggup melayani korpus besar. Yang benar-benar memaksa pindah adalah hal-hal ini:

- **Toleransi salah tulis.** Pencarian bawaan tidak punya ini secara alami, dan pembaca Indonesia
  banyak mengetik dengan typo atau singkatan. Ini biasanya pemicu nomor satu, dan bisa muncul saat
  artikel Anda baru 5.000
- **Autocomplete yang harus terasa instan** saat pengguna mengetik
- **Kombinasi filter + faset + urutan** (kategori × wilayah × rentang tanggal × relevansi) sekaligus
- **Kata kunci yang sangat umum** — mencari "banjir" di portal yang sering menulis banjir bisa lambat
  karena banyak baris yang cocok; ini soal berapa yang cocok per pencarian, bukan besar korpus
- **Kecepatan terbit tinggi** yang membebani pemeliharaan indeks

Jadi keputusan mesin pencari lebih tepat diambil setelah kita bahas kebutuhan search di Batch 3. Yang
saya usulkan sekarang cuma satu hal: **lapisan pencarian dibuat bisa ditukar mesinnya** tanpa mengubah
halaman. Dengan begitu Anda boleh mulai dari yang paling murah dan naik saat gejalanya muncul.

---

## C2. Format konten yang wajib ada saat launch `[MUST]` `🔒 BLOCKER`

**Kenapa penting:** setiap format adalah template terpisah, tipe structured data terpisah, dan
kemampuan editor terpisah. Ini penentu volume pekerjaan yang cukup besar. Jangan pilih semua "supaya
lengkap" — format yang tidak terpakai tetap harus dirawat.

Tandai tiap baris: **wajib saat launch** / **nanti** / **tidak perlu**

| Format | Catatan biaya |
| --- | --- |
| Artikel standar | Wajib, dasar dari semuanya |
| Berita panjang / indepth | Murah — varian template artikel |
| Opini / kolom | Murah, tapi butuh penanda penulis kontributor |
| Wawancara | Murah — varian format |
| Galeri foto | Sedang — butuh viewer, urutan foto, caption per foto |
| Video | Lihat C3 |
| Infografis | Murah kalau berupa gambar; mahal kalau interaktif |
| **Liveblog / laporan langsung** | **Mahal** — subsistem sendiri: entri berurutan, pin, update realtime, penanda khusus untuk mesin pencari |
| Press release | Murah, tapi wajib ditandai supaya tidak dianggap konten redaksi |

*Advertorial dan sponsored content tidak saya masukkan di tabel ini — ditanyakan terpisah di M5 karena
menyangkut aturan penandaan, bukan cuma template.*

**Rekomendasi launch:** artikel standar + galeri foto + opini. Liveblog ditunda kecuali Anda memang
akan meliput pemilu/bencana/pertandingan secara langsung dalam 6 bulan pertama — kalau iya, bilang
sekarang, karena itu memengaruhi desain tabel artikel.

---

## C3. Strategi video `[MUST]` `🔒 BLOCKER untuk storage`

**Kenapa penting:** ini satu-satunya keputusan di Batch 1 yang bisa membuat tagihan bulanan Anda
meledak justru **saat Anda sukses**. Video self-host artinya bayar bandwidth setiap kali video
diputar. Satu video viral bisa menghasilkan tagihan yang tidak sebanding dengan pendapatan iklannya.

- **A)** Embed YouTube saja
- **B)** Self-host di object storage + CDN
- **C)** Layanan video khusus (Cloudflare Stream / Mux / Bunny)
- **D)** Belum butuh video

**Rekomendasi:** **A** untuk launch. Selain gratis dan tanpa risiko bandwidth, video di YouTube
memberi Anda kanal distribusi kedua. Kalau nanti butuh kontrol penuh (misalnya karena mau menjual
iklan pre-roll sendiri), pindah ke **C** — bukan **B**. Self-host tanpa layanan khusus berarti Anda
sendiri yang menangani transcoding ke berbagai resolusi, dan itu pekerjaan besar yang tidak terlihat
di awal.

---

## C4. Sumber foto `[SHOULD]`

Fotografer sendiri / kantor berita (Antara) / stock berbayar / gambar AI / ambil dari sumber lain?

**Kenapa penting secara teknis:** menentukan apakah tabel media butuh field kredit, lisensi, dan
sumber — dan apakah kredit itu **wajib** ditampilkan di bawah foto. Kalau pakai foto kantor berita,
mencantumkan kredit biasanya kewajiban kontrak, jadi sistem harus memaksanya, bukan mengandalkan
kedisiplinan editor.

---

## C5. Sindikasi dan konten kutipan `[MUST]`

Akan ada artikel yang mengutip/menerbitkan ulang dari sumber lain?

**Kenapa penting:** menerbitkan ulang artikel tanpa penanda sumber yang benar membuat halaman Anda
dinilai duplikat oleh Google — halaman Anda tidak diindeks, dan dalam kasus buruk ini menurunkan
penilaian kualitas seluruh domain. Kalau ada konten seperti ini, berarti sistem butuh tempat menyimpan
**URL sumber aslinya** plus aturan kapan itu wajib diisi, dan penanda "sumber" yang tampil ke pembaca.
Bentuk teknisnya diputuskan saat desain database.

---

## C6. Kedalaman taxonomy — penjelasan dulu, lalu pertanyaan `[MUST]`

Anda minta saya menjelaskan bedanya. Ini bagian yang paling sering salah dirancang di portal berita,
jadi saya uraikan dengan cermat.

**Kategori** — struktur navigasi utama. Muncul di menu dan membentuk tulang punggung situs. Sifatnya
sedikit dan stabil: menambah kategori adalah keputusan redaksi, bukan aksi harian.

Soal apakah satu artikel boleh punya lebih dari satu kategori — itu **tergantung jawaban B2b**. Kalau
URL memuat kategori, satu artikel harus punya tepat satu kategori utama (kalau tidak, ada dua alamat
untuk satu isi). Kalau URL netral, banyak kategori tidak masalah. Karena itu B2b saya pisahkan sebagai
pertanyaan sendiri, bukan diputuskan diam-diam di sini.

**Subkategori** — pembagian di dalam kategori. Contoh: Olahraga → Sepak Bola. Berguna hanya kalau
kategori induknya benar-benar padat. Subkategori dengan 6 artikel adalah halaman tipis yang merugikan.

**Tag** — penanda untuk entitas: nama orang, nama tempat, nama organisasi. Satu artikel boleh punya
banyak tag. **Di sini bahaya terbesarnya:** tag bebas melahirkan ratusan halaman nyaris kosong dan
nyaris duplikat ("banjir", "banjir surabaya", "Banjir", "bencana banjir"). Ini persis pola yang membuat
portal berita kehilangan peringkat secara menyeluruh — Google menilai domain penuh halaman tipis.
Solusinya bukan melarang tag, tapi mengendalikannya: tag dipilih dari daftar yang sudah ada, tag baru
perlu persetujuan, dan halaman tag baru diizinkan diindeks setelah punya cukup artikel.

**Topik / dosier** — halaman kurasi untuk isu berjalan, dibuat sengaja oleh editor. Contoh: "Pilkada
2029", "Kasus Korupsi Dinas X". Punya deskripsi, kronologi, dan artikel pilihan. **Ini aset SEO
terkuat yang bisa dimiliki portal berita** — sebab ketika sebuah isu ramai dicari, halaman topik yang
tersusun rapi bisa mengalahkan artikel individual di hasil pencarian, dan ia menahan pembaca lebih
lama daripada satu berita lepas.

**Pertanyaan untuk Anda:**

- **C6a** `[MUST]` Berapa kategori utama saat launch, dan apa saja? **Rekomendasi: 6–8 maksimal.**
  Alasan: kategori kosong terlihat seperti situs terbengkalai, dan itu lebih merugikan daripada tidak
  punya kategori itu sama sekali
- **C6b** `[SHOULD]` Butuh subkategori sejak awal? **Rekomendasi: tidak.** Aktifkan nanti ketika satu
  kategori sudah terasa terlalu padat untuk dijelajahi — patokan angkanya kita tentukan berdasarkan
  data, bukan ditebak sekarang
- **C6c** `[MUST]` Tag: bebas atau terkendali? **Rekomendasi: terkendali** — alasannya di atas
- **C6d** `[SHOULD]` Halaman topik/dosier? **Rekomendasi: ya, sejak awal.** Ini pembeda nyata dari blog
  biasa, dan biayanya sedang

---

## C7. Daftar wilayah `[MUST jika B2 = B/C/D]`

Kalau wilayah jadi bagian taxonomy, saya butuh daftarnya saat launch: provinsi/kota/kabupaten mana
saja. Boleh dimulai kecil (3–5 wilayah) dan ditambah bertahap.

---

## C8. Siapa yang boleh membuat tag dan topik baru `[SHOULD]`

Terkait langsung dengan C6c. Kalau semua penulis boleh membuat tag, kendali hilang dalam sebulan.

**Rekomendasi:** penulis boleh *mengusulkan*, editor yang *menyetujui*. Sistemnya sederhana: tag baru
masuk status "menunggu", artikel tetap bisa terbit, tapi halaman tag belum diindeks sampai disetujui.

---

## C9. Arsip dan konten kedaluwarsa `[NICE]`

Artikel lama (2+ tahun) perlu penanda "berita ini lama"? **Rekomendasi: ya.** Murah dibuat, dan
mencegah masalah nyata: berita lama yang beredar ulang di WhatsApp seolah kejadian hari ini.
Manfaatnya di sisi kredibilitas dan pengalaman pembaca — saya tidak mengklaim ini menaikkan peringkat.

---

## C10. Kebijakan koreksi `[SHOULD]`

Kalau artikel salah dan diperbaiki, yang terjadi:

- **A)** Diam-diam diperbaiki
- **B)** Ada catatan koreksi di bawah artikel
- **C)** Ada riwayat perubahan yang bisa dilihat publik

**Rekomendasi:** **B**. Ini standar jurnalistik, bagian dari penilaian kredibilitas, dan biasanya
termasuk yang dilihat dalam proses verifikasi Dewan Pers.

Konsekuensi teknisnya perlu Anda tahu: **B** hanya butuh catatan koreksi yang ditulis editor — murah.
**C** butuh penyimpanan riwayat perubahan artikel, dan itu keputusan yang bertaut dengan pertanyaan
"apakah CMS perlu fitur revisi/versi" di Batch 2. Jadi kalau Anda memilih C, jawaban itu ikut
menentukan jawaban Batch 2 nanti.

---

# 5. MONETIZATION

## M1. Model iklan `[MUST]` `🔒 BLOCKER — swing scope terbesar di seluruh project`

**Kenapa penting:** perbedaan antara opsi di bawah ini bukan konfigurasi, tapi **ada atau tidak
adanya sebuah subsistem besar**. Saya buka angkanya supaya Anda bisa menimbang dengan jujur:

| Opsi | Isi | Perkiraan beban build |
| --- | --- | --- |
| **A** | Google AdSense saja | ~1 minggu |
| **B** | AdSense + Google Ad Manager | ~2–3 minggu (GAM punya konsep sendiri: ad unit, targeting berbasis key-value) |
| **C** | Sistem direct-sales sendiri (dikelola tim Anda) | **~4–6 minggu tambahan** — pengiklan, kampanye, materi iklan, jadwal tayang, pengaturan laju tayang, hitung impresi & klik, laporan untuk klien, invoice |
| **D** | **Marketplace iklan self-serve** — pengiklan mendaftar sendiri, unggah materi, bayar sendiri | **Paling mahal.** Semua isi C, ditambah: pendaftaran pengiklan dari publik, moderasi materi iklan, pembayaran otomatis, penanganan sengketa, refund. Ini praktis produk kedua di dalam portal Anda |
| **E** | Kombinasi (sebutkan mana saja) | Jumlah dari yang dipilih |

**Rekomendasi — dan ini yang paling saya yakini di seluruh Batch 1. Mohon dikonfirmasi atau ditolak:**

Buat **lapisan perantara untuk slot iklan sekarang, isi dengan AdSense dulu.** Maksudnya: halaman tidak
pernah tahu iklan datang dari mana. Halaman hanya berkata "di sini ada slot dengan nama tertentu".
Satu tempat terpusat yang memutuskan slot itu diisi AdSense, GAM, banner direct, atau dibiarkan kosong —
termasuk aturan per perangkat, per kategori, dan per wilayah.

Kenapa ini penting: portal berita yang menempelkan kode AdSense langsung di komponen halaman akan harus
menyentuh **hampir setiap halaman** ketika berpindah ke GAM atau mulai menjual langsung. Dengan lapisan
perantara, perpindahan itu jadi perubahan data, bukan perubahan code.

Untuk direct-sales (**C**): saya sarankan tempatnya disiapkan di desain database sejak awal, tapi
modulnya dibangun **di phase belakangan** — bukan sekarang. Urutan persisnya kita tentukan saat menyusun
roadmap, setelah requirement disetujui. Alasannya jujur: pengiklan lokal biasanya belum ada di bulan
pertama, tapi begitu ada, mereka datang bersamaan dan Anda tidak mau membangun sistemnya sambil dikejar
klien.

Untuk marketplace (**D**): saya sarankan **jangan**, kecuali memang itu model bisnis intinya. Marketplace
iklan baru masuk akal kalau sudah ada aliran pengiklan yang stabil dan tim Anda kewalahan melayani
manual. Sebelum itu, ia menambah kewajiban (moderasi materi, pembayaran, sengketa) tanpa menambah
pendapatan.

**Peringatan yang perlu Anda tahu sekarang:** AdSense butuh persetujuan, dan situs berita baru dengan
sedikit artikel sering ditolak pada percobaan pertama. **Jangan menyusun rencana revenue yang
bergantung pada AdSense aktif di hari launch.** Untuk portal lokal Indonesia, pendapatan awal yang
realistis biasanya datang dari iklan langsung (UMKM, event, instansi) — bukan AdSense.

---

## M2. Status akun AdSense `[MUST]`

- **A)** Sudah punya dan aktif (sebutkan publisher ID nanti saat implementasi)
- **B)** Punya akun tapi situs ini belum diajukan
- **C)** Belum punya
- **D)** Pernah ditolak / pernah dibanned

**Kenapa penting:** kalau **C** atau **D**, saya rancang agar situs siap diajukan (halaman legal
lengkap, konten cukup, navigasi jelas — hal-hal yang biasa jadi alasan penolakan) dan slot iklan bisa
kosong tanpa merusak layout. Kalau **D**, ini perlu dibicarakan serius karena memengaruhi strategi
revenue secara mendasar.

---

## M3. Aturan penempatan iklan `[MUST]`

**Kenapa penting:** iklan adalah penyebab paling umum tampilan portal berita terasa berat dan
mengganggu. Yang paling merusak adalah iklan yang muncul belakangan lalu **mendorong isi halaman ke
bawah** — pembaca sedang membaca, tiba-tiba teksnya melompat. Ini juga ikut dinilai Google sebagai
bagian dari pengalaman halaman, meski bobotnya sebagai faktor peringkat kecil — jadi alasan utama
membenahinya adalah pembacanya, bukan Google.

**Rekomendasi saya (mohon dikonfirmasi atau ditolak):**

- Setiap slot iklan **memesan ruang dengan tinggi pasti sejak awal** — kalau iklannya tidak muncul,
  ruangnya tetap, tidak ada lompatan. Penting: memesan tinggi saja tidak cukup kalau ukuran iklan yang
  dikirim bisa bermacam-macam. Jadi aturannya perlu ditambah: **satu ukuran pasti per lebar layar**,
  dan **tidak menerima iklan yang bisa mengembang sendiri**
- **Tidak ada iklan di atas judul** artikel — merusak kesan kredibilitas dan menghambat tampilan awal
- Di mobile: satu iklan menempel di bawah layar, ditambah maksimal 2–3 slot di dalam artikel,
  **disisipkan di antara paragraf secara otomatis** — bukan ditempel manual oleh penulis
- **Tanpa iklan yang menutup layar penuh** di halaman artikel
- Iklan hanya dimuat ketika mendekati area pandang, kecuali slot paling atas

Mana yang Anda tolak? Kalau ada tekanan komersial yang membuat aturan ini tidak realistis, lebih baik
saya tahu sekarang daripada merancang sistem yang harus dilanggar.

---

## M4. Ekspektasi pendapatan `[SHOULD]`

Berapa target realistis 12 bulan, dan apakah portal ini harus menghidupi dirinya sendiri atau ada
subsidi dari sumber lain?

**Kenapa saya tanya:** supaya saya tidak merancang sistem yang biaya operasinya melebihi
pendapatannya. Konteks yang jujur: RPM (pendapatan per 1.000 tampilan halaman) AdSense untuk traffic
Indonesia umumnya rendah. Portal lokal yang sehat biasanya bertumpu pada iklan langsung dan kerja sama
instansi, dengan AdSense sebagai pelengkap. Ini memengaruhi prioritas: kalau iklan langsung yang
utama, maka **modul direct-sales lebih penting daripada optimasi AdSense** — dan urutan roadmap
berubah.

---

## M5. Sponsored content dan advertorial `[MUST]`

**Kenapa penting:** konten berbayar yang tidak ditandai adalah pelanggaran serius — bisa memicu
tindakan manual dari Google, dan melanggar Pedoman Media Siber. Yang harus dilakukan sistem, bukan
manusia: label "Advertorial" yang tidak bisa dihapus penulis, tautan keluar bertanda `sponsored`,
dan **pengecualian otomatis dari sitemap berita, feed RSS, serta daftar "artikel terkait" editorial**.

- **A)** Ya, akan ada — buat sistemnya lengkap dengan penandaan otomatis
- **B)** Ya, tapi jarang — tandai manual saja
- **C)** Tidak akan ada

**Rekomendasi:** **A**, kalau ada kemungkinan sama sekali. Perbedaan biayanya kecil, dan aturan
penandaan yang dipaksakan sistem jauh lebih aman daripada mengandalkan ingatan editor saat dikejar
tenggat.

---

## M6. Affiliate `[NICE]`

Akan ada tautan afiliasi (Shopee/Tokopedia/lainnya)?

**Rekomendasi:** siapkan mekanisme penandaan `rel="sponsored nofollow"` otomatis pada domain tertentu.
Murah dibuat sekarang, dan melindungi dari masalah yang muncul belakangan ketika sudah ada ratusan
tautan.

---

## M7. Newsletter sponsorship dan event `[NICE]`

Ada rencana monetisasi lewat sponsor newsletter, event offline, atau kerja sama liputan?

**Kenapa saya tanya sekarang:** kalau iya, newsletter naik prioritas dari "nice to have" menjadi aset
revenue, dan itu berarti butuh pengelolaan daftar pelanggan yang serius (segmentasi, statistik buka,
kelola berhenti langganan) — bukan sekadar form berlangganan.

---

## M8. Penyedia pembayaran `[SHOULD jika ada produk berbayar]`

Kalau ada langganan, membership, atau invoice pengiklan: Midtrans, Xendit, Stripe, atau transfer
manual?

**Rekomendasi:** untuk pasar Indonesia, Midtrans atau Xendit (dukungan QRIS, virtual account,
e-wallet). Untuk invoice pengiklan lokal, transfer manual + pencatatan di CMS biasanya lebih sesuai
kebiasaan bisnis daripada memaksa pembayaran online.

---

# Pertanyaan yang saya angkat ke depan dari Batch 2

## U1. Akun pembaca `[MUST]` `🔒 BLOCKER` — `✅ SUDAH DIJAWAB 2026-08-16: B (dibatasi ke komentar saja)`

> **Jawaban final:** akun **wajib untuk berkomentar**, membaca artikel tetap tanpa login. Setara opsi
> **B**, tapi dipersempit: hanya komentar, tanpa bookmark/follow/riwayat baca/personalisasi.
> Konsekuensi lengkapnya di `decisions.md`. Pertanyaan di bawah disimpan sebagai catatan.

Ini sebenarnya milik Batch 2, tapi efeknya terlalu besar untuk ditunda: komentar, bookmark,
notifikasi, riwayat baca, dan personalisasi **semuanya menggantung pada jawaban ini**.

- **A)** Tidak perlu — pembaca cukup membaca. Komentar lewat pihak ketiga atau tidak ada sama sekali
- **B)** Perlu, tapi minimal: login Google saja, untuk komentar dan bookmark
- **C)** Perlu lengkap: registrasi email, profil, follow kategori/author, riwayat baca, notifikasi
- **D)** Belum sekarang, tapi tempatnya disiapkan

> **Ketergantungan dengan B4:** kalau Anda memilih B4 opsi C (premium sejak hari pertama), maka U1
> **harus** B atau C — konten berlangganan butuh cara mengenali pembacanya. Dua jawaban ini tidak boleh
> saling bertentangan.

**Rekomendasi:** **B** atau **D**. Alasannya: portal berita mendapat sangat sedikit manfaat dari akun
pembaca sampai traffic-nya besar, tapi biaya perawatannya langsung terasa — moderasi komentar,
pemulihan password, penyalahgunaan akun, kewajiban perlindungan data pribadi. **D** paling hemat:
tempatnya ada dan setiap gerbang izin sudah pada posisinya, tapi halaman login belum dibuka.

Satu hal yang perlu diketahui sejak sekarang: begitu Anda menyimpan data pembaca, Anda masuk wilayah
UU Perlindungan Data Pribadi — perlu dasar pemrosesan yang jelas, kemampuan menghapus data atas
permintaan, dan kebijakan privasi yang benar. Itu pekerjaan nyata, bukan formalitas. Menunda akun
pembaca berarti menunda kewajiban itu juga.

---

# Ringkasan — yang minimal saya butuhkan untuk lanjut

Kalau ingin cepat, **11 jawaban ini cukup** dan saya isi sisanya dengan rekomendasi (ditandai
`ASUMSI` supaya mudah Anda koreksi):

```
B2   cakupan geografis          → A / B / C / D
B2b  kategori masuk URL?        → A / B / C
B4   gratis atau premium        → A / B / C / D
B6   ukuran tim redaksi         → A / B / C / D / E
B8   plafon biaya bulanan       → A / B / C / D / E
A3   target traffic 12 bulan    → A / B / C / D
C1   artikel per hari           → A / B / C / D
C2   format wajib saat launch   → sebutkan
C3   video                      → A / B / C / D
M1   model iklan                → A / B / C / D / E
U1   akun pembaca               → A / B / C / D
```

Dua pasangan jawaban yang tidak boleh bertentangan: **B4=C** mengharuskan **U1=B atau C**, dan
**B2b=A** mengharuskan satu artikel punya satu kategori utama saja.

Setelah ini masuk, saya lanjut ke **Batch 2 — Editorial, User, CMS, Security**, dan mulai mengisi
`docs/discovery/decisions.md`.

Kalau ada istilah yang belum jelas, sebut kodenya (`jelaskan M1`) dan saya uraikan lebih sederhana
sebelum Anda memutuskan. Tidak ada yang perlu dijawab dengan menebak.
