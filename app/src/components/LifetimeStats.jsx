function LifetimeStats({
  workoutSessions,
  exercisesLogged,
  totalWeightLifted,
}) {
  return (
    <>
      <h2>📈 Lifetime Statistics</h2>

      <div className="card">
        <h3>Workout Sessions</h3>
        <h1>{workoutSessions}</h1>
      </div>

      <div className="card">
        <h3>Exercises Logged</h3>
        <h1>{exercisesLogged}</h1>
      </div>

      <div className="card">
        <h3>Total Weight Lifted</h3>
        <h1>{totalWeightLifted.toLocaleString()} lbs</h1>
      </div>
    </>
  );
}

export default LifetimeStats;