"use server";

import { Cookies } from "@/utils/constants";
import { LogEvents } from "@/utils/events/events";
import { setupAnalytics } from "@/utils/events/server";
import { getSession } from "@/utils/supabase/cached-queries";
import { createClient } from "@/utils/supabase/server";
import { addYears } from "date-fns";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const provider = searchParams.get("provider");
  const returnTo = searchParams.get("return_to") ?? "/";

  console.log("returnTo", returnTo);

  if (provider) {
    cookieStore.set(Cookies.PreferredSignInProvider, provider, {
      expires: addYears(new Date(), 1),
    });
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { session },
      } = await getSession();

      if (session) {
        const userId = session.user.id;

        const analytics = await setupAnalytics({
          userId,
          fullName: session.user.user_metadata?.full_name,
        });

        await analytics.track({
          event: LogEvents.SignIn.name,
          channel: LogEvents.SignIn.channel,
        });

        // Check if user has full_name in database
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("full_name")
          .eq("id", userId)
          .single();

        const redirectPath =
          !userError && userData?.full_name ? "/dashboard" : "/onboarding";

        const forwardedHost = req.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${redirectPath}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(
            `https://${forwardedHost}${redirectPath}`
          );
        } else {
          return NextResponse.redirect(`${origin}${redirectPath}`);
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
