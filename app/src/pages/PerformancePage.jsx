import { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getMostFrequentExercise,
  getPersonalRecords,
  getStrongestLift,
  getTotalVolume,
  getWorkoutCount,
} from "../utils/workoutAnalytics";

function formatHistoryDate(dateValue) {
  if (!dateValue) return "";

  const [year, month, day] = dateValue
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

function PerformancePage({
  metrics,
  updateMetric,
  goals,
  updateGoal,
  workoutHistory = [],
  performanceHistory = {},
  saveMetricResult,
}) {
  const [
    saveMessages,
    setSaveMessages,
  ] = useState({});

  const exerciseHistory =
    workoutHistory.flatMap((workout) => {
      if (
        Array.isArray(
          workout?.exercises
        )
      ) {
        return workout.exercises;
      }

      return workout ? [workout] : [];
    });

  const calculatedRecords =
    getPersonalRecords(exerciseHistory);

  const strongestLift =
    getStrongestLift(
      calculatedRecords
    );

  const mostFrequentExercise =
    getMostFrequentExercise(
      exerciseHistory
    );

  const totalVolume =
    getTotalVolume(exerciseHistory);

  const workoutCount =
    getWorkoutCount(workoutHistory);

  function getProgress(
    current,
    goal,
    lowerIsBetter = false
  ) {
    const currentNum =
      Number(current);

    const goalNum =
      Number(goal);

    if (
      !currentNum ||
      !goalNum ||
      currentNum <= 0 ||
      goalNum <= 0
    ) {
      return 0;
    }

    const percentage =
      lowerIsBetter
        ? (goalNum / currentNum) *
          100
        : (currentNum / goalNum) *
          100;

    return Math.min(
      Math.round(percentage),
      100
    );
  }

  function getRemaining(
    current,
    goal,
    lowerIsBetter = false
  ) {
    const currentNum =
      Number(current);

    const goalNum =
      Number(goal);

    if (!currentNum || !goalNum) {
      return null;
    }

    const difference =
      lowerIsBetter
        ? currentNum - goalNum
        : goalNum - currentNum;

    return Math.max(
      difference,
      0
    ).toFixed(1);
  }

  function hasReachedGoal(
    current,
    goal,
    lowerIsBetter = false
  ) {
    const currentNum =
      Number(current);

    const goalNum =
      Number(goal);

    if (!currentNum || !goalNum) {
      return false;
    }

    return lowerIsBetter
      ? currentNum <= goalNum
      : currentNum >= goalNum;
  }

  function handleSaveResult(
    metricKey
  ) {
    if (!saveMetricResult) {
      return;
    }

    const result =
      saveMetricResult(metricKey);

    setSaveMessages(
      (previous) => ({
        ...previous,
        [metricKey]:
          result.message,
      })
    );

    window.setTimeout(() => {
      setSaveMessages(
        (previous) => ({
          ...previous,
          [metricKey]: "",
        })
      );
    }, 3000);
  }

  function renderMetric(
    label,
    valueKey,
    dateKey,
    placeholder,
    unit,
    lowerIsBetter = false
  ) {
    const progress = getProgress(
      metrics[valueKey],
      goals[valueKey],
      lowerIsBetter
    );

    const remaining = getRemaining(
      metrics[valueKey],
      goals[valueKey],
      lowerIsBetter
    );

    const goalReached =
      hasReachedGoal(
        metrics[valueKey],
        goals[valueKey],
        lowerIsBetter
      );

    const metricHistory = (
      performanceHistory[
        valueKey
      ] || []
    ).map((entry) => ({
      ...entry,
      displayDate:
        formatHistoryDate(
          entry.date
        ),
    }));

    const latestHistoryEntry =
      metricHistory[
        metricHistory.length - 1
      ];

    const saveMessage =
      saveMessages[valueKey];

    return (
      <div className="metric-card">
        <div className="metric-heading-row">
          <h4>{label}</h4>

          {latestHistoryEntry && (
            <span className="metric-entry-count">
              {metricHistory.length}{" "}
              {metricHistory.length ===
              1
                ? "entry"
                : "entries"}
            </span>
          )}
        </div>

        <div className="metric-input-row">
          <input
            type="number"
            step="any"
            value={
              metrics[valueKey]
            }
            placeholder={
              placeholder
            }
            onChange={(event) =>
              updateMetric(
                valueKey,
                event.target.value
              )
            }
          />

          <span className="metric-unit">
            {unit}
          </span>
        </div>

        <input
          type="date"
          value={
            metrics[dateKey]
          }
          onChange={(event) =>
            updateMetric(
              dateKey,
              event.target.value
            )
          }
        />

        <button
          type="button"
          className="metric-save-button"
          onClick={() =>
            handleSaveResult(
              valueKey
            )
          }
        >
          Save Result
        </button>

        {saveMessage && (
          <p className="metric-save-message">
            {saveMessage}
          </p>
        )}

        {latestHistoryEntry && (
          <div className="metric-latest-result">
            <span>
              Latest saved result
            </span>

            <strong>
              {
                latestHistoryEntry.value
              }{" "}
              {unit}
            </strong>

            <small>
              {
                latestHistoryEntry.displayDate
              }
            </small>
          </div>
        )}

        {metricHistory.length > 0 && (
          <div className="metric-chart">
            <ResponsiveContainer
              width="100%"
              height={190}
            >
              <LineChart
                data={metricHistory}
                margin={{
                  top: 15,
                  right: 15,
                  bottom: 5,
                  left: -15,
                }}
              >
                <XAxis
                  dataKey="displayDate"
                  interval="preserveStartEnd"
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis
                  domain={[
                    "dataMin",
                    "dataMax",
                  ]}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  labelFormatter={(
                    labelValue
                  ) =>
                    `Date: ${labelValue}`
                  }
                  formatter={(
                    resultValue
                  ) => [
                    `${resultValue} ${unit}`,
                    label,
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1976d2"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{
                    r: 6,
                  }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>

            <p className="metric-chart-label">
              {lowerIsBetter
                ? "Lower times show improvement"
                : "Performance history"}
            </p>
          </div>
        )}

        <div className="metric-goal-section">
          <label className="metric-goal-label">
            🎯 Goal
          </label>

          <div className="metric-input-row">
            <input
              type="number"
              step="any"
              value={
                goals[valueKey]
              }
              placeholder={`Goal (${unit})`}
              onChange={(event) =>
                updateGoal(
                  valueKey,
                  event.target.value
                )
              }
            />

            <span className="metric-unit">
              {unit}
            </span>
          </div>
        </div>

        {goals[valueKey] && (
          <>
            <div className="goal-progress">
              <div
                className="goal-progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="goal-text">
              {progress}% Complete
            </p>

            {remaining !== null &&
              Number(remaining) >
                0 &&
              !goalReached && (
                <p className="goal-remaining">
                  {remaining} {unit}{" "}
                  remaining
                </p>
              )}

            {goalReached && (
              <p className="goal-complete">
                🎉 Goal Reached!
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <main className="performance-page">

<section className="performance-hero">

    <span className="performance-system-tag">
        PROJECT DRIVE SYSTEM
    </span>

    <h1>ATHLETIC PERFORMANCE</h1>

    <p>
        Measure speed, explosiveness, strength,
        body composition, and athletic development
        over time.
    </p>

</section>

      <div className="performance-summary-grid">
        <div className="profile-card">
          <h3>
            Training Analytics
          </h3>

          <div className="pr-row">
            <span>
              Workouts Logged
            </span>

            <strong>
              {workoutCount}
            </strong>
          </div>

          <div className="pr-row">
            <span>
              Major Lift Volume
            </span>

            <strong>
              {totalVolume.toLocaleString()}{" "}
              lbs
            </strong>
          </div>

          <div className="pr-row">
            <span>
              Most Trained Lift
            </span>

            <strong>
              {mostFrequentExercise.exercise ||
                "No data"}
            </strong>
          </div>

          <div className="pr-row">
            <span>
              Times Trained
            </span>

            <strong>
              {mostFrequentExercise.count ||
                0}
            </strong>
          </div>
        </div>

        <div className="profile-card">
          <h3>
            Strength Summary
          </h3>

          <div className="pr-row">
            <span>
              Strongest Lift
            </span>

            <strong>
              {strongestLift.exercise ||
                "No data"}
            </strong>
          </div>

          <div className="pr-row">
            <span>
              Best Weight
            </span>

            <strong>
              {strongestLift.weight
                ? `${strongestLift.weight} lbs`
                : "--"}
            </strong>
          </div>

          <div className="pr-row">
            <span>
              Major Lifts Recorded
            </span>

            <strong>
              {
                Object.keys(
                  calculatedRecords
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Speed</h3>

          {renderMetric(
            "40 Yard Dash",
            "forty",
            "fortyDate",
            "5.20",
            "sec",
            true
          )}

          {renderMetric(
            "10 Yard Split",
            "tenSplit",
            "tenSplitDate",
            "1.80",
            "sec",
            true
          )}

          {renderMetric(
            "Shuttle",
            "shuttle",
            "shuttleDate",
            "4.60",
            "sec",
            true
          )}
        </div>

        <div className="profile-card">
          <h3>Explosiveness</h3>

          {renderMetric(
            "Vertical Jump",
            "vertical",
            "verticalDate",
            "28",
            "in"
          )}

          {renderMetric(
            "Broad Jump",
            "broad",
            "broadDate",
            "8.5",
            "ft"
          )}
        </div>

        <div className="profile-card">
          <h3>Strength</h3>

          {renderMetric(
            "Bench Max",
            "bench",
            "benchDate",
            "225",
            "lbs"
          )}

          {renderMetric(
            "Squat Max",
            "squat",
            "squatDate",
            "315",
            "lbs"
          )}

          {renderMetric(
            "Deadlift Max",
            "deadlift",
            "deadliftDate",
            "405",
            "lbs"
          )}

          {renderMetric(
            "Power Clean Max",
            "powerClean",
            "powerCleanDate",
            "205",
            "lbs"
          )}
        </div>

        <div className="profile-card">
          <h3>Body</h3>

          {renderMetric(
            "Bodyweight",
            "weight",
            "weightDate",
            "205",
            "lbs"
          )}

          {renderMetric(
            "Body Fat %",
            "bodyFat",
            "bodyFatDate",
            "15",
            "%"
          )}
        </div>
      </div>
    </main>
  );
}

export default PerformancePage;