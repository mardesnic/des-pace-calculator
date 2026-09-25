// Jack Daniels & Jimmy Gilbert's running formulas ("Oxygen Power", 1979).
// VDOT is the VO2max implied by a race result: the oxygen cost of the
// race speed divided by the fraction of VO2max you can hold for that long.

const MILE = 1609.344;

// Oxygen cost (ml/kg/min) of running at v meters per minute.
const oxygenCost = (v: number) => -4.6 + 0.182258 * v + 0.000104 * v * v;

// Fraction of VO2max sustainable for t minutes.
const sustainable = (t: number) =>
  0.8 +
  0.1894393 * Math.exp(-0.012778 * t) +
  0.2989558 * Math.exp(-0.1932605 * t);

// Inverse of oxygenCost: speed in meters per minute.
const speedAt = (vo2: number) => {
  const a = 0.000104;
  const b = 0.182258;
  return (-b + Math.sqrt(b * b + 4 * a * (vo2 + 4.6))) / (2 * a);
};

export function vdot(meters: number, seconds: number) {
  const minutes = seconds / 60;
  return oxygenCost(meters / minutes) / sustainable(minutes);
}

// The formulas are fitted to race efforts from about 1500 m to the marathon.
export const isRaceDistance = (meters: number) =>
  meters >= 1500 && meters <= 42195 * 1.01;

// Race time at which `meters` gives this VDOT. VDOT falls as time grows,
// so bisect between absurdly fast and absurdly slow.
export function predictSeconds(target: number, meters: number) {
  let fast = meters / 12;
  let slow = meters / 0.5;
  for (let i = 0; i < 60; i++) {
    const mid = (fast + slow) / 2;
    if (vdot(meters, mid) > target) fast = mid;
    else slow = mid;
  }
  return (fast + slow) / 2;
}

export const PREDICTIONS = [
  { label: 'Mile', meters: MILE },
  { label: '5K', meters: 5000 },
  { label: '10K', meters: 10000 },
  { label: 'Half marathon', meters: 21097.5 },
  { label: 'Marathon', meters: 42195 },
];

export type TrainingPace = {
  label: string;
  purpose: string;
  // Seconds per meter. Easy is a range, so it has a slower pace too.
  pace: number;
  slowPace?: number;
};

const paceAt = (vo2: number) => 60 / speedAt(vo2);

export function trainingPaces(v: number): TrainingPace[] {
  return [
    {
      label: 'Easy',
      purpose: 'Most of your running',
      pace: paceAt(0.7 * v),
      slowPace: paceAt(0.62 * v),
    },
    {
      label: 'Marathon',
      purpose: 'Long runs at race pace',
      pace: predictSeconds(v, 42195) / 42195,
    },
    {
      label: 'Threshold',
      purpose: 'Comfortably hard, 20–30 min',
      pace: paceAt(0.88 * v),
    },
    {
      label: 'Interval',
      purpose: '3–5 min repeats',
      pace: paceAt(0.975 * v),
    },
    {
      label: 'Repetition',
      purpose: 'Short, fast repeats',
      pace: predictSeconds(v, MILE) / MILE,
    },
  ];
}
