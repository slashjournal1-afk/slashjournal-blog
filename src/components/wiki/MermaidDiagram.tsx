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
  const fullscreenPanelRef = useRef<HTMLDivElement>(null);
  const fullscreenCloseRef = useRef<HTMLButtonElement>(null);
  const fullscreenTriggerRef = useRef<HTMLButtonElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        if (!isMounted) return;
        setSvgContent(null);
        setError(null);
        const isDark = theme === 'dark';
        const diagramBackground = isDark ? '#09090b' : '#ffffff';
        const diagramForeground = isDark ? '#ffffff' : '#000000';
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'strict',
          fontFamily: 'Arial, sans-serif',
          themeVariables: {
            darkMode: isDark,
            background: diagramBackground,
            primaryColor: diagramBackground,
            primaryTextColor: diagramForeground,
            primaryBorderColor: diagramForeground,
            lineColor: diagramForeground,
            secondaryColor: diagramBackground,
            secondaryTextColor: diagramForeground,
            secondaryBorderColor: diagramForeground,
            tertiaryColor: diagramBackground,
            tertiaryTextColor: diagramForeground,
            tertiaryBorderColor: diagramForeground,
            clusterBkg: diagramBackground,
            clusterBorder: diagramForeground,
            titleColor: diagramForeground,
            edgeLabelBackground: diagramBackground,
            actorBkg: diagramBackground,
            actorBorder: diagramForeground,
            actorTextColor: diagramForeground,
            actorLineColor: diagramForeground,
            signalColor: diagramForeground,
            signalTextColor: diagramForeground,
            labelBoxBkgColor: diagramBackground,
            labelBoxBorderColor: diagramForeground,
            labelTextColor: diagramForeground,
            loopTextColor: diagramForeground,
            activationBkgColor: diagramBackground,
            activationBorderColor: diagramForeground,
            noteBkgColor: diagramBackground,
            noteTextColor: diagramForeground,
            noteBorderColor: diagramForeground,
          },
        });

        // Ensure unique element ID per render
        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, cleanDiagramContent);
        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err: unknown) {
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

  useEffect(() => {
    if (!isFullscreen) return;
    const fullscreenTrigger = fullscreenTriggerRef.current;
    fullscreenCloseRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = fullscreenPanelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      fullscreenTrigger?.focus();
    };
  }, [isFullscreen]);

  useEffect(() => () => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
  }, []);

  const handleCopy = () => {
    if (!cleanDiagramContent) return;
    navigator.clipboard.writeText(cleanDiagramContent);
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false);
      copyTimeoutRef.current = null;
    }, 2000);
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
      <div className="my-6 overflow-hidden rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xs">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-card-muted)] px-4 py-2.5 text-xs">
          <span className="font-mono font-bold text-[var(--accent)] uppercase tracking-wider flex items-center gap-2 text-[10.5px]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            Diagram Arsitektur (Mermaid)
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2.2))}
              aria-label="Perbesar diagram"
              className="rounded-[8px] p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
              title="Perbesar Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.6))}
              aria-label="Perkecil diagram"
              className="rounded-[8px] p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
              title="Perkecil Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              aria-label="Reset zoom diagram"
              className="rounded-[8px] p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="mx-1 h-4 w-px bg-[var(--border-color)]" />

            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              ref={fullscreenTriggerRef}
              aria-label="Buka diagram layar penuh"
              className="rounded-[8px] p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
              title="Layar Penuh (Fullscreen)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDownloadSvg}
              aria-label="Unduh diagram sebagai SVG"
              className="rounded-[8px] p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
              title="Unduh Berkas SVG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Salin kode diagram Mermaid"
              className="flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#71717a]" />}
              {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>
        </div>

        {/* Render Area */}
        <div className="flex min-h-[180px] max-w-full items-center justify-center overflow-x-auto bg-[var(--diagram-surface)] p-4 text-[var(--diagram-ink)] sm:p-6">
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
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-in fade-in duration-150"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            ref={fullscreenPanelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mermaid-fullscreen-title"
            onClick={(event) => event.stopPropagation()}
            className="flex h-full flex-col text-white"
          >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 text-white">
            <span className="font-mono font-bold text-[var(--accent)] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span id="mermaid-fullscreen-title">Diagram Arsitektur (Layar Penuh)</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="px-3 py-1.5 rounded-[10px] bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Unduh SVG</span>
              </button>
              <button
                ref={fullscreenCloseRef}
                type="button"
                onClick={() => setIsFullscreen(false)}
                aria-label="Tutup layar penuh diagram"
                className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-1 items-center justify-center overflow-auto rounded-[24px] border border-[var(--border-color)] bg-[var(--diagram-surface)] p-6 text-[var(--diagram-ink)]">
            {svgContent && (
              <div
                className="w-full max-w-5xl flex justify-center [&>svg]:w-full [&>svg]:max-h-[80vh]"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            )}
          </div>
          </div>
        </div>
      )}
    </>
  );
}
