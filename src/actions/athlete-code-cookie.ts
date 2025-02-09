"use server";

import { Cookies } from "@/utils/constants";
import { addYears } from "date-fns";
import { cookies } from "next/headers";
import { actionClient } from "./safe-action";
import { z } from "zod";

const athleteCodeCookieSchema = z.object({
  athleteCode: z.string(),
});

export const athleteCodeCookieAction = actionClient
  .schema(athleteCodeCookieSchema)
  .action(async ({ parsedInput: value }) => {
    const cookieStore = await cookies();
    cookieStore.set({
      name: Cookies.AthleteCode,
      value: value.athleteCode,
      expires: addYears(new Date(), 1),
    });

    return value;
  });
