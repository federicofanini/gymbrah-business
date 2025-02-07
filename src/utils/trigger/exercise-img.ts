import { schedules } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/db";
import { EXERCISE_API_CONFIG } from "@/actions/exercises/config";

export const exerciseImgTask = schedules.task({
  id: "exercise-img-task",
  run: async () => {
    try {
      // Fetch data directly from the API
      const response = await fetch(
        `${EXERCISE_API_CONFIG.baseUrl}/exercises?limit=0`,
        {
          headers: EXERCISE_API_CONFIG.headers,
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const exercises = await response.json();

      // Process exercises in batches of 50
      const BATCH_SIZE = 50;
      for (let i = 0; i < exercises.length; i += BATCH_SIZE) {
        const batch = exercises.slice(i, i + BATCH_SIZE);

        await prisma.$transaction(
          batch.map((exercise: any) =>
            prisma.exercises.update({
              where: { id: exercise.id },
              data: {
                gif_url: exercise.gifUrl,
                updated_at: new Date(),
              },
            })
          )
        );

        // Log progress after each batch
        const totalStored = await prisma.exercises.count();
        console.info(
          `Processed batch ${
            i / BATCH_SIZE + 1
          }. Total exercises stored: ${totalStored}`
        );

        // Add delay between batches to prevent rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return {
        success: true,
        data: exercises,
      };
    } catch (error) {
      console.error("Error fetching exercises:", error);
      return {
        success: false,
        error: "Failed to fetch exercises",
      };
    }
  },
});
