import React, { useState, useRef, useEffect } from 'react';
import { PupBuddy } from '../components/pup/PupBuddy';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    puppyId: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [phase, setPhase] = useState<'writing' | 'sealing' | 'posting' | 'sent'>('writing');
  const [pending, setPending] = useState(false);
  const [minHeight, setMinHeight] = useState<number | undefined>();

  const postRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);

  // Focus first invalid input when validation fails
  useEffect(() => {
    if (errorMessage && Object.keys(errors).length > 0) {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid=true]')?.focus();
    }
  }, [errorMessage, errors]);

  // Focus sent box when phase changes to sent
  useEffect(() => {
    if (phase === 'sent' && sentRef.current) {
      sentRef.current.focus({ preventScroll: true });
    }
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errs: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errs.name = 'Please enter your name.';
    }

    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || !/^\+[\d\s\-()]{7,}$/.test(cleanPhone)) {
      errs.phone = 'Please enter your phone number with country code (e.g. +971).';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setErrorMessage('Please check the highlighted fields.');
      return;
    }

    // Validation succeeded
    setErrors({});
    setErrorMessage('');
    setPending(true);

    if (postRef.current) {
      setMinHeight(postRef.current.offsetHeight);
    }

    setPhase('sealing');

    setTimeout(() => {
      setPhase('posting');
    }, 750);

    setTimeout(() => {
      setMinHeight(undefined);
      setPhase('sent');
      setPending(false);
    }, 1750);
  };

  const errorsList = Object.entries(errors).filter(([k]) => k !== 'website');

  return (
    <main className="relative pt-[var(--header-h)] outline-none" id="main" tabIndex={-1}>
      <div className="tp-page" data-page="contact">
        <section
          aria-labelledby="contact-title"
          className="tp-scene"
          data-pup-scene="true"
          data-tone="light"
          style={{ '--sky-top': '#fff9ee', '--sky-bottom': '#f9dca4' } as React.CSSProperties}
        >
          <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
            <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <h1 className="font-plush text-giant max-w-[12ch] lg:col-span-7" id="contact-title">
                Get in touch with us
              </h1>
              <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
                Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just seeking info, we'd love to hear from you!
              </p>
            </header>

            <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
              {/* Left Column: Letterform + Mascot */}
              <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
                <div
                  ref={postRef}
                  className="tp-post"
                  data-phase={phase}
                  style={minHeight ? { minHeight } : undefined}
                >
                  {phase !== 'sent' && (
                    <form
                      ref={formRef}
                      className="tp-letterform"
                      noValidate
                      onSubmit={handleSubmit}
                      aria-hidden={phase !== 'writing' ? true : undefined}
                      inert={phase !== 'writing' ? '' : undefined}
                    >
                      <span aria-hidden="true" className="tp-letter__stamp">
                        <svg aria-hidden="true" className="size-9" fill="currentColor" viewBox="0 0 64 64">
                          <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
                        </svg>
                      </span>

                      <p className="font-scrawl tp-letterform__greeting">Dear TeddyPups,</p>

                      {errorMessage && (
                        <div role="alert" className="tp-letterform__alert">
                          <p className="font-semibold">{errorMessage}</p>
                          {errorsList.length > 0 && (
                            <ul>
                              {errorsList.map(([key, msg]) => (
                                <li id={`${key}-err`} key={key}>
                                  {msg}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      <p className="tp-letterform__line">
                        my name is{' '}
                        <span className="tp-blank" style={{ '--size': '16ch' } as React.CSSProperties}>
                          <input
                            aria-label="Your name (required)"
                            autoComplete="name"
                            maxLength={80}
                            minLength={2}
                            name="name"
                            required
                            aria-invalid={errors.name ? true : undefined}
                            aria-describedby={errors.name ? 'name-err' : undefined}
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value });
                              if (errors.name) {
                                const newErrs = { ...errors };
                                delete newErrs.name;
                                setErrors(newErrs);
                              }
                            }}
                          />
                        </span>
                        , and you can reach me on{' '}
                        <span className="tp-blank" style={{ '--size': '15ch' } as React.CSSProperties}>
                          <input
                            aria-label="Phone or WhatsApp number with country code (required)"
                            autoComplete="tel"
                            inputMode="tel"
                            name="phone"
                            placeholder="+971 50 123 4567"
                            required
                            type="tel"
                            aria-invalid={errors.phone ? true : undefined}
                            aria-describedby={errors.phone ? 'phone-err' : undefined}
                            value={formData.phone}
                            onChange={(e) => {
                              setFormData({ ...formData, phone: e.target.value });
                              if (errors.phone) {
                                const newErrs = { ...errors };
                                delete newErrs.phone;
                                setErrors(newErrs);
                              }
                            }}
                          />
                        </span>{' '}
                        or by email at{' '}
                        <span className="tp-blank" style={{ '--size': '20ch' } as React.CSSProperties}>
                          <input
                            aria-label="Email (optional)"
                            autoComplete="email"
                            name="email"
                            placeholder="optional"
                            type="email"
                            aria-invalid={errors.email ? true : undefined}
                            aria-describedby={errors.email ? 'email-err' : undefined}
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value });
                              if (errors.email) {
                                const newErrs = { ...errors };
                                delete newErrs.email;
                                setErrors(newErrs);
                              }
                            }}
                          />
                        </span>
                        .
                      </p>

                      <p className="tp-letterform__line">
                        I live in{' '}
                        <span className="tp-blank" style={{ '--size': '13ch' } as React.CSSProperties}>
                          <input
                            aria-label="Your area (optional)"
                            autoComplete="address-level2"
                            maxLength={80}
                            name="area"
                            placeholder="e.g. Dubai Marina"
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          />
                        </span>
                        , and I'm curious about{' '}
                        <span className="tp-blank tp-blank--select">
                          <label className="sr-only" htmlFor="contact-puppy-select">
                            Puppy you're interested in (optional)
                          </label>
                          <select
                            id="contact-puppy-select"
                            name="puppyId"
                            value={formData.puppyId}
                            onChange={(e) => setFormData({ ...formData, puppyId: e.target.value })}
                          >
                            <option value="">any puppy (not sure yet)</option>
                            <option value="Max">Max (Maltipoo, boy)</option>
                            <option value="Korean Teacup Maltipoo">Korean Teacup Maltipoo (girl)</option>
                            <option value="Korean Teacup Poodle">Korean Teacup Poodle (girl)</option>
                            <option value="Maltipoo & Cavapoo">Maltipoo &amp; Cavapoo (boy)</option>
                            <option value="Toy Poodle">Toy Poodle (boy &amp; girl)</option>
                            <option value="Maltipoo">Maltipoo (girl)</option>
                            <option value="Pomeranian">Pomeranian (girl)</option>
                            <option value="Copper">Copper (Cavapoo, boy)</option>
                            <option value="Shih Tzu">Shih Tzu (girl &amp; boy)</option>
                            <option value="Korean Teacup Pomeranian">Korean Teacup Pomeranian</option>
                          </select>
                        </span>
                        .
                      </p>

                      <label className="sr-only" htmlFor="contact-message">
                        Your message (optional)
                      </label>
                      <textarea
                        className="tp-letterform__note"
                        id="contact-message"
                        maxLength={2000}
                        name="message"
                        placeholder="Anything else you'd like to tell us…"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />

                      <div aria-hidden={true} className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                        <label>
                          Website
                          <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                        </label>
                      </div>

                      <div className="tp-letterform__sign">
                        <p className="font-scrawl">with love, a future puppy parent</p>
                        <button className="btn btn-primary disabled:opacity-70" type="submit" disabled={pending}>
                          {pending ? 'Sealing the envelope…' : 'Post my letter'}
                        </button>
                      </div>
                    </form>
                  )}

                  {(phase === 'sealing' || phase === 'posting') && (
                    <div aria-hidden={true} className="tp-post__scene">
                      <svg viewBox="0 0 160 112" className="tp-post__envelope">
                        <rect x="4" y="18" width="152" height="90" rx="6" fill="#fffdf8" stroke="#2a170e" strokeWidth="4" />
                        <path d="M6 104 64 62M154 104 96 62" fill="none" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" />
                        <path className="tp-post__flap" d="M6 22 80 74 154 22" fill="#fbe3b4" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                        <circle cx="80" cy="72" r="11" fill="#a24a1a" stroke="#2a170e" strokeWidth="3" />
                      </svg>
                      <svg viewBox="0 0 200 260" className="tp-post__box">
                        <rect x="86" y="170" width="28" height="86" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
                        <path d="M30 70a70 54 0 0 1 140 0v104H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
                        <rect x="58" y="86" width="84" height="14" rx="7" fill="#2a170e" />
                        <path d="M44 128h112" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" opacity=".35" />
                        <g className="tp-post__flag">
                          <path d="M170 120V64" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
                          <path d="M170 64h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                        </g>
                      </svg>
                    </div>
                  )}

                  {phase === 'sent' && (
                    <div ref={sentRef} tabIndex={-1} role="status" className="tp-post__sent">
                      <svg viewBox="0 0 200 150" aria-hidden={true} className="tp-post__box tp-post__box--sent">
                        <rect x="86" y="96" width="28" height="52" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
                        <path d="M30 50a70 44 0 0 1 140 0v52H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
                        <rect x="58" y="58" width="84" height="12" rx="6" fill="#2a170e" />
                        <path d="M170 92V22" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
                        <path d="M170 22h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                      </svg>
                      <p className="font-plush mt-4 text-[2rem]">Message received!</p>
                      <p className="mx-auto mt-2 max-w-[40ch] text-cocoa-soft">
                        Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.
                      </p>
                      <a
                        href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp mt-6"
                      >
                        WhatsApp us
                      </a>
                    </div>
                  )}
                </div>

                {/* Contact Page Mascot under the Letterform */}
                <div className="ml-auto mr-6 -mt-3 w-36 md:w-40">
                  <PupBuddy
                    pose="sit"
                    facing="left"
                    label="Teddy, waiting for your letter"
                  />
                </div>
              </div>

              {/* Right Column: Direct details + Showroom */}
              <div className="lg:col-span-5 lg:row-start-1">
                <a
                  className="btn btn-whatsapp w-full sm:w-auto"
                  href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp +971 54 167 6733
                </a>

                <dl className="mt-10 space-y-6">
                  <div>
                    <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                    <dd className="mt-1 text-lg font-semibold">
                      <a className="link-ink" href="tel:+971541676733">
                        +971 54 167 6733
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                    <dd className="mt-1 break-all text-lg font-semibold">
                      <a className="link-ink" href="mailto:teddypupsadmin@gmail.com">
                        teddypupsadmin@gmail.com
                      </a>
                    </dd>
                  </div>
                </dl>

                <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                  <svg aria-hidden="true" className="absolute -bottom-1 right-0 w-3/4 text-toffee/30" viewBox="0 0 300 120">
                    <path
                      d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.6"
                    />
                  </svg>
                  <div className="tp-visit relative p-7 pt-6">
                    <div>
                      <h2 className="font-plush text-[2rem] leading-tight" id="visit-title">
                        Visit us in Downtown Dubai
                      </h2>
                      <p className="mt-3 max-w-[38ch] text-cocoa-soft">
                        Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.
                      </p>
                      <p className="mt-4 flex items-center gap-2 font-semibold">
                        <svg aria-hidden="true" className="size-5 shrink-0 text-toffee-deep" fill="currentColor" viewBox="0 0 64 64">
                          <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
                        </svg>
                        Downtown Dubai, United Arab Emirates
                      </p>
                      <a
                        className="btn btn-ghost mt-6 !bg-milk"
                        href="https://maps.app.goo.gl/ZdJvwHBSQWWZT54s7"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                    <figure className="tp-visit__photo">
                      <img
                        alt="The apricot teddy bear puppy from our showroom, held up to say hello"
                        className="h-full w-full object-cover"
                        loading="lazy"
                        src="/images/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg"
                      />
                    </figure>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
