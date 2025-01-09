import type { Client } from "../type";

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

export async function getUserAuthMetadata(supabase: Client) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("User not found");
  }

  const metadata = user.user_metadata;
  const provider = user.app_metadata.provider;

  // Get current user data
  const { data: userData } = await supabase
    .from("user")
    .select("avatar_url, full_name")
    .eq("id", user.id)
    .single();

  // Only update avatar and full name if not already set
  if (!userData?.avatar_url || !userData?.full_name) {
    await supabase
      .from("user")
      .update({
        avatar_url: metadata.avatar_url,
        full_name: metadata.full_name,
      })
      .eq("id", user.id);
  }

  // Map common fields between providers
  const userInfo = {
    avatar_url: metadata.avatar_url,
    full_name: metadata.full_name,
    email: metadata.email,
  };

  // Add provider-specific fields
  if (provider === "github") {
    return {
      ...userInfo,
      username: metadata.user_name,
      github: metadata.user_name,
      bio: metadata.bio,
      location: metadata.location,
      website: metadata.website,
    };
  }

  if (provider === "google") {
    return {
      ...userInfo,
      username: null,
      github: null,
      bio: null,
      location: null,
      website: null,
    };
  }

  return userInfo;
}
