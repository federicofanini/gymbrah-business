import { Section } from "@/components/section";
import OutlinedButton from "../ui/outlined-button";
import Link from "next/link";

export async function CTA() {
  return (
    <Section id="cta">
      <div className="overflow-hidden relative text-center py-32 mx-auto">
        <p className="max-w-3xl text-foreground mb-6 text-balance mx-auto font-mono text-3xl">
          Ready to level up? Let&apos;s do this together.
        </p>

        <div className="flex justify-center">
          <Link href="/access">
            <OutlinedButton
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-secondary-foreground text-xl"
              variant="secondary"
            >
              Join 50+ members
            </OutlinedButton>
          </Link>
        </div>
      </div>
    </Section>
  );
}
