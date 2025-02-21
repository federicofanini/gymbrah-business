"use server";

import { z } from "zod";
import { createSafeActionClient } from "next-safe-action";
import type { ActionResponse } from "@/actions/types/action-response";
import { prisma } from "@/lib/db";

const testerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.string().optional(),
});

const deleteTesterSchema = z.object({
  id: z.string(),
});

export type TesterFormData = z.infer<typeof testerSchema>;

// Renamed to match the import in the component file
export const addTesterAction = createSafeActionClient()
  .schema(testerSchema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const tester = await prisma.tester.create({
        data: {
          email: input.parsedInput.email,
          role: input.parsedInput.role || "athlete",
        },
      });
      return { success: true, data: tester };
    } catch (error) {
      return { success: false, error: "Failed to add tester" };
    }
  });

export const deleteTesterAction = createSafeActionClient()
  .schema(deleteTesterSchema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      await prisma.tester.delete({
        where: {
          id: input.parsedInput.id,
        },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to delete tester" };
    }
  });

export async function getTesters(): Promise<ActionResponse> {
  try {
    const testers = await prisma.tester.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return { success: true, data: testers };
  } catch (error) {
    return { success: false, error: "Failed to fetch testers" };
  }
}
