import { AuroraText } from "@/components/aurora-text";
import { Section } from "@/components/section";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import OutlinedButton from "../ui/outlined-button";
import Image from "next/image";

function HeroPill() {
  return (
    <Link
      href="#"
      className="flex items-center space-x-2 border border-secondary rounded-full px-4 py-1"
    >
      <p className="text-xs font-mono text-primary">Introducing GymBrah</p>
      <svg
        width="12"
        height="12"
        className="ml-1"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
          fill="hsl(var(--primary))"
        />
      </svg>
    </Link>
  );
}

function HeroTitles() {
  return (
    <div className="flex w-full max-w-3xl flex-col overflow-hidden pt-8">
      <h1 className="text-left text-4xl font-semibold leading-tighter text-foreground sm:text-5xl md:text-6xl tracking-tighter">
        <span className="inline-block text-balance">
          <AuroraText className="leading-normal">
            {siteConfig.hero.title}
          </AuroraText>
        </span>
      </h1>
      <p className="text-left max-w-xl leading-normal text-muted-foreground sm:text-lg sm:leading-normal text-balance">
        {siteConfig.hero.description}
      </p>
    </div>
  );
}

function HeroCTA() {
  return (
    <div className="relative mt-6">
      <div className="flex w-full max-w-2xl flex-col items-start justify-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Link href="/login" className="text-sm text-secondary underline">
          <OutlinedButton>{siteConfig.hero.cta}</OutlinedButton>
        </Link>
      </div>
      <p className="mt-8 text-xs text-muted-foreground text-left font-mono">
        {siteConfig.hero.ctaDescription}
      </p>
    </div>
  );
}

export function Hero() {
  return (
    <Section id="hero">
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-x-8 w-full p-6 lg:p-12 border-x overflow-hidden">
        <div className="flex flex-col justify-start items-start lg:col-span-1">
          <HeroPill />
          <HeroTitles />
          <HeroCTA />
        </div>
        <div className="relative lg:col-span-1 hidden lg:flex items-end justify-end">
          <Image
            src="/hero.png"
            alt="Hero Image"
            width={500}
            height={500}
            className="h-[350px] w-auto object-cover"
          />
        </div>
      </div>
    </Section>
  );
}
