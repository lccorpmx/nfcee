"use client";

import { useEffect, useRef } from "react";

/**
 * Reading-progress hairline pinned to the top of the viewport.
 *
 * Where the browser supports scroll-driven animations the bar is driven
 * entirely by CSS `animation-timeline: scroll()` — it runs off the main
 * thread and this component ships no runtime work at all. Everywhere else
 * we fall back to a passive listener that writes one custom property per
 * frame, coalesced through rAF so a fast scroll can't queue up work.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const native =
      typeof CSS !== "undefined" &&
      CSS.supports?.("animation-timeline", "scroll()");
    if (native) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const p = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      el.style.setProperty("--scroll-p", Math.min(1, Math.max(0, p)).toFixed(4));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={ref} className="scroll-progress-bar" />
    </div>
  );
}
