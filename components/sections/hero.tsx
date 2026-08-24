import { Reveal } from "../reveal";
import { BoltIcon, ClockIcon, SparkleStarIcon, StarIcon } from "../icons";
import { IconBadge, Pill } from "../ui";
import { NfcDemo } from "../nfc-demo";

const PERKS = [
  {
    icon: <BoltIcon className="h-6 w-6" />,
    gradient: "linear-gradient(150deg,#7c3aed 0%,#4f46e5 100%)",
    title: "Sin apps",
    body: "No necesitan descargar nada.",
  },
  {
    icon: <ClockIcon className="h-6 w-6" />,
    gradient: "linear-gradient(150deg,#3b82f6 0%,#1d4ed8 100%)",
    title: "En segundos",
    body: "Una reseña en menos de 10 segundos.",
  },
  {
    icon: <SparkleStarIcon className="h-6 w-6" />,
    gradient: "linear-gradient(150deg,#fbbf24 0%,#f59e0b 100%)",
    title: "Más visibilidad",
    body: "Mejores reseñas, mejor posicionamiento.",
  },
];

export function Hero() {
  return (
    <section className="px-5 pb-6 pt-14 sm:pt-20" aria-labelledby="hero-title">
      <div className="mx-auto max-w-6xl">
        {/*
          Mobile: copy, then the demo directly under the subtitle, then the perks.
          lg+: copy and demo sit side by side; the perks span the full width below.
        */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="text-center lg:text-left">
            <Reveal>
              <Pill icon={<StarIcon className="h-4 w-4 text-amber-brand" />}>
                Más reseñas. Más clientes.
              </Pill>
            </Reveal>

            <Reveal delay={90} variant="mask">
              <h1
                id="hero-title"
                className="
                  mt-7 font-display text-[2.15rem] font-extrabold leading-[1.12] tracking-[-0.028em]
                  text-foreground sm:text-5xl lg:text-[3.1rem] xl:text-[3.4rem]
                "
              >
                Convierte cada visita
                <br className="hidden sm:block" />{" "}
                <span className="sm:whitespace-nowrap">
                  en una <span className="text-grad-violet">reseña</span> de{" "}
                  <span className="text-amber-ink">5</span>
                </span>{" "}
                <span className="text-green-ink">estrellas.</span>
              </h1>
            </Reveal>

            <Reveal delay={170} variant="blur">
              <p className="mx-auto mt-5 max-w-[34rem] text-[15px] leading-[1.65] text-muted-foreground sm:text-base lg:mx-0">
                Con tag, tus clientes pueden dejarte una reseña de Google en segundos
                con solo acercar su teléfono.
              </p>
            </Reveal>
          </div>

          <Reveal delay={230} variant="scale">
            <NfcDemo />
          </Reveal>
        </div>

        <ul className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-3 lg:mt-14 lg:max-w-3xl">
          {PERKS.map((perk, i) => (
            <Reveal as="li" key={perk.title} delay={i * 90}>
              <div className="flex items-start gap-3 text-left sm:flex-col sm:items-center sm:gap-3 sm:text-center md:flex-row md:items-start md:text-left">
                <IconBadge gradient={perk.gradient}>{perk.icon}</IconBadge>
                <div className="min-w-0">
                  <p className="font-display text-[13.5px] font-bold text-foreground">{perk.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{perk.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
