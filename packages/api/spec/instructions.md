# Dialect L0169 Specific Instructions

L0169 is a Graffiticode dialect for authoring interactive concept web assessment diagrams.

## L0169 Specific Guidelines

- Use `topic` to set the concept web topic: `topic 'Concept Web'`
- Use `anchor` to define the central concept placed at the diagram center: `anchor text 'Hub' {}`
- Use `connections` with a list of `connection` definitions to define peripheral concepts
- Use `connection` (arity 1) to define a single peripheral node: `connection text 'Foo' {}`
- Every connection automatically has a solid edge to the anchor — no explicit edge definitions needed
- Use `value` to set the scoring value for a concept: `concept value 'Hub' {}`
- `value` is the default display text; use `text` or `image` to override the display
- Use `text` to override display text for a node or concept
- Use `image` to set an image URL on a concept: `concept value 'Hub' image 'https://...' {}`
- Use `assess` with `method` and `expected` to define assessment criteria
- Use `theme` to set the visual theme: `theme dark` or `theme light`
- Use `concepts` with a list of `concept` definitions to create a drag-and-drop tray
- Use `align` to position the tray: `align RIGHT`, `align LEFT`, `align TOP`, or `align BOTTOM`
- When using concepts, set node `text` to empty string `''` so students drag concepts to fill them in
- Add descriptive comments using the pipe symbol `|`

## Example Patterns

A complete concept web assessment:

```
topic 'Concept Web'
anchor text 'Hub' assess [method 'value' expected 'Hub'] {}
connections [
  connection text 'Foo' assess [method 'value' expected 'Foo'] {},
  connection text 'Bar' assess [method 'value' expected 'Bar'] {},
  connection text 'Baz' assess [method 'value' expected 'Baz'] {}
] {}..
```

## Concept Web Assessments

Each concept web program defines:
- **topic**: the assessment heading
- **anchor**: the central concept node placed at the diagram center
- **connections**: peripheral concept nodes arranged radially around the anchor
- **concepts**: (optional) drag-and-drop tray concepts that students place onto nodes
- **align**: (optional) tray position — `RIGHT` (default), `LEFT`, `TOP`, `BOTTOM`
- **theme**: light or dark visual theme

The compiler automatically generates solid edges from each connection to the
anchor. No explicit edge definitions are needed.

## Drag-and-Drop Assessments

To create a drag-and-drop assessment, define `concepts` alongside `anchor` and
`connections`. Set node text to empty strings and use `assess` with `expected`
values. Students drag concepts from the tray onto nodes, and assessment validates
the placed concept's `value` against the expected value using position-independent
matching. Use `text` or `image` to customize the display independently of the
scoring value.

```
topic 'Fill in the blanks'
anchor text '' assess [method 'value' expected 'Hub'] {}
connections [
  connection text '' assess [method 'value' expected 'Spoke'] {}
]
concepts [
  concept value 'Hub' {},
  concept value 'Spoke' {}
] align RIGHT {}..
```

A concept with an image that scores by value:

```
concepts [
  concept value 'Hub' image 'https://example.com/hub.png' {},
  concept value 'Spoke' image 'https://example.com/spoke.png' {}
] align RIGHT {}
```
