import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Doctor, Speciality } from '../types.ts';
import { DoctorCard } from '../components/DoctorCard.tsx';

interface DoctorsPageProps {
  doctors: Doctor[];
  specialities: Speciality[];
  onBookDoctor: (doctor: Doctor) => void;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, '0');
}

export function DoctorsPage({ doctors, specialities, onBookDoctor }: DoctorsPageProps) {
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const shouldReduceMotion = useReducedMotion();

  const availableSpecialities = specialities.filter((spec) =>
    doctors.some((doc) => doc.specialityId === spec.id)
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpeciality =
      selectedSpeciality === 'all' || doc.specialityId === selectedSpeciality;
    if (!matchesSpeciality) return false;
    if (!normalizedQuery) return true;
    return (
      doc.name.toLowerCase().includes(normalizedQuery) ||
      doc.specialityName.toLowerCase().includes(normalizedQuery) ||
      doc.credentials.toLowerCase().includes(normalizedQuery) ||
      doc.fellowship.toLowerCase().includes(normalizedQuery) ||
      doc.languages.some((lang) => lang.toLowerCase().includes(normalizedQuery))
    );
  });

  const filterKey = `${selectedSpeciality}::${normalizedQuery}`;

  return (
    <div className="max-w-7xl mx-auto px-[var(--space-4)] sm:px-[var(--space-8)] pt-[var(--space-16)] pb-[var(--space-24)] lg:pt-[var(--space-24)] lg:pb-[var(--space-30)]">
      {/* Page Header matching Specialities template */}
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
          Medical Faculty
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
          Consultant Physicians &amp; Surgeons
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
          Every consultation and surgical pathway is led personally by accredited department chairs.
        </motion.p>

        {/* Filter Chips & Search Bar */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.24, ease: EDITORIAL_EASE }}
          className="mt-[var(--space-8)] flex flex-col lg:flex-row lg:items-center justify-between gap-[var(--space-4)]"
        >
          <div
            role="group"
            aria-label="Filter physicians by speciality"
            className="inline-flex flex-wrap items-center gap-[var(--space-2)] p-[var(--space-1)] bg-[var(--color-surface-tinted)] rounded-[var(--radius-md)] border border-[var(--color-hairline)]"
          >
            <button
              type="button"
              aria-pressed={selectedSpeciality === 'all'}
              onClick={() => setSelectedSpeciality('all')}
              className={`px-[var(--space-4)] py-[var(--space-2)] rounded-[var(--radius-sm)] font-medium whitespace-nowrap transition-colors duration-[var(--duration-fast)] cursor-pointer min-h-[44px] ${
                selectedSpeciality === 'all'
                  ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-1)]'
                  : 'text-[var(--color-ink-muted)] hover:text-[var(--color-primary)]'
              }`}
              style={{ fontSize: 'var(--type-sm-size)' }}
            >
              All Consultants
            </button>
            {availableSpecialities.map((spec) => {
              const isActive = selectedSpeciality === spec.id;
              return (
                <button
                  key={spec.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedSpeciality(spec.id)}
                  className={`px-[var(--space-4)] py-[var(--space-2)] rounded-[var(--radius-sm)] font-medium whitespace-nowrap transition-colors duration-[var(--duration-fast)] cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-1)]'
                      : 'text-[var(--color-ink-muted)] hover:text-[var(--color-primary)]'
                  }`}
                  style={{ fontSize: 'var(--type-sm-size)' }}
                >
                  {spec.name.split('&')[0].trim()}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              className="w-4 h-4 text-[var(--color-ink-muted)] absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 pointer-events-none"
              strokeWidth={1.6}
              aria-hidden="true"
            />
            <label htmlFor="doctor-search" className="sr-only">
              Search physicians by name, credential, or language
            </label>
            <input
              id="doctor-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, credential, language"
              className="w-full rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-hairline)] pl-[var(--space-10)] pr-[var(--space-10)] py-[var(--space-2)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/70 min-h-[44px]"
              style={{ fontSize: 'var(--type-sm-size)' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-[var(--space-2)] top-1/2 -translate-y-1/2 p-[var(--space-1)] text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] cursor-pointer min-w-[32px] min-h-[32px] inline-flex items-center justify-center"
              >
                <X className="w-4 h-4" strokeWidth={1.6} aria-hidden="true" />
              </button>
            )}
          </div>
        </motion.div>
      </header>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="mt-[var(--space-12)] rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] p-[var(--space-10)] text-center">
          <h2
            className="font-serif font-medium text-[var(--color-primary)]"
            style={{
              fontSize: 'var(--type-xl-size)',
              lineHeight: 'var(--type-xl-leading)',
            }}
          >
            No matching consultants found
          </h2>
          <p
            className="mt-[var(--space-2)] text-[var(--color-ink-muted)]"
            style={{ fontSize: 'var(--type-sm-size)' }}
          >
            Adjust your speciality filter or search term to view our full consultant directory.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSpeciality('all');
              setSearchQuery('');
            }}
            className="mt-[var(--space-6)] inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] px-[var(--space-6)] py-[var(--space-3)] font-medium transition-colors duration-[var(--duration-fast)] cursor-pointer min-h-[44px]"
            style={{ fontSize: 'var(--type-sm-size)' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          key={filterKey}
          className="mt-[var(--space-12)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-6)] lg:gap-[var(--space-8)]"
        >
          {filteredDoctors.map((doctor, index) => {
            // Featured 2-column chair portrait tied to the lead consultant in unfiltered view
            const isFeaturedLead =
              selectedSpeciality === 'all' && !normalizedQuery && index === 0;
            const indexLabel = formatIndex(index);

            return (
              <motion.div
                key={doctor.id}
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
                className={isFeaturedLead ? 'md:col-span-2 flex' : 'flex'}
              >
                <div className="w-full">
                  <DoctorCard
                    doctor={doctor}
                    onBookDoctor={onBookDoctor}
                    indexLabel={indexLabel}
                    featured={isFeaturedLead}
                    priority={index === 0}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
