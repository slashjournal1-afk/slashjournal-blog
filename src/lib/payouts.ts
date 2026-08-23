import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { Decimal } from '@prisma/client/runtime/library';

const DEFAULT_MIN_PAYOUT_IDR = 100_000;

export function minimumPayoutAmount(currencyCode: string) {
  const configured = process.env.REVENUE_MIN_PAYOUT;
  if (configured) return new Decimal(configured);
  return currencyCode === 'IDR' ? new Decimal(DEFAULT_MIN_PAYOUT_IDR) : new Decimal(0);
}

export async function createRevenueAdjustment(input: {
  revenuePeriodId: string;
  authorId?: string;
  articleId?: string;
  amount: string;
  reason: string;
  adminId: string;
  adminEmail: string;
}) {
  const amount = new Decimal(input.amount);
  if (!amount.isFinite() || amount.isZero()) throw new Error('Adjustment amount must be non-zero');
  const result = await prisma.$transaction(async (tx) => {
    const period = await tx.revenuePeriod.findUnique({ where: { id: input.revenuePeriodId } });
    if (!period) throw new Error('Revenue period not found');
    if (!input.authorId) throw new Error('authorId is required for payout adjustment');
    const row = await tx.authorRevenue.findUnique({ where: { revenuePeriodId_authorId: { revenuePeriodId: period.id, authorId: input.authorId } } });
    if (!row) throw new Error('Author revenue row not found');
    if (row.payoutStatus === 'PAID') throw new Error('Paid author revenue cannot be adjusted');
    const updated = await tx.revenueAdjustment.create({ data: { revenuePeriodId: period.id, authorId: input.authorId, articleId: input.articleId, amount, reason: input.reason, createdBy: input.adminId } });
    await tx.authorRevenue.update({ where: { id: row.id }, data: { adjustmentAmount: { increment: amount }, payableAmount: { increment: amount }, status: 'ADJUSTED', payoutStatus: 'ON_HOLD' } });
    return updated;
  });
  await recordAuditLog({ actorEmail: input.adminEmail, userId: input.adminId, action: 'REVENUE_ADJUSTMENT_CREATE', details: `Revenue adjustment ${result.id} created for period ${input.revenuePeriodId}` });
  return result;
}

export async function markRevenuePaid(input: { authorRevenueId: string; reference: string; adminId: string; adminEmail: string }) {
  const result = await prisma.$transaction(async (tx) => {
    const row = await tx.authorRevenue.findUnique({ where: { id: input.authorRevenueId }, include: { revenuePeriod: true } });
    if (!row) throw new Error('Author revenue row not found');
    if (row.revenuePeriod.status !== 'FINALIZED') throw new Error('Only finalized periods can be paid');
    if (row.payoutStatus === 'PAID') throw new Error('Revenue is already marked paid');
    const unpaid = await tx.authorRevenue.findMany({ where: { authorId: row.authorId, payoutStatus: { not: 'PAID' }, revenuePeriod: { status: 'FINALIZED', currencyCode: row.revenuePeriod.currencyCode } } });
    const total = unpaid.reduce((sum, item) => sum.add(item.payableAmount), new Decimal(0));
    const minimum = minimumPayoutAmount(row.revenuePeriod.currencyCode);
    if (total.lt(minimum)) throw new Error(`Accumulated payout is below minimum threshold of ${minimum.toString()} ${row.revenuePeriod.currencyCode}`);
    const paidAt = new Date();
    await tx.authorRevenue.updateMany({ where: { id: { in: unpaid.map((item) => item.id) } }, data: { payoutStatus: 'PAID', paidAt, paidBy: input.adminId, payoutReference: input.reference.trim() } });
    return { authorId: row.authorId, currencyCode: row.revenuePeriod.currencyCode, total: total.toString(), rows: unpaid.length, paidAt };
  });
  await recordAuditLog({ actorEmail: input.adminEmail, userId: input.adminId, action: 'REVENUE_PAYOUT_MARKED_PAID', details: `Author revenue ${input.authorRevenueId} marked paid with reference ${input.reference}` });
  return result;
}

export async function refreshAuthorPayoutEligibility(authorId: string, currencyCode: string) {
  const rows = await prisma.authorRevenue.findMany({ where: { authorId, payoutStatus: { not: 'PAID' }, revenuePeriod: { status: 'FINALIZED', currencyCode } } });
  const total = rows.reduce((sum, row) => sum.add(row.payableAmount), new Decimal(0));
  const eligible = total.gte(minimumPayoutAmount(currencyCode));
  await prisma.authorRevenue.updateMany({ where: { id: { in: rows.map((row) => row.id) }, payoutStatus: { not: 'ON_HOLD' } }, data: { payoutStatus: eligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE' } });
  return { total, eligible };
}
