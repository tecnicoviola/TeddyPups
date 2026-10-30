const fs = require('fs');

const original = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

const rawStart = original.indexOf('const RAW_HTML = `') + 'const RAW_HTML = `'.length;
const rawEnd = original.lastIndexOf('`;');
const rawHtml = original.substring(rawStart, rawEnd);

// Find copyHtml
const copyStart = rawHtml.indexOf('<div class="tp-hero__copy gutter">');
const stageStart = rawHtml.indexOf('<div class="tp-hero__stage">');
const copyHtml = rawHtml.substring(copyStart + '<div class="tp-hero__copy gutter">'.length, stageStart - 6);

// Find jsonLd
const jsonLdStart = rawHtml.indexOf('<script type="application/ld+json">');
const jsonLdEnd = rawHtml.indexOf('</script>') + 9;
const jsonLd = rawHtml.substring(jsonLdStart, jsonLdEnd);

// Find rest of page starting at <div data-section="meet">
const meetIdx = rawHtml.indexOf('<div data-section="meet">');
// Cut off before the closing </main>
const restEnd = rawHtml.lastIndexOf('</main>');
const restHtml = rawHtml.substring(meetIdx, restEnd);

console.log('copyHtml len:', copyHtml.length);
console.log('restHtml len:', restHtml.length);

const newFileContent = `import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroStage } from '../components/HeroStage';

const HERO_COPY_HTML = ${JSON.stringify(copyHtml)};
const REST_OF_PAGE_HTML = ${JSON.stringify(restHtml)};

export const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/cdn-cgi')) {
        e.preventDefault();
        navigate(href);
      }
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [navigate]);

  return (
    <div ref={containerRef}>
      <main className="relative pt-[var(--header-h)] outline-none" id="main" tabIndex={-1}>
        <div className="tp-page" data-page="home">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "PetStore",
                "name": "TeddyPups U.A.E.",
                "description": "TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.",
                "url": "https://puppy.instabizweb.com",
                "logo": "https://puppy.instabizweb.com/brand/logo.png",
                "image": "https://puppy.instabizweb.com/brand/logo.png",
                "telephone": "+971541676733",
                "email": "teddypupsadmin@gmail.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Downtown Dubai, United Arab Emirates",
                  "addressLocality": "Dubai",
                  "addressCountry": "AE"
                },
                "sameAs": [
                  "https://www.instagram.com/teddypups.worldwide/",
                  "https://www.tiktok.com/@teddypupsuae",
                  "https://www.facebook.com/profile.php?id=61567496944539"
                ]
              })
            }}
          />
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
          <div dangerouslySetInnerHTML={{ __html: REST_OF_PAGE_HTML }} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
`;

fs.writeFileSync('src/pages/HomePage.tsx', newFileContent, 'utf8');
console.log('Successfully updated src/pages/HomePage.tsx');
