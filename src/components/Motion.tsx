"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 34 }}
      animate={
        reducedMotion || inView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 34 }
      }
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function PageEntry({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.main
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42 }}
    >
      {children}
    </motion.main>
  );
}

export function AnimatedBar({ width }: { width: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reducedMotion = useReducedMotion();
  return (
    <div className="metric-bar-track" ref={ref}>
      <motion.span
        initial={reducedMotion ? false : { width: 0 }}
        animate={{ width: reducedMotion || inView ? width : 0 }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
