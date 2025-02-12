import { CTA } from "@/components/sections/cta";
import { DemoVideo } from "@/components/sections/demo-video";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";

import { Pricing } from "@/components/sections/pricing";

// new components
import { Header } from "@/components/sections/new/header";
import { Hero } from "@/components/sections/new/hero";

export default function Home() {
  return (
    <main>
      <div className="space-y-16 max-w-screen-xl mx-auto">
        <Hero />
      </div>
      <Features />
      <DemoVideo />
      <Pricing />
      {/* <Testimonials />
      <Statistics /> */}
      <CTA />
      <Footer />
    </main>
  );
}
