---
name: scalar-forge
description: Build real, clickable prototypes of the Scalar product — new pages, edits to existing pages, new features, standalone screens — using only Scalar design tokens, the coded design-system components and the product's documented screen logic (Prism-v1). Reuse-first: never hard-codes values or invents components or layouts unless the feature itself requires it. Use whenever someone asks to add, change, extend, mock up, prototype or explore any Scalar screen, flow, modal, state or feature (Home, Intelligence, Valuations, Waterfalls, Documents, Company pages, Account, User Management, Comp Groups, Audit Logs, Firm Settings), asks for a one-off screen, or pastes a Scalar Figma link — and to push a built screen back into Figma.
---

# Scalar Forge

Turns "I need a page / I want to explore this feature" into a working React
prototype of the **real Scalar product**, composed only from what already exists:

- **Tokens + components** — `@scalar/design-system` (Prism-v1 `src/`)
- **Platform chrome + 37 coded screens** — Prism-v1 `apps/product/`
  (all 103 frames of Figma file `cZktZhD0ssL5lRVOvSqmOV`)
- **Logic + documentation** — `AI-GUIDE.md`, `docs/`, `docs/product/pages/*.md`

The skill's value is discipline: **reuse first, novelty only when the feature
demands it, and prove it.**

## Non-negotiables

1. No raw hex/rgb, no raw px in spacing/sizing, no hand-set font sizes, no `--primitive-*` tokens, nothing under 12px. (`npm run lint:tokens` enforces it.)
2. No new component, token, layout pattern or chrome unless it passes the **reuse ladder** — and even then you ask first.
3. Behaviour comes from the documented patterns and page docs, not from taste.
4. Nothing is "done" until it has been rendered and checked.

---

## Step 0 — Locate Prism-v1 and load the contract

1. Repo: `$PRISM_V1`, the current directory if it has `apps/product/`, or `~/Documents/GitHub/Prism-v1`. Missing → `git clone https://github.com/Bayardo88/Prism-v1` and `npm install`. If it cannot be obtained, **stop and say so** — never approximate the design system from memory or an old mockup.
2. Read **`AI-GUIDE.md`** (rules R1–R13, intent→component tables, API, anti-patterns). It overrides any screenshot or existing screen.
3. Read [references/app-architecture.md](references/app-architecture.md) (screen × state model, chrome, routes, DataGrid rules).
4. Read [references/reuse-ladder.md](references/reuse-ladder.md) and [references/screen-logic.md](references/screen-logic.md).
5. Skim `docs/known-gaps.md` — gaps change what you may build (charts, dense grids, icons).
6. See what exists: `docs/product/screen-catalog.md` / `screens.json`, and `docs/product/README.md` (IA map).

## Step 1 — Classify the request

| The user wants… | Mode | Go to |
|---|---|---|
| A page that doesn't exist yet | **New page** | 3A |
| A change to an existing page (layout, content, new state, modal) | **Edit page** | 3B |
| A flow to click through / an idea to explore, possibly throwaway | **Prototype** | 3C |
| A one-off screen outside the product (demo, gallery, experiment) | **Standalone** | 3D |
| A built screen pushed into Figma | **Figma push** | Step 5 |

A Figma link/node id: look it up in `screens.json` (`states[].figmaNode`). Found → **Edit page** on that screen/state (the frame is already coded — read the code, don't rebuild from Figma). Not found → the frame is newer than the code: **New page** (or new state on the closest screen) and add it to `apps/product/figma-frames.json`.

State the mode and the existing screen(s) you start from, in one line, before writing code.

## Step 2 — Reuse check → screen brief → ladder (mandatory, before any JSX)

1. `node <skill-dir>/scripts/reuse-check.mjs <2–4 keywords + synonyms>` — searches screens/states, the Figma→React component map, the AI-GUIDE intent table, page docs, tokens and known gaps at once. Try synonyms before concluding something doesn't exist.
2. Write the **screen brief** (screen-logic.md §1): job · chrome · archetype · route + entry point · data · inputs vs calculated · states · actions/outcomes · rules · reuse verdict.
3. Walk the **reuse ladder**. Everything must land on rungs 1–5 (existing screen → composed pieces → chrome slot → DS component/props → composition of DS parts). A new component/token/layout is allowed **only when the feature needs behaviour nothing existing provides**; then run the rung-7 protocol (state the gap → ask → build smallest → log it). Never for looks, never to match a pasted screenshot.

## Step 3 — Build

### 3A · New page
1. Base it on the **nearest existing screen** (same archetype + chrome). Copy structure, not data.
2. Home: the `screens/<page>/` folder of its Figma page, or a new `screens/p17-<area>/` (add to `registry.ts`, give it a Figma page name).
3. Route in `apps/product/src/routes.ts` (company pages: `company:` + `companyPattern(...)`).
4. **Wire the way in and out** — a menu item, tab, row link or menu entry. An unreachable page is not done. Editing chrome in `shell/` is fine when the IA really changes; say so.
5. Register a `ScreenDef` with ≥1 state. Real states need a Figma frame id; until then it's a prototype (3C).

### 3B · Edit page
1. Find it: catalog → `component` + `id` → `screens/<page>/<Component>.tsx`. Read the whole file and its `index.ts` first.
2. A new visual variant is a **new state**, not a new screen: `{ key, label, figmaNode, section }`, UI derived from `state`, still interactive (`useState(initialFromState)`).
3. Keep shared names/figures in `data/fixtures.ts` / `db` in sync ("ABC Co" is the same everywhere).
4. Re-open every state of the screen afterwards.

### 3C · Prototype
1. `apps/product/src/screens/prototypes/<name>/` with its own `index.ts` exporting `screens`, registered in `registry.ts` after the real pages; routes `/prototypes/<name>/…`.
2. **Compose from real screens** — import existing screens/pieces, the shell and fixtures. A prototype that redraws the Cap Table will drift on day one.
3. Clickable end to end with `href(...)`/`navigate(...)`; one screen with states, or several screens if the URL changes.
4. Mark it: `figmaPage: 'Prototype · <name>'`, states `figmaNode: 'proto:<name>:<n>'` (the coverage check accepts that prefix and lists prototypes separately). When accepted, promote via 3A with real frame ids.

### 3D · Standalone screen (outside the product app)
1. Put it in `examples/screens/<Name>.tsx` with an `examples/<name>-entry.tsx` + `.html` like the existing ones; build with `npm run build:examples`.
2. Pick an archetype from [references/screen-recipes.md](references/screen-recipes.md) (`data-sheet` · `dashboard` · `detail` · `form` · `list-search` · `empty-or-error`), say which and why, and compose it from the listed components and chrome.
3. If it belongs in the product at all, use 3A/3C instead — standalone is for screens that intentionally live outside it.

**Composition limits for every mode.** Colour from `color.*`, gaps from `space.*`, sizes from `size.*`, type from `Typography` or `type.style()`; icons from Material Symbols (`<Icon><icons.Name /></Icon>` — missing one: add to `material-icons.json`, `npm run gen:icons`, rebuild). Layout ratios (`fr`, `%`, `flex`) and 1px borders are fine. Companies/users/funds from `db`/`fixtures.ts`, never hard-coded lists; realistic finance copy, no lorem ipsum.

## Step 4 — Verify. Don't claim it works until you've looked.

```bash
npm run build            # only if src/ changed
npm run verify:product   # compile app + token lint + every-frame coverage check
```
Reuse contract: `git diff --stat` shows **no new file under `src/components/` or `src/styles/`** unless a rung-7 request was approved, and no `style={{…}}` value that isn't a token.

Render: `node scripts/serve.mjs` → `http://localhost:4178/apps/product/index.html#<route>?state=<key>` (standalone: the example's html). Check in order: no console errors · every state of the touched screen · links in/out navigate · **dark mode** (`data-theme`) · focus visible · nothing under 12px · charts with ≥3 series have direct labels. Report what you checked; if you couldn't render, say so. (Hidden browser panes can't screenshot — use headless Chrome: `--headless=new --screenshot`, `--blink-settings=preferredColorScheme=1` for light.)

## Step 5 — Docs and Figma

- Update `docs/product/pages/<page>.md` (purpose, how users get here, states, components, rules, **Gaps**). `npm run product:catalog` regenerates the catalog.
- Push to Figma (code → design) only after it renders correctly: load `figma-generate-design` + `figma-use`, follow [references/figma-push.md](references/figma-push.md) — **assemble from published library instances, never redraw as rectangles**, bind variables, no charts. Ask before writing to a shared file and name the file and page. Estimate Figma MCP calls first (seat cap) and batch.
- Reading Figma to ground a design: screen-logic.md §4 (order of trust, which MCP tools, token mapping by name).

---

## Refuse to

- Hand-roll a component, colour, spacing or type size the layer has; or add a component/layout/token because it "looks better".
- Invent behaviour the page docs or DS patterns already define (validation, empty state, confirmation, pagination).
- Build against a token name that isn't in `AI-GUIDE.md`; copy colours/sizes from a mockup instead of the contract.
- Build a page without `AppFrame`/`CompanyLayout` chrome, or with chrome copied.
- Leave a new page unreachable or break a route (the catalog check catches dropped frames, not dead links — you must).
- Colour a Global Search result by anything but its PRISM type, or use PRISM for access/permission.
- Use `text.primary` on a filled surface or white on `bg.warning`; ship a chart without a legend or a canvas chart without its data table.
- Silently "fix" something in `docs/known-gaps.md`.
