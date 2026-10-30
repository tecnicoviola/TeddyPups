import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import meetPuppies from '../data/meetPuppies.json';
import { TeddyPuppetSVG } from './pup/TeddyPuppetSVG';
import { resolvePublicAssetUrl } from '../utils/mediaAssets';

export const MeetThePups: React.FC = () => {
  const pinRangeRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hallRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  const [isPinned, setIsPinned] = useState(false);
  const [overflow, setOverflow] = useState(0);

  // Compute door width and horizontal overflow
  useLayoutEffect(() => {
    const updateDimensions = () => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      setIsPinned(desktop);

      const track = trackRef.current;
      const hall = hallRef.current;
      const stage = stageRef.current;

      if (hall && track && desktop) {
        const head = stage?.querySelector('.tp-meet__head') as HTMLElement | null;
        const plates = Array.from(track.querySelectorAll('.tp-door__plate')) as HTMLElement[];
        const plateMaxH = Math.max(64, ...plates.map((p) => p.offsetHeight));
        const floorH = (hall.querySelector('.tp-meet__floor') as HTMLElement | null)?.offsetHeight ?? 0;
        const stageH = stage ? stage.clientHeight : window.innerHeight;
        const headBottom = head ? head.offsetTop + head.offsetHeight : 0;
        const doorW = Math.max(
          128,
          Math.min(256, 0.15 * window.innerWidth, (stageH - headBottom - floorH - plateMaxH - 40) / 1.3)
        );

        hall.style.setProperty('--door-w', `${doorW.toFixed(0)}px`);
      } else {
        hall?.style.removeProperty('--door-w');
      }

      if (track) {
        const ov = Math.max(0, track.scrollWidth - window.innerWidth);
        setOverflow(ov);
      }
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    if (trackRef.current) ro.observe(trackRef.current);
    if (hallRef.current?.parentElement) ro.observe(hallRef.current.parentElement);
    window.addEventListener('resize', updateDimensions);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Scroll listener to drive horizontal treadmill translation and door opening triggers
  useEffect(() => {
    if (!isPinned) {
      // In non-pinned mobile mode, open all doors by default
      if (trackRef.current) {
        Array.from(trackRef.current.children).forEach((child) => {
          (child as HTMLElement).dataset.open = 'true';
        });
      }
      return;
    }

    const pinRange = pinRangeRef.current;
    const track = trackRef.current;
    const hall = hallRef.current;
    if (!pinRange || !track || !hall) return;

    let rafId: number;

    const onScroll = () => {
      const rect = pinRange.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      const currentX = -progress * overflow;

      track.style.transform = `translate3d(${currentX.toFixed(1)}px, 0, 0)`;
      hall.style.setProperty('--floor-x', `${currentX.toFixed(1)}px`);

      // Threshold at 36vw where kennel doors swing open
      const threshold = 0.36 * window.innerWidth;

      for (let i = 0; i < track.children.length; i++) {
        const door = track.children[i] as HTMLElement;
        if (door.classList.contains('tp-door--all')) {
          door.dataset.open = 'true';
          continue;
        }

        const doorPos = door.offsetLeft + currentX;
        const shouldBeOpen = doorPos < threshold;
        const wasOpen = door.dataset.open === 'true';

        if (wasOpen !== shouldBeOpen) {
          door.dataset.open = String(shouldBeOpen);
          if (shouldBeOpen) {
            // Trigger mascot to look at opened puppy door
            window.dispatchEvent(
              new CustomEvent('pup:cue', {
                detail: { look: door, secs: 0.9 },
              })
            );
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isPinned, overflow]);

  return (
    <div data-section="meet">
      <section
        aria-labelledby="meet-title"
        className="tp-scene tp-meet"
        data-pup-scene="true"
        data-tone="light"
        data-pinned={isPinned ? 'true' : undefined}
        style={
          {
            '--sky-top': '#fff1d8',
            '--sky-bottom': '#fbe3b4',
          } as React.CSSProperties
        }
      >
        <div
          ref={pinRangeRef}
          data-pin-range="true"
          style={{
            height: isPinned ? `calc(100vh + ${Math.round(0.8 * overflow)}px)` : undefined,
            '--pinned': isPinned ? 1 : 0,
          } as React.CSSProperties}
        >
          <div ref={stageRef} className="tp-meet__stage">
            <header className="tp-meet__head gutter">
              <div>
                <h2 id="meet-title" className="font-plush text-huge">
                  Meet the pups
                </h2>
                <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">
                  Real puppies, real photos, looking for their families right now.
                </p>
              </div>
              <Link to="/puppies" className="btn btn-primary shrink-0">
                See all available puppies
              </Link>
            </header>

            <div ref={hallRef} className="tp-meet__hall">
              <ol
                ref={trackRef}
                className="tp-meet__track"
                data-treadmill="true"
                aria-label="Puppies looking for a family"
              >
                {meetPuppies.map((pup, idx) => {
                  const puppyImage = resolvePublicAssetUrl(pup.img);

                  return (
                    <li
                      key={pup.slug}
                      className="tp-door"
                      data-open={isPinned ? 'false' : 'true'}
                    >
                      <Link
                        to={`/puppies/${pup.slug}`}
                        className="tp-door__link"
                        style={{ '--door': pup.doorColor } as React.CSSProperties}
                      >
                        <span className="tp-door__plate">
                          <span className="font-plush tp-door__name">{pup.name}</span>
                          <span className="tp-door__meta">{pup.meta}</span>
                        </span>
                        <span className="tp-door__frame">
                          <span className="tp-door__room">
                            <img
                              alt={pup.alt}
                              src={puppyImage || '/brand/logo.png'}
                              decoding="async"
                              loading={idx < 4 ? 'eager' : 'lazy'}
                              style={{
                                position: 'absolute',
                                height: '100%',
                                width: '100%',
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0,
                                objectFit: 'cover',
                                objectPosition: pup.objectPosition,
                                backgroundColor: pup.bgColor,
                              }}
                            />
                          </span>
                          <span aria-hidden="true" className="tp-door__way">
                            <span className="tp-door__leaf">
                              <svg
                                aria-hidden="true"
                                className="tp-door__peephole"
                                fill="currentColor"
                                viewBox="0 0 64 64"
                              >
                                <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
                              </svg>
                              <span className="tp-door__knob"></span>
                            </span>
                          </span>
                          <span className="tp-door__tag font-scrawl">{pup.tag}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}

                <li className="tp-door tp-door--all" data-open="true">
                  <Link to="/puppies" className="tp-door__link">
                    <span className="tp-door__frame tp-door__frame--all">
                      <span className="font-plush tp-door__all">Meet them all</span>
                    </span>
                  </Link>
                </li>
              </ol>

              <div aria-hidden="true" className="tp-meet__floor" />

              {/* Stop 1 for Mascot Journey */}
              <div
                className="pup-stop tp-meet__teddy"
                data-pose={isPinned ? 'walk' : 'sit'}
                data-act={isPinned ? 'treadmill' : undefined}
                data-facing="right"
                data-pup-stop="true"
              >
                <div className="pup-buddy" data-facing="right">
                  <TeddyPuppetSVG pose={isPinned ? 'walk' : 'sit'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MeetThePups;

