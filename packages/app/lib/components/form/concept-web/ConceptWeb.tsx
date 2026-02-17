import React, { useState, useCallback, useRef, useEffect } from "react";

interface AssessConfig {
  method: string;
  expected: string;
}

interface ConceptNode {
  id: string;
  text: string;
  assess?: AssessConfig;
}

interface ConceptEdge {
  from: string;
  to: string;
  type: string;
}

interface ConceptWebData {
  topic?: string;
  nodes: ConceptNode[];
  edges: ConceptEdge[];
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
  nodes: ConceptNode[],
  edges: ConceptEdge[],
  width: number,
  height: number,
  nodeSize: number,
  padding: number,
): Record<string, NodePosition> {
  const positions: Record<string, NodePosition> = {};
  if (nodes.length === 0) return positions;

  // Find hub: node with most outgoing edges
  const outCount: Record<string, number> = {};
  for (const n of nodes) outCount[n.id] = 0;
  for (const e of edges) {
    outCount[e.from] = (outCount[e.from] || 0) + 1;
  }

  let hubId = nodes[0].id;
  let maxOut = 0;
  for (const n of nodes) {
    if ((outCount[n.id] || 0) > maxOut) {
      maxOut = outCount[n.id] || 0;
      hubId = n.id;
    }
  }

  const cx = width / 2;
  const cy = height / 2;

  // Hub at center
  positions[hubId] = { x: cx, y: cy };

  // Others radially around it
  const others = nodes.filter(n => n.id !== hubId);
  const radius = Math.min(cx - nodeSize / 2 - padding, cy - nodeSize / 2 - padding);
  others.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / others.length - Math.PI / 2;
    positions[n.id] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  return positions;
}

export function ConceptWeb({ conceptWeb, theme }: ConceptWebProps) {
  const { topic, nodes, edges } = conceptWeb;
  const isDark = theme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [positions, setPositions] = useState<Record<string, NodePosition>>({});
  const dragging = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  // Scale factor relative to reference width
  const scale = size.width > 0 ? size.width / REF_WIDTH : 1;
  const nodeSize = BASE_NODE_SIZE * scale;
  const fontSize = BASE_FONT_SIZE * scale;
  const strokeWidth = BASE_STROKE_WIDTH * scale;

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
      setPositions(computePositions(nodes, edges, width, height, ns, pd));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [nodes, edges]);

  const handlePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    const pos = positions[nodeId];
    if (!pos || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    dragging.current = {
      id: nodeId,
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

  const borderColor = isDark ? "#71717a" : "#a1a1aa";
  const nodeBackground = isDark ? "#27272a" : "#ffffff";
  const nodeTextColor = isDark ? "#e4e4e7" : "#18181b";
  const edgeColor = isDark ? "#71717a" : "#a1a1aa";
  const topicColor = isDark ? "#e4e4e7" : "#18181b";

  const markerSize = 10 * scale;

  return (
    <div className="flex flex-col gap-2">
      {topic && (
        <h2
          className="text-lg font-bold text-center"
          style={{ color: topicColor }}
        >
          {topic}
        </h2>
      )}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
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
            {edges.map((edge, i) => {
              const from = positions[edge.from];
              const to = positions[edge.to];
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

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={edgeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isDashed ? `${dashSize} ${gapSize}` : undefined}
                  markerEnd={isArrow ? "url(#arrowhead)" : undefined}
                />
              );
            })}
          </svg>
        )}

        {/* DOM nodes */}
        {nodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;
          return (
            <div
              key={node.id}
              onPointerDown={(e) => handlePointerDown(e, node.id)}
              style={{
                position: "absolute",
                left: pos.x - nodeSize / 2,
                top: pos.y - nodeSize / 2,
                width: nodeSize,
                height: nodeSize,
                borderRadius: "50%",
                border: `${strokeWidth}px solid ${borderColor}`,
                background: nodeBackground,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "grab",
                userSelect: "none",
                zIndex: 10,
                padding: `${4 * scale}px`,
              }}
            >
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
                {node.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
