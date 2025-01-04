import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && data.user) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from("User")
          .select()
          .eq("id", data.user.id)
          .single();

        if (!existingUser) {
          const now = new Date().toISOString();
          // Create initial user record using Supabase
          const { error: insertError } = await supabase.from("User").insert([
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
            return redirect("/error");
          }
        }

        // redirect user to onboarding to complete profile
        return redirect("/onboarding");
      } catch (err) {
        console.error("Error creating user:", err);
        return redirect("/error");
      }
    }
  }

  // redirect the user to an error page with some instructions
  return redirect("/error");
}
