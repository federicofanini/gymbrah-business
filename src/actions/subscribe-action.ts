"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function subscribeAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      throw new Error("Email is required");
    }

    const supabase = await createClient();

    const { error } = await supabase.from("waitlist").insert([
      {
        id: uuidv4(),
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      throw error;
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error subscribing:", error);
    return { success: false, error: "Failed to subscribe" };
  }
}
