export default function checkQuests({
  quests,
  setQuests,
  workoutHistory = [],
  metrics = {},
  changedMetric = null,
  currentWorkout = null,
  favoriteExercises = [],
  awardXP,
}) {
  if (!quests) {
    return;
  }

  const updated = {
    ...quests,

    daily: (
      quests.daily || []
    ).map((quest) => ({
      ...quest,
    })),

    weekly: (
      quests.weekly || []
    ).map((quest) => ({
      ...quest,
    })),
  };

  /* ==========================
     Update Weekly Lift Targets
     ========================== */

  if (changedMetric) {
    updated.weekly =
      updated.weekly.map(
        (quest) => {
          switch (
            changedMetric
          ) {
            case "bench":
              if (
                quest.type !==
                "benchProgress"
              ) {
                return quest;
              }

              return {
                ...quest,
                targetWeight:
                  (Number(
                    metrics.bench
                  ) || 0) + 5,
              };

            case "squat":
              if (
                quest.type !==
                "squatProgress"
              ) {
                return quest;
              }

              return {
                ...quest,
                targetWeight:
                  (Number(
                    metrics.squat
                  ) || 0) + 10,
              };

            case "deadlift":
              if (
                quest.type !==
                "deadliftProgress"
              ) {
                return quest;
              }

              return {
                ...quest,
                targetWeight:
                  (Number(
                    metrics.deadlift
                  ) || 0) + 10,
              };

            case "powerClean":
              if (
                quest.type !==
                "powerCleanProgress"
              ) {
                return quest;
              }

              return {
                ...quest,
                targetWeight:
                  (Number(
                    metrics.powerClean
                  ) || 0) + 5,
              };

            default:
              return quest;
          }
        }
      );
  }

  const latestWorkout =
    workoutHistory[0];

  /* ==========================
     Daily Quests
     ========================== */

  updated.daily.forEach(
    (quest) => {
      switch (quest.type) {
        case "workout":
          if (
            currentWorkout ===
            "finished"
          ) {
            quest.progress = 1;
          }

          break;

        case "exerciseCount":
          if (
            currentWorkout ===
              "finished" &&
            latestWorkout
          ) {
            quest.progress =
              latestWorkout
                .exercises?.length ||
              0;
          }

          break;

        case "setCount":
          if (
            currentWorkout ===
              "finished" &&
            latestWorkout
          ) {
            quest.progress =
              latestWorkout.exercises?.reduce(
                (
                  total,
                  exercise
                ) =>
                  total +
                  (exercise.sets
                    ?.length || 0),
                0
              ) || 0;
          }

          break;

        case "exerciseToday":
          if (
            currentWorkout ===
              "finished" &&
            latestWorkout
          ) {
            const found =
              latestWorkout.exercises?.some(
                (exercise) =>
                  exercise.exercise ===
                  quest.exercise
              );

            quest.progress = found
              ? 1
              : 0;
          }

          break;

        case "favoriteWorkout":
          if (
            currentWorkout ===
              "finished" &&
            latestWorkout
          ) {
            quest.progress =
              latestWorkout.exercises?.filter(
                (exercise) =>
                  favoriteExercises.includes(
                    exercise.exercise
                  )
              ).length || 0;
          }

          break;

        case "metric":
          if (
            changedMetric ===
              quest.metric &&
            metrics[
              quest.metric
            ] !== ""
          ) {
            quest.progress = 1;
          }

          break;

        case "favorite":
          if (
            changedMetric === null
          ) {
            quest.progress =
              favoriteExercises.length;
          }

          break;

        default:
          break;
      }

      if (
        !quest.completed &&
        quest.progress >=
          quest.target
      ) {
        quest.completed = true;
      }

      if (
        quest.completed &&
        !quest.claimed
      ) {
        quest.claimed = true;

        awardXP?.(
          quest.xp,
          `Daily quest completed: ${quest.title}`,
          "dailyQuest"
        );
      }
    }
  );

  /* ==========================
     Weekly Quests
     ========================== */

  updated.weekly.forEach(
    (quest) => {
      switch (quest.type) {
        case "threeWorkouts": {
          if (
            currentWorkout !==
            "finished"
          ) {
            break;
          }

          const monday =
            new Date();

          const day =
            monday.getDay();

          const difference =
            day === 0
              ? -6
              : 1 - day;

          monday.setDate(
            monday.getDate() +
              difference
          );

          monday.setHours(
            0,
            0,
            0,
            0
          );

          quest.progress =
            workoutHistory.filter(
              (workout) =>
                new Date(
                  workout.date
                ) >= monday
            ).length;

          break;
        }

        case "weeklySets": {
          if (
            currentWorkout !==
            "finished"
          ) {
            break;
          }

          const monday =
            new Date();

          const day =
            monday.getDay();

          const difference =
            day === 0
              ? -6
              : 1 - day;

          monday.setDate(
            monday.getDate() +
              difference
          );

          monday.setHours(
            0,
            0,
            0,
            0
          );

          quest.progress =
            workoutHistory
              .filter(
                (workout) =>
                  new Date(
                    workout.date
                  ) >= monday
              )
              .reduce(
                (
                  workoutTotal,
                  workout
                ) =>
                  workoutTotal +
                  (workout.exercises?.reduce(
                    (
                      exerciseTotal,
                      exercise
                    ) =>
                      exerciseTotal +
                      (exercise.sets
                        ?.length ||
                        0),
                    0
                  ) || 0),
                0
              );

          break;
        }

        case "favoriteWeek": {
          if (
            currentWorkout !==
            "finished"
          ) {
            break;
          }

          const monday =
            new Date();

          const day =
            monday.getDay();

          const difference =
            day === 0
              ? -6
              : 1 - day;

          monday.setDate(
            monday.getDate() +
              difference
          );

          monday.setHours(
            0,
            0,
            0,
            0
          );

          quest.progress =
            workoutHistory
              .filter(
                (workout) =>
                  new Date(
                    workout.date
                  ) >= monday
              )
              .reduce(
                (
                  total,
                  workout
                ) =>
                  total +
                  (workout.exercises?.filter(
                    (exercise) =>
                      favoriteExercises.includes(
                        exercise.exercise
                      )
                  ).length || 0),
                0
              );

          break;
        }

        case "benchProgress":
        case "squatProgress":
        case "deadliftProgress":
        case "powerCleanProgress": {
          if (
            currentWorkout !==
            "finished"
          ) {
            break;
          }

          let bestLift = 0;

          workoutHistory.forEach(
            (workout) => {
              workout.exercises?.forEach(
                (exercise) => {
                  if (
                    exercise.exercise !==
                    quest.exercise
                  ) {
                    return;
                  }

                  exercise.sets?.forEach(
                    (set) => {
                      const weight =
                        Number(
                          set.weight
                        ) || 0;

                      bestLift =
                        Math.max(
                          bestLift,
                          weight
                        );
                    }
                  );
                }
              );
            }
          );

          quest.progress =
            bestLift;

          break;
        }

        default:
          break;
      }

      const targetReached =
        quest.target &&
        quest.progress >=
          quest.target;

      const targetWeightReached =
        quest.targetWeight &&
        quest.progress >=
          quest.targetWeight;

      if (
        !quest.completed &&
        (
          targetReached ||
          targetWeightReached
        )
      ) {
        quest.completed = true;
      }

      if (
        quest.completed &&
        !quest.claimed
      ) {
        quest.claimed = true;

        awardXP?.(
          quest.xp,
          `Weekly quest completed: ${quest.title}`,
          "weeklyQuest"
        );
      }
    }
  );

  setQuests(updated);
}