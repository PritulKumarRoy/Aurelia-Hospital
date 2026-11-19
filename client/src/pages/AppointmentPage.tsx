import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type {
  AppointmentConfirmation,
  BookingPrefill,
  Doctor,
  PageRoute,
  Speciality,
} from '../types.ts';
import { MedicalImage } from '../components/MedicalImage.tsx';

interface AppointmentPageProps {
  specialities: Speciality[];
  doctors: Doctor[];
  prefill: BookingPrefill;
  onNavigate: (route: PageRoute) => void;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TIME_WINDOWS = [
  'Morning (08:30 – 12:00)',
  'Afternoon (12:30 – 16:30)',
  'Early Evening (17:00 – 19:30)',
];

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function MagneticSubmitButton({
  disabled,
  children,
}: {
  disabled: boolean;
  children: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 280, damping: 22 });
  const springY = useSpring(rawY, { stiffness: 280, damping: 22 });

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || disabled || !buttonRef.current) return;
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
      type="submit"
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
      className="group inline-flex items-center justify-center gap-[var(--space-3)] rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] px-[var(--space-6)] py-[var(--space-3)] font-medium transition-colors duration-[var(--duration-fast)] cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {children}
    </motion.button>
  );
}

export function AppointmentPage({
  specialities,
  doctors,
  prefill,
  onNavigate,
}: AppointmentPageProps) {
  const shouldReduceMotion = useReducedMotion();
  const todayStr = getTodayDateString();

  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [speciality, setSpeciality] = useState(
    prefill.specialityId || specialities[0]?.id || 'cardiology'
  );
  const [preferredDoctorId, setPreferredDoctorId] = useState(prefill.doctorId || '');
  const [preferredDate, setPreferredDate] = useState(todayStr);
  const [preferredTime, setPreferredTime] = useState(TIME_WINDOWS[0]);
  const [notes, setNotes] = useState('');

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null);

  useEffect(() => {
    if (prefill.specialityId) {
      setSpeciality(prefill.specialityId);
    }
    if (prefill.doctorId) {
      setPreferredDoctorId(prefill.doctorId);
    }
  }, [prefill.specialityId, prefill.doctorId]);

  const matchingDoctors = doctors.filter((doc) => doc.specialityId === speciality);
  const selectedDoctor = doctors.find((doc) => doc.id === preferredDoctorId) || null;

  const handleSpecialityChange = (nextSpeciality: string) => {
    setSpeciality(nextSpeciality);
    const stillValid = doctors.some(
      (doc) => doc.id === preferredDoctorId && doc.specialityId === nextSpeciality
    );
    if (!stillValid) {
      setPreferredDoctorId('');
    }
    if (fieldErrors.speciality) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.speciality;
        return next;
      });
    }
  };

  const validateSingleField = (
    field: 'patientName' | 'phone' | 'email' | 'speciality' | 'preferredDate',
    value: string
  ): string | null => {
    if (field === 'patientName') {
      return value.trim().length < 2
        ? 'Please enter the patient’s full name (at least 2 characters).'
        : null;
    }
    if (field === 'phone') {
      const digitsOnly = value.replace(/[\s\-().+]/g, '');
      return !/^\d{7,15}$/.test(digitsOnly)
        ? 'Please enter a valid contact telephone number (7 to 15 digits).'
        : null;
    }
    if (field === 'email') {
      return value.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? 'Please enter a valid email address or leave blank.'
        : null;
    }
    if (field === 'speciality') {
      return !value ? 'Please choose a clinical speciality.' : null;
    }
    if (field === 'preferredDate') {
      return !value || value < todayStr ? 'Please select today or an upcoming date.' : null;
    }
    return null;
  };

  const handleFieldBlur = (
    field: 'patientName' | 'phone' | 'email' | 'speciality' | 'preferredDate',
    value: string
  ) => {
    setFocusedField((prev) => (prev === field ? null : prev));
    const errorMsg = validateSingleField(field, value);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (errorMsg) {
        next[field] = errorMsg;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const validateClientForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    const nameErr = validateSingleField('patientName', patientName);
    if (nameErr) errors.patientName = nameErr;
    const phoneErr = validateSingleField('phone', phone);
    if (phoneErr) errors.phone = phoneErr;
    const emailErr = validateSingleField('email', email);
    if (emailErr) errors.email = emailErr;
    const specErr = validateSingleField('speciality', speciality);
    if (specErr) errors.speciality = specErr;
    const dateErr = validateSingleField('preferredDate', preferredDate);
    if (dateErr) errors.preferredDate = dateErr;
    return errors;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting || isSubmittingRef.current) return;
    setFormError(null);

    const clientErrors = validateClientForm();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setFormError('Please correct the highlighted fields before submitting.');
      return;
    }

    setFieldErrors({});
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patientName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          speciality,
          preferredDoctorId,
          preferredDate,
          preferredTime,
          notes: notes.trim(),
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const rawBody = await response.text();
      let payload: {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
        appointment?: AppointmentConfirmation;
      } | null = null;

      if (contentType.includes('application/json') && rawBody.trim().length > 0) {
        try {
          payload = JSON.parse(rawBody);
        } catch {
          payload = null;
        }
      }

      if (!payload) {
        const statusNote = `HTTP ${response.status}`;
        const preview = rawBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        setFormError(
          preview && !rawBody.trim().startsWith('<')
            ? `Appointment service returned an unexpected response (${statusNote}): ${preview.slice(0, 140)}`
            : `Unable to process appointment request (${statusNote}). Please try again or call 020 7946 0811.`
        );
        return;
      }

      if (!response.ok || !payload.ok || !payload.appointment) {
        if (payload.fieldErrors) {
          setFieldErrors(payload.fieldErrors);
        }
        setFormError(
          payload.error ||
            `Unable to submit appointment request (HTTP ${response.status}). Please try again.`
        );
        return;
      }

      setConfirmation(payload.appointment);
    } catch {
      setFormError(
        'Network interruption while reaching our appointment desk. Please retry or call 020 7946 0811.'
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmation(null);
    setPatientName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setFieldErrors({});
    setFormError(null);
  };

  const underlineClass = (fieldName: string, hasError: boolean) =>
    `w-full bg-transparent border-0 border-b pt-[var(--space-6)] pb-[var(--space-2)] px-[var(--space-1)] text-[var(--color-ink)] placeholder:text-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:rounded-[var(--radius-sm)] transition-colors duration-[var(--duration-fast)] min-h-[48px] ${
      hasError
        ? 'border-[var(--color-error)]'
        : focusedField === fieldName
        ? 'border-[var(--color-accent)]'
        : 'border-[var(--color-hairline-strong)]'
    }`;

  const floatingLabelClass = (isRaised: boolean, hasError: boolean) =>
    `pointer-events-none absolute left-[var(--space-1)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-editorial)] ${
      isRaised
        ? 'top-0 uppercase font-medium tracking-[var(--type-xs-tracking)]'
        : 'top-[var(--space-6)]'
    } ${
      hasError
        ? 'text-[var(--color-error)]'
        : isRaised
        ? 'text-[var(--color-accent-text)]'
        : 'text-[var(--color-ink-muted)]'
    }`;

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
          Patient Scheduling
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
          Request a Private Consultation
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
          Select your clinical department and preferred date; our concierge confirms exact
          consultant times within two business hours.
        </motion.p>
      </header>

      {/* Two-Column Desktop Split: Form Left (5 cols), Context Panel Right (7 cols) */}
      <div className="mt-[var(--space-12)] grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-10)] lg:gap-[var(--space-12)] items-start">
        {/* Left 5 Columns: Booking Form or Inline Confirmation */}
        <div className="lg:col-span-5">
          {confirmation ? (
            <motion.div
              role="status"
              aria-live="polite"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
              className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] p-[var(--space-8)]"
            >
              <div className="flex items-center gap-[var(--space-3)] text-[var(--color-success)]">
                <CheckCircle2 className="w-5 h-5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                <span
                  className="uppercase font-medium"
                  style={{
                    fontSize: 'var(--type-xs-size)',
                    letterSpacing: 'var(--type-xs-tracking)',
                  }}
                >
                  Appointment Request Confirmed
                </span>
              </div>

              <h2
                className="mt-[var(--space-4)] font-serif font-medium text-[var(--color-ink)]"
                style={{
                  fontSize: 'var(--type-xl-size)',
                  lineHeight: 'var(--type-xl-leading)',
                }}
              >
                Thank you, {confirmation.patientName}.
              </h2>

              <p
                className="mt-[var(--space-2)] text-[var(--color-ink-muted)]"
                style={{
                  fontSize: 'var(--type-sm-size)',
                  lineHeight: 'var(--type-base-leading)',
                }}
              >
                Your request has been logged with our clinical concierge. A coordinator will reach
                you on{' '}
                <span className="font-medium text-[var(--color-ink)] tabular-nums">
                  {confirmation.phone}
                </span>{' '}
                to finalize suite allocation.
              </p>

              <dl
                className="mt-[var(--space-6)] pt-[var(--space-6)] border-t border-[var(--color-hairline)] grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-5)]"
                style={{ fontSize: 'var(--type-sm-size)' }}
              >
                <div>
                  <dt
                    className="uppercase text-[var(--color-ink-muted)]"
                    style={{
                      fontSize: 'var(--type-xs-size)',
                      letterSpacing: 'var(--type-xs-tracking)',
                    }}
                  >
                    Reference
                  </dt>
                  <dd className="mt-[var(--space-1)] font-medium text-[var(--color-primary)] tabular-nums">
                    {confirmation.referenceCode}
                  </dd>
                </div>
                <div>
                  <dt
                    className="uppercase text-[var(--color-ink-muted)]"
                    style={{
                      fontSize: 'var(--type-xs-size)',
                      letterSpacing: 'var(--type-xs-tracking)',
                    }}
                  >
                    Department
                  </dt>
                  <dd className="mt-[var(--space-1)] font-medium text-[var(--color-ink)]">
                    {confirmation.specialityName}
                  </dd>
                </div>
                <div>
                  <dt
                    className="uppercase text-[var(--color-ink-muted)]"
                    style={{
                      fontSize: 'var(--type-xs-size)',
                      letterSpacing: 'var(--type-xs-tracking)',
                    }}
                  >
                    Consultant
                  </dt>
                  <dd className="mt-[var(--space-1)] font-medium text-[var(--color-ink)]">
                    {confirmation.doctorName}
                  </dd>
                </div>
                <div>
                  <dt
                    className="uppercase text-[var(--color-ink-muted)]"
                    style={{
                      fontSize: 'var(--type-xs-size)',
                      letterSpacing: 'var(--type-xs-tracking)',
                    }}
                  >
                    Preferred Date
                  </dt>
                  <dd className="mt-[var(--space-1)] font-medium text-[var(--color-ink)] tabular-nums">
                    {confirmation.preferredDate} · {confirmation.preferredTime}
                  </dd>
                </div>
              </dl>

              <div className="mt-[var(--space-8)] pt-[var(--space-6)] border-t border-[var(--color-hairline)] flex flex-wrap items-center gap-[var(--space-4)]">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] px-[var(--space-5)] py-[var(--space-3)] font-medium transition-colors duration-[var(--duration-fast)] cursor-pointer min-h-[44px]"
                  style={{ fontSize: 'var(--type-sm-size)' }}
                >
                  Book Another Appointment
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-hairline-strong)] bg-transparent hover:bg-[var(--color-primary-tint)] text-[var(--color-primary)] px-[var(--space-5)] py-[var(--space-3)] font-medium transition-colors duration-[var(--duration-fast)] cursor-pointer min-h-[44px]"
                  style={{ fontSize: 'var(--type-sm-size)' }}
                >
                  Return to Overview
                </button>
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] p-[var(--space-6)] sm:p-[var(--space-8)] space-y-[var(--space-6)]"
            >
              {/* Pre-selected Doctor Context Banner */}
              {selectedDoctor && (
                <div className="flex items-center justify-between gap-[var(--space-4)] pb-[var(--space-4)] border-b border-[var(--color-hairline)]">
                  <div className="flex items-center gap-[var(--space-3)]">
                    <UserCheck
                      className="w-4 h-4 text-[var(--color-accent-text)] shrink-0"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                    <div>
                      <p
                        className="font-medium text-[var(--color-primary)]"
                        style={{ fontSize: 'var(--type-sm-size)' }}
                      >
                        Consultation with {selectedDoctor.name}
                      </p>
                      <p
                        className="text-[var(--color-ink-muted)]"
                        style={{ fontSize: 'var(--type-xs-size)' }}
                      >
                        {selectedDoctor.specialityName} · {selectedDoctor.consultationDays}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreferredDoctorId('')}
                    className="text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] underline underline-offset-4 cursor-pointer shrink-0"
                    style={{ fontSize: 'var(--type-xs-size)' }}
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Inline Form-Level Error */}
              {formError && (
                <div
                  role="alert"
                  className="flex items-start gap-[var(--space-3)] rounded-[var(--radius-md)] bg-[var(--color-error-bg)] border border-[var(--color-error)]/30 px-[var(--space-4)] py-[var(--space-3)] text-[var(--color-error)]"
                  style={{ fontSize: 'var(--type-sm-size)' }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-1" strokeWidth={1.6} aria-hidden="true" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 01. Name (Underline + Floating Label) */}
              <div className="relative">
                <input
                  id="patient-name"
                  type="text"
                  required
                  aria-required="true"
                  value={patientName}
                  onFocus={() => setFocusedField('patientName')}
                  onBlur={() => handleFieldBlur('patientName', patientName)}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Patient Full Name"
                  aria-invalid={Boolean(fieldErrors.patientName)}
                  className={underlineClass('patientName', Boolean(fieldErrors.patientName))}
                  style={{ fontSize: 'var(--type-base-size)' }}
                />
                <label
                  htmlFor="patient-name"
                  className={floatingLabelClass(
                    focusedField === 'patientName' || patientName.length > 0,
                    Boolean(fieldErrors.patientName)
                  )}
                  style={{
                    fontSize:
                      focusedField === 'patientName' || patientName.length > 0
                        ? 'var(--type-xs-size)'
                        : 'var(--type-sm-size)',
                  }}
                >
                  Patient Full Name *
                </label>
                {fieldErrors.patientName && (
                  <p
                    className="mt-[var(--space-2)] flex items-center gap-[var(--space-1)] text-[var(--color-error)]"
                    style={{ fontSize: 'var(--type-xs-size)' }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                    <span>{fieldErrors.patientName}</span>
                  </p>
                )}
              </div>

              {/* 02. Phone (Underline + Floating Label) */}
              <div className="relative">
                <input
                  id="patient-phone"
                  type="tel"
                  required
                  aria-required="true"
                  value={phone}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => handleFieldBlur('phone', phone)}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Telephone Number"
                  aria-invalid={Boolean(fieldErrors.phone)}
                  className={`${underlineClass('phone', Boolean(fieldErrors.phone))} tabular-nums`}
                  style={{ fontSize: 'var(--type-base-size)' }}
                />
                <label
                  htmlFor="patient-phone"
                  className={floatingLabelClass(
                    focusedField === 'phone' || phone.length > 0,
                    Boolean(fieldErrors.phone)
                  )}
                  style={{
                    fontSize:
                      focusedField === 'phone' || phone.length > 0
                        ? 'var(--type-xs-size)'
                        : 'var(--type-sm-size)',
                  }}
                >
                  Telephone Number *
                </label>
                {fieldErrors.phone && (
                  <p
                    className="mt-[var(--space-2)] flex items-center gap-[var(--space-1)] text-[var(--color-error)]"
                    style={{ fontSize: 'var(--type-xs-size)' }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                    <span>{fieldErrors.phone}</span>
                  </p>
                )}
              </div>

              {/* 03. Email (Underline + Floating Label) */}
              <div className="relative">
                <input
                  id="patient-email"
                  type="email"
                  value={email}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => handleFieldBlur('email', email)}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={underlineClass('email', Boolean(fieldErrors.email))}
                  style={{ fontSize: 'var(--type-base-size)' }}
                />
                <label
                  htmlFor="patient-email"
                  className={floatingLabelClass(
                    focusedField === 'email' || email.length > 0,
                    Boolean(fieldErrors.email)
                  )}
                  style={{
                    fontSize:
                      focusedField === 'email' || email.length > 0
                        ? 'var(--type-xs-size)'
                        : 'var(--type-sm-size)',
                  }}
                >
                  Email Address (optional)
                </label>
                {fieldErrors.email && (
                  <p
                    className="mt-[var(--space-2)] flex items-center gap-[var(--space-1)] text-[var(--color-error)]"
                    style={{ fontSize: 'var(--type-xs-size)' }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              {/* 04. Speciality Select (Underline + Floating Label) */}
              <div className="relative">
                <select
                  id="patient-speciality"
                  required
                  aria-required="true"
                  value={speciality}
                  onFocus={() => setFocusedField('speciality')}
                  onBlur={() => handleFieldBlur('speciality', speciality)}
                  onChange={(e) => handleSpecialityChange(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.speciality)}
                  className={underlineClass('speciality', Boolean(fieldErrors.speciality))}
                  style={{ fontSize: 'var(--type-base-size)' }}
                >
                  {specialities.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="patient-speciality"
                  className={floatingLabelClass(true, Boolean(fieldErrors.speciality))}
                  style={{ fontSize: 'var(--type-xs-size)' }}
                >
                  Clinical Speciality *
                </label>
                {fieldErrors.speciality && (
                  <p
                    className="mt-[var(--space-2)] flex items-center gap-[var(--space-1)] text-[var(--color-error)]"
                    style={{ fontSize: 'var(--type-xs-size)' }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                    <span>{fieldErrors.speciality}</span>
                  </p>
                )}
              </div>

              {/* Preferred Consultant (when matching specialists exist) */}
              {matchingDoctors.length > 0 && (
                <div className="relative">
                  <select
                    id="preferred-doctor"
                    value={preferredDoctorId}
                    onFocus={() => setFocusedField('preferredDoctorId')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setPreferredDoctorId(e.target.value)}
                    className={underlineClass('preferredDoctorId', false)}
                    style={{ fontSize: 'var(--type-base-size)' }}
                  >
                    <option value="">First Available Senior Consultant</option>
                    {matchingDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.credentials})
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="preferred-doctor"
                    className={floatingLabelClass(true, false)}
                    style={{ fontSize: 'var(--type-xs-size)' }}
                  >
                    Preferred Consultant
                  </label>
                </div>
              )}

              {/* 05. Preferred Date & Time Window */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-6)]">
                <div className="relative">
                  <input
                    id="preferred-date"
                    type="date"
                    required
                    aria-required="true"
                    min={todayStr}
                    value={preferredDate}
                    onFocus={() => setFocusedField('preferredDate')}
                    onBlur={() => handleFieldBlur('preferredDate', preferredDate)}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    aria-invalid={Boolean(fieldErrors.preferredDate)}
                    className={`${underlineClass('preferredDate', Boolean(fieldErrors.preferredDate))} tabular-nums`}
                    style={{ fontSize: 'var(--type-base-size)' }}
                  />
                  <label
                    htmlFor="preferred-date"
                    className={floatingLabelClass(true, Boolean(fieldErrors.preferredDate))}
                    style={{ fontSize: 'var(--type-xs-size)' }}
                  >
                    Preferred Date *
                  </label>
                  {fieldErrors.preferredDate && (
                    <p
                      className="mt-[var(--space-2)] flex items-center gap-[var(--space-1)] text-[var(--color-error)]"
                      style={{ fontSize: 'var(--type-xs-size)' }}
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                      <span>{fieldErrors.preferredDate}</span>
                    </p>
                  )}
                </div>

                <div className="relative">
                  <select
                    id="preferred-time"
                    value={preferredTime}
                    onFocus={() => setFocusedField('preferredTime')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className={underlineClass('preferredTime', false)}
                    style={{ fontSize: 'var(--type-base-size)' }}
                  >
                    {TIME_WINDOWS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="preferred-time"
                    className={floatingLabelClass(true, false)}
                    style={{ fontSize: 'var(--type-xs-size)' }}
                  >
                    Preferred Window
                  </label>
                </div>
              </div>

              {/* 06. Message / Clinical Notes */}
              <div className="relative">
                <textarea
                  id="visit-notes"
                  rows={3}
                  value={notes}
                  onFocus={() => setFocusedField('notes')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Clinical Notes"
                  className={underlineClass('notes', false)}
                  style={{ fontSize: 'var(--type-base-size)' }}
                />
                <label
                  htmlFor="visit-notes"
                  className={floatingLabelClass(
                    focusedField === 'notes' || notes.length > 0,
                    false
                  )}
                  style={{
                    fontSize:
                      focusedField === 'notes' || notes.length > 0
                        ? 'var(--type-xs-size)'
                        : 'var(--type-sm-size)',
                  }}
                >
                  Brief Message or Reason for Visit (optional)
                </label>
              </div>

              <div className="pt-[var(--space-2)] flex flex-col gap-[var(--space-3)]">
                <MagneticSubmitButton disabled={isSubmitting}>
                  <span style={{ fontSize: 'var(--type-sm-size)' }}>
                    {isSubmitting ? 'Confirming Request...' : 'Request Appointment'}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-editorial)] group-hover:translate-x-1"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </MagneticSubmitButton>

                <p
                  className="text-[var(--color-ink-muted)]"
                  style={{ fontSize: 'var(--type-xs-size)' }}
                >
                  Self-referral welcome. No GP letter required for diagnostic consultations.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Right 7 Columns: Calm Facility Image + Reassurance Copy + Contact */}
        <aside className="lg:col-span-7 space-y-[var(--space-8)]">
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-[var(--space-2)] -right-[var(--space-2)] inset-0 border border-[var(--color-hairline-strong)] rounded-[var(--radius-md)]"
            />
            <motion.div
              initial={shouldReduceMotion ? undefined : { clipPath: 'inset(0% 0% 100% 0%)' }}
              whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: EDITORIAL_EASE }}
              className="relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-surface-tinted)]"
            >
              <MedicalImage
                src="/images/facility-suite.jpg"
                alt="Aurelia private diagnostic and consultation suite"
                aspectClassName="aspect-[16/9]"
                priority
              />
            </motion.div>
          </div>

          <motion.div
            initial={
              shouldReduceMotion ? undefined : { opacity: 0, y: 24, filter: 'blur(8px)' }
            }
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
            className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-hairline)] p-[var(--space-6)] sm:p-[var(--space-8)] grid grid-cols-1 md:grid-cols-2 gap-[var(--space-8)]"
          >
            <div>
              <div className="flex items-center gap-[var(--space-2)] text-[var(--color-primary)] font-medium">
                <Clock
                  className="w-4 h-4 text-[var(--color-accent-text)]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span style={{ fontSize: 'var(--type-sm-size)' }}>Unhurried Consultations</span>
              </div>
              <p
                className="mt-[var(--space-2)] text-[var(--color-ink-muted)]"
                style={{
                  fontSize: 'var(--type-sm-size)',
                  lineHeight: 'var(--type-base-leading)',
                }}
              >
                Every initial consultation reserves 45 minutes with your consultant—allowing full
                review of prior imaging and a clear written care plan.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-[var(--space-2)] text-[var(--color-primary)] font-medium">
                <ShieldCheck
                  className="w-4 h-4 text-[var(--color-accent-text)]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span style={{ fontSize: 'var(--type-sm-size)' }}>Direct Insurer Billing</span>
              </div>
              <p
                className="mt-[var(--space-2)] text-[var(--color-ink-muted)]"
                style={{
                  fontSize: 'var(--type-sm-size)',
                  lineHeight: 'var(--type-base-leading)',
                }}
              >
                Accredited by Bupa, AXA Health, WPA, Cigna, and Allianz Care, with transparent
                self-pay consultation and diagnostic fee schedules.
              </p>
            </div>

            <div className="md:col-span-2 pt-[var(--space-6)] border-t border-[var(--color-hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--space-4)]">
              <div className="flex items-center gap-[var(--space-3)]">
                <Phone
                  className="w-4 h-4 text-[var(--color-accent-text)] shrink-0"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <div>
                  <p
                    className="uppercase text-[var(--color-ink-muted)]"
                    style={{
                      fontSize: 'var(--type-xs-size)',
                      letterSpacing: 'var(--type-xs-tracking)',
                    }}
                  >
                    24/7 Clinical Triage
                  </p>
                  <a
                    href="tel:+442079460811"
                    className="font-medium text-[var(--color-primary)] hover:text-[var(--color-accent-text)] tabular-nums"
                    style={{ fontSize: 'var(--type-base-size)' }}
                  >
                    020 7946 0811
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-[var(--space-3)]">
                <Mail
                  className="w-4 h-4 text-[var(--color-accent-text)] shrink-0"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <div>
                  <p
                    className="uppercase text-[var(--color-ink-muted)]"
                    style={{
                      fontSize: 'var(--type-xs-size)',
                      letterSpacing: 'var(--type-xs-tracking)',
                    }}
                  >
                    Concierge Desk
                  </p>
                  <a
                    href="mailto:concierge@aureliahospital.com"
                    className="font-medium text-[var(--color-primary)] hover:text-[var(--color-accent-text)]"
                    style={{ fontSize: 'var(--type-sm-size)' }}
                  >
                    concierge@aureliahospital.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
