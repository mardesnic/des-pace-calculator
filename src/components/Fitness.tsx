import type { Values } from '../lib/calculator';
import { formatDuration, formatPace } from '../lib/format';
import type { Unit } from '../lib/units';
import {
  PREDICTIONS,
  isRaceDistance,
  predictSeconds,
  trainingPaces,
  vdot,
} from '../lib/vdot';

type Props = { values: Values; unit: Unit };

export function Fitness({ values, unit }: Props) {
  if (!isRaceDistance(values.distance)) {
    return (
      <p className='note'>
        Enter a race result between 1.5 km and a marathon to see your VO₂max,
        race predictions and training paces.
      </p>
    );
  }

  const score = vdot(values.distance, values.time);
  const perUnit = `/${unit}`;

  return (
    <>
      <section className='card vo2'>
        <div>
          <h2>VO₂max estimate</h2>
          <p className='note'>
            Jack Daniels’ VDOT, assuming this was a race effort.
          </p>
        </div>
        <span className='vo2__score'>{score.toFixed(1)}</span>
      </section>

      <section className='card'>
        <h2>Race predictions</h2>
        <table className='table'>
          <tbody>
            {PREDICTIONS.map(({ label, meters }) => {
              const seconds = predictSeconds(score, meters);
              return (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{formatDuration(seconds)}</td>
                  <td className='muted'>
                    {formatPace(seconds / meters, unit)}
                    {perUnit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className='card'>
        <h2>Training paces</h2>
        <table className='table'>
          <tbody>
            {trainingPaces(score).map(({ label, purpose, pace, slowPace }) => (
              <tr key={label}>
                <th>
                  {label}
                  <span className='muted'>{purpose}</span>
                </th>
                <td colSpan={2}>
                  {formatPace(pace, unit)}
                  {slowPace && `–${formatPace(slowPace, unit)}`}
                  <span className='muted'>{perUnit}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
