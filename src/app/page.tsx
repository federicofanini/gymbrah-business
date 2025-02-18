import { ConsentBanner } from "@/components/consent-banner";
import { GithubSignIn } from "@/components/github-sign-in";
import { GoogleSignIn } from "@/components/google-sign-in";
import { Cookies } from "@/utils/constants";
import { isEU } from "@/utils/location/location";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { userAgent } from "next/server";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Coach Login",
};

type SearchParams = {
  athlete_code?: string;
} & Promise<any>;
// Example URL: /login?athlete_code=ABC123
export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cookieStore = await cookies();
  const preferred = cookieStore.get(Cookies.PreferredSignInProvider);
  const showTrackingConsent =
    (await isEU()) && !cookieStore.has(Cookies.TrackingConsent);
  const { device } = userAgent({ headers: await headers() });
  const athleteCodeCookie = searchParams.athlete_code;

  let moreSignInOptions = null;
  let preferredSignInOption =
    device?.vendor === "Apple" ? (
      <div className="flex flex-col space-y-2">
        <GoogleSignIn />
        <GithubSignIn />{" "}
        {/* Temporarily replacing AppleSignIn since it's not implemented */}
      </div>
    ) : (
      <GoogleSignIn />
    );

  switch (preferred?.value) {
    case "github":
      preferredSignInOption = <GithubSignIn />;
      moreSignInOptions = (
        <>
          <GoogleSignIn />
        </>
      );
      break;

    case "google":
      preferredSignInOption = <GoogleSignIn />;
      moreSignInOptions = (
        <>
          <GithubSignIn />
        </>
      );
      break;

    default:
      <>
        <GithubSignIn />
        <GoogleSignIn />
      </>;
  }

  return (
    <div>
      <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
        <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
          <div className="flex w-full flex-col relative">
            <div className="text-xs text-muted-foreground text-center mt-2 mb-4">
              {athleteCodeCookie && (
                <p className="mb-2">
                  You&apos;ve been invited to join GymBrah. Please login to
                  continue.
                </p>
              )}
              {athleteCodeCookie && (
                <span className="inline-block px-2 py-1 bg-muted rounded-md">
                  Code: <strong>{athleteCodeCookie}</strong>
                </span>
              )}
            </div>
            <div className="pb-4 bg-gradient-to-r from-primary dark:via-primary dark:to-muted-foreground to-[#000] inline-block text-transparent bg-clip-text">
              <h1 className="font-medium pb-1 text-3xl">Login to GymBrah.</h1>
            </div>

            <p className="font-medium pb-1 text-2xl text-muted-foreground">
              Every achievement counts. <br />
              Track your fitness journey, <br />
              keep yourself accountable, <br />
              and stay motivated every step of the way.
            </p>

            <div className="pointer-events-auto mt-6 flex flex-col mb-6">
              {preferredSignInOption}

              <Accordion
                type="single"
                collapsible
                className="border-t-[1px] pt-2 mt-6"
              >
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="justify-center space-x-2 flex text-sm">
                    <span>More options</span>
                  </AccordionTrigger>
                  <AccordionContent className="mt-4">
                    <div className="flex flex-col space-y-4">
                      {moreSignInOptions}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <p className="text-xs text-muted-foreground">
              By clicking continue, you acknowledge that you have read and agree
              to GymBrah&apos;s{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {showTrackingConsent && <ConsentBanner />}
    </div>
  );
}
