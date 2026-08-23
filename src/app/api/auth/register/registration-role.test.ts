import assert from 'node:assert/strict';
import test from 'node:test';
import { getRegistrationRole } from './route';

test('maps the author registration path to AUTHOR', () => {
  assert.equal(getRegistrationRole('author'), 'AUTHOR');
});

test('keeps ordinary and invalid registration paths as READER', () => {
  assert.equal(getRegistrationRole('reader'), 'READER');
  assert.equal(getRegistrationRole(undefined), 'READER');
  assert.equal(getRegistrationRole('ADMIN'), 'READER');
});
