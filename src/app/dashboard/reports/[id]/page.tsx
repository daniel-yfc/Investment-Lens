"use client";

import { use } from "react";
import { ReportReader, type ReportMeta, type ReportSection } from "@/components/generative/ReportReader";

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{children}</p>
);

const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed my-1">
    {children}
  </div>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-start rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{value}</span>
    <span className="text-xs text-slate-400 font-mono mt-0.5">{label}</span>
  </div>
);

// Mock data
const REPORT_META: ReportMeta = {
  title: "State of Frontend Engineering 2026",
  subtitle: "An annual survey of tooling, practices, and emerging trends across 4,200 engineers.",
  author: "A. Nguyen",
  date: "March 2026",
  readTime: "12 min",
  tags: ["Engineering", "Survey"],
};

const REPORT_SECTIONS: ReportSection[] = [
  {
    id: "executive-summary",
    title: "Executive Summary",
    level: 1,
    content: (
      <>
        <P>Frontend engineering is undergoing its fastest period of change since the React revolution in 2015. This report synthesizes responses from 4,200 engineers across 92 countries, capturing how the discipline is evolving in 2026.</P>
        <Callout>
          <strong>Key finding:</strong> 78% of teams have adopted AI-assisted coding workflows, up from 31% in 2024. TypeScript adoption has stabilized at 91% while the App Router pattern has overtaken Pages Router.
        </Callout>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 not-prose">
          <Stat value="91%" label="TypeScript adoption" />
          <Stat value="78%" label="AI coding tools" />
          <Stat value="4,200" label="Respondents" />
        </div>
      </>
    ),
  },
  {
    id: "tooling",
    title: "Tooling Landscape",
    level: 1,
    content: (
      <P>The tooling landscape in 2026 is dominated by Turbopack and Vite at the bundler level, with esbuild continuing to serve as the backbone of many pipelines. Biome has made significant inroads as an all-in-one formatter and linter, replacing the ESLint + Prettier combination for 34% of surveyed projects.</P>
    ),
  },
  {
    id: "bundlers",
    title: "Bundlers & Runtimes",
    level: 2,
    content: (
      <>
        <P>Turbopack shipped its stable 1.0 release in late 2025 and is now the default in Next.js 16, leading to adoption spikes across the ecosystem. Bun continues its rapid growth as both a runtime and package manager, with 44% of new projects using it as their primary package manager.</P>
        <Callout>Bun&apos;s install speed benchmarks at 15× faster than npm on cold caches in our testing environment.</Callout>
      </>
    ),
  },
];

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="p-6 h-[calc(100vh-theme(spacing.16))]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Report: {resolvedParams.id}</h1>
      </div>
      <ReportReader meta={REPORT_META} sections={REPORT_SECTIONS} className="h-[calc(100%-4rem)]" />
    </div>
  );
}
