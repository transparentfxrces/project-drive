// ========================================
// PROJECT DRIVE
// Workout Analytics Utilities
// ========================================

const exerciseAliases = {
  bench: "Bench Press",
  "bench press": "Bench Press",
  "barbell bench": "Bench Press",
  "barbell bench press": "Bench Press",

  "incline bench": "Incline Bench Press",
  "incline bench press": "Incline Bench Press",
  "incline barbell bench": "Incline Bench Press",
  "incline barbell bench press":
    "Incline Bench Press",

  squat: "Back Squat",
  "back squat": "Back Squat",
  "barbell squat": "Back Squat",
  "barbell back squat": "Back Squat",

  "front squat": "Front Squat",
  "barbell front squat": "Front Squat",

  deadlift: "Deadlift",
  "conventional deadlift": "Deadlift",
  "barbell deadlift": "Deadlift",

  "trap bar deadlift": "Trap Bar Deadlift",
  "trap bar dl": "Trap Bar Deadlift",
  "hex bar deadlift": "Trap Bar Deadlift",
  "hex bar dl": "Trap Bar Deadlift",
  "hex deadlift": "Trap Bar Deadlift",

  "romanian deadlift": "Romanian Deadlift",
  rdl: "Romanian Deadlift",

  "power clean": "Power Clean",
  "barbell power clean": "Power Clean",

  "hang clean": "Hang Clean",
  "barbell hang clean": "Hang Clean",

  clean: "Power Clean",

  "clean pull": "Clean Pull",
  "barbell clean pull": "Clean Pull",

  "overhead press": "Overhead Press",
  "shoulder press": "Overhead Press",
  "military press": "Overhead Press",
  ohp: "Overhead Press",

  "push press": "Push Press",
  "push jerk": "Push Jerk",

  "hip thrust": "Hip Thrust",
  "barbell hip thrust": "Hip Thrust",

  "bulgarian split squat":
    "Bulgarian Split Squat",
  "rear foot elevated split squat":
    "Bulgarian Split Squat",
  rfess: "Bulgarian Split Squat",

  "weighted pull up": "Weighted Pull-Up",
  "weighted pullup": "Weighted Pull-Up",

  "weighted chin up": "Weighted Chin-Up",
  "weighted chinup": "Weighted Chin-Up",

  "barbell row": "Barbell Row",
  "bent over row": "Barbell Row",
  "bent over barbell row": "Barbell Row",
};

const trackedExercises = new Set([
  "Bench Press",
  "Incline Bench Press",
  "Back Squat",
  "Front Squat",
  "Deadlift",
  "Trap Bar Deadlift",
  "Romanian Deadlift",
  "Power Clean",
  "Hang Clean",
  "Clean Pull",
  "Overhead Press",
  "Push Press",
  "Push Jerk",
  "Hip Thrust",
  "Bulgarian Split Squat",
  "Weighted Pull-Up",
  "Weighted Chin-Up",
  "Barbell Row",
]);

const ignoredNamePatterns = [
  "warmup",
  "warm up",
  "warm-up",
  "cooldown",
  "cool down",
  "cool-down",
  "mobility",
  "stretch",
  "activation",
  "practice",
  "technique",
];

function cleanExerciseName(name) {
  if (!name || typeof name !== "string") {
    return "";
  }

  return name
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

function titleCase(value) {
  return value
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export function normalizeExerciseName(name) {
  const cleanedName =
    cleanExerciseName(name);

  if (!cleanedName) {
    return "";
  }

  return (
    exerciseAliases[cleanedName] ||
    titleCase(cleanedName)
  );
}

export function isTrackableExercise(name) {
  const cleanedName =
    cleanExerciseName(name);

  if (!cleanedName) {
    return false;
  }

  const shouldIgnore =
    ignoredNamePatterns.some((pattern) =>
      cleanedName.includes(pattern)
    );

  if (shouldIgnore) {
    return false;
  }

  const normalizedName =
    normalizeExerciseName(cleanedName);

  return trackedExercises.has(
    normalizedName
  );
}

function getExerciseName(exercise) {
  return normalizeExerciseName(
    exercise?.name ||
      exercise?.exercise ||
      ""
  );
}

function getRawExerciseName(exercise) {
  return (
    exercise?.name ||
    exercise?.exercise ||
    ""
  );
}

function getExerciseSets(exercise) {
  if (Array.isArray(exercise?.sets)) {
    return exercise.sets;
  }

  if (
    exercise?.weight !== undefined ||
    exercise?.reps !== undefined
  ) {
    return [
      {
        weight: exercise.weight,
        reps: exercise.reps,
      },
    ];
  }

  return [];
}

export function getPersonalRecords(
  exerciseHistory
) {
  const records = {};

  exerciseHistory.forEach((exercise) => {
    const rawName =
      getRawExerciseName(exercise);

    if (!isTrackableExercise(rawName)) {
      return;
    }

    const exerciseName =
      getExerciseName(exercise);

    const sets =
      getExerciseSets(exercise);

    if (!exerciseName || sets.length === 0) {
      return;
    }

    let maxWeight = 0;

    sets.forEach((set) => {
      const weight =
        Number(set.weight) || 0;

      if (weight > maxWeight) {
        maxWeight = weight;
      }
    });

    if (
      !records[exerciseName] ||
      maxWeight > records[exerciseName]
    ) {
      records[exerciseName] =
        maxWeight;
    }
  });

  return records;
}

export function getStrongestLift(records) {
  let strongestExercise = "";
  let strongestWeight = 0;

  Object.entries(records).forEach(
    ([exercise, weight]) => {
      if (weight > strongestWeight) {
        strongestWeight = weight;
        strongestExercise = exercise;
      }
    }
  );

  return {
    exercise: strongestExercise,
    weight: strongestWeight,
  };
}

export function getMostFrequentExercise(
  exerciseHistory
) {
  const counts = {};

  exerciseHistory.forEach((exercise) => {
    const rawName =
      getRawExerciseName(exercise);

    if (!isTrackableExercise(rawName)) {
      return;
    }

    const exerciseName =
      getExerciseName(exercise);

    if (!exerciseName) return;

    counts[exerciseName] =
      (counts[exerciseName] || 0) + 1;
  });

  let winner = "";
  let highest = 0;

  Object.entries(counts).forEach(
    ([exercise, total]) => {
      if (total > highest) {
        winner = exercise;
        highest = total;
      }
    }
  );

  return {
    exercise: winner,
    count: highest,
  };
}

export function getTotalVolume(
  exerciseHistory
) {
  let volume = 0;

  exerciseHistory.forEach((exercise) => {
    const rawName =
      getRawExerciseName(exercise);

    if (!isTrackableExercise(rawName)) {
      return;
    }

    const sets =
      getExerciseSets(exercise);

    sets.forEach((set) => {
      const weight =
        Number(set.weight) || 0;

      const reps =
        Number(set.reps) || 0;

      volume += weight * reps;
    });
  });

  return volume;
}

export function getWorkoutCount(
  workoutHistory
) {
  return workoutHistory.length;
}