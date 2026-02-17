# Dialect L0169 Specific Instructions

L0169 is a Graffiticode dialect for authoring interactive concept web assessment diagrams.

## L0169 Specific Guidelines

- Use `topic` to set the concept web topic: `topic 'Concept Web'`
- Use `edges` with a list of `edge` definitions to define connections
- Use `edge` with a pattern string: `'H*'` (wildcard) or `'HA'` (explicit)
- Use `type` to set edge type: `type SOLID`, `type DASHED`, `type SOLID-ARROW`, or `type DASHED-ARROW`
- Use `nodes` with a list of `node` definitions to define concept nodes
- Use `node` with an ID tag: `node H text 'Hub' ...`
- Use `text` to set display text for a node
- Use `assess` with `method` and `expected` to define assessment criteria
- Use `theme` to set the visual theme: `theme dark` or `theme light`
- Edge patterns expand in the compiler: `'H*'` connects H to all other nodes
- Add descriptive comments using the pipe symbol `|`

## Example Patterns

A complete concept web assessment:

```
topic 'Concept Web'
edges [
  edge 'H*' type SOLID {}
]
nodes [
  node H text 'Hub' assess [method 'value' expected 'Hub'] {},
  node A text 'Foo' assess [method 'value' expected 'Foo'] {},
  node B text 'Bar' assess [method 'value' expected 'Bar'] {},
  node C text 'Baz' assess [method 'value' expected 'Baz'] {}
] {}..
```

## Concept Web Assessments

Each concept web program defines:
- **topic**: the assessment heading
- **nodes**: concept nodes with IDs, display text, and optional assessment criteria
- **edges**: connections between nodes using pattern strings
- **theme**: light or dark visual theme

The compiler expands edge patterns (e.g. `'H*'` becomes edges from H to every
other node) and assembles a `conceptWeb` data structure with resolved nodes
and edges for rendering.
