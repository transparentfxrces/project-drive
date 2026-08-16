export default function coachPriorities({
  recoveryScore = 100,
  readiness = "READY",
  trends = {},
  recoveryTrends = {},
}) {
  const priorities = [];

  // ==========================
  // Recovery Priority
  // ==========================

  if (recoveryScore < 65) {
    priorities.push({
      id: "recovery-low",

      icon: "🛌",

      title: "Recovery First",

      description:
        "Your recovery is low. Avoid another high-intensity session until your readiness improves.",

      why:
        `Your current recovery score is ${recoveryScore}/100 and your readiness status is ${readiness}.`,

      actions: [
        "Prioritize a full night of sleep.",
        "Increase hydration throughout the day.",
        "Use light mobility or low-intensity movement.",
        "Avoid unnecessary heavy volume.",
      ],

      importance:
        "Training hard while poorly recovered can reduce workout quality and make it harder to progress consistently.",

      severity: 100,
    });
  } else if (recoveryScore < 85) {
    priorities.push({
      id: "recovery-moderate",

      icon: "⚡",

      title: "Train Smart",

      description:
        "Your recovery is moderate. Train with control and avoid adding unnecessary fatigue.",

      why:
        `Your recovery score is ${recoveryScore}/100, which places you in the ${readiness} range.`,

      actions: [
        "Keep your main movements technically clean.",
        "Avoid extra sets that are not part of the plan.",
        "Reduce intensity if your warm-up feels unusually heavy.",
        "Complete another recovery check-in after training.",
      ],

      importance:
        "Moderate recovery does not always require rest, but it does require better control over intensity and volume.",

      severity: 80,
    });
  } else {
    priorities.push({
      id: "recovery-high",

      icon: "🔥",

      title: "Attack Today's Workout",

      description:
        "Your recovery is strong. This is a good opportunity to train with full focus and intensity.",

      why:
        `Your recovery score is ${recoveryScore}/100 and your readiness status is ${readiness}.`,

      actions: [
        "Prioritize your most important compound or explosive lift.",
        "Push intensity while maintaining good technique.",
        "Follow the planned workload instead of adding random volume.",
        "Refuel and update your recovery after training.",
      ],

      importance:
        "High-readiness days are valuable opportunities to perform quality work and make progress on your main goals.",

      severity: 60,
    });
  }

    // ==========================
  // Recovery History Trend
  // ==========================

  if (
    recoveryTrends?.checkInCount >= 3 &&
    recoveryTrends?.trend === "declining"
  ) {
    const limiter =
      recoveryTrends?.weakestFactor?.label ||
      "Recovery";

    priorities.push({
      id: "recovery-trend-declining",

      icon: "📉",

      title: "Recovery Trending Down",

      description:
        "Your recent recovery check-ins show a downward trend. Pay attention to accumulated fatigue even if today's readiness looks better.",

      why:
        `Your recent recovery trend changed by approximately ${Math.abs(
          recoveryTrends.trendChange || 0
        )} points, and ${limiter} currently appears to be your biggest recovery limiter.`,

      actions: [
        `Pay extra attention to ${limiter.toLowerCase()} over your next few check-ins.`,
        "Avoid adding unnecessary training volume.",
        "Keep logging recovery so you can see whether the trend stabilizes.",
        "Use today's actual readiness and warm-up quality to guide training intensity.",
      ],

      importance:
        "A multi-day decline can provide useful context that a single good or bad recovery score may not show.",

      severity: 90,
    });
  }

  // ==========================
  // Declining Trends
  // ==========================

  trends?.declining?.forEach((trend) => {
    priorities.push({
      id: `declining-${trend.metricKey}`,

      icon: "⚠️",

      title: `${trend.label} Needs Attention`,

      description:
        `${trend.label} has declined compared with your previous saved result.`,

      why:
        trend.message ||
        `${trend.label} moved in the wrong direction across your two most recent tests.`,

      actions: [
        "Review whether recovery was lower before the latest test.",
        "Check technique and testing conditions for consistency.",
        "Avoid immediately forcing a new personal record attempt.",
        "Use the next training block to rebuild quality and confidence.",
      ],

      importance:
        "A single decline does not automatically mean lost progress, but repeated declines may indicate fatigue, inconsistent testing, or a programming issue.",

      severity: 95,
    });
  });

  // ==========================
  // Plateau Trends
  // ==========================

  trends?.plateaus?.forEach((trend) => {
    priorities.push({
      id: `plateau-${trend.metricKey}`,

      icon: "📈",

      title: `${trend.label} Plateau`,

      description:
        `${trend.label} has remained unchanged across your most recent saved results.`,

      why:
        trend.message ||
        `${trend.label} did not improve between your last two recorded tests.`,

      actions: getPlateauActions(
        trend.metricKey
      ),

      importance:
        "A plateau can be a normal part of training, but it may also signal that recovery, technique, volume, or exercise selection needs adjustment.",

      severity: 85,
    });
  });

  // ==========================
  // Improving Trend
  // ==========================

  const bestImprovingTrend =
    trends?.improving?.[0];

  if (bestImprovingTrend) {
    priorities.push({
      id: `improving-${bestImprovingTrend.metricKey}`,

      icon: "🏆",

      title:
        `${bestImprovingTrend.label} Improving`,

      description:
        "Your recent results show positive progress. Keep the successful parts of your current approach consistent.",

      why:
        bestImprovingTrend.message ||
        `${bestImprovingTrend.label} improved compared with the previous saved result.`,

      actions: [
        "Continue using the current progression method.",
        "Avoid changing too many variables at once.",
        "Keep recording results under similar testing conditions.",
        "Protect progress by maintaining recovery and technique.",
      ],

      importance:
        "Recognizing what is already working helps you avoid unnecessary program changes and keeps progress sustainable.",

      severity: 50,
    });
  }

  // ==========================
  // Fallback Priority
  // ==========================

  if (priorities.length === 0) {
    priorities.push({
      id: "stay-consistent",

      icon: "🎯",

      title: "Stay Consistent",

      description:
        "Continue logging workouts, recovery, and performance results so the system can provide better coaching.",

      why:
        "There is not enough recent recovery or performance data to identify a more specific priority.",

      actions: [
        "Complete today's planned training.",
        "Log your recovery honestly.",
        "Save updated performance results when you test.",
        "Review your goals before your next session.",
      ],

      importance:
        "Consistent data allows Project Drive to produce more accurate and personalized recommendations.",

      severity: 40,
    });
  }

  return priorities
    .sort(
      (first, second) =>
        second.severity - first.severity
    )
    .slice(0, 3);
}

function getPlateauActions(metricKey) {
  const actionMap = {
    bench: [
      "Review your weekly pressing volume.",
      "Add focused triceps or upper-back accessory work.",
      "Consider a lighter week before your next heavy attempt.",
      "Keep your setup and pause technique consistent.",
    ],

    squat: [
      "Review squat depth and bracing consistency.",
      "Strengthen your posterior chain and core.",
      "Consider adjusting weekly squat volume.",
      "Avoid testing another max while highly fatigued.",
    ],

    deadlift: [
      "Review your starting position and brace.",
      "Add posterior-chain accessory work.",
      "Manage heavy pulling volume carefully.",
      "Use submaximal technique work before another test.",
    ],

    powerClean: [
      "Prioritize bar speed and clean technique.",
      "Use explosive jumps or lighter speed work.",
      "Avoid turning every clean session into a max attempt.",
      "Record videos to review your pull and catch.",
    ],

    forty: [
      "Improve acceleration technique.",
      "Practice short, high-quality starts.",
      "Allow full recovery between sprint repetitions.",
      "Test under similar surface and timing conditions.",
    ],

    tenSplit: [
      "Focus on your first three steps.",
      "Practice stance and projection angle.",
      "Use short acceleration drills.",
      "Take full rest between timed attempts.",
    ],

    shuttle: [
      "Work on braking and change-of-direction technique.",
      "Improve foot placement at each cut.",
      "Use controlled agility repetitions.",
      "Avoid testing while your legs are heavily fatigued.",
    ],

    vertical: [
      "Add low-volume explosive jump work.",
      "Prioritize fast intent instead of excessive repetitions.",
      "Improve lower-body recovery before testing.",
      "Keep testing technique consistent.",
    ],

    broad: [
      "Practice horizontal force production.",
      "Use bounds or low-volume broad jumps.",
      "Focus on a powerful arm swing and stable landing.",
      "Test only when your legs are fresh.",
    ],
  };

  return (
    actionMap[metricKey] || [
      "Review your recent training and recovery.",
      "Keep testing conditions consistent.",
      "Adjust one training variable at a time.",
      "Retest after a focused training block.",
    ]
  );
}