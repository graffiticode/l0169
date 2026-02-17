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
| `anchor` | `<record record: record>` | Defines the central anchor concept |
| `connections` | `<list record: record>` | Defines the list of peripheral connections |
| `connection` | `<record: record>` | Defines a single connection (arity 1) |
| `text` | `<string record: record>` | Sets display text for a node |
| `assess` | `<list record: record>` | Sets assessment config for a node |
| `method` | `<string record: record>` | Sets the assessment method |
| `expected` | `<string record: record>` | Sets the expected correct value |
| `theme` | `<[dark\|light] record: record>` | Sets the UI theme |
| `concepts` | `<list record: record>` | Defines a list of tray concepts for drag-and-drop |
| `concept` | `<record: record>` | Defines a single tray concept (arity 1) |
| `image` | `<string record: record>` | Sets an image URL for a tray item |
| `align` | `<[RIGHT\|LEFT\|TOP\|BOTTOM] record: record>` | Sets tray position relative to diagram |

### topic

Sets the topic label displayed above the concept web diagram.

```
topic 'Concept Web'
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

### text

Sets the display text for a node.

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

Sets the assessment method (e.g. `'value'` for text matching).

```
method 'value'
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
theme. The tag values `dark` and `light` are the only accepted argument values.

```
theme dark
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

A drag-and-drop concept web with concepts tray:

```
topic 'Drag and Drop'
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
