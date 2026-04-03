const fs = require('fs');

const file = 'src/components/generative/SignalChainGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add useMemo
content = content.replace(
    'import { useState, useRef, useEffect, useCallback } from "react";',
    'import { useState, useRef, useEffect, useCallback, useMemo } from "react";'
);

// 2. Add nodesMap
content = content.replace(
    '  const [selected, setSelected] = useState<string | null>(null);',
    `  const nodesMap = useMemo(() => {
    return new Map(nodes.map(n => [n.id, n]));
  }, [nodes]);

  const [selected, setSelected] = useState<string | null>(null);`
);

// 3. Add DOM Refs
content = content.replace(
    '  const viewW = 820;',
    `  // Refs for direct DOM manipulation during drag to avoid O(N) react renders
  const nodeGroupRefs = useRef<Map<string, SVGGElement>>(new Map());
  const edgePathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const edgeLabelRefs = useRef<Map<string, SVGTextElement>>(new Map());
  // Store latest node positions to calculate edge paths during drag
  const positionsRef = useRef<Map<string, {x: number, y: number}>>(new Map());

  const viewW = 820;`
);

// 4. Update handleMouseDown
content = content.replace(
    '      setDragging(id);\n    },\n    [nodes, readonly, viewW, viewH]\n  );',
    `      setDragging(id);

      // Initialize position tracking on drag start
      nodes.forEach(n => {
        positionsRef.current.set(n.id, { x: n.x ?? 0, y: n.y ?? 0 });
      });
    },
    [nodes, readonly, viewW, viewH]
  );`
);

// 5. Update handleMouseMove
content = content.replace(
    /const handleMouseMove = useCallback\([\s\S]*?\[dragging, dragOffset, readonly, viewW, viewH\]\n  \);/,
    `const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !svgRef.current || readonly) return;
      const svgRect = svgRef.current.getBoundingClientRect();
      const nx = Math.max(0, Math.min(viewW - NODE_W, (e.clientX - svgRect.left) * (viewW / svgRect.width) - dragOffset.x));
      const ny = Math.max(0, Math.min(viewH - NODE_H, (e.clientY - svgRect.top) * (viewH / svgRect.height) - dragOffset.y));

      // Direct DOM update for the dragged node
      const nodeRef = nodeGroupRefs.current.get(dragging);
      if (nodeRef) {
        nodeRef.setAttribute("transform", \`translate(\${nx}, \${ny})\`);
      }

      // Update tracked position for edge calculations
      positionsRef.current.set(dragging, { x: nx, y: ny });

      // Direct DOM update for connected edges
      edges.forEach(edge => {
        if (edge.source === dragging || edge.target === dragging) {
          const srcPos = positionsRef.current.get(edge.source);
          const dstPos = positionsRef.current.get(edge.target);
          if (!srcPos || !dstPos) return;

          const x1 = srcPos.x + NODE_W;
          const y1 = srcPos.y + NODE_H / 2;
          const x2 = dstPos.x;
          const y2 = dstPos.y + NODE_H / 2;

          const cx1 = x1 + Math.abs(x2 - x1) * 0.45;
          const cx2 = x2 - Math.abs(x2 - x1) * 0.45;

          const d = \`M \${x1} \${y1} C \${cx1} \${y1}, \${cx2} \${y2}, \${x2} \${y2}\`;

          const pathRef = edgePathRefs.current.get(edge.id);
          if (pathRef) {
            pathRef.setAttribute("d", d);
          }

          if (edge.label) {
            const labelRef = edgeLabelRefs.current.get(edge.id);
            if (labelRef) {
              labelRef.setAttribute("x", String((x1 + x2) / 2));
              labelRef.setAttribute("y", String((y1 + y2) / 2 - 6));
            }
          }
        }
      });
    },
    [dragging, dragOffset, readonly, viewW, viewH, edges]
  );`
);

// 6. Update handleMouseUp
content = content.replace(
    'const handleMouseUp = useCallback(() => setDragging(null), []);',
    `const handleMouseUp = useCallback(() => {
    if (dragging) {
      const pos = positionsRef.current.get(dragging);
      if (pos) {
        // Apply the final position to state on mouse up
        setNodes((prev) => prev.map((n) => (n.id === dragging ? { ...n, x: pos.x, y: pos.y } : n)));
      }
      setDragging(null);
    }
  }, [dragging]);`
);

// 7. Update Edge SVG path ref
content = content.replace(
    '                <path\n                  d={path.d}',
    `                <path
                  ref={(el) => {
                    if (el) edgePathRefs.current.set(edge.id, el);
                    else edgePathRefs.current.delete(edge.id);
                  }}
                  d={path.d}`
);

// 8. Update Edge Label SVG text ref
content = content.replace(
    '                  <text x={path.midX} y={path.midY - 6} textAnchor="middle" fontSize={9} fill="#a5b4fc" fontFamily="monospace" opacity={0.8}>\n                    {edge.label}',
    `                  <text
                    ref={(el) => {
                      if (el) edgeLabelRefs.current.set(edge.id, el);
                      else edgeLabelRefs.current.delete(edge.id);
                    }}
                    x={path.midX} y={path.midY - 6} textAnchor="middle" fontSize={9} fill="#a5b4fc" fontFamily="monospace" opacity={0.8}
                  >
                    {edge.label}`
);

// 9. Update Node Group SVG g ref
content = content.replace(
    '              <g\n                key={node.id}',
    `              <g
                ref={(el) => {
                  if (el) nodeGroupRefs.current.set(node.id, el);
                  else nodeGroupRefs.current.delete(node.id);
                }}
                key={node.id}`
);

fs.writeFileSync(file, content);
