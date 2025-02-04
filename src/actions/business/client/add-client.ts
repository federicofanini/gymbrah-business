"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../../types/action-response";
import { appErrors } from "../../types/errors";
import { prisma } from "@/lib/db";
import { addClientAthlete } from "./add-client-athlete";

const schema = z.object({
  name: z.string().min(2).max(50),
  surname: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  birthDate: z.string().transform((str) => new Date(str)),
  gender: z.enum(["male", "female", "other"]),
});

export const addClient = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error:", authError);
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      // Get business ID for the current user
      const business = await prisma.business.findFirst({
        where: {
          user_id: user.id,
        },
      });

      if (!business) {
        console.error("Business not found for user:", user.id);
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      const client = await prisma.client.create({
        data: {
          id: crypto.randomUUID(),
          business_id: business.id,
          name: input.parsedInput.name,
          surname: input.parsedInput.surname,
          email: input.parsedInput.email,
          phone: input.parsedInput.phone,
          birth_date: input.parsedInput.birthDate,
          gender: input.parsedInput.gender,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Add client athlete record
      const clientAthleteResult = await addClientAthlete({
        clientId: client.id,
        businessId: business.id,
      });

      if (!clientAthleteResult?.data?.success) {
        console.error(
          "Failed to create client athlete:",
          clientAthleteResult?.data?.error
        );
        return {
          success: false,
          error: appErrors.UNEXPECTED_ERROR,
        };
      }

      return {
        success: true,
        data: client,
      };
    } catch (error) {
      console.error("Unexpected error in addClient:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
