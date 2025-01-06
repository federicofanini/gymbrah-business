import { client as RedisClient } from "@/utils/kv/client";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";

const ratelimit = new Ratelimit({
  redis: RedisClient,
  limiter: Ratelimit.slidingWindow(10, "10s"),
  analytics: true,
  prefix: "api",
});

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  handleReturnedServerError: (e: any) => {
    if (e instanceof Error) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  middleware: [
    async () => {
      const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await ratelimit.limit(ip);

      if (!success) {
        throw new Error("Too many requests. Please try again later.");
      }
    },
  ],
});
