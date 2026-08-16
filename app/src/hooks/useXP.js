import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getLevelData,
} from "../utils/levelSystem";

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

function createXPEvent({
  amount,
  reason,
  source,
}) {
  return {
    id: `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    amount,
    reason,
    source,
    date: new Date().toISOString(),
  };
}

export default function useXP() {
  const [xp, setXP] = useState(() => {
    const saved =
      localStorage.getItem("xp");

    const parsed = Number(saved);

    return Number.isFinite(parsed) &&
      parsed >= 0
      ? parsed
      : 0;
  });

  const [
    xpHistory,
    setXPHistory,
  ] = useState(() => {
    const savedHistory =
      safelyReadStorage(
        "xpHistory",
        []
      );

    return Array.isArray(savedHistory)
      ? savedHistory
      : [];
  });

  const [
    lastXPEvent,
    setLastXPEvent,
  ] = useState(null);

  const [
    levelUpData,
    setLevelUpData,
  ] = useState(null);

  const levelData =
    getLevelData(Number(xp) || 0) || {
      level: 1,
      currentXP: 0,
      nextLevelXP: 1000,
      totalXP: 0,
    };

  const previousLevelRef =
    useRef(levelData.level);

  useEffect(() => {
    localStorage.setItem(
      "xp",
      String(Math.max(0, xp))
    );
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(
      "xpHistory",
      JSON.stringify(xpHistory)
    );
  }, [xpHistory]);

  useEffect(() => {
    const previousLevel =
      previousLevelRef.current;

    if (
      levelData.level >
      previousLevel
    ) {
      setLevelUpData({
        previousLevel,
        newLevel:
          levelData.level,
        date: new Date().toISOString(),
      });
    }

    previousLevelRef.current =
      levelData.level;
  }, [levelData.level]);

  function awardXP(
    amount,
    reason = "XP earned",
    source = "general"
  ) {
    const earned =
      Number(amount) || 0;

    if (earned <= 0) {
      return {
        success: false,
        message:
          "XP amount must be greater than zero.",
      };
    }

    const event = createXPEvent({
      amount: earned,
      reason,
      source,
    });

    setXP((previous) => {
      const current =
        Number(previous) || 0;

      return Math.max(
        0,
        current + earned
      );
    });

    setXPHistory((previous) => [
      event,
      ...previous,
    ].slice(0, 100));

    setLastXPEvent(event);

    return {
      success: true,
      event,
    };
  }

  const dismissXPEvent =
  useCallback(() => {
    setLastXPEvent(null);
  }, []);

const dismissLevelUp =
  useCallback(() => {
    setLevelUpData(null);
  }, []);

const clearXPHistory =
  useCallback(() => {
    setXPHistory([]);
  }, []);

  return {
    xp,
    setXP,

    levelData,
    xpHistory,
    lastXPEvent,
    levelUpData,

    awardXP,
    dismissXPEvent,
    dismissLevelUp,
    clearXPHistory,
  };
}