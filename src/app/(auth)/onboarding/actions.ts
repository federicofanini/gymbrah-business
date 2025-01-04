"use server";

import { createClient } from "@/utils/supabase/server";

export async function createUserProfile(formData: { fullName: string }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error("No authenticated user found");
    }

    // First check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("user")
      .select()
      .eq("email", user.email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 means no rows returned
      console.error(fetchError);
      throw fetchError;
    }

    let profile;
    let updateError;

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from("user")
        .update({ full_name: formData.fullName })
        .eq("email", user.email)
        .select()
        .single();
      profile = data;
      updateError = error;
    } else {
      // Insert new user
      const { data, error } = await supabase
        .from("user")
        .insert([{ email: user.email, full_name: formData.fullName }])
        .select()
        .single();
      profile = data;
      updateError = error;
    }

    if (updateError) {
      console.error(updateError);
      throw updateError;
    }

    return { success: true, profile };
  } catch (error) {
    console.error("Error creating user profile:", error);
    return { success: false, error };
  }
}

export async function getUserFullName() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    const { data, error } = await supabase
      .from("user")
      .select("full_name")
      .eq("email", user.email)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }

    return data?.full_name || null;
  } catch (error) {
    console.error("Error getting user full name:", error);
    return null;
  }
}
