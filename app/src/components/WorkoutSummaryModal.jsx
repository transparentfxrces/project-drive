import "./WorkoutSummaryModal.css";

export default function WorkoutSummaryModal({
  open,
  workout,
  xpEarned,
  newPRs,
  onClose,
}) {
  if (!open || !workout) return null;

  const exerciseCount = workout.exercises.length;

  const totalSets = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.length,
    0
  );

  return (
    <div className="summary-overlay">
      <div className="summary-card">

        <h1>Workout Complete 💪</h1>

        <div className="summary-section">

          <div className="summary-stat">
            <span>Exercises</span>
            <strong>{exerciseCount}</strong>
          </div>

          <div className="summary-stat">
            <span>Sets</span>
            <strong>{totalSets}</strong>
          </div>

          <div className="summary-stat">
            <span>XP Earned</span>
            <strong>+{xpEarned}</strong>
          </div>

        </div>

        {newPRs.length > 0 && (
          <>
            <h2>🏆 New Personal Records</h2>

            <div className="summary-prs">

              {newPRs.map((pr) => (
                <div
                  key={pr.exercise}
                  className="summary-pr"
                >
                  <span>{pr.exercise}</span>
                  <strong>{pr.weight} lbs</strong>
                </div>
              ))}

            </div>
          </>
        )}

        <button
          className="summary-button"
          onClick={onClose}
        >
          Continue
        </button>

      </div>
    </div>
  );
}