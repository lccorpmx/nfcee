import { FacebookGlyph, GoogleG, InstagramGlyph } from "./icons";

/**
 * Ambient brand backdrop.
 *
 * Two layers, both non-interactive and behind all content:
 *  1. Soft colour fields — large radial gradients, heavily blurred.
 *  2. Ghost brand glyphs — the Google / Instagram / Facebook marks blown up
 *     and blurred so they read as texture, never as a legible logo. They run
 *     down the page in a left / right / left zig-zag starting just below the
 *     tap animation, each sitting on a colour field of its own brand.
 *
 * UNIT HAZARD — read before editing positions:
 * this element spans the whole document, which is ~2800px on desktop but
 * ~4500px on a phone. A vertical `%` offset therefore resolves to wildly
 * different pixel values per breakpoint, and anything sized in `vw` (small
 * on a phone) placed at a negative `%` offset lands completely off-page.
 * So: elements anchored to the hero use fixed `px` tops, and only the ones
 * meant to be distributed down the page use `%`.
 *
 * Blur is applied to a handful of large, static elements (no per-frame work),
 * and `contain: paint` keeps the blur from invalidating the rest of the page.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ contain: "paint" }}
    >
      {/* --- Base wash --- */}
      <div className="absolute inset-0 bg-[#f7f5f3]" />

      {/* --- 1. Colour fields --- */}

      {/* Hero glow. No glyph rides on these — the brand marks now start below
          the tap animation — so they exist purely to keep the hero from going flat. */}
      <div
        className="
          anim-drift absolute -left-[26%] -top-[130px] h-[112vw] w-[112vw]
          max-h-[720px] max-w-[720px] rounded-full opacity-[0.78] blur-[70px]
          sm:-left-[18%] sm:-top-[200px] sm:h-[62vw] sm:w-[62vw] sm:blur-[100px]
        "
        style={{
          background:
            "conic-gradient(from 200deg at 50% 50%, #fdb033, #f2593f, #dd2a7b, #9537b4, #515bd4, #fdb033)",
          animationDuration: "26s",
        }}
      />
      <div
        className="
          anim-drift absolute -right-[24%] -top-[110px] h-[96vw] w-[96vw]
          max-h-[620px] max-w-[620px] rounded-full opacity-[0.6] blur-[70px]
          sm:-right-[16%] sm:-top-[170px] sm:h-[52vw] sm:w-[52vw] sm:blur-[100px]
        "
        style={{
          background: "radial-gradient(circle at 40% 40%, #4c8bf5 0%, #1877f2 45%, transparent 72%)",
          animationDuration: "31s",
          animationDirection: "reverse",
        }}
      />

      {/*
        Header trio. Small, low-opacity and softly blurred so they sit behind
        the hero copy as texture rather than as logos. Top-anchored in px (see
        UNIT HAZARD) because they belong to the header, not to a share of the
        page. Kept off the right half on desktop, where the tap animation sits.
      */}
      <GoogleG
        className="
          absolute left-[2%] top-[44px] h-[15vw] w-[15vw] max-h-[86px] max-w-[86px]
          opacity-[0.4] blur-[3px]
          sm:left-[1%] sm:top-[58px] sm:h-[7vw] sm:w-[7vw] sm:max-h-[104px] sm:max-w-[104px]
        "
      />
      <InstagramGlyph
        className="
          absolute right-[4%] top-[176px] h-[14vw] w-[14vw] max-h-[80px] max-w-[80px]
          text-white/60 blur-[3px]
          sm:right-auto sm:left-[33%] sm:top-[30px] sm:h-[6.5vw] sm:w-[6.5vw] sm:max-h-[96px] sm:max-w-[96px]
        "
      />
      <FacebookGlyph
        className="
          absolute left-[1%] top-[300px] h-[14vw] w-[14vw] max-h-[82px] max-w-[82px]
          text-white/85 blur-[3px]
          sm:left-[2%] sm:top-[236px] sm:h-[6.5vw] sm:w-[6.5vw] sm:max-h-[96px] sm:max-w-[96px]
        "
      />

      {/*
        Distributed down the page — `%` is correct here, and the tap animation
        happens to end at ~16% of the document at every breakpoint, so this run
        starts just under it and alternates left / right / left.
        Each field carries its brand's glyph, so the two always read as a pair.
      */}

      {/*
        Google — left, under the perk list. Sits high enough that most of the
        mark clears the card row, which is opaque and was hiding all but a
        sliver of it. The clear band between perks and cards is only ~90-105px
        while the mark is 180-360px tall, so a little overlap is unavoidable;
        these values keep ~70% of it visible on a phone and ~60% on desktop.
        Breakpoints differ because the perk list stacks on mobile and sits in
        one row on desktop, moving the gap.
      */}
      <div
        className="
          anim-drift absolute -left-[36%] sm:-left-[24%] top-[19%] sm:top-[17%] h-[104vw] w-[104vw]
          max-h-[680px] max-w-[680px] rounded-full opacity-[0.52] blur-[80px]
          sm:-left-[22%] sm:h-[58vw] sm:w-[58vw] sm:blur-[110px]
        "
        style={{
          background:
            "conic-gradient(from 120deg at 50% 50%, #ea4335, #fbbc05, #34a853, #4285f4, #ea4335)",
          animationDuration: "34s",
        }}
      />
      <GoogleG
        className="
          absolute -left-[34%] top-[17%] h-[54vw] w-[54vw] max-h-[420px] max-w-[420px]
          opacity-80 blur-[5px]
          sm:-left-[13%] sm:top-[15.5%] sm:h-[32vw] sm:w-[32vw] sm:max-h-[360px] sm:max-w-[360px] sm:blur-[6px]
        "
      />

      {/* Instagram — right, further down */}
      <div
        className="
          anim-drift absolute -right-[28%] top-[41%] h-[98vw] w-[98vw]
          max-h-[640px] max-w-[640px] rounded-full opacity-[0.5] blur-[80px]
          sm:-right-[20%] sm:h-[54vw] sm:w-[54vw] sm:blur-[110px]
        "
        style={{
          background:
            "conic-gradient(from 200deg at 50% 50%, #fdb033, #f2593f, #dd2a7b, #9537b4, #515bd4, #fdb033)",
          animationDuration: "29s",
          animationDirection: "reverse",
        }}
      />
      <InstagramGlyph
        className="
          absolute -right-[13%] top-[43%] h-[48vw] w-[48vw] max-h-[360px] max-w-[360px]
          text-white/80 blur-[5px]
          sm:-right-[9%] sm:h-[32vw] sm:w-[32vw] sm:blur-[6px]
        "
      />

      {/* Facebook — left, further down still */}
      <div
        className="
          anim-drift absolute -left-[26%] top-[68%] h-[96vw] w-[96vw]
          max-h-[620px] max-w-[620px] rounded-full opacity-[0.46] blur-[80px]
          sm:-left-[16%] sm:h-[52vw] sm:w-[52vw] sm:blur-[110px]
        "
        style={{
          background: "radial-gradient(circle at 45% 45%, #4c8bf5 0%, #1877f2 46%, transparent 72%)",
          animationDuration: "37s",
        }}
      />
      <FacebookGlyph
        className="
          absolute -left-[13%] top-[70%] h-[46vw] w-[46vw] max-h-[350px] max-w-[350px]
          text-white/85 blur-[5px]
          sm:-left-[9%] sm:h-[31vw] sm:w-[31vw] sm:blur-[6px]
        "
      />

      {/* --- Veil: lifts contrast for body copy over the colour fields --- */}
      <div className="absolute inset-0 bg-[#faf8f6]/22" />
      {/*
        Hero wash. The page-centre veil below is anchored at 50% of the
        document, which leaves it almost transparent up here — so the headline
        and subtitle were reading straight over the Instagram/Facebook fields.
        Top-anchored in px (see UNIT HAZARD above) and kept narrow, so the
        corners keep their colour and the glyphs stay visible.
      */}
      <div
        className="absolute inset-x-0 top-0 h-[1100px] sm:h-[820px]"
        style={{
          background:
            "radial-gradient(ellipse 64% 92% at 50% 30%, rgba(250,248,246,0.94) 0%, rgba(250,248,246,0.62) 52%, rgba(250,248,246,0) 100%)",
        }}
      />
      {/*
        Keeps the centre column readable while leaving the edges saturated.
        Narrower and softer on phones: there the text column is nearly the
        full width, so a desktop-strength veil would wash out the glyphs too.
      */}
      <div
        className="absolute inset-0 sm:hidden"
        style={{
          background:
            "radial-gradient(ellipse 46% 34% at 50% 50%, rgba(250,248,246,0.9) 0%, rgba(250,248,246,0.6) 55%, rgba(250,248,246,0) 100%)",
        }}
      />
      <div
        className="absolute inset-0 hidden sm:block"
        style={{
          background:
            "radial-gradient(ellipse 54% 40% at 50% 50%, rgba(250,248,246,0.95) 0%, rgba(250,248,246,0.72) 52%, rgba(250,248,246,0) 100%)",
        }}
      />

      {/* --- Fine grain: kills gradient banding --- */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
