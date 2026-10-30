import React from 'react';
import { Link } from 'react-router-dom';
import { BasketPup } from './pup/BasketPup';

export const Footer: React.FC = () => {
  return (
    <footer className="tp-footer relative pb-[calc(var(--bar-h)+2rem)] text-milk md:pb-10">
      <svg aria-hidden="true" className="tp-footer__hill" preserveAspectRatio="none" viewBox="0 0 1440 80">
        <path d="M0 80V44c120-30 240-44 360-30s240 46 360 34 240-58 360-46 240 40 360 26v52z"></path>
      </svg>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 h-64 overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <svg aria-hidden="true" className="tp-twinkle absolute text-honey" style={{ left: '6%', top: '18%', width: '12.6px', animationDelay: '0.00s' }} viewBox="0 0 40 40">
            <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
          </svg>
          <svg aria-hidden="true" className="tp-twinkle absolute text-honey" style={{ left: '14%', top: '42%', width: '8.4px', animationDelay: '0.40s' }} viewBox="0 0 40 40">
            <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
          </svg>
          <svg aria-hidden="true" className="tp-twinkle absolute text-honey" style={{ left: '23%', top: '12%', width: '9.8px', animationDelay: '0.80s' }} viewBox="0 0 40 40">
            <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
          </svg>
          <svg aria-hidden="true" className="tp-twinkle absolute text-honey" style={{ left: '31%', top: '30%', width: '7px', animationDelay: '1.20s' }} viewBox="0 0 40 40">
            <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
          </svg>
          <svg aria-hidden="true" className="tp-twinkle absolute text-honey" style={{ left: '44%', top: '9%', width: '11.2px', animationDelay: '1.60s' }} viewBox="0 0 40 40">
            <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
          </svg>
          <svg aria-hidden="true" className="tp-twinkle absolute text-honey" style={{ left: '52%', top: '36%', width: '7.7px', animationDelay: '2.00s' }} viewBox="0 0 40 40">
            <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
          </svg>
          <svg aria-hidden="true" className="tp-twinkle absolute text-honey" style={{ left: '63%', top: '15%', width: '10.5px', animationDelay: '2.40s' }} viewBox="0 0 40 40">
            <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
          </svg>
          <svg aria-hidden="true" className="tp-twinkle absolute text-honey" style={{ left: '71%', top: '40%', width: '7px', animationDelay: '2.80s' }} viewBox="0 0 40 40">
            <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
          </svg>
          <svg aria-hidden="true" className="tp-twinkle absolute text-honey" style={{ left: '92%', top: '33%', width: '8.4px', animationDelay: '3.20s' }} viewBox="0 0 40 40">
            <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
          </svg>
        </div>
        <span className="tp-moon"></span>
      </div>

      <div className="gutter relative mx-auto grid max-w-[110rem] gap-12 pt-20 md:grid-cols-12 md:gap-x-12 md:gap-y-6 md:pt-28">
        <div className="md:col-span-5">
          <p className="font-plush text-big text-honey-soft">Home, at last.</p>
          <p className="mt-5 max-w-md text-milk/80">
            TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.
          </p>
        </div>

        <div className="order-last md:order-none md:col-span-5 md:col-start-1 md:row-start-2">
          <div className="tp-basket">
            <svg aria-hidden="true" className="tp-basket__back" viewBox="0 0 300 240">
              <ellipse className="tp-basket__hollow" cx="212" cy="145" rx="96" ry="12"></ellipse>
              <path className="tp-basket__rim-line" d="M116 145 A96 12 0 0 1 308 145"></path>
              <path className="tp-basket__rim" d="M116 145 A96 12 0 0 1 308 145"></path>
            </svg>
            <BasketPup />
            <svg aria-hidden="true" className="tp-basket__front" viewBox="0 0 300 240">
              <path className="tp-basket__body" d="M116 145 C118 180 126 214 138 232 L286 232 C298 214 306 180 308 145 A96 12 0 0 1 116 145 Z"></path>
              <path className="tp-basket__weave" d="M121 178 Q212 197 303 178 M127 206 Q212 223 297 206"></path>
              <path className="tp-basket__weave tp-basket__weave--stakes" d="M150 164 L158 230 M182 168 L185 232 M212 169 V232 M242 168 L239 232 M274 164 L266 230"></path>
              <path className="tp-basket__rim-line" d="M116 145 A96 12 0 0 0 308 145"></path>
              <path className="tp-basket__rim" d="M116 145 A96 12 0 0 0 308 145"></path>
            </svg>
          </div>
        </div>

        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7 md:row-span-2 md:row-start-1">
          <h2 className="font-scrawl text-lg text-honey">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            <li><Link className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline" to="/puppies">Available puppies</Link></li>
            <li><Link className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline" to="/gone-home">Gone home</Link></li>
            <li><Link className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline" to="/happy-families">Happy families</Link></li>
            <li><Link className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline" to="/how-it-works">How it works</Link></li>
            <li><Link className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline" to="/how-it-works#delivery">Delivery &amp; collection</Link></li>
            <li><Link className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline" to="/faq">FAQ</Link></li>
            <li><Link className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline" to="/contact">Visit &amp; contact</Link></li>
          </ul>
        </nav>

        <div className="md:col-span-3 md:row-span-2 md:row-start-1">
          <h2 className="font-scrawl text-lg text-honey">Say hello</h2>
          <ul className="mt-4 space-y-2.5 text-milk/90">
            <li>
              <a className="font-semibold hover:text-honey" href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies." rel="noopener noreferrer" target="_blank">
                WhatsApp +971 54 167 6733
              </a>
            </li>
            <li>
              <a className="break-all hover:text-honey" href="mailto:teddypupsadmin@gmail.com">
                teddypupsadmin@gmail.com
              </a>
            </li>
            <li>Downtown Dubai, United Arab Emirates</li>
          </ul>
          <ul aria-label="Social media" className="mt-6 flex flex-wrap gap-3">
            <li>
              <a className="inline-flex h-11 items-center rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey" href="https://www.instagram.com/teddypups.worldwide/" rel="noopener noreferrer" target="_blank">
                Instagram
              </a>
            </li>
            <li>
              <a className="inline-flex h-11 items-center rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey" href="https://www.tiktok.com/@teddypupsuae" rel="noopener noreferrer" target="_blank">
                TikTok
              </a>
            </li>
            <li>
              <a className="inline-flex h-11 items-center rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey" href="https://www.facebook.com/profile.php?id=61567496944539" rel="noopener noreferrer" target="_blank">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="gutter relative mx-auto mt-16 flex max-w-[110rem] flex-col items-start justify-between gap-4 border-t border-milk/15 pt-6 text-sm text-milk/60 md:flex-row md:items-center">
        <span className="flex items-center gap-3">
          <img alt="" className="size-9" height="36" width="36" src="/brand/logo.png" style={{ color: 'transparent' }} />
          © 2026 TeddyPups U.A.E.
        </span>
        <span className="font-scrawl text-base text-honey/80">every puppy is family</span>
      </div>
    </footer>
  );
};

