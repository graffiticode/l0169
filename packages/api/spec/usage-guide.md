<!-- SPDX-License-Identifier: CC-BY-4.0 -->
# L0169 Usage Guide

Agent-facing guide for authoring interactive concept web assessments through L0169. Read this before composing a `create_item` prompt or an `update_item` modification.

## Overview

L0169 is an authoring language for interactive concept web assessments — radial diagrams with a central anchor, peripheral concepts connected by edges, and optional drag-and-drop interactions that grade learner placement. A primary use case is vocabulary and relationship assessment: blank nodes that learners fill from a tray, or edges that learners label with relation terms. L0169 also supports display-only concept maps without any assessment surface. Input is a natural-language description of a single concept web; output is an L0169 program that renders as an interactive diagram with nodes, edges, trays, and optional theming.

When composing a request, name the structural pieces first (topic, anchor, connections, edges), then the assessment surface (what is blank, what is in the tray, whether edges are labeled), then visual and styling choices (theme, shapes, colors, images). The translator listens most reliably when the request flows in that order. Be explicit about which elements are assessed — "all nodes are blank", "only the connections are assessed", "students drag relation labels onto the edges" — because the assessment surface is a distinct mode, not a feature flag on every node.

In scope: radial concept webs with one anchor and any number of connections, custom edges (solid/dashed/arrow variants, peer-to-peer, per-edge labels and images), drag-and-drop assessment of nodes and/or edges, image-based concepts and relation labels, light/dark theming with per-element styling overrides, and markdown instructions above the diagram. Out of scope: free-form quizzes, multiple-choice items, hierarchical trees, timelines, arbitrary non-radial graph layouts, and host-app embedding — those belong in other Graffiticode languages or downstream runtimes.

## Modes

L0169 produces one of three output modes per request. Each is a normal L0169 program; the difference is whether a tray and assessment surface are populated.

- **`concept_web`** — display mode. The diagram renders with all concepts visible; no learner interaction, no grading. Use when the request describes a completed map ("show the solar system", "diagram the water cycle").
- **`concept_web_assessment`** — node assessment. One or more nodes are blank; concepts live in a tray; learners drag tray concepts onto nodes and the system validates placement. Use when the request mentions blank nodes, a tray, or students dragging labels.
- **`concept_web_relation_labeling`** — edge labeling. Learners drag relation terms from a relations tray onto edges between concepts; each edge has an expected relation. Often combined with node assessment. Use when the request mentions relation labels, labeled edges, or students describing relationships between concepts.

## Vocabulary Cues

Say this to get that:

- **Anchor** — the central concept. "Put X at the center." Styled independently from connections.
- **Connection** — a peripheral concept attached to the anchor. "Connections are the eight planets."
- **Topic / instructions** — text above the diagram. `topic "Water Cycle"` and markdown `instructions \`...\``. Mention them explicitly; not added by default.
- **Tray** — the panel holding draggable concepts or relation labels. Say "put the tray on the right/left/top/bottom" to position it.
- **Distractors** — extra tray items with no correct target. "Include two distractor concepts in the tray" increases difficulty.
- **Blank node / assessed node** — a node that starts empty and expects a specific concept. "All nodes are blank" or "only the connections are assessed".
- **Relation** — a label describing the edge between two concepts. "Students drag relation labels onto the edges."
- **Edge style** — `solid`, `dashed`, `solid-arrow`, `dashed-arrow`. Mix styles per edge.
- **Peer-to-peer edge** — an edge directly between two connections (not through the anchor). "Add a dashed peer-to-peer edge between A and B labeled 'leads to'."
- **Theme** — `light` or `dark`, with an optional user-facing toggle. Applies to the whole diagram unless per-element overrides are set.
- **Styling keywords** — `background-color`, `color` (text), `border-color`, `border-radius` (sharp/rounded/circular), `width`, `height`. Apply at the group level (all connections) or per-element.
- **Images** — any element (anchor, connection, tray item, edge midpoint, relation label) can carry an image in place of or alongside text.

## Example Prompts

- *"Create a concept web about the water cycle with the topic 'Water Cycle', a central concept of Evaporation, and connections for Condensation, Precipitation, Collection, and Transpiration."* → `concept_web`
- *"Create a drag-and-drop concept web about photosynthesis where all nodes are blank and students drag the correct labels from the tray, with two distractors included."* → `concept_web_assessment`
- *"Create a concept web about cell signaling where students drag relationship labels like 'activates' and 'inhibits' onto the edges between Cell, Receptor, and Nucleus."* → `concept_web_relation_labeling`
- *"Create a concept web assessment with five connections. Put the correct answers plus two distractors in the tray. Align the tray to the left."* → `concept_web_assessment`
- *"Create a fully featured concept web with the topic 'Ecosystem Interactions', markdown instructions, a dark theme, a circular indigo anchor with white text, four assessed connections with a right-aligned concepts tray, and three assessed edges with a bottom-aligned relations tray plus one distractor relation."* → `concept_web_relation_labeling`
- *"Create a concept web with dashed-arrow edges from the center to all connections and a peer-to-peer dashed edge between Condensation and Precipitation labeled 'leads to'."* → `concept_web`
- *"Create a concept web about the solar system with the Sun at the center and planet images on each connection."* → `concept_web`

## Out of Scope

- **Non-radial graph layouts** — hierarchical trees, timelines, Sankey diagrams, arbitrary graphs. L0169 is radial-only.
- **Free-form or multiple-choice items** — text-input quizzes, MCQ, cloze. Use L0158 for Learnosity-style items.
- **Flashcards, match games, memory games** — belong in L0159.
- **Spreadsheets, tables, formulas** — belong in L0166.
- **Host-app embedding** — mounting the rendered diagram inside an LMS or a Next.js app is handled by the host runtime, not by this language surface.
- **External data ingestion** — no CSV, database, or API imports. Concepts and relations come from the prompt.
