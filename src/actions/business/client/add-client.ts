"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { appErrors } from "@/actions/types/errors";
import { generateCode } from "@/lib/user-code";
import { createClient } from "@/utils/supabase/server";
import { getBusinessCode } from "../onboarding/get-business-code";
import { sendWelcomeAthleteEmail } from "@/components/private/b2b/email/welcome-athlete";

// onboarding steps to add athlete

// 1. check if athlete already exists by email or athlete code
// 2. if not, create athlete by adding athlete in table athlete (create athlete code + user_id NULL)
// 3. create client_athlete in table client_athlete (business_id, athlete_id)
// 4. create subscription in table business_client_subscription (client_athlete_id, business_id)

const checkAthleteSchema = z
  .object({
    email: z.string().email().optional(),
    athleteCode: z.string().optional(),
  })
  .refine((data) => data.email || data.athleteCode, {
    message: "Either email or athlete code must be provided",
  });

/**
 * Checks if an athlete exists in the system by email or athlete code
 * @param input - Object containing either email or athleteCode
 * @returns ActionResponse with exists boolean and athlete data if found
 */
export const checkAthleteExists = createSafeActionClient()
  .schema(checkAthleteSchema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const athlete = await prisma.athlete.findFirst({
        where: {
          OR: [
            ...(input.parsedInput.email
              ? [{ email: input.parsedInput.email }]
              : []),
            ...(input.parsedInput.athleteCode
              ? [{ athlete_code: input.parsedInput.athleteCode }]
              : []),
          ],
        },
        select: {
          id: true,
          email: true,
          athlete_code: true,
          name: true,
          surname: true,
        },
      });

      return {
        success: true,
        data: {
          exists: !!athlete,
          athlete: athlete || null,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });

const createAthleteSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  surname: z.string(),
  birthDate: z.string().transform((str) => new Date(str)),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().optional(),
});

/**
 * Creates a new athlete in the system
 * @param input - Athlete details including email, name, surname, birthDate, gender and optional phone
 * @returns ActionResponse with created athlete data
 */
export const createAthlete = createSafeActionClient()
  .schema(createAthleteSchema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      // Check if athlete with email already exists
      const existingAthlete = await prisma.athlete.findFirst({
        where: {
          email: input.parsedInput.email,
        },
      });

      if (existingAthlete) {
        return {
          success: false,
          error: "Athlete don't exists",
        };
      }

      // Generate unique athlete code using the imported function
      let athleteCode = generateCode();
      let isUnique = false;

      while (!isUnique) {
        const existing = await prisma.athlete.findFirst({
          where: { athlete_code: athleteCode },
        });
        if (!existing) {
          isUnique = true;
        } else {
          athleteCode = generateCode();
        }
      }

      // Get business code
      const businessCodeResponse = await getBusinessCode();
      if (!businessCodeResponse?.data?.success) {
        return {
          success: false,
          error: businessCodeResponse?.data?.error,
        };
      }

      // Create the athlete
      const athlete = await prisma.athlete.create({
        data: {
          email: input.parsedInput.email,
          name: input.parsedInput.name,
          surname: input.parsedInput.surname,
          birth_date: input.parsedInput.birthDate,
          gender: input.parsedInput.gender,
          phone: input.parsedInput.phone,
          athlete_code: athleteCode,
          user_id: null,
          invited_by: businessCodeResponse.data.data.code,
        },
      });

      // Send welcome email to the new athlete
      const emailResult = await sendWelcomeAthleteEmail({
        athleteEmail: athlete.email || "",
        athleteName: athlete.name,
        athleteCode: athlete.athlete_code,
      });

      if (!emailResult.success) {
        console.error("Failed to send welcome email");
      }

      return {
        success: true,
        data: {
          id: athlete.id,
          email: athlete.email,
          name: athlete.name,
          surname: athlete.surname,
          athleteCode: athlete.athlete_code,
        },
      };
    } catch (error) {
      console.error("Error creating athlete:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });

/**
 * Associates an athlete with a business as a client
 * @param input - Object containing athleteId to associate
 * @returns ActionResponse with created client_athlete association
 */
export const associateClientAthlete = createSafeActionClient()
  .schema(
    z.object({
      athleteId: z.string(),
    })
  )
  .action(async (input): Promise<ActionResponse> => {
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

      // Get business ID for the current user
      const business = await prisma.business.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
        },
      });

      if (!business) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Check if athlete is already associated with this business
      const existingAssociation = await prisma.client_athlete.findFirst({
        where: {
          athlete_id: input.parsedInput.athleteId,
          business_id: business.id,
        },
      });

      if (existingAssociation) {
        return {
          success: false,
          error: "Athlete is already associated with this business",
        };
      }

      // Create client athlete association
      const clientAthlete = await prisma.client_athlete.create({
        data: {
          athlete_id: input.parsedInput.athleteId,
          business_id: business.id,
        },
      });

      return {
        success: true,
        data: clientAthlete,
      };
    } catch (error) {
      console.error("Error associating client athlete:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });

const createSubscriptionSchema = z.object({
  clientAthleteId: z.string(),
  subType: z.string(),
  price: z.number(),
  paymentDate: z.date(),
  renewalDate: z.date(),
  monthsPaid: z.string(),
});

/**
 * Creates a subscription for a client athlete
 * @param input - Subscription details including clientAthleteId, subType, price, paymentDate, renewalDate and monthsPaid
 * @returns ActionResponse with created subscription data
 */
export const createClientSubscription = createSafeActionClient()
  .schema(createSubscriptionSchema)
  .action(async (input): Promise<ActionResponse> => {
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

      // Get business ID for the current user
      const business = await prisma.business.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
        },
      });

      if (!business) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Create subscription
      const subscription = await prisma.business_client_subscription.create({
        data: {
          client_athlete_id: input.parsedInput.clientAthleteId,
          business_id: business.id,
          sub_type: input.parsedInput.subType,
          price: input.parsedInput.price,
          payment_date: input.parsedInput.paymentDate,
          renewal_date: input.parsedInput.renewalDate,
          months_paid: input.parsedInput.monthsPaid,
        },
      });

      return {
        success: true,
        data: subscription,
      };
    } catch (error) {
      console.error("Error creating client subscription:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
