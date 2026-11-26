import { fixtures } from './fixtures.mjs';
import { createEvaluator } from './policy.mjs';
const evaluate = createEvaluator(fixtures);
const $ = id => document.getElementById(id);
const scenarios = [
  ['Verified document', 'DOC-01', 'Available units: 24', 'auto', false],
  ['Changed evidence', 'DOC-01', 'Available units: 99', 'auto', true],
  ['Unsupported claim', 'DOC-01', 'Available units: 99', 'auto', false],
  ['HTTP: integrity only', 'HTTP-01', 'Available units: 24', 'auto', false],
  ['Manual review', 'DOC-01', 'Available units: 24', 'review', false],
];
let sequence = 0;
for (const f of fixtures) {
  const opt = document.createElement('option'); opt.value = f.id; opt.textContent = f.title; $('source').append(opt);
}
function load(index) {
  const [, id, claim, mode, tamper] = scenarios[index];
  const f = fixtures.find(x => x.id === id);
  $('source').value = id; $('evidence').value = tamper ? f.text.replace('24', '99') : f.text;
  $('claim').value = claim; $('mode').value = mode;
  document.querySelectorAll('[data-scenario]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.scenario) === index)));
  run();
}
for (const [i, s] of scenarios.entries()) {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = s[0]; b.dataset.scenario = i;
  b.addEventListener('click', () => load(i)); $('scenarios').append(b);
}
$('source').addEventListener('change', () => { const f = fixtures.find(x => x.id === $('source').value); $('evidence').value = f.text; });
function invalidate() {
  sequence++; $('decision').textContent = 'Not evaluated'; $('decision').dataset.state = 'HOLD';
  for (const id of ['integrity','support','authenticity','reason']) $(id).textContent = '—';
  $('audit').textContent = 'Run evaluation to inspect the current input.';
  document.querySelectorAll('[data-scenario]').forEach(b => b.setAttribute('aria-pressed','false'));
}
for (const id of ['source','evidence','claim','mode']) $(id).addEventListener('input', invalidate);
async function run() {
  const current = ++sequence;
  const r = await evaluate({ sourceId: $('source').value, evidence: $('evidence').value, claim: $('claim').value, mode: $('mode').value });
  if (current !== sequence) return;
  $('decision').textContent = r.decision; $('decision').dataset.state = r.decision;
  for (const key of ['integrity','support','authenticity','reason']) $(key).textContent = r[key];
  $('audit').textContent = JSON.stringify(r, null, 2);
}
$('evaluate').addEventListener('click', run);
load(0);
