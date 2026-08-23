'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tag as TagIcon, X, Plus, Sparkles } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({
  tags,
  onChange,
  placeholder = 'Ketik kata kunci lalu tekan Enter atau koma (,)...',
  maxTags = 10,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch tag suggestions from API
  useEffect(() => {
    async function loadTags() {
      try {
        const res = await fetch('/api/tags');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.tags)) {
            setSuggestions(data.tags.map((t: any) => t.name));
          }
        }
      } catch {}
    }
    loadTags();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (rawText: string) => {
    const trimmed = rawText.trim().replace(/^#/, '');
    if (!trimmed) return;

    if (tags.length >= maxTags) return;

    // Check duplicate (case-insensitive)
    const exists = tags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      e.preventDefault();
      removeTag(tags.length - 1);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      !tags.some((t) => t.toLowerCase() === s.toLowerCase()) &&
      s.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div ref={containerRef} className="space-y-2 relative">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <TagIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Kata Kunci &amp; Topik Naskah (Tags)</span>
        </label>
        <span className="text-[10px] font-mono text-[#71717a]">
          {tags.length}/{maxTags} kata kunci
        </span>
      </div>

      {/* Chip Box & Input */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="min-h-[46px] p-2 rounded-[14px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] flex flex-wrap items-center gap-1.5 cursor-text focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]/30 transition-all"
      >
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[10px] bg-white dark:bg-[#18181b] border border-[#d4d4d8] dark:border-[#3f3f46] text-xs font-semibold text-[#09090b] dark:text-white shadow-2xs animate-in zoom-in-90 duration-150"
          >
            <span className="text-[var(--accent)]">#</span>
            <span>{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(idx);
              }}
              className="p-0.5 rounded-full hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#71717a] hover:text-[#09090b] dark:hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {tags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : 'Tambah lagi...'}
            className="flex-1 min-w-[140px] bg-transparent border-0 text-xs sm:text-sm font-medium text-[#09090b] dark:text-white placeholder-[#71717a] focus:outline-none px-1 py-0.5"
          />
        )}
      </div>

      {/* Tag Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-20 left-0 right-0 top-full mt-1 p-2 rounded-[16px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] shadow-xl space-y-1 animate-in fade-in zoom-in-95 duration-150 max-h-48 overflow-y-auto">
          <div className="text-[10.5px] font-bold text-[#71717a] px-2 py-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[var(--accent)]" />
            <span>Rekomendasi Kata Kunci Populer:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 p-1">
            {filteredSuggestions.slice(0, 10).map((suggestion, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={() => {
                  addTag(suggestion);
                  inputRef.current?.focus();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[10px] bg-[var(--bg-card-muted)] hover:bg-[var(--accent-soft)] text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
              >
                <Plus className="w-3 h-3 text-[var(--accent)]" />
                <span>#{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
