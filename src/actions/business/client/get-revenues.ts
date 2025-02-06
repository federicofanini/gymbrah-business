"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../../types/action-response";
import { appErrors } from "../../types/errors";
import { prisma } from "@/lib/db";

// Schema for pagination parameters
const schema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const getRevenues = createSafeActionClient()
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
      const totalCount = await prisma.business_client_subscription.count({
        where: {
          business_id: business.id,
        },
      });

      // Fetch paginated revenues
      const revenues = await prisma.business_client_subscription.findMany({
        where: {
          business_id: business.id,
        },
        select: {
          id: true,
          client_id: true,
          sub_type: true,
          price: true,
          payment_date: true,
          renewal_date: true,
          created_at: true,
        },
        orderBy: {
          payment_date: "desc",
        },
        skip,
        take: input.parsedInput.limit,
      });

      return {
        success: true,
        data: {
          revenues,
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

export const getRevenueStats = createSafeActionClient().action(
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

      const business = await prisma.business.findFirst({
        where: { user_id: user.id },
      });

      if (!business) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Get current month's revenue
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const currentMonthRevenue =
        await prisma.business_client_subscription.aggregate({
          where: {
            business_id: business.id,
            payment_date: {
              gte: firstDayOfMonth,
              lte: lastDayOfMonth,
            },
          },
          _sum: {
            price: true,
          },
        });

      // Get previous month's revenue
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const previousMonthRevenue =
        await prisma.business_client_subscription.aggregate({
          where: {
            business_id: business.id,
            payment_date: {
              gte: firstDayOfLastMonth,
              lte: lastDayOfLastMonth,
            },
          },
          _sum: {
            price: true,
          },
        });

      // Calculate total revenue
      const totalRevenue = await prisma.business_client_subscription.aggregate({
        where: {
          business_id: business.id,
        },
        _sum: {
          price: true,
        },
      });

      // Calculate month-over-month percentage change
      const currentMonthTotal = currentMonthRevenue._sum.price || 0;
      const previousMonthTotal = previousMonthRevenue._sum.price || 0;
      const percentageChange =
        previousMonthTotal === 0
          ? 100
          : ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) *
            100;

      return {
        success: true,
        data: {
          totalRevenue: totalRevenue._sum.price || 0,
          currentMonthRevenue: currentMonthTotal,
          previousMonthRevenue: previousMonthTotal,
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
