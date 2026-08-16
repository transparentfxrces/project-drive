import "./WorkoutSummaryPage.css";

export default function WorkoutSummaryPage({
  workout,
  onContinue,
}) {
  if (!workout) return null;

  let totalSets = 0;
  let totalVolume = 0;

  workout.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      totalSets++;

      totalVolume +=
        (Number(set.weight) || 0) *
        (Number(set.reps) || 0);
    });
  });

  return (
    <div className="summary-page">

      <span className="system-tag">
    PROJECT DRIVE SYSTEM
</span>

<h1>WORKOUT COMPLETE</h1>

<p className="summary-subtitle">
    Session successfully recorded.
</p>

      <div className="summary-card">

        <h2>Session Stats</h2>

        <p>
          Exercises:
          <strong>
            {" "}
            {workout.exercises.length}
          </strong>
        </p>

        <p>
          Sets:
          <strong>
            {" "}
            {totalSets}
          </strong>
        </p>

        <p>
          Volume:
          <strong>
            {" "}
            {totalVolume.toLocaleString()} lbs
          </strong>
        </p>

        <p>
          XP Earned:
          <strong> +100 XP</strong>
        </p>

      </div>

      <h2 className="summary-section-title">
    SESSION LOG
</h2>

      {workout.exercises.map((exercise) => (

        <div
          key={exercise.id}
          className="summary-exercise"
        >

          <h3>{exercise.exercise}</h3>

          {exercise.sets.map((set) => (

            <p key={set.id}>
              {set.weight} lbs × {set.reps}
            </p>

          ))}

        </div>

      ))}

      <button
        className="summary-button"
        onClick={onContinue}
      >
        Continue
      </button>

    </div>
  );
}