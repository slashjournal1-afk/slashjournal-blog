import assert from 'node:assert/strict';
import test from 'node:test';
import { Decimal } from '@prisma/client/runtime/library';
import { accumulatedPayout, splitRevenue } from './revenue-calculations';

test('splits gross revenue into 80 percent author and 20 percent platform', () => {
  const result = splitRevenue(new Decimal('100.00'));
  assert.equal(result.authorShare.toString(), '80');
  assert.equal(result.platformShare.toString(), '20');
});

test('applies ownership before the revenue share split', () => {
  const result = splitRevenue(new Decimal('100.00'), new Decimal('50'));
  assert.equal(result.authorShare.toString(), '40');
  assert.equal(result.platformShare.toString(), '60');
});

test('accumulates payout values using Decimal arithmetic', () => {
  assert.equal(accumulatedPayout([new Decimal('0.1'), new Decimal('0.2')]).toString(), '0.3');
});
