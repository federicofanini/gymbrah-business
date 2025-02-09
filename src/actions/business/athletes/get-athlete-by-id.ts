"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { appErrors } from "@/actions/types/errors";
import { createClient } from "@/utils/supabase/server";

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export const getAthleteById = createSafeActionClient()
  .schema(
    z.object({
      athleteId: z.string(),
    })
  )
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      const clientAthlete = await prisma.client_athlete.findUnique({
        where: {
          id: parsedInput.athleteId,
        },
      });

      if (!clientAthlete) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      const athlete = await prisma.athlete.findUnique({
        where: {
          id: clientAthlete.athlete_id,
        },
        select: {
          id: true,
          name: true,
          surname: true,
          gender: true,
          birth_date: true,
        },
      });

      if (!athlete) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      const age = calculateAge(athlete.birth_date);
      const genderPrefix =
        athlete.gender === "male"
          ? "M"
          : athlete.gender === "female"
          ? "F"
          : "O";

      return {
        success: true,
        data: {
          id: clientAthlete.id,
          full_name: `${athlete.name} ${athlete.surname}`,
          goal: "Weight Loss", // Mock goal. Change using workout goal
          gender_age: `${genderPrefix} - ${age}y`,
          status: "Active", // Mock status. Change using workout status
        },
      };
    } catch (error) {
      console.error("Error fetching athlete:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
