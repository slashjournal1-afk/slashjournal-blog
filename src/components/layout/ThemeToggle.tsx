'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-muted)] hover:text-[var(--text-primary)]"
      title={`Beralih ke Mode ${theme === 'dark' ? 'Terang' : 'Gelap'}`}
      aria-label={`Beralih ke mode ${theme === 'dark' ? 'terang' : 'gelap'}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-500" />
      ) : (
        <Moon className="w-4 h-4 text-[#52525b]" />
      )}
    </button>
  );
}
