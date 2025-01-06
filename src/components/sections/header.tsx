"use client";

import { Icons } from "@/components/icons";
import { MobileDrawer } from "@/components/mobile-drawer";
import { buttonVariants } from "@/components/ui/button";
import { easeInOutCubic } from "@/lib/animation";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import OutlinedButton from "../ui/outlined-button";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 h-[var(--header-height)] z-50 p-0 bg-background/60 backdrop-blur mx-2">
      <div className="flex justify-between items-center container mx-auto p-2">
        <Link
          href="/"
          title="brand-logo"
          className="relative mr-6 flex items-center space-x-2"
        >
          <Image
            src="/logo.svg"
            alt="GymBrah"
            width={50}
            height={50}
            className="h-[40px] w-auto"
          />
        </Link>
        <div className="hidden lg:block">
          <Link href="/login" className="text-xs text-secondary underline">
            <OutlinedButton variant="secondary" className="text-xs h-6">
              {siteConfig.cta}
            </OutlinedButton>
          </Link>
        </div>
        <div className="mt-2 cursor-pointer block lg:hidden">
          <MobileDrawer />
        </div>
      </div>
      <hr className="absolute w-full bottom-0" />
    </header>
  );
}
