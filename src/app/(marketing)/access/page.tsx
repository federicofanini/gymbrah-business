"use client";

import { useEffect } from "react";
import { SubscribeInput } from "@/components/ui/subscribe-input";
import { Icons } from "@/components/icons";

export default function ComingSoon() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8 max-w-lg text-center p-8">
        <h2 className="text-3xl font-bold font-mono">Coming Soon</h2>
        <p className="text-muted-foreground text-lg">
          We&apos;re working hard to bring you the best gym tracking experience.
          Join our waitlist to get early access and exclusive updates.
        </p>

        <SubscribeInput />

        <p className="text-sm text-muted-foreground flex items-center gap-2">
          Want beta access? Reach out on{" "}
          <a
            href="https://twitter.com/FedericoFan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            <span className="flex items-center gap-2">
              <Icons.twitter className="size-3" /> @FedericoFan
            </span>
          </a>
        </p>
      </div>
    </div>
  );
}
