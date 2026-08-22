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
