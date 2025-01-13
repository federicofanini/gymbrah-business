export const EXERCISE_API_CONFIG = {
  baseUrl: "https://exercisedb.p.rapidapi.com",
  headers: {
    "x-rapidapi-host": "exercisedb.p.rapidapi.com",
    "x-rapidapi-key": process.env.EXERCISE_DB_API_KEY!,
  },
} as const;
