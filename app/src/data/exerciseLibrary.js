const exerciseLibrary = {
  chest: [
    "Bench Press",
    "Incline Bench Press",
    "Decline Bench Press",
    "Dumbbell Bench Press",
    "Cable Fly",
    "Push Ups",
  ],

  back: [
    "Barbell Row",
    "Lat Pulldown",
    "Pull Ups",
    "Seated Cable Row",
    "Single Arm Row",
  ],

  shoulders: [
    "Overhead Press",
    "Dumbbell Shoulder Press",
    "Lateral Raise",
    "Rear Delt Fly",
    "Front Raise",
  ],

  arms: [
    "Barbell Curl",
    "Hammer Curl",
    "Tricep Pushdown",
    "Skull Crushers",
    "Preacher Curl",
  ],

  legs: [
    "Squat",
    "Deadlift",
    "Romanian Deadlift",
    "Leg Press",
    "Leg Extension",
    "Hamstring Curl",
    "Walking Lunges",
    "Calf Raises",
  ],

  conditioning: [
    "Sled Push",
    "Farmer Carry",
    "Sprint",
    "Bike",
    "Row",
    "Jump Rope",
  ],
};

// Position-specific development exercises.
// These are supplemental to the normal coach/team workout.

export const positionExercises = {
  OT: ["Plank", "Dead Bug", "Glute Bridge", "Farmer Carry"],
  OG: ["Plank", "Dead Bug", "Glute Bridge", "Farmer Carry"],
  C: ["Plank", "Dead Bug", "Glute Bridge", "Farmer Carry"],

  QB: ["Plank", "Dead Bug", "Lateral Shuffle", "Glute Bridge"],
  RB: ["Single-Leg Balance", "Lateral Shuffle", "Glute Bridge", "Sprint"],
  FB: ["Plank", "Glute Bridge", "Farmer Carry", "Sprint"],
  WR: ["Single-Leg Balance", "Lateral Shuffle", "Glute Bridge", "Sprint"],
  TE: ["Single-Leg Balance", "Plank", "Glute Bridge", "Sprint"],

  DE: ["Plank", "Glute Bridge", "Lateral Shuffle", "Sprint"],
  DT: ["Plank", "Dead Bug", "Glute Bridge", "Farmer Carry"],
  NT: ["Plank", "Dead Bug", "Glute Bridge", "Farmer Carry"],
  EDGE: ["Plank", "Lateral Shuffle", "Glute Bridge", "Sprint"],
  LB: ["Single-Leg Balance", "Lateral Shuffle", "Glute Bridge", "Sprint"],
  OLB: ["Single-Leg Balance", "Lateral Shuffle", "Glute Bridge", "Sprint"],
  ILB: ["Plank", "Single-Leg Balance", "Glute Bridge", "Lateral Shuffle"],
  MLB: ["Plank", "Single-Leg Balance", "Glute Bridge", "Lateral Shuffle"],
  CB: ["Single-Leg Balance", "Lateral Shuffle", "Glute Bridge", "Sprint"],
  S: ["Single-Leg Balance", "Lateral Shuffle", "Glute Bridge", "Sprint"],
  FS: ["Single-Leg Balance", "Lateral Shuffle", "Glute Bridge", "Sprint"],
  SS: ["Single-Leg Balance", "Lateral Shuffle", "Glute Bridge", "Sprint"],

  K: ["Single-Leg Balance", "Glute Bridge"],
  P: ["Single-Leg Balance", "Glute Bridge"],
  LS: ["Plank", "Dead Bug", "Glute Bridge"],
};



export default exerciseLibrary;