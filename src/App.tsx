import { Field } from './components/Field';
import { Fitness } from './components/Fitness';
import {
  calculated,
  display,
  edit,
  initialState,
  inputValue,
  normalize,
  solve,
  switchUnit,
  type Key,
} from './lib/calculator';
import { formatDistance, formatSpeed } from './lib/format';
import { PRESETS, type Unit } from './lib/units';
import { useStoredState } from './lib/use-stored-state';

export default function App() {
  const [state, setState] = useStoredState('pace-calculator', initialState);
  const { unit, text, inputs } = state;
  const target = calculated(state);
  const values = solve(state);

  const valueOf = (key: Key) => {
    if (key !== target) return text[key];
    return values ? display(key, values[key], unit) : '';
  };

  const change = (key: Key) => (raw: string) =>
    setState((s) => edit(s, key, normalize(key, raw)));

  const pickPreset = (meters: number) =>
    setState((s) =>
      edit(s, 'distance', formatDistance(meters, s.unit), meters)
    );

  const setUnit = (next: Unit) => setState((s) => switchUnit(s, next));

  const presetActive = (meters: number) =>
    inputs.includes('distance') &&
    Math.abs((inputValue(state, 'distance') ?? 0) - meters) < 1;

  return (
    <main className='app'>
      <header className='header'>
        <h1>Pace calculator</h1>
        <div className='toggle' role='group' aria-label='Units'>
          {(['km', 'mi'] as const).map((u) => (
            <button
              key={u}
              aria-pressed={unit === u}
              onClick={() => setUnit(u)}
            >
              {u}
            </button>
          ))}
        </div>
      </header>

      <section className='card'>
        <Field
          id='distance'
          label='Distance'
          value={valueOf('distance')}
          placeholder='0'
          suffix={unit}
          inputMode='decimal'
          calculated={target === 'distance'}
          onChange={change('distance')}
        >
          <div className='chips'>
            {PRESETS.map(({ label, meters }) => (
              <button
                key={label}
                className='chip'
                aria-pressed={presetActive(meters)}
                onClick={() => pickPreset(meters)}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>

        <Field
          id='time'
          label='Time'
          value={valueOf('time')}
          placeholder='h:mm:ss'
          inputMode='numeric'
          calculated={target === 'time'}
          onChange={change('time')}
        />

        <Field
          id='pace'
          label='Pace'
          value={valueOf('pace')}
          placeholder='m:ss'
          suffix={`/${unit}`}
          inputMode='numeric'
          calculated={target === 'pace'}
          onChange={change('pace')}
        >
          {values && (
            <span className='field__hint'>
              {formatSpeed(values.pace, unit)}
            </span>
          )}
        </Field>

        <div className='card__footer'>
          <span className='note'>
            {values ? 'Edit any two to recalculate.' : 'Enter any two.'}
          </span>
          {inputs.length > 0 && (
            <button
              className='link'
              onClick={() => setState({ ...initialState, unit })}
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {values && <Fitness values={values} unit={unit} />}

      <footer className='footer'>
        <a href='https://github.com/mardesnic/des-pace-calculator'>Source</a>
      </footer>
    </main>
  );
}
