import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TeddyRunnerSVG from './pup/TeddyRunnerSVG';

// 5 authentic paw print coordinates: [left%, topPx, rotateDeg]
const PAW_PRINTS: [number, number, number][] = [
  [18, 6, -76],
  [27, -4, -84],
  [36, 7, -72],
  [45, -3, -86],
  [54, 6, -74],
];

// SVG path for single paw print
const PAW_D =
  'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z';

export type CurtainState = 'intro' | 'covering' | 'covered' | 'lifting' | 'snap' | 'idle';

export const RouteCurtain: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const curtainRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CurtainState>('intro');
  const targetUrlRef = useRef<string | null>(null);
  const coveredTimeRef = useRef<number>(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const currentPathRef = useRef<string>(location.pathname + location.search);
  const navigateArrivedRef = useRef<() => void>(() => {});

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const addTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  const updateState = (newState: CurtainState) => {
    setState(newState);
    if (curtainRef.current) {
      curtainRef.current.dataset.state = newState;
    }
    if (newState === 'idle') {
      delete document.documentElement.dataset.curtain;
    } else {
      document.documentElement.dataset.curtain = newState;
    }
  };

  const liftCurtain = () => {
    if (curtainRef.current?.dataset.state !== 'idle' && curtainRef.current?.dataset.state !== 'lifting') {
      clearAllTimeouts();
      targetUrlRef.current = null;
      updateState('lifting');
      window.dispatchEvent(new Event('tp:arrived'));
      document.getElementById('main')?.focus({ preventScroll: true });
      addTimeout(() => {
        updateState('idle');
      }, 460);
    }
  };

  navigateArrivedRef.current = liftCurtain;

  const executeNavigation = (urlStr: string) => {
    const url = new URL(urlStr, window.location.href);
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      targetUrlRef.current = null;
      window.scrollTo({ top: 0, behavior: 'instant' });
      addTimeout(liftCurtain, 120);
      return;
    }

    navigate(url.pathname + url.search + url.hash);
    addTimeout(liftCurtain, 6000); // Fail-safe timeout
  };

  // Initial page load intro animation
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      updateState('idle');
      return;
    }

    addTimeout(() => {
      window.dispatchEvent(new Event('tp:arrived'));
    }, 560);

    addTimeout(() => {
      if (curtainRef.current?.dataset.state === 'intro') {
        updateState('idle');
      }
    }, 1080);

    return () => {
      clearAllTimeouts();
    };
  }, []);

  // Global Link Interceptor (exactly as in original reference js 177ya708_1zuj.js)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download') || anchor.dataset.noCurtain !== undefined) {
        return;
      }

      let destUrl: URL;
      try {
        destUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // Check same origin and internal application paths
      if (
        destUrl.origin !== window.location.origin ||
        /^\/(admin|api|media|_next)(\/|$)/.test(destUrl.pathname)
      ) {
        return;
      }

      // Check if destination differs from current page
      const isDifferentPage = destUrl.pathname !== window.location.pathname || (!destUrl.hash && destUrl.search !== window.location.search);
      if (!isDifferentPage) {
        // If clicking same page link, let default scroll/anchor behavior occur
        return;
      }

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        return;
      }

      // INTERCEPT AND TRIGGER CURTAIN
      e.preventDefault();
      e.stopPropagation();

      window.dispatchEvent(new Event('tp:navigate'));
      const nextHref = destUrl.href;
      const currentState = curtainRef.current?.dataset.state || state;
      targetUrlRef.current = nextHref;

      if (currentState === 'covered' || currentState === 'snap') {
        executeNavigation(nextHref);
      } else if (currentState === 'covering') {
        // Already covering
      } else {
        clearAllTimeouts();
        updateState('covering');
        addTimeout(() => {
          updateState('covered');
          coveredTimeRef.current = performance.now();
          if (targetUrlRef.current) {
            executeNavigation(targetUrlRef.current);
          }
        }, 300);
      }
    };

    const handlePopState = () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion || window.location.pathname === currentPathRef.current) {
        return;
      }
      clearAllTimeouts();
      updateState('snap');
      coveredTimeRef.current = performance.now();
      addTimeout(liftCurtain, 1400);
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        clearAllTimeouts();
        updateState('idle');
      }
    };

    window.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      clearAllTimeouts();
      delete document.documentElement.dataset.curtain;
      window.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [navigate]);

  // Route change detector to lift the curtain once destination is rendered
  useEffect(() => {
    const fullPath = location.pathname + location.search;
    if (fullPath === currentPathRef.current) return;
    currentPathRef.current = fullPath;

    const curState = curtainRef.current?.dataset.state;
    if (curState !== 'covered' && curState !== 'snap' && curState !== 'covering') {
      return;
    }

    const elapsed = performance.now() - coveredTimeRef.current;
    const remainingCoveredTime = Math.max(0, 140 - elapsed);
    const delay = curState === 'covering' ? 340 : remainingCoveredTime;

    const t = setTimeout(() => {
      requestAnimationFrame(() => {
        navigateArrivedRef.current();
      });
    }, delay);

    return () => clearTimeout(t);
  }, [location.pathname, location.search]);

  return (
    <div
      ref={curtainRef}
      className="tp-curtain"
      data-state={state}
      aria-hidden={true}
    >
      <div className="tp-curtain__blanket">
        {/* Top Scallop Border */}
        <svg
          className="tp-curtain__edge tp-curtain__edge--top"
          width="100%"
          height="40"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="tp-curtain-scallop"
              width="76"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill="#fbe3b4" />
              <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
              <path
                d="M11 33A27 19 0 0 1 65 33"
                fill="none"
                stroke="#2a170e"
                strokeWidth="1.6"
                strokeDasharray="3.5 5.5"
                strokeLinecap="round"
                opacity=".42"
              />
            </pattern>
          </defs>
          <rect width="100%" height="40" fill="url(#tp-curtain-scallop)" />
        </svg>

        {/* Central Stage */}
        <div className="tp-curtain__stage">
          {/* Paw Prints Trail */}
          <div className="tp-curtain__prints">
            {PAW_PRINTS.map(([leftPercent, topPx, rotateDeg], i) => (
              <svg
                key={i}
                viewBox="0 0 64 64"
                className="tp-curtain__print"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPx}px`,
                  rotate: `${rotateDeg + 90}deg`,
                  animationDelay: `${0.16 + 0.12 * i}s`,
                }}
              >
                <path d={PAW_D} />
              </svg>
            ))}
          </div>

          {/* Running Mascot */}
          <div className="tp-curtain__runner">
            <TeddyRunnerSVG />
          </div>

          {/* Branded Lowercase Message */}
          <p className="tp-curtain__note font-scrawl">
            every puppy is family
          </p>
        </div>

        {/* Bottom Scallop Border (Inverted) */}
        <svg
          className="tp-curtain__edge tp-curtain__edge--bottom"
          width="100%"
          height="40"
          preserveAspectRatio="none"
        >
          <rect width="100%" height="40" fill="url(#tp-curtain-scallop)" />
        </svg>
      </div>
    </div>
  );
};

export default RouteCurtain;

