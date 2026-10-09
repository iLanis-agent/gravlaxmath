/* Gravlax math - exact arithmetic on labeled published curing norms.
   Curing flavors; it does not sterilize. See the safety note in the app. */
const STYLES = {
  classic:  { saltPct: 0.030, sugarRatio: 1.0, hPerCmLo: 10, hPerCmHi: 14, note: 'the dill-forward original' },
  peppered: { saltPct: 0.030, sugarRatio: 0.7, hPerCmLo: 10, hPerCmHi: 14, note: 'classic cure, cracked pepper finish' },
  light:    { saltPct: 0.022, sugarRatio: 0.8, hPerCmLo: 8,  hPerCmHi: 12, note: 'gentler cure, shorter keep (labeled)' },
};
const r1 = x => Math.round(x * 10) / 10;
const r2 = x => Math.round(x * 100) / 100;
const bad = m => { throw new Error(m); };

function cure(fishG, styleKey) {
  const s = STYLES[styleKey];
  if (!s) bad('unknown style');
  if (!Number.isFinite(fishG) || fishG <= 0) bad('fish weight must be positive');
  const saltG = fishG * s.saltPct;
  const sugarG = saltG * s.sugarRatio;
  const mixG = saltG + sugarG;
  let verdict;
  if (fishG < 500) verdict = 'a dinner-sized side (labeled)';
  else if (fishG < 1500) verdict = 'a weekend side - fits a baking dish (labeled)';
  else verdict = 'a party side - clear a fridge shelf (labeled)';
  return { saltG: r1(saltG), sugarG: r1(sugarG), mixG: r1(mixG), verdict, note: s.note };
}

function time(thickCm, styleKey) {
  const s = STYLES[styleKey];
  if (!s) bad('unknown style');
  if (!Number.isFinite(thickCm) || thickCm <= 0) bad('thickness must be positive');
  const hLo = s.hPerCmLo * thickCm;
  const hHi = s.hPerCmHi * thickCm;
  let verdict;
  if (hHi <= 24) verdict = 'an overnight cure (labeled)';
  else if (hHi <= 48) verdict = 'a day or two - flip it twice a day (labeled)';
  else verdict = 'a long cure - patience and daily flips (labeled)';
  return { hoursLo: r1(hLo), hoursHi: r1(hHi), verdict, note: s.note };
}

function check(fishG, saltG) {
  if (!Number.isFinite(fishG) || fishG <= 0) bad('fish weight must be positive');
  if (!Number.isFinite(saltG) || saltG <= 0) bad('salt weight must be positive');
  if (saltG >= fishG) bad('salt cannot outweigh the fish');
  const pct = (saltG / fishG) * 100;
  let band;
  if (pct < 2) band = 'lighter than published norms - cure shorter, keep colder, eat sooner (labeled)';
  else if (pct <= 3.5) band = 'inside the published norm range for equilibrium-style cures (labeled)';
  else band = 'heavier than equilibrium norms - a traditional heavy cure; expect firm, salty slices (labeled)';
  return { pct: r2(pct), band };
}

const api = { STYLES, cure, time, check };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.Gravlaxmath = api;
