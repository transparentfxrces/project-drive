function FavoriteExercise({
  favoriteExercise,
  favoriteCount,
}) {
  return (
    <>
      <h2>⭐ Favorite Exercise</h2>

      <div className="card">
        {favoriteExercise ? (
          <>
            <h2>{favoriteExercise}</h2>

            <p>
              Logged {favoriteCount} times
            </p>
          </>
        ) : (
          <p>No workouts yet.</p>
        )}
      </div>
    </>
  );
}

export default FavoriteExercise;
