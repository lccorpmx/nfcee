import { Reveal } from "../reveal";

type Tier = {
  name: string;
  price: string;
  currency: string;
  note?: string;
  features: string[];
  cta: string;
  /** Header bar + CTA fill. Lightest stop must clear 4.5:1 against white text. */
  fill: string;
  /** Ambient glow behind the card — decorative, stays vivid. */
  glow: string;
  /** bullet colour */
  dot: string;
};

const TIERS: Tier[] = [
  {
    name: "1 Tarjeta",
    price: "199",
    currency: "MXN",
    features: ["1 tag NFC", "Personalización básica", "Soporte de configuración"],
    cta: "Lo quiero",
    fill: "linear-gradient(135deg,#7c3aed 0%,#5b21b6 100%)", // 5.7:1 on white
    glow: "rgba(139,92,246,0.34)",
    dot: "#7c3aed",
  },
  {
    name: "2 Tarjetas",
    price: "349",
    currency: "MXN",
    features: ["2 tags NFC", "Personalización básica", "Soporte de configuración"],
    cta: "Lo quiero",
    fill: "linear-gradient(135deg,#db2777 0%,#9d174d 100%)", // 4.6:1 on white
    glow: "rgba(236,72,153,0.32)",
    dot: "#db2777",
  },
  {
    name: "3 Tarjetas",
    price: "449",
    currency: "MXN",
    features: ["3 tags NFC", "Personalización básica", "Soporte de configuración"],
    cta: "Lo quiero",
    fill: "linear-gradient(135deg,#c2410c 0%,#7c2d12 100%)", // 5.2:1 on white
    glow: "rgba(249,115,22,0.32)",
    dot: "#c2410c",
  },
  {
    name: "+4 Tarjetas",
    price: "99",
    currency: "MXN c/u",
    note: "Mayoreo",
    features: ["4 o más tags", "Precio especial", "Soporte de configuración"],
    cta: "Quiero mayoreo",
    fill: "linear-gradient(135deg,#15803d 0%,#14532d 100%)", // 5.0:1 on white
    glow: "rgba(34,197,94,0.32)",
    dot: "#15803d",
  },
];

export function Pricing() {
  return (
    <section className="px-5 py-12 sm:py-16" aria-labelledby="pricing-title">
      <div className="mx-auto max-w-5xl">
        <Reveal variant="mask">
          <h2
            id="pricing-title"
            className="text-center font-display text-[1.55rem] font-extrabold tracking-[-0.025em] text-foreground sm:text-[2rem]"
          >
            Elige el paquete perfecto para tu negocio
          </h2>
        </Reveal>
        <Reveal delay={80} variant="blur">
          <p className="mt-2 text-center text-[14px] text-muted-foreground sm:text-[15px]">
            Más tarjetas, más impacto.
          </p>
        </Reveal>

        <ul className="mt-11 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {TIERS.map((tier, i) => (
            <Reveal as="li" key={tier.name} variant="scale" delay={i * 100} className="relative">
              {/* ambient tier glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 -z-10 rounded-[32px] blur-[26px]"
                style={{ background: tier.glow }}
              />

              <article
                className="
                  group/tier flex h-full flex-col overflow-hidden rounded-[20px] bg-white
                  shadow-[0_14px_36px_-20px_rgba(16,26,58,0.4)] ring-1 ring-black/[0.05]
                  transition-[transform,box-shadow] duration-300 ease-out
                  hover:-translate-y-1.5 hover:shadow-[0_26px_56px_-24px_rgba(16,26,58,0.45)]
                  motion-reduce:transform-none
                "
              >
                <h3
                  className="px-4 py-3 text-center font-display text-[15px] font-bold text-white"
                  style={{ background: tier.fill }}
                >
                  {tier.name}
                </h3>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-6">
                  <p className="flex items-baseline justify-center gap-1">
                    <span className="font-display text-[20px] font-semibold text-foreground">$</span>
                    <span className="tnum font-display text-[40px] font-extrabold leading-none tracking-[-0.03em] text-foreground">
                      {tier.price}
                    </span>
                    <span className="font-display text-[11px] font-bold text-muted-foreground">
                      {tier.currency}
                    </span>
                  </p>
                  {tier.note && (
                    <p className="mt-1 text-center font-display text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      {tier.note}
                    </p>
                  )}

                  <ul className="mt-6 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] leading-snug text-slate-600">
                        <span
                          aria-hidden="true"
                          className="mt-[6px] h-[5px] w-[5px] shrink-0 rounded-full"
                          style={{ background: tier.dot }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#comprar"
                    className="
                      mt-7 flex min-h-[46px] cursor-pointer items-center justify-center rounded-full
                      px-5 font-display text-[14px] font-semibold text-white
                      shadow-[0_10px_22px_-10px_rgba(16,26,58,0.55)]
                      transition-[transform,filter] duration-200 ease-out
                      hover:brightness-[1.06] active:scale-[0.97]
                      motion-reduce:transform-none
                    "
                    style={{ background: tier.fill }}
                  >
                    {tier.cta}
                    <span className="sr-only"> — paquete de {tier.name}</span>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
