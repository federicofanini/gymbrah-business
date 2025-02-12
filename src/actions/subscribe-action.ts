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
        throw new Error("Failed to add contact to Resend audience");
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
    const response = await fetch(
      `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch subscriber count");
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        count: data.data.length,
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
