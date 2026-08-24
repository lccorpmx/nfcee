import type { ReactNode } from "react";

/** Small capsule label that opens a section. */
export function Pill({
  icon,
  children,
  tone = "neutral",
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: "neutral" | "violet";
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-2 rounded-full border bg-white/85 px-4 py-2
        text-[13px] font-semibold shadow-[0_2px_10px_rgba(16,26,58,0.06)]
        backdrop-blur-md
        ${tone === "violet" ? "border-violet-200/80 text-violet-700" : "border-black/[0.07] text-slate-700"}
      `}
    >
      {icon}
      {children}
    </span>
  );
}

/** Circular icon badge used across feature rows. */
export function IconBadge({
  children,
  gradient,
  size = "md",
}: {
  children: ReactNode;
  gradient: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = { sm: "h-10 w-10", md: "h-12 w-12", lg: "h-14 w-14" }[size];
  return (
    <span
      className={`
        ${dim} inline-flex shrink-0 items-center justify-center rounded-full text-white
        shadow-[0_6px_16px_-6px_rgba(16,26,58,0.45)]
      `}
      style={{ background: gradient }}
    >
      {children}
    </span>
  );
}

/** Frosted panel that groups feature items. */
export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-[28px] border border-white/70 bg-white/60 p-5 shadow-[0_10px_40px_-24px_rgba(16,26,58,0.4)]
        backdrop-blur-xl sm:p-7
        ${className}
      `}
    >
      {children}
    </div>
  );
}
