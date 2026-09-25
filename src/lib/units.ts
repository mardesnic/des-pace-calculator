export type Unit = 'km' | 'mi';

export const METERS: Record<Unit, number> = { km: 1000, mi: 1609.344 };

export const PRESETS = [
  { label: '5K', meters: 5000 },
  { label: '10K', meters: 10000 },
  { label: 'Half', meters: 21097.5 },
  { label: 'Marathon', meters: 42195 },
];
