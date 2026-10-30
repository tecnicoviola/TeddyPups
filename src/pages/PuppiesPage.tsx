import React, { useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { PupBuddy } from '../components/pup/PupBuddy';
import { TeddyPuppetSVG } from '../components/pup/TeddyPuppetSVG';
import { AlreadyGoneHomeSection } from '../components/AlreadyGoneHomeSection';
import puppiesCatalog from '../data/puppiesCatalog.json';
import cardHtmlMap from '../data/puppiesCardHtmlMap.json';

const FILTER_KEYS = ['origin', 'breed', 'gender', 'collection'];

const BREEDS_LIST = [
  { slug: 'maltipoo', name: 'Maltipoo' },
  { slug: 'pomeranian', name: 'Pomeranian' },
  { slug: 'poodle', name: 'Poodle' },
  { slug: 'cavapoo', name: 'Cavapoo' },
  { slug: 'shih-tzu', name: 'Shih Tzu' }
];

const WHATSAPP_HREF = "https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies.";

export const PuppiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentFilters = {
    origin: searchParams.get('origin') ?? '',
    breed: searchParams.get('breed') ?? '',
    gender: searchParams.get('gender') ?? '',
    collection: searchParams.get('collection') ?? '',
  };

  const setFilter = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val && currentFilters[key as keyof typeof currentFilters] !== val) {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filter dataset
  const filteredPuppies = useMemo(() => {
    return puppiesCatalog.filter((pup: any) => {
      const matchOrigin = !currentFilters.origin || pup.origin?.slug === currentFilters.origin;
      const matchBreed = !currentFilters.breed || pup.breeds?.some((b: any) => b.slug === currentFilters.breed);
      const matchGender = !currentFilters.gender || pup.gender === currentFilters.gender || pup.gender === 'male-female';
      const matchCollection = !currentFilters.collection || pup.collections?.some((c: any) => c.slug === currentFilters.collection);
      return matchOrigin && matchBreed && matchGender && matchCollection;
    });
  }, [currentFilters.origin, currentFilters.breed, currentFilters.gender, currentFilters.collection]);

  const hasActiveFilters = FILTER_KEYS.some((k) => !!currentFilters[k as keyof typeof currentFilters]);

  // Breeds present in catalogue
  const availableBreeds = useMemo(() => {
    return BREEDS_LIST.filter((b) => puppiesCatalog.some((p: any) => p.breeds?.some((pb: any) => pb.slug === b.slug)));
  }, []);

  const hasTeacup = puppiesCatalog.some((p: any) => p.collections?.some((c: any) => c.slug === 'korean-teacup'));
  const hasLocal = puppiesCatalog.some((p: any) => p.origin?.slug === 'local');

  return (
    <main className="relative pt-[var(--header-h)] outline-none" id="main" tabIndex={-1}>
      <div className="tp-page" data-page="pups">
        <section aria-labelledby="pups-title" className="tp-sketchbook">
          <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
            
            {/* Header: Title and Self-portrait */}
            <div className="tp-sketchbook__head">
              <div className="tp-sketchbook__words">
                <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">
                  from Teddy's sketchbook
                </p>
                <h1 className="font-plush text-giant tp-sketchbook__title" data-reveal="true" id="pups-title">
                  Available puppies
                  <svg aria-hidden="true" className="tp-sketchbook__underline" preserveAspectRatio="none" viewBox="0 0 400 24">
                    <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength="1" />
                  </svg>
                </h1>
                <p className="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft" data-reveal="true">
                  Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.
                </p>
              </div>

              {/* Teddy Self-Portrait Card */}
              <div className="tp-sketchbook__self" data-reveal="true">
                <PupBuddy pose="sit" facing="left" label="Teddy self-portrait" />
                <span className="font-scrawl tp-sketchbook__caption">self-portrait</span>
              </div>
            </div>

            {/* Filter Section */}
            <div className="mt-12">
              <div role="group" aria-label="Filter puppies" className="tp-sketchpad flex flex-col gap-4">
                
                {/* WHERE ROW */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">where</span>
                  <button
                    type="button"
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.delete('origin');
                      p.delete('collection');
                      setSearchParams(p);
                    }}
                    aria-pressed={!currentFilters.origin && !currentFilters.collection}
                    className="tp-sticker-chip"
                  >
                    Everywhere
                  </button>
                  {hasLocal && (
                    <button
                      type="button"
                      onClick={() => setFilter('origin', 'local')}
                      aria-pressed={currentFilters.origin === 'local'}
                      className="tp-sticker-chip"
                    >
                      In Dubai
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.delete('collection');
                      p.set('origin', 'imported');
                      setSearchParams(p);
                    }}
                    aria-pressed={currentFilters.origin === 'imported'}
                    className="tp-sticker-chip"
                  >
                    Imported
                  </button>
                  {hasTeacup && (
                    <button
                      type="button"
                      onClick={() => {
                        const p = new URLSearchParams(searchParams);
                        p.delete('origin');
                        p.set('collection', 'korean-teacup');
                        setSearchParams(p);
                      }}
                      aria-pressed={currentFilters.collection === 'korean-teacup'}
                      className="tp-sticker-chip"
                    >
                      Korean Teacup
                    </button>
                  )}
                </div>

                {/* BREED ROW */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">breed</span>
                  {availableBreeds.map((breed) => (
                    <button
                      key={breed.slug}
                      type="button"
                      onClick={() => setFilter('breed', breed.slug)}
                      aria-pressed={currentFilters.breed === breed.slug}
                      className="tp-sticker-chip"
                    >
                      {breed.name}
                    </button>
                  ))}
                </div>

                {/* BOY OR GIRL ROW */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">boy or girl</span>
                  <button
                    type="button"
                    onClick={() => setFilter('gender', 'male')}
                    aria-pressed={currentFilters.gender === 'male'}
                    className="tp-sticker-chip"
                  >
                    Boys
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter('gender', 'female')}
                    aria-pressed={currentFilters.gender === 'female'}
                    className="tp-sticker-chip"
                  >
                    Girls
                  </button>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="link-ink ml-auto text-[0.95rem] font-semibold"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

              </div>

              {/* Dynamic Result Count */}
              <p className="font-scrawl mt-10 text-lg text-[var(--ink-soft)]" aria-live="polite">
                {filteredPuppies.length === 1 ? '1 puppy' : `${filteredPuppies.length} puppies`}{' '}
                {hasActiveFilters ? 'match' : 'looking for a home'}
              </p>

              {/* Puppy Cards Grid or Empty State */}
              {filteredPuppies.length > 0 ? (
                <ul className="tp-sketches mt-8">
                  {filteredPuppies.map((pup: any) => {
                    const cardHtml = (cardHtmlMap as Record<string, string>)[pup.slug];
                    if (cardHtml) {
                      return (
                        <li
                          key={pup.id || pup.slug}
                          dangerouslySetInnerHTML={{ __html: cardHtml }}
                        />
                      );
                    }
                    return (
                      <li key={pup.id || pup.slug}>
                        <a
                          href={`/puppies/${pup.slug}`}
                          className="tp-sketch"
                          data-reveal="true"
                          style={{ '--tilt': '0deg', '--d': '0ms', '--wash': '#f2be6b' } as React.CSSProperties}
                        >
                          <span className="tp-sketch__frame">
                            <span className="tp-sketch__photo">
                              {pup.cover?.url && <img src={pup.cover.url} alt={pup.displayName} />}
                            </span>
                            <span className="tp-sketch__sticker font-scrawl">Available</span>
                          </span>
                          <span className="tp-sketch__name font-plush">{pup.displayName}</span>
                          <span className="tp-sketch__meta">{pup.breed} · {pup.genderLabel} · {pup.age}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                /* Empty State Matching Original */
                <div className="tp-sketchpad mt-10 grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
                  <div className="pup-buddy mx-auto w-44 md:w-52" data-facing="left">
                    <TeddyPuppetSVG pose="sit" />
                  </div>
                  <div>
                    <p className="font-plush text-big">No puppies match just now.</p>
                    <p className="mt-3 max-w-[48ch] text-cocoa-soft">
                      Tell us what you're hoping for and we'll let you know what's in our showroom or what we can bring in for you.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={WHATSAPP_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp"
                      >
                        Ask on WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="btn btn-ghost"
                      >
                        Show all puppies
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* Already Gone Home Section */}
        <AlreadyGoneHomeSection />
      </div>
    </main>
  );
};

export default PuppiesPage;
