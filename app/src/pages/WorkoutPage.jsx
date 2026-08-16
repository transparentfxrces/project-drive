function WorkoutPage({
  currentWorkout,
  exercise,
  setExercise,
  addExercise,
  finishWorkout,
  clearCurrentWorkout,
  loadCategory,
  selectedCategory,
  exerciseLibrary,
  addTemplateExercise,
  updateSet,
  updateExerciseName,
  addSet,
  removeExercise,
  searchTerm,
  setSearchTerm,
  favoriteExercises,
  toggleFavorite,
  workoutStartTime,
  elapsedTime,


  footballProgram,
  selectedWeek,
  setSelectedWeek,
  selectedDay,
  setSelectedDay,
  loadFootballWorkout,
}) {
  const filteredExercises =
    selectedCategory && exerciseLibrary[selectedCategory]
      ? exerciseLibrary[selectedCategory].filter((exerciseName) =>
          exerciseName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : [];


  const totalSets = currentWorkout.reduce(
  (total, exercise) =>
    total +
    (exercise.sets ? exercise.sets.length : 0),
  0
);


const completedSets = currentWorkout.reduce(
  (total, exercise) =>
    total +
    (exercise.sets
      ? exercise.sets.filter(
          (set) => set.completed
        ).length
      : 0),
  0
);


const progress =
  totalSets === 0
    ? 0
    : Math.round((completedSets / totalSets) * 100);

    const exerciseFinished = (exercise) =>
  exercise.sets.every((set) => set.completed);

  function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  const secs = seconds % 60;

  return [
    hours,
    minutes,
    secs,
  ]
    .map((value) =>
      String(value).padStart(2, "0")
    )
    .join(":");
}


  return (
    <>
      <h2>🏋️ Workout</h2>


    <div className="progress-banner">

    <div className="progress-top">

        <div>

            <span className="system-label">
                SYSTEM
            </span>

            <h3>
                Workout Session
            </h3>

        </div>

        <div className="session-clock">

            {formatTime(elapsedTime)}

        </div>

    </div>

    <div className="progress-percent">

        {progress}%

    </div>

    <div className="progress-bar">

        <div
            className="progress-fill"
            style={{
                width: `${progress}%`
            }}
        />

    </div>

    <div className="progress-bottom">

        <span>

            {completedSets} / {totalSets} Sets Complete

        </span>

        <span>

            {workoutStartTime
                ? "ACTIVE"
                : "READY"}

        </span>

    </div>

</div>


      <div className="football-program-card">


  <h3>🏈 Tech Football Program</h3>


  <div className="football-row">


    <label>Week</label>


    <select
      value={selectedWeek}
      onChange={(e) =>
        setSelectedWeek(e.target.value)
      }
    >


      {Object.keys(footballProgram).map((week) => (


        <option
          key={week}
          value={week}
        >
          {week.replace("week", "Week ")}


        </option>


      ))}


    </select>


  </div>


  <div className="football-days">


    <button
      onClick={() => setSelectedDay("monday")}
      className={
        selectedDay === "monday"
          ? "active-day"
          : ""
      }
    >
      Monday
    </button>


    <button
      onClick={() => setSelectedDay("wednesday")}
      className={
        selectedDay === "wednesday"
          ? "active-day"
          : ""
      }
    >
      Wednesday
    </button>


    <button
      onClick={() => setSelectedDay("friday")}
      className={
        selectedDay === "friday"
          ? "active-day"
          : ""
      }
    >
      Friday
    </button>


  </div>


  <button
    className="load-football-button"
    onClick={loadFootballWorkout}
  >
    Load Football Workout
  </button>


</div>


      {/* Category Buttons */}


      <div className="template-buttons">
        {Object.keys(exerciseLibrary).map((category) => (
          <button
            key={category}
            onClick={() => loadCategory(category)}
          >
            {category.charAt(0).toUpperCase() +
              category.slice(1)}
          </button>
        ))}
      </div>


      {/* Exercise Picker */}


      {selectedCategory && (
        <div className="exercise-picker">


          <h3>
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}
          </h3>


          <input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />


          {filteredExercises.map((exerciseName) => (
            <div
              key={exerciseName}
              className="exercise-option-row"
            >
              <button
                className="exercise-option"
                onClick={() =>
                  addTemplateExercise(exerciseName)
                }
              >
                {exerciseName}
              </button>


              <button
                className="favorite-button"
                onClick={() =>
                  toggleFavorite(exerciseName)
                }
              >
                {favoriteExercises.includes(exerciseName)
                  ? "⭐"
                  : "☆"}
              </button>
            </div>
          ))}


        </div>
      )}


      {/* Current Workout */}


      {currentWorkout.length === 0 ? (
        <p>No exercises yet.</p>
      ) : (
        currentWorkout.map((exercise) => (
          <div
            key={exercise.id}
            className="exercise-card"
          >


            <div className="exercise-header">

<div>

<input
  className="exercise-title-input"
  value={exercise.exercise}
  onChange={(e) =>
    updateExerciseName(
      exercise.id,
      e.target.value
    )
  }
/>

{exerciseFinished(exercise) && (
  <div className="exercise-complete">
    ✅ Exercise Complete
  </div>
)}

</div>

  {exercise.percent && (
    <div className="percent-badge">
      {exercise.percent}% of 1RM
    </div>
  )}

</div>   

{exercise.sets.map((set, index) => (
  <div
    key={set.id}
    className="set-row"
  >


    <span className="set-label">
      Set {index + 1}
    </span>




    {set.percent && (
  <span className="percent-badge">
    {set.percent}%
  </span>
)}

{set.targetWeight !== "" && (
  <span className="target-weight">
    🎯 {set.targetWeight} lbs
  </span>
)}



    <input
      type="number"
      placeholder="Weight"
      value={set.weight}
      onChange={(e) =>
        updateSet(
          exercise.id,
          set.id,
          "weight",
          e.target.value
        )
      }
    />




    <input
      type="number"
      placeholder="Reps"
      value={set.reps}
      onChange={(e) =>
        updateSet(
          exercise.id,
          set.id,
          "reps",
          e.target.value
        )
      }
    />




    {set.completed && (
      <span className="completed-check">
        ✅
      </span>
    )}


  </div>
))}




            <button
              className="add-set-button"
              onClick={() => addSet(exercise.id)}
            >
              + Add Set
            </button>


            <button
  className="delete-exercise-button"
  onClick={() =>
    removeExercise(exercise.id)
  }
>
  🗑 Remove Exercise
</button>


          </div>
        ))
      )}


   


      {/* Custom Exercise */}


      <div className="custom-exercise-card">


        <h3>Add Custom Exercise</h3>


        <input
          placeholder="Exercise Name"
          value={exercise}
          onChange={(e) =>
            setExercise(e.target.value)
          }
        />


        <button onClick={addExercise}>
          Add Exercise
        </button>


      </div>


      {/* Workout Buttons */}


      <div className="workout-actions">


        <button onClick={finishWorkout}>
          ✅ Finish Workout
        </button>


        <button onClick={clearCurrentWorkout}>
          🗑 Clear Workout
        </button>


      </div>
    </>
  );
}


export default WorkoutPage;

