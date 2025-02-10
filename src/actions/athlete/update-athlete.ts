"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { AppError, appErrors } from "../types/errors";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  birth_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Invalid gender selection" }),
  }),
  phone: z.string().min(1, "Phone number is required"),
});

export const updateAthlete = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      // First find the athlete by user_id
      const athlete = await prisma.athlete.findFirst({
        where: {
          user_id: user.id,
        },
      });

      if (!athlete) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Then update using the athlete's id
      const updatedAthlete = await prisma.athlete.update({
        where: {
          id: athlete.id,
        },
        data: {
          name: input.parsedInput.name,
          surname: input.parsedInput.surname,
          birth_date: new Date(input.parsedInput.birth_date),
          gender: input.parsedInput.gender,
          phone: input.parsedInput.phone,
        },
      });

      if (!updatedAthlete) {
        return {
          success: false,
          error: appErrors.DATABASE_ERROR,
        };
      }

      return {
        success: true,
        data: updatedAthlete,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.DATABASE_ERROR,
      };
    }
  });
