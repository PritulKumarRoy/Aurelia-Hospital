import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const PULSE_PATH_LENGTH = 309.1;

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const pulsePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (import.meta.env.DEV && pulsePathRef.current) {
      console.log('Splash pulse SVG getTotalLength():', pulsePathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    // Timeline: 1.2s stroke draw + 0.3s delay + 0.35s name fade + 0.6s hold = 2.45s
    const totalHoldMs = shouldReduceMotion ? 350 : 2450;
    const timer = window.setTimeout(onComplete, totalHoldMs);
    return () => window.clearTimeout(timer);
  }, [onComplete, shouldReduceMotion]);

  return (
    <motion.div
      key="aurelia-splash"
      initial={shouldReduceMotion ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={
        shouldReduceMotion
          ? { opacity: 0, transition: { duration: 0.2 } }
          : {
              clipPath: 'inset(0% 0% 100% 0%)',
              transition: { duration: 0.7, ease: EDITORIAL_EASE },
            }
      }
      style={{ zIndex: 'var(--z-overlay)' }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--color-base)] px-[var(--space-6)] text-center"
      role="dialog"
      aria-modal="true"
      aria-label="Aurelia Private Hospital"
    >
      <div className="flex flex-col items-center max-w-md w-full">
        <svg
          viewBox="0 0 280 120"
          className="w-64 sm:w-72 h-auto overflow-visible"
          role="img"
          aria-label="Aurelia clinical pulse emblem"
        >
          {/* Thin-line anatomical curve & pulse motif */}
          <motion.path
            ref={pulsePathRef}
            d="M 20 52 L 96 52 C 106 52, 112 36, 120 36 C 128 36, 132 68, 140 68 C 148 68, 152 24, 160 24 C 168 24, 174 52, 184 52 L 260 52"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={PULSE_PATH_LENGTH}
            initial={
              shouldReduceMotion
                ? { strokeDashoffset: 0 }
                : { strokeDashoffset: PULSE_PATH_LENGTH }
            }
            animate={{ strokeDashoffset: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 1.2,
              ease: EDITORIAL_EASE,
            }}
          />

          {/* Subtle architectural horizon rule */}
          <motion.line
            x1="88"
            y1="66"
            x2="192"
            y2="66"
            stroke="var(--color-hairline-strong)"
            strokeWidth="1"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.4,
              delay: shouldReduceMotion ? 0 : 1.1,
              ease: EDITORIAL_EASE,
            }}
          />

          {/* Hospital wordmark in Cormorant Garamond fading in after draw + 0.3s delay */}
          <motion.text
            x="140"
            y="102"
            textAnchor="middle"
            fill="var(--color-primary)"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.35,
              delay: shouldReduceMotion ? 0 : 1.5,
              ease: EDITORIAL_EASE,
            }}
          >
            Aurelia
          </motion.text>
        </svg>

        <motion.p
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.35,
            delay: shouldReduceMotion ? 0 : 1.6,
            ease: EDITORIAL_EASE,
          }}
          className="mt-[var(--space-2)] uppercase text-[var(--color-ink-muted)]"
          style={{
            fontSize: 'var(--type-xs-size)',
            lineHeight: 'var(--type-xs-leading)',
            letterSpacing: 'var(--type-xs-tracking)',
          }}
        >
          Private Hospital · Est. 1998
        </motion.p>
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="mt-[var(--space-10)] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] underline underline-offset-4 transition-colors duration-[var(--duration-fast)] cursor-pointer py-[var(--space-2)] px-[var(--space-4)] min-h-[44px]"
        style={{
          fontSize: 'var(--type-xs-size)',
          lineHeight: 'var(--type-xs-leading)',
          letterSpacing: 'var(--type-xs-tracking)',
        }}
      >
        Skip
      </button>
    </motion.div>
  );
}
