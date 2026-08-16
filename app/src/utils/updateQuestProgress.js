export default function updateQuestProgress({
  quests,
  setQuests,
  workoutHistory,
  metrics,
  streak,
  setXP,
}) {
  let xpEarned = 0;

  const updated = quests.map((quest) => {
    if (quest.completed) return quest;

    let progress = quest.progress;

    switch (quest.type) {
      case "workout":
        progress = workoutHistory.length;
        break;

      case "bodyweight":
        progress = metrics.weight ? 1 : 0;
        break;

      case "bench":
        progress = Number(metrics.bench || 0);
        break;

      case "squat":
        progress = Number(metrics.squat || 0);
        break;

      case "deadlift":
        progress = Number(metrics.deadlift || 0);
        break;

      case "powerClean":
        progress = Number(metrics.powerClean || 0);
        break;

      case "streak":
        progress = streak;
        break;

      default:
        break;
    }

    const completed = progress >= quest.goal;

    if (
      completed &&
      !quest.rewarded
    ) {
      xpEarned += quest.reward;

      return {
        ...quest,
        progress,
        completed: true,
        rewarded: true,
      };
    }

    return {
      ...quest,
      progress,
      completed,
    };
  });

  setQuests(updated);

  if (xpEarned > 0) {
    setXP((prev) => prev + xpEarned);
  }
}