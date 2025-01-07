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
  armCircles: {
    name: "Arm Circles",
    muscles: [muscles.shoulders],
    outcomes: [outcomes.flexibility, outcomes.stability],
  },
  legSwings: {
    name: "Leg Swings",
    muscles: [muscles.legs],
    outcomes: [outcomes.flexibility, outcomes.stability],
  },
  hipCircles: {
    name: "Hip Circles",
    muscles: [muscles.core, muscles.glutes],
    outcomes: [outcomes.flexibility, outcomes.stability],
  },
  walkingLunges: {
    name: "Walking Lunges",
    muscles: [muscles.legs, muscles.glutes],
    outcomes: [outcomes.flexibility, outcomes.stability],
  },

  // Upper Body - Push Exercises
  benchPress: {
    name: "Bench Press",
    muscles: [muscles.chest, muscles.triceps, muscles.shoulders],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  inclineBenchPress: {
    name: "Incline Bench Press",
    muscles: [muscles.chest, muscles.triceps, muscles.shoulders],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  declineBenchPress: {
    name: "Decline Bench Press",
    muscles: [muscles.chest, muscles.triceps],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  pushUps: {
    name: "Push-ups",
    muscles: [muscles.chest, muscles.triceps, muscles.shoulders, muscles.core],
    outcomes: [outcomes.strength, outcomes.endurance],
  },
  diamondPushUps: {
    name: "Diamond Push-ups",
    muscles: [muscles.triceps, muscles.chest],
    outcomes: [outcomes.strength, outcomes.endurance],
  },
  militaryPress: {
    name: "Military Press",
    muscles: [muscles.shoulders, muscles.triceps],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  arnoldPress: {
    name: "Arnold Press",
    muscles: [muscles.shoulders],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  lateralRaises: {
    name: "Lateral Raises",
    muscles: [muscles.shoulders],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  frontRaises: {
    name: "Front Raises",
    muscles: [muscles.shoulders],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  tricepPushdowns: {
    name: "Tricep Pushdowns",
    muscles: [muscles.triceps],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },

  // Upper Body - Pull Exercises
  pullUps: {
    name: "Pull-ups",
    muscles: [muscles.lats, muscles.biceps, muscles.upperBack],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  chinUps: {
    name: "Chin-ups",
    muscles: [muscles.biceps, muscles.lats],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  bentOverRows: {
    name: "Bent Over Rows",
    muscles: [muscles.upperBack, muscles.lats, muscles.biceps],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  pendlayRows: {
    name: "Pendlay Rows",
    muscles: [muscles.upperBack, muscles.lats],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  latPulldowns: {
    name: "Lat Pulldowns",
    muscles: [muscles.lats, muscles.biceps],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  facePulls: {
    name: "Face Pulls",
    muscles: [muscles.upperBack, muscles.shoulders],
    outcomes: [outcomes.strength, outcomes.stability],
  },
  bicepCurls: {
    name: "Bicep Curls",
    muscles: [muscles.biceps],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  hammerCurls: {
    name: "Hammer Curls",
    muscles: [muscles.biceps],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },

  // Lower Body Exercises
  backSquats: {
    name: "Back Squats",
    muscles: [muscles.quads, muscles.glutes, muscles.hamstrings],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  frontSquats: {
    name: "Front Squats",
    muscles: [muscles.quads, muscles.core],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  romanianDeadlifts: {
    name: "Romanian Deadlifts",
    muscles: [muscles.hamstrings, muscles.glutes, muscles.lowerBack],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  conventionalDeadlifts: {
    name: "Conventional Deadlifts",
    muscles: [muscles.hamstrings, muscles.glutes, muscles.lowerBack],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  bulgarianSplitSquats: {
    name: "Bulgarian Split Squats",
    muscles: [muscles.quads, muscles.glutes],
    outcomes: [outcomes.strength, outcomes.balance],
  },
  legPress: {
    name: "Leg Press",
    muscles: [muscles.quads, muscles.glutes],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  calfRaises: {
    name: "Calf Raises",
    muscles: [muscles.calves],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },
  hipThrusts: {
    name: "Hip Thrusts",
    muscles: [muscles.glutes, muscles.hamstrings],
    outcomes: [outcomes.strength, outcomes.hypertrophy],
  },

  // Core Exercises
  planks: {
    name: "Planks",
    muscles: [muscles.core, muscles.abs],
    outcomes: [outcomes.stability, outcomes.endurance],
  },
  sidePlanks: {
    name: "Side Planks",
    muscles: [muscles.core, muscles.obliques],
    outcomes: [outcomes.stability, outcomes.endurance],
  },
  russianTwists: {
    name: "Russian Twists",
    muscles: [muscles.core, muscles.obliques],
    outcomes: [outcomes.stability, outcomes.balance],
  },
  hangingLegRaises: {
    name: "Hanging Leg Raises",
    muscles: [muscles.abs, muscles.core],
    outcomes: [outcomes.strength, outcomes.stability],
  },
  abWheelRollouts: {
    name: "Ab Wheel Rollouts",
    muscles: [muscles.core, muscles.abs],
    outcomes: [outcomes.strength, outcomes.stability],
  },
  dragonFlags: {
    name: "Dragon Flags",
    muscles: [muscles.core, muscles.abs],
    outcomes: [outcomes.strength, outcomes.stability],
  },
  woodChops: {
    name: "Wood Chops",
    muscles: [muscles.core, muscles.obliques],
    outcomes: [outcomes.strength, outcomes.stability],
  },
  paloffPress: {
    name: "Paloff Press",
    muscles: [muscles.core, muscles.obliques],
    outcomes: [outcomes.stability, outcomes.strength],
  },

  // Cardio Exercises
  running: {
    name: "Running",
    muscles: [muscles.cardio, muscles.legs],
    outcomes: [outcomes.cardiovascularHealth, outcomes.endurance],
  },
  cycling: {
    name: "Cycling",
    muscles: [muscles.cardio, muscles.legs],
    outcomes: [outcomes.cardiovascularHealth, outcomes.endurance],
  },
  rowing: {
    name: "Rowing",
    muscles: [muscles.cardio, muscles.fullBody],
    outcomes: [outcomes.cardiovascularHealth, outcomes.endurance],
  },
  jumpRope: {
    name: "Jump Rope",
    muscles: [muscles.cardio, muscles.calves],
    outcomes: [outcomes.agility, outcomes.endurance],
  },
  burpees: {
    name: "Burpees",
    muscles: [muscles.cardio, muscles.fullBody],
    outcomes: [outcomes.cardiovascularHealth, outcomes.endurance],
  },
  mountainClimbers: {
    name: "Mountain Climbers",
    muscles: [muscles.cardio, muscles.core],
    outcomes: [outcomes.cardiovascularHealth, outcomes.endurance],
  },

  // Flexibility & Mobility
  yogaSunSalutation: {
    name: "Yoga Sun Salutation",
    muscles: [muscles.fullBody],
    outcomes: [outcomes.flexibility, outcomes.stability],
  },
  downwardDog: {
    name: "Downward Dog",
    muscles: [muscles.fullBody],
    outcomes: [outcomes.flexibility, outcomes.stability],
  },
  catCowStretch: {
    name: "Cat-Cow Stretch",
    muscles: [muscles.core, muscles.lowerBack],
    outcomes: [outcomes.flexibility],
  },
  foamRolling: {
    name: "Foam Rolling",
    muscles: [muscles.fullBody],
    outcomes: [outcomes.flexibility],
  },
  thoracicBridges: {
    name: "Thoracic Bridges",
    muscles: [muscles.upperBack],
    outcomes: [outcomes.flexibility],
  },
};

// Workout structure
export const workoutStructure = [
  // Warm-Up Exercises
  {
    category: categories.warmUp,
    exercises: [exercises.jumpingJacks],
  },
  // Upper Body Exercises
  {
    category: categories.upperBody,
    exercises: [exercises.pushUps, exercises.benchPress],
  },
  // Lower Body Exercises
  {
    category: categories.lowerBody,
    exercises: [exercises.backSquats, exercises.frontSquats],
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
    exercises: [exercises.yogaSunSalutation],
  },
];
