import { Reveal } from "../reveal";
import { DropletIcon, PhoneIcon, ShieldIcon, SparkleStarIcon } from "../icons";
import { GlassPanel } from "../ui";

const ITEMS = [
  {
    icon: <ShieldIcon className="h-5 w-5" />,
    title: "Duradera y resistente",
    body: "Material premium de alta calidad.",
  },
  {
    icon: <DropletIcon className="h-5 w-5" />,
    title: "Resistente al agua",
    body: "Diseñada para durar en cualquier lugar.",
  },
  {
    icon: <PhoneIcon className="h-5 w-5" />,
    title: "Funciona con todos los teléfonos",
    body: "iPhone y Android.",
  },
  {
    icon: <SparkleStarIcon className="h-5 w-5" />,
    title: "Diseño profesional",
    body: "Personalizada con tu marca y estilo.",
  },
];

export function TrustFeatures() {
  return (
    <section className="px-5 py-6 sm:py-10" aria-label="Características de la tarjeta">
      <div className="mx-auto max-w-5xl">
        <Reveal variant="scale">
          <GlassPanel>
            <ul className="stagger grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {ITEMS.map((item, i) => (
                <li key={item.title} className="flex items-start gap-3" style={{ ["--i" as string]: i }}>
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[13px] font-bold leading-snug text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">
                      {item.body}
                    </p>
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
