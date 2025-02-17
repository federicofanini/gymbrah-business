import Link from "next/link";
import OutlinedButton from "../../ui/outlined-button";
import { Check, Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { WordAnimation } from "./word-animation";
import AvatarCircles from "@/components/ui/avatar-circles";

export const avatars = [
  {
    imageUrl: "ff.jpg",
    profileUrl: "/federicofan",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/6417038",
    profileUrl: "/profile/2",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/383994",
    profileUrl: "/profile/3",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/1500684",
    profileUrl: "/profile/4",
  },
];

function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="mt-6 md:mt-10 max-w-[580px] text-primary leading-tight text-lg md:text-xl font-medium">
        Made for <WordAnimation />{" "}
      </div>
      <Carousel className="w-full mx-auto aspect-video sm:max-w-[400px] md:max-w-[500px] lg:max-w-[700px]">
        <CarouselContent>
          <CarouselItem>
            <video
              className="size-full overflow-hidden object-cover border border-primary border-t-2 border-b-2 rounded-t-[10px] rounded-b-[10px] shadow-lg"
              src="/video/demo-business.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </CarouselItem>
          <CarouselItem>
            <div className="size-full overflow-hidden object-cover border border-primary border-t-2 border-b-2 rounded-t-[10px] rounded-b-[10px] shadow-lg flex items-center justify-center">
              <span className="text-center text-muted-foreground">
                Athlete demo coming soon...
              </span>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export async function Hero({ subscriberCount }: { subscriberCount: number }) {
  return (
    <div className="py-12 md:py-28 flex flex-col sm:flex-row gap-12 justify-between items-center mx-4 sm:mx-0">
      <div className="lg:max-w-lg space-y-8 w-full">
        <h1 className="text-5xl mb-8 text-balance font-bold">
          Run your fitness business without{" "}
          <span className="relative inline-block">
            chaos
            <span className="absolute -bottom-1 left-0 w-full h-3 bg-red-400 -rotate-2 -z-10" />
          </span>
        </h1>
        <h2 className="text-primary font-medium">
          Simple workout tracking, client management, fitness blueprints, and
          nutrition tips. <br />
        </h2>

        <ul className="flex flex-col gap-2 text-muted-foreground max-w-lg mx-auto sm:text-lg sm:leading-normal text-balance">
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span>
              Saved <span className="font-semibold text-primary">20 hours</span>{" "}
              per week without switching apps
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span>
              A system built for{" "}
              <span className="font-semibold text-primary">
                fitness creators first
              </span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span>
              Bring{" "}
              <span className="font-semibold text-primary">
                organized power
              </span>{" "}
              to your fitness business
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span>
              Set up GymBrah in{" "}
              <span className="font-semibold text-primary">
                less than an hour
              </span>{" "}
            </span>
          </li>
        </ul>

        <div className="flex items-center gap-8">
          <div className="flex justify-center">
            <Link href="/access">
              <OutlinedButton
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xl"
                variant="secondary"
              >
                Join {subscriberCount} members
                <AvatarCircles avatarUrls={avatars} />
              </OutlinedButton>
            </Link>
          </div>
        </div>
      </div>
      <Demo />
    </div>
  );
}
