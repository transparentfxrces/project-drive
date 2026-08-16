import achievementsData from "../data/achievements";
import {
  getStrongestLift,
  getMostFrequentExercise,
  getTotalVolume,
} from "../utils/workoutAnalytics";

function Dashboard({
  streak,
  workoutsLogged,
  weeklyWorkoutCount,
  latestWorkout,
  personalRecords,
  goals,
  xp,
  level,
  nextLevelXP,
  achievements,
  quests,
  dailyCountdown,
  weeklyCountdown,
  workoutHistory,

  recoveryScore = 0,
  readiness = "RECOVERY",
  priorities = [],

  metrics = {},
}) {

  const xpIntoLevel = xp;
  const xpNeeded = nextLevelXP;
  
  const officialStrengthRecords = {
  "Bench Press":
    Number(metrics.bench || 0),

  Squat:
    Number(metrics.squat || 0),

  Deadlift:
    Number(metrics.deadlift || 0),

  "Power Clean":
    Number(metrics.powerClean || 0),
};

const strongestLift =
  getStrongestLift(
    officialStrengthRecords
  );

  const favoriteExercise =
  getMostFrequentExercise(workoutHistory);

  const totalVolume =
  getTotalVolume(workoutHistory);

  const latestWorkoutStats = (() => {

  if (!latestWorkout) {
    return {
      exercises: 0,
      sets: 0,
      volume: 0,
      heaviestSet: null,
    };
  }

  let totalSets = 0;
  let volume = 0;
  let heaviestSet = null;

  latestWorkout.exercises?.forEach(
    (exercise) => {

      exercise.sets?.forEach((set) => {

        const weight =
          Number(set.weight) || 0;

        const reps =
          Number(set.reps) || 0;

        /*
         * Only count sets that actually
         * contain workout data.
         */
        if (
          weight <= 0 &&
          reps <= 0
        ) {
          return;
        }

        totalSets += 1;

        volume +=
          weight * reps;

        if (
          weight > 0 &&
          (
            !heaviestSet ||
            weight >
              heaviestSet.weight
          )
        ) {
          heaviestSet = {
            exercise:
              exercise.exercise,

            weight,

            reps,
          };
        }

      });

    }
  );

  return {
    exercises:
      latestWorkout.exercises?.length ||
      0,

    sets: totalSets,

    volume,

    heaviestSet,
  };

})();

  return (
    <>

      <section className="dashboard-hero">

        <div className="dashboard-hero-left">

          <span className="system-tag">
            PROJECT DRIVE SYSTEM
          </span>

          <h2>Hunter Dashboard</h2>

          <p>
            Continue training.
            Complete quests.
            Become stronger.
          </p>

        </div>

        <div className="dashboard-level">

          <div className="level-ring">

            <span>{level}</span>

          </div>

          <small>Hunter Level</small>

        </div>

      </section>

      {/* ATHLETE STATUS */}

<div className="dashboard-card athlete-status-card">

  <div className="athlete-status-header">

    <div>

      <span className="system-tag">
        ATHLETE STATUS
      </span>

      <h3>
        Today's Readiness
      </h3>

    </div>

    <div
      className={`dashboard-readiness-badge ${
        readiness
          .replace(/\s+/g, "-")
          .toLowerCase()
      }`}
    >
      {readiness}
    </div>

  </div>

  <div className="athlete-status-grid">

    <div className="athlete-status-main">

      <span className="athlete-status-label">
        RECOVERY SCORE
      </span>

      <div className="athlete-recovery-score">

        {recoveryScore}

        <span>/100</span>

      </div>

      <p>
        {readiness === "READY" &&
          "Recovery looks strong. Execute today's training with full focus."}

        {readiness === "LIGHT DAY" &&
          "Recovery is moderate. Prioritize quality work and control unnecessary fatigue."}

        {readiness === "RECOVERY" &&
          "Recovery is limited today. Prioritize recovery and avoid unnecessary training stress."}
      </p>

    </div>

    <div className="athlete-status-detail">

      <span className="athlete-status-label">
        STRONGEST LIFT
      </span>

      <strong>
        {strongestLift.exercise || "--"}
      </strong>

      <small>
        {strongestLift.weight
          ? `${strongestLift.weight} lbs`
          : "No data yet"}
      </small>

    </div>

    <div className="athlete-status-detail">

      <span className="athlete-status-label">
        THIS WEEK
      </span>

      <strong>
        {weeklyWorkoutCount}
      </strong>

      <small>
        workouts completed
      </small>

    </div>

  </div>

</div>

      {/* XP */}

      <div className="dashboard-card xp-card">

        <div className="xp-header">

          <div>

            <h3>LEVEL {level}</h3>

            <p>

              {xpIntoLevel} / {xpNeeded} XP

            </p>

          </div>

          <div className="xp-percent">

            {Math.floor(
              (xpIntoLevel / xpNeeded) * 100
            )}
            %

          </div>

        </div>

        <div className="xp-progress-bar">

          <div
            className="xp-progress-fill"
            style={{
              width: `${(xpIntoLevel / xpNeeded) * 100}%`,
            }}
          />

        </div>

      </div>

      {/* Stats */}

      <div className="stats-grid">

        <div className="stat-card">

          <span className="stat-icon">🔥</span>

          <h3>Current Streak</h3>

          <p>{streak}</p>

        </div>

        <div className="stat-card">

          <span className="stat-icon">🏋️</span>

          <h3>Total Workouts</h3>

          <p>{workoutsLogged}</p>

        </div>

        <div className="stat-card">

          <span className="stat-icon">📅</span>

          <h3>This Week</h3>

          <p>{weeklyWorkoutCount}</p>

        </div>

        <div className="stat-card">

          <span className="stat-icon">🏆</span>

          <h3>Personal Records</h3>

          <p>{Object.keys(personalRecords).length}</p>

        </div>

      </div>

      {/* Weekly Goal */}

      <div className="dashboard-card weekly-goal-card">

        <div className="weekly-goal-header">

          <div>

            <h3>Weekly Mission</h3>

            <p>

              Complete {goals.weeklyWorkoutGoal} workouts

            </p>

          </div>

          <div className="weekly-goal-percent">

            {Math.floor(
              Math.min(
                (weeklyWorkoutCount /
                  goals.weeklyWorkoutGoal) *
                  100,
                100
              )
            )}
            %

          </div>

        </div>

        <div className="goal-progress-bar">

          <div
            className="goal-progress-fill"
            style={{
              width: `${Math.min(
                (weeklyWorkoutCount /
                  goals.weeklyWorkoutGoal) *
                  100,
                100
              )}%`,
            }}
          />

        </div>

        <div className="weekly-goal-footer">

          <span>

            {weeklyWorkoutCount} / {goals.weeklyWorkoutGoal}

          </span>

          {weeklyWorkoutCount >=
            goals.weeklyWorkoutGoal && (

            <span className="weekly-goal-complete">

              COMPLETE

            </span>

          )}

        </div>

      </div>

            {/* Daily Quests */}

      <div className="dashboard-card">

        <div className="section-header">

          <h3>Daily Quests</h3>

          <span>{dailyCountdown}</span>

        </div>

        {quests.daily.map((quest) => (

          <div
            key={quest.id}
            className={`quest-card ${
              quest.completed
                ? "completed"
                : ""
            }`}
          >

            <div className="quest-header">

              <div>

                <h4 className="quest-title">

                  {quest.title}

                </h4>

                <p className="quest-description">

                  {quest.description}

                </p>

              </div>

              <div className="quest-xp">

                +{quest.xp} XP

              </div>

            </div>

            <div className="quest-progress">

              <div
                className="quest-progress-fill"
                style={{
                  width: `${Math.min(
                    (quest.progress /
                      quest.target) *
                      100,
                    100
                  )}%`,
                }}
              />

            </div>

            <div className="quest-footer">

              <span>

                {quest.progress}/{quest.target}

              </span>

              {quest.completed && (

                <span className="quest-complete">

                  COMPLETE

                </span>

              )}

            </div>

          </div>

        ))}

      </div>

      {/* Weekly */}

      <div className="dashboard-card">

        <div className="section-header">

          <h3>Weekly Quests</h3>

          <span>{weeklyCountdown}</span>

        </div>

        {quests.weekly.map((quest) => (

          <div
            key={quest.id}
            className={`quest-card ${
              quest.completed
                ? "completed"
                : ""
            }`}
          >

            <div className="quest-header">

              <div>

                <h4 className="quest-title">

                  {quest.title}

                </h4>

                <p className="quest-description">

                  {quest.description}

                </p>

              </div>

              <div className="quest-xp">

                +{quest.xp} XP

              </div>

            </div>

            <div className="quest-progress">

              <div
                className="quest-progress-fill"
                style={{
                  width: `${
                    quest.targetWeight
                      ? Math.min(
                          (quest.progress /
                            quest.targetWeight) *
                            100,
                          100
                        )
                      : Math.min(
                          (quest.progress /
                            quest.target) *
                            100,
                          100
                        )
                  }%`,
                }}
              />

            </div>

            <div className="quest-footer">

              <span>

                {quest.progress}

                {quest.targetWeight
                  ? ` / ${quest.targetWeight} lbs`
                  : ` / ${quest.target}`}

              </span>

              {quest.completed && (

                <span className="quest-complete">

                  COMPLETE

                </span>

              )}

            </div>

          </div>

        ))}

      </div>

      {/* Latest Workout */}

<div className="dashboard-card latest-workout-card">

  <div className="latest-workout-header">

    <div>

      <span className="system-tag">
        SESSION REPORT
      </span>

      <h3>Latest Workout</h3>

    </div>

    {latestWorkout && (

      <span className="latest-workout-complete">
        COMPLETE
      </span>

    )}

  </div>

  {latestWorkout ? (

    <>

      <div className="latest-workout-date">

        {new Date(
          latestWorkout.date
        ).toLocaleDateString(
          undefined,
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        )}

      </div>

      <div className="latest-workout-stats">

        <div>

          <span>EXERCISES</span>

          <strong>
            {latestWorkoutStats.exercises}
          </strong>

        </div>

        <div>

          <span>SETS</span>

          <strong>
            {latestWorkoutStats.sets}
          </strong>

        </div>

        <div>

          <span>VOLUME</span>

          <strong>
            {latestWorkoutStats.volume.toLocaleString()}
          </strong>

          <small>lbs</small>

        </div>

        <div>

          <span>DURATION</span>

          <strong>
            {Math.floor(
              (latestWorkout.duration || 0) /
                60
            )}
          </strong>

          <small>min</small>

        </div>

      </div>

      <div className="latest-workout-exercises">

        <span className="latest-workout-section-label">
          SESSION PERFORMANCE
        </span>

        {latestWorkout.exercises?.map(
          (exercise) => {

            const completedSets =
              exercise.sets?.filter(
                (set) =>
                  Number(set.weight) > 0 ||
                  Number(set.reps) > 0
              ) || [];

            const bestSet =
              completedSets.reduce(
                (best, set) => {

                  const weight =
                    Number(set.weight) || 0;

                  if (
                    !best ||
                    weight >
                      Number(
                        best.weight
                      )
                  ) {
                    return set;
                  }

                  return best;

                },
                null
              );

            return (

              <div
                className="latest-exercise-row"
                key={exercise.id}
              >

                <div>

                  <strong>
                    {exercise.exercise}
                  </strong>

                  <small>
                    {completedSets.length}
                    {" "}
                    {completedSets.length === 1
                      ? "set"
                      : "sets"}
                  </small>

                </div>

                <span>

                  {bestSet ? (
                    <>
                      {bestSet.weight || 0}
                      {" × "}
                      {bestSet.reps || 0}
                    </>
                  ) : (
                    "--"
                  )}

                </span>

              </div>

            );

          }
        )}

      </div>

      {latestWorkoutStats.heaviestSet && (

        <div className="latest-heaviest-set">

          <div className="latest-heaviest-icon">
            ⚡
          </div>

          <div>

            <span>
              HEAVIEST SET
            </span>

            <strong>
              {
                latestWorkoutStats
                  .heaviestSet
                  .exercise
              }
            </strong>

          </div>

          <div className="latest-heaviest-value">

            {
              latestWorkoutStats
                .heaviestSet
                .weight
            }

            <small>
              {" × "}
              {
                latestWorkoutStats
                  .heaviestSet
                  .reps
              }
            </small>

          </div>

        </div>

      )}

    </>

  ) : (

    <div className="latest-workout-empty">

      <span>◇</span>

      <p>
        Complete a workout to generate
        your first session report.
      </p>

    </div>

  )}

</div>

      {/* Analytics */}

<div className="dashboard-card">

  <h3>Training Analytics</h3>

  <div className="pr-row">

    <span>Strongest Lift</span>

    <strong>

      {strongestLift.exercise || "--"}

    </strong>

  </div>

  <div className="pr-row">

    <span>Best Weight</span>

    <strong>

      {strongestLift.weight} lbs

    </strong>

  </div>

  <div className="pr-row">

    <span>Favorite Exercise</span>

    <strong>

      {favoriteExercise.exercise || "--"}

    </strong>

  </div>

  <div className="pr-row">

    <span>Total Training Volume</span>

    <strong>

      {totalVolume.toLocaleString()} lbs

    </strong>

  </div>

</div>

      {/* Achievements */}

      <div className="dashboard-card">

        <h3>Achievements</h3>

        <div className="achievement-grid">

          {achievementsData.map((achievement) => {

            const unlocked =
              achievements[achievement.id];

            return (

              <div
                key={achievement.id}
                className={`achievement-card ${
                  unlocked
                    ? "unlocked"
                    : "locked"
                }`}
              >

                <div className="achievement-icon">

                  {achievement.icon}

                </div>

                <div className="achievement-info">

                  <h4>{achievement.title}</h4>

                  <p>{achievement.description}</p>

                  <span
                    className={`rarity ${achievement.rarity.toLowerCase()}`}
                  >

                    {achievement.rarity}

                  </span>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </>

  );

}

export default Dashboard;