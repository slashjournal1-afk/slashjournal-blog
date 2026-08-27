import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Awesomic Editorial Blog & Technical Wiki...');

  // 1. Multi-Role Users with Bcrypt Password Hash
  const defaultPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  const adminHashedPassword = await bcrypt.hash('AdminPassword123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@slashjournal.dev' },
    update: {},
    create: {
      email: 'admin@slashjournal.dev',
      name: 'Choirul',
      displayName: 'Choirul (Chief Architect & Penulis Utama)',
      passwordHash: adminHashedPassword,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@slashjournal.dev' },
    update: {},
    create: {
      email: 'editor@slashjournal.dev',
      name: 'Sarah Reviewer',
      displayName: 'Sarah (Staff Editor)',
      passwordHash: hashedPassword,
      role: 'EDITOR',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    },
  });

  const reader1 = await prisma.user.upsert({
    where: { email: 'budi@example.com' },
    update: {},
    create: {
      email: 'budi@example.com',
      name: 'Budi Santoso',
      displayName: 'Budi (Software Engineer)',
      passwordHash: hashedPassword,
      role: 'READER',
    },
  });

  console.log('✓ Users created');

  // 2. Categories / Sub-blogs
  const catRekayasa = await prisma.category.upsert({
    where: { slug: 'rekayasa-sistem' },
    update: {},
    create: {
      name: 'Rekayasa Sistem',
      slug: 'rekayasa-sistem',
      description: 'Analisis arsitektur sistem skala besar, konsistensi data terdistribusi, dan database engineering.',
      icon: 'Server',
      isIndexable: true,
      sortOrder: 1,
    },
  });

  const catDesain = await prisma.category.upsert({
    where: { slug: 'desain-antarmuka' },
    update: {},
    create: {
      name: 'Desain & Antarmuka',
      slug: 'desain-antarmuka',
      description: 'Eksplorasi antarmuka modern, filosofi Awesomic Zinc, micro-animations, dan Core Web Vitals.',
      icon: 'Layout',
      isIndexable: true,
      sortOrder: 2,
    },
  });

  const catJournal = await prisma.category.upsert({
    where: { slug: 'jurnal-personal' },
    update: {},
    create: {
      name: 'Jurnal Personal',
      slug: 'jurnal-personal',
      description: 'Refleksi perjalanan rekayasa, renungan arsitektur, dan catatan harian tanpa pengindeksan agresif.',
      icon: 'BookOpen',
      isIndexable: false, // KB2: Excluded from search indexation for privacy
      sortOrder: 3,
    },
  });

  console.log('✓ Categories created');

  // 3. Series
  const seriesScale = await prisma.series.upsert({
    where: { slug: 'arsitektur-skala-besar' },
    update: {},
    create: {
      title: 'Pondasi Arsitektur Skala Besar',
      slug: 'arsitektur-skala-besar',
      description: 'Kumpulan panduan rekayasa sistem berkinerja tinggi, toleransi kegagalan, dan transaksi terdistribusi.',
      isPublished: true,
      sortOrder: 1,
    },
  });

  const seriesUI = await prisma.series.upsert({
    where: { slug: 'rekayasa-antarmuka-modern' },
    update: {},
    create: {
      title: 'Rekayasa Antarmuka & Awesomic Style',
      slug: 'rekayasa-antarmuka-modern',
      description: 'Pola desain Awesomic Zinc Style dengan hairline borders, tipografi display tebal, dan aksen Ember.',
      isPublished: true,
      sortOrder: 2,
    },
  });

  console.log('✓ Series created');

  // 4. Tags
  const tagSystem = await prisma.tag.upsert({ where: { slug: 'system-design' }, update: {}, create: { name: 'System Design', slug: 'system-design' } });
  const tagPostgres = await prisma.tag.upsert({ where: { slug: 'postgresql' }, update: {}, create: { name: 'PostgreSQL', slug: 'postgresql' } });
  const tagNext = await prisma.tag.upsert({ where: { slug: 'nextjs' }, update: {}, create: { name: 'Next.js', slug: 'nextjs' } });
  const tagUI = await prisma.tag.upsert({ where: { slug: 'ui-ux' }, update: {}, create: { name: 'UI/UX', slug: 'ui-ux' } });

  console.log('✓ Tags created');

  // 5. Glossary Terms (A-Z Architecture Concepts)
  const glossaryData = [
    {
      term: 'ACID Transactions',
      slug: 'acid-transactions',
      category: 'Database',
      shortDef: 'Prinsip Atomicity, Consistency, Isolation, dan Durability yang menjamin keandalan transaksi database relasional.',
      definition: `**ACID Transactions** adalah standar emas keandalan database relasional (RDBMS) seperti PostgreSQL.
- **Atomicity**: Transaksi dieksekusi seluruhnya atau dibatalkan sama sekali (*all-or-nothing*).
- **Consistency**: Data berpindah dari satu kondisi valid ke kondisi valid lainnya.
- **Isolation**: Transaksi konkuren tidak saling mencemari data yang belum di-commit.
- **Durability**: Sekali transaksi berhasil di-commit, perubahannya permanen meski sistem mengalami crash.`,
    },
    {
      term: 'Circuit Breaker Pattern',
      slug: 'circuit-breaker-pattern',
      category: 'Arsitektur',
      shortDef: 'Pola stabilitas sistem terdistribusi untuk mengisolasi kegagalan layanan dependensi agar tidak meluas (*cascading failure*).',
      definition: `**Circuit Breaker** memantau tingkat kegagalan pemanggilan layanan eksternal.
Memiliki 3 status utama:
1. **Closed**: Permintaan mengalir normal.
2. **Open**: Saat batas kegagalan terlampaui, pemanggilan langsung digagalkan seketika tanpa membebani jaringan (*fail-fast*).
3. **Half-Open**: Menguji beberapa request untuk melihat apakah layanan hilir sudah pulih kembali.`,
    },
    {
      term: 'Idempotency Key',
      slug: 'idempotency-key',
      category: 'API & Protokol',
      shortDef: 'Pengidentifikasi unik untuk menjamin request pembayaran atau mutasi data dieksekusi tepat sekali (*exactly-once semantics*).',
      definition: `Header \`Idempotency-Key\` dikirimkan klien saat memanggil endpoint mutasi (seperti transfer uang atau pembuatan order). Jika klien mengirim ulang request yang sama karena timeout jaringan, server mengembalikan respon yang sama tanpa menduplikasi transaksi.`,
    },
    {
      term: 'Row Level Security (RLS)',
      slug: 'row-level-security',
      category: 'Keamanan',
      shortDef: 'Fitur keamanan database tingkat baris yang membatasi hak akses data berdasarkan konteks user/tenant aktif.',
      definition: `**Row Level Security (RLS)** pada PostgreSQL memastikan bahwa aplikasi web atau pengguna SQL hanya dapat membaca dan memanipulasi baris data milik mereka sendiri, diatur langsung oleh mesin database melalui policy SQL deklaratif.`,
    },
  ];

  for (const item of glossaryData) {
    await prisma.glossaryTerm.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, authorId: admin.id },
    });
  }

  console.log('✓ Glossary Terms seeded');

  // 6. Ad Slots (M1, M3, M4)
  await prisma.adSlot.upsert({
    where: { slotName: 'top_banner' },
    update: {},
    create: {
      slotName: 'top_banner',
      title: 'Deploy Frontend dalam Hitungan Detik di Edge Global',
      description: 'Build, preview, dan ship aplikasi Next.js lewat jaringan edge di 100+ region.',
      targetUrl: 'https://vercel.com',
      sponsorName: 'Vercel Edge Network',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1940&h=180&fit=crop&auto=format&q=80',
      isActive: true,
    },
  });

  await prisma.adSlot.upsert({
    where: { slotName: 'below_hero' },
    update: {},
    create: {
      slotName: 'below_hero',
      title: 'Serverless Postgres dengan Database Branching',
      description: 'Cabang database terpisah untuk setiap pull request, tanpa mengganggu data produksi.',
      targetUrl: 'https://neon.tech',
      sponsorName: 'Neon Postgres',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1940&h=500&fit=crop&auto=format&q=80',
      isActive: true,
    },
  });

  await prisma.adSlot.upsert({
    where: { slotName: 'leaderboard' },
    update: {},
    create: {
      slotName: 'leaderboard',
      title: 'Next-Gen Postgres Platform',
      description: 'Serverless PostgreSQL dengan instant branching dan integrasi Edge computing.',
      targetUrl: 'https://supabase.com',
      sponsorName: 'Supabase Database',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  await prisma.adSlot.upsert({
    where: { slotName: 'in_feed' },
    update: {},
    create: {
      slotName: 'in_feed',
      title: 'Deploy Fullstack Apps in Milliseconds at the Global Edge',
      description: 'Jalankan komputasi tanpa server dengan latency di bawah 15ms di 300+ kota seluruh dunia.',
      targetUrl: 'https://workers.cloudflare.com',
      sponsorName: 'Cloudflare Edge Platform',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  await prisma.adSlot.upsert({
    where: { slotName: 'sidebar_sticky' },
    update: {},
    create: {
      slotName: 'sidebar_sticky',
      title: 'Enterprise Distributed Tracing & Observability',
      description: 'Pantau performa mikroservis, bottleneck query, dan error secara real-time.',
      targetUrl: 'https://datadoghq.com',
      sponsorName: 'Datadog APM',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });

  console.log('✓ Ad Slots created');

  // 7. Rich Articles with Awesomic styling, Mermaid, MultiTab Code, and Pos Bersponsor
  const art1 = await prisma.article.upsert({
    where: { slug: 'merancang-sistem-idempotensi-transaksi' },
    update: {},
    create: {
      title: 'Merancang Sistem Idempotensi Transaksi pada Arsitektur Mikroservis',
      slug: 'merancang-sistem-idempotensi-transaksi',
      excerpt: 'Studi kasus implementasi Idempotency Key dengan Redis & PostgreSQL untuk mencegah mutasi ganda pada jaringan yang tidak stabil.',
      categoryId: catRekayasa.id,
      seriesId: seriesScale.id,
      seriesOrder: 1,
      status: 'PUBLISHED',
      readingTime: 6,
      viewCount: 480,
      helpfulVotes: 35,
      unhelpfulVotes: 1,
      coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
      coverImageSourceType: 'FREE_STOCK',
      authorId: admin.id,
      publishedAt: new Date(),
      contentMarkdown: `## Pengantar Idempotensi pada Jaringan Terdistribusi

Dalam sistem terdistribusi, kegagalan jaringan (*network timeout*) adalah keniscayaan. Ketika klien mengirim permintaan mutasi keuangan dan tidak menerima respons karena timeout, klien tidak dapat mengetahui apakah transaksi berhasil dieksekusi di backend atau gagal di tengah jalan.

Solusi standarnya adalah menerapkan [[idempotency-key]] yang menjamin bahwa request yang sama dapat dikirim berulang kali tanpa menghasilkan mutasi ganda.

---

## Diagram Alur Eksekusi Idempotency Key

Berikut adalah sequence diagram alur kerja lock idempotensi menggunakan Redis dan [[acid-transactions]] pada database utama:

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Client as Klien / Gateway
    participant Lock as Redis Idempotency Cache
    participant Service as Payment Service
    participant DB as PostgreSQL Database

    Client->>Service: POST /payments (Header: Idempotency-Key)
    Service->>Lock: SETNX idempotency:KEY { status: IN_PROGRESS }
    alt Lock Berhasil Diperoleh
        Lock-->>Service: OK (Lock Acquired)
        Service->>DB: Eksekusi Mutasi Akun & Catat Transaksi
        DB-->>Service: Commit Sukses
        Service->>Lock: SET idempotency:KEY { status: COMPLETED, response: DATA }
        Service-->>Client: 201 Created (Data Pembayaran)
    else Lock Sudah Ada (In-Progress)
        Lock-->>Service: EXISTS (Status: IN_PROGRESS)
        Service-->>Client: 409 Conflict / 425 Too Early (Sedang Diproses)
    else Transaksi Sudah Selesai (Completed)
        Lock-->>Service: EXISTS (Status: COMPLETED, cached_response)
        Service-->>Client: 200 OK (Mengembalikan Respons Tersimpan)
    end
\`\`\`

---

## Implementasi Kode Multi-Bahasa

Berikut adalah contoh middleware validasi idempotensi dalam beberapa ekosistem bahasa:

\`\`\`tabs
// tab: TypeScript (Next.js / Node.js)
import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function handleIdempotency(req: NextRequest, handler: () => Promise<NextResponse>) {
  const idempotencyKey = req.headers.get('x-idempotency-key');
  if (!idempotencyKey) {
    return NextResponse.json({ error: 'Idempotency-Key wajib disertakan' }, { status: 400 });
  }

  const cacheKey = \`idemp:\${idempotencyKey}\`;
  const existing = await redis.get(cacheKey);

  if (existing) {
    return NextResponse.json(JSON.parse(existing), { status: 200 });
  }

  const response = await handler();
  const responseData = await response.json();

  await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 86400);
  return NextResponse.json(responseData, { status: response.status });
}
// tab: Go (Golang)
package middleware

import (
	"context"
	"net/http"
	"github.com/go-redis/redis/v8"
)

func IdempotencyMiddleware(rdb *redis.Client, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		key := r.Header.Get("X-Idempotency-Key")
		if key == "" {
			http.Error(w, "X-Idempotency-Key is required", http.StatusBadRequest)
			return
		}

		ctx := context.Background()
		cached, err := rdb.Get(ctx, "idemp:"+key).Result()
		if err == nil && cached != "" {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(cached))
			return
		}

		next.ServeHTTP(w, r)
	})
}
\`\`\`

---

## Pola Mitigasi Kegagalan Tambahan

Untuk layanan pembayaran kritis, sistem juga harus dipadukan dengan [[circuit-breaker-pattern]] guna memastikan degradasi yang anggun (*graceful degradation*) saat gateway perbankan hilir mengalami down.`,
    },
  });

  // Sponsored article (M5)
  const art2 = await prisma.article.upsert({
    where: { slug: 'akselerasi-query-analytics-clickhouse-cloud' },
    update: {},
    create: {
      title: 'Mempercepat Kueri Analitik Data Besar dengan Arsitektur Kolumnar',
      slug: 'akselerasi-query-analytics-clickhouse-cloud',
      excerpt: 'Mengeksplorasi optimasi database kolumnar untuk aggregasi data milyaran baris dengan latensi di bawah 50ms.',
      categoryId: catRekayasa.id,
      status: 'PUBLISHED',
      isSponsored: true, // M5
      sponsorName: 'ClickHouse Cloud',
      sponsorUrl: 'https://clickhouse.com',
      readingTime: 4,
      viewCount: 310,
      helpfulVotes: 21,
      unhelpfulVotes: 0,
      coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
      coverImageSourceType: 'FREE_STOCK',
      authorId: admin.id,
      publishedAt: new Date(),
      contentMarkdown: `## Kebutuhan Analitik Waktu Nyata

Dalam platform dengan volume transaksi tinggi, mengeksekusi kueri agregasi \`COUNT\`, \`SUM\`, dan \`GROUP BY\` pada database transaksional baris (Row-Oriented OLTP) seperti PostgreSQL standar dapat memicu degradasi kinerja yang signifikan.

Database kolumnar seperti ClickHouse menyimpan data per kolom pada disk fisik, sehingga kueri analitik hanya membaca kolom yang relevan, menghasilkan kompresi data hingga 90% dan kecepatan kueri ratusan kali lebih tinggi.

---

## Benchmark Kinerja OLTP vs OLAP

| Parameter | PostgreSQL OLTP | ClickHouse OLAP |
|---|---|---|
| Latensi Kueri 100 Juta Baris | ~ 4.2 detik | ~ 45 milidetik |
| Rasio Kompresi Disk | 1x (Mentah) | 5x - 10x Kompresi |
| Skenario Penggunaan | Transaksi ACID Tunggal | Aggregasi & Telemetri Masif |`,
    },
  });

  const art3 = await prisma.article.upsert({
    where: { slug: 'filosofi-desain-awesomic-zinc-grid' },
    update: {},
    create: {
      title: 'Filosofi Desain Awesomic Zinc Style & Hairline Elevation',
      slug: 'filosofi-desain-awesomic-zinc-grid',
      excerpt: 'Panduan rekayasa visual tanpa drop shadow — mengandalkan hairline borders 1px, sudut membulat 36px, dan aksen Ember.',
      categoryId: catDesain.id,
      seriesId: seriesUI.id,
      seriesOrder: 1,
      status: 'PUBLISHED',
      readingTime: 5,
      viewCount: 520,
      helpfulVotes: 42,
      unhelpfulVotes: 0,
      coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      coverImageSourceType: 'AI_GENERATED',
      authorId: admin.id,
      publishedAt: new Date(),
      contentMarkdown: `## Menolak Klise & Menghidupkan Kejujuran Material Digital

Desain Awesomic Zinc beroperasi pada register visual netral yang sangat terkontrol: skala abu-abu zinc membawa hampir seluruh antarmuka, dengan satu aksen badge oranye (#ff5a00) dan hampir tanpa intrusi kromatik lainnya.

Geometri didefinisikan oleh pembulatan sudut yang murah hati — kartu 36px, tombol 14px, pil 10000px — dan garis batas 1px (*hairline borders*) menggantikan bayangan jatuh (*drop shadows*) sebagai alat elevasi utama.

---

## Anatomi Token Desain Awesomic

1. **Obsidian (\`#09090b\`)**: Tombol aksi utama, headline hero — hitam terdalam yang mengikat setiap CTA terhadap kanvas terang.
2. **Paper (\`#f4f4f5\`)**: Latar belakang kanvas abu-abu hangat-sejuk yang membawa permukaan halaman.
3. **Snow (\`#ffffff\`)**: Kartu terangkat di atas kanvas dengan garis batas \`#ececee\` 1px.
4. **Ember (\`#ff5a00\`)**: Aksen tunggal untuk badge sorotan, penanda pos bersponsor, dan tag kredibilitas.`,
    },
  });

  const art4 = await prisma.article.upsert({
    where: { slug: 'catatan-refleksi-15-tahun-rekayasa-software' },
    update: {},
    create: {
      title: 'Catatan Refleksi: 15 Tahun Merancang Arsitektur Perangkat Lunak',
      slug: 'catatan-refleksi-15-tahun-rekayasa-software',
      excerpt: 'Pelajaran berharga mengenai kesederhanaan sistem, trade-off teknologi, dan mengapa kode terbaik adalah kode yang tidak perlu ditulis.',
      categoryId: catJournal.id,
      status: 'PUBLISHED',
      isIndexable: false, // Jurnal personal privacy
      readingTime: 4,
      viewCount: 190,
      helpfulVotes: 18,
      unhelpfulVotes: 0,
      coverImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&auto=format&fit=crop&q=80',
      coverImageSourceType: 'SELF_SHOT',
      authorId: admin.id,
      publishedAt: new Date(),
      contentMarkdown: `## Kesederhanaan di Atas Tren Sesaat

Sepanjang 15 tahun perjalanan membangun sistem di berbagai skala, satu pelajaran yang selalu berulang: kompleksitas yang tidak perlu adalah musuh terbesar keandalan perangkat lunak.

Arsitektur yang hebat bukan tentang seberapa banyak teknologi baru yang dimasukkan ke dalam stack, melainkan tentang seberapa jelas batasan domain (*bounded contexts*) dan seberapa mudah sistem dipelihara oleh manusia.`,
    },
  });

  // 8. Additional editorial demo articles for the landing index and trending carousel.
  const demoArticles = [
    {
      slug: 'strategi-index-postgresql-untuk-query-produksi',
      title: 'Strategi Index PostgreSQL untuk Query Produksi yang Stabil',
      excerpt: 'Cara membaca pola query, memilih indeks yang tepat, dan menghindari optimasi yang hanya terlihat bagus di development.',
      categoryId: catRekayasa.id,
      seriesId: seriesScale.id,
      seriesOrder: 2,
      readingTime: 6,
      viewCount: 1240,
      publishedAt: new Date('2026-08-11T08:30:00.000Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&auto=format&fit=crop&q=80',
      tags: [tagPostgres.id, tagSystem.id],
      contentMarkdown: `## Indeks dimulai dari pola baca

Indeks PostgreSQL bukan daftar kolom yang ditempelkan setelah query terasa lambat. Keputusan yang baik dimulai dari pola filter, urutan pengurutan, dan jumlah baris yang benar-benar dibaca oleh transaksi produksi.

 Untuk endpoint yang selalu memfilter \`tenant_id\` lalu mengurutkan \`created_at\`, indeks komposit biasanya lebih berguna daripada dua indeks tunggal yang memaksa planner menggabungkan bitmap secara berulang.

## Validasi di lingkungan nyata

 Gunakan \`EXPLAIN (ANALYZE, BUFFERS)\` pada data yang mendekati ukuran produksi. Rencana query yang bagus bukan hanya yang cepat di laptop, tetapi yang menjaga pembacaan heap dan cache tetap masuk akal saat concurrency naik.`,
    },
    {
      slug: 'memahami-isolasi-transaksi-postgresql',
      title: 'Memahami Isolasi Transaksi PostgreSQL Tanpa Istilah Kabur',
      excerpt: 'Panduan praktis memilih Read Committed, Repeatable Read, atau Serializable berdasarkan konflik yang ingin Anda cegah.',
      categoryId: catRekayasa.id,
      seriesId: seriesScale.id,
      seriesOrder: 3,
      readingTime: 7,
      viewCount: 1160,
      publishedAt: new Date('2026-08-10T09:15:00.000Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
      tags: [tagPostgres.id, tagSystem.id],
      contentMarkdown: `## Isolasi adalah batas pengamatan

Level isolasi menentukan perubahan mana yang boleh dilihat sebuah transaksi ketika transaksi lain berjalan bersamaan. Di PostgreSQL, Read Committed sering cukup untuk operasi biasa, tetapi tidak otomatis melindungi aturan bisnis yang terdiri dari beberapa pembacaan dan penulisan.

Jika saldo harus tetap konsisten ketika dua request tiba pada waktu yang sama, kunci baris atau Serializable perlu dipilih berdasarkan invariant yang ingin dijaga, bukan berdasarkan kebiasaan framework.

## Uji konflik, bukan hanya happy path

Test concurrency harus memulai dua transaksi sungguhan dan mengatur urutan commit. Dari sana tim dapat melihat apakah sistem memilih retry, menolak transaksi, atau justru menghasilkan data yang tidak valid.`,
    },
    {
      slug: 'rate-limiting-terdistribusi-dengan-token-bucket',
      title: 'Rate Limiting Terdistribusi dengan Token Bucket',
      excerpt: 'Merancang pembatas request yang konsisten ketika aplikasi berjalan di banyak instance dan traffic datang dalam burst.',
      categoryId: catRekayasa.id,
      readingTime: 5,
      viewCount: 980,
      publishedAt: new Date('2026-08-09T07:45:00.000Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      tags: [tagSystem.id],
      contentMarkdown: `## Mengapa counter lokal cepat gagal

Counter di memory instance terlihat sederhana, tetapi tidak mengetahui request yang sedang dilayani instance lain. Hasilnya, batas per pengguna menjadi berbeda-beda tergantung load balancer dan waktu kedatangan request.

Token bucket menyimpan kapasitas, laju pengisian, dan waktu pengambilan token. State bersama dapat diletakkan di Redis dengan operasi atomik agar beberapa instance tidak mengeluarkan token yang sama.

## Respons saat batas tercapai

API sebaiknya mengembalikan status yang konsisten, header retry yang jelas, dan pesan yang dapat dipahami klien. Rate limit adalah bagian dari kontrak layanan, bukan sekadar middleware tersembunyi.`,
    },
    {
      slug: 'retry-queue-yang-tidak-menggandakan-pekerjaan',
      title: 'Retry Queue yang Tidak Menggandakan Pekerjaan',
      excerpt: 'Pola retry, backoff, dan deduplikasi untuk worker yang memproses event lebih dari sekali saat dependensi sedang gagal.',
      categoryId: catRekayasa.id,
      readingTime: 5,
      viewCount: 870,
      publishedAt: new Date('2026-08-08T10:00:00.000Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      tags: [tagSystem.id],
      contentMarkdown: `## Retry bukan pengulangan buta

Worker yang gagal memproses pesan perlu membedakan error sementara dari error permanen. Backoff eksponensial mengurangi tekanan pada dependensi, sementara batas percobaan mencegah satu pesan menghabiskan seluruh kapasitas queue.

Setiap handler juga harus memiliki idempotency boundary. Jika worker crash setelah side effect berhasil tetapi sebelum acknowledgement, pesan dapat kembali dan harus aman diproses ulang.

## Dead letter adalah jalur diagnosis

Pesan yang melewati batas retry sebaiknya dipindahkan ke dead-letter queue dengan alasan kegagalan, jumlah percobaan, dan correlation ID. Data ini membuat investigasi bisa dimulai tanpa menebak-nebak.`,
    },
    {
      slug: 'outbox-pattern-untuk-event-yang-konsisten',
      title: 'Outbox Pattern untuk Event yang Konsisten dengan Transaksi',
      excerpt: 'Menghindari dual-write antara database dan broker pesan dengan menyimpan niat publikasi di transaksi yang sama.',
      categoryId: catRekayasa.id,
      seriesId: seriesScale.id,
      seriesOrder: 4,
      readingTime: 6,
      viewCount: 790,
      publishedAt: new Date('2026-08-07T08:00:00.000Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
      tags: [tagSystem.id, tagPostgres.id],
      contentMarkdown: `## Satu transaksi untuk state dan niat event

Masalah dual-write terjadi ketika aplikasi berhasil menyimpan perubahan bisnis tetapi gagal mengirim event, atau mengirim event sebelum transaksi database benar-benar commit. Outbox menyimpan event sebagai row dalam transaksi bisnis yang sama.

Worker publisher membaca row yang belum terkirim, mengirimkannya ke broker, lalu menandai status publikasi. Karena publisher juga dapat mengulang, consumer tetap membutuhkan idempotency key.

## Trade-off yang harus diterima

Outbox tidak membuat sistem menjadi exactly-once secara ajaib. Ia memberi batas kegagalan yang terlihat dan membuat proses retry dapat diamati. Itu sering lebih berharga daripada janji semantik yang tidak bisa diuji.`,
    },
    {
      slug: 'membaca-trace-terdistribusi-saat-latensi-naik',
      title: 'Membaca Trace Terdistribusi Saat Latensi Mulai Naik',
      excerpt: 'Cara menemukan bottleneck lintas service dengan span, trace ID, dan hubungan antara p95 endpoint dengan dependency call.',
      categoryId: catRekayasa.id,
      readingTime: 4,
      viewCount: 740,
      publishedAt: new Date('2026-08-06T11:20:00.000Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      tags: [tagSystem.id],
      contentMarkdown: `## Trace memberi urutan, bukan jawaban otomatis

Trace ID menghubungkan request gateway dengan panggilan database, queue, dan service downstream. Ketika p95 naik, lihat span yang paling banyak memakan waktu dan bandingkan dengan baseline, bukan hanya mencari span paling panjang secara visual.

Sebuah dependency dapat terlihat lambat karena antrean internal atau karena retry tersembunyi. Tag seperti retry count, cache hit, dan database operation membantu membedakan keduanya.

## Observability yang dapat ditindaklanjuti

Jangan menambahkan semua data ke setiap span. Pilih atribut yang menjawab pertanyaan operasi: endpoint mana, tenant mana, dependency apa, dan apakah request mengalami fallback.`,
    },
    {
      slug: 'memilih-strategi-rendering-nextjs-untuk-halaman-data',
      title: 'Memilih Strategi Rendering Next.js untuk Halaman Data',
      excerpt: 'Perbandingan Server Components, streaming, dan client fetching untuk halaman yang harus cepat sekaligus tetap interaktif.',
      categoryId: catDesain.id,
      seriesId: seriesUI.id,
      seriesOrder: 2,
      readingTime: 6,
      viewCount: 700,
      publishedAt: new Date('2026-08-05T09:40:00.000Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
      tags: [tagNext.id, tagUI.id],
      contentMarkdown: `## Rendering adalah keputusan pengalaman

Server Components mengurangi JavaScript yang dikirim untuk konten yang tidak interaktif. Namun, halaman yang membutuhkan filter langsung atau keyboard shortcut tetap perlu boundary client yang jelas.

Mulai dari data yang harus terlihat pada first render. Fetch independen dapat dimulai paralel agar tidak membentuk waterfall, lalu area sekunder dapat dialirkan melalui Suspense ketika memang lebih berat.

## Ukur setelah memilih

Gunakan LCP, INP, dan ukuran JavaScript sebagai bukti. Jangan memilih strategi hanya karena satu pola sedang populer; bentuk data dan cara pengguna membaca halaman lebih penting.`,
    },
    {
      slug: 'edge-cache-dan-batas-konsistensi-data',
      title: 'Edge Cache dan Batas Konsistensi Data',
      excerpt: 'Kapan cache di edge membantu, kapan ia menyembunyikan perubahan penting, dan bagaimana merancang invalidasi yang dapat diprediksi.',
      categoryId: catRekayasa.id,
      readingTime: 5,
      viewCount: 640,
      publishedAt: new Date('2026-08-04T07:30:00.000Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
      tags: [tagSystem.id, tagNext.id],
      contentMarkdown: `## Cache menyimpan keputusan lama

Edge cache memperpendek jarak antara pembaca dan response, tetapi setiap cache hit berarti pembaca menerima keputusan yang dibuat pada waktu sebelumnya. Karena itu, TTL bukan angka performa semata; ia adalah batas konsistensi.


## Invalidasi harus punya pemilik

Tentukan event apa yang boleh membatalkan cache, siapa yang memicunya, dan bagaimana sistem pulih jika invalidasi gagal. Cache yang cepat tetapi tidak dapat diprediksi akan menciptakan bug yang sulit direproduksi.`,
    },
    {
      slug: 'design-token-yang-tetap-terbaca-oleh-semua-orang',
      title: 'Design Token yang Tetap Terbaca oleh Semua Orang',
      excerpt: 'Menyusun token warna, jarak, dan fokus agar konsisten secara visual tanpa mengorbankan kontras dan navigasi keyboard.',
      categoryId: catDesain.id,
      seriesId: seriesUI.id,
      seriesOrder: 3,
      readingTime: 4,
      viewCount: 590,
      publishedAt: new Date('2026-08-03T12:10:00.000Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&auto=format&fit=crop&q=80',
      tags: [tagUI.id, tagNext.id],
      contentMarkdown: `## Token adalah kontrak antar komponen

Token warna seharusnya menjelaskan peran, bukan hanya menyimpan hex. Nama seperti surface, text-muted, dan focus-ring membuat komponen dapat berganti tema tanpa kehilangan maksud visualnya.

Kontras harus diuji pada kombinasi nyata, termasuk placeholder, border input, icon yang bermakna, dan state focus. Warna Ember tidak boleh menjadi satu-satunya cara untuk menyampaikan status.

## Detail kecil yang membuat sistem terasa matang

Tetapkan spacing scale, ukuran touch target, radius, dan aturan reduced motion sejak awal. Konsistensi semacam ini mengurangi keputusan lokal yang sering membuat UI perlahan kehilangan bentuk.`,
    },
    {
      slug: 'versioning-api-tanpa-memecah-klien-lama',
      title: 'Versioning API Tanpa Memecah Klien Lama',
      excerpt: 'Strategi evolusi kontrak API dengan additive changes, deprecation window, dan pengujian consumer yang nyata.',
      categoryId: catRekayasa.id,
      readingTime: 5,
      viewCount: 530,
      publishedAt: new Date('2026-08-02T08:45:00.000Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
      tags: [tagSystem.id, tagNext.id],
      contentMarkdown: `## Perubahan additive adalah default yang sehat

Menambahkan field baru biasanya lebih aman daripada mengganti nama atau mengubah tipe field yang sudah dipakai klien. Namun additive change tetap perlu dokumentasi agar consumer tidak menganggap response selalu memiliki bentuk lama.

Untuk perubahan yang tidak kompatibel, pilih strategi versioning yang dapat dipahami tim: path, header, atau media type. Yang penting adalah ada masa deprecation dan telemetry pemakaian versi lama.

## Kontrak perlu diuji oleh consumer

Contract test menangkap perubahan yang terlihat kecil tetapi memutus client. Test tersebut sebaiknya berjalan terhadap schema yang sama dengan yang digunakan gateway dan service downstream.`,
    },
    {
      slug: 'circuit-breaker-yang-tahu-kapan-harus-pulih',
      title: 'Circuit Breaker yang Tahu Kapan Harus Pulih',
      excerpt: 'Menentukan threshold, half-open probe, dan fallback agar circuit breaker tidak berubah menjadi sakelar mati permanen.',
      categoryId: catRekayasa.id,
      readingTime: 5,
      viewCount: 470,
      publishedAt: new Date('2026-08-01T10:25:00.000Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      tags: [tagSystem.id],
      contentMarkdown: `## Open adalah perlindungan sementara

Circuit breaker membuka jalur ketika error atau timeout melewati threshold. Tujuannya menghentikan tekanan ke dependency yang sedang gagal, bukan menyembunyikan masalah selamanya.

Setelah cooldown, half-open probe menguji sejumlah kecil request. Probe harus dibatasi agar dependency tidak langsung menerima seluruh traffic ketika baru pulih sebagian.

## Fallback juga harus punya kontrak

Fallback yang baik menjelaskan data mana yang boleh stale, kapan response harus gagal, dan bagaimana caller membedakan hasil asli dari hasil degradasi.`,
    },
    {
      slug: 'connection-pooling-postgresql-di-bawah-beban',
      title: 'Connection Pooling PostgreSQL di Bawah Beban',
      excerpt: 'Mengatur ukuran pool, timeout, dan batas koneksi agar aplikasi tidak menghabiskan resource database saat traffic naik.',
      categoryId: catRekayasa.id,
      readingTime: 4,
      viewCount: 410,
      publishedAt: new Date('2026-07-31T06:50:00.000Z'),
      coverImageUrl: null,
      tags: [tagPostgres.id, tagSystem.id],
      contentMarkdown: `## Pool bukan semakin besar semakin baik

Setiap koneksi PostgreSQL membawa memory dan pekerjaan koordinasi. Pool yang terlalu besar membuat aplikasi terlihat mampu menerima traffic, tetapi database justru kehabisan slot dan latency ikut naik.

Ukuran pool perlu disesuaikan dengan jumlah instance aplikasi, kapasitas database, dan pola query. Timeout koneksi juga harus berbeda dari timeout query agar operasi yang macet tidak menahan slot tanpa batas.

## Ukur antrean sebelum menaikkan limit

Pantau active connection, waiting connection, query duration, dan error saat pool penuh. Sering kali bottleneck yang benar adalah query lambat atau transaksi yang terlalu panjang, bukan jumlah koneksi yang kurang.`,
    },
  ];

  const seededDemoArticles = [];
  for (const item of demoArticles) {
    const article = await prisma.article.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        contentMarkdown: item.contentMarkdown,
        categoryId: item.categoryId,
        seriesId: item.seriesId,
        seriesOrder: item.seriesOrder,
        status: 'PUBLISHED',
        readingTime: item.readingTime,
        viewCount: item.viewCount,
        coverImageUrl: item.coverImageUrl,
        authorId: admin.id,
        publishedAt: item.publishedAt,
      },
      create: {
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        contentMarkdown: item.contentMarkdown,
        categoryId: item.categoryId,
        seriesId: item.seriesId,
        seriesOrder: item.seriesOrder,
        status: 'PUBLISHED',
        readingTime: item.readingTime,
        viewCount: item.viewCount,
        coverImageUrl: item.coverImageUrl,
        coverImageSourceType: item.coverImageUrl ? 'FREE_STOCK' : null,
        authorId: admin.id,
        publishedAt: item.publishedAt,
      },
    });

    for (const tagId of item.tags) {
      await prisma.articleTag.upsert({
        where: { articleId_tagId: { articleId: article.id, tagId } },
        update: {},
        create: { articleId: article.id, tagId },
      });
    }

    seededDemoArticles.push(article);
  }

  console.log(`✓ ${seededDemoArticles.length} demo articles seeded`);

  // Link tags to articles safely
  const tagLinks = [
    { articleId: art1.id, tagId: tagSystem.id },
    { articleId: art1.id, tagId: tagPostgres.id },
    { articleId: art2.id, tagId: tagSystem.id },
    { articleId: art3.id, tagId: tagUI.id },
    { articleId: art3.id, tagId: tagNext.id },
  ];

  for (const link of tagLinks) {
    await prisma.articleTag.upsert({
      where: {
        articleId_tagId: {
          articleId: link.articleId,
          tagId: link.tagId,
        },
      },
      update: {},
      create: link,
    });
  }

  // Comments and Bookmarks
  const existingComment = await prisma.comment.findFirst({
    where: { articleId: art1.id, userId: reader1.id },
  });
  if (!existingComment) {
    await prisma.comment.create({
      data: {
        content: 'Penjelasan sequence diagram idempotensi sangat jernih dan langsung dapat diaplikasikan ke arsitektur pembayaran kami!',
        articleId: art1.id,
        userId: reader1.id,
      },
    });
  }

  await prisma.bookmark.upsert({
    where: {
      userId_articleId: {
        userId: reader1.id,
        articleId: art1.id,
      },
    },
    update: {},
    create: {
      articleId: art1.id,
      userId: reader1.id,
    },
  });

  const existingFeedback = await prisma.articleFeedback.findFirst({
    where: { articleId: art1.id, userId: reader1.id },
  });
  if (!existingFeedback) {
    await prisma.articleFeedback.create({
      data: {
        articleId: art1.id,
        isHelpful: true,
        reaction: '🚀',
        userId: reader1.id,
      },
    });
  }

  console.log('✓ Articles, Tags, Comments & Feedbacks seeded');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
