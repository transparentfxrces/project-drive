function PersonalRecords({ personalRecords }) {
  const exercises = Object.keys(personalRecords);

  return (
    <>
      <h2>🏆 Personal Records</h2>

      {exercises.length === 0 ? (
        <p>No personal records yet.</p>
      ) : (
        exercises.map((exercise) => (
          <div key={exercise} className="card">
            <h3>{exercise}</h3>

            <h2>{personalRecords[exercise].weight} lbs</h2>

            <p>
              📅 PR Set: {personalRecords[exercise].date}
            </p>
          </div>
        ))
      )}
    </>
  );
}

export default PersonalRecords;