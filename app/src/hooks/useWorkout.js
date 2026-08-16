import { useState, useEffect } from "react";

export default function useWorkout(metrics, footballProgram) {
  const [currentWorkout, setCurrentWorkout] = useState(() => {
    const saved = localStorage.getItem("currentWorkout");
    return saved ? JSON.parse(saved) : [];
  });

  const [workoutHistory, setWorkoutHistory] = useState(() => {
    const saved = localStorage.getItem("workoutHistory");

    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [exercise, setExercise] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedWeek, setSelectedWeek] =
    useState("week1");

  const [selectedDay, setSelectedDay] =
    useState("monday");

  const [workoutSummary, setWorkoutSummary] =
    useState(null);

  const [workoutStartTime, setWorkoutStartTime] =
  useState(() => {
    const saved =
      localStorage.getItem("workoutStartTime");

    return saved
      ? Number(saved)
      : null;
  });

const [elapsedTime, setElapsedTime] =
  useState(0);

  useEffect(() => {
    localStorage.setItem(
      "currentWorkout",
      JSON.stringify(currentWorkout)
    );
  }, [currentWorkout]);

  useEffect(() => {
    localStorage.setItem(
      "workoutHistory",
      JSON.stringify(workoutHistory)
    );
  }, [workoutHistory]);

  useEffect(() => {
  if (!workoutStartTime) return;

  localStorage.setItem(
    "workoutStartTime",
    workoutStartTime
  );

  setElapsedTime(
    Math.floor(
      (Date.now() - workoutStartTime) / 1000
    )
  );

  const interval = setInterval(() => {
    setElapsedTime(
      Math.floor(
        (Date.now() -
          workoutStartTime) /
          1000
      )
    );
  }, 1000);

  return () =>
    clearInterval(interval);
}, [workoutStartTime]);

  function updateSet(
    exerciseId,
    setId,
    field,
    value
  ) {
    setCurrentWorkout((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,

              sets: exercise.sets.map((set) => {
                if (set.id !== setId) return set;

                const updated = {
                  ...set,
                  [field]: value,
                };

                updated.completed =
                  updated.weight !== "" &&
                  updated.reps !== "";

                return updated;
              }),
            }
          : exercise
      )
    );
  }

  function updateExerciseName(
    exerciseId,
    value
  ) {
    setCurrentWorkout((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              exercise: value,
            }
          : exercise
      )
    );
  }

  function addSet(exerciseId) {
    setCurrentWorkout((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,

              sets: [
                ...exercise.sets,

                {
                  id: crypto.randomUUID(),
                  weight: "",
                  reps: "",
                },
              ],
            }
          : exercise
      )
    );
  }

  function removeExercise(id) {
    setCurrentWorkout((prev) =>
      prev.filter((e) => e.id !== id)
    );
  }

  function addExercise() {
    if (!exercise.trim()) {
      alert("Enter an exercise name.");
      return;
    }

    if (!workoutStartTime) {
  setWorkoutStartTime(Date.now());
}

    setCurrentWorkout((prev) => [
      ...prev,

      {
        id: crypto.randomUUID(),

        exercise,

        sets: [
          {
            id: crypto.randomUUID(),
            weight: "",
            reps: "",
          },
        ],
      },
    ]);

    setExercise("");
  }

  function loadCategory(category) {
    setSelectedCategory(category);
    setSearchTerm("");
  }

  function addTemplateExercise(name) {
    if (!workoutStartTime) {
  setWorkoutStartTime(Date.now());
}
    setCurrentWorkout((prev) => [
      ...prev,

      {
        id: crypto.randomUUID(),

        exercise: name,

        sets: [
          {
            id: crypto.randomUUID(),
            weight: "",
            reps: "",
          },
        ],
      },
    ]);
  }

  function loadFootballWorkout() {
    const workout =
      footballProgram[selectedWeek][selectedDay];

    const convertedWorkout =
      workout.map((exercise) => {
        let max = 0;

        switch (exercise.maxLift) {
          case "bench":
            max = Number(metrics.bench || 0);
            break;

          case "squat":
            max = Number(metrics.squat || 0);
            break;

          case "deadlift":
            max = Number(metrics.deadlift || 0);
            break;

          case "powerClean":
            max = Number(metrics.powerClean || 0);
            break;

          default:
            max = 0;
        }

        const multiplier =
          exercise.multiplier ?? 1;

        return {
          id: crypto.randomUUID(),

          exercise: exercise.exercise,

          sets: exercise.sets.map((set) => ({
            id: crypto.randomUUID(),

            weight: "",

            reps: set.reps,

            percent: set.percent ?? null,

            targetWeight:
              set.percent && max > 0
                ? Math.round(
                    max *
                      multiplier *
                      (set.percent / 100)
                  )
                : "",

            completed: false,
          })),
        };
      });

    if (!workoutStartTime) {
  setWorkoutStartTime(Date.now());
}

    setCurrentWorkout(convertedWorkout);
  }

  function clearWorkout() {
  setCurrentWorkout([]);

  setExercise("");

  setSelectedCategory(null);

  setSearchTerm("");

  setWorkoutStartTime(null);

  setElapsedTime(0);

  localStorage.removeItem(
    "workoutStartTime"
  );
}

  function updateWorkout(updatedWorkout) {
    setWorkoutHistory((prev) =>
      prev.map((workout) =>
        workout.id === updatedWorkout.id
          ? updatedWorkout
          : workout
      )
    );
  }

  return {
    currentWorkout,
    setCurrentWorkout,

    workoutHistory,
    setWorkoutHistory,

    workoutSummary,
    setWorkoutSummary,

    exercise,
    setExercise,

    selectedCategory,
    setSelectedCategory,

    searchTerm,
    setSearchTerm,

    selectedWeek,
    setSelectedWeek,

    selectedDay,
    setSelectedDay,

    workoutStartTime,
    elapsedTime,

    updateSet,
    updateExerciseName,
    addSet,
    removeExercise,
    addExercise,
    clearWorkout,
    updateWorkout,
    loadCategory,
    addTemplateExercise,
    loadFootballWorkout,
  };
}