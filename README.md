# L0169

[![License: MIT](https://img.shields.io/badge/Code-MIT-blue.svg)](packages/LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/Docs-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS)

L0169 is a Graffiticode language for authoring **interactive concept web assessment diagrams** — educational tools where students interact with connected concept nodes arranged in a web layout.

## Vocabulary

| Function | Arity | Description |
|----------|:-----:|-------------|
| `topic` | 2 | Sets the concept web topic label |
| `anchor` | 2 | Defines the central anchor concept |
| `connections` | 2 | Defines peripheral connections (list) |
| `connection` | 1 | Defines a single peripheral connection |
| `value` | 2 | Sets the scoring value (default display text) |
| `text` | 2 | Overrides display text for a node |
| `assess` | 2 | Sets assessment config for a node |
| `method` | 1 | Sets the assessment method |
| `expected` | 1 | Sets the expected correct value |
| `concepts` | 2 | Defines drag-and-drop tray concepts (list) |
| `concept` | 1 | Defines a single tray concept |
| `image` | 2 | Sets an image URL for a tray concept |
| `align` | 2 | Sets tray position (RIGHT, LEFT, TOP, BOTTOM) |
| `theme` | 2 | Sets the UI theme (dark or light) |

## Example

```
topic 'Concept Web'
anchor text 'Hub' assess [method 'value' expected 'Hub'] {}
connections [
  connection text 'Foo' assess [method 'value' expected 'Foo'] {},
  connection text 'Bar' assess [method 'value' expected 'Bar'] {},
  connection text 'Baz' assess [method 'value' expected 'Baz'] {}
] {}..
```

The anchor is placed at the center of the diagram. Connections are arranged radially around it with solid edges auto-generated from each connection to the anchor.

## Architecture

- **packages/api** — Node.js/Express backend compiler
- **packages/app** — React/TypeScript frontend library

Standard Graffiticode compiler pipeline: Checker (validates AST) → Transformer (produces output).

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
