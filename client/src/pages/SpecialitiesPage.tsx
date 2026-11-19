import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Speciality, SpecialityCategory } from '../types.ts';
import { SpecialityIcon } from '../components/MotionPrimitives.tsx';
import { MedicalImage } from '../components/MedicalImage.tsx';

interface SpecialitiesPageProps {
  specialities: Speciality[];
  onBookSpeciality: (specialityId: string) => void;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CATEGORIES: ('All' | SpecialityCategory)[] = [
  'All',
  'Medical & Preventive',
  'Surgical',
  'Diagnostics',
];

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, '0');
}

export function SpecialitiesPage({ specialities, onBookSpeciality }: SpecialitiesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | SpecialityCategory>('All');
  const shouldReduceMotion = useReducedMotion();

  const filtered =
    selectedCategory === 'All'
      ? specialities
      : specialities.filter((spec) => spec.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-[var(--space-4)] sm:px-[var(--space-8)] pt-[var(--space-16)] pb-[var(--space-24)] lg:pt-[var(--space-24)] lg:pb-[var(--space-30)]">
      {/* Page Header */}
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
          Clinical Institutes
        </motion.p>

        <motion.h1
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.08, ease: EDITORIAL_EASE }}
          className="font-serif font-medium text-[var(--color-ink)] max-w-3xl"
          style={{
            fontSize: 'var(--type-display-size)',
            lineHeight: 'var(--type-display-leading)',
            letterSpacing: 'var(--type-display-tracking)',
          }}
        >
          Medical &amp; Surgical Specialities
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
          Eight consultant-led departments united by integrated 3.0T diagnostics and same-week
          specialist scheduling.
        </motion.p>

        {/* Category Filter Buttons */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.24, ease: EDITORIAL_EASE }}
          className="mt-[var(--space-8)]"
        >
          <div
            role="group"
            aria-label="Filter specialities by department category"
            className="inline-flex flex-wrap items-center gap-[var(--space-2)] p-[var(--space-1)] bg-[var(--color-surface-tinted)] rounded-[var(--radius-md)] border border-[var(--color-hairline)]"
          >
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-[var(--space-4)] py-[var(--space-2)] rounded-[var(--radius-sm)] font-medium whitespace-nowrap transition-colors duration-[var(--duration-fast)] cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-1)]'
                      : 'text-[var(--color-ink-muted)] hover:text-[var(--color-primary)]'
                  }`}
                  style={{ fontSize: 'var(--type-sm-size)' }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </motion.div>
      </header>

      {/* Cards Grid keyed by selectedCategory so entrance animations replay on filter change */}
      <div
        key={selectedCategory}
        className="mt-[var(--space-12)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-6)] lg:gap-[var(--space-8)]"
      >
        {filtered.map((spec, index) => {
          // Featured 2-column lead card is tied to the first featured speciality in the All view
          const isFeaturedLead = selectedCategory === 'All' && spec.featured && index === 0;
          const indexLabel = formatIndex(index);

          if (isFeaturedLead) {
            return (
              <motion.article
                key={spec.id}
                initial={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 0, y: 24, filter: 'blur(8px)' }
                }
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                className="group md:col-span-2 bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] shadow-none hover:shadow-[var(--shadow-2)] transition-shadow duration-[var(--duration-base)] p-[var(--space-6)] sm:p-[var(--space-8)] grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-6)] items-stretch"
              >
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-[var(--space-4)] mb-[var(--space-5)]">
                      <div className="w-11 h-11 rounded-[var(--radius-md)] bg-[var(--color-surface-tinted)] border border-[var(--color-hairline)] flex items-center justify-center shrink-0">
                        <SpecialityIcon
                          iconKey={spec.iconKey}
                          className="w-5 h-5 text-[var(--color-primary)]"
                        />
                      </div>
                      <span
                        className="uppercase font-medium text-[var(--color-accent-text)] tabular-nums"
                        style={{
                          fontSize: 'var(--type-xs-size)',
                          letterSpacing: 'var(--type-xs-tracking)',
                        }}
                      >
                        Featured Institute · {indexLabel}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-[var(--space-3)]">
                      <span
                        className="uppercase text-[var(--color-ink-muted)] tabular-nums shrink-0"
                        style={{
                          fontSize: 'var(--type-xs-size)',
                          letterSpacing: 'var(--type-xs-tracking)',
                        }}
                      >
                        {indexLabel}
                      </span>
                      <h2
                        className="font-serif font-medium text-[var(--color-ink)]"
                        style={{
                          fontSize: 'var(--type-xl-size)',
                          lineHeight: 'var(--type-xl-leading)',
                          letterSpacing: 'var(--type-xl-tracking)',
                        }}
                      >
                        {spec.name}
                      </h2>
                    </div>

                    <p
                      className="mt-[var(--space-3)] text-[var(--color-ink-muted)] line-clamp-2"
                      style={{
                        fontSize: 'var(--type-sm-size)',
                        lineHeight: 'var(--type-base-leading)',
                      }}
                    >
                      {spec.shortDesc}
                    </p>

                    <ul
                      className="mt-[var(--space-5)] pt-[var(--space-4)] border-t border-[var(--color-hairline)] space-y-[var(--space-2)] text-[var(--color-ink-muted)]"
                      style={{ fontSize: 'var(--type-xs-size)', lineHeight: 'var(--type-sm-leading)' }}
                    >
                      {spec.procedures.slice(0, 3).map((proc) => (
                        <li key={proc} className="flex items-center gap-[var(--space-2)]">
                          <Check
                            className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0"
                            strokeWidth={1.6}
                            aria-hidden="true"
                          />
                          <span>{proc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-[var(--space-6)] pt-[var(--space-4)] border-t border-[var(--color-hairline)]">
                    <button
                      type="button"
                      onClick={() => onBookSpeciality(spec.id)}
                      className="group/link inline-flex items-center gap-[var(--space-2)] font-medium text-[var(--color-primary)] hover:text-[var(--color-accent-text)] transition-colors duration-[var(--duration-fast)] cursor-pointer min-h-[44px]"
                      style={{ fontSize: 'var(--type-sm-size)' }}
                    >
                      <span>Learn more</span>
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-editorial)] group-hover/link:translate-x-1"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>

                {/* Featured Image (eager priority above the fold) */}
                <div className="lg:col-span-6 relative">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-[var(--space-2)] -right-[var(--space-2)] inset-0 border border-[var(--color-hairline-strong)] rounded-[var(--radius-md)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-editorial)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                  />
                  <motion.div
                    initial={shouldReduceMotion ? undefined : { clipPath: 'inset(0% 0% 100% 0%)' }}
                    whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
                    className="relative h-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-surface-tinted)]"
                  >
                    <div className="h-full transition-transform duration-[var(--duration-slow)] ease-[var(--ease-editorial)] group-hover:scale-[1.04]">
                      <MedicalImage
                        src="/images/facility-suite.jpg"
                        alt={`${spec.name} diagnostic and consultation suite`}
                        priority
                        className="h-full min-h-[220px]"
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.article>
            );
          }

          return (
            <motion.article
              key={spec.id}
              initial={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 0, y: 24, filter: 'blur(8px)' }
              }
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.55,
                delay: shouldReduceMotion ? 0 : (index % 3) * 0.08,
                ease: EDITORIAL_EASE,
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="group bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] shadow-none hover:shadow-[var(--shadow-2)] transition-shadow duration-[var(--duration-base)] p-[var(--space-6)] sm:p-[var(--space-8)] flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-start justify-between gap-[var(--space-4)] mb-[var(--space-6)]">
                  <div className="w-11 h-11 rounded-[var(--radius-md)] bg-[var(--color-surface-tinted)] border border-[var(--color-hairline)] flex items-center justify-center shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-editorial)] group-hover:scale-[1.04]">
                    <SpecialityIcon
                      iconKey={spec.iconKey}
                      className="w-5 h-5 text-[var(--color-primary)]"
                    />
                  </div>
                  <span
                    className="uppercase text-[var(--color-ink-muted)] tabular-nums"
                    style={{
                      fontSize: 'var(--type-xs-size)',
                      letterSpacing: 'var(--type-xs-tracking)',
                    }}
                  >
                    {spec.waitTime}
                  </span>
                </div>

                <div className="flex items-baseline gap-[var(--space-3)]">
                  <span
                    className="uppercase font-medium text-[var(--color-accent-text)] tabular-nums shrink-0"
                    style={{
                      fontSize: 'var(--type-xs-size)',
                      letterSpacing: 'var(--type-xs-tracking)',
                    }}
                  >
                    {indexLabel}
                  </span>
                  <h2
                    className="font-serif font-medium text-[var(--color-ink)]"
                    style={{
                      fontSize: 'var(--type-xl-size)',
                      lineHeight: 'var(--type-xl-leading)',
                      letterSpacing: 'var(--type-xl-tracking)',
                    }}
                  >
                    {spec.name}
                  </h2>
                </div>

                <p
                  className="mt-[var(--space-3)] text-[var(--color-ink-muted)] line-clamp-2"
                  style={{
                    fontSize: 'var(--type-sm-size)',
                    lineHeight: 'var(--type-base-leading)',
                  }}
                >
                  {spec.shortDesc}
                </p>
              </div>

              <div className="mt-[var(--space-6)] pt-[var(--space-4)] border-t border-[var(--color-hairline)] flex items-center justify-between gap-[var(--space-4)]">
                <button
                  type="button"
                  onClick={() => onBookSpeciality(spec.id)}
                  className="group/link inline-flex items-center gap-[var(--space-2)] font-medium text-[var(--color-primary)] hover:text-[var(--color-accent-text)] transition-colors duration-[var(--duration-fast)] cursor-pointer min-h-[44px]"
                  style={{ fontSize: 'var(--type-sm-size)' }}
                >
                  <span>Learn more</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-editorial)] group-hover/link:translate-x-1"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </button>

                <span
                  className="uppercase text-[var(--color-ink-muted)]"
                  style={{
                    fontSize: 'var(--type-xs-size)',
                    letterSpacing: 'var(--type-xs-tracking)',
                  }}
                >
                  {spec.category.split('&')[0].trim()}
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
