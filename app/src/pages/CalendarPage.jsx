import {
  useMemo,
  useState,
} from "react";

function getLocalDateKey(dateValue) {
  const date =
    dateValue instanceof Date
      ? dateValue
      : new Date(dateValue);

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDuration(seconds = 0) {
  const totalSeconds =
    Number(seconds) || 0;

  if (totalSeconds <= 0) {
    return "Not recorded";
  }

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function CalendarPage({
  workoutHistory = [],
  performanceHistory = [],
}) {
  const today =
    new Date();

  const [displayDate, setDisplayDate] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

  const [selectedDate, setSelectedDate] =
    useState(null);

  const workoutsByDate =
    useMemo(() => {
      const grouped = {};

      workoutHistory.forEach(
        (workout) => {
          if (!workout?.date) return;

          const key =
            getLocalDateKey(
              workout.date
            );

          if (!grouped[key]) {
            grouped[key] = [];
          }

          grouped[key].push(
            workout
          );
        }
      );

      return grouped;
    }, [workoutHistory]);

    const prDates =
  useMemo(() => {

    const dates =
      new Set();

    Object.values(
      performanceHistory
    ).forEach((entries) => {

      if (!Array.isArray(entries)) {
        return;
      }

      entries.forEach((entry) => {

        if (entry?.date) {
          dates.add(
            entry.date
          );
        }

      });

    });

    return dates;

  }, [performanceHistory]);

  const year =
    displayDate.getFullYear();

  const month =
    displayDate.getMonth();

  const monthName =
    displayDate.toLocaleDateString(
      undefined,
      {
        month: "long",
        year: "numeric",
      }
    );

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const calendarDays = [];

  for (
    let index = 0;
    index < firstDay;
    index += 1
  ) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    calendarDays.push(day);
  }

  function changeMonth(amount) {
    setDisplayDate(
      new Date(
        year,
        month + amount,
        1
      )
    );

    setSelectedDate(null);
  }

  function getDateKey(day) {
    return getLocalDateKey(
      new Date(
        year,
        month,
        day
      )
    );
  }

  const selectedWorkouts =
    selectedDate
      ? workoutsByDate[
          selectedDate
        ] || []
      : [];

  const trainingDays =
    Object.keys(
      workoutsByDate
    ).filter((dateKey) => {
      const date =
        new Date(
          `${dateKey}T12:00:00`
        );

      return (
        date.getFullYear() ===
          year &&
        date.getMonth() ===
          month
      );
    }).length;

  const monthlyWorkouts =
    Object.entries(
      workoutsByDate
    ).reduce(
      (total, [dateKey, workouts]) => {
        const date =
          new Date(
            `${dateKey}T12:00:00`
          );

        if (
          date.getFullYear() ===
            year &&
          date.getMonth() ===
            month
        ) {
          return (
            total +
            workouts.length
          );
        }

        return total;
      },
      0
    );

  const selectedLabel =
    selectedDate
      ? new Date(
          `${selectedDate}T12:00:00`
        ).toLocaleDateString(
          undefined,
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          }
        )
      : "";

  return (
    <div className="calendar-page">

      <section className="calendar-hero">

        <span className="calendar-system-label">
          SYSTEM ACTIVITY LOG
        </span>

        <h2>
          Training Calendar
        </h2>

        <p>
          Your consistency,
          sessions, and training
          history in one place.
        </p>

      </section>

      <section className="calendar-stats">

        <div className="calendar-stat-card">

          <small>
            TRAINING DAYS
          </small>

          <strong>
            {trainingDays}
          </strong>

        </div>

        <div className="calendar-stat-card">

          <small>
            WORKOUTS
          </small>

          <strong>
            {monthlyWorkouts}
          </strong>

        </div>

        <div className="calendar-stat-card">

          <small>
            MONTH
          </small>

          <strong>
            {displayDate
              .toLocaleDateString(
                undefined,
                {
                  month: "short",
                }
              )
              .toUpperCase()}
          </strong>

        </div>

      </section>

      <section className="calendar-card">

        <div className="calendar-header">

          <button
            type="button"
            onClick={() =>
              changeMonth(-1)
            }
            aria-label="Previous month"
          >
            ‹
          </button>

          <div>

            <span>
              TRAINING ACTIVITY
            </span>

            <h3>
              {monthName}
            </h3>

          </div>

          <button
            type="button"
            onClick={() =>
              changeMonth(1)
            }
            aria-label="Next month"
          >
            ›
          </button>

        </div>

        <div className="calendar-weekdays">

          {[
            "SUN",
            "MON",
            "TUE",
            "WED",
            "THU",
            "FRI",
            "SAT",
          ].map((day) => (

            <span key={day}>
              {day}
            </span>

          ))}

        </div>

        <div className="calendar-grid">

          {calendarDays.map(
            (day, index) => {

              if (!day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="calendar-day empty"
                  />
                );
              }

              const dateKey =
                getDateKey(day);

              const workouts =
                workoutsByDate[
                  dateKey
                ] || [];

              const hasWorkout =
                workouts.length > 0;

            const hasPR =
  prDates.has(dateKey);

              const isToday =
                dateKey ===
                getLocalDateKey(
                  today
                );

              const isSelected =
                dateKey ===
                selectedDate;

              return (
                <button
                  type="button"
                  key={dateKey}
                  className={[
                    "calendar-day",
                    hasWorkout
                      ? "trained"
                      : "",
                    hasPR
                      ? "pr"
                      : "",
                    isToday
                      ? "today"
                      : "",
                    isSelected
                      ? "selected"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    setSelectedDate(
                      dateKey
                    )
                  }
                >

                  <span className="calendar-number">
                    {day}
                  </span>

                  {hasWorkout && (

                    <span className="calendar-workout-marker">
                      ◆
                    </span>

                  )}

                  {hasPR && (

  <span className="calendar-pr-badge">
    🏆 PR
  </span>

)}

                  {workouts.length > 1 && (

                    <small>
                      {workouts.length}
                    </small>

                  )}

                </button>
              );
            }
          )}

        </div>

        <div className="calendar-legend">

          <span>
            <i className="legend-trained">
              ◆
            </i>
            Workout logged
          </span>

          <span>
  <i className="legend-pr">
    🏆
  </i>
  Personal record
</span>

          <span>
            <i className="legend-today">
              ◇
            </i>
            Today
          </span>

        </div>

      </section>

      {selectedDate && (

        <section className="calendar-details">

          <div className="calendar-details-header">

            <div>

              <span>
                DAILY LOG
              </span>

              <h3>
                {selectedLabel}
              </h3>

            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedDate(null)
              }
            >
              ×
            </button>

          </div>

          {selectedWorkouts.length ===
          0 ? (

            <div className="calendar-rest-day">

              <span>◇</span>

              <h4>
                No Workout Logged
              </h4>

              <p>
                No training session
                was recorded on this
                day.
              </p>

            </div>

          ) : (

            selectedWorkouts.map(
  (workout, workoutIndex) => {

    let totalSets = 0;
    let totalReps = 0;
    let totalVolume = 0;

    workout.exercises?.forEach(
      (exercise) => {

        exercise.sets?.forEach(
          (set) => {

            const weight =
              Number(set.weight) || 0;

            const reps =
              Number(set.reps) || 0;

            totalSets += 1;
            totalReps += reps;

            totalVolume +=
              weight * reps;

          }
        );

      }
    );

    return (

      <article
                  className="calendar-session"
                  key={
                    workout.id ||
                    workoutIndex
                  }
                >

                  <div className="calendar-session-top">

                    <strong>
                      SESSION{" "}
                      {selectedWorkouts.length >
                      1
                        ? workoutIndex +
                          1
                        : ""}
                    </strong>

                    <span>
                      {formatDuration(
                        workout.duration
                      )}
                    </span>

                  </div>

                  <div className="calendar-exercises">

                    {workout.exercises?.map(
                      (
                        exercise,
                        exerciseIndex
                      ) => (

                        <div
  className="calendar-exercise"
  key={
    exercise.id ||
    exerciseIndex
  }
>

    <div className="calendar-session-summary">

  <span className="calendar-summary-label">
    SESSION SUMMARY
  </span>

  <div className="calendar-summary-grid">

    <div>
      <small>DURATION</small>

      <strong>
        {formatDuration(
          workout.duration
        )}
      </strong>
    </div>

    <div>
      <small>EXERCISES</small>

      <strong>
        {workout.exercises?.length || 0}
      </strong>
    </div>

    <div>
      <small>TOTAL SETS</small>

      <strong>
        {totalSets}
      </strong>
    </div>

    <div>
      <small>TOTAL REPS</small>

      <strong>
        {totalReps}
      </strong>
    </div>

    <div>
      <small>VOLUME</small>

      <strong>
        {totalVolume.toLocaleString()} LB
      </strong>
    </div>

  </div>

</div>

  <div className="calendar-exercise-header">

    <strong>
      {exercise.exercise}
    </strong>

    <span>
      {exercise.sets?.length || 0} sets
    </span>

  </div>

  <div className="calendar-set-list">

    {exercise.sets?.map(
      (set, setIndex) => {

        const weight =
          Number(set.weight) || 0;

        const reps =
          Number(set.reps) || 0;

        return (
          <div
            className="calendar-set-row"
            key={
              set.id ||
              setIndex
            }
          >

            <span className="calendar-set-number">
              SET {setIndex + 1}
            </span>

            <strong>
              {weight > 0
                ? `${weight} LB`
                : "—"}
            </strong>

            <span className="calendar-set-x">
              ×
            </span>

            <strong>
              {reps > 0
                ? reps
                : "—"}
            </strong>

            <span className="calendar-reps-label">
              REPS
            </span>

          </div>
        );
      }
    )}

  </div>

</div>

                      )
                    )}

                  </div>

                </article>

              );
  }
)

          )}

        </section>

      )}

    </div>
  );
}

export default CalendarPage;