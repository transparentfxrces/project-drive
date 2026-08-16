import { useState, useEffect } from "react";

const defaultRecovery = {
  sleepHours: "",
  sleepQuality: 3,
  soreness: 5,
  energy: 5,
  mood: 5,
  hydration: 5,
};

export default function useRecovery() {
  const [recovery, setRecovery] = useState(() => {
    const saved = localStorage.getItem("recovery");

    return saved
      ? JSON.parse(saved)
      : defaultRecovery;
  });

  const [recoveryHistory, setRecoveryHistory] =
  useState(() => {

    const saved =
      localStorage.getItem(
        "recoveryHistory"
      );

    if (!saved) {
      return [];
    }

    try {

      const parsed =
        JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch {

      return [];

    }

  });

  useEffect(() => {
    localStorage.setItem(
      "recovery",
      JSON.stringify(recovery)
    );
  }, [recovery]);

  useEffect(() => {
  localStorage.setItem(
    "recoveryHistory",
    JSON.stringify(
      recoveryHistory
    )
  );
}, [recoveryHistory]);

  function updateRecovery(field, value) {
    setRecovery((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      Number(recovery.sleepHours) || 0,

    sleepQuality:
      Number(recovery.sleepQuality),

    soreness:
      Number(recovery.soreness),

    energy:
      Number(recovery.energy),

    mood:
      Number(recovery.mood),

    hydration:
      Number(recovery.hydration),

    score,

    readiness:
      currentReadiness,

  };

  setRecoveryHistory((previous) => {

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
    if (existingIndex !== -1) {

      return previous.map(
        (item, index) =>

          index === existingIndex
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

  });

}

  function calculateRecoveryScore() {
    let score = 100;

    const sleep =
      Number(recovery.sleepHours);

    if (sleep < 6) score -= 20;
    else if (sleep < 8) score -= 10;

    score -=
      (10 - Number(recovery.energy)) * 3;

    score -=
      (10 - Number(recovery.mood)) * 2;

    score -=
      Number(recovery.soreness) * 2;

    score -=
      (10 - Number(recovery.hydration)) * 2;

    return Math.max(
      0,
      Math.min(100, Math.round(score))
    );
  }

  function readiness(score) {
    if (score >= 85)
      return "READY";

    if (score >= 65)
      return "LIGHT DAY";

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