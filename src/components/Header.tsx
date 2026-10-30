import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PawIcon = ({ className = "tp-nav-link__paw" }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 64 64">
    <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z"></path>
  </svg>
);

export const Header: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Puppies', href: '/puppies' },
    { label: 'Happy families', href: '/happy-families' },
    { label: 'How it works', href: '/how-it-works' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Visit & contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      id="site-header"
      className="tp-header fixed inset-x-0 top-0 z-50"
      data-hidden="false"
      data-scrolled={isScrolled ? "true" : "false"}
    >
      <div className="tp-header__bar gutter">
        <Link aria-label="TeddyPups U.A.E. — home" className="tp-header__brand" to="/">
          <img
            alt=""
            className="tp-header__logo"
            width="56"
            height="56"
            src="/brand/logo.png"
            style={{ color: 'transparent' }}
          />
          <span className="font-plush tp-header__name">TeddyPups</span>
        </Link>

        <nav aria-label="Main" className="tp-header__nav">
          <ul>
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="tp-nav-link"
                    data-active={active ? "true" : "false"}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    <PawIcon />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="tp-header__end">
          <a
            className="btn btn-whatsapp tp-header__wa"
            href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp us
          </a>
          <button
            aria-haspopup="dialog"
            className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-cocoa bg-milk px-4 text-[0.95rem] font-semibold lg:hidden"
            type="button"
            onClick={() => setMenuOpen(true)}
          >
            <PawIcon className="size-4" />
            Menu
          </button>

          <dialog
            ref={dialogRef}
            aria-label="Site menu"
            className="tp-menu m-0 h-dvh max-h-none w-screen max-w-none bg-honey p-0 text-cocoa backdrop:bg-cocoa/40"
            onClose={() => setMenuOpen(false)}
          >
            <div className="flex h-full flex-col gutter pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-center justify-between">
                <span className="font-scrawl text-lg">where to, friend?</span>
                <button
                  className="h-11 rounded-full bg-cocoa px-5 font-semibold text-milk"
                  type="button"
                  onClick={() => setMenuOpen(false)}
                >
                  Close
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-10 flex-1">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className="tp-menu-link font-plush block py-2 text-[clamp(2.4rem,11vw,3.4rem)]"
                          data-active={active ? "true" : "false"}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setMenuOpen(false)}
                        >
                          <span>{item.label}</span>
                          <PawIcon />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="space-y-3">
                <a
                  className="btn btn-whatsapp w-full"
                  href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp us
                </a>
                <p className="text-center text-sm font-medium">+971 54 167 6733</p>
              </div>
            </div>
          </dialog>
        </div>
      </div>

      <svg aria-hidden="true" className="tp-header__hem" height="14" preserveAspectRatio="none" width="100%">
        <defs>
          <pattern height="14" id="tp-hem" patternUnits="userSpaceOnUse" width="44">
            <path className="tp-header__hem-fill" d="M0 0H44V2A22 11 0 0 1 0 2Z"></path>
            <path className="tp-header__hem-line" d="M0 2A22 11 0 0 0 44 2"></path>
          </pattern>
        </defs>
        <rect fill="url(#tp-hem)" height="14" width="100%"></rect>
      </svg>
    </header>
  );
};

