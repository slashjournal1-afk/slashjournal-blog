import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDummyData() {
  console.log('🚀 Starting Production Database Cleanup (Preserving Authentication)...');

  try {
    // 1. Clean whitespace in User roles
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} existing user(s):`);

    for (const user of users) {
      const trimmedRole = user.role.trim();
      if (trimmedRole !== user.role) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: trimmedRole },
        });
        console.log(`  ✓ Trimmed role for user ${user.email}: "${user.role}" -> "${trimmedRole}"`);
      } else {
        console.log(`  ✓ Kept user ${user.email} (Role: ${user.role})`);
      }
    }

    // 2. Remove article relations & dummy data
    console.log('\n🗑️ Removing dummy articles and associated child records...');

    const deletedArticleTags = await prisma.articleTag.deleteMany({});
    console.log(`  ✓ Deleted ${deletedArticleTags.count} ArticleTag record(s)`);

    const deletedComments = await prisma.comment.deleteMany({});
    console.log(`  ✓ Deleted ${deletedComments.count} Comment record(s)`);

    const deletedBookmarks = await prisma.bookmark.deleteMany({});
    console.log(`  ✓ Deleted ${deletedBookmarks.count} Bookmark record(s)`);

    const deletedFeedbacks = await prisma.articleFeedback.deleteMany({});
    console.log(`  ✓ Deleted ${deletedFeedbacks.count} ArticleFeedback record(s)`);

    const deletedRevisions = await prisma.articleRevision.deleteMany({});
    console.log(`  ✓ Deleted ${deletedRevisions.count} ArticleRevision record(s)`);

    const deletedAuditLogs = await prisma.auditLog.deleteMany({});
    console.log(`  ✓ Deleted ${deletedAuditLogs.count} AuditLog record(s)`);

    const deletedArticles = await prisma.article.deleteMany({});
    console.log(`  ✓ Deleted ${deletedArticles.count} Article record(s)`);

    // 3. Verify clean state
    const remainingArticles = await prisma.article.count();
    const remainingUsers = await prisma.user.count();
    const remainingCategories = await prisma.category.count();

    console.log('\n✅ CLEANUP COMPLETE:');
    console.log(`  • Remaining Articles: ${remainingArticles} (Ready for production articles)`);
    console.log(`  • Remaining Users: ${remainingUsers} (Authentication intact)`);
    console.log(`  • Remaining Categories: ${remainingCategories} (Ready for use / expansion)`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanDummyData();
