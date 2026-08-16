import { useState } from "react";

import coachAnalysis from "../utils/coachAnalysis";
import trendAnalysis from "../utils/trendAnalysis";
import coachPriorities from "../utils/coachPriorities";
import recoveryAnalysis from "../utils/recoveryAnalysis";

import { askCoach } from "../services/coachAPI";

const defaultRecovery = {
  sleepHours: "",
  sleepQuality: 3,
  soreness: 5,
  energy: 5,
  mood: 5,
  hydration: 5,
};

export default function CoachingPage({
  workoutHistory = [],
  metrics = {},
  goals = {},
  performanceHistory = {},
  streak = 0,
  achievements = {},
  weeklyWorkoutCount = 0,
  latestWorkout = null,
  personalRecords = {},
  strongestLift = null,
  mostTrainedExercise = null,
  player = {},
  xp = 0,
  level = 1,
  recovery = defaultRecovery,
  updateRecovery = () => {},
  recoveryScore = 0,
  readiness = "RECOVERY",
  recoveryHistory = [],
  saveRecoveryCheckIn = () => {},
}) {
  const [expandedPriority, setExpandedPriority] = useState(null);
  const [question, setQuestion] = useState("");
  const [coachReply, setCoachReply] = useState("");
  const [loading, setLoading] = useState(false);

  const report = coachAnalysis({
    workoutHistory,
    metrics,
    goals,
    performanceHistory,
    streak,
    achievements,
    weeklyWorkoutCount,
    latestWorkout,
    personalRecords,
    strongestLift,
    mostTrainedExercise,
    player,
    xp,
    level,
  });

  const trends = trendAnalysis(performanceHistory);

  const recoveryTrends =
  recoveryAnalysis(
    recoveryHistory
  );

  const priorities = coachPriorities({
    recoveryScore,
    readiness,
    trends,
    recoveryTrends,
  });

  const readinessClass = String(readiness || "RECOVERY")
    .replace(/\s+/g, "-")
    .toLowerCase();

  async function handleAskCoach() {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || loading) return;

    setLoading(true);
    setCoachReply("");

    try {
      const response = await askCoach(cleanQuestion, {
        player,
        metrics,
        goals,
        workoutHistory,
        performanceHistory,
        streak,
        achievements,
        weeklyWorkoutCount,
        latestWorkout,
        personalRecords,
        strongestLift,
        mostTrainedExercise,
        xp,
        level,
        recovery,
        recoveryScore,
        readiness,
        recoveryTrends,
        trends,
        priorities,
      });

      setCoachReply(
        response?.reply ||
          "Coach AI did not return a response."
      );
    } catch (error) {
      console.error("Unable to contact Coach AI:", error);

      setCoachReply(
        "Unable to contact Coach AI."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleQuestionKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAskCoach();
    }
  }

  return (
    <div className="coach-page">
      <h2>🧠 Live Coaching</h2>

      <div className="coach-rank-card">
        <span className="system-label">
          SYSTEM ANALYSIS
        </span>

        <div className="coach-grade">{report.grade}</div>

        <h3>{report.title}</h3>

        <p>Overall Athlete Rating</p>

        <div className="overall-score">
          {report.overallScore}/100
        </div>
      </div>

      <div className="coach-card">
        <h3>📋 Coach&apos;s Report</h3>

        <p className="coach-summary">
          {report.summary}
        </p>
      </div>

      <div className="coach-card">
        <h3>🔥 Today&apos;s Priorities</h3>

        {priorities.length === 0 ? (
          <p>
            Continue logging recovery and performance data to
            unlock personalized priorities.
          </p>
        ) : (
          priorities.map((priority, index) => {
            const isExpanded =
              expandedPriority === priority.id;

            return (
              <button
                key={priority.id}
                type="button"
                className={`priority-card ${
                  isExpanded ? "expanded" : ""
                }`}
                onClick={() =>
                  setExpandedPriority(
                    isExpanded ? null : priority.id
                  )
                }
                aria-expanded={isExpanded}
              >
                <div className="priority-icon">
                  {priority.icon}
                </div>

                <div className="priority-content">
                  <div className="priority-heading">
                    <strong>
                      {index + 1}. {priority.title}
                    </strong>

                    <span className="priority-toggle">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </div>

                  <p>{priority.description}</p>

                  {isExpanded && (
                    <div className="priority-expanded">
                      <div className="priority-detail">
                        <h4>Why This Was Chosen</h4>
                        <p>{priority.why}</p>
                      </div>

                      <div className="priority-detail">
                        <h4>Action Plan</h4>

                        <ul>
                          {priority.actions.map(
                            (action, actionIndex) => (
                              <li
                                key={`${priority.id}-action-${actionIndex}`}
                              >
                                {action}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div className="priority-detail">
                        <h4>Why It Matters</h4>
                        <p>{priority.importance}</p>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="coach-card">
        <h3>📊 Athlete Breakdown</h3>

        <div className="coach-row">
          <span>Consistency</span>
          <strong>{report.breakdown.consistency}/25</strong>
        </div>

        <div className="coach-row">
          <span>Strength</span>
          <strong>{report.breakdown.strength}/25</strong>
        </div>

        <div className="coach-row">
          <span>Performance</span>
          <strong>{report.breakdown.performance}/20</strong>
        </div>

        <div className="coach-row">
          <span>Recovery</span>
          <strong>{report.breakdown.recovery}/15</strong>
        </div>

        <div className="coach-row">
          <span>Goals</span>
          <strong>{report.breakdown.goals}/15</strong>
        </div>
      </div>

      <div className="recovery-status-card">
        <span className="system-label">
          RECOVERY ANALYSIS
        </span>

        <div className="recovery-score">{recoveryScore}</div>

        <div className={`readiness-badge ${readinessClass}`}>
          {readiness}
        </div>

        <div className="recovery-message">
          {readiness === "READY" &&
            "Your body is primed for a full training session."}

          {readiness === "LIGHT DAY" &&
            "Reduce training intensity and prioritize quality movement."}

          {readiness === "RECOVERY" &&
            "Focus on sleep, hydration, nutrition, and recovery today."}
        </div>
      </div>

      <div className="coach-card">
        <h3>💤 Recovery Check-In</h3>

        <div className="recovery-grid">
          <div className="recovery-input">
            <label htmlFor="sleep-hours">
              Sleep (Hours)
            </label>

            <input
              id="sleep-hours"
              type="number"
              min="0"
              max="12"
              step="0.5"
              value={recovery.sleepHours}
              onChange={(event) =>
                updateRecovery(
                  "sleepHours",
                  event.target.value
                )
              }
            />
          </div>

          <RecoveryRange
            id="sleep-quality"
            label="Sleep Quality"
            min={1}
            max={5}
            value={recovery.sleepQuality}
            onChange={(value) =>
              updateRecovery("sleepQuality", value)
            }
          />

          <RecoveryRange
            id="energy"
            label="Energy"
            min={1}
            max={10}
            value={recovery.energy}
            onChange={(value) =>
              updateRecovery("energy", value)
            }
          />

          <RecoveryRange
            id="soreness"
            label="Soreness"
            min={1}
            max={10}
            value={recovery.soreness}
            onChange={(value) =>
              updateRecovery("soreness", value)
            }
          />

          <RecoveryRange
            id="mood"
            label="Mood"
            min={1}
            max={10}
            value={recovery.mood}
            onChange={(value) =>
              updateRecovery("mood", value)
            }
          />

          <RecoveryRange
            id="hydration"
            label="Hydration"
            min={1}
            max={10}
            value={recovery.hydration}
            onChange={(value) =>
              updateRecovery("hydration", value)
            }
          />
        </div>

        <button
  type="button"
  className="recovery-save-button"
  onClick={saveRecoveryCheckIn}
>
  SAVE TODAY&apos;S CHECK-IN
</button>

      </div>

      <div className="coach-card recovery-history-card">

  <div className="recovery-history-header">

    <div>

      <span className="system-label">
        RECOVERY LOG
      </span>

      <h3>
        📅 Recent Recovery
      </h3>

    </div>

    <span className="recovery-entry-count">
      {recoveryHistory.length} CHECK-INS
    </span>

  </div>

  {recoveryHistory.length === 0 ? (

    <div className="recovery-history-empty">

      <span>◇</span>

      <p>
        No recovery check-ins saved yet.
      </p>

    </div>

  ) : (

    <div className="recovery-history-list">

      {recoveryHistory
        .slice(0, 5)
        .map((entry) => {

          const entryReadinessClass =
            String(
              entry.readiness ||
              "RECOVERY"
            )
              .replace(/\s+/g, "-")
              .toLowerCase();

          return (

            <div
              className="recovery-history-entry"
              key={entry.id}
            >

              <div className="recovery-history-date">

                {new Date(
                  `${entry.date}T12:00:00`
                ).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                  }
                )}

              </div>

              <div className="recovery-history-score">

                <strong>
                  {entry.score}
                </strong>

                <span>/100</span>

              </div>

              <div
                className={
                  `recovery-history-readiness ${entryReadinessClass}`
                }
              >
                {entry.readiness}
              </div>

              <div className="recovery-history-metrics">

                <span>
                  Sleep
                  <strong>
                    {entry.sleepHours}h
                  </strong>
                </span>

                <span>
                  Energy
                  <strong>
                    {entry.energy}/10
                  </strong>
                </span>

                <span>
                  Soreness
                  <strong>
                    {entry.soreness}/10
                  </strong>
                </span>

              </div>

            </div>

          );

        })}

    </div>

  )}

  </div>

  <div className="coach-card recovery-trends-card">

  <div className="recovery-trends-header">

    <div>

      <span className="system-label">
        RECOVERY INTELLIGENCE
      </span>

      <h3>
        📈 Recovery Trends
      </h3>

    </div>

    {recoveryTrends.checkInCount >= 3 && (

      <div
        className={`recovery-trend-badge ${recoveryTrends.trend}`}
      >

        {recoveryTrends.trend ===
          "improving" && "↗"}

        {recoveryTrends.trend ===
          "stable" && "→"}

        {recoveryTrends.trend ===
          "declining" && "↘"}

        {" "}

        {recoveryTrends.trend.toUpperCase()}

      </div>

    )}

  </div>

  {recoveryTrends.checkInCount === 0 ? (

    <div className="recovery-trends-empty">

      <span>◇</span>

      <p>
        Save recovery check-ins to
        begin trend analysis.
      </p>

    </div>

  ) : (

    <>

      <div className="recovery-trend-stats">

        <div>

          <small>
            RECOVERY AVG
          </small>

          <strong>
            {recoveryTrends.averageScore}
            <span>/100</span>
          </strong>

        </div>

        <div>

          <small>
            AVG SLEEP
          </small>

          <strong>
            {recoveryTrends.averageSleep}
            <span>h</span>
          </strong>

        </div>

        <div>

          <small>
            AVG ENERGY
          </small>

          <strong>
            {recoveryTrends.averageEnergy}
            <span>/10</span>
          </strong>

        </div>

        <div>

          <small>
            AVG SORENESS
          </small>

          <strong>
            {recoveryTrends.averageSoreness}
            <span>/10</span>
          </strong>

        </div>

      </div>

      {recoveryTrends.checkInCount >= 3 && (

        <div className="recovery-factor-grid">

          <div className="recovery-factor-card strongest">

            <span>
              STRONGEST FACTOR
            </span>

            <strong>
              {
                recoveryTrends
                  .strongestFactor
                  ?.label
              }
            </strong>

          </div>

          <div className="recovery-factor-card limiter">

            <span>
              BIGGEST LIMITER
            </span>

            <strong>
              {
                recoveryTrends
                  .weakestFactor
                  ?.label
              }
            </strong>

          </div>

        </div>

      )}

      <div className="recovery-system-insight">

        <span>
          SYSTEM INSIGHT
        </span>

        <p>
          {recoveryTrends.insight}
        </p>

      </div>

    </>

  )}

</div>

      <div className="coach-grid">
        <div className="coach-card">
          <h3>⚠ System Alerts</h3>

          {report.alerts.length === 0 ? (
            <p>No alerts.</p>
          ) : (
            report.alerts.map((alert, index) => (
              <div
                key={`${alert}-${index}`}
                className="coach-alert"
              >
                {alert}
              </div>
            ))
          )}
        </div>

        <div className="coach-card">
          <h3>🧠 Coach Recommendations</h3>

          {report.recommendations.length === 0 ? (
            <p>No additional recommendations right now.</p>
          ) : (
            report.recommendations.map((tip, index) => (
              <div
                key={`${tip}-${index}`}
                className="coach-tip"
              >
                {tip}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="coach-card">
        <h3>Training Summary</h3>

        <div className="coach-row">
          <span>Workouts Logged</span>
          <strong>{report.workoutCount}</strong>
        </div>

        <div className="coach-row">
          <span>Athlete Grade</span>
          <strong>{report.grade}</strong>
        </div>

        <div className="coach-row">
          <span>Athlete Score</span>
          <strong>{report.overallScore}/100</strong>
        </div>

        <div className="coach-row">
          <span>Status</span>
          <strong>{report.title}</strong>
        </div>
      </div>

      <div className="coach-card">
        <h3>📈 Trend Analysis</h3>

        <p className="trend-headline">
          {trends.headline}
        </p>

        {trends.trends.length === 0 ? (
          <p>
            Save at least one performance result to begin
            trend tracking.
          </p>
        ) : (
          <div className="trend-grid">
            {trends.trends.map((trend) => (
              <div
                key={trend.metricKey}
                className={`trend-card ${trend.status}`}
              >
                <div className="trend-icon">
                  {trend.icon}
                </div>

                <h4>{trend.label}</h4>

                <strong>
                  {trend.latestValue} {trend.unit}
                </strong>

                <p>{trend.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="coach-card">
        <h3>💬 Ask Coach</h3>

        <textarea
          className="coach-input"
          rows={4}
          placeholder="Ask anything about your training..."
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          onKeyDown={handleQuestionKeyDown}
        />

        <button
          type="button"
          className="coach-send"
          onClick={handleAskCoach}
          disabled={loading || !question.trim()}
        >
          {loading ? "Thinking..." : "Ask Coach"}
        </button>

        {coachReply && (
          <div className="coach-response">
            <h4>🧠 PROJECT DRIVE AI</h4>
            <p>{coachReply}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RecoveryRange({
  id,
  label,
  min,
  max,
  value,
  onChange,
}) {
  return (
    <div className="recovery-input">
      <label htmlFor={id}>
        {label} ({min}–{max})
      </label>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      <span>{value}</span>
    </div>
  );
}