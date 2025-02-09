"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../../types/action-response";
import { appErrors } from "../../types/errors";
import { prisma } from "@/lib/db";

export interface GetClientsResponse {
  id: string;
  athlete: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
  subscription?: {
    renewal_date: Date;
    sub_type: string;
  } | null;
}

// Schema for pagination parameters
const schema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const getClients = createSafeActionClient()
  .schema(schema)
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

      // Calculate pagination values
      const skip = (input.parsedInput.page - 1) * input.parsedInput.limit;

      // Get total count for pagination
      const totalCount = await prisma.client_athlete.count({
        where: {
          business_id: business.id,
        },
      });

      // First get all client_athletes
      const clientAthletes = await prisma.client_athlete.findMany({
        where: {
          business_id: business.id,
        },
        select: {
          id: true,
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: input.parsedInput.limit,
      });

      interface AthleteData {
        id: string;
        name: string;
        surname: string;
        email: string;
        phone: string;
        birth_date: Date;
        gender: string;
      }

      // Then get athlete details separately
      const athleteDetails = await Promise.all(
        clientAthletes.map(async (client) => {
          const athleteData = await prisma.$queryRaw<AthleteData[]>`
            SELECT a.id, a.name, a.surname, a.email, a.phone, a.birth_date, a.gender
            FROM athlete a
            JOIN client_athlete ca ON ca.athlete_id = a.id
            WHERE ca.id = ${client.id}
          `;
          return {
            clientId: client.id,
            athlete: athleteData[0],
          };
        })
      );

      // Get all subscriptions for these clients in a single query
      const subscriptions = await prisma.business_client_subscription.findMany({
        where: {
          business_id: business.id,
          client_athlete_id: {
            in: clientAthletes.map((client) => client.id),
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      // Create a map of client IDs to their latest subscription
      const subscriptionMap = subscriptions.reduce((acc, sub) => {
        if (!acc[sub.client_athlete_id]) {
          acc[sub.client_athlete_id] = sub;
        }
        return acc;
      }, {} as Record<string, (typeof subscriptions)[0]>);

      // Combine client data with their latest subscription
      const clientsWithSubscriptions = athleteDetails.map((client) => ({
        id: client.clientId,
        athlete: client.athlete,
        subscription: subscriptionMap[client.clientId] || null,
      }));

      return {
        success: true,
        data: {
          clients: clientsWithSubscriptions,
          pagination: {
            total: totalCount,
            pages: Math.ceil(totalCount / input.parsedInput.limit),
            currentPage: input.parsedInput.page,
            limit: input.parsedInput.limit,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });

export const getClientStats = createSafeActionClient().action(
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

      // Get business ID for the user
      const business = await prisma.business.findFirst({
        where: { user_id: user.id },
      });

      if (!business) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Get total clients
      const totalClients = await prisma.client_athlete.count({
        where: { business_id: business.id },
      });

      // Get clients created in the current month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const clientsThisMonth = await prisma.client_athlete.count({
        where: {
          business_id: business.id,
          created_at: {
            gte: firstDayOfMonth,
          },
        },
      });

      // Get clients created in the previous month
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const clientsLastMonth = await prisma.client_athlete.count({
        where: {
          business_id: business.id,
          created_at: {
            gte: firstDayOfLastMonth,
            lte: lastDayOfLastMonth,
          },
        },
      });

      // Calculate month-over-month percentage change
      const percentageChange =
        clientsLastMonth === 0
          ? 100 // If there were no clients last month, growth is 100%
          : ((clientsThisMonth - clientsLastMonth) / clientsLastMonth) * 100;

      return {
        success: true,
        data: {
          totalClients,
          clientsThisMonth,
          clientsLastMonth,
          percentageChange: Number(percentageChange.toFixed(1)),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);

interface ClientData {
  client_id: string;
  athlete_id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  birth_date: Date;
  gender: string;
}

export const getClientById = createSafeActionClient()
  .schema(
    z.object({
      clientId: z.string(),
    })
  )
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      // Get client and athlete data using raw query
      const clientData = await prisma.$queryRaw<ClientData[]>`
        SELECT 
          ca.id as client_id,
          a.id as athlete_id,
          a.name,
          a.surname,
          a.email,
          a.phone,
          a.birth_date,
          a.gender
        FROM client_athlete ca
        JOIN athlete a ON ca.athlete_id = a.id
        WHERE ca.id = ${parsedInput.clientId}
      `;

      if (!clientData || !clientData[0]) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      const client = clientData[0];

      // Fetch subscription information
      const subscription = await prisma.business_client_subscription.findFirst({
        where: {
          client_athlete_id: parsedInput.clientId,
        },
        select: {
          id: true,
          sub_type: true,
          payment_date: true,
          renewal_date: true,
          months_paid: true,
          created_at: true,
          updated_at: true,
        },
      });

      return {
        success: true,
        data: {
          id: client.client_id,
          athlete: {
            id: client.athlete_id,
            name: client.name,
            surname: client.surname,
            email: client.email,
            phone: client.phone,
            birth_date: client.birth_date,
            gender: client.gender,
          },
          subscription: subscription || null,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
