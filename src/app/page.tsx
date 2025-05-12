import { ConsentBanner } from "@/components/consent-banner";
import { GithubSignIn } from "@/components/github-sign-in";
import { GoogleSignIn } from "@/components/google-sign-in";
import { Cookies } from "@/utils/constants";
import { isEU } from "@/utils/location/location";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { userAgent } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { UnderConstruction } from "@/components/under-construction";
import { mode } from "@/lib/mode";
export const metadata: Metadata = {
  title: "Coach Login",
};

const BUILDING = mode.dev;

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/business");
  }

  const cookieStore = await cookies();
  const preferred = cookieStore.get(Cookies.PreferredSignInProvider);
  const showTrackingConsent =
    (await isEU()) && !cookieStore.has(Cookies.TrackingConsent);
  const { device } = userAgent({ headers: await headers() });

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
      {!BUILDING && (
        <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
          <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
            <div className="flex w-full flex-col relative">
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
                By clicking continue, you acknowledge that you have read and
                agree to GymBrah&apos;s{" "}
                <Link
                  href="https://gymbrah.com/terms"
                  className="underline"
                  target="_blank"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="https://gymbrah.com/privacy"
                  className="underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      )}
      {BUILDING && (
        <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background to-primary/5 p-6">
          <div className="relative z-20 w-full max-w-3xl">
            <UnderConstruction />
          </div>
        </div>
      )}
      {showTrackingConsent && <ConsentBanner />}
    </div>
  );
}
