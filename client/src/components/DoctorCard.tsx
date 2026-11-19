import { Calendar, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Doctor } from '../types.ts';
import { MedicalImage } from './MedicalImage.tsx';

interface DoctorCardProps {
  doctor: Doctor;
  onBookDoctor: (doctor: Doctor) => void;
  compact?: boolean;
  indexLabel?: string;
  featured?: boolean;
  priority?: boolean;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function DoctorCard({
  doctor,
  onBookDoctor,
  compact = false,
  indexLabel,
  featured = false,
  priority = false,
}: DoctorCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (featured) {
    return (
      <motion.article
        whileHover={shouldReduceMotion ? undefined : { y: -4 }}
        transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
        className="group relative md:col-span-2 bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] shadow-none hover:shadow-[var(--shadow-2)] transition-shadow duration-[var(--duration-base)] p-[var(--space-6)] sm:p-[var(--space-8)] grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-8)] items-stretch h-full"
      >
        {/* Larger Double-Frame Portrait */}
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
                src={doctor.image}
                alt={`${doctor.name}, ${doctor.title}`}
                aspectClassName="aspect-[3/4]"
                priority={priority}
                className="h-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Featured Consultant Details */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-[var(--space-4)] mb-[var(--space-4)]">
              <span
                className="uppercase font-medium text-[var(--color-accent-text)]"
                style={{
                  fontSize: 'var(--type-xs-size)',
                  lineHeight: 'var(--type-xs-leading)',
                  letterSpacing: 'var(--type-xs-tracking)',
                }}
              >
                {doctor.specialityName}
              </span>
              {indexLabel && (
                <span
                  className="uppercase font-medium text-[var(--color-accent-text)] tabular-nums"
                  style={{
                    fontSize: 'var(--type-xs-size)',
                    letterSpacing: 'var(--type-xs-tracking)',
                  }}
                >
                  Chair · {indexLabel}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-[var(--space-3)]">
              {indexLabel && (
                <span
                  className="uppercase font-medium text-[var(--color-accent-text)] tabular-nums shrink-0"
                  style={{
                    fontSize: 'var(--type-xs-size)',
                    letterSpacing: 'var(--type-xs-tracking)',
                  }}
                >
                  {indexLabel}
                </span>
              )}
              <h2
                className="font-serif font-medium text-[var(--color-ink)]"
                style={{
                  fontSize: 'var(--type-2xl-size)',
                  lineHeight: 'var(--type-2xl-leading)',
                  letterSpacing: 'var(--type-2xl-tracking)',
                }}
              >
                {doctor.name}
              </h2>
            </div>

            <p
              className="text-[var(--color-ink-muted)] mt-[var(--space-2)]"
              style={{
                fontSize: 'var(--type-base-size)',
                lineHeight: 'var(--type-base-leading)',
              }}
            >
              {doctor.title}
            </p>

            <p
              className="text-[var(--color-ink-muted)] mt-[var(--space-2)] tabular-nums"
              style={{
                fontSize: 'var(--type-xs-size)',
                lineHeight: 'var(--type-xs-leading)',
              }}
            >
              {doctor.credentials}
              <span className="mx-[var(--space-2)]" aria-hidden="true">
                ·
              </span>
              {doctor.fellowship}
              <span className="mx-[var(--space-2)]" aria-hidden="true">
                ·
              </span>
              {doctor.experienceYears} yrs experience
            </p>

            <p
              className="text-[var(--color-ink-muted)] mt-[var(--space-5)]"
              style={{
                fontSize: 'var(--type-sm-size)',
                lineHeight: 'var(--type-base-leading)',
              }}
            >
              {doctor.bio}
            </p>
          </div>

          <div>
            <div
              className="mt-[var(--space-6)] pt-[var(--space-4)] border-t border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-[var(--space-2)] text-[var(--color-ink-muted)]"
              style={{ fontSize: 'var(--type-xs-size)', lineHeight: 'var(--type-xs-leading)' }}
            >
              <span className="inline-flex items-center gap-[var(--space-2)]">
                <Calendar
                  className="w-3.5 h-3.5 text-[var(--color-primary)]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span>{doctor.consultationDays}</span>
              </span>
              <span>{doctor.languages.join(' / ')}</span>
            </div>

            <div className="mt-[var(--space-5)]">
              <button
                type="button"
                onClick={() => onBookDoctor(doctor)}
                className="group/btn w-full inline-flex items-center justify-between px-[var(--space-4)] py-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--color-hairline-strong)] bg-transparent hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] hover:border-[var(--color-primary)] text-[var(--color-primary)] font-medium transition-colors duration-[var(--duration-fast)] cursor-pointer whitespace-nowrap min-h-[44px]"
                style={{
                  fontSize: 'var(--type-sm-size)',
                  lineHeight: 'var(--type-sm-leading)',
                }}
              >
                <span>Book with {doctor.name.split(' ').slice(0, 2).join(' ')}</span>
                <ArrowUpRight
                  className="w-4 h-4 shrink-0 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-editorial)] group-hover/btn:translate-x-[2px] group-hover/btn:-translate-y-[2px]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
      className="group relative flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] shadow-none hover:shadow-[var(--shadow-2)] transition-shadow duration-[var(--duration-base)]"
    >
      {/* Offset Hairline Double-Frame Portrait */}
      <div className="p-[var(--space-4)] pb-0">
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[var(--space-2)] -right-[var(--space-2)] inset-0 border border-[var(--color-hairline-strong)] rounded-[var(--radius-md)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-editorial)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
          />
          <div className="relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-surface-tinted)]">
            <div className="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-editorial)] group-hover:scale-[1.04]">
              <MedicalImage
                src={doctor.image}
                alt={`${doctor.name}, ${doctor.title}`}
                aspectClassName="aspect-[3/4]"
                priority={priority}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-[var(--space-6)] flex flex-col flex-1">
        <div
          className="uppercase font-medium text-[var(--color-accent-text)] mb-[var(--space-2)]"
          style={{
            fontSize: 'var(--type-xs-size)',
            lineHeight: 'var(--type-xs-leading)',
            letterSpacing: 'var(--type-xs-tracking)',
          }}
        >
          <span>{doctor.specialityName}</span>
          <span className="mx-[var(--space-2)]" aria-hidden="true">
            ·
          </span>
          <span className="tabular-nums">{doctor.experienceYears} yrs</span>
        </div>

        <div className="flex items-baseline gap-[var(--space-3)]">
          {indexLabel && (
            <span
              className="uppercase font-medium text-[var(--color-accent-text)] tabular-nums shrink-0"
              style={{
                fontSize: 'var(--type-xs-size)',
                letterSpacing: 'var(--type-xs-tracking)',
              }}
            >
              {indexLabel}
            </span>
          )}
          <h3
            className="font-serif font-medium text-[var(--color-ink)]"
            style={{
              fontSize: 'var(--type-xl-size)',
              lineHeight: 'var(--type-xl-leading)',
              letterSpacing: 'var(--type-xl-tracking)',
            }}
          >
            {doctor.name}
          </h3>
        </div>

        <p
          className="text-[var(--color-ink-muted)] mt-[var(--space-1)]"
          style={{
            fontSize: 'var(--type-sm-size)',
            lineHeight: 'var(--type-sm-leading)',
            letterSpacing: 'var(--type-sm-tracking)',
          }}
        >
          {doctor.title}
        </p>

        <p
          className="text-[var(--color-ink-muted)] mt-[var(--space-2)] tabular-nums"
          style={{
            fontSize: 'var(--type-xs-size)',
            lineHeight: 'var(--type-xs-leading)',
          }}
        >
          {doctor.credentials}
          <span className="mx-[var(--space-2)]" aria-hidden="true">
            ·
          </span>
          {doctor.fellowship}
        </p>

        {!compact && (
          <>
            <p
              className="text-[var(--color-ink-muted)] mt-[var(--space-4)] flex-1"
              style={{
                fontSize: 'var(--type-sm-size)',
                lineHeight: 'var(--type-base-leading)',
              }}
            >
              {doctor.bio}
            </p>

            <div
              className="mt-[var(--space-5)] pt-[var(--space-4)] border-t border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-[var(--space-2)] text-[var(--color-ink-muted)]"
              style={{ fontSize: 'var(--type-xs-size)', lineHeight: 'var(--type-xs-leading)' }}
            >
              <span className="inline-flex items-center gap-[var(--space-2)]">
                <Calendar
                  className="w-3.5 h-3.5 text-[var(--color-primary)]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span>{doctor.consultationDays}</span>
              </span>
              <span>{doctor.languages.join(' / ')}</span>
            </div>
          </>
        )}

        <div className="mt-[var(--space-5)] pt-[var(--space-4)] border-t border-[var(--color-hairline)]">
          <button
            type="button"
            onClick={() => onBookDoctor(doctor)}
            className="group/btn w-full inline-flex items-center justify-between px-[var(--space-4)] py-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--color-hairline-strong)] bg-transparent hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] hover:border-[var(--color-primary)] text-[var(--color-primary)] font-medium transition-colors duration-[var(--duration-fast)] cursor-pointer whitespace-nowrap min-h-[44px]"
            style={{
              fontSize: 'var(--type-sm-size)',
              lineHeight: 'var(--type-sm-leading)',
            }}
          >
            <span>Book with {doctor.name.split(' ').slice(0, 2).join(' ')}</span>
            <ArrowUpRight
              className="w-4 h-4 shrink-0 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-editorial)] group-hover/btn:translate-x-[2px] group-hover/btn:-translate-y-[2px]"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
