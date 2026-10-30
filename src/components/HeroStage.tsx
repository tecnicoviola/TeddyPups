import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface HeroPuppy {
  slug: string;
  displayName: string;
  breed: string;
  img: string;
  alt: string;
  aspect?: string;
}

const HERO_PUPPIES: HeroPuppy[] = [
  {
    slug: 'maltipoo-max-male',
    displayName: 'Max',
    breed: 'Maltipoo',
    img: '/images/b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp',
    alt: 'Max, male Maltipoo puppy',
    aspect: '53.8% 44.3%',
  },
  {
    slug: 'korean-teacup-maltipoo-female',
    displayName: 'Korean Teacup Maltipoo',
    breed: 'Korean Teacup Maltipoo',
    img: '/images/b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg',
    alt: 'Female Korean Teacup Maltipoo puppy',
    aspect: '52.5% 42.6%',
  },
  {
    slug: 'korean-teacup-poodle-female',
    displayName: 'Korean Teacup Poodle',
    breed: 'Korean Teacup Poodle',
    img: '/images/b942a5_14376a216177484dbbb27995d0f6aeb7-mv2.jpg',
    alt: 'Female Korean Teacup Poodle puppy',
    aspect: '54.5% 45.7%',
  },
  {
    slug: 'maltipoo-cavapoo-male',
    displayName: 'Maltipoo & Cavapoo',
    breed: 'Maltipoo & Cavapoo',
    img: '/images/b942a5_7ce7e7bd18424b6c8fb16dd30113ade2-mv2.jpg',
    alt: 'Male Maltipoo & Cavapoo puppy',
    aspect: '44.7% 29.5%',
  },
  {
    slug: 'toy-poodle-male-female',
    displayName: 'Toy Poodle',
    breed: 'Toy Poodle',
    img: '/images/b942a5_0b2c0c0d178c4005acbe28725a5ea573-mv2.jpg',
    alt: 'Toy Poodle puppy',
    aspect: '65.4% 44.7%',
  },
  {
    slug: 'maltipoo-female-2',
    displayName: 'Maltipoo',
    breed: 'Maltipoo',
    img: '/images/b942a5_2b5dcece361b4589890ae920c66a1b70-mv2.jpg',
    alt: 'Female Maltipoo puppy',
    aspect: '64.6% 42.3%',
  },
  {
    slug: 'pomeranian-female',
    displayName: 'Pomeranian',
    breed: 'Pomeranian',
    img: '/images/b942a5_556841b9a73942e5a9d782a683f3bc68-mv2.jpg',
    alt: 'Female Pomeranian puppy',
    aspect: '40.3% 44.3%',
  },
  {
    slug: 'copper-male',
    displayName: 'Copper',
    breed: 'Cavapoo',
    img: '/images/b942a5_bb73ebbb952047988f944f3a8e3052bd-mv2.jpg',
    alt: 'Copper, male Cavapoo puppy',
    aspect: '43.0% 50.5%',
  },
  {
    slug: 'shitzu-female',
    displayName: 'Shih Tzu',
    breed: 'Shih Tzu',
    img: '/images/b942a5_eb14616c76c24da89afe7fa3b7d7ae6a-mv2.jpeg',
    alt: 'Female Shih Tzu puppy',
    aspect: '44.8% 42.5%',
  },
  {
    slug: 'shitzu-male',
    displayName: 'Shih Tzu',
    breed: 'Shih Tzu',
    img: '/images/b942a5_344e49c6c34940d2b09a3ddd5c2e3234-mv2.jpg',
    alt: 'Male Shih Tzu puppy',
    aspect: '40.3% 43.6%',
  },
  {
    slug: 'maltipoo-female-1',
    displayName: 'Maltipoo',
    breed: 'Maltipoo',
    img: '/images/b942a5_7dd33c9b78c04f78a6a1c7386fb55620-mv2.jpg',
    alt: 'Female Maltipoo puppy',
    aspect: '47.5% 50.5%',
  },
  {
    slug: 'korean-teacup-pomeranian-1',
    displayName: 'Korean Teacup Pomeranian',
    breed: 'Korean Teacup Pomeranian',
    img: '/images/b942a5_a8d264c1aa754d80bc7c98917dfd1fda-mv2.jpg',
    alt: 'Female Korean Teacup Pomeranian puppy',
    aspect: '49.9% 51.3%',
  },
  {
    slug: 'blue-marle-pomeranian',
    displayName: 'Pomeranian',
    breed: 'Pomeranian',
    img: '/images/27b888_5e612a215bf343328c08d99e0e9c5a37-mv2.avif',
    alt: 'Male Pomeranian puppy',
    aspect: '50% 50%',
  },
];

const SEATS = [
  { x: '9%', w: '8.6rem', peek: 0.62, tilt: '-5deg', i: 0 },
  { x: '22.5%', w: '10.4rem', peek: 0.8, tilt: '3deg', i: 1 },
  { x: '35%', w: '9.2rem', peek: 0.7, tilt: '-2deg', i: 2 },
  { x: '65%', w: '9.4rem', peek: 0.74, tilt: '3deg', i: 3 },
  { x: '77.5%', w: '10.6rem', peek: 0.82, tilt: '-3deg', i: 4 },
  { x: '91%', w: '8.4rem', peek: 0.6, tilt: '4deg', i: 5 },
];

export const HeroStage: React.FC = () => {
  // Check for test demo modes from URL (e.g. ?demo=left or ?demo=hover)
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const demoParam = params?.get('demo');

  // 6 displayed puppy cards
  const [activePupIndices, setActivePupIndices] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [cardStates, setCardStates] = useState<Record<number, 'duck' | 'pop' | undefined>>({});
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(demoParam === 'left' ? 0 : null);
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null);

  // Exact dog eye-closing & tracking state
  const [isFaceHovered, setIsFaceHovered] = useState<boolean>(demoParam === 'hover');
  const [showSpeechBubble, setShowSpeechBubble] = useState<boolean>(demoParam === 'left');
  const [bubbleText, setBubbleText] = useState('hm?');
  const [gaze, setGaze] = useState({ x: demoParam === 'left' ? -0.85 : 0, y: demoParam === 'left' ? -0.1 : 0 });

  const isFaceHoveredRef = useRef(isFaceHovered);
  isFaceHoveredRef.current = isFaceHovered;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const teddyRef = useRef<HTMLDivElement | null>(null);
  const bubbleTimeoutRef = useRef<number | null>(null);

  const triggerSpeechBubble = React.useCallback((text: string, duration = 2400) => {
    setShowSpeechBubble(true);
    setBubbleText(text);

    if (bubbleTimeoutRef.current) {
      window.clearTimeout(bubbleTimeoutRef.current);
    }
    bubbleTimeoutRef.current = window.setTimeout(() => {
      setShowSpeechBubble(false);
    }, duration);
  }, []);
  const autoSwapTimeoutRef = useRef<number | null>(null);
  const swapQueueRef = useRef<number[]>([6, 7, 8, 9, 10, 11, 12]);
  const lastSwappedSeatRef = useRef<number>(0);

  // Mouse & Eye tracking for Teddy with exact face-hit detection
  useEffect(() => {
    let ticking = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        if (!teddyRef.current) return;

        const rect = teddyRef.current.getBoundingClientRect();
        // Dog face center in screen coordinates
        const faceCenterX = rect.left + rect.width * (212 / 300);
        const faceCenterY = rect.top + rect.height * (100 / 240);

        const dx = e.clientX - faceCenterX;
        const dy = e.clientY - faceCenterY;
        const dist = Math.hypot(dx, dy);

        // Precise facial interaction area: radius of the dog's head
        const faceRadius = rect.width * (52 / 300);
        const insideFace = dist <= faceRadius;

        // Update face hover state only on transitions to prevent repeated state triggers
        if (insideFace !== isFaceHoveredRef.current) {
          isFaceHoveredRef.current = insideFace;
          setIsFaceHovered(insideFace);
        }

        // When not hovering the face, track the cursor direction with pupils
        if (!insideFace) {
          const gx = Math.max(-1, Math.min(1, dx / 240));
          const gy = Math.max(-1, Math.min(1, dy / 180));
          setGaze({ x: gx, y: gy });

          // Only show the curiosity bubble on a real state transition, not on every pointer movement.
          if (Math.abs(gx) > 0.32) {
            triggerSpeechBubble('hm?', 2400);
          }
        }
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    };
  }, []);

  const activePupIndicesRef = useRef(activePupIndices);
  activePupIndicesRef.current = activePupIndices;
  const hoveredSeatRef = useRef(hoveredSeat);
  hoveredSeatRef.current = hoveredSeat;

  // Continuous, robust swapping animation for the arched puppy cards
  useEffect(() => {
    const swapDelays = [1900, 2500, 1700, 2300, 2000, 2800, 1800];
    let delayIdx = 0;
    let isCancelled = false;

    const performSwap = () => {
      if (isCancelled) return;

      // Pause swapping if user is actively hovering over a card or document is hidden
      if (hoveredSeatRef.current !== null || document.hidden) {
        autoSwapTimeoutRef.current = window.setTimeout(performSwap, 900);
        return;
      }

      // Pick next seat in rotation
      const nextSeat = (lastSwappedSeatRef.current + 1) % 6;
      lastSwappedSeatRef.current = nextSeat;

      // Get next puppy from the rotation queue
      if (swapQueueRef.current.length === 0) {
        swapQueueRef.current = HERO_PUPPIES.map((_, i) => i).filter(
          i => !activePupIndicesRef.current.includes(i)
        );
      }
      const nextPup = swapQueueRef.current.shift() ?? 0;
      const currentPupInSeat = activePupIndicesRef.current[nextSeat];
      swapQueueRef.current.push(currentPupInSeat);

      // 1. Duck down animation
      setCardStates(prev => ({ ...prev, [nextSeat]: 'duck' }));

      // 2. After duck animation completes (360ms), swap puppy & pop up
      setTimeout(() => {
        if (isCancelled) return;

        setActivePupIndices(prev => {
          const updated = [...prev];
          updated[nextSeat] = nextPup;
          return updated;
        });

        setCardStates(prev => ({ ...prev, [nextSeat]: 'pop' }));
        setActiveTagIndex(nextSeat);

        // Cue Teddy the mascot to look at the popped puppy and say "hm?"
        const seatEls = stageRef.current?.querySelectorAll('.tp-lineup__seat');
        const poppedSeat = seatEls?.[nextSeat] as HTMLElement | undefined;
        if (poppedSeat) {
          window.dispatchEvent(
            new CustomEvent('pup:cue', { detail: { look: poppedSeat, secs: 1.6, say: 'hm?' } })
          );
        }

        // Hide tag after 1800ms
        setTimeout(() => {
          if (!isCancelled) {
            setActiveTagIndex(prev => (prev === nextSeat ? null : prev));
          }
        }, 1800);

        // Reset state after pop settles (700ms)
        setTimeout(() => {
          if (!isCancelled) {
            setCardStates(prev => ({ ...prev, [nextSeat]: undefined }));
          }
        }, 700);
      }, 360);

      const nextDelay = swapDelays[delayIdx++ % swapDelays.length];
      autoSwapTimeoutRef.current = window.setTimeout(performSwap, nextDelay);
    };

    const initialDelay = 1800;
    autoSwapTimeoutRef.current = window.setTimeout(performSwap, initialDelay);

    return () => {
      isCancelled = true;
      if (autoSwapTimeoutRef.current) clearTimeout(autoSwapTimeoutRef.current);
    };
  }, []);

  const handleSeatEnter = (seatIdx: number) => {
    setHoveredSeat(seatIdx);
    setActiveTagIndex(seatIdx);
    triggerSpeechBubble('hm?', 2200);

    const seatEls = stageRef.current?.querySelectorAll('.tp-lineup__seat');
    const seatEl = seatEls?.[seatIdx] as HTMLElement | undefined;
    if (seatEl) {
      window.dispatchEvent(
        new CustomEvent('pup:cue', { detail: { look: seatEl, secs: 2.2, say: 'hm?' } })
      );
    }
  };

  const handleSeatLeave = (seatIdx: number) => {
    setHoveredSeat(prev => (prev === seatIdx ? null : prev));
    setActiveTagIndex(prev => (prev === seatIdx ? null : prev));
  };

  const handleTeddyClick = () => {
    triggerSpeechBubble('woof!', 1400);
  };

  return (
    <div ref={stageRef} className="tp-hero__stage">
      {/* 1. Arched Puppy Cards Lineup */}
      <ul aria-label="Some of the puppies in our showroom" className="tp-lineup">
        {SEATS.map((seat, seatIdx) => {
          const pup = HERO_PUPPIES[activePupIndices[seatIdx]] || HERO_PUPPIES[0];
          const state = cardStates[seatIdx];

          return (
            <li
              key={seatIdx}
              className="tp-lineup__seat"
              style={
                {
                  '--x': seat.x,
                  '--w': seat.w,
                  '--peek': seat.peek,
                  '--tilt': seat.tilt,
                  '--i': seat.i,
                } as React.CSSProperties
              }
            >
              <Link
                to={`/puppies/${pup.slug}`}
                aria-label={`Meet ${pup.displayName}, ${pup.breed}`}
                className="tp-lineup__pup"
                data-pup-friend="true"
                data-state={state}
                onPointerEnter={() => handleSeatEnter(seatIdx)}
                onPointerLeave={() => handleSeatLeave(seatIdx)}
                onFocus={() => handleSeatEnter(seatIdx)}
                onBlur={() => handleSeatLeave(seatIdx)}
              >
                <span className="tp-lineup__photo">
                  <img
                    alt={pup.alt}
                    decoding="async"
                    loading="eager"
                    src={pup.img}
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      objectFit: 'cover',
                      objectPosition: pup.aspect || 'center',
                    }}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 2. Floating Puppy Name / Breed Tags */}
      <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
        {SEATS.map((seat, seatIdx) => {
          const pup = HERO_PUPPIES[activePupIndices[seatIdx]] || HERO_PUPPIES[0];
          const isTagShown = activeTagIndex === seatIdx || hoveredSeat === seatIdx;

          return (
            <li
              key={seatIdx}
              className="tp-lineup__seat"
              style={
                {
                  '--x': seat.x,
                  '--w': seat.w,
                  '--peek': seat.peek,
                  '--tilt': seat.tilt,
                  '--i': seat.i,
                } as React.CSSProperties
              }
            >
              <span className="tp-lineup__ghost" data-tag={isTagShown ? 'show' : undefined}>
                <span className="tp-lineup__name font-scrawl">{pup.displayName}</span>
              </span>
            </li>
          );
        })}
      </ul>

      {/* 3. Center Dog Mascot (Exact Eye-Closing Interaction & Pointer Tracking) */}
      <div
        ref={teddyRef}
        className="pup-stop tp-hero__teddy"
        data-act="peekaboo"
        data-behind="true"
        data-facing="right"
        data-lane="true"
        data-pose="peek"
        data-pup-stop="true"
        onClick={handleTeddyClick}
        style={{ cursor: "url('/cursor/paw-press.svg') 9 6, pointer" }}
      >
        <div className="pup-buddy" data-facing="right">
          <svg
            aria-label="Teddy, the TeddyPups puppy, peeking over the quilt"
            focusable="false"
            role="img"
            style={{ overflow: 'visible' }}
            viewBox="0 0 300 240"
          >
            <g data-p="root">
              {/* Head group with dynamic tilt tracking */}
              <g
                data-p="head"
                transform={`translate(0 4) rotate(${(isFaceHovered ? 0 : 3.5 * gaze.x).toFixed(2)} 212 100)`}
                style={{ transition: 'transform 0.15s ease-out' }}
              >
                {/* Collar */}
                <path
                  d="M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z"
                  fill="#a24a1a"
                  stroke="#2a170e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  style={{ pointerEvents: 'none' }}
                />
                {/* Tag */}
                <path
                  d="M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z"
                  fill="#fbe3b4"
                  stroke="#2a170e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.4"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Left Ear - 100% faithful to original illustration */}
                <path
                  d="M177.1 78.7Q186.9 70.8 186.6 87.4Q196.0 89.9 189.9 105.5Q195.2 117.3 185.5 126.0Q184.7 142.8 175.2 141.2Q168.7 156.5 162.9 145.3Q153.1 153.2 153.4 136.6Q144.0 134.1 150.1 118.5Q144.8 106.7 154.5 98.0Q155.3 81.2 164.8 82.8Q171.3 67.5 177.1 78.7Z"
                  data-p="earL"
                  fill="#e4a352"
                  stroke="#2a170e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.4"
                  transform="rotate(-6 174 82)"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Right Ear - 100% faithful to original illustration */}
                <path
                  d="M246.9 78.7Q252.7 67.5 259.2 82.8Q268.7 81.2 269.5 98.0Q279.2 106.7 273.9 118.5Q280.0 134.1 270.6 136.6Q270.9 153.2 261.1 145.3Q255.3 156.5 248.8 141.2Q239.3 142.8 238.5 126.0Q228.8 117.3 234.1 105.5Q228.0 89.9 237.4 87.4Q237.1 70.8 246.9 78.7Z"
                  data-p="earR"
                  fill="#e4a352"
                  stroke="#2a170e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.4"
                  transform="rotate(6 250 82)"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Head fluff outline */}
                <path
                  d="M212.0 54.0Q223.4 48.2 231.5 57.5Q244.5 56.1 248.1 67.5Q260.7 70.7 259.1 82.4Q269.4 89.7 263.0 100.0Q269.4 110.3 259.1 117.6Q260.7 129.3 248.1 132.5Q244.5 143.9 231.5 142.5Q223.4 151.8 212.0 146.0Q200.6 151.8 192.5 142.5Q179.5 143.9 175.9 132.5Q163.3 129.3 164.9 117.6Q154.6 110.3 161.0 100.0Q154.6 89.7 164.9 82.4Q163.3 70.7 175.9 67.5Q179.5 56.1 192.5 57.5Q200.6 48.2 212.0 54.0Z"
                  fill="#f2be6b"
                  stroke="#2a170e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.4"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Topknot tuft */}
                <path
                  d="M195.0 52.0Q190.7 45.8 200.0 43.5Q203.2 36.9 212.0 40.0Q220.8 36.9 224.0 43.5Q233.3 45.8 229.0 52.0Q233.3 58.2 224.0 60.5Q220.8 67.1 212.0 64.0Q203.2 67.1 200.0 60.5Q190.7 58.2 195.0 52.0Z"
                  fill="#f2be6b"
                  stroke="#2a170e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Muzzle */}
                <path
                  d="M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z"
                  fill="#fbe3b4"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Blush marks - constant and faithful to the original character */}
                <circle
                  cx="181"
                  cy="116"
                  fill="#f9b9a6"
                  opacity={0.85}
                  r={7}
                  style={{ pointerEvents: 'none' }}
                />
                <circle
                  cx="243"
                  cy="116"
                  fill="#f9b9a6"
                  opacity={0.85}
                  r={7}
                  style={{ pointerEvents: 'none' }}
                />

                {/* Open Eyes State (Tracks paw cursor direction; hidden when hovering face) */}
                <g
                  data-p="eyes"
                  transform={`translate(${(3.4 * (isFaceHovered ? 0 : gaze.x)).toFixed(2)} ${(2.6 * (isFaceHovered ? 0 : gaze.y)).toFixed(2)})`}
                  style={{
                    opacity: isFaceHovered ? 0 : 1,
                    transition: 'opacity 0.12s ease-out, transform 0.08s linear',
                    pointerEvents: 'none',
                  }}
                >
                  <g data-p="open" opacity={1}>
                    <g data-p="blink" transform="translate(0 0) scale(1 1)">
                      <ellipse cx="194" cy="98" fill="#2a170e" rx="7.4" ry="8.6" />
                      <ellipse cx="230" cy="98" fill="#2a170e" rx="7.4" ry="8.6" />
                      <circle cx="196.6" cy="94.6" fill="#fff" r="2.7" />
                      <circle cx="232.6" cy="94.6" fill="#fff" r="2.7" />
                      <circle cx="192" cy="101.2" fill="#fff" r="1.2" />
                      <circle cx="228" cy="101.2" fill="#fff" r="1.2" />
                    </g>
                  </g>
                </g>

                {/* Closed Eyes State (^ ^) - smooth immediate transition on face hover */}
                <path
                  d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101"
                  data-p="happy"
                  fill="none"
                  stroke="#2a170e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.4"
                  style={{
                    opacity: isFaceHovered ? 1 : 0,
                    transition: 'opacity 0.12s ease-out',
                    pointerEvents: 'none',
                  }}
                />

                {/* Nose */}
                <path
                  d="M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z"
                  fill="#2a170e"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Mouth */}
                <path
                  d="M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2"
                  fill="none"
                  stroke="#2a170e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Tongue */}
                <path
                  d="M207.6 127.4 Q212 136.6 216.4 127.4 Z"
                  data-p="tongue"
                  fill="#e98c8c"
                  opacity="1"
                  stroke="#2a170e"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Dedicated facial interaction area for mouse enter/leave */}
                <circle
                  cx="212"
                  cy="100"
                  r="52"
                  fill="transparent"
                  style={{ cursor: "url('/cursor/paw-press.svg') 9 6, pointer", pointerEvents: 'all' }}
                  onPointerEnter={() => setIsFaceHovered(true)}
                  onPointerLeave={() => setIsFaceHovered(false)}
                />
              </g>

              {/* Paws resting over the quilt ledge */}
              <g data-p="ledge" opacity="1" style={{ pointerEvents: 'none' }}>
                <path
                  d="M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z"
                  fill="#f2be6b"
                  stroke="#2a170e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.4"
                />
                <path
                  d="M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5"
                  fill="none"
                  stroke="#2a170e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.4"
                />
              </g>
            </g>
          </svg>

          {/* Speech Bubble "hm?" */}
          <span
            aria-hidden="true"
            className="pup-bubble"
            data-show={!isFaceHovered && showSpeechBubble ? 'true' : 'false'}
            style={{
              position: 'absolute',
              bottom: '84%',
              left: '72%',
              pointerEvents: 'none',
              zIndex: 35,
            }}
          >
            {bubbleText}
          </span>
        </div>
      </div>

      {/* 4. Scalloped Quilt Base */}
      <div aria-hidden="true" className="tp-quilt">
        <svg className="tp-quilt__edge" height="40" preserveAspectRatio="none" width="100%">
          <defs>
            <pattern height="40" id="tp-scallop" patternUnits="userSpaceOnUse" width="76">
              <path d="M0 40V27A38 25 0 0 1 76 27V40Z" style={{ fill: 'var(--quilt)' }}></path>
              <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3"></path>
              <path
                d="M11 33A27 19 0 0 1 65 33"
                fill="none"
                opacity=".42"
                stroke="#2a170e"
                strokeDasharray="3.5 5.5"
                strokeLinecap="round"
                strokeWidth="1.6"
              ></path>
            </pattern>
          </defs>
          <rect fill="url(#tp-scallop)" height="40" width="100%"></rect>
        </svg>
      </div>
    </div>
  );
};
export default HeroStage;
