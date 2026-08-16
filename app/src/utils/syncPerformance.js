export default function syncPerformanceFromWorkout(
  workout,
  metrics,
  setMetrics,
  performanceHistory,
  setPerformanceHistory,
  onNewPR
) {
  if (!workout?.exercises) return;

  setPerformanceHistory((previous) => {
    const updated = {
      ...previous,
    };

    workout.exercises.forEach((exercise) => {
      const metricKey =
        mapExerciseToMetric(
          exercise.exercise
        );

      if (!metricKey) return;

      let heaviestSet = 0;

      exercise.sets?.forEach((set) => {
        const weight =
          Number(set.weight);

        if (weight > heaviestSet) {
          heaviestSet = weight;
        }
      });

      if (heaviestSet <= 0) return;

      const currentMetric =
        Number(metrics[metricKey] || 0);

      /*
       * IMPORTANT:
       * A lighter training session should
       * NEVER lower a recorded max or create
       * a fake downward PR trend.
       */
      if (
        currentMetric > 0 &&
        heaviestSet < currentMetric
      ) {
        return;
      }

      const date =
        getLocalDate();

      const currentEntries = [
        ...(updated[metricKey] || []),
      ];

      const existingIndex =
        currentEntries.findIndex(
          (entry) =>
            entry.date === date
        );

      if (existingIndex !== -1) {
        currentEntries[
          existingIndex
        ] = {
          ...currentEntries[
            existingIndex
          ],

          value: Math.max(
            Number(
              currentEntries[
                existingIndex
              ].value
            ) || 0,

            heaviestSet
          ),
        };
      } else {
        currentEntries.push({
          value: heaviestSet,
          date,
        });
      }

      currentEntries.sort(
        (first, second) =>
          first.date.localeCompare(
            second.date
          )
      );

      updated[metricKey] =
        currentEntries;

      if (
  heaviestSet >
  currentMetric
) {
  const newPR = {
    metricKey,

    exercise:
      getMetricLabel(metricKey),

    previous:
      currentMetric,

    newRecord:
      heaviestSet,

    improvement:
      currentMetric > 0
        ? heaviestSet - currentMetric
        : null,

    date,
  };

  if (onNewPR) {
    onNewPR(newPR);
  }

  setMetrics(
    (previousMetrics) => ({
      ...previousMetrics,

      [metricKey]:
        heaviestSet,

      [`${metricKey}Date`]:
        date,
    })
  );
}
    });

    return updated;
  });
}

function mapExerciseToMetric(
  name = ""
) {
  const text =
    name
      .trim()
      .toLowerCase();

  if (
    text.includes("bench")
  ) {
    return "bench";
  }

  if (
    text.includes("squat")
  ) {
    return "squat";
  }

  if (
    text.includes("deadlift")
  ) {
    return "deadlift";
  }

  if (
    text.includes("power clean")
  ) {
    return "powerClean";
  }

  /*
   * Keep this broad enough for
   * "Hang Clean", "Clean", etc.
   * We can split these into separate
   * metrics later if needed.
   */
  if (
    text.includes("clean")
  ) {
    return "powerClean";
  }

  return null;
}

function getLocalDate() {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMetricLabel(metricKey) {
  const labels = {
    bench: "Bench Press",
    squat: "Squat",
    deadlift: "Deadlift",
    powerClean: "Power Clean",
  };

  return (
    labels[metricKey] ||
    metricKey
  );
}