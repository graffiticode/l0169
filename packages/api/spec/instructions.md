# Dialect L0169 Specific Instructions

L0169 is a Graffiticode dialect for authoring interactive concept web assessment diagrams.

## L0169 Specific Guidelines

- Use `topic` to set the concept web topic: `topic 'Concept Web'`
- Use `instructions` to provide context or directions below the topic: `instructions 'Drag concepts onto the correct nodes.'`
- `instructions` supports markdown formatting (lists, emphasis) via backtick strings
- Use `anchor` to define the central concept placed at the diagram center: `anchor text 'Hub' {}`
- Use `connections` with a list of `connection` definitions to define peripheral concepts
- Use `connection` (arity 1) to define a single peripheral node: `connection text 'Foo' {}`
- By default, solid edges are drawn from the anchor to every connection
- Use `edges` with a list of `edge` definitions for custom edge rendering
- Use `from` and `to` on edges to specify source and target nodes by their `value` string
- **IMPORTANT:** The `from` and `to` strings must match the `value` of the anchor or connection nodes. When using custom edges, always set an explicit `value` on the anchor and each connection so edges can reference them
- `from` and `to` accept a string, a list of strings, or `'*'` (all nodes except the other endpoint)
- Use `type` on edges: `'solid'` (default), `'dashed'`, `'solid-arrow'`, `'dashed-arrow'`
- Use `text` on edges to display a label at the midpoint of the edge line
- Use `image` on edges to display an image at the midpoint of the edge line
- Use `value` to set the scoring value for a concept: `concept value 'Hub' {}`
- `value` is the default display text; use `text` or `image` to override the display
- Use `text` to override display text for a node or concept
- Use `image` to set an image URL on a concept, connection, or anchor: `concept value 'Hub' image 'https://...' {}`
- Use `assess` with `method` and `expected` to define assessment criteria
- Use `theme` to set the visual theme: `theme DARK` or `theme LIGHT`
- Use `concepts` with a list of `concept` definitions to create a drag-and-drop tray
- Use `align` to position the tray: `align RIGHT`, `align LEFT`, `align TOP`, or `align BOTTOM`
- When using concepts, set node `text` to empty string `''` so students drag concepts to fill them in
- Use `relations` with a list of `relation` definitions to create a drag-and-drop tray for edge labels
- Use `align` after `relations` to position the relations tray independently from the concepts tray
- When using relations, add `assess` to edges with `method 'value'` and `expected` set to the correct relation value
- Relations use `value` for scoring; `text` or `image` override the display, same pattern as `concept`
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

## Draggable Relation Labels

Use `relations` to create a tray of edge labels that students drag onto edges,
similar to how `concepts` works for nodes. Each `relation` has a `value` used
for scoring. Use `text` or `image` to override the display.

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

Relations with display overrides:

```
relations [
  relation value 'causes' text 'Causes →' {},
  relation value 'inhibits' image 'https://...' {}
] align BOTTOM {}
```

## Concept Web Assessments

Each concept web program defines:
- **topic**: the assessment heading
- **instructions**: (optional) context or directions for the learner, displayed below the topic
- **anchor**: the central concept node placed at the diagram center
- **connections**: peripheral concept nodes arranged radially around the anchor
- **concepts**: (optional) drag-and-drop tray concepts that students place onto nodes
- **relations**: (optional) drag-and-drop tray labels that students place onto edges
- **align**: (optional) tray position — `RIGHT` (default), `LEFT`, `TOP`, `BOTTOM`
- **edges**: (optional) custom edge definitions; when omitted, solid edges connect anchor to all connections
- **theme**: `LIGHT` or `DARK` visual theme

When no `edges` keyword is used, the compiler automatically generates solid
edges from each connection to the anchor. Use `edges` for custom edge rendering.

## Custom Edges

Use `edges` to define custom connections between nodes. The `from` and `to`
fields reference nodes by their `value` string. Use `'*'` to mean all nodes
except those on the other side of the edge.

```
topic 'Custom Edges'
anchor value 'Hub' text 'Hub' {}
connections [
  connection value 'Foo' text 'Foo' {},
  connection value 'Bar' text 'Bar' {}
]
edges [
  edge from 'Hub' to '*' type 'solid' {},
  edge from 'Foo' to 'Bar' type 'dashed' text 'related' {}
] {}..
```

Edge types: `'solid'`, `'dashed'`, `'solid-arrow'`, `'dashed-arrow'`.

An empty `edges` list renders no edges:

```
edges [] {}
```

## Drag-and-Drop Assessments

To create a drag-and-drop assessment, define `concepts` alongside `anchor` and
`connections`. Set node text to empty strings and use `assess` with `expected`
values. Students drag concepts from the tray onto nodes, and assessment validates
the placed concept's `value` against the node's `expected` value. Assessment validation considers edge properties — positions with identical
edge configurations (same type, text, image, and connected nodes) are
interchangeable, so swapping values between them is valid. Positions with
different edge configurations require exact matching. Use `text` or `image`
to customize the display independently of the scoring value.

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
  concept value 'Hub' image 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Circle_-_black_simple.svg/120px-Circle_-_black_simple.svg.png' {},
  concept value 'Spoke' image 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Solar_system.jpg/120px-Solar_system.jpg' {}
] align RIGHT {}
```

## Using Images

**CRITICAL RULE:** Whenever the user mentions "image", "images", "photo",
"picture", or any visual content, you MUST:

1. **Search the ENTIRE conversation** (all messages, including the system
   prompt, help text, and prior user messages) for every markdown image
   reference matching `![name](url)`. Collect ALL URLs found.

2. **Use the closest matching URL** for the user's request. Match by filename,
   label, or context. If the user says "add my photo," find the image whose
   filename best matches (e.g., `![me](https://...)`).

3. **If no uploaded image is found**, find a real, publicly accessible image
   URL from a well-known source (e.g., Wikimedia Commons, Unsplash, or a
   CDN). **NEVER use example.com, placeholder.com, or any fictional URL.**
   Every `image` URL in generated code MUST point to a real, loadable image.

4. **Match images to context.** When the user asks to add images:
   - If the user specifies which image goes where (e.g., "add the photo to
     the anchor"), use that image for the specified element.
   - If the user says something general like "add the images to the
     connections," distribute the available images across the connections
     in order.
   - If there are more elements than images, reuse images or leave some
     elements without images as appropriate.
   - If there are more images than elements, use the most relevant ones
     based on filename or context.

3. **Extract the URL** from the markdown reference and pass it as the `image`
   argument. The `image` function works on concepts, connections, anchors,
   and edges:

```
concept value 'Label' image 'https://firebasestorage.googleapis.com/...' {}
anchor image 'https://firebasestorage.googleapis.com/...' text 'Hub' {}
connection image 'https://firebasestorage.googleapis.com/...' text 'Spoke' {}
edge from 'A' to 'B' image 'https://firebasestorage.googleapis.com/...' {}
```

4. **Use the filename as a default label.** When creating concepts from
   uploaded images, use the filename (without extension) as a reasonable
   default `value` unless the user specifies different labels.

### Example conversation flow

User uploads two images (appearing as `![me](https://...)` and
`![gc-logo](https://...)`), then says "add the images to the connections":

```
connections [
  connection image 'https://firebasestorage.googleapis.com/.../me.jpeg?...' text 'me' {},
  connection image 'https://firebasestorage.googleapis.com/.../gc-logo.png?...' text 'gc-logo' {}
]
```

User uploads one image and says "use this for the anchor":

```
anchor image 'https://firebasestorage.googleapis.com/.../photo.png?...' text 'Center' {}
```
