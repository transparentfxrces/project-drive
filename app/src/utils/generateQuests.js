import {
  dailyQuestPool,
  weeklyQuestPool,
} from "../data/questBank";

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateDailyQuests(metrics) {
  const quests = [];

  // ======================
  // Always one workout quest
  // ======================

  const workoutQuests = dailyQuestPool.filter(
    (q) => q.category === "workout"
  );

  quests.push(randomItem(workoutQuests));

  // ======================
  // Always one performance quest
  // ======================

  const performanceQuests = dailyQuestPool.filter((q) => {
    if (q.category !== "performance") return false;

    // Don't ask for weight if it's empty every day forever.
    if (!metrics.weight && q.metric !== "weight") return true;

    return true;
  });

  quests.push(randomItem(performanceQuests));

  // ======================
  // Third random quest
  // ======================

  const remaining = dailyQuestPool.filter(
    (q) => !quests.some((quest) => quest.id === q.id)
  );

  quests.push(randomItem(remaining));

  return quests.map((q) => ({
    ...q,
    progress: 0,
    completed: false,
    claimed: false,
    xp: q.xp ?? 100,
  }));
}

export function generateWeeklyQuests({
  metrics,
}) {
  const quests = [];

  // ======================
  // Random consistency quest
  // ======================

  const consistency = weeklyQuestPool.filter(
    (q) => q.category === "consistency"
  );

  quests.push(randomItem(consistency));

  // ======================
  // Random second quest
  // ======================

  const categories = [
    "strength",
    "volume",
    "favorite",
  ];

  const chosenCategory =
    randomItem(categories);

  if (chosenCategory === "strength") {
    const lifts = [
      {
        id: "increaseBench",
        value: Number(metrics.bench || 0),
        exercise: "Bench Press",
        increment: 5,
      },
      {
        id: "increaseSquat",
        value: Number(metrics.squat || 0),
        exercise: "Squat",
        increment: 10,
      },
      {
        id: "increaseDeadlift",
        value: Number(metrics.deadlift || 0),
        exercise: "Deadlift",
        increment: 10,
      },
      {
        id: "increasePowerClean",
        value: Number(metrics.powerClean || 0),
        exercise: "Power Clean",
        increment: 5,
      },
    ];

    const selectedLift =
      randomItem(lifts);

    const template =
      weeklyQuestPool.find(
        (q) => q.id === selectedLift.id
      );

    quests.push({
      ...template,
      title: `${selectedLift.exercise} +${selectedLift.increment} lbs`,
      exercise: selectedLift.exercise,
      targetWeight:
        selectedLift.value +
        selectedLift.increment,
      progress: 0,
      completed: false,
      claimed: false,
      xp: template.xp ?? 400,
    });
  } else {
    const options = weeklyQuestPool.filter(
      (q) =>
        q.category === chosenCategory
    );

    quests.push({
      ...randomItem(options),
      progress: 0,
      completed: false,
      claimed: false,
    });
  }

  return quests;
}