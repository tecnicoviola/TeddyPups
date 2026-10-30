import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import puppiesCatalogData from '../data/puppiesCatalog.json';
import { PupBuddy } from '../components/pup/PupBuddy';
import { FullScreenImageViewer, GalleryPhoto } from '../components/FullScreenImageViewer';
import { resolvePublicAssetUrl } from '../utils/mediaAssets';

export interface PuppyMedia {
  id?: string;
  url: string;
  kind?: string;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  focalX?: number;
  focalY?: number;
  color?: string;
  blurDataUrl?: string;
  durationS?: number | null;
  poster?: {
    url: string;
    width?: number;
    height?: number;
  } | null;
}

export interface PuppyCatalogItem {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  breed: string;
  gender: string;
  genderLabel?: string;
  age: string;
  colour?: string;
  description?: string;
  records?: string[];
  status: string;
  featured?: boolean;
  seoDescription?: string;
  cover?: PuppyMedia;
  media: PuppyMedia[];
  origin?: {
    slug: string;
    name: string;
  };
  collections?: Array<{ slug: string; name: string }>;
  breeds?: Array<{ slug: string; name: string }>;
  published?: boolean;
}

const puppiesCatalog = puppiesCatalogData as PuppyCatalogItem[];

export function resolveMediaUrl(url: string): string {
  const resolved = resolvePublicAssetUrl(url);
  return resolved || '/brand/logo.png';
}

export const PuppyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Find puppy in catalog
  const puppyIndex = puppiesCatalog.findIndex((p) => p.slug === slug);
  const puppy = puppyIndex !== -1 ? puppiesCatalog[puppyIndex] : null;

  // Cyclic Prev / Next puppy
  const totalPuppies = puppiesCatalog.length;
  const prevPuppy = totalPuppies > 0
    ? puppiesCatalog[puppyIndex > 0 ? puppyIndex - 1 : totalPuppies - 1]
    : null;
  const nextPuppy = totalPuppies > 0
    ? puppiesCatalog[puppyIndex < totalPuppies - 1 ? puppyIndex + 1 : 0]
    : null;

  // Media gallery state
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Enquiry form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formAlert, setFormAlert] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const mediaList = puppy?.media && puppy.media.length > 0
    ? puppy.media
    : puppy?.cover
    ? [puppy.cover]
    : [];
  const totalPhotos = mediaList.length;

  // Smooth gallery navigation with cyclic wrap-around
  const navigateTo = useCallback(
    (targetIdx: number, customDir?: number) => {
      if (totalPhotos <= 1) return;
      const wrappedIdx = ((targetIdx % totalPhotos) + totalPhotos) % totalPhotos;
      if (wrappedIdx === activeIdx) return;

      let dir = customDir !== undefined ? customDir : targetIdx > activeIdx ? 1 : -1;
      // Edge cases for cyclic wrap
      if (activeIdx === 0 && targetIdx === -1) dir = -1;
      if (activeIdx === totalPhotos - 1 && targetIdx === totalPhotos) dir = 1;

      setDirection(dir);
      setPrevIdx(activeIdx);
      setActiveIdx(wrappedIdx);
      setIsAnimating(true);

      setTimeout(() => {
        setIsAnimating(false);
        setPrevIdx(null);
      }, 700);
    },
    [activeIdx, totalPhotos]
  );

  // Keyboard navigation for gallery
  useEffect(() => {
    if (isViewerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateTo(activeIdx + 1, 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateTo(activeIdx - 1, -1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, isViewerOpen, navigateTo]);

  // Reset active photo index & enquiry state whenever slug changes
  useEffect(() => {
    setActiveIdx(0);
    setPrevIdx(null);
    setIsAnimating(false);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setFormErrors({});
    setFormAlert('');
    if (puppy) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        area: '',
        message: `Hi! I'd love to know more about ${puppy.displayName}.`,
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, puppy?.displayName]);

  // Keep active thumbnail in view
  useEffect(() => {
    if (thumbRefs.current[activeIdx]) {
      thumbRefs.current[activeIdx]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeIdx]);

  // IntersectionObserver for [data-reveal] scroll animations
  const pageContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = pageContainerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = 'true';
          }
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
    );

    const elements = root.querySelectorAll('[data-reveal]:not([data-revealed])');
    elements.forEach((el) => {
      (el as HTMLElement).dataset.armed = 'true';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [slug]);

  if (!puppy) {
    return (
      <main className="relative pt-[var(--header-h)] outline-none min-h-[70vh] flex flex-col items-center justify-center text-center p-8">
        <h1 className="font-plush text-3xl md:text-5xl text-cocoa">Puppy Not Found</h1>
        <p className="mt-4 text-cocoa-soft max-w-md">
          The puppy you are looking for may have found their forever family or the link is incorrect.
        </p>
        <Link to="/puppies" className="btn btn-primary mt-6">
          Back to available puppies
        </Link>
      </main>
    );
  }

  const activeMedia = mediaList[activeIdx] || mediaList[0];
  const prevMedia = prevIdx !== null ? mediaList[prevIdx] : null;

  // WhatsApp link text generator
  const getWhatsAppHref = () => {
    let msg = '';
    if (puppy.name && puppy.name.trim()) {
      msg = `Hi TeddyPups! I'm interested in ${puppy.name}, the ${puppy.breed}: https://puppy.instabizweb.com/puppies/${puppy.slug}`;
    } else {
      const gStr = puppy.genderLabel
        ? puppy.genderLabel.toLowerCase()
        : puppy.gender === 'female'
        ? 'girl'
        : 'boy';
      msg = `Hi TeddyPups! I'm interested in the ${puppy.displayName} (${gStr}): https://puppy.instabizweb.com/puppies/${puppy.slug}`;
    }
    return `https://wa.me/971541676733?text=${encodeURIComponent(msg)}`;
  };

  // Full-screen viewer photos list
  const viewerPhotos: GalleryPhoto[] = mediaList.map((m, i) => ({
    id: m.id || `${i}`,
    src: m.kind === 'video' && m.poster?.url ? resolveMediaUrl(m.poster.url) : resolveMediaUrl(m.url),
    alt: m.alt || `${puppy.displayName} photo ${i + 1}`,
  }));

  // Handle Touch Navigation for gallery
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        // Swiped left -> next
        navigateTo(activeIdx + 1, 1);
      } else {
        // Swiped right -> prev
        navigateTo(activeIdx - 1, -1);
      }
    }
    setTouchStartX(null);
  };

  // Handle Enquiry Form Submit
  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Please enter your name.';
    }

    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || !/^\+[\d\s\-()]{7,}$/.test(cleanPhone)) {
      errors.phone = 'Please enter your phone number with country code (e.g. +971).';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFormAlert('Please check the highlighted fields.');
      if (errors.name) {
        nameInputRef.current?.focus();
      } else if (errors.phone) {
        phoneInputRef.current?.focus();
      } else if (errors.email) {
        emailInputRef.current?.focus();
      }
      return;
    }

    setFormErrors({});
    setFormAlert('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const coverColor = puppy.cover?.color || '#e8e8e8';

  return (
    <main className="relative pt-[var(--header-h)] outline-none" id="main" tabIndex={-1}>
      <div className="tp-page" data-page="pup" ref={pageContainerRef}>
        <article
          className="tp-storybook"
          style={{
            background: `linear-gradient(180deg, color-mix(in oklab, ${coverColor} 24%, var(--color-milk)) 0, var(--color-milk) 85%)`,
          }}
        >
          <div className="gutter mx-auto max-w-[110rem] pb-20 pt-8 md:pt-12">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
              <Link className="link-ink" to="/puppies">
                Available puppies
              </Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page" className="text-cocoa">
                {puppy.displayName}
              </span>
            </nav>

            {/* Chapter 1: hello, it's me */}
            <p className="tp-chapter mt-3">
              <span aria-hidden="true" className="tp-chapter__n font-plush">
                1
              </span>
              <span className="font-scrawl">hello, it's me</span>
            </p>

            {/* Profile Overview (Left: Media Gallery | Right: Tag Info & Promises) */}
            <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Left Column: Media Gallery */}
              <div className="min-w-0 lg:col-span-7">
                <div>
                  {/* Storypage Main Photo Box */}
                  <div
                    className="tp-storypage relative aspect-[4/5] md:aspect-[5/6] select-none overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    data-reveal="true"
                  >
                    {/* Outgoing previous photo during transition */}
                    {isAnimating && prevMedia && (
                      <div
                        className="absolute inset-0 block size-full pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          opacity: 0.4,
                          transform: 'scale(0.97)',
                          zIndex: 1,
                        }}
                      >
                        <img
                          src={resolveMediaUrl(prevMedia.url)}
                          alt=""
                          className="size-full object-cover"
                          style={{
                            objectPosition: `${(prevMedia.focalX || 0.5) * 100}% ${(prevMedia.focalY || 0.5) * 100}%`,
                            backgroundColor: prevMedia.color || '#e8e8e8',
                          }}
                        />
                      </div>
                    )}

                    {/* Active photo full-screen trigger button */}
                    <button
                      type="button"
                      aria-label={`Open ${puppy.displayName}, photo ${activeIdx + 1} of ${totalPhotos} full screen`}
                      onClick={() => setIsViewerOpen(true)}
                      className="absolute inset-0 block size-full cursor-pointer focus:outline-none"
                      style={{
                        zIndex: 2,
                        transformOrigin: direction > 0 ? '0% 50%' : '100% 50%',
                        animation: isAnimating
                          ? `galleryCurl${direction > 0 ? 'Next' : 'Prev'} 0.7s cubic-bezier(0.22, 1, 0.36, 1) both`
                          : 'none',
                      }}
                    >
                      {activeMedia?.kind === 'video' ? (
                        <div className="relative size-full">
                          <video
                            src={resolveMediaUrl(activeMedia.url)}
                            poster={activeMedia.poster?.url ? resolveMediaUrl(activeMedia.poster.url) : undefined}
                            className="size-full object-cover"
                            muted
                            loop
                            playsInline
                            autoPlay
                          />
                          <span className="absolute inset-0 grid place-items-center bg-cocoa/30 text-3xl text-milk">
                            ▶
                          </span>
                        </div>
                      ) : (
                        <img
                          src={resolveMediaUrl(activeMedia?.url || '')}
                          alt={activeMedia?.alt || `${puppy.displayName} puppy`}
                          className="size-full object-cover"
                          style={{
                            objectPosition: `${(activeMedia?.focalX || 0.5) * 100}% ${(activeMedia?.focalY || 0.5) * 100}%`,
                            backgroundColor: activeMedia?.color || '#e8e8e8',
                          }}
                        />
                      )}
                    </button>

                    {/* Navigation Arrows and Counter */}
                    {totalPhotos > 1 && (
                      <div className="absolute inset-x-4 bottom-4 flex justify-between z-20 pointer-events-none">
                        <button
                          type="button"
                          aria-label="Previous photo"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigateTo(activeIdx - 1, -1);
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                          className="pointer-events-auto grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold shadow-md hover:scale-105 active:scale-95 transition-transform text-cocoa cursor-pointer"
                        >
                          ‹
                        </button>
                        <span className="pointer-events-auto self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
                          {activeIdx + 1} / {totalPhotos}
                        </span>
                        <button
                          type="button"
                          aria-label="Next photo"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigateTo(activeIdx + 1, 1);
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                          className="pointer-events-auto grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold shadow-md hover:scale-105 active:scale-95 transition-transform text-cocoa cursor-pointer"
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Horizontal Scrollable Thumbnail Strip */}
                  {totalPhotos > 1 && (
                    <ul
                      aria-label={`All photos of ${puppy.displayName}`}
                      className="mt-3 flex gap-3 overflow-x-auto px-1 pb-2 pt-2 [scrollbar-width:thin]"
                    >
                      {mediaList.map((item, idx) => {
                        const isActive = idx === activeIdx;
                        const thumbSrc = item.kind === 'video' && item.poster?.url
                          ? resolveMediaUrl(item.poster.url)
                          : resolveMediaUrl(item.url);

                        return (
                          <li key={item.id || idx} className="shrink-0">
                            <button
                              ref={(el) => (thumbRefs.current[idx] = el)}
                              type="button"
                              aria-current={isActive ? 'true' : 'false'}
                              aria-label={`${puppy.displayName}, ${item.kind === 'video' ? 'video' : 'photo'} ${idx + 1} of ${totalPhotos}`}
                              onClick={() => navigateTo(idx)}
                              className={`relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24 ${
                                isActive
                                  ? '-rotate-3 -translate-y-1 border-toffee-deep shadow-md'
                                  : 'border-cocoa/30 hover:-rotate-2 hover:border-cocoa'
                              }`}
                            >
                              <img
                                alt=""
                                src={thumbSrc}
                                className="size-full object-cover"
                                style={{
                                  objectPosition: `${(item.focalX || 0.5) * 100}% ${(item.focalY || 0.5) * 100}%`,
                                  backgroundColor: item.color || '#e8e8e8',
                                }}
                              />
                              {item.kind === 'video' && (
                                <span className="absolute inset-0 grid place-items-center bg-cocoa/30 text-lg text-milk">
                                  ▶
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* Right Column: Tag Information Card & What Comes With Card */}
              <div className="min-w-0 lg:col-span-5">
                <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
                  {/* Tag Board Card */}
                  <div
                    className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20 relative"
                    data-reveal="true"
                  >
                    <span aria-hidden="true" className="tp-tag__ring"></span>

                    {/* Peeking Mascot */}
                    <div
                      className="pup-buddy absolute -top-[4.8rem] right-6 w-[9.5rem]"
                      data-facing="right"
                    >
                      <PupBuddy
                        pose="peek"
                        facing="right"
                        label={`Teddy, peeking over ${puppy.displayName}'s tag`}
                      />
                    </div>

                    {/* Available Chip */}
                    <span className="chip">
                      <svg
                        aria-hidden="true"
                        className="size-4 text-toffee"
                        fill="currentColor"
                        viewBox="0 0 64 64"
                      >
                        <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z"></path>
                      </svg>
                      Available
                    </span>

                    {/* Puppy Title */}
                    <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)] leading-none text-cocoa">
                      {puppy.displayName}
                    </h1>

                    {/* Puppy Specs Matrix */}
                    <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <dt className="font-scrawl text-sm text-cocoa-soft">Breed</dt>
                        <dd className="mt-0.5 text-[1.05rem] font-semibold text-cocoa">
                          {puppy.breed}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-scrawl text-sm text-cocoa-soft">Boy or girl</dt>
                        <dd className="mt-0.5 text-[1.05rem] font-semibold text-cocoa">
                          {puppy.genderLabel || (puppy.gender === 'female' ? 'Girl' : 'Boy')}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-scrawl text-sm text-cocoa-soft">Age</dt>
                        <dd className="mt-0.5 text-[1.05rem] font-semibold text-cocoa">
                          {puppy.age}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-scrawl text-sm text-cocoa-soft">Where</dt>
                        <dd className="mt-0.5 text-[1.05rem] font-semibold text-cocoa">
                          {puppy.origin?.slug === 'local' ? 'In Dubai' : 'Imported for you'}
                        </dd>
                      </div>
                    </dl>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col gap-3">
                      <a
                        className="btn btn-whatsapp"
                        href={getWhatsAppHref()}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Ask about this puppy on WhatsApp
                      </a>
                      <a className="btn btn-ghost" href={`#enquire-${puppy.slug}`}>
                        Send an enquiry
                      </a>
                    </div>
                  </div>

                  {/* What comes with this puppy Card */}
                  <div className="tp-paper mt-8 -rotate-1" data-reveal="true">
                    <p className="tp-chapter">
                      <span aria-hidden="true" className="tp-chapter__n font-plush">
                        2
                      </span>
                      <span className="font-scrawl">
                        what comes with{' '}
                        {puppy.name && puppy.name.trim()
                          ? puppy.name
                          : `this ${puppy.displayName}`}
                      </span>
                    </p>
                    <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                    <ul className="mt-4 space-y-2.5">
                      <li className="flex items-start gap-3 font-semibold">
                        <svg
                          aria-hidden="true"
                          className="mt-0.5 size-6 shrink-0 text-toffee-deep"
                          viewBox="0 0 32 32"
                        >
                          <path
                            d="M5 17l7 7L27 8"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3.4"
                          ></path>
                        </svg>
                        Vaccinated
                      </li>
                      <li className="flex items-start gap-3 font-semibold">
                        <svg
                          aria-hidden="true"
                          className="mt-0.5 size-6 shrink-0 text-toffee-deep"
                          viewBox="0 0 32 32"
                        >
                          <path
                            d="M5 17l7 7L27 8"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3.4"
                          ></path>
                        </svg>
                        Dewormed
                      </li>
                      <li className="flex items-start gap-3 font-semibold">
                        <svg
                          aria-hidden="true"
                          className="mt-0.5 size-6 shrink-0 text-toffee-deep"
                          viewBox="0 0 32 32"
                        >
                          <path
                            d="M5 17l7 7L27 8"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3.4"
                          ></path>
                        </svg>
                        Verified health certificate from licensed vets
                      </li>
                      <li className="flex items-start gap-3 font-semibold">
                        <svg
                          aria-hidden="true"
                          className="mt-0.5 size-6 shrink-0 text-toffee-deep"
                          viewBox="0 0 32 32"
                        >
                          <path
                            d="M5 17l7 7L27 8"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3.4"
                          ></path>
                        </svg>
                        Thoroughly checked before joining your family
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter 3: Coming home from abroad */}
            <section aria-labelledby={`home-steps-${puppy.slug}`} className="mt-20" data-reveal="true">
              <p className="tp-chapter">
                <span aria-hidden="true" className="tp-chapter__n font-plush">
                  3
                </span>
                <span className="font-scrawl">the way home</span>
              </p>
              <h2
                className="font-plush text-big mt-3"
                id={`home-steps-${puppy.slug}`}
              >
                Coming home from abroad
              </h2>
              <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
                <li>
                  <span aria-hidden="true" className="tp-trail__num font-plush">
                    1
                  </span>
                  <h3 className="font-plush-text text-xl font-bold leading-tight text-cocoa">
                    Reserve your puppy
                  </h3>
                  <p className="mt-2 max-w-[38ch] text-cocoa-soft">
                    Tell us which puppy has captured your heart.
                  </p>
                </li>
                <li>
                  <span aria-hidden="true" className="tp-trail__num font-plush">
                    2
                  </span>
                  <h3 className="font-plush-text text-xl font-bold leading-tight text-cocoa">
                    Personalized consultation
                  </h3>
                  <p className="mt-2 max-w-[38ch] text-cocoa-soft">
                    We finalize details with you and share updates on your puppy's journey.
                  </p>
                </li>
                <li>
                  <span aria-hidden="true" className="tp-trail__num font-plush">
                    3
                  </span>
                  <h3 className="font-plush-text text-xl font-bold leading-tight text-cocoa">
                    Import and arrival
                  </h3>
                  <p className="mt-2 max-w-[38ch] text-cocoa-soft">
                    We manage health checks, travel arrangements, and documentation.
                  </p>
                </li>
                <li>
                  <span aria-hidden="true" className="tp-trail__num font-plush">
                    4
                  </span>
                  <h3 className="font-plush-text text-xl font-bold leading-tight text-cocoa">
                    Welcome home
                  </h3>
                  <p className="mt-2 max-w-[38ch] text-cocoa-soft">
                    We help your new puppy settle in and ensure a smooth transition into your home.
                  </p>
                </li>
              </ol>
            </section>

            {/* Chapter 4: Puppy Enquiry Form */}
            <section
              aria-labelledby={`enquire-title-${puppy.slug}`}
              className="tp-letter mt-20 grid gap-10 lg:grid-cols-12 relative"
              id={`enquire-${puppy.slug}`}
              data-reveal="true"
            >
              {/* Postage Stamp Badge */}
              <span aria-hidden="true" className="tp-letter__stamp transition-transform duration-300 hover:rotate-12 hover:scale-105">
                <svg aria-hidden="true" className="size-9" fill="currentColor" viewBox="0 0 64 64">
                  <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z"></path>
                </svg>
              </span>

              <div className="lg:col-span-4">
                <p className="tp-chapter">
                  <span aria-hidden="true" className="tp-chapter__n font-plush">
                    4
                  </span>
                  <span className="font-scrawl">dear TeddyPups…</span>
                </p>
                <h2
                  className="font-plush text-big mt-2 text-cocoa"
                  id={`enquire-title-${puppy.slug}`}
                >
                  Ask about this puppy
                </h2>
                <p className="mt-4 text-cocoa-soft">
                  Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.
                </p>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                {isSubmitted ? (
                  <div
                    role="status"
                    className="tp-sent rounded-[2rem] border-[3px] border-cocoa bg-honey p-8 text-center"
                    style={{
                      animation: 'tpSentEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                      transformOrigin: 'top center',
                    }}
                  >
                    <svg
                      viewBox="0 0 120 84"
                      className="tp-envelope mx-auto"
                      aria-hidden={true}
                      style={{
                        width: '110px',
                        height: '77px',
                        maxWidth: '110px',
                        animation: 'tpEnvelopeBounce 0.7s ease-out both',
                      }}
                    >
                      <path
                        d="M6 10h108v68H6z"
                        fill="#fffdf8"
                        stroke="#2a170e"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 10l54 40 54-40"
                        fill="none"
                        stroke="#2a170e"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="94"
                        cy="62"
                        r="10"
                        fill="#c2622b"
                        stroke="#2a170e"
                        strokeWidth="2"
                      />
                    </svg>
                    <p className="font-plush mt-4 text-[2rem] text-cocoa font-bold leading-tight">
                      Message received!
                    </p>
                    <p className="mx-auto mt-2 max-w-[38ch] text-cocoa-soft text-base">
                      Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.
                    </p>
                    <a
                      href={getWhatsAppHref()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp mt-6 inline-flex"
                    >
                      WhatsApp us
                    </a>
                  </div>
                ) : (
                  <form
                    ref={formRef}
                    className="space-y-5"
                    noValidate
                    onSubmit={handleEnquirySubmit}
                  >
                    {/* Error Banner */}
                    {formAlert && (
                      <p
                        role="alert"
                        className="rounded-2xl bg-blush px-4 py-3 font-semibold text-cocoa"
                      >
                        {formAlert}
                      </p>
                    )}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          className="block text-[0.95rem] font-semibold text-cocoa"
                          htmlFor={`name-${puppy.slug}`}
                        >
                          Your name
                          <span className="text-toffee-ink"> *</span>
                        </label>
                        <input
                          ref={nameInputRef}
                          id={`name-${puppy.slug}`}
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          maxLength={80}
                          minLength={2}
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (formErrors.name) {
                              const next = { ...formErrors };
                              delete next.name;
                              setFormErrors(next);
                            }
                          }}
                          aria-invalid={formErrors.name ? 'true' : 'false'}
                          aria-describedby={formErrors.name ? `name-err-${puppy.slug}` : undefined}
                          className="mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-[#b3261e]"
                        />
                        {formErrors.name && (
                          <p
                            id={`name-err-${puppy.slug}`}
                            className="mt-1 text-sm font-semibold text-[#b3261e]"
                          >
                            {formErrors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className="block text-[0.95rem] font-semibold text-cocoa"
                          htmlFor={`phone-${puppy.slug}`}
                        >
                          Phone or WhatsApp
                          <span className="text-toffee-ink"> *</span>
                        </label>
                        <input
                          ref={phoneInputRef}
                          id={`phone-${puppy.slug}`}
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (formErrors.phone) {
                              const next = { ...formErrors };
                              delete next.phone;
                              setFormErrors(next);
                            }
                          }}
                          aria-invalid={formErrors.phone ? 'true' : 'false'}
                          aria-describedby={
                            formErrors.phone
                              ? `phone-err-${puppy.slug}`
                              : `phone-hint-${puppy.slug}`
                          }
                          className="mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-[#b3261e]"
                        />
                        {!formErrors.phone && (
                          <p
                            className="mt-1 text-sm text-cocoa-soft"
                            id={`phone-hint-${puppy.slug}`}
                          >
                            With country code, e.g. +971 50 123 4567
                          </p>
                        )}
                        {formErrors.phone && (
                          <p
                            id={`phone-err-${puppy.slug}`}
                            className="mt-1 text-sm font-semibold text-[#b3261e]"
                          >
                            {formErrors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className="block text-[0.95rem] font-semibold text-cocoa"
                          htmlFor={`email-${puppy.slug}`}
                        >
                          Email
                          <span className="font-normal text-cocoa-soft"> (optional)</span>
                        </label>
                        <input
                          ref={emailInputRef}
                          id={`email-${puppy.slug}`}
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (formErrors.email) {
                              const next = { ...formErrors };
                              delete next.email;
                              setFormErrors(next);
                            }
                          }}
                          aria-invalid={formErrors.email ? 'true' : 'false'}
                          aria-describedby={formErrors.email ? `email-err-${puppy.slug}` : undefined}
                          className="mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-[#b3261e]"
                        />
                        {formErrors.email && (
                          <p
                            id={`email-err-${puppy.slug}`}
                            className="mt-1 text-sm font-semibold text-[#b3261e]"
                          >
                            {formErrors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          className="block text-[0.95rem] font-semibold text-cocoa"
                          htmlFor={`area-${puppy.slug}`}
                        >
                          Your area
                          <span className="font-normal text-cocoa-soft"> (optional)</span>
                        </label>
                        <input
                          id={`area-${puppy.slug}`}
                          name="area"
                          autoComplete="address-level2"
                          maxLength={80}
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          aria-describedby={`area-hint-${puppy.slug}`}
                          className="mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)]"
                        />
                        <p
                          className="mt-1 text-sm text-cocoa-soft"
                          id={`area-hint-${puppy.slug}`}
                        >
                          e.g. Dubai Marina
                        </p>
                      </div>
                    </div>

                    <input name="puppyId" type="hidden" value={puppy.id} />

                    <div>
                      <label
                        className="block text-[0.95rem] font-semibold text-cocoa"
                        htmlFor={`msg-${puppy.slug}`}
                      >
                        Message
                        <span className="font-normal text-cocoa-soft"> (optional)</span>
                      </label>
                      <textarea
                        id={`msg-${puppy.slug}`}
                        name="message"
                        rows={4}
                        maxLength={2000}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="mt-1.5 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 py-3 text-base outline-none focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)]"
                      />
                    </div>

                    {/* Honeypot anti-spam */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label>
                        Website
                        <input autoComplete="off" name="website" tabIndex={-1} defaultValue="" />
                      </label>
                    </div>

                    <button
                      className="btn btn-primary w-full disabled:opacity-70 sm:w-auto"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending…' : 'Send enquiry'}
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* Previous / Next Puppy Navigation */}
            {prevPuppy && nextPuppy && (
              <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2" data-reveal="true">
                <Link
                  className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1"
                  to={`/puppies/${prevPuppy.slug}`}
                >
                  <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
                    <img
                      alt={prevPuppy.cover?.alt || `${prevPuppy.displayName} puppy`}
                      src={resolveMediaUrl(prevPuppy.cover?.url || '')}
                      className="size-full object-cover"
                      style={{
                        objectPosition: `${(prevPuppy.cover?.focalX || 0.5) * 100}% ${(prevPuppy.cover?.focalY || 0.5) * 100}%`,
                        backgroundColor: prevPuppy.cover?.color || '#e8e8e8',
                      }}
                    />
                  </span>
                  <span>
                    <span className="font-scrawl block text-sm text-cocoa-soft">
                      Previous pup
                    </span>
                    <span className="font-plush text-[1.6rem] text-cocoa">
                      {prevPuppy.name && prevPuppy.name.trim()
                        ? prevPuppy.name
                        : prevPuppy.displayName}
                    </span>
                  </span>
                </Link>

                <Link
                  className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:flex-row-reverse sm:text-right"
                  to={`/puppies/${nextPuppy.slug}`}
                >
                  <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
                    <img
                      alt={nextPuppy.cover?.alt || `${nextPuppy.displayName} puppy`}
                      src={resolveMediaUrl(nextPuppy.cover?.url || '')}
                      className="size-full object-cover"
                      style={{
                        objectPosition: `${(nextPuppy.cover?.focalX || 0.5) * 100}% ${(nextPuppy.cover?.focalY || 0.5) * 100}%`,
                        backgroundColor: nextPuppy.cover?.color || '#e8e8e8',
                      }}
                    />
                  </span>
                  <span>
                    <span className="font-scrawl block text-sm text-cocoa-soft">
                      Next pup
                    </span>
                    <span className="font-plush text-[1.6rem] text-cocoa">
                      {nextPuppy.name && nextPuppy.name.trim()
                        ? nextPuppy.name
                        : nextPuppy.displayName}
                    </span>
                  </span>
                </Link>
              </nav>
            )}
          </div>
        </article>
      </div>

      {/* Full-Screen Image Viewer Modal */}
      <FullScreenImageViewer
        photos={viewerPhotos}
        initialIndex={activeIdx}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </main>
  );
};
