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
| `edges` | `<list record: record>` | Defines a list of edge definitions |
| `edge` | `<record: record>` | Defines a single edge (arity 1) |
| `from` | `<string\|list record: record>` | Sets the source node(s) by value string |
| `to` | `<string\|list record: record>` | Sets the target node(s) by value string |
| `type` | `<string record: record>` | Sets the edge type |
| `relations` | `<list record: record>` | Defines a list of relation labels for drag-and-drop onto edges |
| `relation` | `<record: record>` | Defines a single relation label (arity 1) |
| `w` | `<number record: record>` | Sets node width in Tailwind spacing units (1 unit = 4px) |
| `h` | `<number record: record>` | Sets node height in Tailwind spacing units (1 unit = 4px) |
| `rounded` | `<string record: record>` | Sets border radius preset (e.g. `"lg"`, `"full"`, `"none"`) |
| `bg` | `<string record: record>` | Sets background Tailwind color name (e.g. `"blue-500"`) |
| `color` | `<string record: record>` | Sets text Tailwind color name (e.g. `"white"`) |
| `border` | `<string record: record>` | Sets border Tailwind color name (e.g. `"zinc-400"`) |

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
Style keywords (`w`, `h`, `rounded`, `bg`, `color`, `border`) on the continuation
set defaults for all children; per-connection overrides win. Do not add `{}` after
the closing `]` unless `connections` is at the end of the program; style keywords
or the next function in the program provide the continuation value.

```
connections [
  connection text 'Foo' {},
  connection text 'Bar' {}
]
```

With shared styles:

```
connections [
  connection value 'A' bg 'red-200' {},
  connection value 'B' {}
] w 24 h 12 bg 'blue-100' rounded 'lg' {}
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
Concepts render as badges in a tray alongside the diagram. Style keywords on the
continuation set defaults for all children. Do not add `{}` after the closing `]`
unless `concepts` is at the end of the program; style keywords or the next function
in the program provide the continuation value.

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
concept image 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Circle_-_black_simple.svg/120px-Circle_-_black_simple.svg.png' {}
```

### align

Sets the tray position relative to the concept web diagram. Accepted tags:
`RIGHT` (default), `LEFT`, `TOP`, `BOTTOM`.

```
align RIGHT
```

### edges

Defines a list of edge definitions for custom edge rendering. When omitted,
solid edges are automatically drawn from the anchor to each connection. When
provided (even as an empty list), only the specified edges are rendered.
Style keywords on the continuation set defaults for all children.

Assessment validation considers edge properties: positions with identical
edge configurations (same type, text, image, and connected nodes) are
interchangeable — swapping values between them is valid. Positions with
different edge configurations require exact matching.

```
edges [
  edge from 'Hub' to '*' type 'solid' {},
  edge from 'Foo' to 'Bar' type 'dashed' text 'related' {}
] {}
```

### edge

Defines a single edge (arity 1). Properties like `from`, `to`, `type`,
`text`, and `image` are passed through the pipeline.

```
edge from 'Hub' to '*' type 'solid' {}
```

### from

Sets the source node(s) for an edge. The value is matched against node
`value` strings. Accepts a single string or a list of strings. The special
value `'*'` means all nodes except those specified in `to`.

```
from 'Hub'
from ['Hub', 'Foo']
from '*'
```

### to

Sets the target node(s) for an edge. The value is matched against node
`value` strings. Accepts a single string or a list of strings. The special
value `'*'` means all nodes except those specified in `from`.

```
to 'Foo'
to ['Foo', 'Bar']
to '*'
```

### type

Sets the edge type. Accepted values: `'solid'` (default), `'dashed'`,
`'solid-arrow'`, `'dashed-arrow'`.

```
type 'solid'
type 'dashed-arrow'
```

### relations

Defines a list of relation labels that students can drag onto edges. Relations
render as badges in a tray alongside the diagram, similar to `concepts` but for
edges. Use `align` to position the relations tray. Style keywords on the
continuation set defaults for all children. Do not add `{}` after the closing `]`
unless `relations` is at the end of the program; style keywords or the next function
in the program provide the continuation value.

```
relations [
  relation value 'causes' {},
  relation value 'inhibits' {}
] align BOTTOM {}
```

### relation

Defines a single relation label (arity 1). Properties like `value`, `text`,
`image`, and style keywords (`bg`, `color`, `border`, `rounded`) are passed
through the pipeline. The `value` is used for scoring; `text` or `image`
override the display. Style keywords apply to the tray badge and carry through
to the edge label when placed.

```
relation value 'causes' {}
relation value 'inhibits' text 'Inhibits →' {}
relation value 'enables' image 'https://...' {}
relation value 'activates' bg 'green-100' color 'green-800' border 'green-400' {}
```

### w

Sets the width of a node in Tailwind spacing units (1 unit = 4px). Can be applied
to anchor, connections, concepts, edges, and relations. When used on a list container
(e.g. `connections`), it sets the default width for all children.

```
w 24
```

### h

Sets the height of a node in Tailwind spacing units (1 unit = 4px).

```
h 12
```

### rounded

Sets the border radius preset. Accepted values: `"none"`, `"xs"`, `"sm"`,
`"md"` (default for nodes), `"lg"`, `"xl"`, `"2xl"`, `"3xl"`, `"full"` (circle).
Relations default to `"xs"`. Raw CSS values are also accepted as passthrough
(e.g. `"50% / 25%"` for different horizontal/vertical radii).

```
rounded 'lg'
rounded 'full'
rounded '50% / 25%'
```

### bg

Sets the background color using a Tailwind color name.

```
bg 'blue-500'
bg 'indigo-100'
```

### color

Sets the text color using a Tailwind color name.

```
color 'white'
color 'zinc-800'
```

### border

Sets the border color using a Tailwind color name.

```
border 'zinc-400'
border 'blue-600'
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

A concept web with custom edges:

```
topic 'Custom Edges'
anchor value 'Hub' text 'Hub' {}
connections [
  connection value 'Foo' text 'Foo' {},
  connection value 'Bar' text 'Bar' {},
  connection value 'Baz' text 'Baz' {}
]
edges [
  edge from 'Hub' to '*' type 'solid' {},
  edge from 'Foo' to 'Bar' type 'dashed' text 'related' {}
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

A styled concept web with custom colors and shapes:

```
topic 'Styled Web'
anchor text 'Hub' w 28 h 28 bg 'indigo-500' color 'white' rounded 'xl' {}
connections [
  connection value 'A' text 'A' bg 'red-200' {},
  connection value 'B' text 'B' {},
  connection value 'C' text 'C' {}
] w 24 h 12 bg 'blue-100' rounded 'lg' {}..
```

A concept web with styled relation labels:

```
topic 'Styled Relations'
anchor value 'Cell' text 'Cell' {}
connections [
  connection value 'Nucleus' text 'Nucleus' {}
]
edges [
  edge from 'Cell' to 'Nucleus' type 'solid-arrow' assess [method 'value' expected 'activates'] {}
]
relations [
  relation value 'activates' bg 'green-100' color 'green-800' {},
  relation value 'inhibits' bg 'red-100' color 'red-800' {}
] align BOTTOM {}..
```

A concept web with draggable relation labels on edges:

```
topic 'Cell Signaling'
instructions 'Drag the correct relationship labels onto the edges.'
anchor value 'Cell' text 'Cell' {}
connections [
  connection value 'Receptor' text 'Receptor' {},
  connection value 'Nucleus' text 'Nucleus' {}
]
edges [
  edge from 'Cell' to 'Receptor' type 'solid-arrow' assess [method 'value' expected 'activates'] {},
  edge from 'Receptor' to 'Nucleus' type 'dashed-arrow' assess [method 'value' expected 'signals'] {}
]
relations [
  relation value 'activates' {},
  relation value 'signals' {}
] align BOTTOM {}..
```
