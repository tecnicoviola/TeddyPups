import React, { useEffect, useRef } from 'react';
import { TeddyPuppet } from './TeddyPuppet';
import { TeddyPuppetSVG } from './TeddyPuppetSVG';
import { PUP_POSES, PUP_COLORS } from './pupConstants';

const PAW_PRINT_PATH =
  'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 3.6 0 5.6-1.6 6.4-1.6.8 0 2.8 1.6 6.4 1.6 5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zm-14.7-6.2c3 0 5.5-4.2 5.5-9.4 0-5.2-2.5-9.4-5.5-9.4-3 0-5.5 4.2-5.5 9.4 0 5.2 2.5 9.4 5.5 9.4zm10.2-2.8c3 0 5.5-4.2 5.5-9.4 0-5.2-2.5-9.4-5.5-9.4-3 0-5.5 4.2-5.5 9.4 0 5.2 2.5 9.4 5.5 9.4zm9 0c3 0 5.5-4.2 5.5-9.4 0-5.2-2.5-9.4-5.5-9.4-3 0-5.5 4.2-5.5 9.4 0 5.2 2.5 9.4 5.5 9.4zm10.2 2.8c3 0 5.5-4.2 5.5-9.4 0-5.2-2.5-9.4-5.5-9.4-3 0-5.5 4.2-5.5 9.4 0 5.2 2.5 9.4 5.5 9.4z';

interface StopTrack {
  kind: 'page' | 'pin' | 'screen';
  top: number;
  from?: number;
  to?: number;
}

interface PupStopInfo {
  x: number;
  track: StopTrack;
  s: number;
  behind: boolean;
  sink: number;
  box: [number, number, number, number];
}

interface PupStopMeta {
  scene: HTMLElement | null;
  pose: string;
  facing: number;
  act: string;
  looks: HTMLElement[];
  track: HTMLElement | null;
}

const d = { x: 150, y: 228 };
const defaultBox: [number, number, number, number] = [48, 30, 288, 236];

const BOXES: Record<string, [number, number, number, number]> = {
  sit: [50, 26, 284, 234],
  peek: [148, 34, 280, 163],
  snug: [148, 40, 280, 163],
  bow: [58, 56, 292, 236],
};

const getBox = (pose: string) => BOXES[pose] ?? defaultBox;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth01 = (v: number) => v * v * (3 - 2 * v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function getTrackPoint(stop: PupStopInfo, scrollY: number) {
  const tr = stop.track;
  let top = tr.top;
  if (tr.kind === 'page') {
    top = tr.top - scrollY;
  } else if (tr.kind === 'pin') {
    if (tr.from !== undefined && tr.to !== undefined) {
      if (scrollY < tr.from) top = tr.top - (scrollY - tr.from);
      else if (scrollY > tr.to) top = tr.top - (scrollY - tr.to);
    }
  }
  return {
    x: stop.x + d.x * stop.s,
    y: top + d.y * stop.s,
  };
}

function findSegment(holds: [number, number][], scrollY: number) {
  if (!holds.length || scrollY <= holds[0][1]) return { k: 0, t: 0 };
  for (let a = 0; a < holds.length - 1; a++) {
    const s = holds[a][1];
    const n = holds[a + 1][0];
    if (scrollY < n) return { k: a, t: clamp01((scrollY - s) / Math.max(1, n - s)) };
    if (scrollY <= holds[a + 1][1]) return { k: a + 1, t: 0 };
  }
  return { k: holds.length - 1, t: 0 };
}

const gSoft = (e: number, t: number, a: number) => {
  const s = (e - t) / a;
  return s > 20 ? e : t + a * Math.log1p(Math.exp(s));
};
const vSoft = (e: number, t: number, a: number) => -gSoft(-e, -t, a);

function clampBox(
  x: number,
  y: number,
  scale: number,
  box: [number, number, number, number],
  safe: { left: number; top: number; right: number; bottom: number },
  margin = 8
) {
  const r = (d.x - box[0]) * scale;
  const i = (box[2] - d.x) * scale;
  const o = (d.y - box[1]) * scale;
  const c = (box[3] - d.y) * scale;
  const outX =
    safe.right - safe.left > r + i
      ? vSoft(gSoft(x, safe.left + r, margin), safe.right - i, margin)
      : (safe.left + safe.right) / 2 - (i - r) / 2;
  const outY =
    safe.bottom - safe.top > o + c
      ? vSoft(gSoft(y, safe.top + o, margin), safe.bottom - c, margin)
      : safe.bottom - c;
  return { x: outX, y: outY };
}

function bezierPoint(
  p0: { x: number; y: number },
  c1: { x: number; y: number },
  c2: { x: number; y: number },
  p1: { x: number; y: number },
  t: number
) {
  const l = 1 - t;
  const r = l * l * l;
  const i = 3 * l * l * t;
  const o = 3 * l * t * t;
  const d = t * t * t;
  return {
    x: r * p0.x + i * c1.x + o * c2.x + d * p1.x,
    y: r * p0.y + i * c1.y + o * c2.y + d * p1.y,
  };
}

export const PupJourney: React.FC = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const bubbleAtRef = useRef<HTMLSpanElement>(null);
  const printsRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const actor = actorRef.current;
    const body = bodyRef.current;
    const bubble = bubbleRef.current;
    const bubbleAt = bubbleAtRef.current;
    const prints = printsRef.current;
    const probe = probeRef.current;
    if (!layer || !actor || !body || !bubble || !bubbleAt || !prints || !probe) return;

    const svg = body.querySelector('svg');
    if (!svg) return;

    let puppet: TeddyPuppet | null = null;
    let stops: PupStopInfo[] = [];
    let meta: PupStopMeta[] = [];
    let holds: [number, number][] = [];
    let isLane = false;
    let isRunning = false;

    const printsList = Array.from(prints.children) as HTMLElement[];
    let printIdx = 0;

    let bubbleUntil = 0;
    const showBubble = (text: string, time: number, dur = 1.4) => {
      bubble.textContent = text;
      bubble.dataset.show = 'true';
      bubbleUntil = time + dur;
    };

    // Demo query parameters for validation (?demo=hover or ?demo=left)
    const demoParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('demo') : null;

    let pointerLook: { x: number; y: number; t: number } | null = null;
    let targetLook: { el: HTMLElement; until: number } | null = null;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') {
        pointerLook = { x: e.clientX, y: e.clientY, t: performance.now() / 1000 };
      }
    };

    const onPupCue = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const now = performance.now() / 1000;
      if (detail.say) {
        // Speech-only cue (no element to look at) — e.g. from HomeChatSection
        showBubble(detail.say, now, detail.secs ?? 1.8);
      }
      if (detail.look) {
        targetLook = { el: detail.look, until: now + (detail.secs ?? 1.8) };
        if (detail.say) {
          showBubble(detail.say, now, detail.secs ?? 1.8);
        }
        // Only show 'hm?' for stop 0 when there's no explicit say message
        // and only briefly — not permanently
        else if (currentStopIdx === 0) {
          showBubble('hm?', now, 1.2);
        }
      }
    };

    let lastTime = performance.now() / 1000;
    let lastScrollY = window.scrollY;
    let prevPos: { x: number; y: number } | null = null;
    const spring = { x: 0, y: 0, s: 0 };
    let standingTime = 0;
    let currentStopIdx = -1;
    let lastScrollTime = performance.now() / 1000;
    let scrollDir = 1;
    let totalWalked = 0;
    let lastFootStep = 0;
    let lastStepStop = -1;

    // Scan all stops on the page
    const scanStops = () => {
      const isMobile = window.matchMedia(
        '(max-width: 767px), (pointer: coarse) and (max-height: 519px)'
      ).matches;
      const viewW = document.documentElement.clientWidth;
      const viewH = probe.getBoundingClientRect().height || window.innerHeight;
      const headerH = document.getElementById('site-header')?.offsetHeight ?? 76;
      const safe = {
        left: 10,
        top: headerH + 10,
        right: viewW - 10,
        bottom: viewH - 10,
      };

      const stopEls = Array.from(
        document.querySelectorAll<HTMLElement>('[data-pup-stop]')
      ).filter((el) => el.getClientRects().length);

      if (stopEls.length < 2) return false;

      stops = [];
      meta = [];
      const rawHolds: [number, number][] = [];

      stopEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const pose = el.dataset.pose || 'sit';
        const act = el.dataset.act ?? '';
        const scale = (rect.width / 300) * (act === 'basket' || isMobile ? 1 : 1.12);
        const pivot = pose === 'peek' ? { x: d.x, y: 159 } : d;

        // Track calculation
        let trackKind: 'page' | 'pin' = 'page';
        let trackTop = rect.top + window.scrollY;
        let pinFrom: number | undefined;
        let pinTo: number | undefined;

        let stickyParent: HTMLElement | null = null;
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          if (getComputedStyle(p).position === 'sticky') {
            stickyParent = p;
            break;
          }
        }

        if (stickyParent) {
          const stickyTop = parseFloat(getComputedStyle(stickyParent).top) || 0;
          const offsetInsideSticky = rect.top - stickyParent.getBoundingClientRect().top;
          const parentEl = stickyParent.parentElement!;
          const parentBottom =
            parentEl.getBoundingClientRect().bottom -
            (parseFloat(getComputedStyle(parentEl).paddingBottom) || 0);
          const fromY = stickyParent.getBoundingClientRect().top + window.scrollY - stickyTop;
          const toY = parentBottom + window.scrollY - stickyParent.getBoundingClientRect().height - stickyTop;
          if (toY > fromY) {
            trackKind = 'pin';
            trackTop = stickyTop + offsetInsideSticky;
            pinFrom = fromY;
            pinTo = toY;
          }
        }

        trackTop += pivot.y * (rect.width / 300 - scale);
        const stopX = rect.left + pivot.x * (rect.width / 300 - scale);
        const box = getBox(pose);
        const sceneEl = el.closest<HTMLElement>('[data-pup-scene]');

        stops.push({
          x: stopX,
          track: {
            kind: trackKind,
            top: trackTop,
            from: pinFrom,
            to: pinTo,
          },
          s: scale,
          behind: el.dataset.behind === 'true',
          sink: 0,
          box,
        });

        meta.push({
          scene: sceneEl,
          pose,
          facing: el.dataset.facing === 'left' ? -1 : 1,
          act,
          looks: sceneEl ? Array.from(sceneEl.querySelectorAll<HTMLElement>('[data-pup-look]')) : [],
          track: act === 'treadmill' ? sceneEl?.querySelector<HTMLElement>('[data-treadmill]') ?? null : null,
        });

        // Compute hold range
        if (trackKind === 'pin') {
          rawHolds.push([pinFrom!, pinTo!]);
        } else {
          const sTop = trackTop;
          const nTop = sTop + box[1] * scale;
          const lTop = sTop + box[3] * scale;
          const rMid = (nTop + lTop) / 2;
          const rangeH = safe.bottom - safe.top;
          const ratioA = isMobile ? 0.6 : 0.42;
          const ratioB = isMobile ? 0.86 : 0.78;
          let o = rMid - (safe.top + ratioB * rangeH);
          let dMid = rMid - (safe.top + ratioA * rangeH);
          o = Math.max(o, lTop - safe.bottom);
          dMid = Math.min(dMid, nTop - safe.top);
          if (o > dMid) o = dMid = rMid - (safe.top + rangeH / 2);
          rawHolds.push([o, dMid]);
        }
      });

      // Normalize holds
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      holds = rawHolds.map(([from, to]) => (from <= to ? [from, to] : [(from + to) / 2, (from + to) / 2]));
      if (holds.length) {
        holds[0][0] = -Infinity;
        holds[holds.length - 1][1] = Infinity;
        holds[holds.length - 1][0] = Math.min(holds[holds.length - 1][0], maxScroll - 1);
      }
      for (let e = 0; e < holds.length - 1; e++) {
        const cur = holds[e];
        const next = holds[e + 1];
        if (next[0] < cur[1]) {
          const mid = (cur[1] + next[0]) / 2;
          cur[1] = Math.max(cur[0], mid);
          next[0] = Math.min(next[1], mid);
          if (next[0] < cur[1]) next[0] = cur[1];
        }
      }

      isLane = isMobile;
      return true;
    };

    // Solve position along trajectory for a given scrollY
    const solveTrajectory = (curScroll: number) => {
      const viewW = document.documentElement.clientWidth;
      const headerH = document.getElementById('site-header')?.offsetHeight ?? 76;
      const safe = {
        left: 10,
        top: headerH + 10,
        right: viewW - 10,
        bottom: window.innerHeight - 10,
      };

      const seg = findSegment(holds, curScroll);
      const P = seg.k;
      const B = seg.t;

      if (B <= 0 || P >= stops.length - 1) {
        const stop = stops[P];
        const pt = getTrackPoint(stop, curScroll);
        const clamped = clampBox(pt.x, pt.y, stop.s, stop.box, safe);
        return {
          x: clamped.x,
          y: clamped.y,
          s: stop.s,
          front: !stop.behind,
          airborne: false,
          k: P,
          t: 0,
          walked: 0,
        };
      }

      const r = stops[P];
      const i = stops[P + 1];
      const fromScroll = holds[P][1];
      const toScroll = holds[P + 1][0];
      const gSpan = Math.max(1, toScroll - fromScroll);
      const v = clamp01((curScroll - fromScroll) / gSpan);

      const kPt = getTrackPoint(r, fromScroll);
      const iPt = getTrackPoint(i, toScroll);

      // Bezier control points
      const dx = iPt.x - kPt.x;
      const safeW = safe.right - safe.left;
      const lSpan = Math.max(0.45 * Math.abs(dx), 0);
      const rDir = dx >= 0 ? 1 : -1;
      let c1 = { x: kPt.x + rDir * lSpan, y: kPt.y };
      let c2 = { x: iPt.x - rDir * lSpan, y: iPt.y };
      const dMin = 0.14 * safeW;
      if (Math.abs(dx) < dMin) {
        const sign = (kPt.x + iPt.x) / 2 < (safe.left + safe.right) / 2 ? 1 : -1;
        const push = sign * (dMin - Math.abs(dx)) * 0.9;
        c1 = { x: c1.x + push, y: lerp(kPt.y, iPt.y, 0.2) };
        c2 = { x: c2.x + push, y: lerp(kPt.y, iPt.y, 0.8) };
      }

      const clampPt = (pt: { x: number; y: number }) => ({
        x: Math.min(safe.right, Math.max(safe.left, pt.x)),
        y: Math.min(safe.bottom, Math.max(safe.top, pt.y)),
      });

      const bez = {
        p0: kPt,
        c1: clampPt(c1),
        c2: clampPt(c2),
        p1: iPt,
      };

      // Quintic ease along bezier
      const wEase = v * v * v * (v * (6 * v - 15) + 10);
      const bezMid = bezierPoint(bez.p0, bez.c1, bez.c2, bez.p1, wEase);
      const scaleInterp = lerp(r.s, i.s, smooth01(clamp01(v / 0.65)));

      let posY = bezMid.y;
      let isAirborne = false;

      // Jump / hop out from behind cloud/quilt
      if (r.behind && v < 0.36) {
        const hopH = Math.sin((v / 0.36) * Math.PI) * Math.min(64 * r.s, 72);
        posY -= hopH;
        isAirborne = v < 0.32;
      }
      if (i.behind && v > 0.68) {
        const hopH = Math.sin(((v - 0.68) / 0.32) * Math.PI) * Math.min(56 * i.s, 60);
        posY -= hopH;
        isAirborne = true;
      }

      // Emerge in front of quilt when v >= 0.12
      const isFront = !(r.behind && v < 0.12 || i.behind && v > 0.92);

      const clamped = clampBox(bezMid.x, posY, scaleInterp, defaultBox, safe);

      // Walked arc-length approximation
      let walkedDist = 0;
      let prevSample = bez.p0;
      const steps = Math.max(1, Math.ceil(32 * clamp01(v)));
      for (let s = 1; s <= steps; s++) {
        const curSample = bezierPoint(bez.p0, bez.c1, bez.c2, bez.p1, (s / steps) * clamp01(v));
        walkedDist += Math.hypot(curSample.x - prevSample.x, curSample.y - prevSample.y);
        prevSample = curSample;
      }

      return {
        x: clamped.x,
        y: clamped.y,
        s: scaleInterp,
        front: isFront,
        airborne: isAirborne,
        k: P,
        t: v,
        walked: walkedDist,
      };
    };

    // Animation frame tick
    let rafId: number;
    const tick = () => {
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - lastTime);
      lastTime = now;

      const curScroll = window.scrollY;
      const scrollDelta = curScroll - lastScrollY;
      lastScrollY = curScroll;
      if (Math.abs(scrollDelta) > 0.5) {
        lastScrollTime = now;
        scrollDir = scrollDelta > 0 ? 1 : -1;
      }

      const traj = solveTrajectory(curScroll);

      // Spring decay for smooth position updates
      const springDamp = Math.exp(-dt / 0.28);
      spring.x *= springDamp;
      spring.y *= springDamp;
      spring.s *= springDamp;
      if (Math.abs(spring.x) < 0.05 && Math.abs(spring.y) < 0.05) {
        spring.x = spring.y = 0;
      }

      const curScale = traj.s + spring.s;
      const posX = traj.x + spring.x;
      const posY = traj.y + spring.y;

      // Update layer attributes (controls z-index: 15 behind quilt vs 30 in front)
      if (layer.dataset.front !== String(traj.front)) {
        layer.dataset.front = String(traj.front);
      }

      // Update actor transform
      actor.style.transform = `translate3d(${(posX - d.x * curScale).toFixed(2)}px, ${(posY - d.y * curScale).toFixed(2)}px, 0)`;
      body.style.transform = `scale(${curScale.toFixed(4)})`;

      const isAtStop = traj.t === 0;
      const stopIdx = traj.k;

      if (puppet) {
        if (isAtStop) {
          // Mascot is holding at a stop
          if (currentStopIdx !== stopIdx) {
            currentStopIdx = stopIdx;
            const currentMeta = meta[stopIdx];
            puppet.reset();
            puppet.setPose(currentMeta.pose);
            puppet.face(currentMeta.facing, 0.14);
            puppet.stride(0);
            puppet.wag(currentMeta.act === 'basket' ? 0.3 : 0.7);
            puppet.jolt(0.4);
          }

          standingTime = 0;
          const currentMeta = meta[stopIdx];

          // Face hover hit detection for Stop 0 (Hero): immediately closes eyes into (^ ^)
          let isFaceHovered = false;
          if (stopIdx === 0 && pointerLook && now - pointerLook.t < 2.0) {
            const headPivotX =
              puppet.facingDir > 0 ? PUP_COLORS.headCenter[0] : PUP_COLORS.W - PUP_COLORS.headCenter[0];
            const headCenterX = posX - d.x * curScale + headPivotX * curScale;
            const headCenterY = posY - d.y * curScale + PUP_COLORS.headCenter[1] * curScale;
            const dist = Math.hypot(pointerLook.x - headCenterX, pointerLook.y - headCenterY);
            isFaceHovered = dist <= 56 * curScale;
          }

          if (isFaceHovered || (demoParam === 'hover' && stopIdx === 0)) {
            puppet.petting(true);
            puppet.wag(1);
            bubble.dataset.show = 'false';
          } else {
            puppet.petting(false);
            if (demoParam === 'left' && stopIdx === 0) {
              puppet.lookAt({ x: posX - 320, y: posY - 40 });
              showBubble('hm?', now, 2.5);
            } else if (targetLook && targetLook.until > now) {
              const rect = targetLook.el.getBoundingClientRect();
              puppet.lookAt({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            } else if (pointerLook && now - pointerLook.t < 2.5) {
              puppet.lookAt(pointerLook);
              if (stopIdx === 0) {
                const headPivotX =
                  puppet.facingDir > 0 ? PUP_COLORS.headCenter[0] : PUP_COLORS.W - PUP_COLORS.headCenter[0];
                const headCenterX = posX - d.x * curScale + headPivotX * curScale;
                const dx = pointerLook.x - headCenterX;
                if (Math.abs(dx) > 48 && now - pointerLook.t < 0.25) {
                  if (bubble.dataset.show !== 'true' || bubble.textContent !== 'hm?') {
                    showBubble('hm?', now, 2.0);
                  }
                }
              }
            } else {
              puppet.lookAt(null);
            }
          }

          // Treadmill walking stride coordination at Meet section
          if (currentMeta.act === 'treadmill') {
            const trackEl = document.querySelector('[data-treadmill="true"]') as HTMLElement | null;
            if (trackEl) {
              const transform = trackEl.style.transform;
              // Handle both translateX(...) and translate3d(...) forms
              const match3d = /translate3d\(([-\d.]+)px/.exec(transform);
              const match1d = /translateX\(([-\d.]+)px\)/.exec(transform);
              const rawVal = match3d ? match3d[1] : match1d ? match1d[1] : null;
              if (rawVal !== null) {
                const scrollDist = Math.abs(parseFloat(rawVal));
                puppet.setPose('walk');
                puppet.stride(Math.abs(scrollDelta) > 0.1 ? 1 : 0);
                puppet.walkedTo(scrollDist / curScale);
              } else {
                // No transform yet — dog is at start, still walking
                puppet.setPose('walk');
                puppet.stride(Math.abs(scrollDelta) > 0.1 ? 1 : 0);
              }
            }
          }
        } else {
          // Mascot is traveling between stops
          currentStopIdx = -1;
          const movedDist = prevPos ? Math.hypot(posX - prevPos.x, posY - prevPos.y) : 0;
          standingTime = movedDist > 0.25 ? 0 : standingTime + dt;

          // Stage 2 approach speech bubble ("coming?")
          if (stopIdx === 0 && traj.t >= 0.18 && traj.t <= 0.48 && scrollDelta >= 0) {
            if (bubble.textContent !== 'coming?' || bubble.dataset.show !== 'true') {
              showBubble('coming?', now, 2.0);
            }
          }

          if (traj.airborne) {
            puppet.setPose('hop');
            puppet.stride(0);
          } else if (standingTime > 0.3) {
            puppet.setPose('stand');
            puppet.stride(0);
          } else {
            puppet.setPose('walk');
            puppet.stride(1);
          }

          totalWalked += movedDist;
          puppet.walkedTo(totalWalked / Math.max(0.05, curScale));

          // Turn toward movement direction
          if (prevPos) {
            const moveDx = posX - prevPos.x;
            if (Math.abs(moveDx) > 0.6 && Math.abs(moveDx) > 0.35 * Math.abs(posY - prevPos.y)) {
              puppet.face(moveDx > 0 ? 1 : -1, 0.16);
            }
          }

          // Spawn ground paw prints along path
          const stepInterval = 34 * curScale;
          const stepCount = Math.floor(traj.walked / Math.max(1, stepInterval));
          if (lastStepStop === stopIdx && stepCount !== lastFootStep && !traj.airborne && prevPos) {
            const isAlt = stepCount % 2 === 1;
            const footOffset = isAlt ? 186 : 110;
            const footX = posX - d.x * curScale + (puppet.facingDir > 0 ? footOffset : PUP_COLORS.W - footOffset) * curScale;
            const footY = posY - d.y * curScale + 226 * curScale + (isAlt ? -4 : 4) * curScale;
            const rot = Math.atan2(posY - prevPos.y + scrollDelta, posX - prevPos.x) + Math.PI / 2;
            const size = 14 * Math.max(0.75, 1.5 * curScale);

            const pr = printsList[printIdx++ % printsList.length];
            if (pr) {
              pr.style.transform = `translate(${(footX - size / 2).toFixed(1)}px, ${(footY - size / 2).toFixed(1)}px) rotate(${rot.toFixed(3)}rad)`;
              pr.style.width = pr.style.height = `${size.toFixed(1)}px`;
              pr.animate(
                [
                  { opacity: 0 },
                  { opacity: 0.45, offset: 0.08 },
                  { opacity: 0.45, offset: 0.5 },
                  { opacity: 0 },
                ],
                { duration: 2600, easing: 'ease-out' }
              );
            }
          }
          lastStepStop = stopIdx;
          lastFootStep = stepCount;

          if (pointerLook && now - pointerLook.t < 2.5) {
            puppet.lookAt(pointerLook);
          } else {
            puppet.lookAt(null);
          }
        }

        prevPos = { x: posX, y: posY };

        // Speech bubble display
        if (bubble.dataset.show === 'true') {
          if (now > bubbleUntil) {
            bubble.dataset.show = 'false';
          }
          const bubbleX = (puppet.facingDir > 0 ? 214 : PUP_COLORS.W - 214) * curScale;
          bubbleAt.style.transform = `translate(${bubbleX.toFixed(1)}px, ${(30 * curScale).toFixed(1)}px)`;
        }

        puppet.tick(dt, now);
      }

      rafId = requestAnimationFrame(tick);
    };

    // Mascot facial hover / click triggers
    const onActorEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && puppet) {
        puppet.petting(true);
        puppet.wag(1);
      }
    };

    const onActorLeave = () => {
      if (puppet) {
        puppet.petting(false);
        puppet.wag(currentStopIdx >= 0 && meta[currentStopIdx]?.act === 'basket' ? 0.3 : 0.7);
      }
    };

    const onActorClick = () => {
      if (!puppet) return;
      const now = performance.now() / 1000;
      puppet.hop(1.35);
      showBubble('woof!', now);
    };

    // Initialize journey
    const startJourney = () => {
      if (isRunning) return;
      if (!scanStops()) return;

      document.documentElement.dataset.pup = isLane ? 'lane' : 'live';
      layer.hidden = false;

      const firstMeta = meta[0];
      puppet = new TeddyPuppet(svg, firstMeta.pose, firstMeta.facing);
      isRunning = true;
      lastTime = performance.now() / 1000;
      lastScrollY = window.scrollY;

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pup:cue', onPupCue);
      window.addEventListener('pupcue', onPupCue);
      actor.addEventListener('pointerenter', onActorEnter);
      actor.addEventListener('pointerleave', onActorLeave);
      actor.addEventListener('click', onActorClick);

      rafId = requestAnimationFrame(tick);
    };

    const stopJourney = () => {
      if (!isRunning) return;
      isRunning = false;
      cancelAnimationFrame(rafId);
      delete document.documentElement.dataset.pup;
      layer.hidden = true;
      delete layer.dataset.front;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pup:cue', onPupCue);
      window.removeEventListener('pupcue', onPupCue);
      actor.removeEventListener('pointerenter', onActorEnter);
      actor.removeEventListener('pointerleave', onActorLeave);
      actor.removeEventListener('click', onActorClick);
      puppet = null;
    };

    const resizeObserver = new ResizeObserver(() => {
      if (!isRunning) return;
      scanStops();
    });
    resizeObserver.observe(document.body);
    window.addEventListener('resize', scanStops);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = () => {
      if (motionQuery.matches) stopJourney();
      else startJourney();
    };
    motionQuery.addEventListener('change', handleMotion);

    handleMotion();

    return () => {
      stopJourney();
      resizeObserver.disconnect();
      window.removeEventListener('resize', scanStops);
      motionQuery.removeEventListener('change', handleMotion);
    };
  }, []);

  return (
    <>
      {/* Probe element to measure view height */}
      <div ref={probeRef} aria-hidden={true} className="pup-probe" />

      {/* Ground paw print marks spawned along trajectory */}
      <div ref={printsRef} aria-hidden={true} className="pup-prints">
        {Array.from({ length: 24 }, (_, i) => (
          <svg key={i} viewBox="0 0 64 64">
            <path d={PAW_PRINT_PATH} />
          </svg>
        ))}
      </div>

      {/* Moving Mascot Stage Layer */}
      <div ref={layerRef} aria-hidden={true} className="pup-layer" hidden={true} data-front="true">
        <div ref={actorRef} className="pup-actor">
          <div ref={bodyRef} className="pup-actor__body">
            <TeddyPuppetSVG pose="peek" />
          </div>
          <span ref={bubbleAtRef} className="pup-bubble-at">
            <span ref={bubbleRef} className="pup-bubble" data-show="false" />
          </span>
        </div>
      </div>
    </>
  );
};

export default PupJourney;

