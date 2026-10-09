const M = require('./engine.js');
const E = require('./expected.json');
let n = 0, fail = 0;
const eq = (a, b, tag) => {
  n++;
  if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.error('FAIL', tag, JSON.stringify(a), '!=', JSON.stringify(b)); }
};
for (const c of E.cure) { let r; try { r = M.cure(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'cure ' + c.in); }
for (const c of E.time) { let r; try { r = M.time(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'time ' + c.in); }
for (const c of E.check) { let r; try { r = M.check(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'check ' + c.in); }
// anchors
const a = M.cure(1000, 'classic');
eq(a.saltG, 30, 'anchor salt'); eq(a.sugarG, 30, 'anchor sugar'); eq(a.mixG, 60, 'anchor mix');
eq(M.time(3, 'classic').hoursLo, 30, 'anchor hLo');
eq(M.time(3, 'classic').hoursHi, 42, 'anchor hHi');
eq(M.check(1000, 30).pct, 3, 'anchor pct');
// monotonic
for (const k of Object.keys(M.STYLES)) {
  n++; if (!(M.cure(2000, k).saltG > M.cure(1000, k).saltG)) { fail++; console.error('FAIL monotone cure', k); }
  n++; if (!(M.time(4, k).hoursHi > M.time(2, k).hoursHi)) { fail++; console.error('FAIL monotone time', k); }
}
// errors
const errs = [
  () => M.cure(0, 'classic'), () => M.cure(-1, 'light'), () => M.cure(NaN, 'classic'), () => M.cure(500, 'nope'),
  () => M.time(0, 'classic'), () => M.time(-2, 'peppered'), () => M.time(NaN, 'light'), () => M.time(2, 'nope'),
  () => M.check(0, 10), () => M.check(1000, 0), () => M.check(1000, 1200),
];
const msgs = ['fish weight must be positive','fish weight must be positive','fish weight must be positive','unknown style',
  'thickness must be positive','thickness must be positive','thickness must be positive','unknown style',
  'fish weight must be positive','salt weight must be positive','salt cannot outweigh the fish'];
errs.forEach((f, i) => {
  n++;
  try { f(); fail++; console.error('FAIL no-throw', i); }
  catch (e) { if (e.message !== msgs[i]) { fail++; console.error('FAIL msg', i, e.message, 'want', msgs[i]); } }
});
console.log(fail ? fail + ' FAILURES / ' + n : n + '/' + n + ' checks pass');
process.exit(fail ? 1 : 0);
