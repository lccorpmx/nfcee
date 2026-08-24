"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

export type RevealVariant = "up" | "fade" | "scale" | "blur" | "left" | "right" | "mask";

type RevealProps = {
  children: ReactNode;
  /** ms added before this element animates in — use for stagger */
  delay?: number;
  variant?: RevealVariant;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/* ============================================================
   Shared reveal controller
   ------------------------------------------------------------
   One IntersectionObserver for the entire page rather than one per
   element. Targets are unobserved on their first reveal, so nothing
   keeps running as the visitor scrolls past.
   ============================================================ */

let observer: IntersectionObserver | null = null;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries, io) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        entry.target.classList.add("is-visible");
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
  );
  return observer;
}

/** Scroll-triggered entrance. Reveals once, on first intersection. */
export function Reveal({
  children,
  delay = 0,
  variant = "up",
  as: Tag = "div",
  className = "",
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    const io = getObserver();
    io.observe(el);

    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties}
      className={className}
    >
      {/* The wipe needs its own layer — see the `mask` note in globals.css.
          It renders as a <div>, so don't pair `mask` with `as="p"`/`as="span"`. */}
      {variant === "mask" ? <div className="reveal-mask">{children}</div> : children}
    </Tag>
  );
}
