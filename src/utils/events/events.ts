export const LogEvents = {
  // Authentication Events
  SignIn: {
    name: "🔑 Sign In",
    channel: "auth",
  },
  SignOut: {
    name: "👋 Sign Out",
    channel: "auth",
  },
  Registered: {
    name: "✨ New User",
    channel: "auth",
  },
  MfaVerify: {
    name: "🔒 MFA",
    channel: "auth",
  },

  // Profile Events
  UpdateProfile: {
    name: "👤 Edit Profile",
    channel: "profile",
  },
  UpdateHealthProfile: {
    name: "💪 Edit Health",
    channel: "profile",
  },
  UpdateUsername: {
    name: "📝 Edit Name",
    channel: "profile",
  },

  // Workout Events
  WorkoutCreated: {
    name: "🏋️ New Workout",
    channel: "workout",
  },
  WorkoutDeleted: {
    name: "🗑️ Del Workout",
    channel: "workout",
  },
  WorkoutUpdated: {
    name: "✏️ Edit Workout",
    channel: "workout",
  },
  WorkoutCompleted: {
    name: "✅ Done Workout",
    channel: "workout",
  },
  WorkoutSelected: {
    name: "👆 Pick Workout",
    channel: "workout",
  },
  ExerciseAdded: {
    name: "➕ Add Exercise",
    channel: "workout",
  },
  ExerciseRemoved: {
    name: "➖ Del Exercise",
    channel: "workout",
  },

  // Achievement Events
  AchievementUnlocked: {
    name: "🏆 Achievement",
    channel: "achievement",
  },
  DailyGoalCompleted: {
    name: "📅 Daily Goal",
    channel: "achievement",
  },
  WeeklyGoalCompleted: {
    name: "📆 Weekly Goal",
    channel: "achievement",
  },

  // Feedback Events
  SendFeedback: {
    name: "📨 Feedback",
    channel: "feedback",
  },
  VoteFeedback: {
    name: "👍 Vote",
    channel: "feedback",
  },

  // Support Events
  SupportTicket: {
    name: "🎫 Support",
    channel: "support",
  },

  // Settings Events
  UpdateAppSettings: {
    name: "⚙️ Settings",
    channel: "settings",
  },

  // Analytics Events
  PageView: {
    name: "👀 View",
    channel: "analytics",
  },
  FeatureUsed: {
    name: "🎯 Feature",
    channel: "analytics",
  },
};
