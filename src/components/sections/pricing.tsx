"use client";

import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function PricingTier({ tier }: { tier: (typeof siteConfig.pricing)[0] }) {
  return (
    <div
      className={cn(
        "outline-focus transition-transform-background relative z-10 border grid h-full w-full overflow-hidden text-foreground motion-reduce:transition-none"
      )}
    >
      <div className="flex flex-col h-full">
        <CardHeader className="border-b p-4 grid grid-rows-2 h-fit">
          <CardTitle className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {tier.name}
            </span>
            {tier.popular && (
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground hover:bg-secondary-foreground"
              >
                🔥 This is fire
              </Badge>
            )}
          </CardTitle>
          <div className="pt-2 text-3xl font-bold">
            <motion.div
              key={tier.price}
              initial={{
                opacity: 0,
                x: -10,
                filter: "blur(5px)",
              }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <span className="text-muted-foreground line-through text-lg mr-2">
                ${tier.anchor}
              </span>
              ${tier.price}
              <span className="text-sm font-medium text-muted-foreground">
                / lifetime
              </span>
            </motion.div>
          </div>
          <p className="text-[15px] font-medium text-muted-foreground">
            {tier.description}
          </p>
        </CardHeader>

        <CardContent className="flex-grow p-4 pt-5">
          <ul className="space-y-2">
            {tier.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center">
                <Check className="mr-2 size-4 text-green-500" />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <Button
          size="lg"
          className={cn(
            "w-full rounded-none shadow-none",
            tier.popular
              ? "bg-primary text-primary-foreground hover:bg-secondary-foreground"
              : "bg-muted text-foreground hover:bg-muted/80"
          )}
        >
          <Link href="/access">{tier.cta}</Link>
        </Button>
      </div>
    </div>
  );
}

export function Pricing() {
  return (
    <Section id="pricing" title="Pricing">
      <div className="border-b-0 grid grid-rows-1">
        <div className="grid grid-rows-1 gap-y-10 p-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-balance">
              Simple, transparent pricing.
            </h2>

            <p className="mt-6 text-balance text-muted-foreground flex items-center gap-2 text-center justify-center">
              Unlock the full potential of{" "}
              <Image
                src="/logo/logo_black.png"
                alt="GymBrah"
                width={100}
                height={100}
                className="size-6"
              />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4">
          {siteConfig.pricing.map((tier, index) => (
            <PricingTier key={index} tier={tier} />
          ))}
        </div>
      </div>
    </Section>
  );
}
