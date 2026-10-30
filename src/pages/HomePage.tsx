import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroStage } from '../components/HeroStage';
import { MeetThePups } from '../components/MeetThePups';
import { HomePathsSection } from '../components/home/HomePathsSection';
import { HomeChatSection } from '../components/home/HomeChatSection';
import { HomeTrustSection } from '../components/home/HomeTrustSection';
import { HomeFamiliesSection } from '../components/home/HomeFamiliesSection';
import { HomeQuestionsSection } from '../components/home/HomeQuestionsSection';
import { HomeDoorSection } from '../components/home/HomeDoorSection';
import { PupJourney } from '../components/pup/PupJourney';

const HERO_COPY_HTML = `<p class="tp-hero__note font-scrawl">every puppy is family<svg aria-hidden="true" class="absolute -bottom-2 left-0 h-3 w-full text-toffee" preserveaspectratio="none" viewbox="0 0 220 24"><path d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></path></svg></p><h1 class="tp-hero__title font-plush" id="hero-title"><span class="tp-hero__line">Premium teacup</span><span class="tp-hero__line tp-hero__line--2">puppies in Dubai</span></h1><p class="tp-hero__lede">Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.</p><div class="tp-hero__actions"><a class="btn btn-primary" href="/puppies">View available puppies</a><a class="btn btn-ghost" href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies." rel="noopener noreferrer" target="_blank">Enquire on WhatsApp</a></div>`;

export const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a');
      if (
        anchor &&
        anchor.href &&
        anchor.origin === window.location.origin &&
        !anchor.hasAttribute('download') &&
        anchor.target !== '_blank'
      ) {
        const url = new URL(anchor.href);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          e.preventDefault();
          navigate(url.pathname + url.search + url.hash);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleGlobalClick);
    }
    return () => {
      if (container) {
        container.removeEventListener('click', handleGlobalClick);
      }
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-[var(--cream)] overflow-x-clip" ref={containerRef}>
      <main id="main-content">
        <div>
          <div data-section="hero">
            <section
              aria-labelledby="hero-title"
              className="tp-scene tp-hero"
              data-pup-scene="true"
              data-tone="light"
              style={
                {
                  '--sky-top': '#fffdf8',
                  '--sky-bottom': '#fff1d8',
                  '--quilt': '#fff1d8',
                } as React.CSSProperties
              }
            >
              <span aria-hidden="true" className="tp-hero__sun"></span>
              <div
                className="tp-hero__copy gutter"
                dangerouslySetInnerHTML={{ __html: HERO_COPY_HTML }}
              />
              <HeroStage />
            </section>
          </div>
          <MeetThePups />
          <HomePathsSection />
          <HomeChatSection />
          <HomeTrustSection />
          <HomeFamiliesSection />
          <HomeQuestionsSection />
          <HomeDoorSection />
          <PupJourney />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
