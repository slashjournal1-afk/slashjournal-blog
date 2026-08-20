# 🚀 Master Documentation Index — SlashJournal

Selamat datang di repositori dokumentasi **SlashJournal** — *Enterprise Technical Knowledge Base, Architectural Wiki, & Multi-Channel Engineering Hub*.

Platform ini dirancang dengan standar arsitektur kelas industri, tata letak visual **Awesomic Zinc & Ember Style** (berdasarkan spesifikasi `DESIGN.md`), sistem monetisasi iklan & advertorial terkurasi (`M1-M5`), kepatuhan regulasi **UU No. 27/2022 (UU PDP)**, serta integrasi mesin wiki diagramatik interaktif.

---

## 📚 Dokumen Spesifikasi Arsitektur

| Dokumen | Deskripsi |
|---|---|
| [1. DESIGN_SYSTEM_AND_MONETIZATION.md](./DESIGN_SYSTEM_AND_MONETIZATION.md) | Panduan token desain Awesomic, elevasi hairline 1px (zero drop shadow), penempatan iklan (`BannerAd`, `InFeedAd`, `SidebarStickyAd`), dan aturan pos bersponsor |
| [2. ARCHITECTURE.md](./ARCHITECTURE.md) | Desain basis data terpadu (PostgreSQL / SQLite), relasi model, performa indexing, dan strategi caching |
| [3. AUTH_AND_ROLES.md](./AUTH_AND_ROLES.md) | Multi-role RBAC 4 tingkat (`ADMIN`, `EDITOR`, `AUTHOR`, `READER`), autentikasi sandi Bcrypt + OAuth, dan kepatuhan privasi UU PDP |
| [4. WIKI_AND_CONTENT_ENGINE.md](./WIKI_AND_CONTENT_ENGINE.md) | Spesifikasi tautan konsep `[[WikiLink]]`, diagram sequence Mermaid.js interaktif, cuplikan kode multi-bahasa bertab, dan glosarium A-Z |
| [5. EDITORIAL_WORKFLOW.md](./EDITORIAL_WORKFLOW.md) | Alur redaksi terstruktur (`DRAFT` ➔ `IN_REVIEW` ➔ `PUBLISHED`), Notion-style Slash Editor (`/`), dan riwayat revisi otomatis |
| [6. READER_EXPERIENCE_AND_SEARCH.md](./READER_EXPERIENCE_AND_SEARCH.md) | Command Palette (`Ctrl+K`), pelacakan telemetri kueri pencarian, evaluasi artikel 👍/👎, bookmark pribadi, dan diskusi komentar |

---

## 🎯 Nilai Utama Arsitektur

1. **Anti AI-Sloop & Material Honesty**: Mengikuti presisi `DESIGN.md` — palet zinc restrained (`#f4f4f5` kanvas, `#ffffff` kartu, `#09090b` aksi gelap, `#ff5a00` aksen tunggal), pembulatan sudut 36px/14px/10000px, dan penolakan bayangan jatuh klise (*zero drop shadows*).
2. **Monetisasi Transparan & Kepatuhan UU PDP**: Slot iklan modular (`M4`) yang dipanggil per nama tanpa merusak estetika, label eksplisit `POS BERSPONSOR`, serta penyamaran komentar saat akun dihapus (`U5`).
3. **Pemisahan Kanal & Kredibilitas Penulis**: Pembagian 3 kanal jenis tulisan (*Rekayasa Sistem*, *Desain & Antarmuka*, *Jurnal Personal*) dengan pemisahan indexation untuk privasi jurnal (`KB2`).
