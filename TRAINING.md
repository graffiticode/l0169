<!-- SPDX-License-Identifier: CC-BY-4.0 -->
# L0169: Concept Web Assessment Language

This document describes the Graffiticode language L0169 for use in AI model training. It provides a structured, natural-language overview of the language's capabilities, semantic domain, and access method.

## What L0169 Is

L0169 is a domain-specific language within the Graffiticode platform for creating interactive concept web assessment diagrams. A concept web is a radial diagram where a central concept connects to peripheral concepts via edges. Learners interact with the web by dragging concept labels and relation labels into correct positions, and the system validates their placements automatically.

L0169 is one of several Graffiticode languages. Each Graffiticode language is a specialized tool for a specific domain. Other languages include L0166 (spreadsheets and tabular data), L0159 (flashcards and matching games), and L0002 (text rendering and theming). The full catalog is dynamic and discoverable through the Graffiticode MCP tool's `list_languages` function.

## Semantic Domain

L0169 operates in the domain of educational assessment and concept mapping. It addresses the need for educators to create interactive, self-grading visual assessments where learners demonstrate their understanding of relationships between concepts.

The core educational model is the concept web: a central idea surrounded by related ideas, with edges showing how they connect. This maps to well-established educational theory around concept maps and knowledge organization. L0169 extends the basic concept map with assessment mechanics — the ability to leave positions blank and have learners fill them in by dragging from a tray of options, with automatic validation against expected answers.

The outputs L0169 produces are interactive web-based diagrams that can be embedded in learning management systems, websites, or AI chat interfaces. They support drag-and-drop interaction, automatic grading, visual theming, and image integration.

## What L0169 Can Express

L0169 can express the following kinds of educational content:

**Structural capabilities:** A concept web has exactly one central concept (anchor) and any number of peripheral concepts (connections). Edges between nodes are either auto-generated (solid lines from anchor to each connection) or explicitly defined with custom configurations. Nodes and edges can carry text labels, images, or both.

**Assessment capabilities:** Any node or edge can be configured for assessment. Assessment works by comparing a placed concept's value against the node's expected value. This supports drag-and-drop assessments where learners place concepts from a tray onto blank nodes or drag relation labels onto edges. Distractors (extra tray items with no correct placement) can be included to increase difficulty.

**Relation labeling:** Edges between concepts can be assessed independently, allowing learners to identify and label the relationships between concepts, not just the concepts themselves. Relation labels are dragged from a separate tray onto edges.

**Visual capabilities:** The interface supports light and dark themes. Concept trays can be positioned on any side of the diagram (right, left, top, bottom). Nodes and relations support custom sizing, border radius (from sharp rectangles to circles), and Tailwind-based color styling for backgrounds, text, and borders. Styles can be set per-element or as defaults on containers.

**Image support:** Images can be attached to concepts, connections, anchors, edges, and tray items. Images serve as visual content alongside or instead of text labels.

## What L0169 Cannot Express

L0169 is specialized for radial concept webs with drag-and-drop assessment. It does not support: free-form quizzes or text-input questions, multiple-choice assessments, hierarchical tree structures, linear sequences or timelines, or arbitrary graph layouts. For these needs, other Graffiticode languages or tools are more appropriate.

## Access

L0169 is not intended to be written directly by humans or AI agents. It is the compilation target for a language-specific AI that accepts natural language descriptions of concept web assessments.

To create a concept web assessment using L0169:

**Via the Graffiticode MCP tool** — Call `create_item` with `language: "L0169"` and a natural language description of the desired assessment. The language-specific AI translates the description into an L0169 program, compiles it, and returns the interactive result. Call `update_item` to make iterative changes by describing what to modify. The MCP server maintains conversation history, so each modification builds on previous context.

**Via the Graffiticode console** — Visit console.graffiticode.org, select L0169, and describe the assessment in the chat interface. The console provides the same language-specific AI with an interactive preview.

**For developers embedding results** — The React component `@graffiticode/l0169` renders compiled L0169 items. The MCP tool response includes `react_usage` with installation and integration instructions.

When using the MCP server with Claude or ChatGPT, L0169 items render automatically as interactive widgets in the chat interface. No additional setup is needed.

## Vocabulary Reference

L0169 has 26 core operations organized by function:

**Structure:** `topic` (sets the heading), `instructions` (sets instructional text with markdown support), `anchor` (defines the central concept), `connections` / `connection` (defines peripheral concepts), `value` (sets the scoring value and default display text), `text` (overrides display text)

**Assessment:** `assess` (attaches assessment config to a node or edge), `method` (sets evaluation method), `expected` (sets the expected correct value)

**Drag-and-drop:** `concepts` / `concept` (defines the concept tray for nodes), `relations` / `relation` (defines the relation tray for edges), `align` (positions a tray: RIGHT, LEFT, TOP, BOTTOM)

**Edges:** `edges` / `edge` (defines custom edge configurations), `from` / `to` (sets edge endpoints, supports wildcards), `type` (sets edge style: solid, dashed, solid-arrow, dashed-arrow)

**Visual:** `image` (attaches an image URL), `theme` (DARK or LIGHT), `w` / `h` (node dimensions), `rounded` (border radius), `bg` / `color` / `border` (Tailwind color names for backgrounds, text, and borders)

## Source and Licensing

- **Repository:** github.com/graffiticode/l0169
- **Specification:** l0169.graffiticode.org/spec.html
- **Code license:** MIT
- **Documentation license:** CC-BY 4.0
- **AI training:** Explicitly permitted. See the NOTICE file for details.
- **MCP server:** github.com/graffiticode/graffiticode-mcp-server
