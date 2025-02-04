"use server";

import { unstable_cache } from "next/cache";
import { getClients } from "./get-clients";

export const getCachedClients = async (
  page: number,
  limit: number
): Promise<any> => {
  return unstable_cache(
    async () => {
      return getClients({ page, limit });
    },
    [`clients-page-${page}-limit-${limit}`],
    { revalidate: 1800 } // 30 minutes in seconds
  )();
};
