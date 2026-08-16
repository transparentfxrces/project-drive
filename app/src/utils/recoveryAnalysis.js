export default function recoveryAnalysis(
  recoveryHistory = []
) {

  if (
    !Array.isArray(recoveryHistory) ||
    recoveryHistory.length === 0
  ) {
    return {
      checkInCount: 0,

      trend: "stable",
      trendChange: 0,

      averageScore: 0,
      averageSleep: 0,
      averageEnergy: 0,
      averageSoreness: 0,
      averageMood: 0,
      averageHydration: 0,
      averageSleepQuality: 0,
    };
  }

  /*
   * Only analyze the most recent
   * 7 recovery check-ins.
   */
  const recentEntries =
    recoveryHistory.slice(0, 7);

  const totals =
    recentEntries.reduce(
      (result, entry) => {

        result.score +=
          Number(entry.score) || 0;

        result.sleep +=
          Number(entry.sleepHours) || 0;

        result.energy +=
          Number(entry.energy) || 0;

        result.soreness +=
          Number(entry.soreness) || 0;

        result.mood +=
          Number(entry.mood) || 0;

        result.hydration +=
          Number(entry.hydration) || 0;

        result.sleepQuality +=
          Number(entry.sleepQuality) || 0;

        return result;
      },
      {
        score: 0,
        sleep: 0,
        energy: 0,
        soreness: 0,
        mood: 0,
        hydration: 0,
        sleepQuality: 0,
      }
    );

  const count =
    recentEntries.length;
    
    /*
 * Recovery trend
 *
 * recoveryHistory is newest-first.
 * Compare the newer half of recent
 * check-ins against the older half.
 */

let trend = "stable";
let trendChange = 0;

if (recentEntries.length >= 3) {

  const splitPoint =
    Math.ceil(
      recentEntries.length / 2
    );

  const newerEntries =
    recentEntries.slice(
      0,
      splitPoint
    );

  const olderEntries =
    recentEntries.slice(
      splitPoint
    );

  const newerAverage =
    newerEntries.reduce(
      (total, entry) =>
        total +
        (Number(entry.score) || 0),
      0
    ) / newerEntries.length;

  const olderAverage =
    olderEntries.reduce(
      (total, entry) =>
        total +
        (Number(entry.score) || 0),
      0
    ) / olderEntries.length;

  trendChange =
    Math.round(
      newerAverage -
      olderAverage
    );

  if (trendChange >= 5) {
    trend = "improving";
  } else if (
    trendChange <= -5
  ) {
    trend = "declining";
  }

}

  function average(value) {
    return Math.round(
      (value / count) * 10
    ) / 10;
  }

  /*
 * Calculate averages once so we can
 * compare recovery factors.
 */

const averageSleep =
  average(totals.sleep);

const averageEnergy =
  average(totals.energy);

const averageSoreness =
  average(totals.soreness);

const averageMood =
  average(totals.mood);

const averageHydration =
  average(totals.hydration);

const averageSleepQuality =
  average(totals.sleepQuality);


/*
 * Normalize every recovery factor
 * to a 0–100 scale.
 *
 * Higher = better recovery.
 */

const factors = [
  {
    key: "sleep",
    label: "Sleep",
    score: Math.min(
      100,
      (averageSleep / 8) * 100
    ),
  },

  {
    key: "sleepQuality",
    label: "Sleep Quality",
    score:
      (averageSleepQuality / 5) *
      100,
  },

  {
    key: "energy",
    label: "Energy",
    score:
      (averageEnergy / 10) * 100,
  },

  {
    key: "soreness",
    label: "Soreness",
    score:
      ((10 - averageSoreness) /
        9) *
      100,
  },

  {
    key: "mood",
    label: "Mood",
    score:
      (averageMood / 10) * 100,
  },

  {
    key: "hydration",
    label: "Hydration",
    score:
      (averageHydration / 10) *
      100,
  },
];


/*
 * Highest factor = strongest area.
 * Lowest factor = biggest limiter.
 */

const sortedFactors =
  [...factors].sort(
    (a, b) =>
      b.score - a.score
  );

const strongestFactor =
  sortedFactors[0];

const weakestFactor =
  sortedFactors[
    sortedFactors.length - 1
  ];

  let insight = "";

if (count < 3) {

  insight =
    "Keep logging daily recovery to unlock stronger trend analysis.";

} else if (trend === "declining") {

  insight =
    `Recovery is trending downward. ${
      weakestFactor.label
    } is currently your biggest recovery limiter.`;

} else if (trend === "improving") {

  insight =
    `Recovery is trending upward. ${
      strongestFactor.label
    } is currently your strongest recovery factor.`;

} else {

  insight =
    `Recovery has remained relatively stable. ${
      weakestFactor.label
    } currently has the most room for improvement.`;

}

  return {
    checkInCount: count,

    trend,
    trendChange,
    
    strongestFactor,
    weakestFactor,
    insight,

    averageScore:
      Math.round(
        totals.score / count
      ),

    averageSleep,
    averageEnergy,
    averageSoreness,
    averageMood,
    averageHydration,
    averageSleepQuality,
  };
}