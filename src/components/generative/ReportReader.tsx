"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface ReportSection {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  content: React.ReactNode;
}

export interface ReportMeta {
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  tags?: string[];
  readTime?: string;
}

interface ReportReaderProps {
  meta: ReportMeta;
  sections: ReportSection[];
  className?: string;
}

export function ReportReader({ meta, sections, className = "" }: ReportReaderProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActiveId(topmost.target.id.replace("section-", ""));
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [sections]);

  const progress = sections.findIndex((s) => s.id === activeId) + 1;
  const progressPct = (progress / sections.length) * 100;

  return (
    <div className={cn("flex h-[640px] rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 overflow-hidden shadow-sm", className)}>
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 transition-all duration-200 shrink-0 overflow-hidden",
          sidebarOpen ? "w-60" : "w-0"
        )}
      >
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Contents</p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-snug line-clamp-2">{meta.title}</p>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex justify-between mb-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Progress</span>
            <span className="text-[9px] font-mono text-slate-400 tabular-nums">{Math.round(progressPct)}%</span>
          </div>
          <div className="h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* TOC */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "w-full text-left rounded-md mb-0.5 transition-all flex items-start gap-2",
                section.level === 1 ? "px-2 py-1.5 mt-2 first:mt-0" :
                section.level === 2 ? "pl-5 pr-2 py-1" : "pl-8 pr-2 py-1",
                activeId === section.id
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {section.level === 1 && (
                <span className={cn(
                  "mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full transition-colors",
                  activeId === section.id ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
                )} />
              )}
              <span className={cn(
                section.level === 1 ? "text-xs font-semibold leading-snug" : "text-[11px] font-normal leading-snug"
              )}>
                {section.title}
              </span>
            </button>
          ))}
        </nav>

        {meta.readTime && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400 shrink-0">
            {meta.readTime} read
          </div>
        )}
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Toolbar */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{meta.title}</span>
              {meta.author && <><span>/</span><span>{meta.author}</span></>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {meta.tags?.map((tag) => (
              <span key={tag} className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                {tag}
              </span>
            ))}
            <span className="text-[10px] font-mono text-slate-400">{meta.date}</span>
          </div>
        </header>

        {/* Article */}
        <div className="flex-1 overflow-y-auto">
          <article className="max-w-2xl mx-auto px-8 py-10">
            {/* Cover */}
            <div className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-700">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 leading-tight text-balance mb-3">
                {meta.title}
              </h1>
              {meta.subtitle && (
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-5 text-pretty">{meta.subtitle}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                {meta.author && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <span className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400">{meta.author[0]}</span>
                    </div>
                    {meta.author}
                  </div>
                )}
                {meta.date && <span>{meta.date}</span>}
                {meta.readTime && <span>{meta.readTime} read</span>}
              </div>
            </div>

            {/* Sections */}
            {sections.map((section) => (
              <section key={section.id} id={`section-${section.id}`} className="mb-8 scroll-mt-4">
                {section.level === 1 && (
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 leading-snug">{section.title}</h2>
                )}
                {section.level === 2 && (
                  <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-2 leading-snug">{section.title}</h3>
                )}
                {section.level === 3 && (
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">{section.title}</h4>
                )}
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
                  {section.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}
