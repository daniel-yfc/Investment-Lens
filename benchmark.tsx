import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { renderToString } from "react-dom/server";

// Mock types
type NodeType = "source" | "amplifier" | "risk" | "outcome";
interface SignalNode { id: string; label: string; type: NodeType; strength: number; x?: number; y?: number; }
interface SignalEdge { id: string; source: string; target: string; strength?: number; animated?: boolean; label?: string; }

// Generate 1000 nodes for stress testing
const nodes: SignalNode[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `node-${i}`, label: `Node ${i}`, type: "source", strength: 0.5, x: i, y: i
}));
const edges: SignalEdge[] = []; // Ignore edges for basic state update bench

const NODE_W = 140;
const NODE_H = 56;
const viewW = 820;
const viewH = 340;

function TestComponent() {
  const [nodesState, setNodes] = useState(nodes);
  const dragging = "node-500";
  const dragOffset = { x: 10, y: 10 };
  const svgRef = { current: { getBoundingClientRect: () => ({ left: 0, top: 0, width: 820, height: 340 }) } } as any;

  // The original implementation
  const handleMouseMoveOriginal = (e: any) => {
    if (!dragging || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const nx = Math.max(0, Math.min(viewW - NODE_W, (e.clientX - svgRect.left) * (viewW / svgRect.width) - dragOffset.x));
    const ny = Math.max(0, Math.min(viewH - NODE_H, (e.clientY - svgRect.top) * (viewH / svgRect.height) - dragOffset.y));
    setNodes((prev) => prev.map((n) => (n.id === dragging ? { ...n, x: nx, y: ny } : n)));
  };

  // We benchmark the pure array map operation instead of full react render cycle to keep it simple
  const benchOriginal = () => {
    let state = nodes;
    const start = performance.now();
    for (let i = 0; i < 1000; i++) { // simulate 1000 mouse move events
       state = state.map((n) => (n.id === dragging ? { ...n, x: 100, y: 100 } : n));
    }
    const end = performance.now();
    return end - start;
  };

  // A more optimized state update might use a Map or direct DOM
  // Here we just benchmark the array creation overhead. Direct DOM avoids state completely.

  return <div data-time={benchOriginal()}/>;
}

// Very simple benchmark
const start = performance.now();
let state = nodes;
for (let i = 0; i < 1000; i++) { // 1000 moves
    state = state.map((n) => (n.id === "node-500" ? { ...n, x: 100, y: 100 } : n));
}
const end = performance.now();
console.log(`Original state map overhead for 1000 moves on 1000 nodes: ${(end - start).toFixed(2)}ms`);

// Test Map access vs array find
const startFind = performance.now();
for (let i = 0; i < 10000; i++) {
  nodes.find(n => n.id === "node-999");
}
const endFind = performance.now();

const map = new Map(nodes.map(n => [n.id, n]));
const startMap = performance.now();
for (let i = 0; i < 10000; i++) {
  map.get("node-999");
}
const endMap = performance.now();

console.log(`Array find (10k times, late element): ${(endFind - startFind).toFixed(2)}ms`);
console.log(`Map get (10k times, late element): ${(endMap - startMap).toFixed(2)}ms`);
