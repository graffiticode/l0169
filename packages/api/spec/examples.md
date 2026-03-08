# L0169 RAG Training Examples

132 example prompts for training a RAG model on the L0169 concept web assessment language.

## Category 1: Minimal / Structural Basics (1–8)

1. Create a concept web with just an anchor node labeled "Center".
2. Create a concept web with an anchor and two connections.
3. Create a concept web with an anchor and three connections.
4. Create a concept web with a topic and an anchor.
5. Create a concept web with a topic, an anchor, and two connections.
6. Create a concept web with a topic and instructions, but no nodes.
7. Create a concept web with a topic, instructions, an anchor, and one connection.
8. Create an empty concept web with only a topic label.

## Category 2: Topic and Instructions (9–17)

9. Create a concept web with the topic "Solar System".
10. Create a concept web with a short one-line instruction.
11. Create a concept web with multiline markdown instructions using a bulleted list.
12. Create a concept web with markdown instructions that include bold and italic text.
13. Create a concept web with a topic and instructions that explain how to complete the assessment.
14. Create a concept web with a long descriptive instruction paragraph.
15. Create a concept web with numbered step-by-step instructions in markdown.
16. Create a concept web where the instructions tell students to drag concepts onto the correct nodes.
17. Create a concept web with instructions that include both a description and a bulleted list.

## Category 3: Anchor Node (18–25)

18. Create a concept web with an anchor that has display text.
19. Create a concept web with an anchor that has a value but no display text override.
20. Create a concept web with an anchor that uses both value and text where text differs from value.
21. Create a concept web with an anchor that has assessment expecting a specific value.
22. Create a concept web with an anchor with text set to empty string for drag-and-drop.
23. Create a concept web with an anchor using method VALUE tag instead of string 'value'.
24. Create a concept web with an anchor assessed with method 'value' and an expected value.
25. Create a concept web where the anchor has a value, display text override, and assessment.

## Category 4: Connections (26–35)

26. Create a concept web with one connection that has display text.
27. Create a concept web with two connections, each with different text labels.
28. Create a concept web with three connections arranged around the anchor.
29. Create a concept web with six connections around a central anchor.
30. Create a concept web where each connection has a value set.
31. Create a concept web where connections use both value and text with different strings.
32. Create a concept web with connections that have assessment on each node.
33. Create a concept web with three connections, only two of which are assessed.
34. Create a concept web with connections where text is set to empty strings for drag-and-drop.
35. Create a concept web where one connection has no assessment and the others do.

## Category 5: Assessment (36–43)

36. Create a concept web where one connection is assessed with expected value "A".
37. Create a concept web where the anchor and all connections are assessed.
38. Create a concept web with three connections, each assessed with method 'value' and different expected values.
39. Create a concept web with an assessed anchor and four assessed connections.
40. Create a concept web where only the anchor is assessed and connections are display-only.
41. Create a concept web where only the connections are assessed and the anchor is display-only.
42. Create a concept web with five assessed connections and an assessed anchor, all using method 'value'.
43. Create a concept web with three connections where expected values are multi-word strings.

## Category 6: Concepts Tray / Drag-and-Drop (44–57)

44. Create a concept web with a concepts tray containing two items.
45. Create a concept web with a concepts tray containing three text concepts.
46. Create a concept web with a concepts tray aligned to the right.
47. Create a concept web with a concepts tray aligned to the left.
48. Create a concept web with a concepts tray aligned to the top.
49. Create a concept web with a concepts tray aligned to the bottom.
50. Create a drag-and-drop concept web where the anchor text is blank and the concepts tray has the answer.
51. Create a drag-and-drop concept web where all connection texts are blank and concepts provide the answers.
52. Create a drag-and-drop concept web where both anchor and connections are blank with a concepts tray.
53. Create a drag-and-drop concept web with three blank nodes and three matching concepts in the tray.
54. Create a drag-and-drop concept web with concepts that have values different from their display text.
55. Create a drag-and-drop concept web with four blank connections, four concepts, and assessment on every node.
56. Create a drag-and-drop concept web where the tray has more concepts than there are nodes (distractors).
57. Create a drag-and-drop concept web with exactly one distractor concept in the tray.

## Category 7: Images (58–67)

58. Create a concept with a value and an image URL.
59. Create a concepts tray where each concept has an image.
60. Create a concepts tray with two image concepts and one text-only concept.
61. Create a drag-and-drop concept web where concepts use images instead of text.
62. Create a drag-and-drop concept web with three image concepts and assessment on the nodes.
63. Create a concepts tray with images aligned to the top of the diagram.
64. Create a concept web with a mix of image concepts and text concepts in the tray.
65. Create a drag-and-drop concept web where image concepts have values that differ from the image URL.
66. Create a concept web with an image on the anchor node.
67. Create a concept web with images on connections.

## Category 8: Theme (68–73)

68. Create a concept web with the dark theme.
69. Create a concept web with the light theme.
70. Create a concept web with the dark theme, a topic, and an anchor with two connections.
71. Create a concept web with the light theme and a concepts tray.
72. Create a dark-themed drag-and-drop concept web with assessment.
73. Create a light-themed concept web with a topic, instructions, and three connections.

## Category 9: Edges — Basics (74–85)

74. Create a concept web with a single solid edge from the anchor to one connection.
75. Create a concept web with solid edges from the anchor to all connections using the edges keyword.
76. Create a concept web with dashed edges from the anchor to all connections.
77. Create a concept web with solid-arrow edges from the anchor to all connections.
78. Create a concept web with dashed-arrow edges from the anchor to all connections.
79. Create a concept web with an empty edges list so no edges are rendered.
80. Create a concept web with edges using the '*' wildcard on the to field to connect the anchor to all connections.
81. Create a concept web with edges using the '*' wildcard on the from field.
82. Create a concept web with an edge where from is a list of two node values.
83. Create a concept web with an edge where to is a list of two node values.
84. Create a concept web with an edge that has a text label at the midpoint.
85. Create a concept web with an edge that has an image at the midpoint.

## Category 10: Edges — Combinations (86–95)

86. Create a concept web with mixed edge types — some solid and some dashed.
87. Create a concept web with a peer-to-peer edge between two connections, not through the anchor.
88. Create a concept web with solid edges from anchor to all connections plus a dashed peer-to-peer edge between two connections.
89. Create a concept web with edges where each edge has a different text label.
90. Create a concept web with edges using '*' wildcard from the anchor and one specific peer edge with a text label.
91. Create a concept web with solid-arrow edges from anchor to connections and a dashed-arrow edge between two connections.
92. Create a concept web with edges where from and to both use lists of multiple node values.
93. Create a concept web with edges that mix solid, dashed, solid-arrow, and dashed-arrow types.
94. Create a concept web with a peer-to-peer edge that has both a text label and a specific type.
95. Create a concept web with edges where one edge uses '*' wildcard and another uses a specific list for from.

## Category 11: Edges + Other Features (96–103)

96. Create a concept web with custom edges and assessment on all nodes.
97. Create a drag-and-drop concept web with custom edges and a concepts tray.
98. Create a concept web with custom edges, dark theme, topic, and instructions.
99. Create a concept web with dashed edges, assessment, and a left-aligned concepts tray.
100. Create a drag-and-drop concept web with custom edges, blank nodes, assessment, and a right-aligned concepts tray with distractors.
101. Create a concept web with mixed edge types, text labels on edges, and assessment on all nodes.
102. Create a concept web with solid-arrow edges, an image on one edge, and a concepts tray with images.
103. Create a concept web with custom edges, light theme, topic, instructions, and images on connections.

## Category 12: Full Feature Compositions (104–112)

104. Create an assessed concept web with a topic, anchor, and three assessed connections. No concepts tray.
105. Create a concept web with a topic, instructions, an anchor, two connections, and no assessment.
106. Create a concept web with a topic, instructions, assessed anchor, three assessed connections, and a right-aligned concepts tray with matching items.
107. Create a drag-and-drop concept web with a topic, instructions, blank anchor, blank connections, concepts tray, and assessment on all nodes.
108. Create a concept web with a topic, five connections with assessment, and a concepts tray with five items plus two distractors aligned to the left.
109. Create a concept web with a topic, instructions, dark theme, anchor, and four connections. No assessment.
110. Create a concept web with a topic, anchor with text override, three connections with text overrides, and assessment on all nodes using different expected values.
111. Create a fully featured concept web with topic, markdown instructions, dark theme, custom edges with mixed types and text labels, assessed anchor and connections, and a bottom-aligned concepts tray with image concepts and text distractors.
112. Create a drag-and-drop concept web with topic, instructions, light theme, solid-arrow edges from anchor to all connections, dashed peer-to-peer edges with labels, blank assessed nodes, and a right-aligned concepts tray with matching concepts.

## Category 13: Edge Assessment (113–116) *

113. Create a concept web with custom edges where one edge has assessment expecting a specific value. *
114. Create a concept web with custom edges where every edge is assessed with different expected values. *
115. Create a concept web with custom edges where some edges are assessed and others are display-only. *
116. Create a concept web with assessed edges and assessed nodes on the same diagram. *

## Category 14: Relations — Basics (117–124) *

117. Create a concept web with a relations tray containing two relation labels. *
118. Create a concept web with a relation that has a value for scoring. *
119. Create a concept web with a relation that uses text to override the display independently of its value. *
120. Create a concept web with a relation that uses an image for display. *
121. Create a concept web with a relations tray containing a mix of text and image relations. *
122. Create a concept web with a relations tray aligned to the bottom. *
123. Create a concept web with a relations tray aligned to the left. *
124. Create a concept web with a relations tray aligned to the top. *

## Category 15: Relations — Drag-and-Drop (125–130) *

125. Create a drag-and-drop concept web where students drag relation labels from the tray onto assessed edges. *
126. Create a drag-and-drop concept web with three assessed edges and three matching relation labels in the tray. *
127. Create a drag-and-drop concept web with a relations tray containing more relations than edges as distractors. *
128. Create a drag-and-drop concept web with relation labels where values differ from their display text. *
129. Create a drag-and-drop concept web with image-based relation labels dragged onto assessed edges. *
130. Create a drag-and-drop concept web with both a concepts tray for nodes and a relations tray for edges. *

## Category 16: Relations + Full Feature Compositions (131–132) *

131. Create a drag-and-drop concept web with a concepts tray aligned right and a relations tray aligned bottom, with assessment on both nodes and edges. *
132. Create a fully featured drag-and-drop concept web with topic, markdown instructions, dark theme, blank assessed nodes with a concepts tray, assessed edges with mixed types, a relations tray with text overrides and distractors, concepts aligned right, and relations aligned bottom. *
