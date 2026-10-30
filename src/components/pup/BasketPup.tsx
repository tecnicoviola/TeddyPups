import React, { useEffect, useRef, useState } from 'react';
import { TeddyPuppet } from './TeddyPuppet';
import { TeddyPuppetSVG } from './TeddyPuppetSVG';

const BARK_WORDS = ['Woof!', 'Yip!', '♥', 'Sleepy...'];

export const BasketPup: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const puppetRef = useRef<TeddyPuppet | null>(null);
  const [emerged, setEmerged] = useState(false);
  const [bubbleText, setBubbleText] = useState('Woof!');
  const [showBubble, setShowBubble] = useState(false);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const svg = el.querySelector('svg');
    if (!svg) return;

    const puppet = new TeddyPuppet(svg, 'snug', 1);
    puppetRef.current = puppet;

    let lastTime = performance.now() / 1000;
    let animId: number;
    let isVisible = true;
    let pointerPos: { x: number; y: number; time: number } | null = null;
    let nextCockTime = lastTime + 3.0;

    const tick = () => {
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - lastTime);
      lastTime = now;

      if (pointerPos && now - pointerPos.time < 3.5) {
        puppet.lookAt(pointerPos);
      } else {
        puppet.lookAt(null);
      }

      // Occasional gentle ear/head inquisitiveness when idle
      if (now > nextCockTime) {
        const tiltAngle = Math.random() < 0.4 ? (Math.random() < 0.5 ? 6 : -5) : 0;
        puppet.cock(tiltAngle);
        if (Math.random() < 0.3) puppet.jolt(0.6);
        nextCockTime = now + 3.5 + Math.random() * 4.0;
      }

      puppet.tick(dt, now);

      if (isVisible) {
        animId = requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointerPos = { x: e.clientX, y: e.clientY, time: performance.now() / 1000 };
    };

    const handlePointerEnter = () => {
      puppet.petting(true);
      puppet.cock(7);
      puppet.jolt(0.8);
    };

    const handlePointerLeave = () => {
      puppet.petting(false);
      puppet.cock(0);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          setEmerged(true);
          lastTime = performance.now() / 1000;
          cancelAnimationFrame(animId);
          animId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    el.addEventListener('pointerenter', handlePointerEnter);
    el.addEventListener('pointerleave', handlePointerLeave);

    animId = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointerleave', handlePointerLeave);
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      puppetRef.current = null;
    };
  }, []);

  const handleClick = () => {
    if (!puppetRef.current) return;
    const now = performance.now() / 1000;
    puppetRef.current.woof(now);
    puppetRef.current.hop(0.7);

    const randomWord = BARK_WORDS[Math.floor(Math.random() * BARK_WORDS.length)];
    setBubbleText(randomWord);
    setShowBubble(true);

    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 1400);
  };

  return (
    <div
      ref={containerRef}
      className="pup-stop tp-basket__pup cursor-pointer select-none"
      data-act="basket"
      data-behind="true"
      data-facing="right"
      data-lane="true"
      data-pose="snug"
      data-pup-stop="true"
      style={{
        opacity: emerged ? 1 : 0.8,
        transition: 'opacity 0.4s ease-out',
      }}
      onClick={handleClick}
      title="Click to pet Teddy!"
    >
      <div className="pup-buddy relative" data-facing="right" data-live="true">
        <TeddyPuppetSVG pose="snug" facing="right" label="Teddy, sitting snug in his basket" />
        <span
          aria-hidden="true"
          className="pup-bubble"
          data-show={showBubble}
          style={{ pointerEvents: 'none' }}
        >
          {bubbleText}
        </span>
      </div>
    </div>
  );
};

