import { Reveal } from "../reveal";
import { CartIcon, ShieldIcon } from "../icons";
import { NfceeCard } from "../nfcee-card";
import { CARD_ART } from "../card-art";

export function FinalCta() {
  return (
    <section id="comprar" className="px-5 pb-4 pt-12 sm:pt-16" aria-labelledby="cta-title">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:gap-8">
        {/* Fanned card trio */}
        <Reveal variant="scale" className="order-2 md:order-1">
          <div className="anim-float mx-auto flex max-w-[300px] items-end justify-center gap-2 sm:max-w-[340px]">
            <NfceeCard
              variant="google-thanks"
              imageSrc={CARD_ART["google-thanks"]}
              withStand={false}
              className="w-1/3 -rotate-[7deg]"
            />
            <NfceeCard
              variant="instagram"
              imageSrc={CARD_ART["instagram"]}
              withStand={false}
              className="w-1/3 -translate-y-3"
            />
            <NfceeCard
              variant="facebook"
              imageSrc={CARD_ART["facebook"]}
              withStand={false}
              className="w-1/3 rotate-[7deg]"
            />
          </div>
        </Reveal>

        {/* Copy + primary CTA */}
        <div className="order-1 text-center md:order-2 md:text-left">
          <Reveal variant="mask">
            <h2
              id="cta-title"
              className="font-display text-[1.75rem] font-extrabold tracking-[-0.028em] text-foreground sm:text-[2.35rem]"
            >
              Impulsa tu negocio hoy.
            </h2>
          </Reveal>
          <Reveal delay={80} variant="blur">
            <p className="mt-2 text-[15px] text-muted-foreground sm:text-base">
              Pequeña tarjeta. Gran impacto.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <a
              href="#comprar"
              className="
                anim-glow grad-cta anim-pan mt-7 inline-flex min-h-[58px] w-full max-w-[380px]
                cursor-pointer items-center justify-center gap-3 rounded-full px-8
                font-display text-[16px] font-semibold text-white
                transition-transform duration-200 ease-out
                hover:scale-[1.02] active:scale-[0.98]
                motion-reduce:transform-none sm:text-[17px]
              "
            >
              <CartIcon className="h-5 w-5" />
              Quiero mis tags
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function TrustFooter() {
  return (
    <footer className="px-5 pb-14 pt-10">
      <Reveal>
        <p className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-center text-[12.5px] font-medium text-muted-foreground">
          <ShieldIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span>Compra 100% segura</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Envíos a todo México</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Garantía de satisfacción</span>
        </p>
      </Reveal>
    </footer>
  );
}
