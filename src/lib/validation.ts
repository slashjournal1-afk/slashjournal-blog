import { z } from 'zod';

export const articleIdSchema = z.string().trim().min(1, 'ID artikel tidak boleh kosong').max(100, 'ID artikel terlalu panjang');

export const commentSchema = z.object({
  articleId: articleIdSchema,
  content: z.string().trim().min(1, 'Komentar tidak boleh kosong').max(5000, 'Komentar terlalu panjang (maksimal 5000 karakter)'),
});

export const feedbackSchema = z.object({
  articleId: articleIdSchema,
  isHelpful: z.boolean().optional(),
  reaction: z.enum(['helpful', 'insight', 'solid', 'practical', 'deep-dive', '👏', '🚀', '💡', '🔥', '🧠', '❤️']).optional(),
}).refine((data) => data.isHelpful !== undefined || data.reaction !== undefined, {
  message: 'Feedback tidak berisi penilaian',
});

export const subscriptionSchema = z.object({
  email: z.string().trim().toLowerCase().email('Format email tidak valid').max(320, 'Email terlalu panjang'),
  topic: z.enum(['all', 'rekayasa-sistem', 'desain-antarmuka']).default('all'),
});

const optionalAvatarUrlSchema = z
  .string()
  .trim()
  .max(2000, 'URL avatar terlalu panjang (maksimal 2000 karakter)')
  .refine(
    (value) => !value || /^https?:\/\//i.test(value) || value.startsWith('/uploads/'),
    'URL avatar harus diawali http://, https://, atau /uploads/'
  )
  .nullish()
  .transform((val) => (val && val.trim() ? val.trim() : null));

export const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(1, 'Nama tampilan wajib diisi').max(80, 'Nama tampilan terlalu panjang (maksimal 80 karakter)'),
  name: z.string().trim().max(80, 'Nama lengkap terlalu panjang (maksimal 80 karakter)').nullish().transform((val) => (val && val.trim() ? val.trim() : null)),
  avatarUrl: optionalAvatarUrlSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Kata sandi saat ini wajib diisi').max(128, 'Kata sandi terlalu panjang'),
  newPassword: z.string().min(8, 'Kata sandi baru minimal harus 8 karakter').max(128, 'Kata sandi baru maksimal 128 karakter'),
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Kata sandi baru harus berbeda dari kata sandi saat ini',
  path: ['newPassword'],
});

const optionalHttpUrlSchema = z
  .string()
  .trim()
  .max(8192, 'URL terlalu panjang (maksimal 8192 karakter)')
  .refine(
    (value) => !value || /^https?:\/\//i.test(value),
    'URL harus diawali http:// atau https://'
  )
  .nullish()
  .transform((val) => (val && val.trim() ? val.trim() : null));

export const articleSourceInputSchema = z.object({
  label: z.string().trim().min(1, 'Label sumber wajib diisi').max(500, 'Label sumber terlalu panjang (maksimal 500 karakter)'),
  url: optionalHttpUrlSchema,
});

const ARTICLE_STATUS_VALUES = ['DRAFT', 'IN_REVIEW', 'PUBLISHED'] as const;

export const articleCreateSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi').max(250, 'Judul maksimal 250 karakter'),
  slug: z.string().trim().max(250, 'Slug maksimal 250 karakter').optional(),
  excerpt: z.string().trim().max(600, 'Ringkasan maksimal 600 karakter').optional(),
  contentMarkdown: z.string().min(1, 'Konten wajib diisi').max(500000, 'Konten naskah terlalu panjang (maksimal 500.000 karakter)'),
  categoryId: z.string().trim().min(1, 'Kategori tidak valid').max(100, 'ID kategori terlalu panjang').optional(),
  newCategoryName: z.string().trim().min(1, 'Nama kategori baru tidak valid').max(100, 'Nama kategori baru terlalu panjang').optional(),
  seriesId: z.string().trim().min(1).max(100, 'ID seri terlalu panjang').nullish(),
  seriesOrder: z.coerce.number().int('Urutan seri harus berupa bilangan bulat').min(0, 'Urutan seri minimal 0').max(10000, 'Urutan seri maksimal 10000').nullish(),
  coverImageUrl: z
    .string()
    .trim()
    .max(5_000_000, 'URL atau data gambar sampul terlalu besar (maksimal 5MB)')
    .nullish()
    .transform((val) => (val && val.trim() ? val.trim() : null)),
  coverImageSourceType: z.string().trim().max(100, 'Tipe sumber gambar terlalu panjang').nullish(),
  isSponsored: z.boolean().optional(),
  sponsorName: z.string().trim().max(200, 'Nama sponsor maksimal 200 karakter').nullish(),
  sponsorUrl: optionalHttpUrlSchema,
  status: z.enum(ARTICLE_STATUS_VALUES, {
    errorMap: () => ({ message: 'Status naskah tidak valid' }),
  }).optional(),
  tags: z.array(z.string().trim().min(1, 'Tag tidak boleh kosong').max(50, 'Tag maksimal 50 karakter')).max(20, 'Maksimal 20 tag').optional(),
  sources: z.array(articleSourceInputSchema).max(100, 'Maksimal 100 sumber referensi').optional(),
});

export const articleUpdateSchema = articleCreateSchema
  .extend({
    reviewNote: z.string().trim().max(2000, 'Catatan review maksimal 2000 karakter').nullish(),
    revisionNote: z.string().trim().max(2000, 'Catatan revisi maksimal 2000 karakter').nullish(),
  })
  .partial();
