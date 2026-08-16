export function getPersonalRecords(workoutHistory) {
  const personalRecords = {};

  workoutHistory.forEach((session) => {
    session.exercises.forEach((exercise) => {
      const currentWeight = Number(exercise.weight);

      if (
        !personalRecords[exercise.exercise] ||
        currentWeight > personalRecords[exercise.exercise].weight
      ) {
        personalRecords[exercise.exercise] = {
          weight: currentWeight,
          date: session.date,
        };
      }
    });
  });

  return personalRecords;
}

export function getLifetimeStats(workoutHistory) {
  let exercisesLogged = 0;
  let totalWeightLifted = 0;

  workoutHistory.forEach((session) => {
    exercisesLogged += session.exercises.length;

    session.exercises.forEach((exercise) => {
      totalWeightLifted +=
        Number(exercise.weight) *
        Number(exercise.reps);
    });
  });

  return {
    workoutSessions: workoutHistory.length,
    exercisesLogged,
    totalWeightLifted,
  };
}

export function getFavoriteExercise(workoutHistory) {
  const exerciseCounts = {};

  workoutHistory.forEach((session) => {
    session.exercises.forEach((exercise) => {
      if (!exerciseCounts[exercise.exercise]) {
        exerciseCounts[exercise.exercise] = 0;
      }

      exerciseCounts[exercise.exercise]++;
    });
  });

  let favoriteExercise = "";
  let favoriteCount = 0;

  Object.entries(exerciseCounts).forEach(([exercise, count]) => {
    if (count > favoriteCount) {
      favoriteExercise = exercise;
      favoriteCount = count;
    }
  });

  return {
    favoriteExercise,
    favoriteCount,
  };
}