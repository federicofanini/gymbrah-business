import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (token_hash && type) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && data.user) {
      try {
        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
          .from("user")
          .select()
          .eq("email", data.user.email)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Error checking user:", checkError);
          return NextResponse.redirect(`${baseUrl}/error`);
        }

        // Skip if user already exists
        if (!existingUser) {
          const now = new Date().toISOString();
          // Create initial user record using Supabase
          const { error: insertError } = await supabase.from("user").insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: "", // Will be filled during onboarding
              created_at: now,
              updated_at: now,
            },
          ]);

          if (insertError) {
            console.error("Error creating user:", insertError);
            return NextResponse.redirect(`${baseUrl}/error`);
          }
        }

        // redirect user to onboarding to complete profile
        return NextResponse.redirect(`${baseUrl}/onboarding`);
      } catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.redirect(`${baseUrl}/error`);
      }
    }
  }

  // redirect the user to an error page with some instructions
  return NextResponse.redirect(`${baseUrl}/error`);
}
