#!/usr/bin/env node
// reuse-check — "does the design system / product already have this?"
// Usage: node <skill>/scripts/reuse-check.mjs <keyword> [keyword…]
// Searches every source of truth and prints what already exists, so a screen is
// composed from it instead of inventing something new.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

import { homedir } from 'node:os';
const isRepo = (d) => d && existsSync(join(d, 'AI-GUIDE.md')) && existsSync(join(d, 'apps/product'));
const up = (d) => { while (d !== '/' && !isRepo(d)) d = dirname(d); return isRepo(d) ? d : null; };
const root = process.env.PRISM_V1 || up(process.cwd()) || [join(homedir(), 'Documents/GitHub/Prism-v1')].find(isRepo);
if (!root || !isRepo(root)) { console.error('Prism-v1 not found. cd into it, set PRISM_V1=/path/to/Prism-v1, or clone github.com/Bayardo88/Prism-v1.'); process.exit(2); }

const terms = process.argv.slice(2).map((t) => t.toLowerCase());
if (!terms.length) { console.error('Usage: reuse-check.mjs <keyword> [keyword…]'); process.exit(2); }
const hit = (s) => terms.some((t) => s.toLowerCase().includes(t));
const read = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), 'utf8') : '');
const lines = (p) => read(p).split('\n').map((l, i) => [i + 1, l]);

const out = [];
const section = (title, rows) => { if (rows.length) out.push(`\n## ${title} (${rows.length})`, ...rows.slice(0, 25).map((r) => '  ' + r), rows.length > 25 ? `  … +${rows.length - 25} more` : ''); };

// 1. Product screens + states (what page already does this?)
try {
  const screens = JSON.parse(read('docs/product/screens.json'));
  section('Screens/states that already exist', screens.flatMap((s) => {
    const rows = [];
    if (hit(`${s.title} ${s.summary} ${s.component} ${s.route}`)) rows.push(`SCREEN ${s.id}  ${s.route}  <${s.component}>  — ${s.summary}`);
    for (const st of s.states) if (hit(`${st.label} ${st.key}`)) rows.push(`  state ${s.id}?state=${st.key} — ${st.label} (Figma ${st.figmaNode})`);
    return rows;
  }));
} catch { /* catalog not generated */ }

// 2. Figma → React component map
section('Components (docs/components.md)', lines('docs/components.md').filter(([, l]) => l.startsWith('|') && !/^\|\s*(Figma|-)/.test(l) && hit(l)).map(([n, l]) => `L${n} ${l.replace(/\s+/g, ' ')}`));

// 3. AI-GUIDE: intent railroad + component API
section('AI-GUIDE intent → component (§5) and API (§7)', lines('AI-GUIDE.md').filter(([n, l]) => n >= 189 && n <= 622 && hit(l)).map(([n, l]) => `L${n} ${l.trim().slice(0, 200)}`));

// 4. Per-page behaviour docs (patterns and rules)
const pagesDir = join(root, 'docs/product/pages');
if (existsSync(pagesDir)) {
  const rows = [];
  for (const f of readdirSync(pagesDir)) for (const [n, l] of lines(`docs/product/pages/${f}`)) if (hit(l) && /^(#|- |Components used)/.test(l)) rows.push(`${f}:${n} ${l.trim().slice(0, 180)}`);
  section('Page docs — existing behaviour & rules', rows);
}

// 5. Tokens
section('Tokens (docs/tokens.md)', lines('docs/tokens.md').filter(([, l]) => hit(l)).map(([n, l]) => `L${n} ${l.trim().slice(0, 160)}`));

// 6. Known gaps — if it's listed, the gap is deliberate: do not "fix" silently
section('Known gaps (docs/known-gaps.md) — READ before proposing anything new', lines('docs/known-gaps.md').filter(([, l]) => /^#{1,3} /.test(l) && hit(l)).map(([n, l]) => `L${n} ${l}`));

console.log(`reuse-check: "${terms.join('", "')}"`);
console.log(out.filter(Boolean).join('\n') || '\nNOTHING FOUND for those terms. Try synonyms (e.g. "picker" for "select", "modal" for "dialog") before concluding it does not exist.');
console.log('\nNext: if any hit fits, USE it. Only if none does, see references/reuse-ladder.md in the skill.');
