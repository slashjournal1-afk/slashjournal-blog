import { Decimal } from '@prisma/client/runtime/library';

export function splitRevenue(gross: Decimal, ownershipPercent = new Decimal(100)) {
  const authorShare = gross.mul(ownershipPercent).div(100).mul(new Decimal('0.8'));
  return { authorShare, platformShare: gross.sub(authorShare) };
}

export function accumulatedPayout(values: Decimal[]) {
  return values.reduce((sum, value) => sum.add(value), new Decimal(0));
}
