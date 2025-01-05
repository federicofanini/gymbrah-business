interface Exercise {
  category: string;
  exercises: string[];
}

export const workoutCategories: Exercise[] = [
  {
    category: "Upper Body",
    exercises: [
      "Push-ups",
      "Bench Press",
      "Dumbbell Chest Press",
      "Overhead Shoulder Press",
      "Lat Pulldown",
      "Pull-ups/Chin-ups",
      "Bicep Curls",
      "Tricep Dips",
      "Incline Dumbbell Press",
      "Rows (Barbell, Dumbbell, Cable)",
    ],
  },
  {
    category: "Lower Body",
    exercises: [
      "Squats (Bodyweight, Barbell, Dumbbell)",
      "Lunges (Bodyweight, Dumbbell, Barbell)",
      "Deadlifts (Conventional, Romanian)",
      "Leg Press",
      "Step-ups (Bodyweight, Dumbbell)",
      "Glute Bridges",
      "Hip Thrusts",
      "Calf Raises",
      "Bulgarian Split Squats",
    ],
  },
  {
    category: "Core",
    exercises: [
      "Planks (Front, Side)",
      "Crunches (Traditional, Bicycle)",
      "Leg Raises",
      "Russian Twists",
      "Mountain Climbers",
      "Flutter Kicks",
      "Hanging Leg Raises",
      "Ab Wheel Rollouts",
      "V-ups",
      "Flutter Kicks",
    ],
  },
  {
    category: "Cardio",
    exercises: [
      "Running (Treadmill or Outdoor)",
      "Jump Rope",
      "Cycling",
      "Rowing Machine",
      "Elliptical",
      "HIIT (High-Intensity Interval Training)",
      "Stair Climbing",
      "Sprints",
      "Boxing (Shadowboxing, Bag Work)",
      "Swimming",
    ],
  },
  {
    category: "Flexibility & Mobility",
    exercises: [
      "Dynamic Stretching",
      "Static Stretching",
      "Foam Rolling",
      "Yoga (Various Poses)",
      "Pilates",
      "Hip Openers",
      "Shoulder Mobility Drills",
      "Hamstring Stretch",
      "Quad Stretch",
      "Cat-Cow Stretch",
    ],
  },
  {
    category: "Functional & Full Body",
    exercises: [
      "Burpees",
      "Kettlebell Swings",
      "Clean & Jerk",
      "Snatch",
      "Thrusters",
      "Battle Ropes",
      "Medicine Ball Slams",
      "Sled Push/Pull",
      "Jump Squats",
      "Farmers Walk",
    ],
  },
];
