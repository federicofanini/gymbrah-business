// Define muscle groups
export const muscles = {
  chest: "Chest",
  triceps: "Triceps",
  shoulders: "Shoulders",
  lats: "Lats",
  biceps: "Biceps",
  upperBack: "Upper Back",
  core: "Core",
  quads: "Quads",
  glutes: "Glutes",
  hamstrings: "Hamstrings",
  calves: "Calves",
  lowerBack: "Lower Back",
  fullBody: "Full Body",
  abs: "Abs",
  obliques: "Obliques",
  cardio: "Cardio",
  legs: "Legs",
};

// Define outcomes
export const outcomes = {
  strength: "Strength",
  hypertrophy: "Hypertrophy",
  endurance: "Endurance",
  stability: "Stability",
  balance: "Balance",
  flexibility: "Flexibility",
  agility: "Agility",
  cardiovascularHealth: "Cardiovascular Health",
  fatLoss: "Fat Loss",
};

// Define categories
export const categories = {
  warmUp: "Warm-Up",
  upperBody: "Upper Body",
  lowerBody: "Lower Body",
  core: "Core",
  cardio: "Cardio",
  flexibilityMobility: "Flexibility & Mobility",
  functionalFullBody: "Functional & Full Body",
  coolDown: "Cool-Down",
};



// Define exercises
export const exercises = {
  // Warm-Up Exercises
  jumpingJacks: {
    name: "Jumping Jacks",
    muscles: [muscles.cardio, muscles.fullBody],
    outcomes: [outcomes.agility, outcomes.endurance],
  },
  dynamicStretching: {
    name: "Dynamic Stretching",
    muscles: [muscles.fullBody],
    outcomes: [outcomes.flexibility, outcomes.stability],
  },
  lightJogging: {
    name: "Light Jogging",
    muscles: [muscles.legs, muscles.cardio],
    outcomes: [outcomes.cardiovascularHealth, outcomes.endurance],
  },

  // Upper Body Exercises
  pushUps: {
    name: "Push-ups",
    muscles: [muscles.chest, muscles.triceps, muscles.shoulders, muscles.core],
    outcomes: [outcomes.strength, outcomes.endurance],
  },
  benchPress: {
    name: "Bench Press",
    muscles: [muscles.chest, muscles.triceps, muscles.shoulders],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },

  // Lower Body Exercises
  squats: {
    name: "Squats (Bodyweight, Barbell, Dumbbell)",
    muscles: [muscles.quads, muscles.glutes, muscles.hamstrings, muscles.core],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  lunges: {
    name: "Lunges (Bodyweight, Dumbbell, Barbell)",
    muscles: [muscles.quads, muscles.glutes, muscles.hamstrings],
    outcomes: [outcomes.balance, outcomes.hypertrophy],
  },

  // Core Exercises
  planks: {
    name: "Planks",
    muscles: [muscles.core],
    outcomes: [outcomes.stability, outcomes.endurance],
  },
  russianTwists: {
    name: "Russian Twists",
    muscles: [muscles.core, muscles.obliques],
    outcomes: [outcomes.stability, outcomes.balance],
  },

  // Cardio Exercises
  running: {
    name: "Running",
    muscles: [muscles.cardio, muscles.legs],
    outcomes: [outcomes.cardiovascularHealth, outcomes.endurance],
  },
  jumpRope: {
    name: "Jump Rope",
    muscles: [muscles.cardio, muscles.fullBody],
    outcomes: [outcomes.agility, outcomes.fatLoss],
  },

  // Cool-Down Exercises
  staticStretching: {
    name: "Static Stretching",
    muscles: [muscles.fullBody],
    outcomes: [outcomes.flexibility],
  },
  foamRolling: {
    name: "Foam Rolling",
    muscles: [muscles.fullBody],
    outcomes: [outcomes.flexibility],
  },
  deepBreathing: {
    name: "Deep Breathing",
    muscles: [muscles.fullBody],
    outcomes: [outcomes.flexibility],
  },
};

// Workout structure
export const workoutStructure = [
  // Warm-Up Exercises
  {
    category: categories.warmUp,
    exercises: [
      exercises.jumpingJacks,
      exercises.dynamicStretching,
      exercises.lightJogging,
    ],
  },
  // Upper Body Exercises
  {
    category: categories.upperBody,
    exercises: [exercises.pushUps, exercises.benchPress],
  },
  // Lower Body Exercises
  {
    category: categories.lowerBody,
    exercises: [exercises.squats, exercises.lunges],
  },
  // Core Exercises
  {
    category: categories.core,
    exercises: [exercises.planks, exercises.russianTwists],
  },
  // Cardio Exercises
  {
    category: categories.cardio,
    exercises: [exercises.running, exercises.jumpRope],
  },
  // Cool-Down Exercises
  {
    category: categories.coolDown,
    exercises: [
      exercises.staticStretching,
      exercises.foamRolling,
      exercises.deepBreathing,
    ],
  },
];
