"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";
import { appErrors } from "@/actions/types/errors";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email(),
});

export const subscribeAction = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      await resend.contacts.create({
        email: input.parsedInput.email,
        audienceId: process.env.RESEND_AUDIENCE_ID as string,
        firstName: "",
        lastName: "",
        unsubscribed: false,
      });

      return {
        success: true,
        data: { email: input.parsedInput.email },
      };
    } catch (error: any) {
      console.error("Subscribe error:", error);

      if (error.statusCode === 409) {
        return {
          success: false,
          error: "This email is already subscribed",
        };
      }

      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
