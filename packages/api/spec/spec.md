# L0169 Vocabulary

This specification documents dialect-specific functions available in the
**L0169** language of Graffiticode. These functions extend the core language
with functionality for authoring interactive concept web assessment diagrams.

The core language specification including the definition of its syntax,
semantics and base library can be found here:
[Graffiticode Language Specification](./graffiticode-language-spec.html)

## Functions

| Function | Signature | Description |
| :------- | :-------- | :---------- |
| `topic` | `<string record: record>` | Sets the concept web topic label |
| `instructions` | `<string record: record>` | Sets instructions text below the topic |
| `anchor` | `<record record: record>` | Defines the central anchor concept |
| `connections` | `<list record: record>` | Defines the list of peripheral connections |
| `connection` | `<record: record>` | Defines a single connection (arity 1) |
| `value` | `<string record: record>` | Sets the scoring value (default display text) |
| `text` | `<string record: record>` | Overrides display text for a node |
| `assess` | `<list record: record>` | Sets assessment config for a node |
| `method` | `<string\|VALUE: record>` | Sets the assessment method |
| `expected` | `<string: record>` | Sets the expected correct value |
| `theme` | `<[DARK\|LIGHT] record: record>` | Sets the UI theme |
| `concepts` | `<list record: record>` | Defines a list of tray concepts for drag-and-drop |
| `concept` | `<record: record>` | Defines a single tray concept (arity 1) |
| `image` | `<string record: record>` | Sets an image URL for a tray item |
| `align` | `<[RIGHT\|LEFT\|TOP\|BOTTOM] record: record>` | Sets tray position relative to diagram |

### topic

Sets the topic label displayed above the concept web diagram.

```
topic 'Concept Web'
```

### instructions

Sets instructions text displayed below the topic label. Supports markdown
formatting for lists and emphasis.

```
instructions 'Drag the correct concepts onto the matching nodes.'
```

Multiline with markdown:

```
instructions `
- Drag concepts from the tray onto the correct nodes
- Green means correct, red means incorrect
`
```

### anchor

Defines the central anchor concept placed at the center of the diagram.
Every connection automatically has a solid edge to the anchor.

```
anchor text 'Hub' {}
```

### connections

Defines a list of peripheral connection nodes arranged radially around the anchor.

```
connections [
  connection text 'Foo' {},
  connection text 'Bar' {}
] {}
```

### connection

Defines a single peripheral connection (arity 1). Properties like `text`
and `assess` are passed through the pipeline.

```
connection text 'Foo' assess [method 'value' expected 'Foo'] {}
```

### value

Sets the scoring value for a concept. This is compared against `expected`
during assessment. Also serves as the default display text unless overridden
by `text` or `image`.

```
value 'Hub'
```

### text

Overrides the display text for a node or concept. When set on a concept,
the `value` is still used for scoring.

```
text 'Hub'
```

### assess

Sets assessment configuration for a node. Takes a list containing a single
pipeline of `method` and `expected`.

```
assess [method 'value' expected 'Hub']
```

### method

Sets the assessment method. Accepts either the string `'value'` or the tag
`VALUE`. Both are normalized to the string `"value"` in the compiled output.

```
method 'value'
method VALUE
```

### expected

Sets the expected correct value for assessment.

```
expected 'Hub'
```

### concepts

Defines a list of tray concepts that students can drag onto concept web nodes.
Concepts render as badges in a tray alongside the diagram.

```
concepts [
  concept text 'Answer A' {},
  concept text 'Answer B' {}
] align RIGHT {}
```

### concept

Defines a single tray concept (arity 1). Properties like `text` and `image`
are passed through the pipeline.

```
concept text 'Answer A' {}
```

### image

Sets an image URL for a tray concept. The image is displayed in the badge and
on the node when the concept is dropped.

```
concept image 'https://example.com/img.png' {}
```

### align

Sets the tray position relative to the concept web diagram. Accepted tags:
`RIGHT` (default), `LEFT`, `TOP`, `BOTTOM`.

```
align RIGHT
```

### theme

Select a theme and render the theme toggle button to allow users to set the
theme. The tag values `DARK` and `LIGHT` are the only accepted argument values.

```
theme DARK
```

## Program Examples

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

A drag-and-drop concept web with concepts tray and instructions:

```
topic 'Drag and Drop'
instructions 'Drag the correct concepts onto the matching nodes.'
anchor text '' assess [method 'value' expected 'Hub'] {}
connections [
  connection text '' assess [method 'value' expected 'Foo'] {},
  connection text '' assess [method 'value' expected 'Bar'] {}
]
concepts [
  concept text 'Hub' {},
  concept text 'Foo' {},
  concept text 'Bar' {}
] align RIGHT {}..
```
