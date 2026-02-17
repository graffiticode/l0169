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

const NODE_SIZE = 90;
const PADDING = 20;

function computePositions(
  nodes: ConceptNode[],
  edges: ConceptEdge[],
  width: number,
  height: number
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
  const radius = Math.min(cx - NODE_SIZE / 2 - PADDING, cy - NODE_SIZE / 2 - PADDING);
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

  // Measure container and compute initial positions
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const height = width;
      setSize({ width, height });
      setPositions(prev => {
        // Only compute if no positions yet (don't override dragged positions)
        if (Object.keys(prev).length > 0) return prev;
        return computePositions(nodes, edges, width, height);
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [nodes, edges]);

  // Recompute positions when size first becomes available
  useEffect(() => {
    if (size.width > 0 && Object.keys(positions).length === 0) {
      setPositions(computePositions(nodes, edges, size.width, size.height));
    }
  }, [size, nodes, edges, positions]);

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
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill={edgeColor} />
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
              const r = NODE_SIZE / 2;

              const x1 = from.x + nx * r;
              const y1 = from.y + ny * r;
              const x2 = to.x - nx * r;
              const y2 = to.y - ny * r;

              const isDashed = edge.type === "dashed" || edge.type === "dashed-arrow";
              const isArrow = edge.type === "solid-arrow" || edge.type === "dashed-arrow";

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={edgeColor}
                  strokeWidth={2}
                  strokeDasharray={isDashed ? "6 4" : undefined}
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
                left: pos.x - NODE_SIZE / 2,
                top: pos.y - NODE_SIZE / 2,
                width: NODE_SIZE,
                height: NODE_SIZE,
                borderRadius: "50%",
                border: `2px solid ${borderColor}`,
                background: nodeBackground,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "grab",
                userSelect: "none",
                zIndex: 10,
                padding: "4px",
              }}
            >
              <span
                style={{
                  color: nodeTextColor,
                  fontSize: "0.8rem",
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
