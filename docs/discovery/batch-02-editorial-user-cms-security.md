# BATCH 2 — EDITORIAL · USER · CMS · SECURITY

Status: **Batch 1 selesai 2026-08-16.** Batch ini mengunci: siapa boleh melakukan apa, bagaimana isi
artikel disimpan, dan seberapa sulit orang lain mengambil alih portal Anda.

Kategori yang dicakup, mengikuti nomor daftar Anda: **(5) Editorial · (6) User · (7) CMS · (17) Security**.

---

## Kabar baik: sebagian besar Batch 2 sudah terjawab oleh Batch 1

Ini keuntungan nyata dari mendahulukan keputusan bisnis. Sebelas pertanyaan yang biasanya panjang di
tahap ini sudah tertutup tanpa perlu ditanyakan lagi:

| Pertanyaan Batch 2 yang biasanya besar | Sudah dijawab oleh | Jadi apa |
| --- | --- | --- |
| Workflow redaksi berapa tahap | B6=1 orang | Tidak ada tahap review. Tulis → terbit |
| Hierarki role redaksi | B6=1 orang | Satu peran dipakai, sisanya disiapkan sebagai data |
| Siapa boleh publish | B6=1 orang | Anda |
| Embargo dan koordinasi tim | B6=1 orang | Tidak berlaku |
| Siapa boleh buat kategori/tag baru | C8 ← B6=1 | Anda |
| Tier pembaca (gratis/premium) | B4=A | Tidak ada tier |
| Bookmark, follow, riwayat baca | U1 dipersempit | Di luar lingkup |
| Personalisasi per pembaca | A5 | Tidak ada |
| Data pribadi pembaca yang disimpan | U1b + UU PDP | Email + nama tampilan saja |
| Cara pembaca login | U1b | Tautan sekali pakai ke email |
| Status "ditarik" untuk artikel bermasalah | C9 | Wajib ada, alamat tetap hidup |

**Yang tersisa justru yang paling berbahaya kalau salah**, dan itu isi dokumen ini.

---

## Empat blocker Batch 2

Kalau waktu Anda terbatas, jawab empat ini saja. Sisanya saya isi rekomendasi seperti Batch 1.

| # | Pertanyaan | Yang dikunci | Biaya kalau berubah nanti |
| --- | --- | --- | --- |
| **U2** | Akun redaksi dan akun pembaca: satu tabel atau dua | Seluruh arsitektur autentikasi | Migrasi user + audit ulang setiap endpoint |
| **CM1** | Bentuk penyimpanan isi artikel | Semua fitur artikel, dan bisa/tidaknya redesign tanpa sentuh konten | Migrasi seluruh artikel yang pernah ditulis |
| **E2** | Penulis: entitas sendiri atau menempel di akun | Byline, halaman profil penulis, sinyal untuk Google News | Migrasi + tambal byline satu per satu |
| **S1** | Cara login admin | Tingkat keamanan seluruh portal | Murah diubah — tapi mahal kalau terlambat |

---

# (7) CMS

Saya taruh CMS paling depan, bukan Editorial, karena **CM1 adalah keputusan paling mahal di seluruh
Batch 2** — lebih mahal daripada struktur URL, karena menyentuh setiap artikel yang pernah ditulis.

## CM1. Bentuk penyimpanan isi artikel `[MUST]` `🔒 BLOCKER`

**Kenapa ini penting, dan kenapa lebih penting dari yang terlihat.**

Empat keputusan yang sudah Anda kunci di Batch 1 semuanya mengandaikan bahwa sistem **tahu di mana
sebuah bagian artikel berakhir**:

- **M3** — iklan tidak boleh menyela di tengah kalimat, hanya di antara bagian
- **K8** — longform butuh daftar isi otomatis, indikator progres, dan kartu kutipan yang bisa dibagikan
- **C2** — galeri foto harus bisa disisipkan di tengah artikel
- **M5** — blok bersponsor harus bisa ditandai berbeda dari isi redaksi

Kalau isi artikel disimpan sebagai satu gumpalan markup, keempatnya jadi pekerjaan menebak-nebak saat
halaman dirender. Kalau disimpan terstruktur, keempatnya jatuh sendiri.

**Pilihan:**

**A. Rich text, disimpan sebagai HTML.** Editor "seperti Word", hasilnya markup.
Paling cepat dibangun — banyak editor siap pakai. Tapi: menyisipkan iklan antar-bagian harus dengan
membedah HTML saat render dan menebak batas bagian; galeri jadi markup yang ditulis tangan; redesign
berarti cari-ganti di dalam HTML ribuan artikel; dan setiap kekacauan markup dari editor tersimpan
permanen. Juga permukaan keamanan tersendiri, karena HTML dari editor wajib disaring.

**B. Markdown.** Teks polos dengan penanda sederhana. Ringkas, mudah dibandingkan antar-revisi
(kebetulan ini membantu C10 — kebijakan koreksi butuh riwayat perubahan yang bisa dibaca), daftar isi
otomatis dari judul-judul gampang. Kelemahannya: galeri, kartu kutipan, live blog, dan penyematan butuh
sintaks tambahan buatan sendiri.

**C. Blok terstruktur.** Artikel = daftar berurutan dari blok bertipe: paragraf, subjudul, gambar,
galeri, kutipan, penyematan, ringkasan, kotak konteks. Paling banyak kerjanya di awal. Tapi setiap
kebutuhan di atas jadi otomatis: iklan masuk **di antara** blok sehingga mustahil menyela kalimat;
daftar isi dari blok subjudul; kartu kutipan dari blok kutipan; galeri sebagai blok kelas satu; dan
redesign berarti mengganti komponen perender tanpa menyentuh satu pun data artikel.

**Rekomendasi saya: C, dalam bentuk yang sengaja minimalis.** Delapan tipe blok saja saat launch, bukan
pembangun halaman serba bisa. Alasannya bukan kemewahan — empat keputusan terkunci di atas semuanya
butuh batas bagian yang jelas.

**Satu asimetri yang menentukan, dan ini alasan terkuat menghindari A:**

> **Markdown → blok adalah migrasi yang bisa diotomatiskan. HTML → blok tidak bisa.**

Artinya kalau waktu jadi kendala, **B adalah versi hemat yang tetap membuka jalan ke C nanti**. Tapi A
menutup pintu itu — dan menutupnya diam-diam, karena kerugiannya baru terasa saat Anda ingin mendesain
ulang portal di tahun kedua dengan 500 artikel di dalamnya.

## CM2. Pratinjau sebelum terbit `[MUST]`

**Kenapa ini bukan pertanyaan sepele di portal ini.** Halaman publik disiapkan sebelumnya supaya cepat
dan murah (konsekuensi A3 + B8). Artikel yang belum terbit tidak punya halaman siap pakai. Jadi
pratinjau bukan "tinggal lihat halamannya" — ia butuh jalur render tersendiri yang hanya terbuka untuk
Anda.

**Rekomendasi `ASUMSI`:** pratinjau di **alamat asli artikel dengan token rahasia**, bukan panel kecil
di dalam editor. Alasannya A6: patokan perangkat adalah ponsel kelas menengah. Panel pratinjau di dalam
editor desktop selalu berbohong soal tampilan di ponsel — dan itu justru satu-satunya tampilan yang
penting. Dengan token, Anda bisa membuka pratinjau di ponsel sendiri sebelum terbit.

Token harus berumur pendek dan bisa dicabut, karena tautan pratinjau punya kebiasaan bocor.

## CM3. Simpan otomatis dan riwayat revisi `[MUST]`

**Kenapa wajib, bukan sekadar bagus:** pada tim satu orang tidak ada rekan yang bisa memulihkan draf
Anda. Dan C10 (kebijakan koreksi) sudah mewajibkan Anda bisa menjawab "apa yang berubah dan kapan" —
itu tidak bisa dijawab tanpa riwayat.

**Rekomendasi `ASUMSI`:** draf disimpan otomatis; artikel yang sudah terbit menyimpan riwayat setiap
penyuntingan; riwayat tidak pernah dihapus otomatis (ukurannya kecil, nilainya besar saat ada sengketa).

## CM4. Aksi massal `[NICE]`

Pada 1–2 artikel/hari, aksi massal untuk artikel adalah fitur yang belum ada gunanya.

**Tapi satu jenis aksi massal sudah wajib** karena C6 memilih tag bebas: **alat gabung dan ganti nama
tag**. Tanpa itu, tag bebas berubah jadi kekacauan dalam beberapa bulan — "pemilu", "Pemilu",
"pemilu 2029" jadi tiga halaman berbeda yang isinya campur aduk.

**Rekomendasi `ASUMSI`:** tidak ada aksi massal artikel. Alat pengelola tag: ada, dan wajib.

## CM5. Isi dashboard `[SHOULD]`

Dashboard portal solo harus menjawab "apa yang harus saya kerjakan sekarang", bukan memamerkan grafik.

**Rekomendasi `ASUMSI` — empat hal saja:** draf yang sedang dikerjakan · artikel terjadwal · komentar
yang menunggu moderasi · **artikel yang metadata wajibnya belum lengkap** (lihat E8). Grafik traffic
tidak masuk dashboard; itu urusan analytics di Batch 3, dan menaruhnya di depan mata setiap hari
mendorong keputusan editorial yang buruk.

## CM6. Bekerja dari ponsel `[SHOULD]`

**Rekomendasi `ASUMSI`:** editor lengkap **tidak** perlu jalan di ponsel — menulis longform di ponsel
bukan hal yang akan Anda lakukan. Tapi dua hal wajib nyaman di ponsel: **moderasi komentar** dan
**menerbitkan artikel terjadwal**.

Alasannya jujur saja soal perilaku manusia: moderasi komentar adalah pekerjaan harian yang membosankan
(ini isi K4). Kalau hanya bisa dikerjakan di depan laptop, dalam dua bulan tidak akan dikerjakan, dan
kolom komentar berubah jadi masalah reputasi. Kalau bisa diselesaikan sambil di jalan, ia selesai.

## CM7. Unggah dan pengelolaan gambar `[MUST]` — sebagian ditunda ke Batch 3

Detail penyimpanan, CDN, dan optimisasi gambar masuk Batch 3 (Media). Tapi satu hal sudah terkunci oleh
C4 dan perlu ditulis sekarang karena menyentuh alur kerja CMS:

**Setiap gambar wajib punya penanda jenis sumber saat diunggah** — foto sendiri, stok gratis, atau
ilustrasi AI. Unggahan **ditolak** kalau penandanya kosong. Penanda itulah yang menghasilkan label yang
dilihat pembaca, termasuk label wajib "ilustrasi AI".

Kenapa ditegakkan di titik unggah, bukan diingat manual: kalau boleh kosong, ia akan kosong. Dan
ilustrasi AI tanpa label di portal berita adalah masalah kredibilitas yang sulit diperbaiki setelah
terbit.

---

# (5) EDITORIAL

## E1. Status artikel `[MUST]` — sebagian besar sudah tertentukan

Bukan pertanyaan terbuka; ini konfirmasi. Dari keputusan terkunci, status yang **wajib** ada:

| Status | Terlihat publik | Dari mana asalnya |
| --- | --- | --- |
| **Draf** | Tidak | Kebutuhan dasar |
| **Terjadwal** | Tidak, sampai waktunya | E3 |
| **Terbit** | Ya | Kebutuhan dasar |
| **Ditarik** | Ya — alamat tetap hidup, menampilkan keterangan penarikan | **C9 + C10** |

**Dua hal yang biasanya terlewat, dan sebaiknya diputuskan sekarang:**

**Pertama, "ditarik" berbeda dari "salah terbit".** Artikel yang terbit karena salah klik dua menit lalu
dan belum pernah dibagikan tidak butuh nisan permanen — ia cukup dikembalikan jadi draf. Artikel yang
sudah tersebar di WhatsApp lalu ternyata salah **harus** jadi "ditarik", karena menghilangkannya diam-diam
merusak kepercayaan. Jadi keduanya perlu ada, dengan peringatan yang jelas saat memilih.

**Kedua — dan ini yang sering jadi lubang keamanan:** menentukan "perpindahan status A ke B boleh atau
tidak" hanya setengah pekerjaan. Yang juga harus ditulis adalah **siapa yang boleh memicunya** dan
**mana yang tidak dipicu manusia sama sekali**. Terjadwal → terbit bukan hasil klik; ia dipicu waktu.
Dan aturannya harus ditegakkan di lapisan layanan, **bukan dengan menyembunyikan tombol** — tombol yang
disembunyikan tetap bisa dipanggil langsung oleh siapa pun yang tahu caranya.

## E2. Entitas penulis `[MUST]` `🔒 BLOCKER`

**Kenapa ini blocker.** A4 memutuskan mengejar Google News dan Discover. Keduanya menghargai kepenulisan
yang jelas: nama penulis, halaman profil, biodata, byline yang konsisten. Sementara M5 sudah mengunci
bahwa **advertorial tidak boleh membawa byline penulis**. Dua hal itu menekan desain dari arah berlawanan.

**Pilihan:**

**A. Penulis = akun pengguna.** Byline dibaca dari baris akun. Sederhana. Tapi penulis tamu di masa depan
butuh akun login penuh meski tidak pernah login, dan menonaktifkan akun membahayakan byline artikel lama.

**B. Entitas penulis terpisah, boleh ditautkan ke akun.** Artikel menunjuk ke data Penulis (nama,
biodata, foto, tautan sosial, slug untuk halaman profil). Penulis boleh punya akun login, boleh tidak.
Advertorial menunjuk ke **bukan penulis** — atribusi pengiklan yang secara eksplisit bukan byline.

**C. Byline sebagai teks bebas di artikel.** Paling cepat, dan paling merugikan: teks bebas tidak bisa
punya halaman profil, tidak bisa diperbaiki serentak di 300 artikel, dan menghasilkan byline yang
tidak konsisten — justru merusak sinyal yang sedang Anda kejar.

**Rekomendasi: B.** Satu tabel kecil sekarang, dan itulah pembeda antara punya halaman profil penulis
atau tidak. Untuk portal yang mengejar News dan Discover, halaman profil penulis dengan biodata yang
sungguhan adalah salah satu sinyal kredibilitas termurah yang bisa Anda buat.

## E3. Penjadwalan terbit `[SHOULD]`

**Rekomendasi `ASUMSI`:** ada, sederhana — satu tanggal dan waktu.

Alasan praktis: pola kerja solo biasanya menulis malam, dan waktu terbit terbaik bukan tengah malam.

**Satu ketergantungan teknis yang saya catat sekarang supaya tidak jadi kejutan:** karena halaman
disiapkan sebelumnya, artikel terjadwal tidak muncul sendiri hanya karena jamnya lewat — harus ada
pemicu. Cara memicunya (pembangunan berkala vs pemeriksaan saat halaman diminta) adalah keputusan
Phase 3 dan Phase 10, bukan sekarang. Yang penting: **kebutuhannya sudah tercatat sebelum arsitektur
dirancang**, bukan ditemukan setelahnya.

## E4. Alur koreksi di CMS `[MUST]` — turunan C10

Sudah ditentukan oleh C10. Yang dibutuhkan: kolom catatan koreksi, tanggal pembaruan yang ditampilkan
**terpisah** dari tanggal terbit, dan riwayat revisi (CM3). Bentuk teknisnya di Phase 4.

## E5. Halaman profil penulis `[SHOULD]` — bergantung E2

Kalau E2=B: halaman profil per penulis, berisi biodata, foto, dan daftar artikelnya. Kalau E2=C: tidak
mungkin dibuat.

**Rekomendasi `ASUMSI`:** ada, dan diindeks mesin pencari — berbeda dari halaman tag yang sengaja
`noindex`. Bedanya: halaman penulis punya isi orisinal (biodata) dan jumlahnya sedikit, jadi tidak
menimbulkan halaman tipis.

## E6. Kalender redaksi `[NICE]`

**Rekomendasi `ASUMSI`:** tidak ada. Untuk satu orang, daftar draf dan daftar terjadwal di dashboard
sudah cukup. Tampilan kalender adalah hiasan yang harus dipelihara.

## E7. Embargo dan koordinasi `[TIDAK BERLAKU]` — B6=1

## E8. Pemeriksaan wajib sebelum terbit `[SHOULD]` — usulan saya, tidak ada di daftar Anda

Ini pertanyaan yang saya tambahkan, dan menurut saya salah satu yang paling berguna di Batch 2.

**Kenapa.** Pada tim satu orang tidak ada editor yang menangkap kelalaian. Padahal Batch 1 sudah
menghasilkan sederet syarat yang **tidak terlihat saat menulis, tapi merugikan setelah terbit**. Gambar
pratinjau share yang kosong misalnya: artikelnya sempurna, tapi saat dibagikan ke WhatsApp ia tampil
sebagai tautan telanjang — dan A1 menempatkan media sosial sebagai jalur utama pembaca datang.

**Rekomendasi `ASUMSI`:** CMS menahan tombol terbit dan menampilkan daftar yang belum beres kalau ada:

- Gambar utama belum ada → merusak pratinjau share (A1)
- Deskripsi meta belum ada → merusak tampilan di hasil pencarian (A4)
- Kategori belum dipilih → artikel tidak masuk navigasi mana pun (C6)
- Ada gambar tanpa penanda jenis sumber → label wajib tidak bisa dibuat (C4)
- Ilustrasi AI tanpa label → masalah kredibilitas (C4)
- Longform tanpa blok ringkasan di awal → menabrak K8
- Advertorial tanpa penanda bersponsor → pelanggaran serius (M5)

Dua di antaranya **tidak boleh bisa dilewati sama sekali** (penanda sumber gambar, penanda advertorial);
sisanya cukup peringatan yang bisa Anda abaikan dengan sadar.

---

# (6) USER

## U2. Akun redaksi dan akun pembaca: satu tabel atau dua `[MUST]` `🔒 BLOCKER`

**Kenapa ini blocker terbesar Batch 2.**

Sesudah launch, portal ini punya **satu** akun istimewa (Anda) dan berpotensi ribuan akun pembaca yang
**mendaftar sendiri, dari alamat email apa pun, tanpa verifikasi manusia**. Kalau keduanya duduk di satu
tabel dan dibedakan hanya oleh sebuah kolom peran, maka satu celah kecil di pendaftaran atau di
penyuntingan profil bisa menaikkan pembaca mana pun jadi admin.

Ini bukan kekhawatiran teoretis. Ini pola kegagalan yang sangat umum: **kolom peran ikut diterima dari
data yang dikirim browser saat mendaftar.** Membatasi nilainya lewat tipe data di database **tidak
menutupnya** — `ADMIN` adalah nilai yang sah, hanya saja tidak sah untuk dipilih sendiri. Yang harus
ditutup adalah jalurnya, bukan nilainya.

Dan akibatnya di portal berita lebih buruk daripada di aplikasi lain: bukan cuma data bocor, tapi
**artikel palsu terbit dengan nama Anda**. Itu kerusakan kredibilitas yang bertahan setelah insidennya
selesai.

**Pilihan:**

**A. Satu tabel, dibedakan kolom peran.** Sejalan dengan cara kerja hampir semua pustaka autentikasi,
satu alur login. Syarat mutlak kalau memilih ini: kolom peran **tidak pernah** menerima nilai dari
browser — tidak saat mendaftar, tidak saat menyunting profil; pemberian peran adalah tindakan terpisah
yang dilakukan sengaja. Beban kewaspadaan ini melekat pada **setiap** fitur yang Anda tambahkan
selamanya.

**B. Dua tabel terpisah, dua pintu login berbeda.** Pembaca yang diambil alih tidak bisa menjangkau
sisi redaksi karena **jalannya memang tidak ada**. Biayanya: dua alur autentikasi dibangun dan
dipelihara, dua jenis sesi.

**C. Satu tabel, tapi pintu admin mewajibkan faktor kedua yang tidak pernah dimiliki pembaca.**
Menengah: tetap satu tabel, tapi naik peran saja tidak cukup untuk masuk.

**Rekomendasi: B.** Alasannya ketimpangan yang ekstrem — satu akun tepercaya melawan ribuan akun yang
tidak diverifikasi siapa pun. Menjaga satu akun dengan baik itu murah; menjaga tabel campuran yang
99,9% barisnya tidak tepercaya adalah pajak kewaspadaan yang harus dibayar di setiap fitur baru, oleh
satu orang, selamanya.

Dan penghematan dari "berbagi tabel" lebih kecil dari yang terlihat: karena U1 dipersempit, akun pembaca
hanya menyimpan email dan nama tampilan. Nyaris tidak ada yang bisa dibagi.

**Yang jujur harus saya sebut sebagai kelemahan B:** pustaka autentikasi umumnya berasumsi satu tabel
pengguna, jadi B berarti sedikit melawan arus alat. Dan "pembaca naik jadi kontributor" jadi langkah
manual — tapi C5 sudah memutuskan tidak ada kontributor luar, jadi itu bukan kerugian nyata.

## U3. Login sosial `[SHOULD]`

**Pilihan:** hanya tautan email · tautan email + Google · hanya Google.

**Rekomendasi `ASUMSI`, dan bentuknya lebih penting dari pilihannya:**

Implementasikan **hanya tautan email** saat launch — tapi **rancang tabel akun sejak awal supaya satu
akun boleh punya beberapa cara login**. Menambahkan Google nanti jadi pekerjaan sehari; kalau tabelnya
mengasumsikan satu identitas per akun, menambahkannya jadi migrasi.

Kenapa tidak langsung Google padahal A1 pembaca muda dan Google mengurangi gesekan: setiap penyedia
adalah satu integrasi lagi, satu kewajiban pengungkapan privasi lagi, dan satu titik gagal lagi — untuk
fitur yang cuma dipakai berkomentar. Kalau nanti terbukti banyak yang berhenti di langkah pendaftaran,
tambahkan Google saat itu, dengan bukti.

## U4. Nama tampilan komentator `[SHOULD]`

**Pilihan:** wajib nama asli · nama tampilan bebas · dibuatkan otomatis.

**Rekomendasi `ASUMSI`: nama tampilan bebas**, dipilih sekali saat komentar pertama.

Alasan: aturan nama asli tidak bisa ditegakkan tanpa memeriksa identitas, dan memeriksa identitas
berarti menyimpan data pribadi yang jauh lebih sensitif — bertentangan dengan prinsip menyimpan
sesedikit mungkin yang sudah dipilih di U1b.

**Satu hal yang wajib ada dan mudah terlupakan:** daftar nama yang dilarang, supaya tidak ada pembaca
memakai nama yang menyamar sebagai portal atau sebagai redaksi. Prinsipnya sama dengan daftar kata
terlarang untuk slug yang sudah dikunci di B2b.

## U5. Menghapus akun dan data `[MUST]`

Bukan pilihan gaya — ini hak subjek data di UU PDP, dan kewajibannya menempel pada Anda sebagai
pengendali data.

**Yang benar-benar perlu diputuskan bukan "boleh hapus atau tidak", tapi apa yang terjadi pada
komentarnya:**

**A. Komentar dihapus juga.** Paling patuh pada keinginan orang yang ingin jejaknya hilang. Tapi
meninggalkan lubang di percakapan — balasan jadi menggantung tanpa konteks.

**B. Komentar tetap, nama tampilan diganti jadi penanda anonim.** Percakapan tetap bisa dibaca, akunnya
hilang. Tapi kata-katanya masih di sana, dan sebagian orang justru ingin kata-katanya yang hilang.

**Rekomendasi `ASUMSI`: B**, dengan syarat mutlak — **ketentuan penggunaan menyebutkan ini secara jelas
sebelum orang mendaftar**, plus jalur permintaan penghapusan penuh lewat kontak untuk kasus yang memang
butuh. Yang tidak boleh dilakukan adalah menjanjikan "hapus" lalu ternyata hanya menyamarkan nama.

Penghapusan sebaiknya bisa dilakukan sendiri oleh pembaca, bukan lewat permintaan email yang harus Anda
kerjakan manual — karena permintaan manual pada tim satu orang akan menumpuk.

## U6. Daftar peran `[SHOULD]`

B6=1 berarti hanya satu peran dipakai. Tapi **daftarnya sebaiknya ditetapkan sekarang**, karena
menambah peran ke sistem yang tidak pernah membayangkan peran itu mahal.

**Rekomendasi `ASUMSI`:** definisikan **Pemilik · Editor · Penulis · Moderator**, implementasikan
Pemilik saja. Tiga aturan yang ikut terkunci:

1. Peran **tidak pernah** diterima dari data yang dikirim browser
2. Akun baru selalu mendapat peran terendah, tanpa pengecualian
3. Pemeriksaan peran ada di lapisan layanan, bukan di tampilan — menyembunyikan menu bukan keamanan

## U7. Data pembaca yang disimpan `[MUST]` — konfirmasi

Sudah terkunci: **email dan nama tampilan saja.** Tidak ada nomor telepon, tanggal lahir, jenis kelamin,
alamat, atau foto. Setiap kolom tambahan adalah kewajiban tambahan di bawah UU PDP untuk portal yang
tidak akan memakainya.

---

# (17) SECURITY

Konteks yang membuat kategori ini berbeda dari aplikasi biasa: portal ini punya **satu titik kegagalan
tunggal** — akun Anda. Tidak ada rekan yang menyadari kalau ada yang aneh, dan tidak ada yang bisa
membatalkan artikel palsu selain Anda.

## S1. Cara login admin `[MUST]` `🔒 BLOCKER`

**Kenapa ini blocker meski murah diubah.** U1b sudah memutuskan pembaca login lewat tautan email. Kalau
admin memakai cara yang sama, maka **kotak masuk email Anda adalah kunci CMS Anda**. Siapa pun yang
masuk ke email Anda bisa menerbitkan artikel dengan nama Anda — dan sekali lagi, di portal berita itu
lebih buruk daripada mati total.

**Pilihan:**

**A. Sama seperti pembaca: tautan email saja.** Tidak ada yang perlu dibangun tambahan. Paling lemah:
satu faktor, dan faktor itu email.

**B. Password + kode dari aplikasi autentikator.** Dua faktor yang keduanya bukan email. Biayanya:
penyimpanan password kembali masuk — tapi untuk **satu** akun, bukan ribuan, jadi perhitungan risikonya
sama sekali berbeda dari kasus pembaca.

**C. Tautan email + kode dari aplikasi autentikator.** Tidak ada password yang disimpan sama sekali,
tapi tetap dua faktor. Email saja tidak cukup untuk masuk.

**D. Passkey.** Paling kuat dan paling nyaman. Tapi ada bahaya nyata untuk operator tunggal: kalau
perangkatnya hilang dan tidak ada faktor cadangan, Anda bisa terkunci permanen dari portal Anda sendiri.

**Rekomendasi: C.** Ia mempertahankan sifat "tidak menyimpan password" yang sudah Anda pilih, memakai
kembali mesin tautan email yang memang sudah harus dibangun untuk pembaca, dan menambah faktor yang
tidak ikut jatuh saat email jatuh. Hanya ada satu akun yang perlu didaftarkan, jadi kerumitannya sekali
saja.

**B sama-sama masuk akal** — kekuatan sesungguhnya datang dari faktor kedua, bukan dari jenis faktor
pertama. Yang tidak masuk akal adalah A.

Tiga hal yang menyertai apa pun pilihannya: tautan login admin **berumur jauh lebih pendek** daripada
tautan pembaca (menit, bukan jam), sekali pakai, dan **kode pemulihan dicetak di kertas dan disimpan di
luar rumah**. Kode pemulihan yang hanya ada di dalam perangkat yang mungkin hilang bukan pemulihan.

## S2. Pembatasan laju permintaan tautan login `[MUST]` — tidak ada pilihan

Ini konsekuensi langsung U1b dan tidak punya versi "tidak". Dua bentuk serangan yang harus ditutup, dan
keduanya nyata:

**Pertama, menghabiskan kuota email Anda.** Penyerang meminta tautan login berkali-kali; biaya
pengiriman keluar dari kantong Anda, dan domain Anda mulai ditandai sebagai pengirim spam. Kalau domain
Anda ditandai, **pintu masuk seluruh portal ikut rusak** — karena email adalah cara satu-satunya orang
login.

**Kedua, memakai portal Anda untuk mengganggu orang lain.** Penyerang memasukkan email orang lain
berulang kali; korban menerima puluhan email dari nama portal Anda. Yang rusak adalah reputasi Anda,
bukan penyerangnya.

**Yang wajib ada:** batas per alamat email, batas per sumber permintaan, dan **satu batas keras total
per hari** yang tidak bisa dilewati apa pun keadaannya.

## S3. Jejak audit `[SHOULD]`

**Rekomendasi `ASUMSI`:** catat tujuh peristiwa — terbit, batal terbit, penarikan artikel, penyuntingan
artikel terbit, persetujuan/penolakan komentar, perubahan peran, dan setiap login admin (berhasil maupun
gagal). Simpan tanpa batas waktu; ukurannya kecil.

Tujuannya untuk portal solo bukan pengawasan tim — ia untuk menjawab satu pertanyaan pada hari yang
buruk: **"apakah itu saya, atau orang lain?"** Tanpa catatan, pertanyaan itu tidak bisa dijawab.

## S4. Kebijakan sesi `[SHOULD]`

**Rekomendasi `ASUMSI` — sengaja tidak simetris:**

- **Pembaca: sesi panjang** (puluhan hari). Karena login berarti menunggu email, memaksa login ulang
  sering-sering akan membunuh komentar sama sekali
- **Admin: sesi pendek**, dan tindakan sensitif (mengubah peran, menghapus artikel) meminta pembuktian
  ulang meski sesinya masih hidup
- **Tombol "keluarkan semua perangkat"** untuk akun admin. Ini yang Anda cari saat laptop hilang

## S5. Melindungi halaman admin `[SHOULD]`

**Yang tidak saya rekomendasikan sebagai keamanan:** menyembunyikan alamat halaman admin. Itu mengurangi
kebisingan, bukan menutup serangan.

**Yang benar-benar bekerja, dan murah:** halaman admin dikecualikan dari pengindeksan mesin pencari,
setiap login admin (termasuk yang gagal) mengirim pemberitahuan ke Anda, dan pembatasan laju pada pintu
admin lebih ketat daripada pada pintu pembaca.

**Yang saya sarankan tidak dipakai:** membatasi akses admin per lokasi jaringan. Terdengar aman, tapi
untuk satu orang yang berpindah-pindah jaringan seluler, yang paling mungkin terjadi adalah Anda
mengunci diri sendiri.

## S6. Melindungi formulir publik `[MUST]`

Setelah U1 dipersempit, hanya ada **dua** tempat di mana publik bisa menulis ke sistem: permintaan
tautan login, dan pengiriman komentar. Sedikit — dan itu keuntungan besar yang datang dari keputusan
Batch 1.

**Rekomendasi `ASUMSI`:** pembatasan laju di keduanya, batas panjang teks komentar yang keras, dan
pemeriksaan bot yang **tidak terlihat** — bukan teka-teki gambar. Alasannya A1 dan A6: pembaca muda di
ponsel dengan koneksi seluler akan meninggalkan teka-teki, dan yang hilang bukan bot-nya, tapi
komentarnya.

## S7. Backup dan pemulihan `[MUST]` — ditunda ke Batch 5, tapi dicatat sekarang

Detailnya masuk Infrastructure di Batch 5. Yang perlu tercatat sekarang, karena datang dari keputusan
Batch 1: **C9 memutuskan arsip disimpan selamanya**, jadi basis data artikel adalah aset yang tidak
tergantikan — B5 sudah memastikan tidak ada sumber lain untuk memulihkannya. Gambar nomor dua.

## S8. Ketentuan penggunaan komentar `[MUST]` — dikerjakan di Batch 4

Wajib menurut Pedoman Pemberitaan Media Siber, dan juga salah satu syarat sebelum mengajukan AdSense
(M2). Isinya ditulis bersama aturan komentar di Batch 4, bukan sekarang, supaya tidak ditulis dua kali.

---

## Ringkasan: yang perlu Anda jawab

**Empat blocker** — U2, CM1, E2, S1.

**Delapan pertanyaan tingkat dua** yang saya isi `ASUMSI` dan bisa Anda koreksi: CM2, CM6, E3, E8, U3,
U4, U5, S4.

**Sisanya** turunan Batch 1 atau tidak punya versi alternatif yang masuk akal.

Kalau tidak ada yang ingin dikoreksi selain empat blocker, cukup jawab empat itu dan katakan "sisanya
pakai rekomendasi".
