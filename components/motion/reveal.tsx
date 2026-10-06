"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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

const SLIDE_IN: Record<number, string> = {
  30: "slide-in-from-bottom-[30px]",
  60: "slide-in-from-bottom-[60px]",
  100: "slide-in-from-bottom-[100px]",
};

const TRANSLATE_Y: Record<number, string> = {
  30: "translate-y-[30px]",
  60: "translate-y-[60px]",
  100: "translate-y-[100px]",
};

const ANIMATION =
  "duration-[800ms] ease-[cubic-bezier(0.35,0,0,1)] [animation-fill-mode:both]";

const REDUCED_MOTION =
  "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0";

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
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const Tag = as;

  useEffect(() => {
    if (trigger !== "inView") return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, once]);

  const slideInClass = SLIDE_IN[y] || SLIDE_IN[30];
  const translateYClass = TRANSLATE_Y[y] || TRANSLATE_Y[30];

  const animationClasses =
    trigger === "mount"
      ? `animate-in fade-in ${slideInClass} ${ANIMATION} ${REDUCED_MOTION}`
      : visible
        ? `animate-in fade-in ${slideInClass} ${ANIMATION} ${REDUCED_MOTION}`
        : `opacity-0 ${translateYClass} ${REDUCED_MOTION}`;

  const combinedClassName = className
    ? `${className} ${animationClasses}`
    : animationClasses;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      id={id}
      className={combinedClassName}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}
