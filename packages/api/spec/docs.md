# L0169 User Manual

**Introduction**

*Graffiticode* is a collection of domain languages used for creating task
specific web apps. **L0169** is a *Graffiticode* language for writing
interactive concept web assessment diagrams.

Concept web assessments present a topic with connected nodes that students
can drag and rearrange. Nodes are connected by edges (solid or dashed lines, with optional arrowheads)
defined via patterns.

### Overview

The code

```
topic 'Concept Web'
edges [
  edge 'H*' type SOLID {}
]
nodes [
  node H text 'Hub' assess [method 'value' expected 'Hub'] {},
  node A text 'Foo' assess [method 'value' expected 'Foo'] {},
  node B text 'Bar' assess [method 'value' expected 'Bar'] {}
] {}..
```

renders an interactive concept web diagram in the browser view.

### Vocabulary

| Function       | Arity | Example | Description |
| -------------- | :---: | ------- | ----------- |
| **topic**      | 2 | `topic 'Concept Web'` | sets the topic label |
| **edges**      | 2 | `edges [edge 'H*' type SOLID {}]` | defines edge connections |
| **edge**       | 2 | `edge 'H*' type SOLID {}` | defines a single edge by pattern |
| **type**       | 2 | `type SOLID` | sets edge type: SOLID, DASHED, SOLID-ARROW, or DASHED-ARROW |
| **nodes**      | 2 | `nodes [node H text 'Hub' ...]` | defines concept nodes |
| **node**       | 2 | `node H text 'Hub' ...` | defines a single node with ID tag |
| **text**       | 2 | `text 'Hub'` | sets node display text |
| **assess**     | 2 | `assess [method 'value' expected 'Hub']` | sets node assessment config |
| **method**     | 2 | `method 'value'` | sets assessment method |
| **expected**   | 2 | `expected 'Hub'` | sets expected correct value |
| **theme**      | 2 | `theme dark` | sets the UI theme (dark or light) |
| **val**        | 2 | `val ob "x"` | returns the value of `x` in `ob` |
| **concat**     | 1 | `concat [x,y]` | returns the concatenation of the values |
| **add**        | 2 | `add x y` | returns the sum of values of `x` and `y` |
| **map**        | 2 | `map fn [1,2,3]` | applies `fn` to each element in the list |
| **data**       | 1 | `data ob` | returns the value of data passed to the current task |
