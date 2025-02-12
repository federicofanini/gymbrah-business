import { CTA } from "@/components/sections/cta";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";

import { Header } from "@/components/sections/new/header";
import { Pricing } from "@/components/sections/pricing";

// new components
import { Hero } from "@/components/sections/new/hero";

export default function Home() {
  return (
    <main>
      <Header />

      <div className="space-y-16 max-w-screen-xl mx-auto">
        <Hero />
      </div>
      <Features />
      {/* <DemoVideo /> */}
      <Pricing />
      {/* <Testimonials />
      <Statistics /> */}
      <CTA />
      <Footer />
    </main>
  );
}
