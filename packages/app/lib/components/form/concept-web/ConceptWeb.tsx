// SPDX-License-Identifier: MIT
import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { twColorToHex, twSpacingToPx, twRoundedToCss } from "./tailwind-map";

interface AssessConfig {
  method: string;
  expected: string;
}

interface ConceptConnection {
  value?: string;
  text: string;
  image?: string;
  assess?: AssessConfig;
  w?: number;
  h?: number;
  rounded?: string;
  bg?: string;
  color?: string;
  border?: string;
}

interface ConceptEdge {
  from: string | string[];
  to: string | string[];
  type?: string;
  text?: string;
  image?: string;
  assess?: AssessConfig;
  w?: number;
  h?: number;
  rounded?: string;
  bg?: string;
  color?: string;
  border?: string;
}

interface TrayItem {
  value?: string;
  text?: string;
  image?: string;
  w?: number;
  h?: number;
  rounded?: string;
  bg?: string;
  color?: string;
  border?: string;
}

interface ConceptWebData {
  topic?: string;
  instructions?: string;
  anchor?: ConceptConnection;
  connections: ConceptConnection[];
  edges: ConceptEdge[];
  concepts?: TrayItem[];
  trayAlign?: string;
  relations?: TrayItem[];
  relationsAlign?: string;
}

interface ConceptWebProps {
  conceptWeb: ConceptWebData;
  theme?: string;
}

interface NodePosition {
  x: number;
  y: number;
}

// Base dimensions at a reference width of 500px
const REF_WIDTH = 500;
const BASE_NODE_SIZE = 90;
const BASE_PADDING = 20;
const BASE_FONT_SIZE = 0.8;
const BASE_STROKE_WIDTH = 2;

function computePositions(
  anchor: ConceptConnection | undefined,
  connections: ConceptConnection[],
  width: number,
  height: number,
  nodeSize: number,
  padding: number,
  scale: number,
): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};

  const cx = width / 2;
  const cy = height / 2;

  // Place anchor at center
  if (anchor) {
    positions["anchor"] = { x: cx, y: cy };
  }

  // Compute max node dimension across all nodes for orbit radius
  let maxDim = nodeSize;
  const allNodes = [...connections, ...(anchor ? [anchor] : [])];
  for (const n of allNodes) {
    const nw = n.w ? twSpacingToPx(n.w) * scale : nodeSize;
    const nh = n.h ? twSpacingToPx(n.h) * scale : nodeSize;
    maxDim = Math.max(maxDim, nw, nh);
  }

  // Arrange connections radially
  if (connections.length > 0) {
    const radius = Math.min(cx - maxDim / 2 - padding, cy - maxDim / 2 - padding);
    connections.forEach((_, i) => {
      const angle = (2 * Math.PI * i) / connections.length - Math.PI / 2;
      positions[String(i)] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
  }

  return positions;
}

// Resolved edge with position keys and display properties
interface ResolvedEdge {
  fromKey: string;
  toKey: string;
  type: string;
  text?: string;
  image?: string;
  assess?: AssessConfig;
}

// Build a map from node value string to position key(s)
function buildValueToKeys(
  anchor: ConceptConnection | undefined,
  connections: ConceptConnection[],
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  const add = (value: string | undefined, key: string) => {
    if (!value) return;
    if (!map[value]) map[value] = [];
    map[value].push(key);
  };
  if (anchor) {
    add(anchor.value, "anchor");
  }
  connections.forEach((c, i) => {
    add(c.value, String(i));
  });
  return map;
}

// Resolve edges: expand value-based from/to into position keys, handle "*" wildcard
function resolveEdges(
  edges: ConceptEdge[],
  anchor: ConceptConnection | undefined,
  connections: ConceptConnection[],
): ResolvedEdge[] {
  const valueToKeys = buildValueToKeys(anchor, connections);
  const allKeys: string[] = [];
  if (anchor) allKeys.push("anchor");
  connections.forEach((_, i) => allKeys.push(String(i)));

  const resolved: ResolvedEdge[] = [];

  for (const edge of edges) {
    const type = edge.type || "solid";
    const fromValues = Array.isArray(edge.from) ? edge.from : [edge.from];
    const toValues = Array.isArray(edge.to) ? edge.to : [edge.to];

    // Resolve from values to keys (without wildcard expansion yet)
    const fromKeys: string[] = [];
    let fromIsWildcard = false;
    for (const v of fromValues) {
      if (v === "*") {
        fromIsWildcard = true;
      } else if (valueToKeys[v]) {
        fromKeys.push(...valueToKeys[v]);
      }
    }

    // Resolve to values to keys (without wildcard expansion yet)
    const toKeys: string[] = [];
    let toIsWildcard = false;
    for (const v of toValues) {
      if (v === "*") {
        toIsWildcard = true;
      } else if (valueToKeys[v]) {
        toKeys.push(...valueToKeys[v]);
      }
    }

    // Expand wildcards: "*" means all keys except those on the other side
    const finalFromKeys = fromIsWildcard
      ? allKeys.filter(k => !toKeys.includes(k))
      : fromKeys;
    const finalToKeys = toIsWildcard
      ? allKeys.filter(k => !finalFromKeys.includes(k))
      : toKeys;

    // Generate edges for each from × to combination
    for (const fk of finalFromKeys) {
      for (const tk of finalToKeys) {
        if (fk !== tk) {
          resolved.push({ fromKey: fk, toKey: tk, type, text: edge.text, image: edge.image, assess: edge.assess });
        }
      }
    }
  }

  return resolved;
}

// Insert blank lines when transitioning out of a list so markdown ends the list
function preprocessMarkdown(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i]);
    const isListItem = /^\s*[*\-+]\s/.test(lines[i]) || /^\s*\d+\.\s/.test(lines[i]);
    const next = lines[i + 1];
    if (isListItem && next !== undefined && next.trim() !== '' &&
        !/^\s*[*\-+]\s/.test(next) && !/^\s*\d+\.\s/.test(next)) {
      result.push('');
    }
  }
  return result.join('\n');
}

export function ConceptWeb({ conceptWeb, theme }: ConceptWebProps) {
  const { topic, instructions, anchor, connections, edges, concepts: items = [], trayAlign, relations = [], relationsAlign } = conceptWeb;
  const isDark = theme === "DARK";
  const hasItems = items.length > 0;
  const hasRelations = relations.length > 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [positions, setPositions] = useState<Record<string, NodePosition>>({});
  const dragging = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  // Track which items have been placed on which nodes (node key → item index)
  const [placedItems, setPlacedItems] = useState<Record<string, number>>({});
  // Track item index currently being dragged off a node
  const [draggingItemIndex, setDraggingItemIndex] = useState<number | null>(null);

  // Track which relations have been placed on which edges (edge index → relation index)
  const [placedRelations, setPlacedRelations] = useState<Record<number, number>>({});
  // Track relation index currently being dragged off an edge
  const [draggingRelationIndex, setDraggingRelationIndex] = useState<number | null>(null);
  // Whether a relation is actively being dragged (from tray or edge)
  const [isDraggingRelation, setIsDraggingRelation] = useState(false);
  // Track which edge drop zone is being hovered
  const [hoveredEdgeDrop, setHoveredEdgeDrop] = useState<number | null>(null);

  // Preload images so they're available instantly for drag badges
  const preloadedImages = useRef<Record<number, HTMLImageElement>>({});
  useEffect(() => {
    items.forEach((item, i) => {
      if (item.image && !preloadedImages.current[i]) {
        const img = new Image();
        img.src = item.image;
        preloadedImages.current[i] = img;
      }
    });
  }, [items]);

  // Scale factor relative to reference width
  const scale = size.width > 0 ? size.width / REF_WIDTH : 1;
  const nodeSize = BASE_NODE_SIZE * scale;
  const fontSize = BASE_FONT_SIZE * scale;
  const strokeWidth = BASE_STROKE_WIDTH * scale;

  // Build all entries for rendering: anchor + connections
  const allEntries: { key: string; data: ConceptConnection }[] = [];
  if (anchor) {
    allEntries.push({ key: "anchor", data: anchor });
  }
  connections.forEach((c, i) => {
    allEntries.push({ key: String(i), data: c });
  });

  // Measure container and compute initial positions
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const height = width;
      const s = width / REF_WIDTH;
      const ns = BASE_NODE_SIZE * s;
      const pd = BASE_PADDING * s;
      setSize({ width, height });
      setPositions(computePositions(anchor, connections, width, height, ns, pd, s));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [anchor, connections]);

  const handlePointerDown = useCallback((e: React.PointerEvent, key: string) => {
    const pos = positions[key];
    if (!pos || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    dragging.current = {
      id: key,
      offsetX: e.clientX - rect.left - pos.x,
      offsetY: e.clientY - rect.top - pos.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [positions]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragging.current.offsetX;
    const y = e.clientY - rect.top - dragging.current.offsetY;
    setPositions(prev => ({
      ...prev,
      [dragging.current!.id]: { x, y },
    }));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  // Drag-and-drop handlers for tray items onto nodes
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingItemIndex(null);
    const rawData = e.dataTransfer.getData("application/json");
    if (!rawData) return;
    try {
      const itemIndex: number = JSON.parse(rawData);
      setPlacedItems(prev => {
        const next = { ...prev };
        // Remove this item index from any other node it was on
        for (const k of Object.keys(next)) {
          if (next[k] === itemIndex) {
            delete next[k];
          }
        }
        next[key] = itemIndex;
        return next;
      });
    } catch {
      // ignore invalid data
    }
  }, []);

  // Accept drops anywhere in the layout to prevent browser snap-back animation
  const handleContainerDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggingItemIndex(null);
    setDraggingRelationIndex(null);
    setIsDraggingRelation(false);
    setHoveredEdgeDrop(null);
    // If dragged off an edge and dropped on nothing, remove from that edge
    const sourceEdge = draggingFromEdge.current;
    if (sourceEdge !== null) {
      draggingFromEdge.current = null;
      setPlacedRelations(prev => {
        const next = { ...prev };
        delete next[sourceEdge];
        return next;
      });
    }
  }, []);

  // Drop a relation onto an edge
  const handleEdgeDrop = useCallback((e: React.DragEvent, edgeIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingRelationIndex(null);
    setIsDraggingRelation(false);
    const sourceEdge = draggingFromEdge.current;
    draggingFromEdge.current = null;

    const rawData = e.dataTransfer.getData("application/relation-json");
    if (!rawData) return;
    try {
      const relationIndex: number = JSON.parse(rawData);
      setPlacedRelations(prev => {
        const next = { ...prev };
        // Remove from source edge if dragged off one
        if (sourceEdge !== null) delete next[sourceEdge];
        // Remove this relation from any other edge
        for (const k of Object.keys(next)) {
          if (next[Number(k)] === relationIndex) {
            delete next[Number(k)];
          }
        }
        next[edgeIndex] = relationIndex;
        return next;
      });
    } catch {
      // ignore
    }
  }, []);

  // Drag a relation from the tray
  const createRelationDragBadge = useCallback((item: TrayItem) => {
    const badgeBg = item.bg ? twColorToHex(item.bg) : (isDark ? "#1e3a5f" : "#dbeafe");
    const badgeColor = item.color ? twColorToHex(item.color) : (isDark ? "#bfdbfe" : "#1e40af");
    const badgeRounded = item.rounded ? twRoundedToCss(item.rounded) : twRoundedToCss("xs");
    const badgeBorder = item.border ? `${Math.max(1, strokeWidth)}px solid ${twColorToHex(item.border)}` : "none";
    const badge = document.createElement("div");
    badge.style.cssText = `
      display: flex; align-items: center; justify-content: center;
      padding: ${4 * scale}px ${8 * scale}px; border-radius: ${badgeRounded};
      background: ${badgeBg}; color: ${badgeColor}; border: ${badgeBorder};
      position: fixed; top: -1000px; left: -1000px; white-space: nowrap;
      font-size: ${fontSize * 0.75}rem; font-weight: 500;
    `;
    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.style.cssText = `max-height: ${nodeSize * 0.3}px; object-fit: cover;`;
      badge.appendChild(img);
    } else {
      badge.textContent = item.text || item.value || "";
    }
    return badge;
  }, [isDark, fontSize, scale, nodeSize, strokeWidth]);

  const handleRelationTrayDragStart = useCallback((e: React.DragEvent, relationIndex: number, item: TrayItem) => {
    e.dataTransfer.setData("application/relation-json", JSON.stringify(relationIndex));
    e.dataTransfer.effectAllowed = "move";
    setIsDraggingRelation(true);
    const badge = createRelationDragBadge(item);
    document.body.appendChild(badge);
    badge.getBoundingClientRect();
    e.dataTransfer.setDragImage(badge, badge.offsetWidth / 2, badge.offsetHeight / 2);
    requestAnimationFrame(() => document.body.removeChild(badge));
  }, [createRelationDragBadge]);

  // Drag a placed relation off an edge — keep it in placedRelations until drop
  const draggingFromEdge = useRef<number | null>(null);
  const handleEdgeRelationDragStart = useCallback((e: React.DragEvent, edgeIndex: number) => {
    const relationIndex = placedRelations[edgeIndex];
    if (relationIndex === undefined) { e.preventDefault(); return; }
    const item = relations[relationIndex];
    if (!item) { e.preventDefault(); return; }
    e.dataTransfer.setData("application/relation-json", JSON.stringify(relationIndex));
    e.dataTransfer.effectAllowed = "move";
    const badge = createRelationDragBadge(item);
    document.body.appendChild(badge);
    badge.getBoundingClientRect();
    e.dataTransfer.setDragImage(badge, badge.offsetWidth / 2, badge.offsetHeight / 2);
    requestAnimationFrame(() => document.body.removeChild(badge));
    setDraggingRelationIndex(relationIndex);
    draggingFromEdge.current = edgeIndex;
    // Don't set isDraggingRelation here — onDrag will set it on actual movement
  }, [placedRelations, relations, createRelationDragBadge]);

  // Fires continuously during actual dragging (not on a simple click)
  const handleEdgeRelationDrag = useCallback(() => {
    if (!isDraggingRelation) setIsDraggingRelation(true);
  }, [isDraggingRelation]);

  // Reset if drag ends without a successful drop
  const handleEdgeRelationDragEnd = useCallback(() => {
    setDraggingRelationIndex(null);
    setIsDraggingRelation(false);
    draggingFromEdge.current = null;
  }, []);

  const createDragBadge = useCallback((item: TrayItem, itemIndex: number, sz: number) => {
    const badgeBg = item.bg ? twColorToHex(item.bg) : (isDark ? "#1e3a5f" : "#dbeafe");
    const badgeColor = item.color ? twColorToHex(item.color) : (isDark ? "#bfdbfe" : "#1e40af");
    const badgeRounded = item.rounded ? twRoundedToCss(item.rounded) : twRoundedToCss("md");
    const badgeBorder = item.border ? `${Math.max(1, strokeWidth)}px solid ${twColorToHex(item.border)}` : "none";
    const badge = document.createElement("div");
    badge.style.cssText = `
      display: flex; align-items: center; justify-content: center;
      width: ${sz}px; height: ${sz}px; border-radius: ${badgeRounded}; box-sizing: border-box;
      padding: ${4 * scale}px;
      background: ${badgeBg}; color: ${badgeColor}; border: ${badgeBorder};
      position: fixed; top: -1000px; left: -1000px; overflow: hidden;
    `;
    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      const preloaded = preloadedImages.current[itemIndex];
      if (preloaded && preloaded.complete) {
        img.src = preloaded.src;
      }
      img.style.cssText = `
        width: ${sz * 0.75}px; height: ${sz * 0.75}px;
        border-radius: ${badgeRounded}; object-fit: cover;
      `;
      badge.appendChild(img);
    } else {
      const span = document.createElement("span");
      span.textContent = item.text || item.value || "";
      span.style.cssText = `
        font-size: ${fontSize}rem; font-weight: 500; text-align: center;
        line-height: 1.2; overflow: hidden; overflow-wrap: break-word;
        max-width: ${sz * 0.7}px;
      `;
      badge.appendChild(span);
    }
    return badge;
  }, [isDark, fontSize, scale, strokeWidth]);

  const handleTrayDragStart = useCallback((e: React.DragEvent, itemIndex: number, item: TrayItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(itemIndex));
    e.dataTransfer.effectAllowed = "move";
    const sz = nodeSize;
    const badge = createDragBadge(item, itemIndex, sz);
    document.body.appendChild(badge);
    badge.getBoundingClientRect();
    e.dataTransfer.setDragImage(badge, sz / 2, sz / 2);
    requestAnimationFrame(() => document.body.removeChild(badge));
  }, [nodeSize, createDragBadge]);

  // Drag a placed item off a node — show a badge as the drag image
  const handleNodeDragStart = useCallback((e: React.DragEvent, key: string) => {
    const itemIndex = placedItems[key];
    if (itemIndex === undefined) { e.preventDefault(); return; }
    const item = items[itemIndex];
    if (!item) { e.preventDefault(); return; }
    e.dataTransfer.setData("application/json", JSON.stringify(itemIndex));
    e.dataTransfer.effectAllowed = "move";
    const sz = nodeSize;
    const badge = createDragBadge(item, itemIndex, sz);
    document.body.appendChild(badge);
    badge.getBoundingClientRect();
    e.dataTransfer.setDragImage(badge, sz / 2, sz / 2);
    requestAnimationFrame(() => document.body.removeChild(badge));
    // Clear the node immediately but track the item as in-flight
    setDraggingItemIndex(itemIndex);
    setPlacedItems(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, [placedItems, items, nodeSize, createDragBadge]);

  // Set of placed item indices for muting in the tray (include in-flight item)
  const placedItemIndices = new Set(Object.values(placedItems));
  if (draggingItemIndex !== null) placedItemIndices.add(draggingItemIndex);

  // Set of placed relation indices for muting in the tray
  const placedRelationIndices = new Set(Object.values(placedRelations));
  if (draggingRelationIndex !== null) placedRelationIndices.add(draggingRelationIndex);

  // Resolve value-based edges to position-key-based edges.
  // If edges is undefined/null, default to solid edges from anchor to all connections.
  // If edges is an empty array, render no edges.
  const resolvedEdges = edges
    ? resolveEdges(edges, anchor, connections)
    : anchor
      ? connections.map((_, i) => ({ fromKey: "anchor", toKey: String(i), type: "solid" } as ResolvedEdge))
      : [];

  const borderColor = isDark ? "#71717a" : "#a1a1aa";
  const nodeBackground = isDark ? "#27272a" : "#ffffff";
  const nodeTextColor = isDark ? "#e4e4e7" : "#18181b";
  const edgeColor = isDark ? "#71717a" : "#a1a1aa";
  const edgeLabelColor = isDark ? "#a1a1aa" : "#52525b";
  const topicColor = isDark ? "#e4e4e7" : "#18181b";

  const markerSize = 6 * scale;

  // Determine the display text for an entry (placed concept overrides connection text)
  // For concepts: text or image override display, value is the fallback label
  const getDisplayText = (key: string, data: ConceptConnection): string => {
    if (hasItems && placedItems[key] !== undefined) {
      const item = items[placedItems[key]];
      return item?.text || item?.value || "";
    }
    return data.text;
  };

  // Determine the display image for an entry (placed item image, or node's own image)
  const getDisplayImage = (key: string, data: ConceptConnection): string | undefined => {
    if (hasItems && placedItems[key] !== undefined) {
      return items[placedItems[key]]?.image;
    }
    return data.image;
  };

  // Compute edge signature for a position key based on resolved edges touching it.
  // Two positions with the same signature are interchangeable for assessment.
  const edgeSignature = (key: string): string => {
    const nodeType = key === "anchor" ? "anchor" : "connection";
    if (resolvedEdges.length === 0) {
      // No edges at all — group by node type only
      return nodeType;
    }
    const parts: string[] = [nodeType];
    for (const re of resolvedEdges) {
      if (re.fromKey === key) {
        parts.push(`f|${re.type || ""}|${re.text || ""}|${re.image || ""}|${re.toKey}`);
      } else if (re.toKey === key) {
        parts.push(`t|${re.type || ""}|${re.text || ""}|${re.image || ""}|${re.fromKey}`);
      }
    }
    parts.sort();
    return parts.join(";;");
  };

  // Group assessed entries by edge signature for bipartite matching.
  // Returns a map: signature → { keys, expectedValues[] }
  const buildAssessGroups = (): Map<string, { keys: string[]; expected: string[] }> => {
    const groups = new Map<string, { keys: string[]; expected: string[] }>();
    const allEntries: Array<{ key: string; data: ConceptConnection }> = [];
    if (anchor?.assess) allEntries.push({ key: "anchor", data: anchor });
    connections.forEach((c, i) => {
      if (c.assess) allEntries.push({ key: String(i), data: c });
    });
    for (const { key, data } of allEntries) {
      if (data.assess?.method !== "value") continue;
      const sig = edgeSignature(key);
      let group = groups.get(sig);
      if (!group) {
        group = { keys: [], expected: [] };
        groups.set(sig, group);
      }
      group.keys.push(key);
      // Build composite key: concept expected value + incident assessed edge relation values
      const incidentRelations = resolvedEdges
        .filter(re => re.fromKey === key || re.toKey === key)
        .filter(re => re.assess?.method === "value")
        .map(re => re.assess!.expected);
      const composite = [data.assess.expected, ...incidentRelations].join("||");
      group.expected.push(composite);
    }
    return groups;
  };

  // Precompute which keys are "matched" (green) via bipartite matching within edge-signature groups
  const matchedKeys = new Set<string>();
  const unmatchedKeys = new Set<string>();
  const assessGroups = buildAssessGroups();
  for (const [, group] of assessGroups) {
    // Collect placed composite values for each key in the group
    const placedByKey: Record<string, string | undefined> = {};
    for (const key of group.keys) {
      let conceptValue: string | undefined;
      if (hasItems && placedItems[key] !== undefined) {
        conceptValue = items[placedItems[key]]?.value || "";
      } else {
        // Use the node's own value if it has one (scores on init)
        const data = key === "anchor" ? anchor : connections[parseInt(key)];
        if (data?.value) conceptValue = data.value;
      }
      if (conceptValue === undefined) continue;

      // Collect placed relation values on incident assessed edges
      const incidentRelations = resolvedEdges
        .map((re, i) => ({ re, i }))
        .filter(({ re }) => re.fromKey === key || re.toKey === key)
        .filter(({ re }) => re.assess?.method === "value")
        .map(({ i }) => {
          const relIdx = placedRelations[i];
          return relIdx !== undefined ? (relations[relIdx]?.value || "") : "";
        });
      placedByKey[key] = [conceptValue, ...incidentRelations].join("||");
    }

    // Build pool of remaining expected values for bipartite matching
    const remainingExpected = [...group.expected];
    // First pass: match placed values against expected pool
    for (const key of group.keys) {
      const placed = placedByKey[key];
      if (placed === undefined) continue; // nothing placed
      const idx = remainingExpected.indexOf(placed);
      if (idx !== -1) {
        matchedKeys.add(key);
        remainingExpected.splice(idx, 1);
      } else {
        unmatchedKeys.add(key);
      }
    }
  }

  // Edge assessment scoring — derive from node composite matching.
  // An edge relation is correct (green) only if its incident node's composite matched.
  const matchedEdges = new Set<number>();
  const unmatchedEdges = new Set<number>();
  if (hasRelations) {
    for (let i = 0; i < resolvedEdges.length; i++) {
      const edge = resolvedEdges[i];
      if (!edge.assess || edge.assess.method !== "value") continue;
      const relationIdx = placedRelations[i];
      if (relationIdx === undefined) continue;
      // Find the assessed node incident to this edge
      const incidentKey = [edge.fromKey, edge.toKey].find(
        k => matchedKeys.has(k) || unmatchedKeys.has(k)
      );
      if (incidentKey && matchedKeys.has(incidentKey)) {
        matchedEdges.add(i);
      } else if (incidentKey && unmatchedKeys.has(incidentKey)) {
        unmatchedEdges.add(i);
      }
    }
  }

  // Assessment scoring — edge-signature-aware bipartite matching
  const getEntryBackground = (key: string, data: ConceptConnection): string => {
    if (!data.assess) return nodeBackground;
    if (data.assess.method !== "value") return nodeBackground;

    // Check if something is placed or the node has its own value
    const hasPlacedItem = hasItems && placedItems[key] !== undefined;
    const hasOwnValue = !!data.value;
    if (!hasPlacedItem && !hasOwnValue) return nodeBackground;

    if (matchedKeys.has(key)) {
      return isDark ? "#14532d" : "#dcfce7"; // green
    }
    return isDark ? "#7f1d1d" : "#fee2e2"; // red
  };

  // Layout direction based on trayAlign
  const align = trayAlign || "right";
  const isHorizontalLayout = align === "left" || align === "right";
  const outerFlexDir = isHorizontalLayout
    ? (align === "right" ? "row" : "row-reverse")
    : (align === "bottom" ? "column" : "column-reverse");

  // Tray component
  const tray = hasItems ? (
    <div
      className={`flex flex-wrap gap-2 p-3 ${isHorizontalLayout ? "flex-col items-start" : "flex-row justify-center"}`}
      style={{
        minWidth: isHorizontalLayout ? 120 : undefined,
        maxWidth: isHorizontalLayout ? 160 : undefined,
      }}
    >
      {items.map((item, index) => {
        const isPlaced = placedItemIndices.has(index);
        const itemBg = item.bg ? twColorToHex(item.bg) : undefined;
        const itemColor = item.color ? twColorToHex(item.color) : undefined;
        const itemBorder = item.border ? twColorToHex(item.border) : undefined;
        const itemRounded = item.rounded ? twRoundedToCss(item.rounded) : twRoundedToCss("md");
        const defaultBg = isDark ? "#1e3a5f" : "#dbeafe";
        const defaultColor = isDark ? "#bfdbfe" : "#1e40af";
        const placedBg = isDark ? "#3f3f46" : "#e5e7eb";
        const placedColor = isDark ? "#71717a" : "#9ca3af";
        return (
          <div
            key={index}
            draggable={!isPlaced}
            onDragStart={(e) => handleTrayDragStart(e, index, item)}
            className="inline-flex items-center justify-center font-medium cursor-grab select-none"
            style={{
              width: nodeSize * 0.75,
              height: nodeSize * 0.75,
              fontSize: `${fontSize * 0.75}rem`,
              padding: item.image ? 0 : `${3 * scale}px`,
              overflow: "hidden",
              borderRadius: itemRounded,
              background: isPlaced ? placedBg : (itemBg || defaultBg),
              color: isPlaced ? placedColor : (itemColor || defaultColor),
              border: itemBorder ? `${Math.max(1, strokeWidth)}px solid ${isPlaced ? (isDark ? "#52525b" : "#d1d5db") : itemBorder}` : "none",
              opacity: isPlaced ? 0.5 : 1,
              cursor: isPlaced ? "default" : "grab",
            }}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.text || item.value || ""}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                draggable={false}
              />
            ) : null}
            {!item.image && (item.text || item.value) && (
              <span
                style={{
                  fontSize: `${fontSize * 0.75}rem`,
                  textAlign: "center",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >{item.text || item.value}</span>
            )}
          </div>
        );
      })}
    </div>
  ) : null;

  // Relations tray layout
  const rAlign = (relationsAlign || "bottom").toLowerCase();
  const rIsVertical = rAlign === "left" || rAlign === "right";
  const relationsOuterDir = rIsVertical
    ? (rAlign === "right" ? "row" : "row-reverse")
    : (rAlign === "bottom" ? "column" : "column-reverse");

  const relationsTray = hasRelations ? (
    <div
      className={`flex flex-wrap gap-2 p-3 ${rIsVertical ? "flex-col items-center justify-center" : "flex-row justify-center"}`}
      onDragOver={handleDragOver}
      onDrop={handleContainerDrop}
    >
      {relations.map((item, index) => {
        const isPlaced = placedRelationIndices.has(index);
        const itemBg = item.bg ? twColorToHex(item.bg) : undefined;
        const itemColor = item.color ? twColorToHex(item.color) : undefined;
        const itemBorder = item.border ? twColorToHex(item.border) : undefined;
        const itemRounded = item.rounded ? twRoundedToCss(item.rounded) : twRoundedToCss("xs");
        const defaultBg = isDark ? "#1e3a5f" : "#dbeafe";
        const defaultColor = isDark ? "#bfdbfe" : "#1e40af";
        const placedBg = isDark ? "#3f3f46" : "#e5e7eb";
        const placedColor = isDark ? "#71717a" : "#9ca3af";
        return (
          <div
            key={index}
            draggable={!isPlaced}
            onDragStart={(e) => handleRelationTrayDragStart(e, index, item)}
            className="inline-flex items-center justify-center font-medium cursor-grab select-none"
            style={{
              padding: item.image ? 0 : `${4 * scale}px ${10 * scale}px`,
              fontSize: `${fontSize * 0.75}rem`,
              borderRadius: itemRounded,
              overflow: "hidden",
              background: isPlaced ? placedBg : (itemBg || defaultBg),
              color: isPlaced ? placedColor : (itemColor || defaultColor),
              border: itemBorder ? `${Math.max(1, strokeWidth)}px solid ${isPlaced ? (isDark ? "#52525b" : "#d1d5db") : itemBorder}` : "none",
              opacity: isPlaced ? 0.5 : 1,
              cursor: isPlaced ? "default" : "grab",
            }}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.text || item.value || ""}
                style={{
                  height: nodeSize * 0.3,
                  objectFit: "cover",
                }}
                draggable={false}
              />
            ) : (
              <span>{item.text || item.value}</span>
            )}
          </div>
        );
      })}
    </div>
  ) : null;

  return (
    <div className="flex flex-col gap-2">
      {(topic || instructions) && (
        <div className="flex flex-col gap-1">
          {topic && (
            <div
              className="text-lg font-bold text-center"
              style={{ color: topicColor }}
            >
              <ReactMarkdown
                components={{
                  p: ({children}) => <>{children}</>,
                }}
              >
                {topic}
              </ReactMarkdown>
            </div>
          )}
          {instructions && (
            <div
              className="text-sm text-left font-sans"
              style={{ color: isDark ? "#a1a1aa" : "#52525b", paddingLeft: "25%", paddingRight: "25%" }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkBreaks]}
                components={{
                  h1: ({children}) => <h1 className="text-lg font-bold mb-1">{children}</h1>,
                  h2: ({children}) => <h2 className="text-base font-bold mb-1">{children}</h2>,
                  h3: ({children}) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                  p: ({children}) => <p className="mb-1">{children}</p>,
                  ul: ({children}) => <ul className="list-disc pl-5 mb-1 text-left inline-block">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-5 mb-1 text-left inline-block">{children}</ol>,
                  li: ({children}) => <li className="mb-0.5">{children}</li>,
                }}
              >
                {preprocessMarkdown(instructions)}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
      <div
        className="flex"
        style={{ flexDirection: relationsOuterDir as any }}
        onDragOver={(hasItems || hasRelations) ? handleDragOver : undefined}
        onDrop={(hasItems || hasRelations) ? handleContainerDrop : undefined}
      >
      <div
        className="flex"
        style={{ flexDirection: outerFlexDir as any, flex: 1 }}
      >
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "100%",
            flex: isHorizontalLayout ? 1 : "none",
            height: size.height || 300,
            touchAction: "none",
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* SVG layer for edges */}
          {size.width > 0 && (
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
              }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth={markerSize}
                  markerHeight={markerSize * 0.7}
                  refX={markerSize}
                  refY={markerSize * 0.35}
                  orient="auto"
                >
                  <polygon points={`0 0, ${markerSize} ${markerSize * 0.35}, 0 ${markerSize * 0.7}`} fill={edgeColor} />
                </marker>
              </defs>
              {resolvedEdges.map((edge, i) => {
                const from = positions[edge.fromKey];
                const to = positions[edge.toKey];
                if (!from || !to) return null;

                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist === 0) return null;

                const nx = dx / dist;
                const ny = dy / dist;

                // Per-node dimensions for edge offset
                const fromData = edge.fromKey === "anchor" ? anchor : connections[parseInt(edge.fromKey)];
                const toData = edge.toKey === "anchor" ? anchor : connections[parseInt(edge.toKey)];
                const fromW = fromData?.w ? twSpacingToPx(fromData.w) * scale : nodeSize;
                const fromH = fromData?.h ? twSpacingToPx(fromData.h) * scale : nodeSize;
                const toW = toData?.w ? twSpacingToPx(toData.w) * scale : nodeSize;
                const toH = toData?.h ? twSpacingToPx(toData.h) * scale : nodeSize;
                const fromRoundedCss = fromData?.rounded ? twRoundedToCss(fromData.rounded) : twRoundedToCss("md");
                const toRoundedCss = toData?.rounded ? twRoundedToCss(toData.rounded) : twRoundedToCss("md");

                // Rounded-rectangle edge intersection: find distance from center
                // to the boundary along direction (dirX, dirY)
                const roundedRectOffset = (hw: number, hh: number, dirX: number, dirY: number, radiusCss: string) => {
                  const absDx = Math.abs(dirX);
                  const absDy = Math.abs(dirY);
                  if (absDx < 1e-9 && absDy < 1e-9) return 0;

                  // Parse border-radius to pixels; "9999px" or large values → ellipse
                  let r: number;
                  if (radiusCss.endsWith("px")) {
                    r = parseFloat(radiusCss);
                  } else if (radiusCss.endsWith("rem")) {
                    r = parseFloat(radiusCss) * 16;
                  } else {
                    r = parseFloat(radiusCss) || 0;
                  }
                  // Clamp radius to half the smaller dimension (like CSS does)
                  const maxR = Math.min(hw, hh);
                  r = Math.min(r, maxR);

                  if (r >= maxR - 0.5) {
                    // Fully rounded → ellipse intersection
                    // Ellipse: (x/hw)^2 + (y/hh)^2 = 1
                    // Point along (dirX, dirY): t such that (t*dirX/hw)^2 + (t*dirY/hh)^2 = 1
                    const denom = (absDx / hw) ** 2 + (absDy / hh) ** 2;
                    return 1 / Math.sqrt(denom);
                  }

                  // Rounded rectangle: straight edges with circular arc corners
                  // The straight region extends from -hw to hw with corners rounded by r
                  // Find intersection of ray with the rounded rect boundary
                  const rectT = Math.min(
                    absDx > 1e-9 ? hw / absDx : Infinity,
                    absDy > 1e-9 ? hh / absDy : Infinity,
                  );
                  // Point on the rectangle boundary
                  const px = absDx * rectT;
                  const py = absDy * rectT;
                  // Check if point is in the corner region
                  const cornerX = hw - r;
                  const cornerY = hh - r;
                  if (px > cornerX && py > cornerY) {
                    // In corner region — intersect ray with the corner circle
                    // Circle center at (cornerX, cornerY) with radius r
                    // Ray: (t*absDx, t*absDy)
                    // (t*absDx - cornerX)^2 + (t*absDy - cornerY)^2 = r^2
                    const a = absDx * absDx + absDy * absDy;
                    const b = -2 * (absDx * cornerX + absDy * cornerY);
                    const c = cornerX * cornerX + cornerY * cornerY - r * r;
                    const disc = b * b - 4 * a * c;
                    if (disc >= 0) {
                      return (-b + Math.sqrt(disc)) / (2 * a);
                    }
                  }
                  return rectT;
                };

                const fromOffset = roundedRectOffset(fromW / 2, fromH / 2, nx, ny, fromRoundedCss);
                const toOffset = roundedRectOffset(toW / 2, toH / 2, nx, ny, toRoundedCss);

                const x1 = from.x + nx * fromOffset;
                const y1 = from.y + ny * fromOffset;
                const x2 = to.x - nx * toOffset;
                const y2 = to.y - ny * toOffset;

                const isDashed = edge.type === "dashed" || edge.type === "dashed-arrow";
                const isArrow = edge.type === "solid-arrow" || edge.type === "dashed-arrow";
                const dashSize = 6 * scale;
                const gapSize = 4 * scale;

                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;

                return (
                  <g key={i}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={edgeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={isDashed ? `${dashSize} ${gapSize}` : undefined}
                      markerEnd={isArrow ? "url(#arrowhead)" : undefined}
                    />
                    {/* Edge label — SVG text/image; hidden during relation drag or when selected as pill */}
                    {!isDraggingRelation && (() => {
                      const placedRel = hasRelations && placedRelations[i] !== undefined ? relations[placedRelations[i]] : null;
                      const labelText = placedRel ? (placedRel.text || placedRel.value || "") : (edge.text || "");
                      const labelImage = placedRel ? placedRel.image : edge.image;

                      if (labelImage) {
                        return (
                          <image
                            href={labelImage}
                            x={midX - nodeSize * 0.2}
                            y={midY - nodeSize * 0.2}
                            width={nodeSize * 0.4}
                            height={nodeSize * 0.4}
                          />
                        );
                      }
                      if (!labelText) return null;
                      const edgeLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                      const arrowMargin = isArrow ? markerSize : 0;
                      const maxWidth = Math.max(0, edgeLen - arrowMargin * 2);
                      const labelFontSize = fontSize * 0.85;
                      const charWidth = labelFontSize * 16 * 0.55;
                      const charsPerLine = Math.max(1, Math.floor(maxWidth / charWidth));
                      const words = labelText.split(' ');
                      const lines: string[] = [];
                      let current = '';
                      for (const word of words) {
                        const test = current ? current + ' ' + word : word;
                        if (test.length <= charsPerLine) {
                          current = test;
                        } else {
                          if (current) lines.push(current);
                          current = word;
                        }
                      }
                      if (current) lines.push(current);
                      const lineHeight = labelFontSize * 16 * 1.2;
                      const totalHeight = lines.length * lineHeight;

                      let labelColor = placedRel?.color ? twColorToHex(placedRel.color) : edgeLabelColor;
                      if (placedRel && edge.assess?.method === "value") {
                        if (matchedEdges.has(i)) {
                          labelColor = isDark ? "#4ade80" : "#16a34a";
                        } else if (unmatchedEdges.has(i)) {
                          labelColor = isDark ? "#f87171" : "#dc2626";
                        }
                      }

                      const labelBg = placedRel?.bg ? twColorToHex(placedRel.bg) : null;
                      const labelBorder = placedRel?.border ? twColorToHex(placedRel.border) : null;
                      const labelRounded = placedRel?.rounded ? twRoundedToCss(placedRel.rounded) : null;

                      // Compute background pill dimensions
                      const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b, "");
                      const textW = longestLine.length * charWidth;
                      const pad = 6 * scale;
                      const pillW = textW + pad * 2;
                      const pillH = totalHeight + pad;
                      const pillX = midX - pillW / 2;
                      const pillY = midY - pillH / 2;

                      // Parse border-radius for SVG rx/ry
                      let pillRx = 4 * scale;
                      if (labelRounded) {
                        if (labelRounded.endsWith("px")) pillRx = parseFloat(labelRounded);
                        else if (labelRounded.endsWith("rem")) pillRx = parseFloat(labelRounded) * 16;
                        else pillRx = parseFloat(labelRounded) || 4 * scale;
                      }

                      return (
                        <g style={{ pointerEvents: "none" }}>
                          <rect
                            x={pillX}
                            y={pillY}
                            width={pillW}
                            height={pillH}
                            rx={pillRx}
                            ry={pillRx}
                            fill={labelBg || (isDark ? "#18181b" : "#ffffff")}
                            stroke={labelBorder || "none"}
                            strokeWidth={labelBorder ? strokeWidth : 0}
                          />
                          <text
                            x={midX}
                            y={midY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={labelColor}
                            fontSize={`${labelFontSize}rem`}
                          >
                            {lines.map((line, li) => {
                              const offsetY = (li - (lines.length - 1) / 2) * lineHeight;
                              return (
                                <tspan key={li} x={midX} dy={li === 0 ? offsetY : lineHeight}>
                                  {line}
                                </tspan>
                              );
                            })}
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                );
              })}
            </svg>
          )}

          {/* Edge label drop zones — only visible during a relation drag */}
          {isDraggingRelation && resolvedEdges.map((edge, i) => {
            // Only show a drop zone on edges that have a label or assessment
            if (!edge.text && !edge.image && !edge.assess) return null;
            const from = positions[edge.fromKey];
            const to = positions[edge.toKey];
            if (!from || !to) return null;

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            const relationIdx = placedRelations[i];
            const hasPlacedRelation = relationIdx !== undefined;
            const relation = hasPlacedRelation ? relations[relationIdx] : null;

            // Show placed relation label, or fall back to edge's own label
            const displayLabel = relation
              ? (relation.text || relation.value || "")
              : (edge.text || "");
            const displayImage = relation?.image || (hasPlacedRelation ? undefined : edge.image);
            const isEdgeAssessed = edge.assess?.method === "value";

            // Relation styles
            const relBg = relation?.bg ? twColorToHex(relation.bg) : null;
            const relBorder = relation?.border ? twColorToHex(relation.border) : null;
            const relRounded = relation?.rounded ? twRoundedToCss(relation.rounded) : null;
            const relColor = relation?.color ? twColorToHex(relation.color) : null;

            // Assessment coloring when a relation has been placed
            let bgColor = hasPlacedRelation && relBg ? relBg : (isDark ? "#3f3f46" : "#e4e4e7");
            if (hasPlacedRelation && isEdgeAssessed) {
              if (matchedEdges.has(i)) {
                bgColor = isDark ? "#14532d" : "#dcfce7";
              } else if (unmatchedEdges.has(i)) {
                bgColor = isDark ? "#7f1d1d" : "#fee2e2";
              }
            }
            const dropBorderColor = hasPlacedRelation && relBorder ? relBorder : borderColor;
            const dropRounded = hasPlacedRelation && relRounded ? relRounded : undefined;

            // Match relation tray badge height: font size + vertical padding
            const relFontSize = fontSize * 0.75;
            const relPadV = 4 * scale;
            const relHeight = relFontSize * 16 + relPadV * 2;
            const minDropSize = nodeSize * 0.7;
            const isHovered = hoveredEdgeDrop === i;

            // For images: square centered on midpoint, matching SVG image size
            if (displayImage) {
              const imgSize = Math.max(nodeSize * 0.4, minDropSize);
              return (
                <div
                  key={`edge-drop-${i}`}
                  draggable={hasPlacedRelation}
                  onDragStart={hasPlacedRelation ? (e) => handleEdgeRelationDragStart(e, i) : undefined}
                  onDragOver={(e) => { handleDragOver(e); setHoveredEdgeDrop(i); }}
                  onDragLeave={() => setHoveredEdgeDrop(null)}
                  onDrop={(e) => { handleEdgeDrop(e, i); setHoveredEdgeDrop(null); }}
                  style={{
                    position: "absolute",
                    left: midX - imgSize / 2,
                    top: midY - imgSize / 2,
                    width: imgSize,
                    height: imgSize,
                    borderRadius: dropRounded || `${6 * scale}px`,
                    border: `${strokeWidth}px ${hasPlacedRelation ? "solid" : "dashed"} ${isHovered ? (isDark ? "#4ade80" : "#22c55e") : dropBorderColor}`,
                    background: bgColor,
                    boxShadow: isHovered ? `0 0 ${8 * scale}px ${isDark ? "rgba(74,222,128,0.3)" : "rgba(34,197,94,0.25)"}` : "none",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: hasPlacedRelation ? "grab" : "default",
                    userSelect: "none",
                    zIndex: 5,
                    transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
                  }}
                >
                  <img
                    src={displayImage}
                    alt={displayLabel}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    draggable={false}
                  />
                </div>
              );
            }

            // For text: match SVG label word-wrap dimensions, centered on midpoint
            const x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y;
            const edgeLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            const isArrow = edge.type === "solid-arrow" || edge.type === "dashed-arrow";
            const markerSize = 6 * scale;
            const arrowMargin = isArrow ? markerSize : 0;
            const maxWidth = Math.max(0, edgeLen - arrowMargin * 2);
            const labelFontSize = fontSize * 0.85;
            const charWidth = labelFontSize * 16 * 0.55;
            const charsPerLine = Math.max(1, Math.floor(maxWidth / charWidth));
            const words = (displayLabel || "").split(' ');
            const lines: string[] = [];
            let current = '';
            for (const word of words) {
              const test = current ? current + ' ' + word : word;
              if (test.length <= charsPerLine) {
                current = test;
              } else {
                if (current) lines.push(current);
                current = word;
              }
            }
            if (current) lines.push(current);
            const lineHeight = labelFontSize * 16 * 1.2;
            const totalHeight = lines.length * lineHeight;
            // Width: widest line
            const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b, "");
            const textWidth = longestLine.length * charWidth;
            const pad = 12 * scale;
            const dropW = Math.max(textWidth + pad * 2, minDropSize);
            const dropH = Math.max(totalHeight + pad, relHeight);

            return (
              <div
                key={`edge-drop-${i}`}
                draggable={hasPlacedRelation}
                onDragStart={hasPlacedRelation ? (e) => handleEdgeRelationDragStart(e, i) : undefined}
                onDragOver={(e) => { handleDragOver(e); setHoveredEdgeDrop(i); }}
                onDragLeave={() => setHoveredEdgeDrop(null)}
                onDrop={(e) => { handleEdgeDrop(e, i); setHoveredEdgeDrop(null); }}
                style={{
                  position: "absolute",
                  left: midX - dropW / 2,
                  top: midY - dropH / 2,
                  width: dropW,
                  height: dropH,
                  borderRadius: dropRounded || `${6 * scale}px`,
                  border: `${strokeWidth}px ${hasPlacedRelation ? "solid" : "dashed"} ${isHovered ? (isDark ? "#4ade80" : "#22c55e") : dropBorderColor}`,
                  background: bgColor,
                  boxShadow: isHovered ? `0 0 ${8 * scale}px ${isDark ? "rgba(74,222,128,0.3)" : "rgba(34,197,94,0.25)"}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: hasPlacedRelation ? "grab" : "default",
                  userSelect: "none",
                  zIndex: 5,
                  transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
                }}
              >
                <span
                  style={{
                    color: relColor || nodeTextColor,
                    fontSize: `${labelFontSize}rem`,
                    textAlign: "center",
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: lines.length <= 1 ? "nowrap" : "normal",
                  }}
                >
                  {displayLabel}
                </span>
              </div>
            );
          })}

          {/* Draggable overlays on placed relation labels — drag off to return to tray */}
          {hasRelations && resolvedEdges.map((edge, i) => {
            if (placedRelations[i] === undefined) return null;
            if (isDraggingRelation) return null;
            const from = positions[edge.fromKey];
            const to = positions[edge.toKey];
            if (!from || !to) return null;

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const hitSize = nodeSize * 0.6;

            return (
              <div
                key={`rel-drag-${i}`}
                draggable
                onDragStart={(e) => handleEdgeRelationDragStart(e, i)}
                onDrag={handleEdgeRelationDrag}
                onDragEnd={handleEdgeRelationDragEnd}
                style={{
                  position: "absolute",
                  left: midX - hitSize / 2,
                  top: midY - hitSize / 2,
                  width: hitSize,
                  height: hitSize,
                  cursor: "grab",
                  zIndex: 6,
                  background: "transparent",
                }}
              />
            );
          })}

          {/* DOM nodes */}
          {allEntries.map(({ key, data }) => {
            const pos = positions[key];
            if (!pos) return null;

            const assessBg = getEntryBackground(key, data);
            const displayText = getDisplayText(key, data);
            const displayImage = getDisplayImage(key, data);
            const hasPlacedItem = hasItems && placedItems[key] !== undefined;
            // Only allow repositioning if the node is empty (no placed item)
            const canReposition = !hasItems || !hasPlacedItem;

            // Per-node styling
            const nw = data.w ? twSpacingToPx(data.w) * scale : nodeSize;
            const nh = data.h ? twSpacingToPx(data.h) * scale : nodeSize;
            const nodeRounded = data.rounded ? twRoundedToCss(data.rounded) : twRoundedToCss("md");
            const nodeBg = data.bg ? twColorToHex(data.bg) : nodeBackground;
            const nodeColor = data.color ? twColorToHex(data.color) : nodeTextColor;
            const nodeBorder = data.border ? twColorToHex(data.border) : borderColor;
            // Assessment colors override custom bg when active
            const bg = assessBg !== nodeBackground ? assessBg : nodeBg;

            return (
              <div
                key={key}
                draggable={hasPlacedItem}
                onDragStart={hasPlacedItem ? (e) => handleNodeDragStart(e, key) : undefined}
                onPointerDown={canReposition ? (e) => handlePointerDown(e, key) : undefined}
                onDragOver={hasItems ? handleDragOver : undefined}
                onDrop={hasItems ? (e) => handleDrop(e, key) : undefined}
                style={{
                  position: "absolute",
                  left: pos.x - nw / 2,
                  top: pos.y - nh / 2,
                  width: nw,
                  height: nh,
                  borderRadius: nodeRounded,
                  border: `${strokeWidth}px solid ${nodeBorder}`,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: hasPlacedItem ? "grab" : (canReposition ? "grab" : "default"),
                  userSelect: "none",
                  zIndex: 10,
                  padding: displayImage ? 0 : `${4 * scale}px`,
                  overflow: "hidden",
                }}
              >
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayText}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    draggable={false}
                  />
                ) : (
                  <span
                    style={{
                      color: nodeColor,
                      fontSize: `${fontSize}rem`,
                      textAlign: "center",
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {displayText}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {tray}
      </div>
      {relationsTray}
      </div>
    </div>
  );
}
