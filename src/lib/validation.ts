import { z } from 'zod';

export const articleIdSchema = z.string().trim().min(1).max(100);

export const commentSchema = z.object({
  articleId: articleIdSchema,
  content: z.string().trim().min(1, 'Komentar tidak boleh kosong').max(5000, 'Komentar terlalu panjang'),
});

export const feedbackSchema = z.object({
  articleId: articleIdSchema,
  isHelpful: z.boolean().optional(),
  reaction: z.enum(['👏', '🚀', '💡', '🔥', '❤️']).optional(),
}).refine((data) => data.isHelpful !== undefined || data.reaction !== undefined, {
  message: 'Feedback tidak berisi penilaian',
});

export const subscriptionSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  topic: z.enum(['all', 'rekayasa-sistem', 'desain-antarmuka']).default('all'),
});

const httpUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => /^https?:\/\//i.test(value), 'URL harus diawali http:// atau https://');

export const articleSourceInputSchema = z.object({
  label: z.string().trim().min(1, 'Label sumber wajib diisi').max(500),
  url: httpUrlSchema.nullish(),
});

const ARTICLE_STATUS_VALUES = ['DRAFT', 'IN_REVIEW', 'PUBLISHED'] as const;

export const articleCreateSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi').max(250),
  slug: z.string().trim().max(250).optional(),
  excerpt: z.string().trim().max(600).optional(),
  contentMarkdown: z.string().min(1, 'Konten wajib diisi').max(300000, 'Konten terlalu panjang'),
  categoryId: z.string().trim().min(1).max(100).optional(),
  newCategoryName: z.string().trim().min(1).max(100).optional(),
  seriesId: z.string().trim().min(1).max(100).nullish(),
  seriesOrder: z.coerce.number().int().min(0).max(10000).nullish(),
  coverImageUrl: z.string().trim().max(2048).nullish(),
  coverImageSourceType: z.string().trim().max(50).nullish(),
  isSponsored: z.boolean().optional(),
  sponsorName: z.string().trim().max(200).nullish(),
  sponsorUrl: httpUrlSchema.nullish(),
  status: z.enum(ARTICLE_STATUS_VALUES).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
  sources: z.array(articleSourceInputSchema).max(100).optional(),
});

export const articleUpdateSchema = articleCreateSchema
  .extend({
    reviewNote: z.string().trim().max(2000).nullish(),
    revisionNote: z.string().trim().max(2000).nullish(),
  })
  .partial();
