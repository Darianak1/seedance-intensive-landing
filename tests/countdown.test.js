const test = require('node:test');
const assert = require('node:assert/strict');
const { getTimeRemaining } = require('../js/countdown.js');

test('returns full breakdown for exactly 2 days ahead', () => {
  const now = new Date('2026-09-15T10:00:00Z');
  const target = new Date('2026-09-17T10:00:00Z');
  const result = getTimeRemaining(target, now);
  assert.deepEqual(result, { days: 2, hours: 0, minutes: 0, seconds: 0, isPast: false });
});

test('accounts for hours, minutes and seconds separately', () => {
  const now = new Date('2026-09-17T07:58:30Z');
  const target = new Date('2026-09-17T10:00:00Z');
  const result = getTimeRemaining(target, now);
  assert.deepEqual(result, { days: 0, hours: 2, minutes: 1, seconds: 30, isPast: false });
});

test('marks past dates as isPast with zeroed fields', () => {
  const now = new Date('2026-09-18T00:00:00Z');
  const target = new Date('2026-09-17T10:00:00Z');
  const result = getTimeRemaining(target, now);
  assert.deepEqual(result, { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
});
