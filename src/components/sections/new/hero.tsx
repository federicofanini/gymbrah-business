"use client";

import Link from "next/link";
import OutlinedButton from "../../ui/outlined-button";
import { Check } from "lucide-react";

function Demo() {
  return (
    <div className="relative w-full mx-auto aspect-video sm:max-w-[400px] md:max-w-[500px] lg:max-w-[700px]">
      <video
        className="size-full overflow-hidden object-cover border border-primary border-t-2 border-b-2 rounded-t-[10px] rounded-b-[10px] shadow-lg"
        src={
          "https://fuchsia-eldest-koi-370.mypinata.cloud/ipfs/bafybeidpq35tzzurokqwm2wtivng2i7h4b27ohbupflyqawpjn7v2vvody"
        }
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}

export function Hero() {
  return (
    <div className="py-12 md:py-28 flex flex-col sm:flex-row gap-12 justify-between items-center mx-4 sm:mx-0">
      <div className="lg:max-w-lg space-y-8 w-full">
        <h1 className="text-4xl mb-8 font-mono text-balance font-bold">
          Build small habits to make a big difference.
        </h1>
        <span className="text-center justify-center mt-4">
          The best solution for{" "}
          <span className="font-semibold text-cyan-600">gyms</span> and{" "}
          <span className="font-semibold text-cyan-600">athletes 🏆</span>
        </span>
        <ul className="flex flex-col gap-2 text-muted-foreground max-w-lg mx-auto sm:text-lg sm:leading-normal text-balance">
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
              <span className="font-semibold text-primary">
                habits that last
              </span>
            </span>
          </li>
        </ul>
        <div className="flex items-center gap-8">
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
      </div>
      <Demo />
    </div>
  );
}
