'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowDown, Activity, Settings, TrendingUp, AlertTriangle, FileText, Loader2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SignalChainGraphProps, SignalNode, SignalNodeStatus } from '@/types/quant.types'

const TypeIcon = ({ type, className }: { type: SignalNode['type'], className?: string }) => {
  switch (type) {
    case 'lens': return <Activity className={className} />
    case 'quant': return <Settings className={className} />
    case 'optimization': return <TrendingUp className={className} />
    case 'var': return <AlertTriangle className={className} />
    case 'report': return <FileText className={className} />
    default: return <Settings className={className} />
  }
}

const StatusIndicator = ({ status }: { status: SignalNodeStatus }) => {
  switch (status) {
    case 'running':
      return <Loader2 className="w-3 h-3 animate-spin text-brand" />
    case 'done':
      return <Check className="w-3 h-3 text-emerald-500" />
    case 'error':
      return <X className="w-3 h-3 text-rose-500" />
    case 'pending':
    default:
      return <div className="w-2 h-2 rounded-full border border-zinc-500" />
  }
}

export function SignalChainGraph({ nodes, edges, className, direction = 'horizontal' }: SignalChainGraphProps) {
  const isHorizontal = direction === 'horizontal'



  // To build a visual representation without a complex graph library,
  // we'll layout the nodes sequentially based on the edges (assuming a mostly linear or simple DAG chain).
  // This is a simplified linear representation for the specified P4 milestone visualizer.

  const sortedNodes = React.useMemo(() => {
    // Basic topological sort or simply follow the edges if linear.
    // For this simple chain, we assume the array order is mostly correct,
    // or we just find the root and traverse.

    if (edges.length === 0) return nodes

    const inDegree: Record<string, number> = {}
    nodes.forEach(n => { inDegree[n.id] = 0 })
    edges.forEach(e => {
       if (inDegree[e.target] !== undefined) {
           inDegree[e.target] += 1
       }
    })

    const startNodes = nodes.filter(n => inDegree[n.id] === 0)
    const result: SignalNode[] = []
    const visited: Set<string> = new Set()

    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return
      visited.add(nodeId)

      const node = nodes.find(n => n.id === nodeId)
      if (node) result.push(node)

      const outgoingEdges = edges.filter(e => e.source === nodeId)
      // Sort outgoing if needed, but here we just append
      for (const edge of outgoingEdges) {
        visit(edge.target)
      }
    }

    startNodes.forEach(n => visit(n.id))

    // Add any unconnected nodes at the end
    nodes.forEach(n => {
      if (!visited.has(n.id)) {
        result.push(n)
      }
    })

    return result
  }, [nodes, edges])

  return (
    <div className={cn("p-6 rounded-xl border border-zinc-800 bg-zinc-950/50 shadow-sm overflow-hidden", className)}>
      <div className="mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-brand" />
        <h3 className="text-lg font-semibold text-zinc-100">信號鏈分析 (Signal Chain)</h3>
      </div>

      <div className={cn(
        "flex",
        isHorizontal ? "flex-row items-center gap-2 overflow-x-auto pb-4" : "flex-col items-start gap-2"
      )}>
        <AnimatePresence>
          {sortedNodes.map((node, index) => {
            const isLast = index === sortedNodes.length - 1
            const outgoingEdge = edges.find(e => e.source === node.id)

            return (
              <React.Fragment key={node.id}>
                {/* Node */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={cn(
                    "flex flex-col min-w-[160px] p-4 rounded-lg border shadow-sm transition-all",
                    node.status === 'running' ? "border-brand/50 bg-brand/5 shadow-[0_0_15px_rgba(var(--brand-rgb),0.1)]" :
                    node.status === 'done' ? "border-emerald-500/20 bg-emerald-500/5" :
                    node.status === 'error' ? "border-rose-500/20 bg-rose-500/5" :
                    "border-zinc-800 bg-zinc-900/50 opacity-70"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={cn(
                      "p-1.5 rounded-md",
                      node.status === 'running' ? "bg-brand/20 text-brand" :
                      node.status === 'done' ? "bg-emerald-500/20 text-emerald-500" :
                      node.status === 'error' ? "bg-rose-500/20 text-rose-500" :
                      "bg-zinc-800 text-zinc-400"
                    )}>
                      <TypeIcon type={node.type} className="w-4 h-4" />
                    </div>
                    <StatusIndicator status={node.status} />
                  </div>

                  <div className="font-semibold text-sm text-zinc-100 mb-1">{node.label}</div>
                  {node.description && (
                    <div className="text-xs text-zinc-500 line-clamp-2" title={node.description}>
                      {node.description}
                    </div>
                  )}

                  {/* Additional Data Display */}
                  {node.data && Object.keys(node.data).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-col gap-1">
                      {Object.entries(node.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500 capitalize">{key}</span>
                          <span className="font-mono text-zinc-300">
                            {typeof value === 'number' ?
                              (key.toLowerCase().includes('var') || key.toLowerCase().includes('cvar') || key.toLowerCase().includes('drawdown') ?
                                `${(value * 100).toFixed(2)}%` : value.toFixed(4)
                              ) :
                              String(value)
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Edge/Connector */}
                {!isLast && (
                  <div className={cn(
                    "flex items-center justify-center",
                    isHorizontal ? "w-8 h-full" : "h-8 w-full"
                  )}>
                    {isHorizontal ? (
                      <ArrowRight className={cn(
                        "w-4 h-4",
                        outgoingEdge?.animated ? "text-brand animate-pulse" : "text-zinc-700"
                      )} />
                    ) : (
                      <ArrowDown className={cn(
                        "w-4 h-4",
                        outgoingEdge?.animated ? "text-brand animate-pulse" : "text-zinc-700"
                      )} />
                    )}
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
