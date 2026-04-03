
import { performance } from 'perf_hooks';

export type NodeType = "source" | "amplifier" | "risk" | "outcome";

export interface SignalNode {
  id: string;
  label: string;
  type: NodeType;
  strength: number;
  data?: Record<string, unknown>;
  x?: number;
  y?: number;
}

const NODE_W = 140;
const NODE_H = 56;

// Original implementation
function getEdgePathOriginal(
  nodes: SignalNode[],
  from: string,
  to: string
): { d: string; midX: number; midY: number } | null {
  const src = nodes.find((n) => n.id === from);
  const dst = nodes.find((n) => n.id === to);
  if (!src || !dst) return null;

  const x1 = (src.x ?? 0) + NODE_W;
  const y1 = (src.y ?? 0) + NODE_H / 2;
  const x2 = dst.x ?? 0;
  const y2 = (dst.y ?? 0) + NODE_H / 2;

  const cx1 = x1 + Math.abs(x2 - x1) * 0.45;
  const cx2 = x2 - Math.abs(x2 - x1) * 0.45;

  return {
    d: `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`,
    midX: (x1 + x2) / 2,
    midY: (y1 + y2) / 2,
  };
}

// Optimized implementation (using a Map)
function getEdgePathOptimized(
  nodeMap: Map<string, SignalNode>,
  from: string,
  to: string
): { d: string; midX: number; midY: number } | null {
  const src = nodeMap.get(from);
  const dst = nodeMap.get(to);
  if (!src || !dst) return null;

  const x1 = (src.x ?? 0) + NODE_W;
  const y1 = (src.y ?? 0) + NODE_H / 2;
  const x2 = dst.x ?? 0;
  const y2 = (dst.y ?? 0) + NODE_H / 2;

  const cx1 = x1 + Math.abs(x2 - x1) * 0.45;
  const cx2 = x2 - Math.abs(x2 - x1) * 0.45;

  return {
    d: `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`,
    midX: (x1 + x2) / 2,
    midY: (y1 + y2) / 2,
  };
}

function runBenchmark(nodeCount: number, edgeCount: number) {
  const nodes: SignalNode[] = Array.from({ length: nodeCount }, (_, i) => ({
    id: `node-${i}`,
    label: `Node ${i}`,
    type: 'source',
    strength: Math.random(),
    x: Math.random() * 1000,
    y: Math.random() * 1000,
  }));

  const edges = Array.from({ length: edgeCount }, (_, i) => ({
    source: `node-${Math.floor(Math.random() * nodeCount)}`,
    target: `node-${Math.floor(Math.random() * nodeCount)}`,
  }));

  console.log(`Benchmarking with ${nodeCount} nodes and ${edgeCount} edges...`);

  // Original
  const startOriginal = performance.now();
  for (const edge of edges) {
    getEdgePathOriginal(nodes, edge.source, edge.target);
  }
  const endOriginal = performance.now();
  const timeOriginal = endOriginal - startOriginal;

  // Optimized (including Map creation time)
  const startOptimized = performance.now();
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  for (const edge of edges) {
    getEdgePathOptimized(nodeMap, edge.source, edge.target);
  }
  const endOptimized = performance.now();
  const timeOptimized = endOptimized - startOptimized;

  console.log(`Original implementation: ${timeOriginal.toFixed(4)}ms`);
  console.log(`Optimized implementation: ${timeOptimized.toFixed(4)}ms`);
  console.log(`Improvement: ${((timeOriginal - timeOptimized) / timeOriginal * 100).toFixed(2)}%`);
  console.log('---');

  return { timeOriginal, timeOptimized };
}

runBenchmark(10, 10);
runBenchmark(100, 100);
runBenchmark(1000, 1000);
runBenchmark(5000, 5000);
