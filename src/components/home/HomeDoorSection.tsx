import React, { useEffect, useRef } from 'react';
import { TeddyPuppetSVG } from '../pup/TeddyPuppetSVG';

export const HomeDoorSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    let rafId: number;
    const onScroll = () => {
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight || 800;

      // Door opens when section enters viewport — matching original css animation-range:
      // "entry 80% cover 52%". Open when top < 80% vh, close when top > 80% vh.
      // The CSS handles the actual door transform via [data-visited=true].
      const threshold = vh * 0.72;
      const isVisible = rect.top < threshold;

      const wasVisited = sec.dataset.visited === 'true';
      if (isVisible !== wasVisited) {
        sec.dataset.visited = String(isVisible);
      }
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
    <div data-section="cta">
      <section
        ref={sectionRef}
        aria-labelledby="cta-title"
        className="tp-scene tp-home"
        data-pup-scene="true"
        data-tone="dark"
        style={
          {
            '--sky-top': '#2f1a10',
            '--sky-bottom': '#24130b',
          } as React.CSSProperties
        }
      >
        <div className="tp-home__copy gutter">
          <h2 className="font-plush text-huge" id="cta-title">
            Ready to meet your new best friend?
          </h2>
          <p className="tp-home__lede">
            Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.
          </p>
        </div>

        <div className="tp-house">
          <span aria-hidden="true" className="tp-house__plant tp-house__plant--left" />
          <span aria-hidden="true" className="tp-house__lamp" />
          <div className="tp-house__doorway">
            <span className="tp-house__inside">
              <img
                alt="Max, waiting inside"
                decoding="async"
                loading="lazy"
                sizes="16rem"
                src="/images/b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp"
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  objectFit: 'cover',
                  objectPosition: '53.8% 44.3%',
                  backgroundColor: '#785838',
                }}
              />
            </span>
            {/* Door element — transform controlled entirely by CSS:
                html[data-pup] .tp-house__door => rotateY(0) (closed)
                html[data-pup] .tp-home[data-visited=true] .tp-house__door => rotateY(-102deg) (open)
                This matches original behavior: door opens when dog arrives */}
            <span
              aria-hidden="true"
              className="tp-house__door"
            >
              <span className="tp-house__peep" />
              <span className="tp-house__knob" />
            </span>
          </div>
          <span aria-hidden="true" className="tp-house__plant tp-house__plant--right" />
          <span aria-hidden="true" className="tp-house__mat font-scrawl">
            welcome home
          </span>

          {/* Puppy Stop 7 */}
          <div
            className="pup-stop tp-house__teddy"
            data-facing="right"
            data-pose="bow"
            data-pup-stop="true"
          >
            <div className="pup-buddy" data-facing="right">
              <TeddyPuppetSVG pose="bow" />
              <span aria-hidden="true" className="pup-bubble" data-show="false" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
