import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const defaultRecovery = {
  sleepHours: "",
  sleepQuality: 3,
  soreness: 5,
  energy: 5,
  mood: 5,
  hydration: 5,
};

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

    const parsed = JSON.parse(saved);

    return parsed;
  } catch (error) {
    console.error(
      `Unable to read ${storageKey}:`,
      error
    );

    return fallback;
  }
}

export default function useRecovery() {
  const [userId, setUserId] =
    useState(null);

  const [recovery, setRecovery] =
    useState(defaultRecovery);

  const [recoveryHistory, setRecoveryHistory] =
    useState([]);

  /*
   * Track the currently authenticated athlete.
   */
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
   * Load recovery data whenever
   * the authenticated athlete changes.
   */
  useEffect(() => {
    if (!userId) {
      setRecovery(
        defaultRecovery
      );

      setRecoveryHistory([]);

      return;
    }

    const recoveryStorageKey =
      `recovery_${userId}`;

    const historyStorageKey =
      `recoveryHistory_${userId}`;

    const savedRecovery =
      safelyReadStorage(
        recoveryStorageKey,
        defaultRecovery
      );

    const savedHistory =
      safelyReadStorage(
        historyStorageKey,
        []
      );

    setRecovery({
      ...defaultRecovery,
      ...(savedRecovery &&
      typeof savedRecovery ===
        "object"
        ? savedRecovery
        : {}),
    });

    setRecoveryHistory(
      Array.isArray(savedHistory)
        ? savedHistory
        : []
    );
  }, [userId]);

  /*
   * Persist current recovery data
   * for this athlete only.
   */
  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `recovery_${userId}`,
      JSON.stringify(recovery)
    );
  }, [
    recovery,
    userId,
  ]);

  /*
   * Persist recovery history
   * for this athlete only.
   */
  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `recoveryHistory_${userId}`,
      JSON.stringify(
        recoveryHistory
      )
    );
  }, [
    recoveryHistory,
    userId,
  ]);

  function updateRecovery(
    field,
    value
  ) {
    setRecovery(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  }

  function saveRecoveryCheckIn() {
    const score =
      calculateRecoveryScore();

    const currentReadiness =
      readiness(score);

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

    const date =
      `${year}-${month}-${day}`;

    const entry = {
      id: crypto.randomUUID(),

      date,

      sleepHours:
        Number(
          recovery.sleepHours
        ) || 0,

      sleepQuality:
        Number(
          recovery.sleepQuality
        ),

      soreness:
        Number(
          recovery.soreness
        ),

      energy:
        Number(
          recovery.energy
        ),

      mood:
        Number(
          recovery.mood
        ),

      hydration:
        Number(
          recovery.hydration
        ),

      score,

      readiness:
        currentReadiness,
    };

    setRecoveryHistory(
      (previous) => {
        const existingIndex =
          previous.findIndex(
            (item) =>
              item.date === date
          );

        /*
         * Already saved today?
         * Update today's entry instead
         * of creating a duplicate.
         */
        if (
          existingIndex !== -1
        ) {
          return previous.map(
            (
              item,
              index
            ) =>
              index ===
              existingIndex
                ? {
                    ...entry,
                    id: item.id,
                  }
                : item
          );
        }

        /*
         * First check-in today:
         * add it to the beginning.
         */
        return [
          entry,
          ...previous,
        ];
      }
    );
  }

  function calculateRecoveryScore() {
    let score = 100;

    const sleep =
      Number(
        recovery.sleepHours
      );

    if (sleep < 6) {
      score -= 20;
    } else if (sleep < 8) {
      score -= 10;
    }

    score -=
      (10 -
        Number(
          recovery.energy
        )) * 3;

    score -=
      (10 -
        Number(
          recovery.mood
        )) * 2;

    score -=
      Number(
        recovery.soreness
      ) * 2;

    score -=
      (10 -
        Number(
          recovery.hydration
        )) * 2;

    return Math.max(
      0,
      Math.min(
        100,
        Math.round(score)
      )
    );
  }

  function readiness(score) {
    if (score >= 85) {
      return "READY";
    }

    if (score >= 65) {
      return "LIGHT DAY";
    }

    return "RECOVERY";
  }

  return {
    recovery,

    updateRecovery,

    recoveryHistory,

    saveRecoveryCheckIn,

    recoveryScore:
      calculateRecoveryScore(),

    readiness:
      readiness(
        calculateRecoveryScore()
      ),
  };
}