<!-- SPDX-License-Identifier: CC-BY-4.0 -->
# L0169 Usage Guide

This guide describes what you can create with L0169 and how to ask for it. L0169 is a Graffiticode language for interactive concept web assessments. You use it by describing what you want in natural language — through the Graffiticode MCP tool (`create_item` with `language: "L0169"`) or the Graffiticode console at console.graffiticode.org.

You do not need to know L0169's syntax. Describe the assessment you want, and the language-specific AI generates the result. This guide helps you understand what's possible so you can make effective requests.

## Concept Web Basics

A concept web is a radial diagram with a central concept (the anchor) surrounded by connected concepts (connections). Edges connect each peripheral concept back to the center. You can create webs ranging from minimal to complex.

**What you can ask for:**

- A concept web with just a central concept
- A concept web with a central concept and any number of connected concepts
- A topic label displayed above the diagram
- Instructional text below the topic, including markdown formatting (bullet lists, bold, italic, numbered steps)

**Example requests:**

- "Create a concept web about the solar system with the Sun at the center and eight planets as connections."
- "Create a concept web with the topic 'Cell Biology' and instructions that say 'Identify the parts of a cell by dragging labels onto the correct nodes.'"
- "Create a concept web with the topic 'Water Cycle', a central concept of Evaporation, and connections for Condensation, Precipitation, Collection, and Transpiration."

## Drag-and-Drop Assessments

You can turn any concept web into an interactive assessment where learners drag concept labels from a tray onto the correct positions on the web. The system validates placements automatically.

**What you can ask for:**

- Blank nodes that learners fill in by dragging concepts from a tray
- Assessment on any combination of nodes — the anchor, the connections, or both
- A concept tray positioned on any side: right (default), left, top, or bottom
- Distractor concepts in the tray (more options than correct positions) to increase difficulty
- Concepts with display text that differs from their scoring value

**Example requests:**

- "Create a drag-and-drop concept web about photosynthesis where all the nodes are blank and students drag the correct labels from the tray."
- "Create a concept web assessment with five connections. Put the correct answers in the tray plus two distractor concepts. Align the tray to the left."
- "Create a concept web where only the connections are assessed and the central concept is already filled in."

## Relation Labeling

Beyond placing concepts on nodes, learners can also label the relationships between concepts by dragging relation labels onto edges.

**What you can ask for:**

- A relation tray with labels that learners drag onto edges between concepts
- Assessed edges that validate the placed relation against an expected value
- Relation labels with text, images, or custom styling
- Both a concepts tray (for nodes) and a relations tray (for edges) on the same assessment
- Distractor relations (more options than edges) to increase difficulty
- Independent tray positioning — concepts tray on one side, relations tray on another

**Example requests:**

- "Create a concept web about cell signaling where students drag relationship labels like 'activates' and 'signals' onto the edges between Cell, Receptor, and Nucleus."
- "Create a drag-and-drop concept web where students label both the nodes and the edges. Put the concept tray on the right and the relation tray at the bottom."
- "Create a concept web with three edges and five relation labels in the tray as distractors."

## Custom Edges

By default, solid edges connect each connection to the anchor. You can customize edge configurations for more complex relationship diagrams.

**What you can ask for:**

- Different edge styles: solid, dashed, solid-arrow, dashed-arrow
- Mixed edge types on the same diagram
- Peer-to-peer edges directly between connections (not through the anchor)
- Text labels or images at the midpoint of edges
- Selective edges — only connecting specific nodes
- No edges at all (nodes without visible connections)

**Example requests:**

- "Create a concept web with dashed arrows from the center to all connections."
- "Create a concept web with solid edges from the anchor to all connections, plus a dashed peer-to-peer edge between Condensation and Precipitation labeled 'leads to'."
- "Create a concept web where the edges have different styles — solid from the center to the first two connections and dashed-arrow to the third."

## Images

Any element in a concept web can include images — nodes, tray concepts, edges, and relation labels.

**What you can ask for:**

- Images on the anchor, connections, or both
- Image-based concepts in the drag-and-drop tray (instead of or alongside text)
- Images at the midpoint of edges
- A mix of image and text concepts in the same tray

**Example requests:**

- "Create a concept web about the solar system with planet images on each connection."
- "Create a drag-and-drop assessment where the tray concepts are images instead of text labels."
- "Create a concept web with an image on the central anchor and text labels on the connections."

## Theming and Styling

You can control the visual appearance of the concept web at multiple levels — from the overall theme to individual node styling.

**What you can ask for:**

- Light or dark theme with a toggle button for users
- Custom node sizes (width and height)
- Border radius control: sharp rectangles, rounded corners, or full circles
- Background, text, and border colors on any element (nodes, concepts, relations, edges)
- Default styles on groups (all connections share one style) with per-element overrides
- Different styling for the anchor vs. connections vs. tray items

**Example requests:**

- "Create a concept web with a dark theme."
- "Create a concept web with a large circular anchor in indigo with white text, and smaller rectangular connections in light blue."
- "Create a concept web where the relation labels are styled with green backgrounds for positive relationships and red for negative."
- "Create a concept web where all connections are light blue rounded rectangles, except one which is highlighted in red."

## Combining Features

All of the above capabilities can be combined freely. A single assessment can have a topic, markdown instructions, custom-styled nodes, drag-and-drop concepts, relation labeling on edges, custom edge types, images, and theming.

**Example requests for complex assessments:**

- "Create a fully featured concept web with the topic 'Ecosystem Interactions', markdown instructions explaining the task, a dark theme, a circular styled anchor, four assessed connections with a right-aligned concepts tray, and three assessed edges with a bottom-aligned relations tray including one distractor."
- "Create a drag-and-drop concept web about the water cycle with solid-arrow edges from the center to all connections, dashed peer-to-peer edges with labels between connections, blank assessed nodes, and a concept tray with matching concepts aligned to the right."

## Iterating on Your Assessment

After creating a concept web, you can refine it by describing changes. The system remembers what you've created and applies modifications incrementally.

**Example modification requests:**

- "Add a new connection called 'Carbon Fixation'."
- "Switch to a light theme."
- "Move the concept tray to the bottom."
- "Remove the assessment from the anchor but keep it on the connections."
- "Make the anchor circular with a blue background."
- "Add distractor concepts to the tray."
- "Change the edges to dashed arrows."

## What L0169 Cannot Do

L0169 is specialized for radial concept web assessments. It does not support:

- Free-form quizzes or text-input questions
- Multiple-choice assessments
- Hierarchical tree structures
- Linear sequences or timelines
- Arbitrary graph layouts (non-radial)

For other content types, use the Graffiticode MCP tool's `list_languages` function to discover available languages. For spreadsheets, see L0166. For flashcards and matching games, see L0159.
