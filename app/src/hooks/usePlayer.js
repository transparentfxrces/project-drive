import { useState, useEffect } from "react";

export default function usePlayer() {
  const defaultPlayer = {
    name: "Jason",
    grade: "Rising Junior",
    graduationYear: "2027",

    school: "BTHS",
    team: "Varsity Football",

    position: "Offensive Line",
    jersey: "72",

    height: `6'1"`,
    weight: "245",

    dominantHand: "Right",
    gpa: "4.5",

    seasonGoals: [
      "Increase strength",
      "Improve consistency",
      "Stay injury free",
      "Dominate this season 🏈",
    ],
  };

  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem("player");

    if (!saved) return defaultPlayer;

    try {
      const parsed = JSON.parse(saved);

      return {
        ...defaultPlayer,
        ...parsed,
        seasonGoals:
          parsed.seasonGoals ??
          defaultPlayer.seasonGoals,
      };
    } catch {
      return defaultPlayer;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "player",
      JSON.stringify(player)
    );
  }, [player]);

  // Save ENTIRE player object
  function updatePlayer(updatedPlayer) {
    setPlayer(updatedPlayer);
  }

  function updateSeasonGoal(index, value) {
    setPlayer((prev) => ({
      ...prev,
      seasonGoals: prev.seasonGoals.map((goal, i) =>
        i === index ? value : goal
      ),
    }));
  }

  return {
    player,
    updatePlayer,
    updateSeasonGoal,
  };
}