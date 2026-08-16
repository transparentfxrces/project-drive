export const dailyQuestPool = [
  // ======================
  // WORKOUT
  // ======================

  {
    id: "logWorkout",
    title: "Log a Workout",
    description: "Complete one workout today.",
    type: "workout",
    xp: 100,
    target: 1,
    category: "workout",
  },

  {
    id: "threeExercises",
    title: "Complete 3 Exercises",
    description: "Finish 3 different exercises.",
    type: "exerciseCount",
    xp: 100,
    target: 3,
    category: "workout",
  },

  {
    id: "fiveExercises",
    title: "Complete 5 Exercises",
    description: "Finish 5 different exercises.",
    type: "exerciseCount",
    xp: 150,
    target: 5,
    category: "workout",
  },

  {
    id: "twelveSets",
    title: "Complete 12 Sets",
    description: "Finish at least 12 sets.",
    type: "setCount",
    xp: 125,
    target: 12,
    category: "workout",
  },

  {
    id: "twentySets",
    title: "Complete 20 Sets",
    description: "Finish at least 20 sets.",
    type: "setCount",
    xp: 175,
    target: 20,
    category: "workout",
  },

  // ======================
  // EXERCISES
  // ======================

  {
    id: "benchToday",
    title: "Bench Press Today",
    description: "Perform Bench Press today.",
    type: "exerciseToday",
    exercise: "Bench Press",
    xp: 100,
    target: 1,
    category: "exercise",
  },

  {
    id: "squatToday",
    title: "Squat Today",
    description: "Perform Squats today.",
    type: "exerciseToday",
    exercise: "Squat",
    xp: 100,
    target: 1,
    category: "exercise",
  },

  {
    id: "deadliftToday",
    title: "Deadlift Today",
    description: "Perform Deadlifts today.",
    type: "exerciseToday",
    exercise: "Deadlift",
    xp: 100,
    target: 1,
    category: "exercise",
  },

  {
    id: "powerCleanToday",
    title: "Power Clean Today",
    description: "Perform Power Cleans today.",
    type: "exerciseToday",
    exercise: "Power Clean",
    xp: 100,
    target: 1,
    category: "exercise",
  },

  // ======================
  // PERFORMANCE
  // ======================

  {
    id: "updateWeight",
    title: "Update Body Weight",
    description: "Record today's body weight.",
    type: "metric",
    metric: "weight",
    xp: 75,
    target: 1,
    category: "performance",
  },

  {
    id: "logRecovery",
    title: "Update Body Fat",
    description: "Record body fat percentage.",
    type: "metric",
    metric: "bodyFat",
    xp: 75,
    target: 1,
    category: "performance",
  },

  {
    id: "updateBenchMetric",
    title: "Update Bench PR",
    description: "Update your Bench Press max.",
    type: "metric",
    metric: "bench",
    xp: 100,
    target: 1,
    category: "performance",
  },

  {
    id: "updateSquatMetric",
    title: "Update Squat PR",
    description: "Update your Squat max.",
    type: "metric",
    metric: "squat",
    xp: 100,
    target: 1,
    category: "performance",
  },

  {
    id: "updateDeadliftMetric",
    title: "Update Deadlift PR",
    description: "Update your Deadlift max.",
    type: "metric",
    metric: "deadlift",
    xp: 100,
    target: 1,
    category: "performance",
  },

  {
    id: "updatePowerCleanMetric",
    title: "Update Power Clean PR",
    description: "Update your Power Clean max.",
    type: "metric",
    metric: "powerClean",
    xp: 100,
    target: 1,
    category: "performance",
  },

  {
    id: "updateForty",
    title: "Update 40 Yard Dash",
    description: "Record a 40 time.",
    type: "metric",
    metric: "forty",
    xp: 100,
    target: 1,
    category: "performance",
  },

  {
    id: "updateVertical",
    title: "Update Vertical Jump",
    description: "Record a Vertical Jump.",
    type: "metric",
    metric: "vertical",
    xp: 100,
    target: 1,
    category: "performance",
  },

  {
    id: "updateShuttle",
    title: "Update Shuttle",
    description: "Record a Shuttle time.",
    type: "metric",
    metric: "shuttle",
    xp: 100,
    target: 1,
    category: "performance",
  },

  {
    id: "updateBroad",
    title: "Update Broad Jump",
    description: "Record a Broad Jump.",
    type: "metric",
    metric: "broad",
    xp: 100,
    target: 1,
    category: "performance",
  },

  // ======================
  // FAVORITES
  // ======================

  {
    id: "favoriteExercise",
    title: "Favorite an Exercise",
    description: "Add one exercise to Favorites.",
    type: "favorite",
    xp: 50,
    target: 1,
    category: "favorite",
  },

  {
    id: "useFavorite",
    title: "Train a Favorite",
    description: "Use one favorite exercise.",
    type: "favoriteWorkout",
    xp: 100,
    target: 1,
    category: "favorite",
  },
];

export const weeklyQuestPool = [
  {
    id: "threeWorkouts",
    title: "Complete 3 Workouts",
    description: "Train three times this week.",
    type: "threeWorkouts",
    xp: 300,
    target: 3,
    category: "consistency",
  },

  {
    id: "fourWorkouts",
    title: "Complete 4 Workouts",
    description: "Train four times this week.",
    type: "threeWorkouts",
    xp: 450,
    target: 4,
    category: "consistency",
  },

  {
    id: "fiveWorkouts",
    title: "Complete 5 Workouts",
    description: "Train five times this week.",
    type: "threeWorkouts",
    xp: 600,
    target: 5,
    category: "consistency",
  },

  {
    id: "increaseBench",
    title: "Bench +5 lbs",
    type: "benchProgress",
    xp: 450,
    category: "strength",
  },

  {
    id: "increaseSquat",
    title: "Squat +10 lbs",
    type: "squatProgress",
    xp: 500,
    category: "strength",
  },

  {
    id: "increaseDeadlift",
    title: "Deadlift +10 lbs",
    type: "deadliftProgress",
    xp: 500,
    category: "strength",
  },

  {
    id: "increasePowerClean",
    title: "Power Clean +5 lbs",
    type: "powerCleanProgress",
    xp: 450,
    category: "strength",
  },

  {
    id: "sixtySets",
    title: "Complete 60 Sets",
    description: "Accumulate 60 total sets.",
    type: "weeklySets",
    xp: 400,
    target: 60,
    category: "volume",
  },

  {
    id: "hundredSets",
    title: "Complete 100 Sets",
    description: "Accumulate 100 total sets.",
    type: "weeklySets",
    xp: 600,
    target: 100,
    category: "volume",
  },

  {
    id: "favoriteWorkoutWeek",
    title: "Train Favorites",
    description: "Use 3 favorite exercises this week.",
    type: "favoriteWeek",
    xp: 350,
    target: 3,
    category: "favorite",
  },
];