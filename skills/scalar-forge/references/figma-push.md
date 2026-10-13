# Pushing a screen back into Figma

Run this **after** the React screen renders correctly. Frames are light only, the same as pages (R14). The point
is to give design a frame they can react to and edit, not a picture.

## Before you start

- Load the `figma-generate-design` and `figma-use` skills. `use_figma` without
  `figma-use` fails in hard-to-debug ways.
- Confirm the target: which Figma file, which page, and whether it is shared.
  **Ask before writing to a shared file**, and name the file and page you are
  writing to.

## The one rule that matters

**Assemble from instances of the published v1.1 library components. Never
redraw the UI as rectangles and text.**

A redrawn screen looks right in a screenshot and is worthless afterwards: it
does not respond to a token change, it cannot be restyled from the library, and
design cannot swap a variant. That is the difference between a screen and a
picture of a screen.

| Figma file | Key | Holds |
|---|---|---|
| Components | `Z4MtKOfkNEzhMYJzN1q3kR` | 154 component sets across 23 pages (`docs/components.md` has the current count), incl. **18 · Template** |
| Tokens | `anrnTIJKgu27zV224h7vON` | variables + 3 elevation styles |

Both are published, so `importComponentByKeyAsync` and
`importVariableByKeyAsync` work from any file — **except `cell` and `Header`,
which are UNPUBLISHED** and will fail to import. They are the atoms of the data
grid, so a data-sheet screen cannot have its grid filled until they are
published. Leave the region marked rather than redrawing it. See
`docs/known-gaps.md` gap 9.

Check before you start:

```js
await node.getPublishStatusAsync()   // 'CURRENT' | 'CHANGED' | 'UNPUBLISHED'
```

## Sequence

1. **Discover.** `search_design_system` scoped with `includeLibraryKeys` to the
   Scalar libraries — unscoped it returns unrelated community kits. Or read the
   component sets straight off the components file.
2. **Import** the component keys you need, once, and keep the ids.
3. **Build the skeleton from the template.** Place an instance of **Page Template ·
   Body Slot** (page **18 · Template**; the designers' frame is `1671:13280`). Its
   navigation, company header, Tertiary Menu and drawer are already instances.
   Set their properties to match the screen's `PageTemplate` props. Hide a tier
   the screen omits; don't delete it. Inside the `BODY-SLOT`, add a
   `placeholder = true` section per region of the body. Return the node ids.
4. **Fill one region per call.** Instance the component, set its variant
   properties to match the React props, then `placeholder = false`.
5. **Set content through component properties, not by redrawing.** Nested
   instances expose their own text and variant properties — read
   `instance.componentProperties` and set them with `setProperties`. A composed
   component may already contain a region you were about to add yourself:
   `Company info` carries its own secondary nav, so adding a separate bar
   duplicates it.
6. **Bind variables, do not paste values.** Padding and gap bind to
   `Semantic: Spacing`, fills to `Semantic: Color`, radius to `Semantic: Radius`,
   type to `Semantic: Type`. A hard-coded hex in Figma is the same bug as a hard
   -coded hex in CSS.
7. **Set the type mode on the frame** — Desktop (1440), Desktop Large (1920) or
   Mobile (393). Never hand-resize type to fit.
8. **Screenshot and compare** against the rendered React screen. Fix drift
   before handing over.

## Mapping props to variants

The React API and the Figma variant matrix are the same model, collapsed
differently. `docs/components.md` has the full table; the ones that trip people:

| React | Figma |
|---|---|
| `<Button variant tone size>` | Button `Style` × `Type` × `Size` |
| `disabled` | Button `Type=Disabled` (a Type, not a State) |
| `:hover` / `:active` | Button `State=Hover` / `Pressed` — CSS in code, variants in Figma |
| `<Row>` + `<Cell type>` | `Row-reading` vs `Row-input` |
| `<SectionSubMenu>` | `Captable sub-menu` / `Valuations sub-menu` |
| `<ToolSwitch value>` | `Valuation` + `Workboard` + `Tool-switch` |
| `chartScaffold(grid)` | `Chart Frame` `Grid` variant |
| `<PageTemplate>` + `children` | Page Template · Body Slot + its `BODY-SLOT` slot |
| `<RowHeader>` | the first cell of `Row-reading` / `Row-input` |
| any export marked **＋** in `docs/components.md` (e.g. `Table`, `ActionPill`, `StepMenu`, `DealCard`, `WorkCalendar`, `WorkTimeline`) | code-first: there's no library set to instance. Leave the region marked with a note naming the component and its props (and its story URL). Don't redraw it |

Interaction states have no CSS equivalent in Figma, so a handed-over screen
shows the default state. Only build a hover or pressed frame if design asked
for one.

## What not to push

- Charts. They are Chart.js on a canvas; Figma has no equivalent and a redrawn
  chart is a picture. Push the surrounding screen and leave a frame sized for
  the chart with a note naming the component and its props.
- A dark frame (R14).
- Anything still failing `npm run verify`. Fix the code first — pushing a broken
  screen puts the drift into design's hands.
