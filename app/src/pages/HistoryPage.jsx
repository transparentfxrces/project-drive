import { useState } from "react";

function HistoryPage({
  workoutHistory,
  updateWorkout,
  units = "imperial",
}) {
  const [editingWorkout, setEditingWorkout] =
    useState(null);

      function formatWeight(weight) {
    const numericWeight = Number(weight) || 0;

    if (units === "metric") {
      return `${(
        numericWeight * 0.45359237
      ).toFixed(1)} kg`;
    }

    return `${numericWeight} lbs`;
  }

  function getInputWeight(weight) {
    if (
      weight === "" ||
      weight === null ||
      weight === undefined
    ) {
      return "";
    }

    const numericWeight = Number(weight);

    if (!Number.isFinite(numericWeight)) {
      return weight;
    }

    if (units === "metric") {
      return (
        numericWeight * 0.45359237
      ).toFixed(1);
    }

    return weight;
  }

  function parseInputWeight(value) {
    if (value === "") {
      return "";
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return value;
    }

    if (units === "metric") {
      return (
        numericValue / 0.45359237
      );
    }

    return numericValue;
  }

  function changeSet(
    workout,
    exerciseId,
    setId,
    field,
    value
  ) {
    const updatedWorkout = {
      ...workout,

      exercises: workout.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,

              sets: exercise.sets.map((set) =>
                set.id === setId
                  ? {
                      ...set,
                      [field]: value,
                    }
                  : set
              ),
            }
          : exercise
      ),
    };

    updateWorkout(updatedWorkout);
  }

  function formatWorkoutDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <>
      <section className="history-hero">

        <span className="system-tag">
          PROJECT DRIVE SYSTEM
        </span>

        <h2>TRAINING LOG</h2>

        <p>
          Every session recorded.
          Every rep remembered.
          Progress never forgotten.
        </p>

      </section>

      {workoutHistory.length === 0 ? (

        <div className="history-empty">

          <h3>No Training Sessions</h3>

          <p>
            Complete your first workout to begin
            building your training history.
          </p>

        </div>

      ) : (

        workoutHistory.map((workout) => (

          <div
            key={workout.id}
            className="history-session"
          >

            <div className="history-header">

              <div>

                <span className="history-label">
                  TRAINING SESSION
                </span>

                <h3>
                  {formatWorkoutDate(workout.date)}
                </h3>

              </div>

              <button
                className="history-edit-button"
                onClick={() =>
                  setEditingWorkout(
                    editingWorkout === workout.id
                      ? null
                      : workout.id
                  )
                }
              >
                {editingWorkout === workout.id
                  ? "DONE"
                  : "EDIT"}
              </button>

            </div>

            {workout.exercises.map((exercise) => (

              <div
                key={exercise.id}
                className="history-exercise"
              >

                <h4>
                  {exercise.exercise.toUpperCase()}
                </h4>

                {exercise.sets ? (

                  exercise.sets.map((set, index) => (

                    <div
                      key={set.id}
                      className="set-row"
                    >

                      <span>
                        SET {index + 1}
                      </span>

                      {editingWorkout === workout.id ? (

                        <>

                          <input
                            value={getInputWeight(set.weight)}
                            onChange={(e) =>
                              changeSet(
                                workout,
                                exercise.id,
                                set.id,
                                "weight",
                                parseInputWeight(e.target.value)
                              )
                            }
                          />

                          <input
                            value={set.reps}
                            onChange={(e) =>
                              changeSet(
                                workout,
                                exercise.id,
                                set.id,
                                "reps",
                                e.target.value
                              )
                            }
                          />

                        </>

                      ) : (

                        <p>
  {formatWeight(set.weight)} × {set.reps}
</p>

                      )}

                    </div>

                  ))

                ) : (

                  <p>
  {formatWeight(exercise.weight)} × {exercise.reps}
</p>

                )}

              </div>

            ))}

          </div>

        ))

      )}
    </>
  );
}

export default HistoryPage;