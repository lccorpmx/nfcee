import { SmartImage } from "./smart-image";
import {
  FacebookGlyph,
  GoogleG,
  InstagramGlyph,
  QrMark,
  StarIcon,
  TapPhoneIllustration,
  ThumbUpIcon,
} from "./icons";

export type CardVariant = "google-click" | "google-thanks" | "instagram" | "facebook";

type ShmoCardProps = {
  variant: CardVariant;
  /**
   * Real product photo. When set it replaces the CSS recreation entirely —
   * this is the single swap point for the final card artwork.
   */
  imageSrc?: string;
  className?: string;
  /** Renders the little white easel base under the card */
  withStand?: boolean;
  priority?: boolean;
};

const LABEL: Record<CardVariant, string> = {
  "google-click": "Tarjeta tag azul para dejar una reseña en Google",
  "google-thanks": "Tarjeta tag negra para dejar una reseña en Google",
  instagram: "Tarjeta tag para seguir el negocio en Instagram",
  facebook: "Tarjeta tag para seguir el negocio en Facebook",
};

/** White wave that separates the coloured header from the card body. */
function WaveEdge({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 26"
      preserveAspectRatio="none"
      className={`absolute inset-x-0 bottom-0 h-[26px] w-full ${className}`}
      aria-hidden="true"
    >
      <path d="M0 14c34 12 62-10 100-6s58 18 100 6v12H0z" fill="#fff" />
    </svg>
  );
}

function CardShell({
  children,
  header,
  headerClass,
  headerStyle,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  headerClass?: string;
  headerStyle?: React.CSSProperties;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] bg-white">
      <div className={`relative pb-7 ${headerClass ?? ""}`} style={headerStyle}>
        {header}
        <WaveEdge />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-3 pb-4">{children}</div>
    </div>
  );
}

function TapAndScan() {
  return (
    <div className="flex w-full items-center justify-center gap-1.5">
      <TapPhoneIllustration className="h-auto w-[46%] max-w-[86px]" />
      <span className="font-display text-[11px] font-semibold text-slate-900">o</span>
      <div className="flex flex-col items-center gap-1">
        <QrMark className="h-auto w-[34px] rounded-[3px]" />
        <span className="font-display text-[6px] font-bold leading-tight tracking-wide text-slate-900">
          ESCANEA
          <br />
          EL CÓDIGO
        </span>
      </div>
    </div>
  );
}

export function ShmoCard({
  variant,
  imageSrc,
  className = "",
  withStand = true,
  priority = false,
}: ShmoCardProps) {
  /*
    The real artwork is square with transparent corners, while the CSS
    recreation is a 27:40 portrait plate. Cover-cropping a square into 27:40
    would slice the QR code off the side, and the white plate would show
    through the artwork's transparent corners — so the shell follows whichever
    is being rendered.
  */
  const hasArt = Boolean(imageSrc);

  return (
    <figure className={`group/card relative ${className}`}>
      {/* Card body — hover lift uses transform + shadow only, no layout shift */}
      <div
        className={`
          relative w-full overflow-hidden rounded-[18px]
          shadow-[0_18px_40px_-18px_rgba(16,26,58,0.4)]
          transition-[transform,box-shadow] duration-300 ease-out
          group-hover/card:-translate-y-2
          group-hover/card:shadow-[0_30px_60px_-22px_rgba(16,26,58,0.45)]
          motion-reduce:transform-none
          ${hasArt ? "aspect-square" : "aspect-[27/40] bg-white ring-1 ring-black/[0.04]"}
        `}
      >
        {imageSrc ? (
          <SmartImage
            src={imageSrc}
            alt={LABEL[variant]}
            fill
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 32vw, 260px"
            className="object-contain"
            priority={priority}
          />
        ) : (
          <>
            {variant === "google-click" && (
              <CardShell
                headerStyle={{ background: "linear-gradient(160deg,#2f7ef0 0%,#1560d8 100%)" }}
                header={
                  <p className="px-3 pt-4 text-center font-display text-[8.5px] font-bold uppercase leading-[1.45] tracking-[0.02em] text-white">
                    Clickeá &gt; NFC &gt; Reseña &gt;
                    <br />
                    Más Google
                  </p>
                }
              >
                <p
                  className="mb-1 font-display text-[11px] font-semibold italic text-slate-900"
                  style={{ transform: "rotate(-4deg)" }}
                >
                  Acerca tu teléfono
                </p>
                <TapPhoneIllustration className="h-auto w-[78%]" />
              </CardShell>
            )}

            {variant === "google-thanks" && (
              <CardShell
                headerStyle={{ background: "linear-gradient(160deg,#2f7ef0 0%,#1560d8 100%)" }}
                header={
                  <>
                    <div className="flex justify-center gap-[3px] pt-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} className="h-[11px] w-[11px] text-[#fbbc05]" />
                      ))}
                    </div>
                    <p className="px-2 pt-1.5 text-center font-display text-[9px] font-bold uppercase leading-[1.4] text-white">
                      ¡Agradecemos
                      <br />
                      tu reseña en Google!
                    </p>
                  </>
                }
              >
                <GoogleG className="mb-1 h-auto w-[26%] max-w-[42px]" />
                <TapPhoneIllustration className="h-auto w-[78%]" />
              </CardShell>
            )}

            {variant === "instagram" && (
              <CardShell
                headerClass="grad-ig"
                header={
                  <div className="flex flex-col items-center gap-1 pt-3.5">
                    <div className="flex items-center gap-1.5">
                      <InstagramGlyph className="h-[18px] w-[18px] text-white" />
                      <span className="font-display text-[15px] font-medium leading-none tracking-tight text-white">
                        Instagram
                      </span>
                    </div>
                    <span className="font-display text-[8px] font-semibold uppercase tracking-[0.16em] text-white/95">
                      Síguenos
                    </span>
                  </div>
                }
              >
                <TapAndScan />
              </CardShell>
            )}

            {variant === "facebook" && (
              <CardShell
                headerStyle={{ background: "linear-gradient(160deg,#2b8bfb 0%,#1877f2 100%)" }}
                header={
                  <div className="flex flex-col items-center gap-1 pt-3.5">
                    <div className="flex items-center gap-1.5">
                      <FacebookGlyph className="h-[19px] w-[19px] text-white" />
                      <span className="font-display text-[15px] font-semibold leading-none tracking-tight text-white">
                        facebook
                      </span>
                      <ThumbUpIcon className="h-[13px] w-[13px] text-white" />
                    </div>
                    <span className="font-display text-[8px] font-semibold uppercase tracking-[0.16em] text-white/95">
                      Síguenos
                    </span>
                  </div>
                }
              >
                <TapAndScan />
              </CardShell>
            )}
          </>
        )}
      </div>

      {/* Easel base */}
      {withStand && (
        <div
          className="
            mx-auto h-[9px] w-[62%] rounded-b-[4px] bg-white/95
            shadow-[0_10px_18px_-10px_rgba(16,26,58,0.5)]
            [clip-path:polygon(6%_0,94%_0,100%_100%,0_100%)]
          "
        />
      )}

      <figcaption className="sr-only">{LABEL[variant]}</figcaption>
    </figure>
  );
}
