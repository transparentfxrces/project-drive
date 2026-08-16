import { useMemo } from "react";

export default function useDashboardStats(workoutHistory) {

  const weeklyWorkoutCount = useMemo(() => {

    const today = new Date();

    const monday = new Date(today);

    const day = monday.getDay();

    const diff =
      day === 0
        ? -6
        : 1 - day;

    monday.setDate(
      monday.getDate() + diff
    );

    monday.setHours(
      0,
      0,
      0,
      0
    );

    return workoutHistory.filter(
      (session) =>
        new Date(session.date) >= monday
    ).length;

  }, [workoutHistory]);

  const latestWorkout = useMemo(() => {

    return workoutHistory[0] || null;

  }, [workoutHistory]);

  const personalRecords = useMemo(() => {

    const prs = {};

    workoutHistory.forEach((session) => {

      if (!Array.isArray(session.exercises))
        return;

      session.exercises.forEach((exercise) => {

        if (!Array.isArray(exercise.sets))
          return;

        exercise.sets.forEach((set) => {

          const weight = Number(set.weight);

          if (!weight) return;

          if (
            !prs[exercise.exercise] ||
            weight > prs[exercise.exercise]
          ) {
            prs[exercise.exercise] = weight;
          }

        });

      });

    });

    return prs;

  }, [workoutHistory]);

  const strongestLift = useMemo(() => {

    const entries =
      Object.entries(personalRecords);

    if (entries.length === 0)
      return null;

    return [...entries].sort(
      (a, b) => b[1] - a[1]
    )[0];

  }, [personalRecords]);

  const mostTrainedExercise = useMemo(() => {

    const counts = {};

    workoutHistory.forEach((session) => {

      session.exercises.forEach((exercise) => {

        counts[exercise.exercise] =
          (counts[exercise.exercise] || 0) + 1;

      });

    });

    const entries =
      Object.entries(counts);

    if (entries.length === 0)
      return null;

    return [...entries].sort(
      (a, b) => b[1] - a[1]
    )[0];

  }, [workoutHistory]);

  return {

    weeklyWorkoutCount,

    latestWorkout,

    personalRecords,

    strongestLift,

    mostTrainedExercise,

  };

}