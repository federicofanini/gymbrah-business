"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/actions/types/action-response";
import { appErrors } from "@/actions/types/errors";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
});

export const subscribeAction = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      // Check if email already exists
      const existingSubscriber = await prisma.waitlist.findFirst({
        where: {
          email: input.parsedInput.email,
        },
      });

      if (existingSubscriber) {
        return {
          success: false,
          error: "This email is already subscribed",
        };
      }

      // Create waitlist entry in database
      const waitlistEntry = await prisma.waitlist.create({
        data: {
          id: crypto.randomUUID(),
          email: input.parsedInput.email,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Add to Resend audience
      try {
        const resendResponse = await fetch(
          `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: input.parsedInput.email,
              first_name: "",
              last_name: "",
              unsubscribed: false,
            }),
          }
        );

        if (!resendResponse.ok) {
          console.error(
            "Failed to add contact to Resend audience, continuing anyway"
          );
        }
      } catch (resendError) {
        console.error("Resend API error:", resendError);
        // Continue execution even if Resend fails
      }

      revalidatePath("/");

      return {
        success: true,
        data: waitlistEntry,
      };
    } catch (error) {
      console.error("Subscribe error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });

export async function getSubscriberCount(): Promise<ActionResponse> {
  try {
    // Get count directly from database instead of Resend
    const count = await prisma.waitlist.count();

    return {
      success: true,
      data: {
        count,
      },
    };
  } catch (error) {
    console.error("Error fetching subscriber count:", error);
    return {
      success: false,
      error: appErrors.UNEXPECTED_ERROR,
    };
  }
}
