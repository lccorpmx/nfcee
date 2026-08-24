"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  FacebookGlyph,
  GoogleG,
  InstagramGlyph,
  StarIcon,
  ThumbUpIcon,
} from "./icons";
import { ShmoCard, type CardVariant } from "./shmo-card";
import { CARD_ART } from "./card-art";

/* ============================================================
   Timeline
   ------------------------------------------------------------
   One pass tells the whole story: acercar → detectar → abrir →
   actuar. Enter beats are generous, the exit is short (~60% of
   the approach) so the loop feels responsive rather than draggy.
   ============================================================ */

type Phase = "approach" | "detect" | "open" | "act" | "hold" | "exit";

const STEPS: { phase: Phase; ms: number }[] = [
  { phase: "approach", ms: 950 },
  { phase: "detect", ms: 800 },
  { phase: "open", ms: 550 },
  { phase: "act", ms: 1500 },
  { phase: "hold", ms: 1000 },
  { phase: "exit", ms: 560 },
];

type Dest = "google" | "instagram" | "facebook";

const DESTS: Dest[] = ["google", "instagram", "facebook"];

const DEST_CARD: Record<Dest, CardVariant> = {
  google: "google-thanks",
  instagram: "instagram",
  facebook: "facebook",
};

const DEST_LABEL: Record<Dest, string> = {
  google: "Reseña de 5 estrellas",
  instagram: "Nuevo seguidor en Instagram",
  facebook: "Nuevo seguidor en Facebook",
};

/** Phone rig position per phase — transform + opacity only. */
const RIG: Record<Phase, string> = {
  approach: "translate3d(6%,0,0) rotate(3deg)",
  detect: "translate3d(-4%,0,0) rotate(0deg)",
  open: "translate3d(0,0,0) rotate(0deg)",
  act: "translate3d(0,0,0) rotate(0deg)",
  hold: "translate3d(0,0,0) rotate(0deg)",
  exit: "translate3d(38%,0,0) rotate(10deg)",
};

/* ============================================================
   Phone screens
   ============================================================ */

function StatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const c = tone === "dark" ? "bg-slate-900/70" : "bg-white/80";
  return (
    <div className="flex items-center justify-between px-2.5 pt-1.5">
      <span className={`h-[3px] w-4 rounded-full ${c}`} />
      <span className={`h-[3px] w-5 rounded-full ${c}`} />
    </div>
  );
}

/** Idle screen shown while the phone is still travelling. */
function IdleScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-slate-50">
      <span className="font-display text-[8px] font-semibold tracking-wide text-slate-400">
        Listo para NFC
      </span>
      <span className="h-8 w-8 rounded-full border-2 border-dashed border-slate-300" />
    </div>
  );
}

function GoogleScreen({ starsOn, done }: { starsOn: boolean; done: boolean }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <StatusBar />
      <div className="flex flex-1 flex-col items-center justify-center px-3">
        <GoogleG className="h-6 w-6" />
        <p className="mt-1.5 font-display text-[9px] font-bold leading-tight text-slate-900">
          Tu Negocio
        </p>
        <p className="mt-0.5 text-[7px] leading-tight text-slate-500">Deja tu reseña</p>

        <div className="mt-2.5 flex gap-[3px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon
              key={i}
              className="h-[13px] w-[13px] transition-[color,transform] duration-300 ease-out"
              style={{
                color: starsOn ? "#fbbc05" : "#e2e8f0",
                transform: starsOn ? "scale(1)" : "scale(0.72)",
                transitionDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>

        <div
          className="mt-3 flex h-[18px] items-center justify-center gap-1 rounded-full px-2.5 transition-colors duration-200"
          style={{ background: done ? "#e6f4ea" : "#1a73e8" }}
        >
          {done ? (
            <>
              <CheckIcon className="h-[8px] w-[8px] text-green-brand" />
              <span className="font-display text-[7px] font-bold text-green-700">
                ¡Publicada!
              </span>
            </>
          ) : (
            <span className="font-display text-[7px] font-bold text-white">Publicar</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SocialScreen({ dest, done }: { dest: "instagram" | "facebook"; done: boolean }) {
  const isIg = dest === "instagram";
  return (
    <div className="flex h-full flex-col bg-white">
      <div className={`pb-1.5 ${isIg ? "grad-ig" : "bg-[#1877f2]"}`}>
        <StatusBar tone="light" />
        <div className="flex items-center justify-center gap-1 pt-1">
          {isIg ? (
            <InstagramGlyph className="h-[11px] w-[11px] text-white" />
          ) : (
            <FacebookGlyph className="h-[11px] w-[11px] text-white" />
          )}
          <span className="font-display text-[8px] font-semibold tracking-tight text-white">
            {isIg ? "Instagram" : "facebook"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-3">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full p-[2px] ${
            isIg ? "grad-ig" : "bg-[#1877f2]"
          }`}
        >
          <span className="flex h-full w-full items-center justify-center rounded-full bg-white font-display text-[9px] font-extrabold text-slate-800">
            T
          </span>
        </span>
        <p className="mt-1.5 font-display text-[8.5px] font-bold leading-tight text-slate-900">
          @tunegocio
        </p>
        <p className="mt-0.5 text-[7px] leading-tight text-slate-500">
          {done ? "1,249 seguidores" : "1,248 seguidores"}
        </p>

        <div
          className="mt-2.5 flex h-[19px] items-center justify-center gap-1 rounded-[5px] px-3 transition-colors duration-200 ease-out"
          style={{ background: done ? "#eef1f5" : isIg ? "#0095f6" : "#1877f2" }}
        >
          {done ? (
            <>
              <CheckIcon className="h-[8px] w-[8px] text-slate-700" />
              <span className="font-display text-[7px] font-bold text-slate-700">Siguiendo</span>
            </>
          ) : (
            <>
              {!isIg && <ThumbUpIcon className="h-[8px] w-[8px] text-white" />}
              <span className="font-display text-[7px] font-bold text-white">Seguir</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Hand — four fingers, a palm, a thumb. Nothing more.

   Each finger is one curved path drawn twice: a fat dark stroke
   for the outline, then a thinner white stroke over it for the
   fill. That yields a curled, outlined finger in two lines of
   markup — straight rounded rectangles read as stacked tabs.
   Every outline is laid down before any fill, so neighbouring
   fingers keep the dark line between them.

   The details that sell it are all cheap: fingers fan out and
   run long-to-short toward the pinky, the pinky is thinner than
   the rest, the palm narrows into a wrist that leaves the frame,
   and one crease marks the base of the thumb.
   ============================================================ */

const INK = "#0f172a";

/* Roots sit behind the device; only the tips clear its edge.
   Widths taper toward the pinky. */
const FINGERS = [
  { d: "M80 190C58 182 40 184 26 196", w: 30 }, // index
  { d: "M80 220C54 214 34 218 16 232", w: 31 }, // middle — longest
  { d: "M80 250C56 246 36 250 20 262", w: 30 }, // ring
  { d: "M82 278C62 276 48 280 34 290", w: 26 }, // pinky — shortest, thinnest
];

/* Short, angled, rooted in the palm — a thumb, not a fifth finger. */
const THUMB = "M164 272C154 246 150 224 154 204";

/** Fingers + palm, behind the device. */
function HandBack({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 330" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round">
        {FINGERS.map((f) => (
          <path key={`o${f.d}`} d={f.d} stroke={INK} strokeWidth={f.w} />
        ))}
        {FINGERS.map((f) => (
          <path key={`f${f.d}`} d={f.d} stroke="#fff" strokeWidth={f.w - 7} />
        ))}
      </g>

      {/* Palm tapering into a forearm. The path runs past the bottom of the
          viewBox on purpose: the flat clipped edge reads as an arm carrying
          on out of frame, where a closed rounded base reads as a mitten.
          Drawn after the fingers so it closes over their roots. */}
      <path
        d="M60 268C60 242 78 226 104 226L146 226C172 226 188 242 188 268L168 352L92 352Z"
        fill="#fff"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Crease at the base of the thumb — one line, a lot of hand. */}
      <path
        d="M152 302c-13-7-20-19-21-34"
        fill="none"
        stroke={INK}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

/** Thumb — the only part that crosses in front of the device. */
function HandFront({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 330" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round">
        <path d={THUMB} stroke={INK} strokeWidth="30" />
        <path d={THUMB} stroke="#fff" strokeWidth="23" />
      </g>
    </svg>
  );
}

/* ============================================================
   Component
   ============================================================ */

export function NfcDemo({ className = "" }: { className?: string }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [destIdx, setDestIdx] = useState(0);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setHydrated(true), []);

  // Honour the OS motion setting, and react if it changes mid-session.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Only animate while on screen — no timers burning CPU out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Advance the timeline one beat at a time.
  useEffect(() => {
    if (!active || reduced) return;
    const t = setTimeout(() => {
      if (stepIdx + 1 >= STEPS.length) {
        setStepIdx(0);
        setDestIdx((d) => (d + 1) % DESTS.length);
      } else {
        setStepIdx(stepIdx + 1);
      }
    }, STEPS[stepIdx].ms);
    return () => clearTimeout(t);
  }, [stepIdx, active, reduced]);

  const dest = DESTS[destIdx];
  /*
    `still` covers the two cases where nothing should move: the server /
    no-JS render, and a reader who asked for reduced motion. Both get the
    finished frame — the payoff, not the setup — rather than a blank box.
  */
  const still = !hydrated || reduced;
  const phase: Phase = still ? "hold" : STEPS[stepIdx].phase;
  const detecting = phase === "detect";
  const screenOpen =
    phase === "open" || phase === "act" || phase === "hold" || phase === "exit";
  // Stars fill during `act`; the confirmation lands on `hold` so the
  // payoff never appears before the action that earned it.
  const starsOn = still || phase === "act" || phase === "hold";
  const done = still || phase === "hold";

  const caption = detecting
    ? "NFC detectado"
    : screenOpen
      ? DEST_LABEL[dest]
      : "Acerca tu teléfono";

  return (
    <div ref={ref} className={`w-full ${className}`}>
      <figure
        className="mx-auto w-full max-w-[340px] sm:max-w-[380px]"
        role="img"
        aria-label="Demostración: al acercar un teléfono al tag, el NFC se detecta y el teléfono abre la reseña de Google con 5 estrellas, o el perfil de Instagram o Facebook para seguir al negocio."
      >
        {/* ---------- Scene ---------- */}
        <div
          className="relative aspect-[6/4.7] w-full select-none"
          aria-hidden="true"
          style={{ perspective: "900px" }}
        >
          {/* Card */}
          <div
            className="absolute bottom-[9%] left-[1%] w-[47%] transition-transform duration-500 ease-out"
            style={{ transform: detecting ? "scale(1.04)" : "scale(1)" }}
          >
            {/* detection halo */}
            <div
              className="pointer-events-none absolute -inset-3 -z-10 rounded-[26px] blur-xl transition-opacity duration-300"
              style={{
                background: "rgba(59,130,246,0.45)",
                opacity: detecting ? 1 : 0,
              }}
            />
            <ShmoCard
              variant={DEST_CARD[dest]}
              imageSrc={CARD_ART[DEST_CARD[dest]]}
              withStand
            />
          </div>

          {/* NFC waves between card and phone */}
          <div className="pointer-events-none absolute left-[48%] top-[34%] h-[28%] w-[12%]">
            <svg viewBox="0 0 60 80" className="h-full w-full overflow-visible">
              {[0, 1, 2].map((i) => (
                <path
                  key={i}
                  d={["M8 26a22 22 0 0 1 0 28", "M20 16a38 38 0 0 1 0 48", "M32 6a54 54 0 0 1 0 68"][i]}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{
                    transformOrigin: "0px 40px",
                    opacity: detecting ? undefined : 0,
                    animation: detecting
                      ? `nfc-ping 1.1s ease-out ${i * 0.18}s infinite`
                      : "none",
                    transition: "opacity 200ms ease-out",
                  }}
                />
              ))}
            </svg>
          </div>

          {/* Phone rig */}
          <div
            className="absolute right-[1%] top-[2%] h-[94%] w-[46%]"
            style={{
              transform: RIG[phase],
              opacity: phase === "exit" ? 0 : 1,
              transition: still
                ? "none"
                : `transform ${STEPS[stepIdx].ms}ms cubic-bezier(0.22,1,0.36,1), opacity ${
                    phase === "exit" ? 340 : 420
                  }ms ease-out`,
            }}
          >
            {/* far fingers curl behind the device */}
            <HandBack className="absolute inset-0 z-0 h-full w-full" />

            {/* Device */}
            <div className="absolute left-[25%] top-0 z-10 h-[78%] w-[65%] rounded-[16px] bg-slate-900 p-[3px] shadow-[0_16px_32px_-14px_rgba(16,26,58,0.6)]">
              <div className="relative h-full w-full overflow-hidden rounded-[13px] bg-white">
                {/* dynamic island */}
                <span className="absolute left-1/2 top-[5px] z-10 h-[5px] w-[26px] -translate-x-1/2 rounded-full bg-slate-900" />

                {/* Crossfade: idle ↔ destination */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 ease-out"
                  style={{ opacity: screenOpen ? 0 : 1 }}
                >
                  <IdleScreen />
                </div>
                <div
                  className="absolute inset-0 transition-opacity duration-300 ease-out"
                  style={{ opacity: screenOpen ? 1 : 0 }}
                >
                  {dest === "google" ? (
                    <GoogleScreen starsOn={starsOn} done={done} />
                  ) : (
                    <SocialScreen dest={dest} done={done} />
                  )}
                </div>
              </div>
            </div>

            {/* palm + thumb close over the front of the device */}
            <HandFront className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
          </div>
        </div>

        {/* ---------- Caption + progress ---------- */}
        <figcaption className="mt-1 flex flex-col items-center gap-2.5" aria-hidden="true">
          <span
            className="
              inline-flex min-h-[30px] items-center gap-1.5 rounded-full border border-black/[0.06]
              bg-white/85 px-3.5 text-[12px] font-semibold text-slate-700
              shadow-[0_2px_10px_rgba(16,26,58,0.06)] backdrop-blur-md
              transition-colors duration-300
            "
          >
            <span
              className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
              style={{ background: detecting ? "#2563eb" : screenOpen ? "#16a34a" : "#cbd5e1" }}
            />
            {caption}
          </span>

          <span className="flex items-center gap-1.5">
            {DESTS.map((d, i) => (
              <span
                key={d}
                className="h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: i === destIdx ? 18 : 6,
                  background: i === destIdx ? "#6d3bf5" : "#cbd5e1",
                }}
              />
            ))}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
