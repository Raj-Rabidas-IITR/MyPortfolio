'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * TopProgress
 * - Shows a thin progress bar at the top of the admin area when route changes happen
 *   or when any client-side fetch() starts (monkey-patches window.fetch while mounted).
 * - This is a lightweight implementation to cover most client-side API calls.
 */
export default function TopProgress() {
  const pathname = usePathname();
  const [loadingCount, setLoadingCount] = useState(0);
  const [routeLoading, setRouteLoading] = useState(false);
  const originalFetchRef = useRef<typeof fetch | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // On mount: patch fetch
    const w = typeof window !== 'undefined' ? window : undefined;
    if (!w) return;

    originalFetchRef.current = w.fetch.bind(w);

    w.fetch = async (...args: Parameters<typeof fetch>) => {
      setLoadingCount((c) => c + 1);
      try {
        const res = await (originalFetchRef.current as typeof fetch)(...args);
        return res;
      } finally {
        // always decrement the counter when the fetch completes (success or failure)
        setLoadingCount((c) => Math.max(0, c - 1));
      }
    };

    return () => {
      // restore original fetch
      if (originalFetchRef.current && w) {
        w.fetch = originalFetchRef.current;
      }
      if (timeoutRef.current) {
        globalThis.clearTimeout(timeoutRef.current);
      }
    };
  }, []);  // Watch for pathname changes to show a brief route loader.
  useEffect(() => {
    // Show route loading immediately when pathname changes
    setRouteLoading(true);

    // If there are no fetches, hide after a small delay; otherwise wait for fetches to finish.
    if (loadingCount === 0) {
      // keep visible at least 250ms to avoid flicker
      timeoutRef.current = globalThis.setTimeout(() => setRouteLoading(false), 250) as unknown as number;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Hide routeLoading when no active fetches
  useEffect(() => {
    if (loadingCount === 0) {
      // small delay to make UI feel smooth
      const id = globalThis.setTimeout(() => setRouteLoading(false), 150) as unknown as number;
      return () => globalThis.clearTimeout(id);
    }
  }, [loadingCount]);

  const isActive = routeLoading || loadingCount > 0;

  return (
    <div aria-hidden className="fixed left-0 right-0 top-0 z-[9999] pointer-events-none">
      <div
        className={`h-1 origin-left transition-all duration-300 ease-out transform ${
          isActive ? 'scale-x-100' : 'scale-x-0'
        } bg-cyan-400`}
        style={{ transformOrigin: 'left', willChange: 'transform' }}
      />
      {/* subtle shadow line */}
      <div className="h-[1px] bg-black/20" />
    </div>
  );
}
