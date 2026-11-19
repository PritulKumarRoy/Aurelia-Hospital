import { useRef, type MouseEvent, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import type { PageRoute } from '../types.ts';
import { MedicalImage } from './MedicalImage.tsx';

interface HeroSectionProps {
  onNavigate: (route: PageRoute) => void;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HEADLINE_WORDS = ['Care', 'that', 'feels', 'considered.'];

function MagneticPrimaryButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 280, damping: 22 });
  const springY = useSpring(rawY, { stiffness: 280, damping: 22 });

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    rawX.set(Math.max(-1, Math.min(1, relX)) * 6);
    rawY.set(Math.max(-1, Math.min(1, relY)) * 6);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
      className="group inline-flex items-center justify-center gap-[var(--space-3)] rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] px-[var(--space-6)] py-[var(--space-3)] font-medium transition-colors duration-[var(--duration-fast)] cursor-pointer whitespace-nowrap shrink-0 min-h-[44px]"
    >
      {children}
    </motion.button>
  );
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section
      ref={heroRef}
      className="relative bg-[var(--color-base)] pt-[var(--space-16)] pb-[var(--space-16)] lg:pt-[var(--space-24)] lg:pb-[var(--space-24)]"
    >
      {/* Subtle 3% grain texture overlay on hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Far-left vertical rail label (desktop only) */}
      <div
        aria-hidden="true"
        style={{ zIndex: 'var(--z-raised)' }}
        className="hidden xl:flex flex-col items-center gap-[var(--space-4)] absolute left-[var(--space-6)] top-[var(--space-24)] select-none"
      >
        <span className="w-px h-[var(--space-12)] bg-[var(--color-hairline-strong)]" />
        <span
          className="uppercase text-[var(--color-ink-muted)]"
          style={{
            writingMode: 'vertical-rl',
            fontSize: 'var(--type-xs-size)',
            lineHeight: 'var(--type-xs-leading)',
            letterSpacing: 'var(--type-xs-tracking)',
          }}
        >
          Compassionate care · Modern medicine
        </span>
      </div>

      {/* Main 12-col Asymmetric 5/7 Grid */}
      <div className="relative max-w-7xl mx-auto px-[var(--space-4)] sm:px-[var(--space-8)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-10)] lg:gap-[var(--space-12)] items-center">
          {/* Left 5 Columns: Copy & Actions */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <motion.p
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
              className="uppercase font-medium text-[var(--color-accent-text)] mb-[var(--space-5)]"
              style={{
                fontSize: 'var(--type-xs-size)',
                lineHeight: 'var(--type-xs-leading)',
                letterSpacing: 'var(--type-xs-tracking)',
              }}
            >
              Aurelia Private Hospital · Est. 1998
            </motion.p>

            {/* Word-by-word clip-mask reveal */}
            <h1
              className="font-serif font-medium text-[var(--color-ink)]"
              style={{
                fontSize: 'var(--type-display-size)',
                lineHeight: 'var(--type-display-leading)',
                letterSpacing: 'var(--type-display-tracking)',
              }}
            >
              {HEADLINE_WORDS.map((word, index) => (
                <span
                  key={word}
                  className="inline-block overflow-hidden align-bottom mr-[0.22em] pb-[0.06em]"
                >
                  <motion.span
                    className="inline-block"
                    initial={shouldReduceMotion ? undefined : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.65,
                      delay: shouldReduceMotion ? 0 : index * 0.06,
                      ease: EDITORIAL_EASE,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.55,
                delay: shouldReduceMotion ? 0 : 0.28,
                ease: EDITORIAL_EASE,
              }}
              className="mt-[var(--space-6)] text-[var(--color-ink-muted)] max-w-[55ch]"
              style={{
                fontSize: 'var(--type-base-size)',
                lineHeight: 'var(--type-base-leading)',
                letterSpacing: 'var(--type-base-tracking)',
              }}
            >
              Consultant-led cardiology, neurosurgery, orthopedics, and precision diagnostics
              within an unhurried sanctuary—scheduled within days, never months.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.55,
                delay: shouldReduceMotion ? 0 : 0.36,
                ease: EDITORIAL_EASE,
              }}
              className="mt-[var(--space-8)] flex flex-wrap items-center gap-[var(--space-4)]"
            >
              <MagneticPrimaryButton onClick={() => onNavigate('book')}>
                <span
                  style={{
                    fontSize: 'var(--type-sm-size)',
                    lineHeight: 'var(--type-sm-leading)',
                  }}
                >
                  Book Appointment
                </span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-editorial)] group-hover:translate-x-1"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </MagneticPrimaryButton>

              <button
                type="button"
                onClick={() => onNavigate('specialities')}
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-hairline-strong)] bg-transparent hover:bg-[var(--color-primary-tint)] text-[var(--color-primary)] px-[var(--space-6)] py-[var(--space-3)] font-medium transition-colors duration-[var(--duration-fast)] cursor-pointer whitespace-nowrap shrink-0 min-h-[44px]"
                style={{
                  fontSize: 'var(--type-sm-size)',
                  lineHeight: 'var(--type-sm-leading)',
                }}
              >
                Explore Specialities
              </button>
            </motion.div>
          </div>

          {/* Right 7 Columns: Right-Bleeding Image with Scale-In, Parallax, and Stat Card */}
          <div className="lg:col-span-7 relative">
            <div className="relative overflow-x-clip lg:-mr-[max(var(--space-8),calc((100vw-80rem)/2+var(--space-8)))]">
              <div className="relative overflow-hidden rounded-[var(--radius-lg)] lg:rounded-r-none border border-[var(--color-hairline)] lg:border-r-0 bg-[var(--color-surface-tinted)]">
                <motion.div
                  style={shouldReduceMotion ? undefined : { y: parallaxY }}
                  className="will-change-transform"
                >
                  <motion.div
                    initial={shouldReduceMotion ? undefined : { scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 1.4, ease: EDITORIAL_EASE }}
                  >
                    <MedicalImage
                      src="/images/hero-atrium.jpg"
                      alt="Sunlit limestone and oak sanctuary lobby at Aurelia Private Hospital"
                      priority
                      className="w-full min-h-[340px] sm:min-h-[440px] lg:min-h-[540px]"
                    />
                  </motion.div>
                </motion.div>

                {/* Subtle unified warm grade overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[var(--color-primary)]/[0.04]"
                />
              </div>
            </div>

            {/* Overlapping Stat Card at Lower-Left Corner */}
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.55,
                delay: shouldReduceMotion ? 0 : 0.46,
                ease: EDITORIAL_EASE,
              }}
              style={{ zIndex: 'var(--z-raised)' }}
              className="relative sm:absolute sm:bottom-[var(--space-6)] sm:left-[var(--space-6)] lg:-left-[var(--space-8)] mt-[var(--space-4)] sm:mt-0 inline-flex flex-col bg-[var(--color-surface)] border border-[var(--color-hairline)] shadow-[var(--shadow-1)] rounded-[var(--radius-md)] px-[var(--space-6)] py-[var(--space-5)]"
            >
                <span
                  className="font-serif font-medium text-[var(--color-primary)] tabular-nums"
                  style={{
                    fontSize: 'var(--type-2xl-size)',
                    lineHeight: 'var(--type-2xl-leading)',
                    letterSpacing: 'var(--type-2xl-tracking)',
                  }}
                >
                  25+
                </span>
                <span
                  className="mt-[var(--space-1)] uppercase text-[var(--color-ink-muted)]"
                  style={{
                    fontSize: 'var(--type-xs-size)',
                    lineHeight: 'var(--type-xs-leading)',
                    letterSpacing: 'var(--type-xs-tracking)',
                  }}
                >
                  Years of care
                </span>
              </motion.div>
          </div>
        </div>

        {/* Full container-width 1px hairline divider below hero */}
        <div
          aria-hidden="true"
          className="mt-[var(--space-16)] lg:mt-[var(--space-24)] h-px w-full bg-[var(--color-hairline)]"
        />
      </div>
    </section>
  );
}
