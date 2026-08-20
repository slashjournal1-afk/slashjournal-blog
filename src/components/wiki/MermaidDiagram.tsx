'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check, ZoomIn, ZoomOut, RotateCcw, Maximize2, X, Download } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface MermaidDiagramProps {
  chart?: string;
  code?: string;
}

export function MermaidDiagram({ chart, code }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Clean and sanitize diagram code
  const cleanDiagramContent = React.useMemo(() => {
    let clean = (chart || code || '').replace(/\r\n/g, '\n').trim();
    // Strip leading ```mermaid or ``` if present
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```[a-zA-Z0-9_-]*\n?/, '').replace(/```$/, '').trim();
    }
    return clean;
  }, [chart, code]);

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      if (!cleanDiagramContent) return;
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'neutral',
          securityLevel: 'loose',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          themeVariables: {
            darkMode: theme === 'dark',
            primaryColor: theme === 'dark' ? '#27272a' : '#f4f4f5',
            primaryTextColor: theme === 'dark' ? '#f4f4f5' : '#09090b',
            primaryBorderColor: 'var(--accent)',
            lineColor: theme === 'dark' ? '#a1a1aa' : '#52525b',
            secondaryColor: theme === 'dark' ? '#18181b' : '#ffffff',
            tertiaryColor: theme === 'dark' ? '#121214' : '#fafafa',
          },
        });

        // Ensure unique element ID per render
        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, cleanDiagramContent);
        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Mermaid render error:', err);
          setError('Gagal merender diagram Mermaid (periksa sintaks diagram)');
        }
      }
    }

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [cleanDiagramContent, theme]);

  const handleCopy = () => {
    if (!cleanDiagramContent) return;
    navigator.clipboard.writeText(cleanDiagramContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram-arsitektur.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="my-6 rounded-[28px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b] overflow-hidden shadow-xs">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#ececee] dark:border-[#27272a] bg-[#f4f4f5] dark:bg-[#27272a] text-xs">
          <span className="font-mono font-bold text-[var(--accent)] uppercase tracking-wider flex items-center gap-2 text-[10.5px]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            Diagram Arsitektur (Mermaid)
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2.2))}
              className="p-1.5 rounded-[8px] text-[#71717a] hover:text-[#09090b] dark:hover:text-white hover:bg-white dark:hover:bg-[#18181b] transition-colors"
              title="Perbesar Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.6))}
              className="p-1.5 rounded-[8px] text-[#71717a] hover:text-[#09090b] dark:hover:text-white hover:bg-white dark:hover:bg-[#18181b] transition-colors"
              title="Perkecil Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 rounded-[8px] text-[#71717a] hover:text-[#09090b] dark:hover:text-white hover:bg-white dark:hover:bg-[#18181b] transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-[#ececee] dark:bg-[#27272a] mx-1" />

            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-[8px] text-[#71717a] hover:text-[#09090b] dark:hover:text-white hover:bg-white dark:hover:bg-[#18181b] transition-colors"
              title="Layar Penuh (Fullscreen)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDownloadSvg}
              className="p-1.5 rounded-[8px] text-[#71717a] hover:text-[#09090b] dark:hover:text-white hover:bg-white dark:hover:bg-[#18181b] transition-colors"
              title="Unduh Berkas SVG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[11px] font-medium text-[#71717a] hover:text-[#09090b] dark:hover:text-white hover:bg-white dark:hover:bg-[#18181b] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#71717a]" />}
              {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>
        </div>

        {/* Render Area */}
        <div className="p-6 overflow-x-auto flex items-center justify-center min-h-[180px] bg-white dark:bg-[#18181b]">
          {error ? (
            <div className="text-center text-red-500 text-xs py-4">
              <p>{error}</p>
              <pre className="mt-2 text-[11px] text-[#71717a] font-mono text-left max-w-md overflow-x-auto p-3 rounded bg-[#f4f4f5] dark:bg-[#27272a]">
                {cleanDiagramContent}
              </pre>
            </div>
          ) : svgContent ? (
            <div
              ref={containerRef}
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}
              className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="text-xs text-[#71717a] flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              Merender diagram arsitektur...
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Expand Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 text-white">
            <span className="font-mono font-bold text-[var(--accent)] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              Diagram Arsitektur (Layar Penuh)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSvg}
                className="px-3 py-1.5 rounded-[10px] bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Unduh SVG</span>
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-[#121214] rounded-[24px] mt-4 border border-zinc-800">
            {svgContent && (
              <div
                className="w-full max-w-5xl flex justify-center [&>svg]:w-full [&>svg]:max-h-[80vh]"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
