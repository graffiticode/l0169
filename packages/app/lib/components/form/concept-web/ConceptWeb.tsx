import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

interface AssessConfig {
  method: string;
  expected: string;
}

interface ConceptConnection {
  value?: string;
  text: string;
  image?: string;
  assess?: AssessConfig;
}

interface ConceptEdge {
  from: string | string[];
  to: string | string[];
  type?: string;
  text?: string;
  image?: string;
}

interface TrayItem {
  value?: string;
  text?: string;
  image?: string;
}

interface ConceptWebData {
  topic?: string;
  instructions?: string;
  anchor?: ConceptConnection;
  connections: ConceptConnection[];
  edges: ConceptEdge[];
  concepts?: TrayItem[];
  trayAlign?: string;
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
): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};

  const cx = width / 2;
  const cy = height / 2;

  // Place anchor at center
  if (anchor) {
    positions["anchor"] = { x: cx, y: cy };
  }

  // Arrange connections radially
  if (connections.length > 0) {
    const radius = Math.min(cx - nodeSize / 2 - padding, cy - nodeSize / 2 - padding);
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
          resolved.push({ fromKey: fk, toKey: tk, type, text: edge.text, image: edge.image });
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
  const { topic, instructions, anchor, connections, edges, concepts: items = [], trayAlign } = conceptWeb;
  const isDark = theme === "DARK";
  const hasItems = items.length > 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [positions, setPositions] = useState<Record<string, NodePosition>>({});
  const dragging = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  // Track which items have been placed on which nodes (node key → item index)
  const [placedItems, setPlacedItems] = useState<Record<string, number>>({});
  // Track item index currently being dragged off a node
  const [draggingItemIndex, setDraggingItemIndex] = useState<number | null>(null);

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
      setPositions(computePositions(anchor, connections, width, height, ns, pd));
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
  }, []);

  const createDragBadge = useCallback((item: TrayItem, itemIndex: number, sz: number) => {
    const preloaded = preloadedImages.current[itemIndex];
    if (item.image && preloaded && preloaded.complete) {
      // Use canvas for images — renders synchronously for drag snapshot
      const dpr = window.devicePixelRatio || 1;
      const canvas = document.createElement("canvas");
      canvas.width = sz * dpr;
      canvas.height = sz * dpr;
      canvas.style.cssText = `width: ${sz}px; height: ${sz}px; position: fixed; top: -1000px; left: -1000px;`;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      // Draw circular background
      const bg = isDark ? "#1e3a5f" : "#dbeafe";
      ctx.beginPath();
      ctx.arc(sz / 2, sz / 2, sz / 2, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();
      // Clip and draw image centered
      ctx.save();
      const imgSz = sz * 0.75;
      const offset = (sz - imgSz) / 2;
      ctx.beginPath();
      ctx.arc(sz / 2, sz / 2, imgSz / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(preloaded, offset, offset, imgSz, imgSz);
      ctx.restore();
      return canvas;
    }
    // Fallback: text badge
    const badge = document.createElement("div");
    badge.style.cssText = `
      display: flex; align-items: center; justify-content: center;
      width: ${sz}px; height: ${sz}px; border-radius: 50%; box-sizing: border-box;
      padding: ${4 * scale}px;
      background: ${isDark ? "#1e3a5f" : "#dbeafe"}; color: ${isDark ? "#bfdbfe" : "#1e40af"};
      position: fixed; top: -1000px; left: -1000px; overflow: hidden;
    `;
    const span = document.createElement("span");
    span.textContent = item.text || item.value || "";
    span.style.cssText = `
      font-size: ${fontSize}rem; font-weight: 500; text-align: center;
      line-height: 1.2; overflow: hidden; overflow-wrap: break-word;
      max-width: ${sz * 0.7}px;
    `;
    badge.appendChild(span);
    return badge;
  }, [isDark, fontSize, scale]);

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

  // Resolve value-based edges to position-key-based edges
  const resolvedEdges = resolveEdges(edges || [], anchor, connections);

  const borderColor = isDark ? "#71717a" : "#a1a1aa";
  const nodeBackground = isDark ? "#27272a" : "#ffffff";
  const nodeTextColor = isDark ? "#e4e4e7" : "#18181b";
  const edgeColor = isDark ? "#71717a" : "#a1a1aa";
  const edgeLabelColor = isDark ? "#a1a1aa" : "#52525b";
  const edgeLabelBg = isDark ? "#27272a" : "#ffffff";
  const topicColor = isDark ? "#e4e4e7" : "#18181b";

  const markerSize = 10 * scale;

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

  // Assessment scoring — anchor and connections scored independently
  const getEntryBackground = (key: string, data: ConceptConnection): string => {
    if (!data.assess) return nodeBackground;

    if (data.assess.method === "value") {
      const isAnchor = key === "anchor";

      // Partition entries into anchor vs connection groups
      const groupEntries = allEntries.filter(e =>
        isAnchor ? e.key === "anchor" : e.key !== "anchor"
      );

      // Collect expected values within this group
      const expectedValues = groupEntries
        .filter(e => e.data.assess?.expected)
        .map(e => e.data.assess!.expected);

      // Collect placed values within this group
      const placedValues: { key: string; value: string }[] = [];
      for (const entry of groupEntries) {
        if (hasItems && placedItems[entry.key] !== undefined) {
          const item = items[placedItems[entry.key]];
          placedValues.push({ key: entry.key, value: item?.value || "" });
        } else if (!hasItems) {
          placedValues.push({ key: entry.key, value: entry.data.value || "" });
        }
      }

      // Greedy bipartite matching within the group (track by index so
      // duplicate expected values each match independently)
      const claimed = new Set<number>();
      const correctKeys = new Set<string>();

      for (const pv of placedValues) {
        for (let i = 0; i < expectedValues.length; i++) {
          if (!claimed.has(i) && pv.value === expectedValues[i]) {
            claimed.add(i);
            correctKeys.add(pv.key);
            break;
          }
        }
      }

      if (correctKeys.has(key)) {
        return isDark ? "#14532d" : "#dcfce7";
      }

      // Only show error color if an item has been placed (or if not using items tray)
      if (!hasItems || placedItems[key] !== undefined) {
        return isDark ? "#7f1d1d" : "#fee2e2";
      }
    }

    return nodeBackground;
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
        return (
          <div
            key={index}
            draggable={!isPlaced}
            onDragStart={(e) => handleTrayDragStart(e, index, item)}
            className={`inline-flex items-center justify-center rounded-full font-medium cursor-grab select-none ${
              isPlaced
                ? (isDark
                    ? "bg-zinc-700 text-zinc-500 cursor-default opacity-50"
                    : "bg-gray-200 text-gray-400 cursor-default opacity-50")
                : (isDark
                    ? "bg-blue-900 text-blue-200"
                    : "bg-blue-100 text-blue-800")
            }`}
            style={{
              width: nodeSize * 0.75,
              height: nodeSize * 0.75,
              fontSize: `${fontSize * 0.75}rem`,
              padding: `${3 * scale}px`,
            }}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.text || item.value || ""}
                style={{
                  width: nodeSize * 0.75 * 0.75,
                  height: nodeSize * 0.75 * 0.75,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                draggable={false}
              />
            ) : null}
            {!item.image && (item.text || item.value) && (
              <span
                style={{
                  color: isDark ? "#bfdbfe" : "#1e40af",
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
        style={{ flexDirection: outerFlexDir as any }}
        onDragOver={hasItems ? handleDragOver : undefined}
        onDrop={hasItems ? handleContainerDrop : undefined}
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

                // Circle radius
                const r = nodeSize / 2;

                const x1 = from.x + nx * r;
                const y1 = from.y + ny * r;
                const x2 = to.x - nx * r;
                const y2 = to.y - ny * r;

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
                    {edge.image && (
                      <image
                        href={edge.image}
                        x={midX - nodeSize * 0.2}
                        y={midY - nodeSize * 0.2}
                        width={nodeSize * 0.4}
                        height={nodeSize * 0.4}
                      />
                    )}
                    {edge.text && !edge.image && (
                      <text
                        x={midX}
                        y={midY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={edgeLabelColor}
                        fontSize={`${fontSize * 0.75}rem`}
                        paintOrder="stroke"
                        stroke={edgeLabelBg}
                        strokeWidth={3 * scale}
                        strokeLinejoin="round"
                      >
                        {edge.text}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          )}

          {/* DOM nodes */}
          {allEntries.map(({ key, data }) => {
            const pos = positions[key];
            if (!pos) return null;

            const bg = getEntryBackground(key, data);
            const displayText = getDisplayText(key, data);
            const displayImage = getDisplayImage(key, data);
            const hasPlacedItem = hasItems && placedItems[key] !== undefined;
            // Only allow repositioning if the node is empty (no placed item)
            const canReposition = !hasItems || !hasPlacedItem;

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
                  left: pos.x - nodeSize / 2,
                  top: pos.y - nodeSize / 2,
                  width: nodeSize,
                  height: nodeSize,
                  borderRadius: "50%",
                  border: `${strokeWidth}px solid ${borderColor}`,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: hasPlacedItem ? "grab" : (canReposition ? "grab" : "default"),
                  userSelect: "none",
                  zIndex: 10,
                  padding: `${4 * scale}px`,
                }}
              >
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayText}
                    style={{
                      maxWidth: nodeSize * 0.7,
                      maxHeight: nodeSize * 0.7,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    draggable={false}
                  />
                ) : (
                  <span
                    style={{
                      color: nodeTextColor,
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
    </div>
  );
}
