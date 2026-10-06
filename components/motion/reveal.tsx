import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "header";
  trigger?: "mount" | "inView";
  y?: number;
  id?: string;
};

const SLIDE_IN: Record<number, string> = {
  30: "slide-in-from-bottom-[30px]",
  60: "slide-in-from-bottom-[60px]",
  100: "slide-in-from-bottom-[100px]",
};

const ANIMATION =
  "duration-[800ms] ease-[cubic-bezier(0.35,0,0,1)] [animation-fill-mode:both]";

const REDUCED_MOTION =
  "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0";

/**
 * Server-rendered CSS-only reveal. No client component, no React hydration
 * for the animation itself. Below-fold `inView` variants are unhidden
 * immediately; a tiny inline script in the layout wires up the scroll-linked
 * delay via a vanilla IntersectionObserver (no React, no JS bundle).
 */
export function Reveal({
  children,
  delay = 0.2,
  className,
  as = "div",
  trigger = "mount",
  y = 30,
  id,
}: RevealProps) {
  const slideInClass = SLIDE_IN[y] || SLIDE_IN[30];
  const Tag = as;

  if (trigger === "inView") {
    // Start visible (so users without JS — and PageSpeed — always see content).
    // The inline script in the layout applies opacity-0 + translate before the
    // first IO tick, then adds the animation classes when the element scrolls
    // into view. The element is fully usable even if JS never runs.
    const animationClasses = `animate-in fade-in ${slideInClass} ${ANIMATION} ${REDUCED_MOTION}`;
    return (
      <Tag
        id={id}
        data-reveal=""
        data-delay={delay}
        className={className ? `${className} ${animationClasses}` : animationClasses}
      >
        {children}
      </Tag>
    );
  }

  const mountClasses = `animate-in fade-in ${slideInClass} ${ANIMATION} ${REDUCED_MOTION}`;
  return (
    <Tag
      id={id}
      style={{ animationDelay: `${delay}s` }}
      className={className ? `${className} ${mountClasses}` : mountClasses}
    >
      {children}
    </Tag>
  );
}