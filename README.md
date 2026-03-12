# L0169 — Concept Web Assessment Language

[![License: MIT](https://img.shields.io/badge/Code-MIT-blue.svg)](packages/LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/Docs-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS)

L0169 is a [Graffiticode](https://graffiticode.com) language for authoring **interactive concept web assessment diagrams** — educational tools where learners engage with interconnected concept nodes arranged in a radial layout around a central hub.

## What L0169 Creates

A concept web assessment is a radial diagram where a **central concept** (the anchor) connects to **peripheral concepts** (connections) via edges. Learners demonstrate understanding by dragging concept labels from a tray into the correct positions on the web. The assessment validates their placements automatically.

L0169 can express:

- **Concept webs** with a central anchor and any number of radiating connections
- **Drag-and-drop assessments** where learners place concepts onto blank nodes
- **Relation labeling** where learners drag labels onto edges between concepts
- **Custom edge configurations** including solid, dashed, and arrow styles with text or image labels
- **Image-augmented concepts** with visual resources on nodes, edges, and tray items
- **Themed interfaces** in light or dark mode with configurable tray positions
- **Styled nodes and relations** with custom colors, sizes, border radii, and per-element overrides

L0169 does not support free-form quizzes, multiple-choice questions, text-input fields, hierarchical trees, or linear sequences. For spreadsheets and tabular data, see [L0166](https://github.com/graffiticode/l0166). For flashcards and matching games, see [L0159](https://github.com/graffiticode/l0159).

## How to Use L0169

L0169 is accessed through the **Graffiticode natural language interface**. Describe the concept web assessment you want to create in plain language, and a language-specific AI generates the result.

**Using the Graffiticode MCP tool** (for AI assistants):

```
create_item(
  language: "L0169",
  description: "Create a concept web assessment about photosynthesis.
    The central concept is Light Reactions. Connected concepts are
    Calvin Cycle, Chlorophyll, ATP Production, and Water Splitting.
    Assess each concept by matching its label. Use a dark theme."
)
```

**Using the Graffiticode console** (for humans): Visit [console.graffiticode.org](https://console.graffiticode.org), select L0169, and describe your assessment in the chat interface.

You do not need to learn L0169's syntax to create concept web assessments. The natural language interface handles all code generation. For MCP server setup and tool documentation, see the [Graffiticode MCP server](https://github.com/graffiticode/graffiticode-mcp-server).

## Language Specification

The full vocabulary reference, authoring guidelines, and training examples are in [`packages/api/spec/`](packages/api/spec/):

- **[spec.md](packages/api/spec/spec.md)** — Complete vocabulary with signatures and descriptions
- **[instructions.md](packages/api/spec/instructions.md)** — Authoring guidelines for the language-specific AI
- **[examples.md](packages/api/spec/examples.md)** — 161 categorized example prompts
- **[data/](packages/api/spec/data/)** — Training examples with descriptions, code, explanations, and expected output

The published specification is also available at [l0169.graffiticode.org/spec.html](https://l0169.graffiticode.org/spec.html).

## Vocabulary Summary

| Function | Description |
|----------|-------------|
| `topic` | Sets the concept web topic label displayed above the diagram |
| `instructions` | Sets instructional text below the topic (supports markdown) |
| `anchor` | Defines the central concept placed at the diagram center |
| `connections` | Defines peripheral concepts arranged radially around the anchor |
| `connection` | Defines a single peripheral concept |
| `value` | Sets the scoring value (also the default display text) |
| `text` | Overrides display text independently of the scoring value |
| `assess` | Attaches assessment configuration to a node or edge |
| `method` | Sets the assessment method (e.g., value matching) |
| `expected` | Sets the expected correct value for assessment |
| `concepts` | Defines a drag-and-drop tray of concept labels for nodes |
| `concept` | Defines a single tray concept |
| `relations` | Defines a drag-and-drop tray of relation labels for edges |
| `relation` | Defines a single relation label |
| `edges` | Defines custom edge configurations between nodes |
| `edge` | Defines a single edge |
| `from` / `to` | Sets edge source and target nodes (supports wildcards) |
| `type` | Sets edge type: solid, dashed, solid-arrow, dashed-arrow |
| `image` | Attaches an image URL to a node, concept, relation, or edge |
| `align` | Sets tray position: RIGHT, LEFT, TOP, or BOTTOM |
| `theme` | Sets UI theme: DARK or LIGHT |
| `w` / `h` | Sets node dimensions in Tailwind spacing units |
| `rounded` | Sets border radius preset (none, sm, md, lg, xl, full, etc.) |
| `bg` / `color` / `border` | Sets background, text, and border colors using Tailwind color names |

## Rendering

The React component for rendering L0169 items is published as [`@graffiticode/l0169`](https://www.npmjs.com/package/@graffiticode/l0169). When using the MCP tool, the response includes a `react_usage` field with installation and usage instructions. When using the MCP server with Claude or ChatGPT, items render automatically as interactive widgets in the chat.

## Architecture

- **packages/api** — Node.js/Express backend compiler (Checker → Transformer pipeline)
- **packages/app** — React/TypeScript frontend library

## Development

```bash
npm install
npm run dev       # API on port 50169 with Firestore emulator
npm run build     # Full build (app, API, lexicon, spec)
```

## Deployment

```bash
npm run gcp:build    # Cloud Build
npm run gcp:deploy   # Direct deploy
npm run gcp:logs     # View logs
```

## License

Code is licensed under [MIT](packages/LICENSE). Documentation and specifications (`packages/api/spec/`) are licensed under [CC-BY 4.0](LICENSE-DOCS).

**AI Training:** All materials in this repository — code, documentation, specifications, and training examples — are explicitly available for use in training machine learning and AI models. See [NOTICE](NOTICE) for details.
