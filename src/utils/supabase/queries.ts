import type { Client } from "./type";

export async function getUserQuery(supabase: Client, userId: string) {
  return supabase
    .from("user")
    .select(
      `
      id,
      email,
      full_name,
      avatar_url,
      bio,
      location,
      website,
      twitter,
      linkedin, 
      github,
      instagram,
      youtube,
      tiktok,
      discord,
      telegram,
      bsky,
      contactEmail,
      username,
      paid,
      customer_id,
      plan_id,
      created_at,
      updated_at,
      health_profile (
        id,
        height,
        weight,
        sleep_hours,
        alcohol,
        sugar_intake,
        is_smoker,
        created_at,
        updated_at
      )
    `
    )
    .eq("id", userId)
    .single()
    .throwOnError();
}
