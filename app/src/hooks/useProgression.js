import {
  useEffect,
  useState,
} from "react";

import checkAchievements from "../utils/checkAchievements";
import checkQuests from "../utils/checkQuests";

import {
  generateDailyQuests,
  generateWeeklyQuests,
} from "../utils/generateQuests";

import { supabase } from "../services/supabase";

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

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date.toDateString();
}

function safelyReadStorage(
  storageKey,
  fallback
) {
  try {
    const saved =
      localStorage.getItem(
        storageKey
      );

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

export default function useProgression(
  metrics,
  workoutHistory,
  awardXP
) {
  const todayKey =
    new Date().toDateString();

  const weekKey =
    getWeekKey();

  const [userId, setUserId] =
    useState(null);

  const [streak, setStreak] =
    useState(0);

  const [
    achievements,
    setAchievements,
  ] = useState({});

  const [
    achievementPopup,
    setAchievementPopup,
  ] = useState(null);

  const [quests, setQuests] =
    useState({
      dailyDate:
        todayKey,

      weeklyDate:
        weekKey,

      daily: [],

      weekly: [],
    });

  /*
   * Track the currently authenticated
   * athlete so progression data is
   * isolated per account.
   */
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!mounted) return;

      setUserId(
        user?.id ?? null
      );
    }

    loadUser();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUserId(
            session?.user?.id ?? null
          );
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /*
   * Load progression data whenever
   * the authenticated athlete changes.
   *
   * Each account gets its own storage
   * namespace.
   */
  useEffect(() => {
    if (!userId) {
      setStreak(0);
      setAchievements({});
      setAchievementPopup(null);

      setQuests({
        dailyDate:
          todayKey,

        weeklyDate:
          weekKey,

        daily: [],

        weekly: [],
      });

      return;
    }

    const streakStorageKey =
      `streak_${userId}`;

    const achievementsStorageKey =
      `achievements_${userId}`;

    const questsStorageKey =
      `quests_${userId}`;

    const savedStreak =
      localStorage.getItem(
        streakStorageKey
      );

    const parsedStreak =
      Number(savedStreak);

    const safeStreak =
      Number.isFinite(
        parsedStreak
      ) &&
      parsedStreak >= 0
        ? parsedStreak
        : 0;

    const savedAchievements =
      safelyReadStorage(
        achievementsStorageKey,
        {}
      );

    const safeAchievements =
      savedAchievements &&
      typeof savedAchievements ===
        "object" &&
      !Array.isArray(
        savedAchievements
      )
        ? savedAchievements
        : {};

    const savedQuests =
      safelyReadStorage(
        questsStorageKey,
        null
      );

    let safeQuests = {
      dailyDate:
        todayKey,

      weeklyDate:
        weekKey,

      daily: [],

      weekly: [],
    };

    if (
      savedQuests &&
      typeof savedQuests ===
        "object"
    ) {
      safeQuests = {
        dailyDate:
          savedQuests.dailyDate ||
          todayKey,

        weeklyDate:
          savedQuests.weeklyDate ||
          weekKey,

        daily:
          Array.isArray(
            savedQuests.daily
          )
            ? savedQuests.daily
            : [],

        weekly:
          Array.isArray(
            savedQuests.weekly
          )
            ? savedQuests.weekly
            : [],
      };
    }

    setStreak(safeStreak);
    setAchievements(
      safeAchievements
    );
    setAchievementPopup(null);
    setQuests(safeQuests);
  }, [userId]);

  /*
   * Persist streak for this athlete.
   */
  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `streak_${userId}`,
      String(
        Math.max(
          0,
          Number(streak) || 0
        )
      )
    );
  }, [
    streak,
    userId,
  ]);

  /*
   * Persist achievements for this athlete.
   */
  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `achievements_${userId}`,
      JSON.stringify(
        achievements
      )
    );
  }, [
    achievements,
    userId,
  ]);

  /*
   * Persist quests for this athlete.
   */
  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `quests_${userId}`,
      JSON.stringify(
        quests
      )
    );
  }, [
    quests,
    userId,
  ]);

  /*
   * Generate new daily and weekly
   * quests when appropriate.
   */
  useEffect(() => {
    if (!userId) return;

    setQuests((prev) => {
      const today =
        new Date().toDateString();

      const week =
        getWeekKey();

      const previousDaily =
        Array.isArray(
          prev.daily
        )
          ? prev.daily
          : [];

      const previousWeekly =
        Array.isArray(
          prev.weekly
        )
          ? prev.weekly
          : [];

      const updated = {
        ...prev,
        daily:
          previousDaily,

        weekly:
          previousWeekly,
      };

      let changed = false;

      if (
        previousDaily.length ===
          0 ||
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
        previousWeekly.length ===
          0 ||
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
  }, [
    userId,
    metrics,
    workoutHistory,
  ]);

  function unlockWorkout(
    updatedHistory,
    favoriteExercises
  ) {
    if (!userId) {
      return;
    }

    const newStreak =
      streak + 1;

    setStreak(
      newStreak
    );

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