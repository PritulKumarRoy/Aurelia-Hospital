import { ArrowRight, Check } from 'lucide-react';
import type { Doctor, PageRoute, Speciality, Testimonial } from '../types.ts';
import {
  InteractiveButton,
  LiftCard,
  RevealSection,
  SpecialityIcon,
} from '../components/MotionPrimitives.tsx';
import { HeroSection } from '../components/HeroSection.tsx';
import { DoctorCard } from '../components/DoctorCard.tsx';

interface HomePageProps {
  specialities: Speciality[];
  doctors: Doctor[];
  testimonials: Testimonial[];
  onNavigate: (route: PageRoute) => void;
  onBookSpeciality: (specialityId: string) => void;
  onBookDoctor: (doctor: Doctor) => void;
}

const TRUST_SIGNALS = [
  {
    metric: '98.6%',
    label: 'Patient Satisfaction Index',
    detail: '2025 independent inpatient & outpatient audit',
  },
  {
    metric: '45 min',
    label: 'Consultant Consultation',
    detail: 'Standard unhurried diagnostic appointment',
  },
  {
    metric: '4 hrs',
    label: 'Imaging Turnaround',
    detail: 'Same-day 3.0T MRI & consultant radiology report',
  },
  {
    metric: '24 / 7',
    label: 'Acute Assessment',
    detail: 'Senior resident & cardiac triage on site',
  },
];

export function HomePage({
  specialities,
  doctors,
  testimonials,
  onNavigate,
  onBookSpeciality,
  onBookDoctor,
}: HomePageProps) {
  const featuredSpecialities = specialities.filter((s) => s.featured).slice(0, 3);
  const previewDoctors = doctors.slice(0, 3);

  return (
    <div>
      <HeroSection onNavigate={onNavigate} />

      {/* Trust Signals Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-12">
        <RevealSection className="pt-10 pb-10 border-b border-[var(--color-hairline)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {TRUST_SIGNALS.map((signal) => (
              <div key={signal.label} className="flex flex-col">
                <span className="font-serif text-3xl sm:text-4xl font-medium text-[#0F3D3E] tabular-nums">
                  {signal.metric}
                </span>
                <span className="mt-1.5 text-sm font-medium text-[#1B2627]">{signal.label}</span>
                <span className="mt-0.5 text-xs text-[#4A5859] leading-relaxed">
                  {signal.detail}
                </span>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* 3 Featured Specialities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <RevealSection>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium text-[#7A5B2C] mb-2">Centers of Excellence</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#0F3D3E]">
                Focused Surgical &amp; Medical Institutes
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('specialities')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F3D3E] hover:text-[#78582A] transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto py-2"
            >
              <span>View all specialities</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredSpecialities.map((spec, index) => (
            <RevealSection key={spec.id} delay={index * 0.08}>
              <LiftCard className="p-7 flex flex-col h-full">
                <div className="w-11 h-11 rounded-xl bg-[#F3F5F4] flex items-center justify-center mb-5">
                  <SpecialityIcon iconKey={spec.iconKey} />
                </div>

                <p className="text-xs font-medium text-[#7A5B2C] mb-1.5">{spec.waitTime}</p>

                <h3 className="font-serif text-2xl font-medium text-[#1B2627]">{spec.name}</h3>

                <p className="mt-3 text-sm text-[#4A5859] leading-relaxed">{spec.shortDesc}</p>

                <ul className="mt-5 pt-5 border-t border-[rgba(15,61,62,0.08)] space-y-2 text-xs text-[#4A5859] flex-1">
                  {spec.procedures.slice(0, 3).map((proc) => (
                    <li key={proc} className="flex items-start gap-2">
                      <Check
                        className="w-3.5 h-3.5 text-[#0F3D3E] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{proc}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-[rgba(15,61,62,0.08)]">
                  <button
                    type="button"
                    onClick={() => onBookSpeciality(spec.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F3D3E] hover:text-[#78582A] transition-colors cursor-pointer py-1"
                  >
                    <span>Book {spec.name.split('&')[0].trim()} consultation</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </LiftCard>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Doctor Preview Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <RevealSection>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium text-[#7A5B2C] mb-2">Consultant Faculty</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#0F3D3E]">
                Direct Access to Department Chairs
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('doctors')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F3D3E] hover:text-[#78582A] transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto py-2"
            >
              <span>Meet all physicians</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewDoctors.map((doctor, index) => (
            <RevealSection key={doctor.id} delay={index * 0.08}>
              <DoctorCard doctor={doctor} onBookDoctor={onBookDoctor} compact />
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Patient Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <RevealSection>
          <div className="bg-[#F3F1EC] rounded-2xl border border-[rgba(15,61,62,0.08)] p-8 sm:p-12 lg:p-14">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-medium text-[#7A5B2C] mb-2">Patient Experiences</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#0F3D3E]">
                Measured Clinical Outcomes, Told in Their Words
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 pt-8 border-t border-[rgba(15,61,62,0.1)]">
              {testimonials.map((item) => (
                <blockquote key={item.id} className="flex flex-col justify-between">
                  <p className="font-serif text-xl sm:text-[1.35rem] leading-relaxed text-[#1B2627]">
                    “{item.quote}”
                  </p>
                  <footer className="mt-6 pt-4 border-t border-[rgba(15,61,62,0.08)]">
                    <div className="text-sm font-medium text-[#0F3D3E]">{item.patientName}</div>
                    <div className="text-xs text-[#7A5B2C] mt-0.5">{item.department}</div>
                    <div className="text-xs text-[#4A5859] mt-1">{item.outcome}</div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Calm Conversion Band */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-6">
        <RevealSection>
          <div className="rounded-2xl bg-white border border-[rgba(15,61,62,0.1)] shadow-[0_6px_24px_-8px_rgba(15,61,62,0.06)] p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#0F3D3E]">
                Arrange a Private Consultation or Second Opinion
              </h2>
              <p className="mt-3 text-base text-[#4A5859]">
                Our clinical concierge coordinates specialist appointments, prior imaging transfers,
                and insurer pre-authorisations within two hours of your request.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <InteractiveButton variant="primary" onClick={() => onNavigate('book')}>
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </InteractiveButton>
              <InteractiveButton variant="ghost" onClick={() => onNavigate('about')}>
                <span>Tour Our Facility</span>
              </InteractiveButton>
            </div>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
