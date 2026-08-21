'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Code2,
  WrapText,
  FileCode,
  Type,
  Maximize2,
} from 'lucide-react';
import { highlightCodeLine } from '@/lib/highlight';

export interface TabItem {
  name: string;
  language: string;
  code: string;
}

export interface MultiTabCodeProps {
  tabs?: TabItem[];
  rawContent?: string;
  rawCode?: string;
  defaultLanguage?: string;
  title?: string;
}

export function MultiTabCode({ tabs: propTabs, rawContent, rawCode, defaultLanguage, title }: MultiTabCodeProps) {
  let content = (rawContent || rawCode || '').replace(/\r\n/g, '\n').trim();

  // If content has outer markdown backticks, strip them
  if (content.startsWith('```')) {
    content = content.replace(/^```[a-zA-Z0-9_-]*\n?/, '').replace(/```$/, '').trim();
  }

  // Parse rawContent if tabs not provided directly
  const tabs: TabItem[] = React.useMemo(() => {
    if (propTabs && propTabs.length > 0) return propTabs;
    if (!content) return [];

    const lines = content.split('\n');
    const parsed: TabItem[] = [];
    let currentTab: TabItem | null = null;
    let currentLines: string[] = [];

    for (const line of lines) {
      const match = line.match(/^\/\/\s*tab:\s*(.*)/i);
      if (match) {
        if (currentTab) {
          currentTab.code = currentLines.join('\n').trim();
          parsed.push(currentTab);
        }
        const fullTitle = match[1].trim();
        const langMatch = fullTitle.match(/^([^\(]+)(?:\s*\((.*)\))?$/);
        const language = langMatch ? langMatch[1].trim().toLowerCase() : (defaultLanguage || 'text');
        const name = fullTitle;
        currentTab = { name, language, code: '' };
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    }

    if (currentTab) {
      currentTab.code = currentLines.join('\n').trim();
      parsed.push(currentTab);
    } else if (content.trim()) {
      parsed.push({
        name: title || (defaultLanguage ? defaultLanguage.toUpperCase() : 'Snippet'),
        language: defaultLanguage || 'typescript',
        code: content.trim(),
      });
    }

    return parsed;
  }, [propTabs, content, defaultLanguage, title]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'xs'>('xs');

  const activeTab = tabs[activeIdx] || tabs[0];

  const handleCopy = () => {
    if (!activeTab) return;
    navigator.clipboard.writeText(activeTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeTab) return null;

  const codeLines = activeTab.code.split('\n');

  return (
    <div className="my-6 rounded-[24px] border border-[#27272a] bg-[#0c0c0e] text-[#f4f4f5] overflow-hidden shadow-md transition-all">
      {/* Top Header: Tabs & Quick Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#27272a] bg-[#141416] px-3 py-2.5 sm:px-4">
        {/* Left: Tab Switches */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-mono font-medium transition-all ${
                activeIdx === idx
                  ? 'bg-[var(--accent)] text-white font-bold shadow-2xs'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Right: Controls (Word Wrap, Font Size, Copy) */}
        <div className="flex items-center gap-1.5">
          {/* Toggle Word Wrap */}
          <button
            type="button"
            onClick={() => setIsWrapped((prev) => !prev)}
            className={`p-1.5 rounded-[8px] text-xs font-medium transition-colors ${
              isWrapped
                ? 'bg-[#27272a] text-[var(--accent)]'
                : 'text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#27272a]/60'
            }`}
            title={isWrapped ? 'Nonaktifkan Word Wrap' : 'Aktifkan Word Wrap (Bungkus Baris)'}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Font Size */}
          <button
            type="button"
            onClick={() => setFontSize((prev) => (prev === 'xs' ? 'sm' : 'xs'))}
            className="p-1.5 rounded-[8px] text-xs font-medium text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#27272a]/60 transition-colors"
            title={`Ubah Ukuran Font (Sekarang: ${fontSize.toUpperCase()})`}
          >
            <Type className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-mono font-medium text-[#a1a1aa] hover:text-white hover:bg-[#27272a] transition-all"
            title="Salin Seluruh Blok Kode"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
            )}
            <span className="text-[11px]">{copied ? 'Tersalin!' : 'Salin'}</span>
          </button>
        </div>
      </div>

      {/* Code Display Area with Line Numbers & Diff Highlighting */}
        <div className={`min-w-0 max-w-full overflow-x-auto p-3 font-mono leading-relaxed flex gap-4 sm:p-4 ${fontSize === 'sm' ? 'text-[13px]' : 'text-[12px]'}`}>
        {/* Line Numbers Gutter */}
        <div className="select-none text-right text-[#52525b] font-mono pr-3 border-r border-[#27272a]/80 shrink-0">
          {codeLines.map((_, i) => (
            <div key={i} className="leading-relaxed">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Content with Diff & Line Highlight Support */}
        <pre className={`text-[#e4e4e7] flex-1 ${isWrapped ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}>
          <code>
            {codeLines.map((line, i) => {
              const isAdded = line.startsWith('+ ') || line.startsWith('+');
              const isRemoved = line.startsWith('- ') || line.startsWith('-');
              const isHighlight = line.includes('// highlight-line');
              const cleanLine = isHighlight ? line.replace('// highlight-line', '') : line;

              // Generate syntax highlighted HTML for this line using Prism
              const highlightedHtml = highlightCodeLine(cleanLine, activeTab.language);

              let lineClass = 'leading-relaxed px-1.5 -mx-1.5 rounded-[4px] ';
              if (isAdded) {
                lineClass += 'bg-emerald-950/40 text-emerald-300 font-semibold border-l-2 border-emerald-500';
              } else if (isRemoved) {
                lineClass += 'bg-rose-950/40 text-rose-300 line-through opacity-80 border-l-2 border-rose-500';
              } else if (isHighlight) {
                lineClass += 'bg-amber-950/40 text-amber-200 font-semibold border-l-2 border-amber-500';
              }

              return (
                <div
                  key={i}
                  className={lineClass}
                  dangerouslySetInnerHTML={{ __html: highlightedHtml || '&nbsp;' }}
                />
              );
            })}
          </code>
        </pre>
      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-1.5 border-t border-[#27272a]/60 bg-[#101012] flex items-center justify-between text-[10.5px] font-mono text-[#71717a]">
        <span>{activeTab.language.toUpperCase()} • {codeLines.length} baris</span>
        <span className="text-[#52525b]">Gunakan Shift+Scroll untuk scroll horizontal</span>
      </div>
    </div>
  );
}
