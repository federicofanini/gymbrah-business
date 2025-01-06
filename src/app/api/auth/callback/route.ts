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
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const provider = requestUrl.searchParams.get("provider");

  // Get the base URL from the request origin
  const baseUrl = requestUrl.origin;

  if (provider) {
    cookieStore.set(Cookies.PreferredSignInProvider, provider, {
      expires: addYears(new Date(), 1),
    });
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

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
      const { data: userData, error } = await supabase
        .from("user")
        .select("full_name")
        .eq("id", userId)
        .single();

      if (!error && userData?.full_name) {
        return NextResponse.redirect(`${baseUrl}/dashboard`);
      }

      return NextResponse.redirect(`${baseUrl}/onboarding`);
    }
  }

  return NextResponse.redirect(baseUrl);
}
