import { useState, useEffect } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react';
import { Menu, X, Phone, ArrowUpRight } from 'lucide-react';
import type { PageRoute } from '../types.ts';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NAV_ITEMS: { route: PageRoute; label: string }[] = [
  { route: 'home', label: 'Overview' },
  { route: 'specialities', label: 'Specialities' },
  { route: 'doctors', label: 'Physicians' },
  { route: 'about', label: 'About' },
];

export function Header({ currentRoute, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const nextScrolled = latest > 24;
    if (nextScrolled !== hasScrolled) {
      setHasScrolled(nextScrolled);
    }
  });

  useEffect(() => {
    setHasScrolled(window.scrollY > 24);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentRoute]);

  // Lock body scroll when mobile menu is open & close on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (route: PageRoute) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <>
      <header
        style={{ zIndex: 'var(--z-nav)' }}
        className={`sticky top-0 h-16 md:h-20 transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-base)] ease-[var(--ease-editorial)] ${
          hasScrolled
            ? 'nav-scrolled border-b border-[var(--color-hairline)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-[var(--space-4)] sm:px-[var(--space-8)] flex items-center justify-between gap-[var(--space-8)]">
          {/* Zone 1: Logo Lockup (Pulse SVG Motif + Cormorant Garamond Wordmark) */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="inline-flex items-center gap-[var(--space-3)] text-[var(--color-primary)] whitespace-nowrap shrink-0 py-[var(--space-2)]"
          >
            <svg
              width="28"
              height="16"
              viewBox="0 0 28 16"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-[var(--color-accent)]"
            >
              <path
                d="M 1 8 L 8 8 C 10 8, 11 4, 12.5 4 C 14 4, 14.5 13, 16 13 C 17.5 13, 18.5 2, 20 2 C 21.5 2, 22.5 8, 24.5 8 L 27 8"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="font-serif font-medium tracking-tight"
              style={{
                fontSize: 'var(--type-xl-size)',
                lineHeight: 1,
                letterSpacing: 'var(--type-xl-tracking)',
              }}
            >
              Aurelia
            </span>
          </a>

          {/* Zone 2: Center Navigation with Underline-Draw Hover */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-[var(--space-8)]"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => handleLinkClick(item.route)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative py-[var(--space-2)] font-medium whitespace-nowrap shrink-0 transition-colors duration-[var(--duration-fast)] cursor-pointer ${
                    isActive
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-ink-muted)] hover:text-[var(--color-primary)]'
                  }`}
                  style={{
                    fontSize: 'var(--type-sm-size)',
                    lineHeight: 'var(--type-sm-leading)',
                  }}
                >
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-0 right-0 bottom-[var(--space-1)] h-[1.5px] bg-[var(--color-accent)] origin-left transition-transform duration-[var(--duration-base)] ease-[var(--ease-editorial)] ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Emergency Contact + Primary CTA */}
          <div className="flex items-center gap-[var(--space-5)] shrink-0">
            <a
              href="tel:+442079460811"
              className="hidden lg:inline-flex items-center gap-[var(--space-2)] font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] transition-colors duration-[var(--duration-fast)] whitespace-nowrap shrink-0 tabular-nums py-[var(--space-2)]"
              style={{ fontSize: 'var(--type-xs-size)', letterSpacing: 'var(--type-xs-tracking)' }}
              aria-label="24/7 Emergency Telephone 020 7946 0811"
            >
              <Phone
                className="w-3.5 h-3.5 text-[var(--color-accent-text)]"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <span>020 7946 0811</span>
            </a>

            <div className="hidden md:block">
              <button
                type="button"
                onClick={() => handleLinkClick('book')}
                className="group inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] px-[var(--space-5)] py-[var(--space-2)] font-medium transition-colors duration-[var(--duration-fast)] cursor-pointer whitespace-nowrap shrink-0 min-h-[44px]"
                style={{ fontSize: 'var(--type-sm-size)' }}
              >
                <span>Book Appointment</span>
                <ArrowUpRight
                  className="w-4 h-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-editorial)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-overlay"
              aria-label="Open navigation menu"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[var(--radius-md)] text-[var(--color-primary)] hover:bg-[var(--color-primary-tint)] transition-colors duration-[var(--duration-fast)] cursor-pointer"
            >
              <Menu className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-overlay"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.12 : 0.28, ease: EDITORIAL_EASE }}
            style={{ zIndex: 'var(--z-modal)' }}
            className="fixed inset-0 bg-[var(--color-primary)] text-[var(--color-on-primary)] flex flex-col justify-between p-[var(--space-6)] sm:p-[var(--space-8)] md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between gap-[var(--space-4)]">
              <span
                className="font-serif font-medium text-[var(--color-on-primary)]"
                style={{ fontSize: 'var(--type-xl-size)', lineHeight: 1 }}
              >
                Aurelia
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex items-center justify-center gap-[var(--space-2)] min-h-[48px] min-w-[48px] px-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--color-hairline-inverse)] text-[var(--color-on-primary)] hover:bg-white/10 transition-colors duration-[var(--duration-fast)] cursor-pointer"
                style={{ fontSize: 'var(--type-sm-size)' }}
              >
                <span>Close</span>
                <X className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile navigation links" className="flex flex-col my-auto py-[var(--space-8)]">
              {[...NAV_ITEMS, { route: 'book' as PageRoute, label: 'Book Appointment' }].map(
                (item, idx) => {
                  const isActive = currentRoute === item.route;
                  return (
                    <motion.button
                      key={item.route}
                      type="button"
                      onClick={() => handleLinkClick(item.route)}
                      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.42,
                        delay: shouldReduceMotion ? 0 : 0.06 * idx,
                        ease: EDITORIAL_EASE,
                      }}
                      className={`text-left font-serif py-[var(--space-4)] border-b border-[var(--color-hairline-inverse)] transition-colors duration-[var(--duration-fast)] cursor-pointer ${
                        isActive
                          ? 'text-[var(--color-accent-on-dark)]'
                          : 'text-[var(--color-on-primary)] hover:text-[var(--color-accent-on-dark)]'
                      }`}
                      style={{
                        fontSize: 'var(--type-2xl-size)',
                        lineHeight: 'var(--type-2xl-leading)',
                      }}
                    >
                      {item.label}
                    </motion.button>
                  );
                }
              )}
            </nav>

            <div className="pt-[var(--space-6)] border-t border-[var(--color-hairline-inverse)] flex flex-col gap-[var(--space-2)]">
              <p
                className="uppercase text-[var(--color-on-primary)]/70"
                style={{
                  fontSize: 'var(--type-xs-size)',
                  letterSpacing: 'var(--type-xs-tracking)',
                }}
              >
                24/7 Urgent &amp; Emergency Assessment
              </p>
              <a
                href="tel:+442079460811"
                className="inline-flex items-center gap-[var(--space-3)] font-medium text-[var(--color-on-primary)] tabular-nums"
                style={{ fontSize: 'var(--type-lg-size)' }}
              >
                <Phone
                  className="w-4 h-4 text-[var(--color-accent-on-dark)]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span>020 7946 0811</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
