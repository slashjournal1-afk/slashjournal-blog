'use client';

import { RefObject, useEffect, useRef } from 'react';

type DismissiblePopoverOptions = {
  open: boolean;
  onClose: () => void;
  closeOnPointerLeave?: boolean;
  leaveDelay?: number;
  additionalRef?: RefObject<HTMLElement | null>;
};

export function useDismissiblePopover<T extends HTMLElement>({
  open,
  onClose,
  closeOnPointerLeave = true,
  leaveDelay = 180,
  additionalRef,
}: DismissiblePopoverOptions): RefObject<T | null> {
  const rootRef = useRef<T | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const clearCloseTimer = () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
    const contains = (target: EventTarget | null) => {
      const node = target as Node | null;
      return Boolean(node && (rootRef.current?.contains(node) || additionalRef?.current?.contains(node)));
    };
    const closeIfOutside = (event: PointerEvent) => {
      if (!contains(event.target)) onCloseRef.current();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    const handleFocusIn = (event: FocusEvent) => {
      if (!contains(event.target)) onCloseRef.current();
    };
    const handlePointerLeave = () => {
      if (!closeOnPointerLeave) return;
      clearCloseTimer();
      closeTimerRef.current = setTimeout(() => {
        closeTimerRef.current = null;
        if (!contains(document.activeElement)) onCloseRef.current();
      }, leaveDelay);
    };
    const handlePointerEnter = () => clearCloseTimer();

    const root = rootRef.current;
    document.addEventListener('pointerdown', closeIfOutside);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);
    root?.addEventListener('pointerleave', handlePointerLeave);
    root?.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      clearCloseTimer();
      document.removeEventListener('pointerdown', closeIfOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
      root?.removeEventListener('pointerleave', handlePointerLeave);
      root?.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, [additionalRef, closeOnPointerLeave, leaveDelay, open]);

  return rootRef;
}
