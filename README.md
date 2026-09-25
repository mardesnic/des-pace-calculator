# Pace Calculator

A simple running calculator. Enter any two of distance, time and pace, and it calculates the third. From a race result it also estimates your VO₂max, predicts your times for other distances and suggests training paces.

## Demo

Check out the live demo at: https://mardesnic.github.io/des-pace-calculator/

On your phone, open it and choose **Add to Home Screen** (Safari) or **Install app** (Chrome). It then opens like an app and works offline.

## Features

- Distance, time and pace: the two you edited last are the inputs and the third is calculated
- Kilometres or miles, switchable at any time without losing precision
- Presets for 5K, 10K, half marathon and marathon
- Speed in km/h or mph, for treadmills
- VO₂max estimate (Jack Daniels' VDOT) for races from 1.5 km to the marathon
- Race predictions for the mile, 5K, 10K, half marathon and marathon
- Training paces: easy, marathon, threshold, interval and repetition
- Light and dark mode, remembers your last values, no ads, accounts or tracking

Times and paces fill from the right like a stopwatch, so the phone's number pad is enough: `4500` is 45:00 and `14530` is 1:45:30.

## Formulas

VO₂max, predictions and training paces come from Jack Daniels and Jimmy Gilbert's oxygen-cost and time-to-exhaustion formulas, the ones behind the VDOT tables in _Daniels' Running Formula_. The estimate assumes the result was a race effort; an easy run gives a number that's too low.

## Development

```bash
npm install
npm run dev        # local dev server
npm test           # formula tests
npm run build      # production build in dist/
```

`npm run deploy` builds the app and publishes it to GitHub Pages.
