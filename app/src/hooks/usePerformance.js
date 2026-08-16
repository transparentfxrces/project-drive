import {
  useEffect,
  useState,
} from "react";

const metricKeys = [
  "bench",
  "squat",
  "deadlift",
  "powerClean",

  "forty",
  "tenSplit",
  "shuttle",
  "vertical",
  "broad",

  "weight",
  "bodyFat",
];

const defaultMetrics = {
  bench: "",
  squat: "",
  deadlift: "",
  powerClean: "",

  forty: "",
  tenSplit: "",
  shuttle: "",
  vertical: "",
  broad: "",

  weight: "",
  bodyFat: "",

  benchDate: "",
  squatDate: "",
  deadliftDate: "",
  powerCleanDate: "",

  fortyDate: "",
  tenSplitDate: "",
  shuttleDate: "",
  verticalDate: "",
  broadDate: "",

  weightDate: "",
  bodyFatDate: "",
};

const defaultGoals = {
  weeklyWorkoutGoal: 3,

  bench: "",
  squat: "",
  deadlift: "",
  powerClean: "",

  forty: "",
  tenSplit: "",
  shuttle: "",
  vertical: "",
  broad: "",

  weight: "",
  bodyFat: "",
};

function createEmptyHistory() {
  return metricKeys.reduce(
    (history, metricKey) => ({
      ...history,
      [metricKey]: [],
    }),
    {}
  );
}

function safelyReadStorage(
  storageKey,
  fallback
) {
  try {
    const saved =
      localStorage.getItem(storageKey);

    if (!saved) {
      return fallback;
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error(
      `Unable to read ${storageKey}:`,
      error
    );

    return fallback;
  }
}

function normalizeDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const dateText =
    String(dateValue).trim();

  const dateOnlyMatch =
    dateText.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );

  if (dateOnlyMatch) {
    return dateOnlyMatch[0];
  }

  const parsedDate =
    new Date(dateValue);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "";
  }

  const year =
    parsedDate.getFullYear();

  const month = String(
    parsedDate.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    parsedDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildInitialHistory(
  savedMetrics
) {
  const savedHistory =
    safelyReadStorage(
      "performanceHistory",
      null
    );

  if (savedHistory) {
    const emptyHistory =
      createEmptyHistory();

    metricKeys.forEach(
      (metricKey) => {
        const entries =
          savedHistory[metricKey];

        emptyHistory[metricKey] =
          Array.isArray(entries)
            ? entries
                .filter(
                  (entry) =>
                    Number(entry?.value) >
                      0 &&
                    normalizeDate(
                      entry?.date
                    )
                )
                .map((entry) => ({
                  value: Number(
                    entry.value
                  ),
                  date: normalizeDate(
                    entry.date
                  ),
                }))
                .sort((first, second) =>
                  first.date.localeCompare(
                    second.date
                  )
                )
            : [];
      }
    );

    return emptyHistory;
  }

  const migratedHistory =
    createEmptyHistory();

  metricKeys.forEach((metricKey) => {
    const value = Number(
      savedMetrics[metricKey]
    );

    const date = normalizeDate(
      savedMetrics[
        `${metricKey}Date`
      ]
    );

    if (value > 0 && date) {
      migratedHistory[metricKey] = [
        {
          value,
          date,
        },
      ];
    }
  });

  return migratedHistory;
}

export default function usePerformance() {
  const [metrics, setMetrics] =
    useState(() => {
      const savedMetrics =
        safelyReadStorage(
          "performanceMetrics",
          {}
        );

      return {
        ...defaultMetrics,
        ...savedMetrics,
      };
    });

  const [goals, setGoals] =
    useState(() => {
      const savedGoals =
        safelyReadStorage(
          "performanceGoals",
          {}
        );

      return {
        ...defaultGoals,
        ...savedGoals,
      };
    });

  const [
    performanceHistory,
    setPerformanceHistory,
  ] = useState(() =>
    buildInitialHistory(
      safelyReadStorage(
        "performanceMetrics",
        defaultMetrics
      )
    )
  );

  useEffect(() => {
    localStorage.setItem(
      "performanceMetrics",
      JSON.stringify(metrics)
    );
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem(
      "performanceGoals",
      JSON.stringify(goals)
    );
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(
      "performanceHistory",
      JSON.stringify(
        performanceHistory
      )
    );
  }, [performanceHistory]);

  function setMetric(field, value) {
    setMetrics((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function setGoal(field, value) {
    setGoals((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function saveMetricResult(
    metricKey
  ) {
    if (
      !metricKeys.includes(metricKey)
    ) {
      return {
        success: false,
        message:
          "That performance metric is not supported.",
      };
    }

    const value = Number(
      metrics[metricKey]
    );

    const date = normalizeDate(
      metrics[`${metricKey}Date`]
    );

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return {
        success: false,
        message:
          "Enter a valid result greater than zero.",
      };
    }

    if (!date) {
      return {
        success: false,
        message:
          "Choose a valid date before saving.",
      };
    }

    setPerformanceHistory(
      (previous) => {
        const currentEntries =
          previous[metricKey] || [];

        const entry = {
          value,
          date,
        };

        const dateAlreadyExists =
          currentEntries.some(
            (result) =>
              result.date === date
          );

        const updatedEntries =
          dateAlreadyExists
            ? currentEntries.map(
                (result) =>
                  result.date === date
                    ? entry
                    : result
              )
            : [
                ...currentEntries,
                entry,
              ];

        updatedEntries.sort(
          (first, second) =>
            first.date.localeCompare(
              second.date
            )
        );

        return {
          ...previous,
          [metricKey]:
            updatedEntries,
        };
      }
    );

    return {
      success: true,
      message:
        "Performance result saved.",
    };
  }

  function removeMetricResult(
    metricKey,
    date
  ) {
    const normalizedDate =
      normalizeDate(date);

    if (
      !metricKeys.includes(
        metricKey
      ) ||
      !normalizedDate
    ) {
      return;
    }

    setPerformanceHistory(
      (previous) => ({
        ...previous,
        [metricKey]: (
          previous[metricKey] || []
        ).filter(
          (result) =>
            result.date !==
            normalizedDate
        ),
      })
    );
  }

  function clearMetricHistory(
    metricKey
  ) {
    if (
      !metricKeys.includes(metricKey)
    ) {
      return;
    }

    setPerformanceHistory(
      (previous) => ({
        ...previous,
        [metricKey]: [],
      })
    );
  }

  return {
    metrics,
    goals,
    performanceHistory,

    setMetrics,
    setGoals,
    setPerformanceHistory,

    setMetric,
    setGoal,

    saveMetricResult,
    removeMetricResult,
    clearMetricHistory,
  };
}