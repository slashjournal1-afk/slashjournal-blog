'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function LogoutButton({ className }: { className?: string }) {
  const { logout } = useAuth();
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      type="button"
      disabled={isPending}
      aria-busy={isPending}
      onClick={() => {
        setIsPending(true);
        void logout().finally(() => setIsPending(false));
      }}
      className={
        className ??
        'w-full flex items-center justify-center gap-1 py-2 rounded-btn bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[11.5px] font-medium transition-colors'
      }
    >
      <LogOut className="w-3.5 h-3.5" />
      {isPending ? 'Keluar...' : 'Keluar'}
    </button>
  );
}
