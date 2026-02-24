# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- **Start dev server**: `npm run dev` (API on port 50169 with Firestore emulator)
- **Build all**: `npm run build` (builds app, API, lexicon, and spec)
- **Build lexicon**: `cd packages/api && npm run build-lexicon`
- **Build spec**: `cd packages/api && npm run build-spec`

### Linting
- **Root**: `npm run lint` (lints test/ directory)
- **API**: `cd packages/api && npm run lint` (lints src/ and tools/)
- **App**: `cd packages/app && npm run lint`
- Append `:fix` to any lint command for auto-fix

### Deployment
- **Cloud Build**: `npm run gcp:build`
- **Direct deploy**: `npm run gcp:deploy`
- **View logs**: `npm run gcp:logs`

### Publishing
- `npm run pack` — builds distributable @graffiticode/l0169 package
- `npm run publish` — publishes to npm

## Architecture

L0169 is a Graffiticode language for authoring **interactive concept web assessment diagrams** — educational tools where students interact with connected concept nodes arranged in a web layout.

Monorepo with npm workspaces: `packages/api` (Express compiler backend) and `packages/app` (React/TypeScript frontend library).

### Compiler Pipeline (packages/api/src/)

Extends `@graffiticode/basis` with L0169-specific `Checker` and `Transformer` classes in `compiler.js`.

**Lexicon** (`lexicon.js`) defines the language vocabulary:

| Function | Arity | Description |
|----------|:-----:|-------------|
| `topic` | 2 | Topic label at top |
| `instructions` | 2 | Instructions text below the topic (supports markdown) |
| `anchor` | 2 | Central anchor concept at diagram center |
| `connections` | 2 | List of peripheral connection definitions |
| `connection` | 1 | Single peripheral connection |
| `value` | 2 | Scoring value (default display text) |
| `text` | 2 | Display text override for node or concept |
| `assess` | 2 | Assessment config (pipeline of method + expected) |
| `method` | 1 | Assessment method (`'value'` or `VALUE` tag) |
| `expected` | 1 | Expected correct value |
| `theme` | 2 | UI theme (`DARK` or `LIGHT` tag) |
| `concepts` | 2 | List of drag-and-drop tray concepts |
| `concept` | 1 | Single tray concept |
| `image` | 2 | Image URL for a tray concept |
| `align` | 2 | Tray position: `RIGHT`, `LEFT`, `TOP`, `BOTTOM` |

The `Transformer.PROG` method auto-generates solid edges from each connection to the anchor and assembles a `conceptWeb` data structure with topic, instructions, anchor, connections, edges, concepts, and trayAlign.

**Spec files** (`packages/api/spec/`) — `spec.md` is the language specification, `instructions.md` provides LLM authoring guidelines, `template.gc` is an example program. These are built into `dist/` and served by the API.

### Frontend (packages/app/lib/)

- `view.jsx` — Top-level View component. Manages state via reducer, handles iframe embedding (postMessage), and triggers recompilation via SWR when state changes.
- `components/form/Form.tsx` — Renders output: dispatches to `ConceptWeb` for concept web data, raw JSON for other data, or error display.
- `components/form/concept-web/` — Interactive concept web diagram UI: hybrid DOM+SVG with draggable nodes and edge lines.

### Data Flow

```
URL params (id, access_token, origin) → View → SWR getData → state.apply("init")
state.apply("update") → SWR compile → state.apply("compiled") → Form render → postMessage to parent
```

### Key Dependencies
- `@graffiticode/basis` — compiler framework (may be symlinked from `../../../basis` during development)
- Firestore emulator on port 8080 for local development

### Environment Variables
- `PORT` (default: 50169)
- `AUTH_URL` (default: https://auth.graffiticode.org)
- `FIRESTORE_EMULATOR_HOST` (dev only, set automatically by `npm run dev`)
