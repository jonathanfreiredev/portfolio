"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "header";
  trigger?: "mount" | "inView";
  y?: number;
  once?: boolean;
  id?: string;
};

export function Reveal({
  children,
  delay = 0.2,
  className,
  as = "div",
  trigger = "inView",
  y = 30,
  once = true,
  id,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (prefersReducedMotion) {
    const Tag = as as "div";
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  if (trigger === "mount") {
    return (
      <MotionTag
        id={id}
        className={className}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.35, 0, 0, 1] }}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.35, 0, 0, 1] }}
    >
      {children}
    </MotionTag>
  );
}
