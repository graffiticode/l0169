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
| `edges` | `<list record: record>` | Defines the list of edge connections |
| `edge` | `<string record: record>` | Defines a single edge by pattern (e.g. `'H*'`, `'HA'`) |
| `type` | `<[SOLID\|DASHED\|SOLID-ARROW\|DASHED-ARROW] record: record>` | Sets the edge type |
| `nodes` | `<list record: record>` | Defines the list of concept nodes |
| `node` | `<tag record: record>` | Defines a single node with an ID tag |
| `text` | `<string record: record>` | Sets display text for a node |
| `assess` | `<list record: record>` | Sets assessment config for a node |
| `method` | `<string record: record>` | Sets the assessment method |
| `expected` | `<string record: record>` | Sets the expected correct value |
| `theme` | `<[dark\|light] record: record>` | Sets the UI theme |

### topic

Sets the topic label displayed above the concept web diagram.

```
topic 'Concept Web'
```

### edges

Defines a list of edge connection patterns.

```
edges [
  edge 'H*' type SOLID {}
]
```

### edge

Defines a single edge by a pattern string. Patterns use node IDs:

 - `'H*'` — connect node H to every other node (wildcard)
 - `'HA'` — connect node H to node A (explicit)

```
edge 'H*' type SOLID {}
```

### type

Sets the edge display type. Accepted tags: `SOLID` (solid line), `DASHED` (dashed line), `SOLID-ARROW` (solid line with arrowhead), `DASHED-ARROW` (dashed line with arrowhead).

```
type SOLID
```

### nodes

Defines a list of concept nodes.

```
nodes [
  node H text 'Hub' assess [method 'value' expected 'Hub'] {},
  node A text 'Foo' assess [method 'value' expected 'Foo'] {}
]
```

### node

Defines a single concept node with an ID tag (e.g. `H`, `A`, `B`).

```
node H text 'Hub' assess [method 'value' expected 'Hub'] {}
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
