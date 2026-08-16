import { useState, useEffect } from "react";

import checkAchievements from "../utils/checkAchievements";
import checkQuests from "../utils/checkQuests";
import {
  generateDailyQuests,
  generateWeeklyQuests,
} from "../utils/generateQuests";

function getWeekKey() {
  const date = new Date();

  const day = date.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  date.setDate(
    date.getDate() + diff
  );

  date.setHours(0, 0, 0, 0);

  return date.toDateString();
}

export default function useProgression(
  metrics,
  workoutHistory,
  awardXP
) {
  const todayKey =
    new Date().toDateString();

  const weekKey =
    getWeekKey();

  const [streak, setStreak] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "streak"
        );

      return saved
        ? Number(saved)
        : 0;
    });

  const [achievements, setAchievements] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "achievements"
        );

      return saved
        ? JSON.parse(saved)
        : {};
    });

  const [achievementPopup, setAchievementPopup] =
    useState(null);

  const [quests, setQuests] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "quests"
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        return {
          dailyDate:
            parsed.dailyDate ||
            todayKey,

          weeklyDate:
            parsed.weeklyDate ||
            weekKey,

          daily:
            parsed.daily || [],

          weekly:
            parsed.weekly || [],
        };
      }

      return {
        dailyDate:
          todayKey,

        weeklyDate:
          weekKey,

        daily: [],

        weekly: [],
      };
    });

  useEffect(() => {
    localStorage.setItem(
      "streak",
      streak
    );
  }, [streak]);

  useEffect(() => {
    localStorage.setItem(
      "achievements",
      JSON.stringify(
        achievements
      )
    );
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(
      "quests",
      JSON.stringify(
        quests
      )
    );
  }, [quests]);

  useEffect(() => {
    setQuests((prev) => {
      const today =
        new Date().toDateString();

      const week =
        getWeekKey();

      const updated = {
        ...prev,
      };

      let changed = false;

      if (
        prev.daily.length === 0 ||
        prev.dailyDate !== today
      ) {
        updated.daily =
          generateDailyQuests(
            metrics
          );

        updated.dailyDate =
          today;

        changed = true;
      }

      if (
        prev.weekly.length === 0 ||
        prev.weeklyDate !== week
      ) {
        updated.weekly =
          generateWeeklyQuests({
            metrics,
            workoutHistory,
          });

        updated.weeklyDate =
          week;

        changed = true;
      }

      return changed
        ? updated
        : prev;
    });
  }, []);

  function unlockWorkout(
    updatedHistory,
    favoriteExercises
  ) {
    const newStreak =
      streak + 1;

    setStreak(newStreak);

    checkAchievements({
      workoutHistory:
        updatedHistory,

      streak:
        newStreak,

      metrics,

      achievements,

      setAchievements,

      awardXP,

      setAchievementPopup,
    });

    checkQuests({
      quests,
      setQuests,

      workoutHistory:
        updatedHistory,

      metrics,

      currentWorkout:
        "finished",

      favoriteExercises,

      awardXP,
    });
  }

  return {
    streak,

    setStreak,

    achievements,

    achievementPopup,

    quests,

    setQuests,

    unlockWorkout,
  };
}