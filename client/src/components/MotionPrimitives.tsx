import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  HeartPulse,
  Brain,
  Bone,
  Stethoscope,
  Scan,
  ShieldPlus,
  Microscope,
  Eye,
} from 'lucide-react';
import type { SpecialityIconKey } from '../types.ts';

export const CALM_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const SPRING_INTERACTIVE = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 28,
  bounce: 0.1,
};

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function RevealSection({ children, className = '', delay = 0 }: RevealSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: CALM_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface LiftCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function LiftCard({ children, className = '', onClick }: LiftCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      onClick={onClick}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={SPRING_INTERACTIVE}
      className={`bg-white rounded-2xl border border-[rgba(15,61,62,0.1)] shadow-[0_6px_24px_-8px_rgba(15,61,62,0.06)] hover:shadow-[0_14px_34px_-10px_rgba(15,61,62,0.12)] transition-shadow duration-200 ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface InteractiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function InteractiveButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  ariaLabel,
}: InteractiveButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  const variantClasses =
    variant === 'primary'
      ? 'bg-[#8E6B35] hover:bg-[#78582A] text-white'
      : variant === 'secondary'
      ? 'bg-[#0F3D3E] hover:bg-[#0A2C2D] text-white'
      : 'bg-transparent hover:bg-[rgba(15,61,62,0.05)] text-[#0F3D3E] border border-[rgba(15,61,62,0.2)]';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={shouldReduceMotion || disabled ? undefined : { scale: 1.02 }}
      whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.99 }}
      transition={SPRING_INTERACTIVE}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px] ${variantClasses} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function SpecialityIcon({
  iconKey,
  className = 'w-5 h-5 text-[#0F3D3E]',
}: {
  iconKey: SpecialityIconKey;
  className?: string;
}) {
  switch (iconKey) {
    case 'heart-pulse':
      return <HeartPulse className={className} aria-hidden="true" strokeWidth={1.6} />;
    case 'brain':
      return <Brain className={className} aria-hidden="true" strokeWidth={1.6} />;
    case 'bone':
      return <Bone className={className} aria-hidden="true" strokeWidth={1.6} />;
    case 'stethoscope':
      return <Stethoscope className={className} aria-hidden="true" strokeWidth={1.6} />;
    case 'scan':
      return <Scan className={className} aria-hidden="true" strokeWidth={1.6} />;
    case 'shield-plus':
      return <ShieldPlus className={className} aria-hidden="true" strokeWidth={1.6} />;
    case 'microscope':
      return <Microscope className={className} aria-hidden="true" strokeWidth={1.6} />;
    case 'eye':
      return <Eye className={className} aria-hidden="true" strokeWidth={1.6} />;
  }
}
