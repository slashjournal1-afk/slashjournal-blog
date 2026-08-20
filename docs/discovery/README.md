# REQUIREMENT DISCOVERY — ~~Portal Berita Profesional~~ → **Blog Pribadi**

> ## ⚠️ ARAH PROYEK BERUBAH — 2026-08-17
>
> User memutuskan proyek ini **bukan portal berita, melainkan blog artikel pribadi**.
>
> **Sumber kebenaran sekarang `decisions-blog.md`.** Di file itu setiap keputusan lama sudah diberi
> penanda `BERLAKU` / `BERUBAH` / `BATAL`. Kalau file lain bertentangan dengannya, `decisions-blog.md`
> yang benar — termasuk `decisions.md`, yang statusnya turun jadi catatan sejarah.
>
> Empat keputusan penataan ulang: isi blog **campuran beberapa jenis tulisan** · pembaca datang dari
> **pencarian Google** · **AdSense + Google Ad Manager dipertahankan** · **komentar tetap ada dengan akun
> wajib**.
>
> Yang **batal** karena bukan lagi media pers: kejar Google News, news sitemap, live blog, breaking news,
> volume 1–5 artikel/hari, cakupan nasional, badan hukum pers, serta kewajiban Pedoman Pemberitaan Media
> Siber dan UU Pers. **UU PDP tetap berlaku.**
>
> Yang **tetap berlaku**: URL netral, blok terstruktur (bertambah jadi 10 tipe), plafon biaya, arsip
> permanen, patokan ponsel, label sumber gambar termasuk ilustrasi AI, login admin dua faktor, dua tabel
> akun terpisah, seluruh aturan penempatan iklan, dan lapisan perantara slot iklan.
>
> Aturan induk tidak berubah: **belum ada code, arsitektur, database, atau UI sampai requirement selesai
> dan disetujui.**

Status: **Phase 1 — Discovery, sedang ditata ulang untuk blog pribadi.**

Dokumen ini adalah peta wawancara requirement. Tujuannya satu: mengeluarkan semua keputusan yang
akan mengunci arsitektur **sebelum** ada satu baris code ditulis, supaya tidak ada rework mahal di
tengah jalan.

---

## Kenapa harus ada wawancara dulu

Situs yang isinya menumpuk punya sifat yang tidak dimiliki aplikasi lain: **URL adalah aset jangka
panjang**. Bentuk URL ditentukan oleh taxonomy (kategori, tag, seri), dan taxonomy ditentukan oleh apa
yang Anda tulis dan untuk siapa.

Mengubah URL setelah launch bukan mustahil — redirect 301 mempertahankan sebagian besar nilai SEO.
Tapi pada skala ribuan artikel biayanya nyata: peta redirect yang harus dipelihara selamanya,
gejolak peringkat sementara, tautan share lama di WhatsApp yang jadi lompatan ganda, dan gambar
yang perlu dipindah. Artinya: **keputusan bisnis di Batch 1 mengunci struktur URL, dan
membetulkannya nanti adalah pekerjaan tersendiri — bukan bencana, tapi bukan hal yang mau Anda
lakukan dua kali.**

Tiga keputusan lain punya efek berantai serupa:

| Keputusan | Kalau salah tebak sekarang | Biaya perbaikan nanti |
| --- | --- | --- |
| Cakupan geografis | Wilayah jadi label biasa, padahal harus jadi dimensi taxonomy | Ubah URL scheme + migrasi seluruh artikel + peta redirect |
| Paywall / premium | Skema artikel tidak punya konsep tingkat akses | Migrasi DB + audit ulang seluruh query publik + risiko konten premium bocor |
| Model iklan | Kode iklan menempel langsung di komponen halaman | Sentuh hampir semua halaman publik |
| Akun pembaca | Tidak ada auth sama sekali | Komentar, bookmark, notifikasi, personalisasi semua menggantung di sini |

Empat baris itu adalah alasan kenapa saya menolak langsung membuat project.

---

## Cara menjawab

Jawab dengan kode pertanyaan. Sesingkat mungkin, tidak perlu kalimat lengkap:

```
B2: B
B4: B
C1: 5-20
M1: A dulu, GAM nanti
BR1: belum ada logo, tolong buat
A3: gak tahu, pakai rekomendasi
```

Tiga cara menjawab yang semuanya sah:

1. **Pilih opsi** — `B2: B`
2. **Serahkan ke saya** — `B2: rekomendasi` (saya pakai rekomendasi saya, dan saya catat itu sebagai
   asumsi yang bisa Anda gugat nanti)
3. **Jawab bebas** — kalau tidak ada opsi yang cocok, tulis saja maunya

Kalau ada istilah teknis yang tidak jelas, bilang `jelaskan B4` dan saya uraikan pakai bahasa
sehari-hari sebelum Anda memutuskan.

---

## Jalur cepat: 11 BLOCKER — `✅ SEMUA TERJAWAB 2026-08-16`

Daftar ini disimpan sebagai catatan: inilah sebelas pertanyaan yang tidak punya default aman, karena
jawabannya mengubah bentuk sistem dan bukan cuma isinya. **Semuanya sudah terjawab.** Jawaban dan
statusnya setelah pivot ada di `decisions-blog.md`.

| # | Pertanyaan | Jawaban | Status setelah pivot |
| --- | --- | --- | --- |
| B2 | Cakupan geografis | Nasional, wilayah jadi kategori biasa | `BATAL` |
| B2b | Kategori/wilayah masuk URL? | **URL netral**, tanpa kategori tanpa tanggal | `BERLAKU` |
| B4 | Gratis atau premium | Gratis penuh selamanya | `BERLAKU` |
| B6 | Ukuran tim | 1 orang | `BERLAKU` |
| B8 | Plafon biaya | Di bawah Rp 500 ribu/bulan | `BERLAKU` |
| A3 | Target traffic | Di bawah 50.000 pageview/bulan | `BERLAKU` sebagai plafon perancangan |
| C1 | Volume terbit | 1–5 artikel/hari | `BERUBAH` → 2–8 tulisan/bulan |
| C2 | Format wajib saat launch | Longform + galeri + live blog | `BERUBAH` → live blog batal, blok kode & tabel ditambah |
| C3 | Video | Embed YouTube saja | `BERLAKU` |
| M1 | Model iklan | **AdSense + Google Ad Manager** | `BERLAKU`, dikonfirmasi ulang saat pivot |
| U1 | Akun pembaca | Wajib, hanya untuk berkomentar | `BERLAKU`, dikonfirmasi ulang saat pivot |

---

## Peta 22 kategori

Nomor di bawah ini **mengikuti daftar 22 kategori yang Anda tulis**, supaya mudah dicek tidak ada
yang hilang. Yang saya ubah hanya **urutan pengerjaannya** — dikelompokkan berdasarkan seberapa besar
pengaruhnya ke arsitektur, bukan urutan aslinya. Kategori yang mengunci struktur data dan URL
didahulukan; kategori yang bisa ditambahkan tanpa membongkar apa pun ditaruh belakang.

### Batch 1 — Fondasi bisnis dan konten `✅ SELESAI 2026-08-16`
Mengunci: taxonomy, struktur URL, model revenue, identitas visual.

- **(1) Business** — nama, cakupan, niche, gratis/berbayar, badan hukum, tim, budget, migrasi
- **(2) Audience** — profil pembaca, wilayah pembaca, device, target traffic, sumber traffic, personalisasi
- **(3) Branding** — logo, tone editorial, referensi visual, domain
- **(4) Content** — volume harian, format konten, video, foto, sindikasi, kedalaman taxonomy
- **(9) Monetization** — stack iklan, AdSense, aturan penempatan, sponsored content, affiliate

### Batch 2 — Manusia dan alur kerja `✅ SELESAI 2026-08-16`
Mengunci: RBAC, state machine artikel, tabel user, **bentuk penyimpanan isi artikel**.

- **(5) Editorial** — workflow, tahap review, role hierarchy, siapa boleh publish, embargo
- **(6) User** — akun pembaca, login sosial, bookmark, follow, riwayat baca, tier pembaca
- **(7) CMS** — isi dashboard, kelengkapan editor, bulk action, preview, revisi, autosave
- **(17) Security** — 2FA, audit log, rate limiting, proteksi brute force, kebijakan sesi

Dokumennya: `batch-02-editorial-user-cms-security.md`. **Sebelas pertanyaan besar di batch ini sudah
terjawab otomatis oleh Batch 1** — tabelnya ada di awal dokumen itu. Yang tersisa empat blocker:
U2 (satu tabel akun atau dua), CM1 (bentuk penyimpanan isi artikel), E2 (entitas penulis), S1 (cara
login admin).

### Batch 3 — Distribusi dan penemuan `← ANDA DI SINI`
Mengunci: metadata, sitemap, ranking, indexing. **Batch paling penting sekarang**, karena keputusan
"pembaca datang dari pencarian Google" menjadikan pencarian satu-satunya jalur pembaca.

- **(10) SEO** — structured data, kanonikal, paginasi, internal linking. `Google News dan news sitemap batal`
- **(13) Search** — teknologi search, autocomplete, toleransi typo, filter
- **(11) Analytics** — GA4, Search Console, analytics internal, metrik per kategori
- **(12) Media** — storage, CDN, optimisasi gambar, kredit foto, watermark, arsip

### Batch 4 — Engagement dan moderasi
Mengunci: subsistem yang bisa ditambah tanpa membongkar arsitektur inti. **Tetap penuh** karena komentar
dengan akun dipertahankan.

- **(14) Comment & Moderation** — `sebagian besar sudah diputuskan di K4`: default tertutup, ditahan
  sampai disetujui, satu tingkat tanpa balasan berjenjang, tanpa shadow ban, tanpa sistem reputasi.
  Yang tersisa: reaksi, banned words, tampilan kolom kosong
- **(15) Notification** — email, notifikasi balasan komentar, per kategori
- **(16) Newsletter** — ritme kirim, provider email, flow subscribe/unsubscribe
- ~~**(23) Breaking News & Trending**~~ — `BATAL 2026-08-17`, tidak berlaku untuk blog

### Batch 5 — Operasional dan teknis
Mengunci: pilihan teknologi, deployment, kepatuhan.

- **(8) Advertising** — ad slot, targeting, frequency cap, direct advertiser, billing, marketplace
- **(18) Infrastructure** — hosting, CI/CD, monitoring, backup, disaster recovery
- **(19) Technology Stack** — frontend, backend, database, cache, search, storage, deployment
- **(20) Legal & Compliance** — kebijakan privasi, cookie, **UU PDP**, ketentuan komentar. `Pedoman Media
  Siber dan hak jawab BATAL 2026-08-17`
- **(21) Scalability** — target skala, caching, replikasi, queue, horizontal scaling
- **(22) Future Features** — rencana ekspansi, fitur yang sengaja ditunda, urutan penambahannya

**Catatan tentang urutan:** Technology Stack sengaja ditaruh di Batch 5, bukan Batch 1. Memilih
teknologi sebelum tahu volume konten dan target traffic adalah cara paling umum membangun portal
berita yang salah ukuran — entah over-engineered (Elasticsearch untuk 3.000 artikel) atau
under-engineered (satu database tanpa cache untuk 1 juta pageview/hari).

**Konsekuensinya untuk Batch 1:** kalau ada nama produk yang muncul di Batch 1 (misalnya di tabel
plafon biaya B8), itu **hanya ilustrasi kelas harga supaya angkanya konkret** — bukan pilihan stack.
Keputusan stack sesungguhnya diambil di Batch 5, setelah B8, A3, dan C1 terjawab.

**Beberapa item sudah ditanyakan lebih awal.** Supaya tidak Anda jawab dua kali, ini yang sudah masuk
Batch 1 meski kategori aslinya ada di batch lain:

| Item | Kategori asli | Sudah ditanya di |
| --- | --- | --- |
| Akun pembaca | (6) User | U1 |
| Kebijakan koreksi artikel | (5) Editorial | C10 |
| Siapa boleh membuat tag/topik baru | (5) Editorial | C8 |
| Target skala traffic | (21) Scalability | A3 |
| Model iklan tingkat tinggi | (8) Advertising | M1 |

---

## Setelah semua batch selesai

Saya **tidak** langsung membuat code. Urutannya:

1. Anda jawab Batch 1 → saya lanjut Batch 2, dan seterusnya
2. Saya susun **Requirement Summary**: PRD, feature matrix, permission matrix, information
   architecture, user flow
3. **Anda review dan setujui** requirement summary itu
4. Baru lanjut ke arsitektur → database → API → dan seterusnya sesuai master prompt
5. Code dikerjakan bertahap per phase, bukan sekali jadi

Tidak ada satu pun langkah yang dilewati tanpa persetujuan Anda.

---

## Log keputusan

Setiap jawaban Anda dicatat beserta tanggal dan alasannya, supaya tiga bulan dari sekarang masih jelas
kenapa sesuatu dirancang begitu. Sejak pivot, statusnya dicatat di `decisions-blog.md`; riwayat lengkap
beserta alasan aslinya tetap di `decisions.md`. Asumsi yang saya ambil sendiri (karena Anda menjawab
"rekomendasi") ditandai khusus sebagai `ASUMSI` supaya mudah digugat.

Enam dokumen, dan ini bedanya:

| Berkas | Isinya |
| --- | --- |
| `README.md` | peta ini — daftar kategori, cara menjawab, urutan phase |
| `decisions-blog.md` | **sumber kebenaran.** Setiap keputusan lama diberi penanda `BERLAKU`/`BERUBAH`/`BATAL`, plus empat keputusan penataan ulang dan ketegangan baru KB1–KB4 |
| `decisions.md` | `catatan sejarah` log lengkap discovery portal berita beserta alasan tiap keputusan dan konflik K1–K8. Disimpan utuh, jangan dihapus |
| `batch-01-business-audience-branding-content-monetization.md` | bank pertanyaan Batch 1 beserta opsi dan alasannya |
| `batch-01-sisa-asumsi.md` | 17 pertanyaan non-blocker Batch 1 yang saya isi sendiri, semua bertanda `ASUMSI` |
| `batch-02-editorial-user-cms-security.md` | bank pertanyaan Batch 2 — editorial, akun, CMS, keamanan |

Kalau isi salah satu berkas bertentangan dengan `decisions-blog.md`, yang benar adalah
`decisions-blog.md`.
