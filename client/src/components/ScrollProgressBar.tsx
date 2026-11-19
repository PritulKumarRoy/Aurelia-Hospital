import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

export function ScrollProgressBar() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] origin-left bg-[var(--color-accent)] pointer-events-none"
      style={{
        scaleX: shouldReduceMotion ? scrollYProgress : smoothProgress,
        zIndex: 'calc(var(--z-nav) - 1)',
      }}
    />
  );
}
