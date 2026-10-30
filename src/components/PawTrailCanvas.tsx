import React, { useEffect, useRef } from 'react';

function ellipseArc(cx: number, cy: number, rx: number, ry: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const pt = (x: number, y: number) =>
    `${(cx + x * cos - y * sin).toFixed(2)} ${(cy + x * sin + y * cos).toFixed(2)}`;
  return `M${pt(rx, 0)}C${pt(rx, 0.5523 * ry)} ${pt(0.5523 * rx, ry)} ${pt(0, ry)}C${pt(
    -(0.5523 * rx),
    ry
  )} ${pt(-rx, 0.5523 * ry)} ${pt(-rx, 0)}C${pt(-rx, -(0.5523 * rx))} ${pt(
    -(0.5523 * rx),
    -ry
  )} ${pt(0, -ry)}C${pt(0.5523 * rx, -ry)} ${pt(rx, -(0.5523 * ry))} ${pt(rx, 0)}Z`;
}

// Authentic mathematical Path2D representation reverse-engineered from module 49054
const PAW_PATH =
  'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5z' +
  ellipseArc(14.6, 29.2, 5.3, 6.9, -28) +
  ellipseArc(24.2, 16.6, 5.5, 7.3, -10) +
  ellipseArc(39.8, 16.6, 5.5, 7.3, 10) +
  ellipseArc(49.4, 29.2, 5.3, 6.9, 28);

interface PawPrint {
  x: number;
  y: number;
  angle: number;
  born: number;
}

export const PawTrailCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pawPath: Path2D;
    try {
      pawPath = new Path2D(PAW_PATH);
    } catch {
      return;
    }

    // Media query checks: respect touch devices & reduced motion preferences
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    let isReducedMotion = motionQuery.matches;
    let isFinePointer = pointerQuery.matches;

    const trail: PawPrint[] = [];
    let dpr = 1;
    let animId = 0;
    let isRunning = false;
    let lastX = NaN;
    let lastY = NaN;
    let accumulatedDist = 0;
    let side = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();

    const clearCanvas = () => {
      cancelAnimationFrame(animId);
      animId = 0;
      isRunning = false;
      trail.length = 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (isReducedMotion) clearCanvas();
    };

    const handlePointerChange = (e: MediaQueryListEvent) => {
      isFinePointer = e.matches;
      if (!isFinePointer) clearCanvas();
    };

    motionQuery.addEventListener('change', handleMotionChange);
    pointerQuery.addEventListener('change', handlePointerChange);

    const render = (now: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        const age = now - p.born;
        if (age > 1000) {
          trail.splice(i, 1);
          continue;
        }
        // Fade logic: full opacity for 600ms, then quadratic fade-out for remaining 400ms
        const life = age < 600 ? 1 : 1 - (age - 600) / 400;
        ctx.globalAlpha = 0.42 * life * life;
        ctx.setTransform(0.27 * dpr, 0, 0, 0.27 * dpr, p.x * dpr, p.y * dpr);
        ctx.rotate(p.angle);
        ctx.translate(-32, -34);
        ctx.fillStyle = '#c2622b';
        ctx.fill(pawPath);
      }

      if (trail.length > 0) {
        animId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Do not spawn trail on touchscreens or if user prefers reduced motion
      if (isReducedMotion) return;
      if (e.pointerType === 'touch') return;

      if (Number.isNaN(lastX)) {
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      accumulatedDist += dist;

      // Spacing: exactly 46px along mouse vector
      if (accumulatedDist >= 46) {
        accumulatedDist = 0;
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        side = -side;
        const offset = 7 * side; // Alternating left/right step offset

        trail.push({
          x: e.clientX + Math.cos(angle) * offset + 14,
          y: e.clientY + Math.sin(angle) * offset + 16,
          angle,
          born: performance.now(),
        });

        // Limit active trail length to prevent excessive density
        if (trail.length > 14) {
          trail.shift();
        }

        if (!isRunning) {
          isRunning = true;
          animId = requestAnimationFrame(render);
        }
      }

      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', resize);
      motionQuery.removeEventListener('change', handleMotionChange);
      pointerQuery.removeEventListener('change', handlePointerChange);
      clearCanvas();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] size-full"
    />
  );
};

export default PawTrailCanvas;
