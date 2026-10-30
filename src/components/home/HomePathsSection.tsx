import React from 'react';
import { Link } from 'react-router-dom';
import { FlightAnimation } from '../how/FlightAnimation';
import { TeddyPuppetSVG } from '../pup/TeddyPuppetSVG';

export const HomePathsSection: React.FC = () => {
  return (
    <div data-section="paths">
      <section
        aria-labelledby="paths-title"
        className="tp-scene tp-paths"
        data-pup-scene="true"
        data-tone="light"
        style={
          {
            '--sky-top': '#fbe3b4',
            '--sky-bottom': '#f7d18d',
          } as React.CSSProperties
        }
      >
        <div className="gutter mx-auto max-w-[110rem]">
          <h2 className="tp-paths__title font-plush text-huge" id="paths-title">
            Two ways to meet your puppy
          </h2>
          <div className="tp-fork">
            <div aria-hidden="true" className="tp-fork__post" />

            {/* Left Way: Puppies in Dubai */}
            <article aria-labelledby="way-local" className="tp-way tp-way--left">
              <h3 className="tp-sign tp-sign--left font-plush" id="way-local">
                Puppies in Dubai
              </h3>
              <div className="tp-way__scene" data-pup-look="true">
                <svg aria-hidden="true" className="tp-way__skyline" viewBox="0 0 300 120">
                  <path
                    d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.6"
                  />
                </svg>
                <figure className="tp-window">
                  <span className="tp-window__glass">
                    <img
                      alt="A tiny apricot teddy bear puppy held up in the TeddyPups showroom"
                      decoding="async"
                      loading="lazy"
                      src="/images/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg"
                      style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        objectFit: 'cover',
                        objectPosition: '54.3% 48.3%',
                      }}
                    />
                  </span>
                  <figcaption className="font-scrawl">In our showroom</figcaption>
                </figure>
              </div>
              <p className="tp-way__text">
                See them, love them, take them home. Come meet our locally available puppies before you decide.
              </p>
              <Link className="btn btn-primary" to="/puppies?origin=local">
                Meet local puppies
              </Link>
            </article>

            {/* Right Way: Imported for you with scroll-driven FlightAnimation */}
            <article aria-labelledby="way-imported" className="tp-way tp-way--right">
              <h3 className="tp-sign tp-sign--right font-plush" id="way-imported">
                Imported for you
              </h3>
              <div className="tp-way__scene" data-pup-look="true">
                <FlightAnimation photoUrl="/images/b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg" />
              </div>
              <p className="tp-way__text">
                Exclusive Korean teacup puppies, delivered. Order from the world's most reputable breeders and let us handle the import.
              </p>
              <Link className="btn btn-primary" to="/puppies?origin=imported">
                See imported puppies
              </Link>
            </article>

            {/* Puppy Stop 2 */}
            <div
              className="pup-stop tp-fork__teddy"
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
