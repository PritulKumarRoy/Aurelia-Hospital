import { Phone, MapPin, Mail, Clock } from 'lucide-react';
import type { PageRoute } from '../types.ts';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-primary)] text-[var(--color-on-primary)] border-t border-[var(--color-hairline)] mt-[var(--space-24)] pb-[var(--space-16)] md:pb-[var(--space-8)]">
      <div className="max-w-7xl mx-auto px-[var(--space-4)] sm:px-[var(--space-8)] pt-[var(--space-20)] pb-[var(--space-6)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--space-10)] pb-[var(--space-12)] border-b border-[var(--color-hairline-inverse)]">
          {/* Column 1: Brand Lockup & Summary */}
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-[var(--space-3)]">
              <svg
                width="28"
                height="16"
                viewBox="0 0 28 16"
                fill="none"
                aria-hidden="true"
                className="shrink-0 text-[var(--color-accent-on-dark)]"
              >
                <path
                  d="M 1 8 L 8 8 C 10 8, 11 4, 12.5 4 C 14 4, 14.5 13, 16 13 C 17.5 13, 18.5 2, 20 2 C 21.5 2, 22.5 8, 24.5 8 L 27 8"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2
                className="font-serif font-medium text-[var(--color-on-primary)]"
                style={{
                  fontSize: 'var(--type-xl-size)',
                  lineHeight: 'var(--type-xl-leading)',
                  letterSpacing: 'var(--type-xl-tracking)',
                }}
              >
                Aurelia Private Hospital
              </h2>
            </div>

            <p
              className="mt-[var(--space-4)] text-[var(--color-on-primary)]/80 max-w-md"
              style={{
                fontSize: 'var(--type-sm-size)',
                lineHeight: 'var(--type-base-leading)',
              }}
            >
              An independent acute medical and surgical hospital dedicated to unhurried
              diagnostics, consultant-led treatment, and calm inpatient recovery.
            </p>

            <p
              className="mt-[var(--space-4)] uppercase text-[var(--color-accent-on-dark)]"
              style={{
                fontSize: 'var(--type-xs-size)',
                lineHeight: 'var(--type-xs-leading)',
                letterSpacing: 'var(--type-xs-tracking)',
              }}
            >
              JCI Accredited · Care Quality Commission Registered
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-3">
            <h3
              className="font-sans uppercase font-medium text-[var(--color-accent-on-dark)] mb-[var(--space-4)]"
              style={{
                fontSize: 'var(--type-xs-size)',
                lineHeight: 'var(--type-xs-leading)',
                letterSpacing: 'var(--type-xs-tracking)',
              }}
            >
              Hospital Navigation
            </h3>
            <ul className="space-y-[var(--space-2)]">
              {[
                { route: 'home' as PageRoute, label: 'Overview' },
                { route: 'specialities' as PageRoute, label: 'Medical Specialities' },
                { route: 'doctors' as PageRoute, label: 'Consultant Physicians' },
                { route: 'about' as PageRoute, label: 'About & Facilities' },
                { route: 'book' as PageRoute, label: 'Book Appointment' },
              ].map((link) => (
                <li key={link.route}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.route)}
                    className="text-[var(--color-on-primary)]/85 hover:text-[var(--color-accent-on-dark)] transition-colors duration-[var(--duration-fast)] cursor-pointer py-[var(--space-1)]"
                    style={{ fontSize: 'var(--type-sm-size)' }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="md:col-span-4">
            <h3
              className="font-sans uppercase font-medium text-[var(--color-accent-on-dark)] mb-[var(--space-4)]"
              style={{
                fontSize: 'var(--type-xs-size)',
                lineHeight: 'var(--type-xs-leading)',
                letterSpacing: 'var(--type-xs-tracking)',
              }}
            >
              Patient Concierge
            </h3>
            <ul
              className="space-y-[var(--space-3)] text-[var(--color-on-primary)]/85"
              style={{ fontSize: 'var(--type-sm-size)' }}
            >
              <li className="flex items-start gap-[var(--space-3)]">
                <MapPin
                  className="w-4 h-4 text-[var(--color-accent-on-dark)] shrink-0 mt-1"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span>48 Harley Street Medical Quarter, Marylebone, London W1G 9PU</span>
              </li>
              <li className="flex items-center gap-[var(--space-3)] tabular-nums">
                <Phone
                  className="w-4 h-4 text-[var(--color-accent-on-dark)] shrink-0"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <a
                  href="tel:+442079460811"
                  className="hover:text-[var(--color-accent-on-dark)] transition-colors duration-[var(--duration-fast)]"
                >
                  24/7 Urgent Line: 020 7946 0811
                </a>
              </li>
              <li className="flex items-center gap-[var(--space-3)]">
                <Mail
                  className="w-4 h-4 text-[var(--color-accent-on-dark)] shrink-0"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <a
                  href="mailto:concierge@aureliahospital.com"
                  className="hover:text-[var(--color-accent-on-dark)] transition-colors duration-[var(--duration-fast)]"
                >
                  concierge@aureliahospital.com
                </a>
              </li>
              <li className="flex items-center gap-[var(--space-3)] tabular-nums">
                <Clock
                  className="w-4 h-4 text-[var(--color-accent-on-dark)] shrink-0"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span>Outpatient Clinics: Mon – Sat, 07:30 – 20:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="pt-[var(--space-8)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[var(--space-4)] text-[var(--color-on-primary)]/70"
          style={{ fontSize: 'var(--type-xs-size)', lineHeight: 'var(--type-xs-leading)' }}
        >
          <p>© {new Date().getFullYear()} Aurelia Private Hospital. All clinical rights reserved.</p>
          <p>
            For life-threatening emergencies, attend the 24/7 Urgent Assessment Entrance or call
            999.
          </p>
        </div>
      </div>

      {/* Giant low-opacity architectural watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none max-w-7xl mx-auto px-[var(--space-4)] sm:px-[var(--space-8)] pt-[var(--space-4)]"
      >
        <p className="font-serif font-medium text-[var(--color-on-primary)] opacity-[0.08] leading-[0.82] tracking-tight text-[clamp(5.5rem,18vw,14rem)]">
          Aurelia
        </p>
      </div>
    </footer>
  );
}
