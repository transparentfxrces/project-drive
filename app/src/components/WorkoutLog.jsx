function WorkoutLog({ workoutHistory }) {
  return (
    <>
      <h2>📚 Workout History</h2>

      {workoutHistory.length === 0 ? (
        <p>No workouts saved yet.</p>
      ) : (
        workoutHistory.map((session) => (
          <div key={session.id} className="card">
            <h3>📅 {session.date}</h3>

            {session.exercises.map((ex) => (
              <p key={ex.id}>
                {ex.exercise} — {ex.weight} lbs × {ex.reps} reps
              </p>
            ))}
          </div>
        ))
      )}
    </>
  );
}

export default WorkoutLog;