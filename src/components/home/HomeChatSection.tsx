import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TeddyPuppetSVG } from '../pup/TeddyPuppetSVG';

const PAW_PATH =
  'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z';

export const HomeChatSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stepsListRef = useRef<HTMLOListElement>(null);
  const prevStepRef = useRef<number>(0);

  // Monitor steps scroll progress
  useEffect(() => {
    const list = stepsListRef.current;
    if (!list) return;

    const items = Array.from(list.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = items.indexOf(entry.target as HTMLElement);
            if (idx >= 0) {
              setActiveStep((prev) => {
                if (idx > prev) {
                  // Scrolling down: trigger typing delay
                  setIsTyping(true);
                  setTimeout(() => {
                    setIsTyping(false);
                    // Emit mascot speech cue
                    if (idx === 1) {
                      window.dispatchEvent(
                        new CustomEvent('pup:cue', {
                          detail: { say: 'ooh, photos!', secs: 1.8 },
                        })
                      );
                    } else if (idx === 2) {
                      window.dispatchEvent(
                        new CustomEvent('pup:cue', {
                          detail: { say: 'home soon!', secs: 1.8 },
                        })
                      );
                    }
                  }, 750);
                } else if (idx < prev) {
                  // Scrolling up: instantly reveal
                  setIsTyping(false);
                }
                prevStepRef.current = idx;
                return idx;
              });
            }
          }
        });
      },
      {
        rootMargin: '-28% 0px -62% 0px',
        threshold: 0.1,
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setIsVideoPlaying(true))
        .catch(() => {});
    } else {
      v.pause();
      setIsVideoPlaying(false);
    }
  };

  const steps = [
    {
      title: 'Choose your breed',
      text: "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.",
    },
    {
      title: 'Get photos & details',
      text: 'Our team will share real photos, health details, and all necessary information directly on WhatsApp.',
    },
    {
      title: 'Secure & safe delivery',
      text: 'Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.',
    },
  ];

  const snaps = [
    '/images/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg',
    '/images/27b888_323008bb0f6a41d4bde2a0da7206cd98f001.jpg',
    '/images/27b888_323008bb0f6a41d4bde2a0da7206cd98f002.jpg',
    '/images/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg',
  ];

  return (
    <div data-section="journey">
      <section
        aria-labelledby="journey-title"
        className="tp-scene tp-chat"
        data-pup-scene="true"
        data-tone="light"
        style={
          {
            '--sky-top': '#f7d18d',
            '--sky-bottom': '#f0b866',
          } as React.CSSProperties
        }
      >
        <div className="tp-chat__grid gutter" data-pin-range="true">
          {/* Left Story: Steps */}
          <div className="tp-chat__story">
            <h2 className="font-plush text-huge" id="journey-title">
              Your puppy journey
            </h2>
            <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">
              A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.
            </p>
            <ol ref={stepsListRef} className="tp-chat__steps">
              {steps.map((st, i) => (
                <li
                  key={st.title}
                  className="tp-chat__step"
                  data-active={i === activeStep ? 'true' : undefined}
                  data-done={i < activeStep ? 'true' : undefined}
                >
                  <span aria-hidden="true" className="tp-chat__num font-plush">
                    {i + 1}
                  </span>
                  <h3 className="font-plush tp-chat__title">{st.title}</h3>
                  <p className="tp-chat__text">{st.text}</p>
                </li>
              ))}
            </ol>
            <Link className="btn btn-ghost tp-chat__cta" to="/how-it-works">
              How it works
            </Link>
          </div>

          {/* Right Side: Sticky WhatsApp Phone */}
          <div className="tp-chat__side">
            <div
              aria-label="A WhatsApp conversation with TeddyPups U.A.E."
              className="tp-phone"
              role="group"
            >
              {/* Phone Status Bar */}
              <div className="tp-phone__bar">
                <img
                  alt=""
                  className="tp-phone__avatar"
                  height={40}
                  loading="lazy"
                  src="/brand/logo.png"
                  width={40}
                />
                <span>
                  <span className="tp-phone__name">TeddyPups U.A.E.</span>
                  <span className="tp-phone__status">
                    {isTyping ? 'typing…' : 'online'}
                  </span>
                </span>
              </div>

              {/* Chat Screen */}
              <div className="tp-phone__screen">
                {/* Initial message from user */}
                <p className="tp-msg tp-msg--me">
                  Hi TeddyPups! I'd love to know more about your puppies.
                </p>

                {/* Step 0: Breed suggestions */}
                <div
                  className="tp-msg-group"
                  data-show={activeStep >= 0 ? 'true' : 'false'}
                  data-step="0"
                >
                  <div className="tp-msg tp-msg--them">
                    <p>
                      Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.
                    </p>
                    <ul aria-label="Breeds we have now" className="tp-chips">
                      <li><Link to="/puppies?breed=maltipoo">Maltipoo</Link></li>
                      <li><Link to="/puppies?breed=pomeranian">Pomeranian</Link></li>
                      <li><Link to="/puppies?breed=poodle">Poodle</Link></li>
                      <li><Link to="/puppies?breed=cavapoo">Cavapoo</Link></li>
                      <li><Link to="/puppies?breed=shih-tzu">Shih Tzu</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Step 1: Photos & Video Preview */}
                <div
                  className="tp-msg-group"
                  data-show={activeStep >= 1 && !(activeStep === 1 && isTyping) ? 'true' : 'false'}
                  data-step="1"
                >
                  <div className="tp-msg tp-msg--them tp-msg--media">
                    <div className="tp-snaps">
                      {snaps.map((src, idx) => (
                        <span key={idx} className="tp-snaps__one">
                          <img
                            alt={`Puppy preview photo ${idx + 1}`}
                            loading="lazy"
                            src={src}
                            style={{
                              position: 'absolute',
                              height: '100%',
                              width: '100%',
                              left: 0,
                              top: 0,
                              objectFit: 'cover',
                            }}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="tp-msg tp-msg--them tp-msg--media">
                    <div className="tp-clip">
                      <video
                        ref={videoRef}
                        aria-label="Video of a tiny apricot teddy bear puppy in the TeddyPups showroom"
                        loop
                        muted
                        playsInline
                        poster="/images/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg"
                        preload="none"
                        src="/media/dSAUmXs8Qai9/ef39cbea20/27b888_323008bb0f6a41d4bde2a0da7206cd98-720p.mp4"
                        onEnded={() => setIsVideoPlaying(false)}
                      />
                      <button
                        aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                        aria-pressed={isVideoPlaying}
                        className="tp-clip__play"
                        type="button"
                        onClick={toggleVideo}
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24">
                          {isVideoPlaying ? (
                            <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
                          ) : (
                            <path d="M8 5v14l11-7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="tp-msg tp-msg--them">
                    Our team will share real photos, health details, and all necessary information directly on WhatsApp.
                  </p>
                </div>

                {/* Step 2: Delivery Route */}
                <div
                  className="tp-msg-group"
                  data-show={activeStep >= 2 && !(activeStep === 2 && isTyping) ? 'true' : 'false'}
                  data-step="2"
                >
                  <div className="tp-msg tp-msg--them">
                    <p>
                      Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.
                    </p>
                    <svg aria-hidden="true" className="tp-route" viewBox="0 0 220 70">
                      <path className="tp-route__line" d="M14 52 C 60 6, 120 70, 170 28" />
                      <circle className="tp-route__dot" cx="14" cy="52" r="5" />
                      <path className="tp-route__home" d="M164 32 l12 -12 l12 12 v14 h-24 z" />
                      <path className="tp-route__heart" d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" />
                      <path
                        className="tp-route__paw"
                        d={PAW_PATH}
                        transform="translate(70 22) scale(.3) rotate(70 32 32)"
                      />
                      <path
                        className="tp-route__paw"
                        d={PAW_PATH}
                        transform="translate(104 38) scale(.3) rotate(100 32 32)"
                      />
                    </svg>
                  </div>
                </div>

                {/* Typing dots */}
                <p aria-hidden="true" className="tp-typing" data-show={isTyping ? 'true' : 'false'}>
                  <span></span>
                  <span></span>
                  <span></span>
                </p>
              </div>

              {/* WhatsApp Compose Bar */}
              <a
                className="tp-phone__compose"
                href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Say hello on WhatsApp</span>
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
                </svg>
              </a>
            </div>

            {/* Puppy Stop 3 */}
            <div
              className="pup-stop tp-chat__teddy"
              data-facing="right"
              data-pose="sit"
              data-pup-stop="true"
            >
              <div className="pup-buddy" data-facing="right">
                <TeddyPuppetSVG pose="sit" />
                <span aria-hidden="true" className="pup-bubble" data-show="false" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
