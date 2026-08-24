import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/* ============================================================
   Brand marks — official proportions, official colors
   ============================================================ */

export function GoogleG({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.4 5.4 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function InstagramGlyph({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <rect
        x="2.6"
        y="2.6"
        width="18.8"
        height="18.8"
        rx="5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.35" fill="currentColor" />
    </svg>
  );
}

export function FacebookGlyph({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
      />
    </svg>
  );
}

/* ============================================================
   UI icons — Lucide-derived geometry, 1.8 stroke, 24 grid
   ============================================================ */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BoltIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path {...stroke} d="M13.5 2 4 13.5h6.5L10 22l9.5-11.5H13z" />
    </svg>
  );
}

export function ClockIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <circle {...stroke} cx="12" cy="12" r="9" />
      <path {...stroke} d="M12 7v5.2l3.4 2" />
    </svg>
  );
}

export function StarIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="m12 2.6 2.86 5.8 6.4.93-4.63 4.51 1.09 6.38L12 17.2l-5.72 3.02 1.09-6.38-4.63-4.51 6.4-.93z"
      />
    </svg>
  );
}

export function NfcWaveIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path {...stroke} d="M7.5 8.4a5 5 0 0 1 0 7.2" />
      <path {...stroke} d="M11 5.6a9 9 0 0 1 0 12.8" />
      <path {...stroke} d="M14.5 2.8a13 13 0 0 1 0 18.4" />
      <circle cx="4.4" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function ThumbUpIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M9.2 21H6.4A2.4 2.4 0 0 1 4 18.6v-6A2.4 2.4 0 0 1 6.4 10.2h2.8zM11 10l3.1-6.6A2 2 0 0 1 17.9 4.6l-.9 4.3h3.2a2.2 2.2 0 0 1 2.15 2.67l-1.4 6.6A2.6 2.6 0 0 1 18.4 21H11z"
      />
    </svg>
  );
}

export function InfinityIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path
        {...stroke}
        strokeWidth="2.2"
        d="M6.6 8.2a3.8 3.8 0 1 0 0 7.6c2.3 0 3.4-1.9 5.4-3.8s3.1-3.8 5.4-3.8a3.8 3.8 0 1 1 0 7.6c-2.3 0-3.4-1.9-5.4-3.8S8.9 8.2 6.6 8.2Z"
      />
    </svg>
  );
}

export function ShieldIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path {...stroke} d="M12 2.8 4.8 5.8v5.6c0 4.4 3 8.2 7.2 9.8 4.2-1.6 7.2-5.4 7.2-9.8V5.8z" />
      <path {...stroke} d="m9.2 12 2 2 3.6-3.8" />
    </svg>
  );
}

export function DropletIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path {...stroke} d="M12 2.8s6.2 6 6.2 10.3A6.2 6.2 0 0 1 5.8 13.1C5.8 8.8 12 2.8 12 2.8Z" />
    </svg>
  );
}

export function PhoneIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <rect {...stroke} x="6.4" y="2.4" width="11.2" height="19.2" rx="2.6" />
      <path {...stroke} d="M10.6 18.6h2.8" />
    </svg>
  );
}

export function SparkleStarIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path
        {...stroke}
        d="m12 3 2.7 5.5 6 .9-4.35 4.2 1.03 6-5.38-2.83L6.62 19.6l1.03-6L3.3 9.4l6-.9z"
      />
    </svg>
  );
}

export function ChartUpIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path {...stroke} d="M4 19.2h16" />
      <path {...stroke} d="M5.6 15.4 10 10.6l3.2 3 5.2-6.2" />
      <path {...stroke} d="M14.6 7.4h3.8v3.8" />
    </svg>
  );
}

export function CartIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path {...stroke} strokeWidth="2" d="M2.6 3.4h2.6l2.2 11.1a1.8 1.8 0 0 0 1.8 1.4h8.3a1.8 1.8 0 0 0 1.77-1.42L21 7.4H6" />
      <circle cx="9.6" cy="20" r="1.5" fill="currentColor" />
      <circle cx="17.8" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path {...stroke} strokeWidth="2.4" d="m5 12.6 4.4 4.4L19 6.8" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path {...stroke} strokeWidth="2" d="M4.5 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

/* ============================================================
   Illustration: hand holding phone against an NFC reader
   Mirrors the line-art on the physical card.
   ============================================================ */

export function TapPhoneIllustration({
  className = "",
  animated = true,
}: {
  className?: string;
  animated?: boolean;
}) {
  const ink = { fill: "none", stroke: "#0f172a", strokeWidth: 3.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
      {/* NFC waves */}
      <g>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            {...ink}
            d={
              [
                "M44 48a16 16 0 0 1 0 24",
                "M56 40a30 30 0 0 1 0 40",
                "M68 32a44 44 0 0 1 0 56",
              ][i]
            }
            style={
              animated
                ? {
                    transformOrigin: "34px 60px",
                    animation: `nfc-ping 2.1s ease-out ${i * 0.28}s infinite`,
                  }
                : undefined
            }
          />
        ))}
        <circle cx="34" cy="60" r="5" fill="#0f172a" />
      </g>

      {/* Phone + hand */}
      <rect
        x="96"
        y="24"
        width="46"
        height="74"
        rx="9"
        fill="#fff"
        stroke="#0f172a"
        strokeWidth="3.4"
      />
      <path {...ink} d="M114 32h10" />
      <path
        {...ink}
        d="M142 62c8-2 14-2 18 1s2 8-4 9m-14 8c6 3 5 12-3 13-6 1-16 1-24-1-6-1.5-9-5-9-11V72"
      />
      <path {...ink} d="M106 96c-4 4-6 9-6 14" />
      <text
        x="119"
        y="66"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#0f172a"
        fontFamily="system-ui, sans-serif"
      >
        NFC
      </text>
    </svg>
  );
}

/* ============================================================
   Decorative sparkle strokes drawn around the physical cards
   ============================================================ */

export function SparkStrokes({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
      <g stroke="#fbbf24" strokeWidth="5" strokeLinecap="round">
        <path d="M8 34 4 46" />
        <path d="M24 28 22 41" />
        <path d="M40 32 40 45" />
      </g>
    </svg>
  );
}

/* ============================================================
   Stylised QR — deterministic, decorative only
   ============================================================ */

export function QrMark({ className = "" }: { className?: string }) {
  const cells = [
    "1110111", "1010001", "1110101", "0001010",
    "1101101", "1000101", "1110111",
  ];
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden="true">
      <rect width="28" height="28" rx="2" fill="#fff" />
      {cells.flatMap((row, y) =>
        row.split("").map((c, x) =>
          c === "1" ? (
            <rect key={`${x}-${y}`} x={x * 4} y={y * 4} width="4" height="4" fill="#0f172a" />
          ) : null,
        ),
      )}
    </svg>
  );
}
