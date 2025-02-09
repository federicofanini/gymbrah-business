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

export const getAthletes = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
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

      // Get business for the current user
      const business = await prisma.business.findFirst({
        where: {
          user_id: user.id,
        },
      });

      if (!business) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // First get all client athletes
      const clientAthletes = await prisma.client_athlete.findMany({
        where: {
          business_id: business.id,
        },
      });

      // Then get the corresponding athletes
      const athletes = await prisma.athlete.findMany({
        where: {
          id: {
            in: clientAthletes.map((ca) => ca.athlete_id),
          },
        },
        select: {
          id: true,
          name: true,
          surname: true,
          gender: true,
          birth_date: true,
        },
      });

      const formattedAthletes = clientAthletes
        .map((clientAthlete) => {
          const athlete = athletes.find(
            (a) => a.id === clientAthlete.athlete_id
          );
          if (!athlete) return null;

          const age = calculateAge(athlete.birth_date);
          const genderPrefix =
            athlete.gender === "male"
              ? "M"
              : athlete.gender === "female"
              ? "F"
              : "O";

          return {
            id: clientAthlete.id,
            full_name: `${athlete.name} ${athlete.surname}`,
            goal: "Weight Loss", // Mock goal. Change using workout goal
            gender_age: `${genderPrefix} - ${age}y`,
            status: "Active", // Mock status. Change using workout status
          };
        })
        .filter(
          (athlete): athlete is NonNullable<typeof athlete> => athlete !== null
        );

      return {
        success: true,
        data: formattedAthletes,
      };
    } catch (error) {
      console.error("Error fetching athletes:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);
