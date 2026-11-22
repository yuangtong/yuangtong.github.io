'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/dither';
import { loadGallop } from '@/lib/media';
import { createCrash } from '@/lib/crash-404';

/** The 404 in dots; the horse crashes into it and it crumbles. */
export function NotFoundCrash({ label }: { label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let raf = 0, dead = false, eng: ReturnType<typeof createCrash> | null = null;
    const t0 = performance.now();
    const build = () => loadGallop().then((g) => { if (!dead && ref.current) eng = createCrash(ref.current, g, prefersReducedMotion()); });
    build();
    const loop = (now: number) => { if (dead) return; raf = requestAnimationFrame(loop); eng?.frame(now, t0); };
    raf = requestAnimationFrame(loop);
    let t = 0;
    const onResize = () => { clearTimeout(t); t = window.setTimeout(build, 200); };
    window.addEventListener('resize', onResize);
    return () => { dead = true; cancelAnimationFrame(raf); clearTimeout(t); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} className="notfound__cv" role="img" aria-label={label} />;
}
