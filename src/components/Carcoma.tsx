'use client';

import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CARCOMA, createCarcoma } from '@/lib/carcoma';
import { prefersReducedMotion } from '@/lib/dither';

/** A path to navigate to, or a change to make while the screen is covered (opening the menu). */
type Go = (to: string | (() => void)) => void;
const Ctx = createContext<Go>(() => {});

/** Navigate between sections, or swap what is on screen, through the carcoma. */
export function useCarcoma() { return useContext(Ctx); }

export function CarcomaProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLCanvasElement>(null);
  const run = useRef<{ t: number; href: string; target: string | null; swap?: () => void; held: number } | null>(null);
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  const go = useCallback<Go>((to) => {
    if (run.current) return;
    if (typeof to === 'function') {
      if (prefersReducedMotion() || !ref.current) { to(); return; }
      start({ t: 0, href: '', target: null, swap: to, held: 0 });
      return;
    }
    const href = to, target = href.split('#')[0] || '/';
    if (target === pathRef.current) {
      const hash = href.split('#')[1];
      if (hash) window.location.hash = hash;
      return;
    }
    if (prefersReducedMotion() || !ref.current) { router.push(href); return; }
    router.prefetch(target);
    start({ t: 0, href, target, held: 0 });
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = (r0: NonNullable<typeof run.current>) => {
    if (!ref.current) return;
    run.current = r0;
    const fx = createCarcoma(ref.current);
    const el = ref.current;
    el.style.display = 'block';
    let last = -1, raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const r = run.current; if (!r) return;
      raf = requestAnimationFrame(loop);
      const step = Math.floor(((now - t0) / 1000) * 12);
      if (step === last) return;
      last = step;
      // hold the covered frame until the new section has replaced the old one
      if (r.t === CARCOMA.swapAt && r.swap) { r.swap(); r.swap = undefined; }
      if (r.t === CARCOMA.swapAt && r.target) {
        if (r.held === 0) router.push(r.href);
        r.held++;
        if (pathRef.current !== r.target && r.held < 24) { fx.draw(r.t); return; }
      }
      fx.draw(r.t);
      r.t++;
      if (r.t > CARCOMA.end) { cancelAnimationFrame(raf); fx.clear(); el.style.display = 'none'; run.current = null; }
    };
    raf = requestAnimationFrame(loop);
  };

  useEffect(() => () => { run.current = null; }, []);

  return (
    <Ctx.Provider value={go}>
      {children}
      <canvas ref={ref} className="carcoma" width={CARCOMA.W} height={CARCOMA.H} aria-hidden="true" />
    </Ctx.Provider>
  );
}

/** A link that goes through the carcoma; it stays a real link for new tabs and no-JS. */
export function CarcomaLink({ href, className, children, onNavigate, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; onNavigate?: () => void }) {
  const go = useCarcoma();
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onNavigate?.();
        go(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
