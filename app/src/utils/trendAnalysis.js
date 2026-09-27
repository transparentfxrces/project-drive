const METRIC_CONFIG = {
  bench: {
    label: "Bench Press",
    unitType: "weight",
    lowerIsBetter: false,
  },

  squat: {
    label: "Squat",
    unitType: "weight",
    lowerIsBetter: false,
  },

  deadlift: {
    label: "Deadlift",
    unitType: "weight",
    lowerIsBetter: false,
  },

  powerClean: {
    label: "Power Clean",
    unitType: "weight",
    lowerIsBetter: false,
  },

  forty: {
    label: "40-Yard Dash",
    unit: "sec",
    lowerIsBetter: true,
  },

  tenSplit: {
    label: "10-Yard Split",
    unit: "sec",
    lowerIsBetter: true,
  },

  shuttle: {
    label: "Shuttle",
    unit: "sec",
    lowerIsBetter: true,
  },

  vertical: {
    label: "Vertical Jump",
    unitType: "inches",
    lowerIsBetter: false,
  },

  broad: {
    label: "Broad Jump",
    unitType: "feet",
    lowerIsBetter: false,
  },
};

function getTrendStatus(
  difference,
  lowerIsBetter
) {
  const absoluteDifference =
    Math.abs(difference);

  if (absoluteDifference < 0.01) {
    return "plateau";
  }

  const improved = lowerIsBetter
    ? difference < 0
    : difference > 0;

  return improved
    ? "improving"
    : "declining";
}

function getDisplayMetric(value, unitType, units) {
  const numericValue = Number(value) || 0;

  if (unitType === "weight") {
    return {
      value:
        units === "metric"
          ? numericValue * 0.45359237
          : numericValue,
      unit:
        units === "metric"
          ? "kg"
          : "lbs",
    };
  }

  if (unitType === "inches") {
    return {
      value:
        units === "metric"
          ? numericValue * 2.54
          : numericValue,
      unit:
        units === "metric"
          ? "cm"
          : "in",
    };
  }

  if (unitType === "feet") {
    return {
      value:
        units === "metric"
          ? numericValue * 0.3048
          : numericValue,
      unit:
        units === "metric"
          ? "m"
          : "ft",
    };
  }

  return {
    value: numericValue,
    unit: "sec",
  };
}

function getTrendMessage({
  label,
  difference,
  unit,
  status,
  lowerIsBetter,
}) {
  const displayDifference =
    Math.abs(difference).toFixed(
      unit === "sec" ? 2 : 1
    );

  if (status === "plateau") {
    return `${label} has remained unchanged across recent tests.`;
  }

  if (status === "improving") {
    return lowerIsBetter
      ? `${label} improved by ${displayDifference} ${unit}.`
      : `${label} increased by ${displayDifference} ${unit}.`;
  }

  return lowerIsBetter
    ? `${label} became ${displayDifference} ${unit} slower.`
    : `${label} decreased by ${displayDifference} ${unit}.`;
}

function analyzeMetric(
  metricKey,
  entries,
  units
) {
  const config =
    METRIC_CONFIG[metricKey];

  if (
    !config ||
    !Array.isArray(entries) ||
    entries.length === 0
  ) {
    return null;
  }

  const validEntries = entries
    .filter(
      (entry) =>
        Number(entry?.value) > 0 &&
        entry?.date
    )
    .map((entry) => ({
      value: Number(entry.value),
      date: entry.date,
    }))
    .sort((first, second) =>
      first.date.localeCompare(
        second.date
      )
    );

  if (validEntries.length === 0) {
    return null;
  }

  const latest =
    validEntries[
      validEntries.length - 1
    ];

  if (validEntries.length === 1) {
  const latestDisplay = getDisplayMetric(
    latest.value,
    config.unitType || null,
    units
  );

  return {
    metricKey,

    label: config.label,

    unit: latestDisplay.unit,

    latestValue: Number(
      latestDisplay.value.toFixed(
        latestDisplay.unit === "sec" ? 2 : 1
      )
    ),

    previousValue: null,

    difference: 0,

      status: "insufficient",

      icon: "◇",

      message:
        `${config.label} needs another saved result before a trend can be calculated.`,

      entriesLogged:
        validEntries.length,
    };
  }

  const previous =
    validEntries[
      validEntries.length - 2
    ];

  const difference =
    latest.value -
    previous.value;

  const latestDisplay = getDisplayMetric(
    latest.value,
    config.unitType || null,
    units
  );

  const previousDisplay = getDisplayMetric(
    previous.value,
    config.unitType || null,
    units
  );

  const displayDifference =
    latestDisplay.value -
    previousDisplay.value;

  const status = getTrendStatus(
    difference,
    config.lowerIsBetter
  );

  const icons = {
    improving: "↗",
    plateau: "→",
    declining: "↘",
  };

  return {
  metricKey,

  label: config.label,

  unit: latestDisplay.unit,

  latestValue: Number(
    latestDisplay.value.toFixed(
      latestDisplay.unit === "sec" ? 2 : 1
    )
  ),

  previousValue: Number(
    previousDisplay.value.toFixed(
      previousDisplay.unit === "sec" ? 2 : 1
    )
  ),

  difference: Number(
    displayDifference.toFixed(
      latestDisplay.unit === "sec" ? 2 : 1
    )
  ),

  status,

    icon: icons[status],

    message: getTrendMessage({
  label: config.label,
  difference: displayDifference,
  unit: latestDisplay.unit,
  status,
  lowerIsBetter:
    config.lowerIsBetter,
}),

    entriesLogged:
      validEntries.length,
  };
}

export default function trendAnalysis(
  performanceHistory = {},
  units = "imperial"
) {
  const trends = Object.entries(
    METRIC_CONFIG
  )
    .map(([metricKey]) =>
  analyzeMetric(
    metricKey,
    performanceHistory[
      metricKey
    ],
    units
  )
)
    .filter(Boolean);

  const improving = trends.filter(
    (trend) =>
      trend.status === "improving"
  );

  const plateaus = trends.filter(
    (trend) =>
      trend.status === "plateau"
  );

  const declining = trends.filter(
    (trend) =>
      trend.status === "declining"
  );

  const insufficient = trends.filter(
    (trend) =>
      trend.status === "insufficient"
  );

  let headline =
    "More performance data is needed.";

  if (
    improving.length >
    declining.length
  ) {
    headline =
      "Positive performance trends detected.";
  } else if (
    declining.length >
    improving.length
  ) {
    headline =
      "Several performance metrics require attention.";
  } else if (
    plateaus.length > 0
  ) {
    headline =
      "Performance plateaus detected.";
  }

  return {
    headline,

    trends,

    improving,

    plateaus,

    declining,

    insufficient,

    counts: {
      improving:
        improving.length,

      plateau:
        plateaus.length,

      declining:
        declining.length,

      insufficient:
        insufficient.length,
    },
  };
}