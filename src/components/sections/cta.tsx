import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import OutlinedButton from "../ui/outlined-button";

export function CTA() {
  return (
    <Section id="cta">
      <div className="border overflow-hidden relative text-center py-16 mx-auto">
        <p className="max-w-3xl text-foreground mb-6 text-balance mx-auto font-mono text-3xl">
          Ready to level up? Let&apos;s do this together.
        </p>

        <div className="flex justify-center">
          <OutlinedButton className="flex items-center gap-2">
            Get Started
          </OutlinedButton>
        </div>
      </div>
    </Section>
  );
}
