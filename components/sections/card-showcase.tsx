import { Reveal } from "../reveal";
import { ShmoCard, type CardVariant } from "../shmo-card";
import { CARD_ART } from "../card-art";

const CARDS: CardVariant[] = ["google-click", "google-thanks", "instagram", "facebook"];

/** Yellow accent ticks drawn above/beside the card row, as on the reference art. */
function Spark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" className={className} aria-hidden="true">
      <g stroke="#fbbf24" strokeWidth="5" strokeLinecap="round">
        <path d="M6 6 3 20" />
        <path d="M20 3 19 17" />
        <path d="M34 7 33 21" />
      </g>
    </svg>
  );
}

export function CardShowcase() {
  return (
    <section className="relative px-5 py-10 sm:py-14" aria-label="Modelos de tag">
      <div className="relative mx-auto max-w-5xl">
        {/* Both sparks drift together, so they stay level with each other while
            moving against the card row — that offset is the depth cue. */}
        <div
          className="scroll-drift pointer-events-none absolute -top-2 left-1 sm:-top-3 sm:left-4"
          style={{ ["--drift" as string]: "20px" }}
        >
          <Spark className="h-9 w-9 opacity-90 sm:h-11 sm:w-11" />
        </div>
        <div
          className="scroll-drift pointer-events-none absolute -top-2 right-1 sm:-top-3 sm:right-4"
          style={{ ["--drift" as string]: "20px" }}
        >
          <Spark className="h-9 w-9 -scale-x-100 opacity-90 sm:h-11 sm:w-11" />
        </div>

        {/* Mobile: snap carousel. sm+: 4-up grid. */}
        <ul
          className="
            scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 pt-6
            sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 md:gap-6
          "
        >
          {CARDS.map((variant, i) => (
            <Reveal
              as="li"
              key={variant}
              variant="scale"
              delay={i * 110}
              className="w-[58%] min-w-[58%] shrink-0 snap-center sm:w-auto sm:min-w-0"
            >
              <ShmoCard
                variant={variant}
                imageSrc={CARD_ART[variant]}
                priority={i < 2}
                className={i % 2 === 1 ? "sm:mt-3" : ""}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
