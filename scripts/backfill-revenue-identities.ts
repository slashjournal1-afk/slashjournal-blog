import { prisma } from '@/lib/db';
import { registerArticleRevenueIdentity } from '@/lib/revenue';

async function main() {
  const articles = await prisma.article.findMany({ select: { id: true, authorId: true, slug: true, title: true } });
  for (const article of articles) {
    await registerArticleRevenueIdentity(article.id, article.authorId, article.slug, article.title);
  }
  console.log(`Backfilled revenue identities for ${articles.length} articles`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
