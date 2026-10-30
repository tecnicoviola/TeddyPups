import React from 'react';
import { TeddyPuppetSVG } from '../pup/TeddyPuppetSVG';

const FAQS = [
  {
    q: 'Are your puppies vaccinated and health-checked?',
    a: 'Yes. All our puppies come with a verified health certificate from licensed vets. Every puppy is vaccinated, dewormed, and thoroughly checked before joining your family.',
    look: true
  },
  {
    q: 'Can I meet a puppy before I decide?',
    a: 'Yes. Come meet our locally available puppies in our Downtown Dubai showroom and spend time bonding before making your decision.',
    look: true
  },
  {
    q: 'Can I take my puppy home the same day?',
    a: 'Local puppies are available immediately, so you can take your puppy home the same day.',
    look: false
  }
];

const STARS = [
  { left: '8%', top: '12%', width: '16.2px', delay: '0.00s' },
  { left: '22%', top: '30%', width: '9px', delay: '0.40s' },
  { left: '41%', top: '8%', width: '12.6px', delay: '0.80s' },
  { left: '57%', top: '22%', width: '8.1px', delay: '1.20s' },
  { left: '72%', top: '6%', width: '14.4px', delay: '1.60s' },
  { left: '88%', top: '18%', width: '10.8px', delay: '2.00s' },
  { left: '95%', top: '42%', width: '9px', delay: '2.40s' },
  { left: '4%', top: '58%', width: '10.8px', delay: '2.80s' },
  { left: '34%', top: '70%', width: '7.2px', delay: '3.20s' },
  { left: '63%', top: '84%', width: '9.9px', delay: '3.60s' },
  { left: '83%', top: '66%', width: '12.6px', delay: '4.00s' },
];

export const HomeQuestionsSection: React.FC = () => {
  return (
    <div data-section="questions">
      <section
        aria-labelledby="questions-title"
        className="tp-scene tp-night"
        data-pup-scene="true"
        data-tone="dark"
        style={{ '--sky-top': '#4d2b19', '--sky-bottom': '#2f1a10' } as React.CSSProperties}
      >
        <div aria-hidden="true" className="pointer-events-none tp-night__stars">
          {STARS.map((star, idx) => (
            <svg
              key={idx}
              aria-hidden="true"
              className="tp-twinkle absolute text-honey"
              style={{
                left: star.left,
                top: star.top,
                width: star.width,
                animationDelay: star.delay
              }}
              viewBox="0 0 40 40"
            >
              <path
                d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z"
                fill="currentColor"
              />
            </svg>
          ))}
        </div>

        <div className="tp-night__grid gutter">
          <div className="tp-night__intro">
            <h2 className="font-plush text-huge" id="questions-title">
              Questions, answered
            </h2>
            <a className="btn btn-ghost tp-night__cta" href="/faq">
              Read all questions
            </a>
            <div className="tp-night__pup">
              <span aria-hidden="true" className="tp-night__wonder font-plush">
                ?
              </span>
              <div
                className="pup-stop tp-night__teddy"
                data-pup-stop="true"
                data-pose="sit"
                data-act="tilt"
                data-facing="right"
              >
                <div className="pup-buddy" data-facing="right">
                  <TeddyPuppetSVG
                    pose="sit"
                    facing="right"
                    lookX={0}
                    lookY={0}
                    tailWag={true}
                    blink={true}
                    tongue={true}
                  />
                  <span aria-hidden="true" className="pup-bubble" data-show="false" />
                </div>
              </div>
            </div>
          </div>

          <dl className="tp-night__list">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="tp-qa"
                {...(faq.look ? { 'data-pup-look': '' } : {})}
              >
                <dt className="font-plush tp-qa__q">
                  <svg aria-hidden="true" className="tp-qa__star" viewBox="0 0 40 40">
                    <path
                      d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z"
                      fill="currentColor"
                    />
                  </svg>
                  {faq.q}
                </dt>
                <dd className="tp-qa__a">
                  {faq.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
};

export default HomeQuestionsSection;
