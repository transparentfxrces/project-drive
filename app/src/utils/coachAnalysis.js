export default function coachAnalysis({
  workoutHistory = [],
  metrics = {},
  goals = {},
}) {
  let grade = "D";

  let title = "Beginning Journey";

  const alerts = [];

  const recommendations = [];

  const workoutCount = workoutHistory.length;

  // ==========================
  // Athlete Score
  // ==========================

  let consistencyScore = 0;

  let strengthScore = 0;

  let performanceScore = 0;

  let recoveryScore = 0;

  let goalScore = 0;

  // ==========================
  // Consistency
  // ==========================

  if (workoutCount >= 1) consistencyScore += 5;
  if (workoutCount >= 5) consistencyScore += 5;
  if (workoutCount >= 15) consistencyScore += 5;
  if (workoutCount >= 30) consistencyScore += 5;
  if (workoutCount >= 50) consistencyScore += 5;

  // ==========================
  // Strength Score
  // ==========================

  const strengthMetrics = [
    metrics.bench,
    metrics.squat,
    metrics.deadlift,
    metrics.powerClean,
  ];

  strengthMetrics.forEach((value) => {
    if (Number(value) > 0) {
      strengthScore += 6;
    }
  });

  strengthScore = Math.min(strengthScore, 25);

  // ==========================
  // Performance Score
  // ==========================

  const performanceMetrics = [
    metrics.forty,
    metrics.tenSplit,
    metrics.shuttle,
    metrics.vertical,
    metrics.broad,
  ];

  performanceMetrics.forEach((value) => {
    if (Number(value) > 0) {
      performanceScore += 4;
    }
  });

  performanceScore = Math.min(
    performanceScore,
    20
  );

  // ==========================
  // Recovery
  // ==========================

  let daysSince = null;

  if (workoutHistory.length > 0) {
    const lastWorkout = workoutHistory[0];

    const lastDate = new Date(
      lastWorkout.date
    );

    daysSince = Math.floor(
      (Date.now() - lastDate.getTime()) /
        86400000
    );

    if (daysSince <= 2)
      recoveryScore = 15;
    else if (daysSince <= 4)
      recoveryScore = 12;
    else if (daysSince <= 7)
      recoveryScore = 8;
    else recoveryScore = 3;

    if (daysSince >= 5) {
      alerts.push(
        `No workout logged for ${daysSince} days.`
      );

      recommendations.push(
        "Get a session in to rebuild consistency."
      );
    }

    if (daysSince === 0) {
      alerts.push(
        "Workout logged today."
      );
    }
  }

  // ==========================
  // Goal Score
  // ==========================

  const goalChecks = [
    ["bench", false],
    ["squat", false],
    ["deadlift", false],
    ["forty", true],
  ];

  goalChecks.forEach(
    ([metric, lowerBetter]) => {
      const current = Number(
        metrics[metric]
      );

      const goal = Number(
        goals[metric]
      );

      if (!current || !goal) return;

      const reached = lowerBetter
        ? current <= goal
        : current >= goal;

      if (reached) {
        goalScore += 4;
      }
    }
  );

  goalScore = Math.min(goalScore, 15);

  // ==========================
  // Goal Alerts
  // ==========================

  if (
    goals.bench &&
    Number(metrics.bench) >=
      Number(goals.bench)
  ) {
    alerts.push(
      "Bench goal achieved."
    );
  }

  if (
    goals.squat &&
    Number(metrics.squat) >=
      Number(goals.squat)
  ) {
    alerts.push(
      "Squat goal achieved."
    );
  }

  if (
    goals.deadlift &&
    Number(metrics.deadlift) >=
      Number(goals.deadlift)
  ) {
    alerts.push(
      "Deadlift goal achieved."
    );
  }

  if (
    goals.forty &&
    Number(metrics.forty) > 0 &&
    Number(metrics.forty) <=
      Number(goals.forty)
  ) {
    alerts.push(
      "40-yard dash goal achieved."
    );
  }

  // ==========================
  // General Recommendations
  // ==========================

  if (
    Number(metrics.powerClean || 0) === 0
  ) {
    recommendations.push(
      "Record your Power Clean to improve explosive tracking."
    );
  }

  if (
    Number(metrics.vertical || 0) === 0
  ) {
    recommendations.push(
      "Add a Vertical Jump measurement."
    );
  }

  if (
    Number(metrics.bodyFat || 0) === 0
  ) {
    recommendations.push(
      "Update your body fat percentage."
    );
  }

  if (
    recommendations.length === 0
  ) {
    recommendations.push(
      "Keep following your current training program."
    );
  }

  // ==========================
  // Overall Score
  // ==========================

  const overallScore =
    consistencyScore +
    strengthScore +
    performanceScore +
    recoveryScore +
    goalScore;

  // ==========================
  // Grade
  // ==========================

  if (overallScore >= 95) {
    grade = "S";
    title = "Elite Athlete";
  } else if (overallScore >= 85) {
    grade = "A";
    title = "High Performance";
  } else if (overallScore >= 75) {
    grade = "B";
    title = "Developing Well";
  } else if (overallScore >= 60) {
    grade = "C";
    title = "Needs Improvement";
  } else {
    grade = "D";
    title = "Beginning Journey";
  }

  // ==========================
// Priority Analysis
// ==========================

const priorities = [];

if (strengthScore < 15) {
  priorities.push({
    title: "Build Strength",
    description:
      "Continue increasing your main lifts to improve overall power.",
    icon: "🏋️",
  });
}

if (performanceScore < 12) {
  priorities.push({
    title: "Improve Athleticism",
    description:
      "Record sprint, shuttle, vertical and broad jump metrics.",
    icon: "⚡",
  });
}

if (recoveryScore < 10) {
  priorities.push({
    title: "Recovery Needed",
    description:
      "Take a recovery day or reduce training intensity.",
    icon: "💤",
  });
}

if (goalScore < 8) {
  priorities.push({
    title: "Focus On Goals",
    description:
      "Work toward your performance goals this week.",
    icon: "🎯",
  });
}

if (priorities.length === 0) {
  priorities.push({
    title: "Stay Consistent",
    description:
      "Keep following your current training program.",
    icon: "🔥",
  });
}

let summary = "";

if (grade === "A") {
  summary =
    "Outstanding progress. Continue your current training while maintaining recovery and consistency.";
}

else if (grade === "B") {
  summary =
    "You're progressing well. Focus on improving weaker areas to reach the next level.";
}

else if (grade === "C") {
  summary =
    "You've built a foundation, but there are several opportunities for improvement. Continue logging workouts and performance metrics to receive more accurate coaching.";
}

else {
  summary =
    "Not enough performance data is available yet. Record workouts and athletic metrics so the coaching system can provide personalized feedback.";
}

  // ==========================
  // Return Report
  // ==========================

  return {
  grade,

  title,

  overallScore,

  priorities,

  workoutCount,

  alerts,

  recommendations,

  summary,

  breakdown: {
    consistency: consistencyScore,

    strength: strengthScore,

    performance: performanceScore,

    recovery: recoveryScore,

    goals: goalScore,
  },
};
}