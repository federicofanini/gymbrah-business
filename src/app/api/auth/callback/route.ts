"use server";

import { checkBusiness } from "@/actions/business/onboarding/check-business";
import { prisma } from "@/lib/db";
import { Cookies } from "@/utils/constants";
import { LogEvents } from "@/utils/events/events";
import { setupAnalytics } from "@/utils/events/server";
import { getSession } from "@/utils/supabase/database/cached-queries";
import { createClient } from "@/utils/supabase/server";
import { addYears } from "date-fns";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const returnTo = requestUrl.searchParams.get("return_to");
  const provider = requestUrl.searchParams.get("provider");

  if (provider) {
    cookieStore.set(Cookies.PreferredSignInProvider, provider, {
      expires: addYears(new Date(), 1),
    });
  }

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
          event: LogEvents.SignIn.name(session.user.user_metadata?.full_name),
          channel: LogEvents.SignIn.channel,
        });

        // Check if user has full_name in database
        const userData = await prisma.user.findUnique({
          where: { id: userId },
          select: { full_name: true },
        });

        let redirectPath = "/onboarding";
        if (userData?.full_name) {
          redirectPath = "/business";
        }

        return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);
      }

      if (returnTo) {
        return NextResponse.redirect(`${requestUrl.origin}/${returnTo}`);
      }
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`);
}
