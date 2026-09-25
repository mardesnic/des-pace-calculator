import { METERS, type Unit } from './units';

// Internally distance is meters, time is seconds and pace is seconds per meter.

const trim = (n: number, decimals: number) =>
  n.toFixed(decimals).replace(/\.?0+$/, '');

export function formatDistance(meters: number, unit: Unit, decimals = 2) {
  return trim(meters / METERS[unit], decimals);
}

export function parseDistance(text: string, unit: Unit) {
  const n = parseFloat(text);
  return n > 0 ? n * METERS[unit] : null;
}

// Keep digits and a single decimal point; accept a comma as the point.
export function normalizeDistance(raw: string) {
  const [whole, ...rest] = raw
    .replace(/,/g, '.')
    .replace(/[^\d.]/g, '')
    .split('.');
  return rest.length ? `${whole}.${rest.join('')}` : whole;
}

export function formatDuration(seconds: number) {
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

export function parseDuration(text: string) {
  if (!text) return null;
  const seconds = text
    .split(':')
    .reduce((acc, part) => acc * 60 + Number(part), 0);
  return seconds > 0 ? seconds : null;
}

// Digits fill from the right, like a stopwatch: 5 → 0:05, 500 → 5:00,
// 14530 → 1:45:30. Works with the numeric keypad, which has no colon.
export function normalizeDuration(raw: string, maxDigits: number) {
  const digits = raw.replace(/\D/g, '').replace(/^0+/, '').slice(0, maxDigits);
  if (!digits) return '';
  const padded = digits.padStart(3, '0');
  const s = padded.slice(-2);
  const m = padded.slice(-4, -2);
  const h = padded.slice(0, -4);
  return h ? `${h}:${m}:${s}` : `${Number(m)}:${s}`;
}

export function formatPace(secondsPerMeter: number, unit: Unit) {
  return formatDuration(secondsPerMeter * METERS[unit]);
}

export function parsePace(text: string, unit: Unit) {
  const seconds = parseDuration(text);
  return seconds ? seconds / METERS[unit] : null;
}

export function formatSpeed(secondsPerMeter: number, unit: Unit) {
  const perHour = 3600 / (secondsPerMeter * METERS[unit]);
  return `${perHour.toFixed(1)} ${unit === 'km' ? 'km/h' : 'mph'}`;
}
