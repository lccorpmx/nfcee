import { Reveal } from "../reveal";
import { ChartUpIcon, GoogleG, InfinityIcon, NfcWaveIcon, ThumbUpIcon } from "../icons";
import { GlassPanel, IconBadge, Pill } from "../ui";

const REASONS = [
  {
    icon: <NfcWaveIcon className="h-6 w-6" />,
    gradient: "linear-gradient(150deg,#3b82f6 0%,#1d4ed8 100%)",
    title: "Tecnología NFC",
    body: "Solo acerca tu teléfono y listo.",
  },
  {
    icon: <GoogleG className="h-6 w-6" />,
    gradient: "#ffffff",
    ring: true,
    title: "Reseñas reales en Google",
    body: "Van directo a tu perfil de Google Maps.",
  },
  {
    icon: <ThumbUpIcon className="h-6 w-6" />,
    gradient: "linear-gradient(150deg,#3b82f6 0%,#1877f2 100%)",
    title: "Aumenta tu reputación",
    body: "Más reseñas = más confianza y más ventas.",
  },
  {
    icon: <InfinityIcon className="h-6 w-6" />,
    gradient: "linear-gradient(150deg,#60a5fa 0%,#2563eb 100%)",
    title: "Uso ilimitado",
    body: "Úsala todas las veces que quieras.",
  },
];

export function WhyItWorks() {
  return (
    <section className="px-5 py-12 sm:py-16" aria-labelledby="why-title">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Pill tone="violet" icon={<ChartUpIcon className="h-4 w-4" />}>
            ¿Por qué funciona?
          </Pill>
        </Reveal>

        <Reveal delay={80} variant="mask">
          <h2
            id="why-title"
            className="mt-6 font-display text-[1.7rem] font-extrabold leading-[1.2] tracking-[-0.025em] text-foreground sm:text-4xl"
          >
            Más reseñas, más confianza,
            <br className="hidden sm:block" /> más{" "}
            <span className="text-grad-violet">clientes.</span>
          </h2>
        </Reveal>

        <Reveal delay={150} variant="blur">
          <p className="mx-auto mt-4 max-w-[32rem] text-[14px] leading-[1.65] text-muted-foreground sm:text-[15px]">
            Las reseñas positivas en Google generan confianza, atraen nuevos clientes y
            mejoran tu posicionamiento local.
          </p>
        </Reveal>

        <Reveal delay={220} variant="scale">
          <GlassPanel className="mt-10">
            <ul className="stagger grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {REASONS.map((r, i) => (
                <li
                  key={r.title}
                  style={{ ["--i" as string]: i }}
                  className="flex items-start gap-3.5 text-left sm:flex-col sm:items-center sm:gap-3 sm:text-center"
                >
                  <span
                    className={`
                      inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full
                      shadow-[0_6px_16px_-6px_rgba(16,26,58,0.4)]
                      ${r.ring ? "bg-white ring-1 ring-black/[0.06]" : "text-white"}
                    `}
                    style={r.ring ? undefined : { background: r.gradient }}
                  >
                    {r.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[13.5px] font-bold leading-snug text-foreground">
                      {r.title}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-snug text-muted-foreground">{r.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}
