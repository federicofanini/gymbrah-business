import { Section } from "@/components/section";
import OutlinedButton from "../ui/outlined-button";
import Link from "next/link";
import { getSubscriberCount } from "@/actions/subscribe-action";
import { Loader2 } from "lucide-react";

export async function CTA() {
  const subscriberCountResponse = await getSubscriberCount();
  const subscriberCount = subscriberCountResponse.success ? (
    subscriberCountResponse.data.count
  ) : (
    <Loader2 className="w-4 h-4 animate-spin" />
  );

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
              Join {subscriberCount} members
            </OutlinedButton>
          </Link>
        </div>
      </div>
    </Section>
  );
}
