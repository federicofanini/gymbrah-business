import { CTA } from "@/components/sections/cta";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";

import { Header } from "@/components/sections/new/header";
import { Pricing } from "@/components/sections/pricing";

// new components
import { Hero } from "@/components/sections/new/hero";
import { ServicesBusiness } from "@/components/sections/new/services-business";
import { ServicesAthletes } from "@/components/sections/new/services-athletes";
import { Community } from "@/components/sections/new/community";

export const revalidate = 3600; // revalidate every hour

export default function Home() {
  return (
    <main>
      <Header />

      <div className="space-y-16 max-w-screen-xl mx-auto">
        <Hero />
        <Features />
        <ServicesBusiness />
        <ServicesAthletes />
        {/* <DemoVideo /> */}
        <Pricing />
        <Community />
        {/* <Testimonials />
      <Statistics /> */}
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
