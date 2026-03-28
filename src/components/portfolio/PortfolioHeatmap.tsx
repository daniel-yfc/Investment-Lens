/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  costBasis: number;
  changePercent: number; // Daily change
  returnPercent: number; // Total return
}

interface PortfolioHeatmapProps {
  holdings: PortfolioHolding[];
  metric?: 'changePercent' | 'returnPercent';
  className?: string;
}

// Custom Treemap Content to render boxes with colors based on performance
const CustomizedContent = (props: any) => {
  const { depth, x, y, width, height, name, changePercent, returnPercent, metric } = props;

  // Render root container differently if needed
  if (depth === 0) return null;

  const currentMetric = metric === 'changePercent' ? changePercent : returnPercent;

  // Determine color based on performance metric
  let fillColor = '#64748b'; // Neutral slate

  if (currentMetric > 3) fillColor = '#10b981'; // Strong Green
  else if (currentMetric > 0) fillColor = '#34d399'; // Light Green
  else if (currentMetric < -3) fillColor = '#ef4444'; // Strong Red
  else if (currentMetric < 0) fillColor = '#f87171'; // Light Red

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth={2}
        className="transition-all hover:opacity-80 cursor-pointer"
      />
      {width > 50 && height > 30 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 5}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            fontWeight="bold"
            className="pointer-events-none"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 15}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            className="pointer-events-none opacity-90"
          >
            {currentMetric > 0 ? '+' : ''}{currentMetric.toFixed(2)}%
          </text>
        </>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload, metric }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const currentMetric = metric === 'changePercent' ? data.changePercent : data.returnPercent;
    const isPositive = currentMetric >= 0;

    return (
      <div className="bg-popover text-popover-foreground border rounded-lg shadow-md p-3 text-sm">
        <div className="font-bold mb-1">{data.name}</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span className="text-muted-foreground">市值:</span>
          <span className="font-medium">${data.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          <span className="text-muted-foreground">佔比:</span>
          <span className="font-medium">{((data.value / data.totalValue) * 100).toFixed(1)}%</span>
          <span className="text-muted-foreground">{metric === 'changePercent' ? '日漲跌:' : '總報酬:'}</span>
          <span className={cn("font-medium", isPositive ? "text-emerald-500" : "text-rose-500")}>
            {isPositive ? '+' : ''}{currentMetric.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function PortfolioHeatmap({ holdings, metric = 'changePercent', className }: PortfolioHeatmapProps) {
  const data = useMemo(() => {
    if (!holdings || holdings.length === 0) return [];

    const totalValue = holdings.reduce((sum, h) => sum + (h.shares * h.price), 0);

    // Treemap requires a specific data structure
    return [{
      name: 'Portfolio',
      children: holdings.map(h => ({
        name: h.symbol,
        value: h.shares * h.price,
        totalValue,
        changePercent: h.changePercent,
        returnPercent: h.returnPercent,
        metric // Pass down the selected metric for rendering
      })).sort((a, b) => b.value - a.value) // Sort by size
    }];
  }, [holdings, metric]);

  if (!holdings || holdings.length === 0) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/20 border rounded-xl text-muted-foreground", className)}>
        暫無持倉數據
      </div>
    );
  }

  return (
    <div className={cn("w-full h-[400px] border rounded-xl overflow-hidden bg-background", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="value"
          aspectRatio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
          isAnimationActive={false} // Turn off animation for better performance with many items (PE-04)
          content={(props) => <CustomizedContent {...props} metric={metric} />}
        >
          <Tooltip content={(props: any) => <CustomTooltip {...props} metric={metric} />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}
