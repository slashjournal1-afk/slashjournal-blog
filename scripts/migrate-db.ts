import { PrismaClient } from '@prisma/client';

/**
 * =============================================================================
 * SCRIPT MIGRASI DATABASE SUPABASE (OLD DB -> NEW DB VIA PRISMA)
 * =============================================================================
 * 
 * Alur Kerja:
 * 1. Verifikasi koneksi ke Old DB dan New DB.
 * 2. [FASE 1] Pembersihan / Wipe semua data yang sudah terlanjur ada di New DB
 *    sesuai urutan reverse foreign-key dependency.
 * 3. [FASE 2] Pemindahan data dari Old DB ke New DB secara bertahap
 *    berdasarkan relasi top-down.
 * 4. [FASE 3] Verifikasi integritas data & parity check (Old Count vs New Count).
 * =============================================================================
 */

const oldDbUrl = process.env.OLD_DATABASE_URL;
const newDbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!oldDbUrl) {
  console.error('❌ ERROR: Variabel OLD_DATABASE_URL belum didefinisikan di .env!');
  console.error('   Harap tambahkan OLD_DATABASE_URL di file .env Anda:');
  console.error('   OLD_DATABASE_URL="postgresql://postgres.[OLD_REF]:[PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"\n');
  process.exit(1);
}

if (!newDbUrl) {
  console.error('❌ ERROR: DIRECT_URL atau DATABASE_URL belum didefinisikan di .env!');
  process.exit(1);
}

// Inisialisasi Prisma Client untuk masing-masing database
const oldDb = new PrismaClient({
  datasources: {
    db: {
      url: oldDbUrl,
    },
  },
});

const newDb = new PrismaClient({
  datasources: {
    db: {
      url: newDbUrl,
    },
  },
});

async function runMigration() {
  const startTime = Date.now();
  console.log('\n=================================================================');
  console.log('🚀 MEMULAI PROSES MIGRASI DATA: OLD SUPABASE -> NEW SUPABASE');
  console.log('=================================================================\n');

  try {
    // -------------------------------------------------------------------------
    // TEST KONEKSI KEDUA DATABASE
    // -------------------------------------------------------------------------
    console.log('📡 Memeriksa koneksi database...');
    await oldDb.$queryRaw`SELECT 1`;
    console.log('  ✓ Terhubung ke Database Lama (Old Supabase)');
    await newDb.$queryRaw`SELECT 1`;
    console.log('  ✓ Terhubung ke Database Baru (New Supabase)\n');

    // -------------------------------------------------------------------------
    // FASE 1: BERSIHKAN / WIPE DATA DI DATABASE BARU (REVERSE FK ORDER)
    // -------------------------------------------------------------------------
    console.log('=================================================================');
    console.log('🧹 [FASE 1] MENGOSONGKAN SELURUH DATA EXISTING DI DATABASE BARU');
    console.log('=================================================================');

    const cleanSteps = [
      { name: 'ArticleRevision', fn: () => newDb.articleRevision.deleteMany({}) },
      { name: 'ArticleTag', fn: () => newDb.articleTag.deleteMany({}) },
      { name: 'Comment', fn: () => newDb.comment.deleteMany({}) },
      { name: 'Bookmark', fn: () => newDb.bookmark.deleteMany({}) },
      { name: 'ArticleFeedback', fn: () => newDb.articleFeedback.deleteMany({}) },
      { name: 'Article', fn: () => newDb.article.deleteMany({}) },
      { name: 'GlossaryTerm', fn: () => newDb.glossaryTerm.deleteMany({}) },
      { name: 'AuditLog', fn: () => newDb.auditLog.deleteMany({}) },
      { name: 'Subscription', fn: () => newDb.subscription.deleteMany({}) },
      { name: 'SearchQueryLog', fn: () => newDb.searchQueryLog.deleteMany({}) },
      { name: 'AdSlot', fn: () => newDb.adSlot.deleteMany({}) },
      { name: 'Tag', fn: () => newDb.tag.deleteMany({}) },
      { name: 'Series', fn: () => newDb.series.deleteMany({}) },
      { name: 'Category', fn: () => newDb.category.deleteMany({}) },
      { name: 'User', fn: () => newDb.user.deleteMany({}) },
    ];

    for (const step of cleanSteps) {
      const res = await step.fn();
      console.log(`  🗑️  Dihapus ${res.count} baris dari tabel: ${step.name}`);
    }
    console.log('✅ Database Baru telah bersih dan siap menerima migrasi.\n');

    // -------------------------------------------------------------------------
    // FASE 2: MIGRASI DATA DARI OLD DB KE NEW DB (TOP-DOWN FK ORDER)
    // -------------------------------------------------------------------------
    console.log('=================================================================');
    console.log('📦 [FASE 2] MEMINDAHKAN DATA DARI OLD DB KE NEW DB');
    console.log('=================================================================');

    // 1. Users
    const users = await oldDb.user.findMany();
    console.log(`⏳ Memindahkan ${users.length} Users...`);
    if (users.length > 0) {
      await newDb.user.createMany({ data: users });
    }
    console.log(`  ✓ Users selesai (${users.length} data)`);

    // 2. Categories
    const categories = await oldDb.category.findMany();
    console.log(`⏳ Memindahkan ${categories.length} Categories...`);
    if (categories.length > 0) {
      await newDb.category.createMany({ data: categories });
    }
    console.log(`  ✓ Categories selesai (${categories.length} data)`);

    // 3. Series
    const seriesList = await oldDb.series.findMany();
    console.log(`⏳ Memindahkan ${seriesList.length} Series...`);
    if (seriesList.length > 0) {
      await newDb.series.createMany({ data: seriesList });
    }
    console.log(`  ✓ Series selesai (${seriesList.length} data)`);

    // 4. Tags
    const tags = await oldDb.tag.findMany();
    console.log(`⏳ Memindahkan ${tags.length} Tags...`);
    if (tags.length > 0) {
      await newDb.tag.createMany({ data: tags });
    }
    console.log(`  ✓ Tags selesai (${tags.length} data)`);

    // 5. AdSlots
    const adSlots = await oldDb.adSlot.findMany();
    console.log(`⏳ Memindahkan ${adSlots.length} AdSlots...`);
    if (adSlots.length > 0) {
      await newDb.adSlot.createMany({ data: adSlots });
    }
    console.log(`  ✓ AdSlots selesai (${adSlots.length} data)`);

    // 6. SearchQueryLogs
    const searchQueryLogs = await oldDb.searchQueryLog.findMany();
    console.log(`⏳ Memindahkan ${searchQueryLogs.length} SearchQueryLogs...`);
    if (searchQueryLogs.length > 0) {
      await newDb.searchQueryLog.createMany({ data: searchQueryLogs });
    }
    console.log(`  ✓ SearchQueryLogs selesai (${searchQueryLogs.length} data)`);

    // 7. GlossaryTerms
    const glossaryTerms = await oldDb.glossaryTerm.findMany();
    console.log(`⏳ Memindahkan ${glossaryTerms.length} GlossaryTerms...`);
    if (glossaryTerms.length > 0) {
      await newDb.glossaryTerm.createMany({ data: glossaryTerms });
    }
    console.log(`  ✓ GlossaryTerms selesai (${glossaryTerms.length} data)`);

    // 8. Articles
    const articles = await oldDb.article.findMany();
    console.log(`⏳ Memindahkan ${articles.length} Articles...`);
    if (articles.length > 0) {
      await newDb.article.createMany({ data: articles });
    }
    console.log(`  ✓ Articles selesai (${articles.length} data)`);

    // 9. ArticleTags (ManyToMany Join Table)
    const articleTags = await oldDb.articleTag.findMany();
    console.log(`⏳ Memindahkan ${articleTags.length} ArticleTags...`);
    if (articleTags.length > 0) {
      await newDb.articleTag.createMany({ data: articleTags });
    }
    console.log(`  ✓ ArticleTags selesai (${articleTags.length} data)`);

    // 10. Comments
    const comments = await oldDb.comment.findMany();
    console.log(`⏳ Memindahkan ${comments.length} Comments...`);
    if (comments.length > 0) {
      await newDb.comment.createMany({ data: comments });
    }
    console.log(`  ✓ Comments selesai (${comments.length} data)`);

    // 11. Bookmarks
    const bookmarks = await oldDb.bookmark.findMany();
    console.log(`⏳ Memindahkan ${bookmarks.length} Bookmarks...`);
    if (bookmarks.length > 0) {
      await newDb.bookmark.createMany({ data: bookmarks });
    }
    console.log(`  ✓ Bookmarks selesai (${bookmarks.length} data)`);

    // 12. ArticleFeedbacks
    const feedbacks = await oldDb.articleFeedback.findMany();
    console.log(`⏳ Memindahkan ${feedbacks.length} ArticleFeedbacks...`);
    if (feedbacks.length > 0) {
      await newDb.articleFeedback.createMany({ data: feedbacks });
    }
    console.log(`  ✓ ArticleFeedbacks selesai (${feedbacks.length} data)`);

    // 13. ArticleRevisions
    const revisions = await oldDb.articleRevision.findMany();
    console.log(`⏳ Memindahkan ${revisions.length} ArticleRevisions...`);
    if (revisions.length > 0) {
      await newDb.articleRevision.createMany({ data: revisions });
    }
    console.log(`  ✓ ArticleRevisions selesai (${revisions.length} data)`);

    // 14. Subscriptions
    const subscriptions = await oldDb.subscription.findMany();
    console.log(`⏳ Memindahkan ${subscriptions.length} Subscriptions...`);
    if (subscriptions.length > 0) {
      await newDb.subscription.createMany({ data: subscriptions });
    }
    console.log(`  ✓ Subscriptions selesai (${subscriptions.length} data)`);

    // 15. AuditLogs
    const auditLogs = await oldDb.auditLog.findMany();
    console.log(`⏳ Memindahkan ${auditLogs.length} AuditLogs...`);
    if (auditLogs.length > 0) {
      await newDb.auditLog.createMany({ data: auditLogs });
    }
    console.log(`  ✓ AuditLogs selesai (${auditLogs.length} data)\n`);

    // -------------------------------------------------------------------------
    // FASE 3: VERIFIKASI & PARITY CHECK
    // -------------------------------------------------------------------------
    console.log('=================================================================');
    console.log('🔍 [FASE 3] VERIFIKASI DATA INTEGRITY (OLD DB vs NEW DB)');
    console.log('=================================================================');

    const verifyModels = [
      { name: 'User', oldFn: () => oldDb.user.count(), newFn: () => newDb.user.count() },
      { name: 'Category', oldFn: () => oldDb.category.count(), newFn: () => newDb.category.count() },
      { name: 'Series', oldFn: () => oldDb.series.count(), newFn: () => newDb.series.count() },
      { name: 'Tag', oldFn: () => oldDb.tag.count(), newFn: () => newDb.tag.count() },
      { name: 'AdSlot', oldFn: () => oldDb.adSlot.count(), newFn: () => newDb.adSlot.count() },
      { name: 'SearchQueryLog', oldFn: () => oldDb.searchQueryLog.count(), newFn: () => newDb.searchQueryLog.count() },
      { name: 'GlossaryTerm', oldFn: () => oldDb.glossaryTerm.count(), newFn: () => newDb.glossaryTerm.count() },
      { name: 'Article', oldFn: () => oldDb.article.count(), newFn: () => newDb.article.count() },
      { name: 'ArticleTag', oldFn: () => oldDb.articleTag.count(), newFn: () => newDb.articleTag.count() },
      { name: 'Comment', oldFn: () => oldDb.comment.count(), newFn: () => newDb.comment.count() },
      { name: 'Bookmark', oldFn: () => oldDb.bookmark.count(), newFn: () => newDb.bookmark.count() },
      { name: 'ArticleFeedback', oldFn: () => oldDb.articleFeedback.count(), newFn: () => newDb.articleFeedback.count() },
      { name: 'ArticleRevision', oldFn: () => oldDb.articleRevision.count(), newFn: () => newDb.articleRevision.count() },
      { name: 'Subscription', oldFn: () => oldDb.subscription.count(), newFn: () => newDb.subscription.count() },
      { name: 'AuditLog', oldFn: () => oldDb.auditLog.count(), newFn: () => newDb.auditLog.count() },
    ];

    let allMatched = true;
    console.log('Tabel                 Old DB     New DB     Status');
    console.log('--------------------------------------------------');

    for (const model of verifyModels) {
      const oldCount = await model.oldFn();
      const newCount = await model.newFn();
      const match = oldCount === newCount;
      if (!match) allMatched = false;

      const status = match ? '✅ MATCH' : '❌ MISMATCH';
      console.log(
        `${model.name.padEnd(22)} ${String(oldCount).padEnd(10)} ${String(newCount).padEnd(10)} ${status}`
      );
    }

    console.log('--------------------------------------------------');
    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);

    if (allMatched) {
      console.log(`\n🎉 MIGRASI SELESAI DENGAN SUKSES! (Waktu: ${elapsedSeconds}s)`);
      console.log('   Semua data dari database lama berhasil ditransfer ke database baru tanpa ada yang terlewat.');
    } else {
      console.warn(`\n⚠️ Migrasi selesai dengan peringatan ketidaksesuaian jumlah data. Silakan periksa log di atas.`);
    }
    console.log('=================================================================\n');

  } catch (error) {
    console.error('\n❌ Terjadi error fatal saat proses migrasi data:', error);
    process.exit(1);
  } finally {
    await oldDb.$disconnect();
    await newDb.$disconnect();
  }
}

runMigration();
