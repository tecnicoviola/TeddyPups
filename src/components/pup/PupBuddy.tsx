import React, { useEffect, useRef } from 'react';
import { TeddyPuppet } from './TeddyPuppet';
import { TeddyPuppetSVG } from './TeddyPuppetSVG';
import { PupPose, PUP_POSES } from './pupConstants';

function spawnHearts(container: HTMLElement, x: number, y: number) {
  for (let r = 0; r < 5; r++) {
    const s = document.createElement('span');
    s.className = 'pup-heart';
    s.textContent = '♥';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    container.append(s);
    const i = (Math.random() - 0.5) * 90;
    const n = -70 - 60 * Math.random();
    if (s.animate) {
      s.animate(
        [
          { transform: 'translate(-50%, 0) scale(0.4)', opacity: 0 },
          { opacity: 1, offset: 0.2 },
          { transform: `translate(calc(-50% + ${i.toFixed(0)}px), ${n.toFixed(0)}px) scale(1.1)`, opacity: 0 },
        ],
        {
          duration: 1150 + 110 * r,
          delay: 80 * r,
          easing: 'cubic-bezier(.2,.7,.3,1)',
          fill: 'backwards',
        }
      ).finished.then(
        () => s.remove(),
        () => s.remove()
      );
    } else {
      setTimeout(() => s.remove(), 1200);
    }
  }
}

interface ActionContext {
  d: TeddyPuppet;
  rest: PupPose;
  facing: number;
  say: (text: string, dur?: number) => void;
  hearts: () => void;
}

type TimelineStep = [number, (curTime: number) => void];

const ACTIONS: Record<string, (ctx: ActionContext, t: number) => TimelineStep[]> = {
  woof: ({ d, say }, t) => [
    [t, (cur) => { d.woof(cur); say('woof!'); }],
    [t + 0.42, (cur) => { d.woof(cur); say('woof woof!'); }],
  ],
  spin: ({ d, rest, facing, say }, t) => [
    [t, () => { d.setPose('stand'); d.hop(0.5); }],
    [t + 0.14, () => d.face(-facing)],
    [t + 0.38, () => d.face(facing)],
    [t + 0.62, () => d.face(-facing)],
    [t + 0.86, () => { d.face(facing); say('wheee!'); }],
    [t + 1.3, () => d.setPose(rest)],
  ],
  beg: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('beg'); d.wag(1); say('treat, please?', 1.7); }],
    [t + 1.9, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  bow: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('bow'); d.wag(1); say('play with me!'); }],
    [t + 0.55, () => d.hop(0.45)],
    [t + 1.7, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  hop: ({ d, rest, say }, t) => [
    [t, () => { d.setPose('hop'); d.hop(1.1); say('boing!'); }],
    [t + 0.36, () => d.setPose(rest)],
    [t + 0.62, () => { d.setPose('hop'); d.hop(0.8); }],
    [t + 0.98, () => d.setPose(rest)],
  ],
  love: ({ d, rest, say, hearts }, t) => [
    [t, () => { d.setPose({ ...rest, happy: 1, tongue: 1 }); d.wag(1); hearts(); say('I like you!', 1.5); }],
    [t + 1.9, () => { d.setPose(rest); d.wag(0.7); }],
  ],
  tilt: ({ d, say }, t) => [
    [t, () => { d.cock(-14); say('hm?'); }],
    [t + 0.8, () => d.cock(12)],
    [t + 1.6, () => d.cock(0)],
  ],
  sneeze: ({ d, say }, t) => [
    [t, () => d.cock(-8)],
    [t + 0.32, (cur) => { d.cock(10); d.jolt(1.4); d.hop(0.35); d.yawn(cur, 0.22); say('achoo!'); }],
    [t + 0.8, () => d.cock(0)],
  ],
  zoomies: ({ d, rest, facing, say }, t) => [
    [t, () => { d.setPose('walk'); d.wag(1); say('zoomies!', 2); }],
    [t + 0.05, () => { d.face(1); d.dash(70); }],
    [t + 0.5, () => { d.face(-1); d.dash(-70); }],
    [t + 0.98, () => { d.face(1); d.dash(50); }],
    [t + 1.4, () => { d.face(-1); d.dash(-30); }],
    [t + 1.78, () => { d.face(1); d.dash(0); }],
    [t + 2.25, () => { d.face(facing); d.setPose(rest); d.wag(0.7); }],
  ],
  peekaboo: ({ d, say }, t) => [
    [t, () => d.setPose({ ...PUP_POSES.peek, headY: 120 })],
    [t + 0.55, () => { d.setPose('peek'); d.jolt(1.2); say('peekaboo!'); }],
  ],
};

const ACTION_KEYS = ['woof', 'spin', 'beg', 'bow', 'hop', 'love', 'tilt', 'sneeze'];

interface PupBuddyProps {
  pose?: string | PupPose;
  facing?: 'left' | 'right' | number;
  act?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const PupBuddy: React.FC<PupBuddyProps> = ({
  pose = 'sit',
  facing = 'right',
  act,
  label = 'Teddy, waiting patiently',
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const puppetRef = useRef<TeddyPuppet | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    const bubbleEl = bubbleRef.current;
    if (!el || !bubbleEl) return;

    const svg = el.querySelector('svg');
    if (!svg) return;

    const facingNum = facing === 'left' || facing === -1 ? -1 : 1;
    const restPoseObj = typeof pose === 'string' ? PUP_POSES[pose] || PUP_POSES.sit : pose;
    const puppet = new TeddyPuppet(svg, pose, facingNum);
    puppetRef.current = puppet;
    puppet.wag(0.65);

    let queue: TimelineStep[] = [];
    let lastTime = performance.now() / 1000;
    let animId: number;
    let isVisible = true;
    let lastIdleActionTime = lastTime;
    let sayHideTime = 0;
    let pointerPos: { x: number; y: number; time: number } | null = null;
    let lastActionKey = '';
    let clickCount = 0;
    let lastClickTime = 0;
    let isPlaying = false;
    let playingUntil = 0;

    const say = (text: string, dur = 1.4) => {
      bubbleEl.textContent = text;
      bubbleEl.dataset.show = 'true';
      sayHideTime = performance.now() / 1000 + dur;
    };

    const hearts = () => {
      const rect = el.getBoundingClientRect();
      const hx = rect.width * (facingNum > 0 ? 0.7 : 0.3);
      const hy = 0.25 * rect.height;
      spawnHearts(el, hx, hy);
    };

    const actionCtx: ActionContext = {
      d: puppet,
      rest: restPoseObj,
      facing: facingNum,
      say,
      hearts,
    };

    const tick = () => {
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - lastTime);
      lastTime = now;

      // Process animation queue steps
      while (queue.length && queue[0][0] <= now) {
        const step = queue.shift();
        if (step) step[1](now);
      }

      // Toggle data-playing attribute
      const playingNow = now < playingUntil || queue.length > 0;
      if (playingNow !== isPlaying) {
        isPlaying = playingNow;
        if (isPlaying) {
          el.setAttribute('data-playing', '');
        } else {
          el.removeAttribute('data-playing');
        }
      }

      // Pointer gaze tracking
      if (pointerPos && now - pointerPos.time < 3.0) {
        puppet.lookAt(pointerPos);
      } else {
        puppet.lookAt(null);
      }

      // Idle tilt / wagging schedule (every ~9 seconds if not currently running an action)
      if (!queue.length && now - lastIdleActionTime > 9.0) {
        lastIdleActionTime = now;
        if (Math.random() < 0.5) {
          queue = ACTIONS.tilt(actionCtx, now);
          playingUntil = now + 1.8;
        } else {
          queue = [
            [now, () => puppet.wag(1.0)],
            [now + 2.2, () => puppet.wag(0.65)],
          ];
        }
      }

      // Continuous subtle act="tilt" if specified and no queue
      if (act === 'tilt' && !queue.length && !playingNow) {
        const sinVal = Math.sin(0.9 * now);
        puppet.cock(sinVal > 0.35 ? 13 : sinVal < -0.35 ? -10 : 0);
      }

      // Hide speech bubble after timeout
      if (bubbleEl.dataset.show === 'true' && now > sayHideTime) {
        bubbleEl.dataset.show = 'false';
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
      puppet.wag(1.0);
    };

    const handlePointerLeave = () => {
      puppet.petting(false);
      puppet.wag(0.65);
    };

    const handleClick = () => {
      const now = performance.now() / 1000;
      if (now - lastClickTime < 0.7) {
        clickCount += 1;
      } else {
        clickCount = 1;
      }
      lastClickTime = now;

      let chosenKey: string;
      if (clickCount >= 4) {
        chosenKey = 'zoomies';
      } else {
        const available = ACTION_KEYS.filter((k) => k !== lastActionKey);
        chosenKey = available[Math.floor(Math.random() * available.length)];
      }
      lastActionKey = chosenKey;

      puppet.reset();
      const steps = ACTIONS[chosenKey] ? ACTIONS[chosenKey](actionCtx, now) : ACTIONS.woof(actionCtx, now);
      queue = [...steps];
      playingUntil = steps[steps.length - 1][0] + 0.4;
      lastIdleActionTime = now;
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        lastTime = performance.now() / 1000;
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(animId);
      }
    });

    observer.observe(el);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    el.addEventListener('pointerenter', handlePointerEnter);
    el.addEventListener('pointerleave', handlePointerLeave);
    el.addEventListener('click', handleClick);

    animId = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointerleave', handlePointerLeave);
      el.removeEventListener('click', handleClick);
      el.removeAttribute('data-playing');
      puppetRef.current = null;
    };
  }, [pose, facing, act]);

  return (
    <div
      ref={containerRef}
      className={`pup-buddy cursor-pointer select-none ${className}`}
      style={style}
      data-facing={typeof facing === 'string' ? facing : facing < 0 ? 'left' : 'right'}
      data-live="true"
    >
      <TeddyPuppetSVG pose={pose} facing={facing} label={label} />
      <span ref={bubbleRef} aria-hidden="true" className="pup-bubble" data-show="false" />
    </div>
  );
};
