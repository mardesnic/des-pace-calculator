import {
  formatDistance,
  formatDuration,
  formatPace,
  normalizeDistance,
  normalizeDuration,
  parseDistance,
  parseDuration,
  parsePace,
} from './format';
import type { Unit } from './units';

export type Key = 'distance' | 'time' | 'pace';

const KEYS: Key[] = ['distance', 'time', 'pace'];

export type State = {
  unit: Unit;
  // What's typed in each field. A calculated field shows its result instead.
  text: Record<Key, string>;
  // The fields you edited last, newest first. With two, the third is solved.
  inputs: Key[];
  // Unrounded values for inputs whose text was reformatted (unit switch,
  // presets), so switching km/mi back and forth doesn't drift.
  exact: Partial<Record<Key, number>>;
};

export const initialState: State = {
  unit: 'km',
  text: { distance: '', time: '', pace: '' },
  inputs: [],
  exact: {},
};

export type Values = { distance: number; time: number; pace: number };

function parse(key: Key, text: string, unit: Unit) {
  if (key === 'distance') return parseDistance(text, unit);
  if (key === 'time') return parseDuration(text);
  return parsePace(text, unit);
}

export function normalize(key: Key, raw: string) {
  if (key === 'distance') return normalizeDistance(raw);
  return normalizeDuration(raw, key === 'time' ? 6 : 4);
}

export function edit(
  state: State,
  key: Key,
  text: string,
  exact?: number
): State {
  const others = state.inputs.filter((k) => k !== key);
  return {
    ...state,
    text: { ...state.text, [key]: text },
    inputs: text ? [key, ...others].slice(0, 2) : others,
    exact: { ...state.exact, [key]: exact },
  };
}

export const inputValue = (state: State, key: Key) =>
  state.exact[key] ?? parse(key, state.text[key], state.unit);

export function switchUnit(state: State, unit: Unit): State {
  const next: State = { ...state, unit, text: { ...state.text }, exact: {} };
  for (const key of state.inputs) {
    const v = inputValue(state, key);
    if (!v) continue;
    next.exact[key] = v;
    next.text[key] = display(key, v, unit);
  }
  return next;
}

export const calculated = (state: State) =>
  state.inputs.length === 2
    ? KEYS.find((k) => !state.inputs.includes(k))!
    : null;

// All three values once two valid inputs are in.
export function solve(state: State): Values | null {
  const target = calculated(state);
  if (!target) return null;
  const known: Partial<Values> = {};
  for (const key of state.inputs) {
    const v = inputValue(state, key);
    if (!v) return null;
    known[key] = v;
  }
  const { distance, time, pace } = known;
  if (target === 'distance')
    return { distance: time! / pace!, time: time!, pace: pace! };
  if (target === 'time')
    return { distance: distance!, time: distance! * pace!, pace: pace! };
  return { distance: distance!, time: time!, pace: time! / distance! };
}

export function display(key: Key, v: number, unit: Unit) {
  if (key === 'distance') return formatDistance(v, unit);
  if (key === 'time') return formatDuration(v);
  return formatPace(v, unit);
}
