import achievementsData from "../data/achievements";

export default function checkAchievements({
  workoutHistory = [],
  streak = 0,
  metrics = {},
  achievements = {},
  setAchievements,
  awardXP,
  setAchievementPopup,
}) {
  const unlocked = {
    ...achievements,
  };

  const newlyUnlocked = [];

  function unlock(id) {
    if (unlocked[id]) {
      return;
    }

    const achievement =
      achievementsData.find(
        (item) => item.id === id
      );

    if (!achievement) {
      return;
    }

    unlocked[id] = true;
    newlyUnlocked.push(achievement);
  }

  /* ---------- Workout Count ---------- */

  if (workoutHistory.length >= 1) {
    unlock("firstWorkout");
  }

  if (workoutHistory.length >= 10) {
    unlock("workouts10");
  }

  if (workoutHistory.length >= 25) {
    unlock("workouts25");
  }

  if (workoutHistory.length >= 50) {
    unlock("workouts50");
  }

  /* ---------- Streak ---------- */

  if (streak >= 7) {
    unlock("streak7");
  }

  if (streak >= 30) {
    unlock("streak30");
  }

  /* ---------- Strength ---------- */

  if (Number(metrics.bench) >= 225) {
    unlock("bench225");
  }

  if (Number(metrics.squat) >= 315) {
    unlock("squat315");
  }

  if (Number(metrics.deadlift) >= 405) {
    unlock("deadlift405");
  }

  if (
    Number(metrics.powerClean) >=
    200
  ) {
    unlock("powerClean200");
  }

  setAchievements?.(unlocked);

  newlyUnlocked.forEach(
    (achievement) => {
      awardXP?.(
        achievement.xp,
        `Achievement unlocked: ${achievement.title}`,
        "achievement"
      );
    }
  );

  if (
    newlyUnlocked.length > 0 &&
    setAchievementPopup
  ) {
    const latestAchievement =
      newlyUnlocked[
        newlyUnlocked.length - 1
      ];

    setAchievementPopup(
      latestAchievement
    );

    window.setTimeout(() => {
      setAchievementPopup(null);
    }, 3500);
  }

  return newlyUnlocked;
}