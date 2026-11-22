'use client';

import { useEffect } from 'react';

/** Turns the dithered cursor on while this is mounted. */
export function CursorOn() {
  useEffect(() => {
    document.documentElement.setAttribute('data-cursor', '');
    return () => document.documentElement.removeAttribute('data-cursor');
  }, []);
  return null;
}
