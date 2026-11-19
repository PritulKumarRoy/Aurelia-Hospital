import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BedDouble, Globe, ScanLine, ShieldCheck } from 'lucide-react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import type { PageRoute } from '../types.ts';
import { MedicalImage } from '../components/MedicalImage.tsx';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface StatItem {
  target: number;
  suffix: string;
  label: string;
  detail: string;
}

const HOSPITAL_STATS: StatItem[] = [
  {
    target: 25,
    suffix: '+',
    label: 'Years of care',
    detail: 'Serving Harley Street patients since 1998',
  },
  {
    target: 45,
    suffix: ' min',
    label: 'Initial consultation',
    detail: 'Unhurried consultant review as standard',
  },
  {
    target: 28,
    suffix: '',
    label: 'Private suites',
    detail: 'Acoustic-insulated en-suite recovery rooms',
  },
  {
    target: 4,
    suffix: ' hr',
    label: 'Diagnostic reporting',
    detail: 'Same-day consultant 3.0T MRI turnaround',
  },
];

const PILLARS = [
  {
    index: '01',
    title: 'Unhurried Diagnostic Time',
    description:
      'Every outpatient appointment allocates 45 minutes with your named consultant so clinical history, imaging, and treatment options are understood without rush.',
  },
  {
    index: '02',
    title: 'Multidisciplinary Accountability',
    description:
      'Cardiologists, neurologists, orthopedic surgeons, and radiologists review complex cases together on-site, eliminating fragmented referrals across separate clinics.',
  },
  {
    index: '03',
    title: 'Restorative Clinical Architecture',
    description:
      'Natural daylight, acoustic calm, travertine stone, and private en-suite rooms are engineered to reduce patient cortisol and support serene recovery.',
  },
];

const FACILITY_HIGHLIGHTS = [
  {
    index: '01',
    eyebrow: 'Diagnostic Imaging',
    title: 'Wide-Bore 3.0T Quiet MRI Suite',
    detail:
      'High-field neuroimaging, cardiac mapping, and musculoskeletal diagnostics with ambient sound reduction and 4-hour consultant reporting.',
    spec: '70cm Wide Bore · Acoustic Damping · Same-Day Review',
    image: '/images/facility-suite.jpg',
    alt: 'Aurelia wide-bore 3.0T diagnostic and consultation suite in natural oak and limestone',
    Icon: ScanLine,
  },
  {
    index: '02',
    eyebrow: 'Surgical Precision',
    title: 'Three Hybrid Laminar-Flow Theatres',
    detail:
      'ISO Class 5 ultra-clean surgical theatres equipped with robotic joint navigation and continuous intra-operative neuro-monitoring.',
    spec: 'ISO Class 5 Airflow · Hybrid Imaging · Robotic Navigation',
    image: '/images/hero-atrium.jpg',
    alt: 'Sunlit architectural corridor leading to Aurelia laminar-flow surgical wing',
    Icon: ShieldCheck,
  },
  {
    index: '03',
    eyebrow: 'Inpatient Sanctuary',
    title: '28 Private En-Suite Recovery Rooms',
    detail:
      'Acoustic-insulated inpatient suites featuring discreet bedside telemetry, tailored clinical nutrition, and dedicated family accommodation.',
    spec: '24/7 One-to-One Nursing · Daylight Architecture · En-Suite',
    image: '/images/facility-suite.jpg',
    alt: 'Quiet private recovery suite designed for low-cortisol inpatient healing',
    Icon: BedDouble,
  },
  {
    index: '04',
    eyebrow: 'Global Coordination',
    title: 'Dedicated International Patient Desk',
    detail:
      'Multilingual care coordinators managing medical record translation, embassy billing, and seamless continuity of care upon discharge.',
    spec: '14 Languages · Direct Insurer Liaison · Airport Transfer',
    image: '/images/hero-atrium.jpg',
    alt: 'Aurelia patient concierge atrium welcoming domestic and international patients',
    Icon: Globe,
  },
];

function AnimatedStatValue({ target, suffix }: { target: number; suffix: string }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? target : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(target);
      return;
    }
    if (!isInView) return;

    const controls = animate(0, target, {
      duration: 1.3,
      ease: EDITORIAL_EASE,
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, shouldReduceMotion, target]);

  return (
    <span
      ref={ref}
      className="font-serif font-medium text-[var(--color-primary)] tabular-nums"
      style={{
        fontSize: 'var(--type-2xl-size)',
        lineHeight: 'var(--type-2xl-leading)',
        letterSpacing: 'var(--type-2xl-tracking)',
      }}
    >
      {displayValue}
      {suffix}
    </span>
  );
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="max-w-7xl mx-auto px-[var(--space-4)] sm:px-[var(--space-8)] pt-[var(--space-16)] pb-[var(--space-24)] lg:pt-[var(--space-24)] lg:pb-[var(--space-30)]">
      {/* Page Header — Above the fold */}
      <header className="pb-[var(--space-10)] border-b border-[var(--color-hairline)]">
        <motion.p
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
          className="uppercase font-medium text-[var(--color-accent-text)] mb-[var(--space-4)]"
          style={{
            fontSize: 'var(--type-xs-size)',
            lineHeight: 'var(--type-xs-leading)',
            letterSpacing: 'var(--type-xs-tracking)',
          }}
        >
          Our Heritage &amp; Mission
        </motion.p>

        <motion.h1
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.08, ease: EDITORIAL_EASE }}
          className="font-serif font-medium text-[var(--color-ink)] max-w-4xl"
          style={{
            fontSize: 'var(--type-display-size)',
            lineHeight: 'var(--type-display-leading)',
            letterSpacing: 'var(--type-display-tracking)',
          }}
        >
          Clinical Rigour in an Unhurried Sanctuary
        </motion.h1>

        <motion.p
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.16, ease: EDITORIAL_EASE }}
          className="mt-[var(--space-4)] text-[var(--color-ink-muted)] max-w-[60ch]"
          style={{
            fontSize: 'var(--type-base-size)',
            lineHeight: 'var(--type-base-leading)',
          }}
        >
          Founded in London’s Harley Street Medical Quarter, Aurelia Private Hospital unites
          tertiary academic standards with quiet, restorative architecture.
        </motion.p>
      </header>

      {/* Story Section — Oversized Serif Pull-Quote + Heritage Narrative */}
      <section className="mt-[var(--space-16)] lg:mt-[var(--space-20)]">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EDITORIAL_EASE }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-10)] lg:gap-[var(--space-12)] items-start"
        >
          {/* Oversized Serif Pull-Quote directly on limestone canvas */}
          <figure className="lg:col-span-8 border-l-2 border-[var(--color-accent)] pl-[var(--space-6)] sm:pl-[var(--space-8)]">
            <span
              aria-hidden="true"
              className="block font-serif text-[var(--color-accent)] leading-none select-none mb-[var(--space-2)]"
              style={{ fontSize: 'var(--type-2xl-size)' }}
            >
              “
            </span>
            <blockquote
              className="font-serif italic font-medium text-[var(--color-primary)]"
              style={{
                fontSize: 'var(--type-2xl-size)',
                lineHeight: '1.16',
                letterSpacing: 'var(--type-2xl-tracking)',
              }}
            >
              Acute surgical and diagnostic medicine deserves both the precision of a university
              centre and the stillness of a quiet room.
            </blockquote>
            <figcaption
              className="mt-[var(--space-6)] uppercase font-medium text-[var(--color-accent-text)]"
              style={{
                fontSize: 'var(--type-xs-size)',
                lineHeight: 'var(--type-xs-leading)',
                letterSpacing: 'var(--type-xs-tracking)',
              }}
            >
              Founding Medical Charter · Harley Street, 1998
            </figcaption>
          </figure>

          {/* Editorial Heritage Context */}
          <div
            className="lg:col-span-4 space-y-[var(--space-5)] text-[var(--color-ink-muted)]"
            style={{
              fontSize: 'var(--type-base-size)',
              lineHeight: 'var(--type-base-leading)',
            }}
          >
            <p>
              When four senior department chairs established Aurelia in 1998, they set out to
              remove the sensory friction of conventional hospitals—long waiting queues, sterile
              corridors, and rushed ten-minute clinics.
            </p>
            <p>
              Today, every patient pathway integrates same-day diagnostics, named consultant
              continuity, and calm natural materials chosen to support recovery from first arrival
              through discharge.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Count-Up Stats Strip */}
      <section aria-label="Hospital key clinical figures" className="mt-[var(--space-16)] lg:mt-[var(--space-20)]">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
          className="border-t border-b border-[var(--color-hairline)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-[var(--color-hairline)]"
        >
          {HOSPITAL_STATS.map((stat) => (
            <div key={stat.label} className="py-[var(--space-8)] sm:px-[var(--space-6)] first:sm:pl-0">
              <AnimatedStatValue target={stat.target} suffix={stat.suffix} />
              <p
                className="mt-[var(--space-2)] uppercase font-medium text-[var(--color-accent-text)]"
                style={{
                  fontSize: 'var(--type-xs-size)',
                  lineHeight: 'var(--type-xs-leading)',
                  letterSpacing: 'var(--type-xs-tracking)',
                }}
              >
                {stat.label}
              </p>
              <p
                className="mt-[var(--space-1)] text-[var(--color-ink-muted)]"
                style={{
                  fontSize: 'var(--type-sm-size)',
                  lineHeight: 'var(--type-sm-leading)',
                }}
              >
                {stat.detail}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Mission & Values — Numbered List (01, 02, 03) */}
      <section className="mt-[var(--space-20)] lg:mt-[var(--space-24)]">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
          className="max-w-2xl mb-[var(--space-12)]"
        >
          <p
            className="uppercase font-medium text-[var(--color-accent-text)] mb-[var(--space-3)]"
            style={{
              fontSize: 'var(--type-xs-size)',
              lineHeight: 'var(--type-xs-leading)',
              letterSpacing: 'var(--type-xs-tracking)',
            }}
          >
            Clinical Philosophy
          </p>
          <h2
            className="font-serif font-medium text-[var(--color-ink)]"
            style={{
              fontSize: 'var(--type-2xl-size)',
              lineHeight: 'var(--type-2xl-leading)',
              letterSpacing: 'var(--type-2xl-tracking)',
            }}
          >
            Three Principles Guiding Every Care Pathway
          </h2>
        </motion.div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-8)] lg:gap-[var(--space-10)]">
          {PILLARS.map((pillar, idx) => (
            <motion.li
              key={pillar.index}
              initial={
                shouldReduceMotion ? undefined : { opacity: 0, y: 24, filter: 'blur(8px)' }
              }
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.55,
                delay: shouldReduceMotion ? 0 : idx * 0.08,
                ease: EDITORIAL_EASE,
              }}
              className="pt-[var(--space-6)] border-t border-[var(--color-hairline-strong)]"
            >
              <span
                className="uppercase font-medium text-[var(--color-accent-text)] tabular-nums"
                style={{
                  fontSize: 'var(--type-xs-size)',
                  lineHeight: 'var(--type-xs-leading)',
                  letterSpacing: 'var(--type-xs-tracking)',
                }}
              >
                {pillar.index}
              </span>
              <h3
                className="mt-[var(--space-3)] font-serif font-medium text-[var(--color-ink)]"
                style={{
                  fontSize: 'var(--type-xl-size)',
                  lineHeight: 'var(--type-xl-leading)',
                  letterSpacing: 'var(--type-xl-tracking)',
                }}
              >
                {pillar.title}
              </h3>
              <p
                className="mt-[var(--space-3)] text-[var(--color-ink-muted)]"
                style={{
                  fontSize: 'var(--type-sm-size)',
                  lineHeight: 'var(--type-base-leading)',
                }}
              >
                {pillar.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* Facility Highlights — Alternating 2-Column Zigzag with Clip-Path Image Reveals */}
      <section className="mt-[var(--space-24)] pt-[var(--space-16)] border-t border-[var(--color-hairline)]">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
          className="max-w-2xl mb-[var(--space-12)]"
        >
          <p
            className="uppercase font-medium text-[var(--color-accent-text)] mb-[var(--space-3)]"
            style={{
              fontSize: 'var(--type-xs-size)',
              lineHeight: 'var(--type-xs-leading)',
              letterSpacing: 'var(--type-xs-tracking)',
            }}
          >
            Infrastructure
          </p>
          <h2
            className="font-serif font-medium text-[var(--color-ink)]"
            style={{
              fontSize: 'var(--type-2xl-size)',
              lineHeight: 'var(--type-2xl-leading)',
              letterSpacing: 'var(--type-2xl-tracking)',
            }}
          >
            Facility &amp; Diagnostic Highlights
          </h2>
        </motion.div>

        <div className="space-y-[var(--space-16)] lg:space-y-[var(--space-20)]">
          {FACILITY_HIGHLIGHTS.map((item, idx) => {
            const isReversedOnDesktop = idx % 2 === 1;
            const Icon = item.Icon;

            return (
              <div
                key={item.index}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-8)] lg:gap-[var(--space-12)] items-center"
              >
                {/* Image Column — always first on mobile; alternates left/right on lg+ */}
                <div
                  className={`lg:col-span-6 order-1 ${
                    isReversedOnDesktop ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-[var(--space-2)] -right-[var(--space-2)] inset-0 border border-[var(--color-hairline-strong)] rounded-[var(--radius-md)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-editorial)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                    />
                    <motion.div
                      initial={
                        shouldReduceMotion ? undefined : { clipPath: 'inset(0% 0% 100% 0%)' }
                      }
                      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.75, ease: EDITORIAL_EASE }}
                      className="relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-surface-tinted)]"
                    >
                      <div className="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-editorial)] group-hover:scale-[1.04]">
                        <MedicalImage
                          src={item.image}
                          alt={item.alt}
                          aspectClassName="aspect-[16/10]"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Narrative Column */}
                <motion.div
                  initial={
                    shouldReduceMotion ? undefined : { opacity: 0, y: 24, filter: 'blur(8px)' }
                  }
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.08, ease: EDITORIAL_EASE }}
                  className={`lg:col-span-6 order-2 ${
                    isReversedOnDesktop ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="flex items-center justify-between gap-[var(--space-4)] pb-[var(--space-4)] border-b border-[var(--color-hairline)]">
                    <div className="flex items-center gap-[var(--space-3)]">
                      <span
                        className="uppercase font-medium text-[var(--color-accent-text)] tabular-nums"
                        style={{
                          fontSize: 'var(--type-xs-size)',
                          letterSpacing: 'var(--type-xs-tracking)',
                        }}
                      >
                        {item.index}
                      </span>
                      <span
                        className="uppercase font-medium text-[var(--color-ink-muted)]"
                        style={{
                          fontSize: 'var(--type-xs-size)',
                          letterSpacing: 'var(--type-xs-tracking)',
                        }}
                      >
                        {item.eyebrow}
                      </span>
                    </div>
                    <Icon
                      className="w-4 h-4 text-[var(--color-primary)] shrink-0"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </div>

                  <h3
                    className="mt-[var(--space-5)] font-serif font-medium text-[var(--color-ink)]"
                    style={{
                      fontSize: 'var(--type-2xl-size)',
                      lineHeight: 'var(--type-2xl-leading)',
                      letterSpacing: 'var(--type-2xl-tracking)',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="mt-[var(--space-4)] text-[var(--color-ink-muted)] max-w-[54ch]"
                    style={{
                      fontSize: 'var(--type-base-size)',
                      lineHeight: 'var(--type-base-leading)',
                    }}
                  >
                    {item.detail}
                  </p>

                  <p
                    className="mt-[var(--space-5)] uppercase text-[var(--color-accent-text)] tabular-nums"
                    style={{
                      fontSize: 'var(--type-xs-size)',
                      lineHeight: 'var(--type-xs-leading)',
                      letterSpacing: 'var(--type-xs-tracking)',
                    }}
                  >
                    {item.spec}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Concierge Callout */}
      <motion.section
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
        className="mt-[var(--space-24)] rounded-[var(--radius-lg)] bg-[var(--color-surface-tinted)] border border-[var(--color-hairline)] p-[var(--space-8)] sm:p-[var(--space-12)] flex flex-col md:flex-row md:items-center justify-between gap-[var(--space-6)]"
      >
        <div>
          <p
            className="uppercase font-medium text-[var(--color-accent-text)] mb-[var(--space-2)]"
            style={{
              fontSize: 'var(--type-xs-size)',
              letterSpacing: 'var(--type-xs-tracking)',
            }}
          >
            Private Tours &amp; Referrals
          </p>
          <h2
            className="font-serif font-medium text-[var(--color-primary)]"
            style={{
              fontSize: 'var(--type-xl-size)',
              lineHeight: 'var(--type-xl-leading)',
            }}
          >
            Speak with Our Patient Concierge
          </h2>
          <p
            className="mt-[var(--space-2)] text-[var(--color-ink-muted)] max-w-[54ch]"
            style={{
              fontSize: 'var(--type-base-size)',
              lineHeight: 'var(--type-base-leading)',
            }}
          >
            Arrange a private consultation or request a guided pre-operative suite visit.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('book')}
          className="group inline-flex items-center justify-center gap-[var(--space-3)] rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] px-[var(--space-6)] py-[var(--space-3)] font-medium transition-colors duration-[var(--duration-fast)] cursor-pointer whitespace-nowrap shrink-0 min-h-[44px]"
          style={{ fontSize: 'var(--type-sm-size)' }}
        >
          <span>Book Appointment</span>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-editorial)] group-hover:translate-x-1"
            strokeWidth={1.6}
            aria-hidden="true"
          />
        </button>
      </motion.section>
    </div>
  );
}
