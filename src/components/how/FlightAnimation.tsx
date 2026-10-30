import React, { useEffect, useRef, useId } from 'react';

interface FlightAnimationProps {
  label?: string;
  className?: string;
  photoUrl?: string;
}

export const FlightAnimation: React.FC<FlightAnimationProps> = ({
  label = 'A plane bringing a Korean Teacup Maltipoo puppy from Korea to Dubai',
  className = '',
  photoUrl = '/images/b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const clipId = useId();

  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    const plane = planeRef.current;
    if (!container || !path || !plane) return;

    let pathLength = 0;
    try {
      pathLength = path.getTotalLength();
    } catch {
      pathLength = 650;
    }

    const updatePlane = (progress: number) => {
      const clampedProg = Math.max(0, Math.min(1, progress));
      const currentLen = Math.min(pathLength, Math.max(0, clampedProg * pathLength));

      let pt = { x: 40, y: 250 };
      let angle = 0;

      try {
        pt = path.getPointAtLength(currentLen);
        const pNext = path.getPointAtLength(Math.min(pathLength, currentLen + 1));
        const pPrev = path.getPointAtLength(Math.max(0, currentLen - 1));
        angle = (180 * Math.atan2(pNext.y - pPrev.y, pNext.x - pPrev.x)) / Math.PI;
      } catch {
        // Fallback calculation if getPointAtLength fails
      }

      plane.setAttribute(
        'transform',
        `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})`
      );
      // Smooth fade-in as plane starts along route
      plane.style.opacity = String(Math.min(1, Math.max(0, (clampedProg - 0.11) / 0.06)));
    };

    let rafId: number;
    const onScroll = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 800;

      // Start when container top reaches 95% of viewport, end when container bottom reaches 25% of viewport
      const startY = vh * 0.95;
      const endY = vh * 0.25;
      const totalDist = startY - endY + rect.height;
      const currentDist = startY - rect.top;
      const progress = currentDist / totalDist;

      updatePlane(progress);
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(onScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className={`tp-flight ${className}`}>
      <svg viewBox="0 0 660 300" role="img" aria-label={label}>
        <defs>
          <clipPath id={clipId}>
            <circle r="25" />
          </clipPath>
        </defs>
        <path
          ref={pathRef}
          d="M40 250 C 170 40, 470 20, 620 168"
          className="tp-flight__route"
        />
        <circle cx="40" cy="250" r="7" className="tp-flight__dot" />
        <circle cx="620" cy="168" r="7" className="tp-flight__dot" />
        <text x="40" y="284" textAnchor="middle" className="tp-flight__label">
          Korea
        </text>
        <text x="620" y="202" textAnchor="middle" className="tp-flight__label">
          Dubai
        </text>

        <g ref={planeRef} transform="translate(410 70)">
          <g transform="translate(-126 -78)">
            <path d="M28 60 L8 26 L34 26 L60 54 Z" className="tp-flight__wing" />
            <path
              d="M108 112 L142 156 L172 156 L158 112 Z"
              className="tp-flight__wing tp-flight__wing--far"
            />
            <path
              d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z"
              className="tp-flight__body"
            />
            <path d="M104 44 L138 2 L168 2 L154 44 Z" className="tp-flight__wing" />
            <path d="M206 64 C215 67 221 73 224 80" className="tp-flight__line" />
          </g>
          <g transform="translate(10 2)">
            <image
              clipPath={`url(#${clipId})`}
              href={photoUrl}
              width="50"
              height="50"
              x="-25"
              y="-25"
              preserveAspectRatio="xMidYMid slice"
            />
            <circle r="25" className="tp-flight__porthole" />
          </g>
        </g>
      </svg>
    </div>
  );
};

