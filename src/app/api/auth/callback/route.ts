"use server";

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
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const provider = searchParams.get("provider");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

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

        const redirectPath = userData?.full_name ? "/business" : "/onboarding";
        return NextResponse.redirect(`${baseUrl}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`);
}
