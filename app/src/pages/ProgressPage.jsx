import "../styles/Progress.css";

import {
  useEffect,
  useState,
} from "react";

import {
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  isTrackableExercise,
  normalizeExerciseName,
} from "../utils/workoutAnalytics";

function getDateKey(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatGraphDate(dateKey) {
  if (!dateKey) {
    return "";
  }

  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  const date = new Date(
    year,
    month - 1,
    day
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}

function ProgressPage({
  workoutHistory = [],
  metrics = {},
}) {
  const workoutRecords = {};

  const historyByExerciseAndDay = {};

  let trackedSetsLogged = 0;

  let trackedWeightLifted = 0;

  workoutHistory.forEach((session) => {
    if (
      !Array.isArray(
        session?.exercises
      )
    ) {
      return;
    }

    const dateKey = getDateKey(
      session.date
    );

    if (!dateKey) {
      return;
    }

    session.exercises.forEach(
      (exercise) => {
        const rawExerciseName =
          exercise?.exercise ||
          exercise?.name ||
          "";

        if (
          !isTrackableExercise(
            rawExerciseName
          )
        ) {
          return;
        }

        const exerciseName =
          normalizeExerciseName(
            rawExerciseName
          );

        const sets = Array.isArray(
          exercise.sets
        )
          ? exercise.sets
          : [
              {
                weight:
                  exercise.weight,
                reps:
                  exercise.reps,
              },
            ];

        let bestWeight = null;

        let best1RM = null;

        let totalVolume = 0;

        sets.forEach((set) => {
          const weight = Number(
            set.weight
          );

          const reps = Number(
            set.reps
          );

          if (
            !Number.isFinite(
              weight
            ) ||
            !Number.isFinite(
              reps
            ) ||
            weight <= 0 ||
            reps <= 0
          ) {
            return;
          }

          trackedSetsLogged += 1;

          const setVolume =
            weight * reps;

          trackedWeightLifted +=
            setVolume;

          totalVolume += setVolume;

          const estimated1RM =
            weight *
            (1 + reps / 30);

          if (
            bestWeight === null ||
            weight > bestWeight
          ) {
            bestWeight = weight;
          }

          if (
            best1RM === null ||
            estimated1RM >
              best1RM
          ) {
            best1RM =
              estimated1RM;
          }

          if (
  !workoutRecords[
    exerciseName
  ] ||
  weight >
    workoutRecords[
      exerciseName
    ]
) {
  workoutRecords[
    exerciseName
  ] = weight;
}
        });

        if (
          bestWeight === null
        ) {
          return;
        }

        if (
          !historyByExerciseAndDay[
            exerciseName
          ]
        ) {
          historyByExerciseAndDay[
            exerciseName
          ] = {};
        }

        const existingEntry =
          historyByExerciseAndDay[
            exerciseName
          ][dateKey];

        if (!existingEntry) {
          historyByExerciseAndDay[
            exerciseName
          ][dateKey] = {
            dateKey,

            date:
              formatGraphDate(
                dateKey
              ),

            bestWeight,

            estimated1RM:
              Math.round(
                best1RM
              ),

            volume:
              totalVolume,
          };

          return;
        }

        existingEntry.bestWeight =
          Math.max(
            existingEntry.bestWeight,
            bestWeight
          );

        existingEntry.estimated1RM =
          Math.max(
            existingEntry.estimated1RM,
            Math.round(
              best1RM
            )
          );

        existingEntry.volume +=
          totalVolume;
      }
    );
  });

  const personalRecords = {
  "Bench Press":
    Number(metrics.bench || 0),

  Squat:
    Number(metrics.squat || 0),

  Deadlift:
    Number(metrics.deadlift || 0),

  "Power Clean":
    Number(metrics.powerClean || 0),
};

Object.keys(
  personalRecords
).forEach((exerciseName) => {

  if (
    personalRecords[
      exerciseName
    ] <= 0
  ) {
    delete personalRecords[
      exerciseName
    ];
  }

});

  const exerciseHistory = {};

  Object.entries(
    historyByExerciseAndDay
  ).forEach(
    ([
      exerciseName,
      dailyEntries,
    ]) => {
      exerciseHistory[
        exerciseName
      ] = Object.values(
        dailyEntries
      ).sort(
        (first, second) =>
          first.dateKey.localeCompare(
            second.dateKey
          )
      );
    }
  );

  const exerciseNames =
    Object.keys(
      exerciseHistory
    ).sort((first, second) =>
      first.localeCompare(second)
    );

  const [
    selectedExercise,
    setSelectedExercise,
  ] = useState("");

  const [
    graphType,
    setGraphType,
  ] = useState("bestWeight");

  useEffect(() => {
    if (
      exerciseNames.length === 0
    ) {
      setSelectedExercise("");
      return;
    }

    if (
      !exerciseNames.includes(
        selectedExercise
      )
    ) {
      setSelectedExercise(
        exerciseNames[0]
      );
    }
  }, [
    exerciseNames,
    selectedExercise,
  ]);

  const graphTitles = {
    bestWeight: "Best Weight",
    estimated1RM:
      "Estimated 1RM",
    volume: "Training Volume",
  };

  const selectedHistory =
    exerciseHistory[
      selectedExercise
    ] || [];

  const latestEntry =
    selectedHistory[
      selectedHistory.length - 1
    ];

  const majorLiftsRecorded =
    Object.keys(
      personalRecords
    ).length;

  const selectedValue =
    latestEntry?.[graphType] ?? 0;

  const selectedUnit = "lbs";

  return (
    <main className="progress-page">
      <section className="progress-hero">
        <span className="progress-system-tag">
          PROJECT DRIVE SYSTEM
        </span>

        <h1>ATHLETE PROGRESS</h1>

        <p>
          Track your major lifts,
          training volume, estimated
          strength, and long-term
          development.
        </p>
      </section>

      <section className="progress-stat-grid">
        <article className="progress-stat-card">
          <span className="progress-stat-label">
            TOTAL WORKOUTS
          </span>

          <strong>
            {workoutHistory.length.toLocaleString()}
          </strong>

          <p>
            Sessions recorded
          </p>
        </article>

        <article className="progress-stat-card">
          <span className="progress-stat-label">
            MAJOR LIFT SETS
          </span>

          <strong>
            {trackedSetsLogged.toLocaleString()}
          </strong>

          <p>
            Trackable sets logged
          </p>
        </article>

        <article className="progress-stat-card">
          <span className="progress-stat-label">
            TOTAL VOLUME
          </span>

          <strong>
            {trackedWeightLifted.toLocaleString()}
          </strong>

          <p>
            Pounds moved
          </p>
        </article>

        <article className="progress-stat-card">
          <span className="progress-stat-label">
            LIFTS TRACKED
          </span>

          <strong>
            {majorLiftsRecorded.toLocaleString()}
          </strong>

          <p>
            Major exercises recorded
          </p>
        </article>
      </section>

      <section className="progress-chart-card">
        <div className="progress-section-header">
          <div>
            <span className="progress-eyebrow">
              STRENGTH ANALYTICS
            </span>

            <h2>
              Major Lift Progress
            </h2>

            <p>
              Compare your performance
              across every recorded
              training day.
            </p>
          </div>

          {selectedExercise && (
            <span className="progress-exercise-badge">
              {selectedExercise}
            </span>
          )}
        </div>

        {exerciseNames.length === 0 ? (
          <div className="progress-empty-state">
            <div className="progress-empty-icon">
              📈
            </div>

            <h3>
              No Major Lifts Yet
            </h3>

            <p>
              Log a trackable major lift
              to begin building your
              progress chart.
            </p>
          </div>
        ) : (
          <>
            <div className="progress-controls">
              <label className="progress-control">
                <span>
                  Exercise
                </span>

                <select
                  value={
                    selectedExercise
                  }
                  onChange={(event) =>
                    setSelectedExercise(
                      event.target.value
                    )
                  }
                >
                  {exerciseNames.map(
                    (exerciseName) => (
                      <option
                        key={
                          exerciseName
                        }
                        value={
                          exerciseName
                        }
                      >
                        {
                          exerciseName
                        }
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="progress-control">
                <span>
                  Metric
                </span>

                <select
                  value={graphType}
                  onChange={(event) =>
                    setGraphType(
                      event.target.value
                    )
                  }
                >
                  <option value="bestWeight">
                    Best Weight
                  </option>

                  <option value="estimated1RM">
                    Estimated 1RM
                  </option>

                  <option value="volume">
                    Training Volume
                  </option>
                </select>
              </label>
            </div>

            {latestEntry && (
              <div className="progress-current-result">
                <div>
                  <span className="progress-result-label">
                    CURRENT RESULT
                  </span>

                  <div className="progress-result-value">
                    {selectedValue.toLocaleString()}

                    <span>
                      {selectedUnit}
                    </span>
                  </div>
                </div>

                <div className="progress-result-details">
                  <div>
                    <span>
                      Metric
                    </span>

                    <strong>
                      {
                        graphTitles[
                          graphType
                        ]
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Training Days
                    </span>

                    <strong>
                      {
                        selectedHistory.length
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Latest Entry
                    </span>

                    <strong>
                      {
                        latestEntry.date
                      }
                    </strong>
                  </div>
                </div>
              </div>
            )}

            <div className="progress-chart-wrapper">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={
                    selectedHistory
                  }
                  margin={{
                    top: 15,
                    right: 20,
                    bottom: 5,
                    left: 0,
                  }}
                >
                  <CartesianGrid
                    stroke="rgba(123, 195, 255, 0.09)"
                    strokeDasharray="4 6"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    interval="preserveStartEnd"
                    stroke="#6f9bc3"
                    tick={{
                      fill: "#8db7dc",
                      fontSize: 12,
                    }}
                    tickLine={false}
                    axisLine={{
                      stroke:
                        "rgba(123, 195, 255, 0.16)",
                    }}
                  />

                  <YAxis
                    stroke="#6f9bc3"
                    tick={{
                      fill: "#8db7dc",
                      fontSize: 12,
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={65}
                    tickFormatter={(
                      value
                    ) =>
                      Number(
                        value
                      ).toLocaleString()
                    }
                  />

                  <Tooltip
                    cursor={{
                      stroke:
                        "rgba(95, 203, 255, 0.3)",
                      strokeWidth: 1,
                    }}
                    contentStyle={{
                      background:
                        "rgba(7, 17, 31, 0.96)",
                      border:
                        "1px solid rgba(89, 192, 255, 0.35)",
                      borderRadius:
                        "14px",
                      boxShadow:
                        "0 0 24px rgba(49, 149, 255, 0.2)",
                      color: "#ffffff",
                    }}
                    labelStyle={{
                      color:
                        "#8fd6ff",
                      marginBottom:
                        "6px",
                    }}
                    itemStyle={{
                      color:
                        "#ffffff",
                    }}
                    labelFormatter={(
                      label
                    ) =>
                      `Date: ${label}`
                    }
                    formatter={(
                      value
                    ) => [
                      `${Number(
                        value
                      ).toLocaleString()} lbs`,
                      graphTitles[
                        graphType
                      ],
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey={graphType}
                    stroke="#4bc4ff"
                    strokeWidth={4}
                    dot={{
                      r: 5,
                      fill: "#09182b",
                      stroke:
                        "#75dcff",
                      strokeWidth: 3,
                    }}
                    activeDot={{
                      r: 8,
                      fill: "#f6d46f",
                      stroke:
                        "#fff1ad",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </section>

      <section className="progress-records-card">
        <div className="progress-section-header">
          <div>
            <span className="progress-eyebrow">
              ATHLETE RECORDS
            </span>

            <h2>
              Personal Bests
            </h2>

            <p>
              Your highest recorded
              weight for every tracked
              major lift.
            </p>
          </div>
        </div>

        {majorLiftsRecorded === 0 ? (
          <div className="progress-records-empty">
            Personal records will appear
            after you log a major lift.
          </div>
        ) : (
          <div className="progress-records-grid">
            {Object.entries(
              personalRecords
            )
              .sort(
                (
                  [firstName],
                  [secondName]
                ) =>
                  firstName.localeCompare(
                    secondName
                  )
              )
              .map(
                ([
                  exerciseName,
                  record,
                ]) => (
                  <article
                    key={
                      exerciseName
                    }
                    className="progress-record-item"
                  >
                    <span>
                      PERSONAL RECORD
                    </span>

                    <h3>
                      {
                        exerciseName
                      }
                    </h3>

                    <strong>
                      {Number(
                        record
                      ).toLocaleString()}

                      <small>
                        lbs
                      </small>
                    </strong>
                  </article>
                )
              )}
          </div>
        )}
      </section>
    </main>
  );
}

export default ProgressPage;