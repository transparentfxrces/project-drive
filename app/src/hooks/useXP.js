import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getLevelData,
} from "../utils/levelSystem";

import { supabase } from "../services/supabase";

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
  const [userId, setUserId] = useState(null);

  const [xp, setXP] = useState(0);

  const [
    xpHistory,
    setXPHistory,
  ] = useState([]);

  const [
    lastXPEvent,
    setLastXPEvent,
  ] = useState(null);

  const [
    levelUpData,
    setLevelUpData,
  ] = useState(null);

  // Keeps the latest XP value available
  // immediately, even before React rerenders.
  const xpRef = useRef(0);

  // =========================
  // Authentication
  // =========================

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUserId(
        user?.id ?? null
      );
    }

    loadUser();

    const {
      data: { subscription },
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

  // =========================
  // Load account-specific XP
  // =========================

  useEffect(() => {
    if (!userId) {
      xpRef.current = 0;

      setXP(0);
      setXPHistory([]);
      setLastXPEvent(null);
      setLevelUpData(null);

      return;
    }

    const xpStorageKey =
      `xp_${userId}`;

    const xpHistoryStorageKey =
      `xpHistory_${userId}`;

    const savedXP =
      localStorage.getItem(
        xpStorageKey
      );

    const parsedXP =
      Number(savedXP);

    const safeXP =
      Number.isFinite(parsedXP) &&
      parsedXP >= 0
        ? parsedXP
        : 0;

    const savedHistory =
      safelyReadStorage(
        xpHistoryStorageKey,
        []
      );

    const safeHistory =
      Array.isArray(savedHistory)
        ? savedHistory
        : [];

    // IMPORTANT:
    // Loading saved XP is initialization.
    // It must NEVER count as a level-up.
    xpRef.current = safeXP;

    setXP(safeXP);
    setXPHistory(safeHistory);

    setLastXPEvent(null);
    setLevelUpData(null);
  }, [userId]);

  // =========================
  // Level Data
  // =========================

  const levelData =
    getLevelData(
      Number(xp) || 0
    ) || {
      level: 1,
      currentXP: 0,
      nextLevelXP: 1000,
      totalXP: 0,
    };

  // =========================
  // Keep XP Ref Updated
  // =========================

  useEffect(() => {
    xpRef.current =
      Number(xp) || 0;
  }, [xp]);

  // =========================
  // Save XP
  // =========================

  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `xp_${userId}`,
      String(
        Math.max(
          0,
          Number(xp) || 0
        )
      )
    );
  }, [xp, userId]);

  // =========================
  // Save XP History
  // =========================

  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `xpHistory_${userId}`,
      JSON.stringify(
        xpHistory
      )
    );
  }, [
    xpHistory,
    userId,
  ]);

  // =========================
  // Award XP
  // =========================

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

    if (!userId) {
      return {
        success: false,
        message:
          "No authenticated athlete found.",
      };
    }

    const currentXP =
      Math.max(
        0,
        Number(
          xpRef.current
        ) || 0
      );

    const newXP =
      currentXP + earned;

    const previousLevelData =
      getLevelData(
        currentXP
      ) || {
        level: 1,
      };

    const newLevelData =
      getLevelData(
        newXP
      ) || {
        level:
          previousLevelData.level,
      };

    const previousLevel =
      previousLevelData.level;

    const newLevel =
      newLevelData.level;

    // Update the ref immediately.
    // This prevents rapid XP awards from
    // using an outdated XP value.
    xpRef.current = newXP;

    setXP(newXP);

    // Only show the level-up popup when
    // XP was actually awarded and the
    // award crossed a level threshold.
    if (
      newLevel >
      previousLevel
    ) {
      setLevelUpData({
        previousLevel,
        newLevel,
        date:
          new Date().toISOString(),
      });
    }

    const event =
      createXPEvent({
        amount: earned,
        reason,
        source,
      });

    setXPHistory(
      (previous) => [
        event,
        ...previous,
      ].slice(0, 100)
    );

    setLastXPEvent(event);

    return {
      success: true,
      event,
    };
  }

  // =========================
  // UI Controls
  // =========================

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