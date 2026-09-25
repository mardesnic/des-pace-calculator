import { describe, expect, it } from 'vitest';

import { formatDuration, normalizeDuration, parseDuration } from './format';
import { predictSeconds, trainingPaces, vdot } from './vdot';

// Reference values from Daniels' Running Formula VDOT tables.
const close = (actual: number, expected: number, seconds = 3) =>
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(seconds);

describe('vdot', () => {
  it('matches the tables', () => {
    expect(vdot(5000, 19 * 60 + 57)).toBeCloseTo(50, 0);
    expect(vdot(42195, 3 * 3600 + 10 * 60 + 49)).toBeCloseTo(50, 0);
  });

  it('predicts race times', () => {
    close(predictSeconds(50, 10000), 41 * 60 + 21);
    close(predictSeconds(50, 21097.5), 3600 + 31 * 60 + 35, 5);
  });

  it('gives training paces', () => {
    const [, marathon, threshold, interval] = trainingPaces(50);
    close(marathon.pace * 1000, 4 * 60 + 31);
    close(threshold.pace * 1000, 4 * 60 + 15);
    close(interval.pace * 1000, 3 * 60 + 55);
  });
});

describe('durations', () => {
  it('fills digits from the right', () => {
    expect(normalizeDuration('5', 6)).toBe('0:05');
    expect(normalizeDuration('500', 6)).toBe('5:00');
    expect(normalizeDuration('14530', 6)).toBe('1:45:30');
    expect(normalizeDuration('0:050', 6)).toBe('0:50');
    expect(normalizeDuration('12345678', 6)).toBe('12:34:56');
  });

  it('round-trips', () => {
    expect(parseDuration('1:45:30')).toBe(6330);
    expect(formatDuration(6330)).toBe('1:45:30');
    expect(formatDuration(59.6)).toBe('1:00');
  });
});
