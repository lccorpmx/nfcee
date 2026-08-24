import { Backdrop } from "@/components/backdrop";
import { Hero } from "@/components/sections/hero";
import { CardShowcase } from "@/components/sections/card-showcase";
import { WhyItWorks } from "@/components/sections/why-it-works";
import { Pricing } from "@/components/sections/pricing";
import { TrustFeatures } from "@/components/sections/trust-features";
import { FinalCta, TrustFooter } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <div className="relative isolate w-full overflow-x-hidden">
      <Backdrop />
      <main className="relative w-full">
        <Hero />
        <CardShowcase />
        <WhyItWorks />
        <Pricing />
        <TrustFeatures />
        <FinalCta />
      </main>
      <TrustFooter />
    </div>
  );
}
