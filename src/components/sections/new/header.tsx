"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { GithubStars } from "../github-stars";
import { LogoIcon } from "../../logo";
import OutlinedButton from "../../ui/outlined-button";
import Image from "next/image";

function SignInButton() {
  return (
    <Link href="/login" className="text-xs text-secondary underline">
      <OutlinedButton
        className="text-xs h-6 bg-primary text-white"
        variant="secondary"
      >
        Start now
      </OutlinedButton>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();

  const links = [
    { href: "#pricing", label: "Pricing" },
    {
      component: <SignInButton />,
      className:
        pathname.split("/").length === 2
          ? "text-primary"
          : "text-secondary hover:text-primary",
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between sm:mx-auto py-4 max-w-screen-xl mx-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo/logo_black.svg"
            alt="GymBrah"
            width={50}
            height={50}
            className="h-[40px] w-auto"
          />
          <span className="text-3xl font-extrabold font-mono">GymBrah</span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="https://github.com/federicofanini/gymbrah.com">
            <Suspense fallback={<GithubStars />}>
              <GithubStars />
            </Suspense>
          </Link>

          {links.map((link, i) =>
            link.component ? (
              <div
                key={i.toString()}
                className={cn(
                  "text-primary hover:text-primary transition-colors",
                  link.className
                )}
              >
                {link.component}
              </div>
            ) : (
              <Link
                href={link.href!}
                className={cn(
                  "text-primary hover:text-primary transition-colors hidden md:block",
                  link.className,
                  pathname?.endsWith(link.href) && "text-primary"
                )}
                key={link.href}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
