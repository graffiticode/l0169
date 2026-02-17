# L0169 User Manual

**Introduction**

*Graffiticode* is a collection of domain languages used for creating task
specific web apps. **L0169** is a *Graffiticode* language for writing
interactive concept web assessment diagrams.

Concept web assessments present a topic with a central anchor concept and
peripheral connections arranged radially around it. Edges from each connection
to the anchor are generated automatically.

### Overview

The code

```
topic 'Concept Web'
anchor text 'Hub' assess [method 'value' expected 'Hub'] {}
connections [
  connection text 'Foo' assess [method 'value' expected 'Foo'] {},
  connection text 'Bar' assess [method 'value' expected 'Bar'] {},
  connection text 'Baz' assess [method 'value' expected 'Baz'] {}
] {}..
```

renders an interactive concept web diagram in the browser view.

### Vocabulary

| Function       | Arity | Example | Description |
| -------------- | :---: | ------- | ----------- |
| **topic**      | 2 | `topic 'Concept Web'` | sets the topic label |
| **instructions** | 2 | `instructions 'Drag concepts...'` | sets instructions below the topic |
| **anchor**     | 2 | `anchor text 'Hub' {}` | defines the central anchor concept |
| **connections** | 2 | `connections [connection text 'Foo' {}]` | defines peripheral connections |
| **connection** | 1 | `connection text 'Foo' {}` | defines a single connection |
| **value**      | 2 | `value 'Hub'` | sets scoring value (default display text) |
| **text**       | 2 | `text 'Hub'` | overrides display text |
| **assess**     | 2 | `assess [method 'value' expected 'Hub']` | sets node assessment config |
| **method**     | 1 | `method 'value'` | sets assessment method |
| **expected**   | 1 | `expected 'Hub'` | sets expected correct value |
| **theme**      | 2 | `theme dark` | sets the UI theme (dark or light) |
| **val**        | 2 | `val ob "x"` | returns the value of `x` in `ob` |
| **concat**     | 1 | `concat [x,y]` | returns the concatenation of the values |
| **add**        | 2 | `add x y` | returns the sum of values of `x` and `y` |
| **map**        | 2 | `map fn [1,2,3]` | applies `fn` to each element in the list |
| **data**       | 1 | `data ob` | returns the value of data passed to the current task |
