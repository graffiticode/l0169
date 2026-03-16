# L0169 Usage Guide

Welcome to the L0169 language guide for creating interactive concept web assessments. This language allows users to design concept webs with nodes, connections, and assessments, using the Graffiticode MCP tool or console. Here is everything you can ask L0169 to do, with examples of how to phrase your requests.

## Overview

L0169 is designed to create concept web diagrams for educational assessments. Users can specify topics, instructions, nodes (anchors and connections), and various interactive elements like drag-and-drop concepts and relations. The language supports styling and theming to enhance the visual presentation of these diagrams.

## Capabilities by User Intent

### Creating Basic Structures

You can create simple concept webs with minimal elements:

- "Create a concept web with just an anchor node labeled 'Center'."
- "Create a concept web with an anchor and three connections."
- "Create an empty concept web with only a topic label."

L0169 can create basic structures with anchors and connections but cannot create complex logic or computations.

### Adding Topics and Instructions

Topics and instructions can be added to guide users:

- "Create a concept web with the topic 'Solar System'."
- "Create a concept web with a short one-line instruction."
- "Create a concept web with numbered step-by-step instructions in markdown."

Instructions can include markdown formatting but cannot execute dynamic content or scripts.

### Defining Anchor Nodes

Anchors serve as the central node in a concept web:

- "Create a concept web with an anchor that has display text."
- "Create a concept web with an anchor that uses both value and text where text differs from value."
- "Create a concept web where the anchor has a value, display text override, and assessment."

Anchors can have display text and assessment but cannot function as interactive elements like buttons.

### Creating Connections

Connections link the anchor to other nodes:

- "Create a concept web with three connections arranged around the anchor."
- "Create a concept web where each connection has a value set."
- "Create a concept web with connections that have assessment on each node."

Connections can be assessed and styled but cannot independently trigger actions.

### Implementing Assessments

Assessments evaluate user interactions:

- "Create a concept web where one connection is assessed with expected value 'A'."
- "Create a concept web with an assessed anchor and four assessed connections."
- "Create a concept web where only the connections are assessed and the anchor is display-only."

Assessments can compare expected values but cannot handle complex grading logic.

### Using Concepts Tray for Drag-and-Drop

Concepts trays allow users to drag items onto nodes:

- "Create a concept web with a concepts tray containing two items."
- "Create a drag-and-drop concept web where all connection texts are blank and concepts provide the answers."
- "Create a drag-and-drop concept web with exactly one distractor concept in the tray."

Concepts trays can hold text and images but cannot execute interactive scripts.

### Incorporating Images

Images can enhance the visual appeal of concept webs:

- "Create a concept with a value and an image URL."
- "Create a drag-and-drop concept web where concepts use images instead of text."
- "Create a concept web with an image on the anchor node."

Images can be used for display but cannot be interactive or animated.

### Applying Themes

Themes change the visual style of the concept web:

- "Create a concept web with the dark theme."
- "Create a concept web with the light theme and a concepts tray."
- "Create a dark-themed drag-and-drop concept web with assessment."

Themes can be toggled between dark and light but cannot be customized beyond these presets.

### Customizing Edges

Edges define the lines connecting nodes:

- "Create a concept web with solid edges from the anchor to all connections."
- "Create a concept web with mixed edge types — some solid and some dashed."
- "Create a concept web with an edge that has a text label at the midpoint."

Edges can be styled and labeled but cannot include interactive elements.

### Using Relations for Drag-and-Drop

Relations allow users to drag labels onto edges:

- "Create a drag-and-drop concept web where students drag relation labels from the tray onto assessed edges."
- "Create a drag-and-drop concept web with image-based relation labels dragged onto assessed edges."
- "Create a drag-and-drop concept web with both a concepts tray for nodes and a relations tray for edges."

Relations can be used for labeling but cannot perform dynamic actions.

### Styling Elements

Styling enhances the appearance of nodes and edges:

- "Create a concept web with an anchor that uses w and h to set a custom size."
- "Create a concept web with bg and color applied to individual connections."
- "Create a concept web with styled nodes, custom edges, assessment, and a concepts tray — combining styling with existing features."

Styling can adjust colors, sizes, and shapes but cannot animate elements.

## Iterating and Refining

You can refine your concept web by updating specific elements. Use natural language to specify what you want to change:

- "Update the anchor node to have a new display text."
- "Add an additional connection with a specific label."
- "Change the theme to dark."

Refinements can adjust existing elements but cannot introduce new capabilities beyond the language's scope.

## Cross-References to Other Graffiticode Languages

For capabilities beyond L0169, such as complex logic, animations, or interactive scripts, consider exploring other Graffiticode languages that specialize in those areas.

<!-- SPDX-License-Identifier: CC-BY-4.0 -->