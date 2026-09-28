# prism-builder-pro

Claude Code skill(s) for building **real prototypes of the Scalar product** from the
[Prism-v1](https://github.com/Bayardo88/Prism-v1) design system and product app —
tokens and coded components only, no hard-coded values, no invented components or
layouts unless the feature itself requires one.

## `scalar-forge`

One skill that merges the former `scalar-product` (pages/prototypes in `apps/product`),
`scalar-screen` (standalone screens + Figma push) and a reuse-first layer:

| Piece | What it does |
|---|---|
| `SKILL.md` | Modes: new page · edit page · prototype · standalone screen · Figma push |
| `references/reuse-ladder.md` | 7-rung gate; when (and how) something new is allowed |
| `references/screen-logic.md` | Screen brief, archetype→reference screen, state conventions, Figma grounding |
| `references/app-architecture.md` | `apps/product` model: screen × state, chrome, routes, DataGrid rules |
| `references/screen-recipes.md` | Six standalone archetypes and their traps |
| `references/figma-push.md` | Code → Figma by instancing published components |
| `scripts/reuse-check.mjs` | "Does this already exist?" search across screens, components, docs, tokens, known gaps |

### Install

```bash
git clone git@github.com:Bayardo88/prism-builder-pro.git
cd prism-builder-pro && ./install.sh     # symlinks into ~/.claude/skills
git clone https://github.com/Bayardo88/Prism-v1 ~/Documents/GitHub/Prism-v1 && (cd ~/Documents/GitHub/Prism-v1 && npm install)
```

Set `PRISM_V1=/path/to/Prism-v1` if it lives elsewhere. Then ask Claude Code to
"add a … page to Scalar" or "prototype …".

Requires Prism-v1 (`AI-GUIDE.md`, `apps/product/`, `docs/product/`). Figma steps use the Figma MCP.
