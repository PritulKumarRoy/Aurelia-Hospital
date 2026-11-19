import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ArrowUp } from 'lucide-react';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.6 : 500;
    const nextVisible = latest > threshold;
    if (nextVisible !== visible) {
      setVisible(nextVisible);
    }
  });

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleBackToTop}
          aria-label="Back to top"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.3, ease: EDITORIAL_EASE }}
          style={{ zIndex: 'var(--z-nav)' }}
          className="fixed bottom-[var(--space-16)] md:bottom-[var(--space-8)] right-[var(--space-6)] inline-flex items-center justify-center w-11 h-11 rounded-[var(--radius-full)] bg-[var(--color-surface)] text-[var(--color-primary)] border border-[var(--color-hairline-strong)] shadow-[var(--shadow-2)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors duration-[var(--duration-fast)] cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" strokeWidth={1.6} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
