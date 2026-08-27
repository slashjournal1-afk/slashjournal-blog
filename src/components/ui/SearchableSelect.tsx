'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export interface SearchableSelectOption {
  value: string;
  label: string;
  hint?: string;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  footerAction?: {
    label: string;
    onSelect: () => void;
  };
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  ariaLabel,
  searchPlaceholder = 'Cari...',
  emptyLabel = 'Tidak ada hasil',
  footerAction,
  disabled,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = React.useId();

  const selected = options.find((option) => option.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) ||
        (option.hint && option.hint.toLowerCase().includes(q))
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const selectedIndex = filtered.findIndex((option) => option.value === value);
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    searchInputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.querySelector(`[data-index="${highlightedIndex}"]`);
    item?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, open]);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const select = (optionValue: string) => {
    onChange(optionValue);
    close();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = filtered[highlightedIndex];
      if (option) select(option.value);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-[14px] border border-[#ececee] bg-[#f4f4f5] px-4 py-3 text-left text-xs font-semibold text-[#09090b] focus:outline-none focus:border-[var(--accent)] disabled:opacity-50 dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-white"
      >
        <span className="truncate">
          {selected ? (
            <>
              {selected.label}
              {selected.hint ? <span className="text-[#71717a] dark:text-[#a1a1aa]"> {selected.hint}</span> : null}
            </>
          ) : (
            <span className="text-[#71717a] dark:text-[#a1a1aa]">Pilih...</span>
          )}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[#71717a] transition-transform dark:text-[#a1a1aa] ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 rounded-[14px] border border-[#ececee] bg-white p-2 shadow-lg dark:border-[#3f3f46] dark:bg-[#18181b]">
          <div className="flex items-center gap-2 rounded-[10px] border border-[#ececee] bg-[#f4f4f5] px-3 py-2 dark:border-[#3f3f46] dark:bg-[#27272a]">
            <Search className="h-3.5 w-3.5 shrink-0 text-[#71717a] dark:text-[#a1a1aa]" />
            <input
              ref={searchInputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-label={searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-xs font-semibold text-[#09090b] placeholder:font-normal placeholder:text-[#71717a] focus:outline-none dark:text-white dark:placeholder:text-[#a1a1aa]"
            />
          </div>

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={ariaLabel}
            className="mt-2 max-h-56 overflow-y-auto"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2.5 text-xs text-[#71717a] dark:text-[#a1a1aa]">{emptyLabel}</li>
            ) : (
              filtered.map((option, index) => (
                <li
                  key={option.value || 'empty-value'}
                  data-index={index}
                  role="option"
                  aria-selected={option.value === value}
                  className={`cursor-pointer rounded-[10px] px-3 py-2.5 text-xs font-semibold ${
                    index === highlightedIndex
                      ? 'bg-[#f4f4f5] dark:bg-[#27272a]'
                      : ''
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => select(option.value)}
                >
                  {option.value === value ? (
                    <span className="text-[var(--accent)]">
                      {option.label}
                      {option.hint ? <span className="font-normal"> {option.hint}</span> : null}
                    </span>
                  ) : (
                    <>
                      {option.label}
                      {option.hint ? <span className="font-normal text-[#71717a] dark:text-[#a1a1aa]"> {option.hint}</span> : null}
                    </>
                  )}
                </li>
              ))
            )}
          </ul>

          {footerAction && (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                close(false);
                footerAction.onSelect();
              }}
              className="mt-1 flex w-full items-center gap-1.5 border-t border-[#ececee] px-3 py-2.5 text-left text-xs font-bold text-[var(--accent)] hover:bg-[#f4f4f5] dark:border-[#27272a] dark:hover:bg-[#27272a]"
            >
              <span>{footerAction.label}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
