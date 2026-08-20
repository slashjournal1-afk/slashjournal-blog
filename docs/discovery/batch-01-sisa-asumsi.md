# BATCH 1 — SISA JAWABAN (ASUMSI)

Tujuh belas pertanyaan terakhir Batch 1. **Tidak ada satu pun yang mengubah arsitektur** — semuanya
bisa dikoreksi nanti tanpa biaya rework. Karena itu saya isi dengan rekomendasi, dan Anda hanya perlu
menyebut kode yang **tidak** sesuai.

Semua di bawah ini bertanda `ASUMSI`. Artinya: saya yang memutuskan, alasannya ditulis, dan Anda boleh
menggugatnya kapan saja tanpa saya anggap perubahan lingkup.

Cara mengoreksi — sebut kodenya saja:

```
M2: tidak, tunda AdSense sampai 6 bulan
BR5: jangan biru, saya mau hijau
A5: setuju semua
```

Kalau tidak ada yang dikoreksi, cukup bilang **"lanjut Batch 2"**.

---

## BUSINESS

### B2c. Kanal internasional `ASUMSI: ada, tapi kecil dan tidak diprioritaskan`

Ada satu kategori "Internasional", isinya berita luar negeri yang **berdampak ke Indonesia** —
bukan liputan luar negeri untuk dirinya sendiri.

**Alasan:** portal solo tidak punya cara meliput luar negeri secara mandiri, dan menerjemahkan berita
kantor berita asing tanpa lisensi bermasalah. Tapi topik seperti kebijakan dagang, harga komoditas,
atau teknologi global memang perlu dijelaskan dampaknya ke pembaca Indonesia — dan itu justru pekerjaan
penjelas, yang cocok dengan BR2.

**Yang tidak dilakukan:** menyalin atau menerjemahkan artikel media asing. Itu masalah hak cipta, dan
juga tidak menambah nilai apa pun.

### B9. Nama domain `ASUMSI: tertunda, menunggu B1`

Belum bisa diputuskan karena nama portal belum ada. Yang saya siapkan sekarang: **nama dan domain
disimpan di satu tempat terpusat**, sehingga menetapkannya nanti tidak menyentuh kode di banyak tempat.

Tiga hal yang perlu diperiksa saat nama sudah ada, dan lebih baik diperiksa **sebelum** nama dikunci:
domainnya tersedia atau tidak, nama pengguna media sosialnya masih kosong atau tidak, dan namanya tidak
bertabrakan dengan merek yang sudah terdaftar. Menemukan salah satunya bermasalah setelah logo dibuat
adalah pemborosan yang bisa dihindari.

---

## AUDIENCE

### A2. Wilayah pembaca `ASUMSI: seluruh Indonesia, tanpa pembedaan perlakuan`

Karena B2=C (nasional) dan wilayah bukan dimensi taxonomy, wilayah pembaca **tidak dipakai untuk apa
pun** di sistem: tidak ada konten berbeda per wilayah, tidak ada iklan berbeda per wilayah.

**Yang tetap dicatat:** sebaran wilayah pembaca di analytics, murni sebagai informasi untuk keputusan
editorial nanti. Bukan sebagai fitur.

**Kenapa ini penting untuk ditegaskan:** kalau nanti muncul keinginan "homepage khusus Jawa Barat", itu
bukan penyesuaian kecil — itu membalikkan keputusan B2 dan membongkar keuntungan halaman yang bisa
disiapkan sebelumnya. Lebih baik dijawab sekarang bahwa jawabannya tidak.

### A5. Personalisasi `ASUMSI: tidak ada personalisasi per pembaca`

Semua pembaca melihat halaman yang sama. Yang ada sebagai gantinya, dan sama untuk semua orang:
**paling banyak dibaca**, **topik yang sedang berjalan**, dan **artikel terkait** berdasarkan kategori
dan tag.

**Alasan:** halaman yang isinya sama untuk semua orang bisa disiapkan sebelumnya dan disajikan sangat
cepat. Halaman yang berubah per pembaca tidak bisa — dan itu langsung menabrak plafon biaya B8 serta
pendekatan yang sudah dikunci di A3.

**Ketegangan yang saya sadari:** A1=pembaca muda memang terbiasa dengan umpan yang menyesuaikan diri.
Tapi personalisasi butuh riwayat baca, dan riwayat baca butuh akun yang dipakai untuk membaca — padahal
U1 sengaja membatasi akun hanya untuk komentar. Menambah personalisasi berarti membatalkan pembatasan
itu, menambah data pribadi yang harus dilindungi, dan mengorbankan kecepatan. Untuk portal solo,
"paling banyak dibaca" memberi 80% manfaatnya dengan 5% biayanya.

### A6. Perangkat `ASUMSI: ponsel Android kelas menengah sebagai patokan utama`

Perancangan dan pengujian memakai **ponsel Android kelas menengah pada koneksi seluler** sebagai
patokan, bukan komputer desktop dengan internet cepat.

**Alasan:** di Indonesia mayoritas besar pembaca berita datang dari ponsel, dan pembaca muda (A1) hampir
seluruhnya. Kalau patokannya desktop, halaman akan terasa cepat di komputer Anda dan lambat di tangan
pembaca — dan Anda tidak akan pernah menyadarinya.

**Konsekuensi konkret:** anggaran berat halaman ditentukan dari sisi ponsel; jumlah dan ukuran gambar
dibatasi; penyematan pihak ketiga (YouTube, iklan) dimuat belakangan; dan pengujian kecepatan dilakukan
dengan pembatasan kecepatan jaringan, bukan di jaringan kantor.

**Yang tidak berarti:** bukan berarti versi desktop diabaikan. Layar lebar tetap dirancang baik — hanya
saja perancangannya dimulai dari layar sempit.

---

## BRANDING

### BR1. Logo `ASUMSI: tertunda, menunggu B1`

Tidak bisa dikerjakan sebelum nama ada. Yang bisa disiapkan tanpa nama: **tempat logo di antarmuka**
dengan ukuran dan ruang yang benar, plus penanda sementara.

Saat nama sudah ada, yang dibutuhkan minimal: satu logo utama, satu versi ringkas untuk ruang sempit
(kepala halaman di ponsel), satu ikon untuk tab browser dan ikon aplikasi, dan satu versi untuk gambar
pratinjau share. Empat berkas, bukan satu.

### BR4. Referensi visual pembanding `ASUMSI: tidak memakai portal berita mana pun sebagai acuan`

Sesuai permintaan Anda di awal — konsepnya boleh sebanding dengan portal besar, tapi **desainnya tidak
menyalin**. Jadi acuan visualnya bukan portal berita Indonesia.

Arah yang dipakai (dari BR3=modern bersih + BR2=penjelas + A1=muda): tata letak yang lapang dan
berirama, perbedaan ukuran huruf yang tegas, gambar sebagai penjelas bukan hiasan, dan komponen yang
sedikit tapi dipakai konsisten.

**Yang secara sadar dihindari** karena tiga jawaban Anda: dinding kotak berita berjejal, judul
mengambang di atas foto gelap, angka jumlah dibaca di mana-mana, dan iklan yang menyela sebelum
paragraf pertama.

### BR5. Warna `ASUMSI: satu warna aksen dominan + skala netral, ditentukan setelah nama ada`

Bentuk sistem warnanya sudah bisa diputuskan meski warnanya belum:

- **Satu warna aksen** dipakai hemat — untuk tautan, penanda kategori aktif, dan tombol utama. Bukan
  untuk latar besar
- **Skala netral abu-abu** untuk teks, garis, dan latar. Ini yang mengerjakan 90% tampilan
- **Warna semantik terpisah** untuk peringatan, koreksi, dan label advertorial — supaya label
  "Bersponsor" tidak pernah bisa disalahartikan sebagai penanda kategori
- **Mode gelap disiapkan strukturnya**, tapi tidak wajib selesai di launch

**Yang saya hindari sebagai default:** biru tua. Itu warna yang dipakai hampir semua portal berita
Indonesia, dan memakainya berarti membuang kesempatan dibedakan dengan biaya nol.

Warna pastinya dipilih bersama saat nama sudah ada, karena nama sering membawa asosiasi warnanya
sendiri.

---

## CONTENT

### C5. Sindikasi dan kerja sama konten `ASUMSI: tidak ada di awal`

Tidak menerima konten dari kantor berita, tidak ikut jaringan berbagi konten, tidak menerima kiriman
kontributor luar.

**Alasan:** semuanya menambah kewajiban (kredit kontraktual, pemeriksaan kualitas, moderasi kiriman)
tanpa menambah nilai untuk portal yang belum punya pembaca. Kontributor luar khususnya: pada B6=1,
memeriksa tulisan orang lain memakan waktu yang sama dengan menulis sendiri.

**Yang disiapkan tempatnya karena murah:** artikel punya konsep "sumber asal" sejak desain database,
sehingga menerima kiriman nanti tidak perlu migrasi.

**RSS keluar tetap disediakan** — itu bukan sindikasi, itu cara pembaca dan agregator mengikuti portal,
dan biayanya hampir nol.

### C9. Arsip `ASUMSI: seluruh artikel tetap tersedia selamanya, tanpa penghapusan otomatis`

Tidak ada artikel yang dihapus atau disembunyikan karena usia. Arsip bisa dijelajahi per kategori, per
topik, dan per bulan.

**Alasan:** ini konsekuensi langsung dari strategi evergreen. Artikel penjelas berumur dua tahun bisa
jadi sumber traffic terbesar Anda, dan menghapusnya berarti membuang aset. Selain itu, media yang
menghilangkan artikel lama tanpa jejak merusak kepercayaan.

**Yang berbeda dari menghapus:** kalau sebuah artikel harus ditarik (kesalahan serius, permintaan hukum),
alamatnya **tetap ada** dan menampilkan keterangan bahwa artikel ditarik beserta alasannya — bukan
halaman tidak ditemukan. Ini praktik yang dianjurkan Pedoman Media Siber dan juga lebih jujur.

### C10. Kebijakan koreksi `ASUMSI: koreksi terbuka, tidak pernah diam-diam`

Tiga tingkat, dan pembedaannya penting:

| Jenis | Perlakuan |
| --- | --- |
| Salah tulis / typo yang tidak mengubah makna | Diperbaiki tanpa catatan |
| Kesalahan fakta, angka, nama, atau kutipan | Diperbaiki **dengan catatan koreksi di artikel**, menyebut apa yang salah dan kapan diperbaiki |
| Kesalahan mendasar yang membuat artikel tidak layak | Artikel ditarik, alamatnya tetap ada dengan keterangan penarikan |

**Yang tidak dilakukan:** mengubah fakta tanpa catatan. Portal berita yang mengedit diam-diam kehilangan
kepercayaan lebih cepat daripada portal yang mengaku salah.

**Yang dibutuhkan di CMS:** kolom catatan koreksi, tanggal pembaruan yang ditampilkan terpisah dari
tanggal terbit, dan riwayat perubahan supaya Anda sendiri bisa melihat apa yang berubah. Bentuk
teknisnya ditentukan di phase database.

**Hak jawab** disediakan lewat halaman kontak — wajib menurut Pedoman Media Siber, dan murah.

---

## MONETIZATION

### M2. AdSense `ASUMSI: diajukan setelah ada isi yang layak, bukan di hari launch`

Tidak mengajukan AdSense saat launch. Diajukan setelah portal punya isi yang cukup, halaman kebijakan
yang lengkap, dan traffic yang bukan nol.

**Alasan:** pengajuan yang ditolak membuat pengajuan berikutnya lebih sulit. Situs dengan sedikit
artikel dan tanpa traffic sering ditolak. Lebih baik menunggu daripada ditolak dua kali.

**Yang harus siap sebelum mengajukan:** kebijakan privasi, ketentuan penggunaan, halaman tentang dan
kontak, kebijakan cookie dengan mekanisme persetujuan, dan **halaman iklan yang sudah punya tempat
kosong** — bukan situs yang belum menyentuh iklan sama sekali.

**Konsekuensi yang sudah dicatat di K3:** pendapatan iklan tidak ada di bulan-bulan pertama. Advertorial
(M5) adalah yang bisa dikejar lebih dulu.

### M3. Aturan penempatan iklan `ASUMSI: hemat dan tidak pernah menggeser tata letak`

Ini aturan yang paling saya tegakkan keras, karena BR2=penjelas dan A6=ponsel kelas menengah membuat
iklan yang buruk lebih merusak di portal ini daripada di portal cepat:

- **Tidak ada iklan di atas judul.** Yang pertama dilihat pembaca adalah judul, bukan iklan
- **Setiap slot punya satu ukuran pasti per lebar layar**, dan wadahnya punya tinggi minimum. Tinggi
  yang dipesan saja tidak cukup — ukurannya harus tetap, supaya tata letak tidak pernah bergeser saat
  iklan datang
- **Tidak menerima iklan yang bisa mengembang sendiri.** Ini penyebab pergeseran tata letak yang tidak
  bisa dicegah dari sisi kita
- **Di ponsel:** satu iklan menempel di bawah, plus maksimal dua sampai tiga slot di dalam artikel.
  Tidak lebih
- **Tidak ada iklan layar penuh** yang harus ditutup dulu. Ini penyebab pembaca menutup tab, dan pada
  pembaca yang datang dari WhatsApp mereka tidak kembali
- **Semua slot dimuat belakangan kecuali yang paling atas**
- **Iklan tidak pernah menyela di tengah kalimat atau di tengah kotak konteks.** Penempatan di dalam
  artikel hanya di antara bagian, tidak di sembarang tempat

**Catatan yang jujur:** pengalaman halaman adalah faktor peringkat yang kecil. Alasan utama menegakkan
aturan ini adalah pembacanya, bukan Google.

### M4. Ukuran dan jumlah slot `ASUMSI: sedikit slot, didefinisikan lewat nama, bukan langsung di halaman`

Halaman hanya **menyebut nama slot**; satu tempat terpusat yang memutuskan apa yang tampil di situ —
GAM, AdSense, banner langsung, atau kosong.

**Alasan:** ini yang membuat pergantian penyedia iklan nanti jadi perubahan data, bukan penyuntingan di
seluruh halaman. Ini konsekuensi langsung dari M1=B dan sudah dicatat sebagai keputusan terkunci.

Jumlah slot ditahan sedikit di awal. Menambah slot mudah; mengurangi slot setelah terbiasa dengan
pendapatannya sulit.

### M6. Affiliate `ASUMSI: tidak ada di awal`

Tidak memasang tautan afiliasi. **Alasan:** pada portal penjelas yang menjual kredibilitas, tautan
afiliasi di dalam artikel berita merusak kepercayaan lebih cepat daripada nilai yang dihasilkannya —
terutama sebelum ada pembaca tetap.

**Kalau nanti dipasang**, syaratnya sama dengan advertorial: ditandai sebagai bersponsor, diberi
keterangan yang terlihat pembaca, dan tidak pernah di dalam artikel berita biasa.

### M7. Donasi dan dukungan pembaca `ASUMSI: tidak ada, sesuai B4=A`

B4 sudah dijawab gratis penuh selamanya, yang menutup membership dan donasi. Tidak ada tombol dukung,
tidak ada kotak donasi.

**Kalau ini terasa terlalu ketat**, ini satu-satunya bagian B4 yang bisa dibuka tanpa menyentuh struktur
artikel — donasi tidak butuh tingkat akses, hanya satu halaman dan satu tautan pembayaran. Sebutkan
kalau mau dibuka.

### M8. Newsletter sebagai kanal pendapatan `ASUMSI: newsletter ada, tapi bukan sumber pendapatan`

Newsletter email disediakan sebagai cara pembaca kembali tanpa bergantung pada algoritma media sosial.
Tapi **tidak ada iklan di dalam newsletter** dan tidak ada newsletter berbayar.

**Alasan:** pada B6=1, newsletter yang harus disusun rutin adalah pekerjaan tambahan yang nyata.
Rekomendasi saya: newsletter otomatis (ringkasan artikel terbaru) di awal, bukan yang dikurasi manual —
supaya tidak jadi beban yang ditinggalkan setelah bulan kedua.

**Catatan UU PDP:** menyimpan alamat email pelanggan newsletter adalah data pribadi. Perlu mekanisme
berhenti berlangganan yang benar-benar bekerja dan persetujuan yang jelas saat mendaftar. Ini sudah
tercakup karena U1 sudah membawa kewajiban itu masuk.

---

## Ringkasan yang perlu Anda periksa

Kalau waktu Anda terbatas, tiga ini yang paling mungkin ingin Anda ubah:

| Kode | Asumsi saya | Kenapa mungkin Anda tidak setuju |
| --- | --- | --- |
| **M7** | Tidak ada donasi | Donasi murah dibuka dan tidak menyentuh struktur artikel |
| **A5** | Tanpa personalisasi | Pembaca muda terbiasa umpan yang menyesuaikan diri |
| **BR5** | Hindari biru tua | Mungkin Anda memang menginginkan warna tertentu |

Selain itu, satu hal yang **belum** asumsi dan benar-benar butuh jawaban Anda ada di `decisions.md`
sebagai **K8**: bentuk longform untuk pembaca muda.
