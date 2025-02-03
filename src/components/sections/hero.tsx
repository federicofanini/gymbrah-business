import { AuroraText } from "@/components/aurora-text";
import { Section } from "@/components/section";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import OutlinedButton from "../ui/outlined-button";
import AvatarCircles from "../ui/avatar-circles";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { Check, GoalIcon, TargetIcon } from "lucide-react";
import { Ripple } from "../ui/ripple";
import FlickeringGrid from "../ui/flickering-grid";
import Image from "next/image";
import { getUserCount } from "@/actions/user-count";

const getAvatarUrls = unstable_cache(
  async () => {
    const users = await prisma.user.findMany({
      select: {
        avatar_url: true,
      },
      where: {
        avatar_url: {
          not: null,
        },
      },
      take: 10,
      orderBy: {
        created_at: "desc",
      },
    });

    return users.map((user) => ({
      imageUrl: user.avatar_url as string,
      profileUrl: "#", // Added profileUrl to match Avatar type
    }));
  },
  ["avatar-urls"],
  { revalidate: 3600 * 3 } // Cache for 3 hours
);

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
    <div className="flex w-full flex-col overflow-hidden pt-8 text-center">
      <h1 className="text-center text-4xl font-semibold leading-tighter text-foreground sm:text-7xl tracking-tighter mb-8">
        <span className="inline-block text-balance">
          <AuroraText className="leading-normal">
            Build small habits to make a big difference.
          </AuroraText>
        </span>
      </h1>
      <ul className="flex flex-col gap-2 text-muted-foreground max-w-lg mx-auto sm:text-lg sm:leading-normal text-balance">
        <li className="flex items-center gap-2 text-primary">
          <TargetIcon className="h-5 w-5 text-red-500 animate-pulse" />
          <span>
            The best solution for{" "}
            <span className="font-semibold text-red-500">
              gyms and athletes 🏆
            </span>
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <span>
            Every{" "}
            <span className="font-semibold text-primary">
              achievement counts
            </span>
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <span>
            Keep yourself{" "}
            <span className="font-semibold text-primary">accountable</span>
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <span>
            Stay <span className="font-semibold text-primary">motivated</span>{" "}
            every step of the way
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <span>
            Build{" "}
            <span className="font-semibold text-primary">habits that last</span>
          </span>
        </li>
      </ul>
    </div>
  );
}

async function HeroCTA() {
  const response = await getUserCount();
  const count = response?.data?.data;

  return (
    <div className="relative mt-6">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center space-y-4 sm:flex-row  sm:space-y-0">
        <Link href="/login" className="text-sm text-secondary underline">
          <OutlinedButton variant="secondary" className="bg-primary text-white">
            Join <span className="font-semibold text-white">{count}+</span>{" "}
            members
          </OutlinedButton>
        </Link>
      </div>
    </div>
  );
}

async function Avatars() {
  const avatarUrls = await getAvatarUrls();
  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <AvatarCircles numPeople={10} avatarUrls={avatarUrls} />
      <p className="mt-4 text-xs text-muted-foreground text-center font-mono">
        <span className="font-semibold text-primary">Free </span>during beta.
      </p>
    </div>
  );
}

const AppScreenshot = () => {
  return (
    <div className="relative mt-8 w-full max-w-[1200px] mx-auto">
      <div className="relative w-full aspect-[16/9] md:aspect-[2/1] overflow-hidden border">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src="/dashboard.png"
              alt="GymBrah Dashboard Demo"
              fill
              className="object-cover object-center rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
              quality={90}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export async function Hero() {
  return (
    <Section id="hero">
      <div className="relative w-full p-6 border-x overflow-hidden flex justify-center items-center">
        <div className="flex flex-col justify-center items-center max-w-4xl mx-auto">
          <HeroTitles />
          <HeroCTA />
          <Avatars />
          <AppScreenshot />
        </div>
      </div>
    </Section>
  );
}
