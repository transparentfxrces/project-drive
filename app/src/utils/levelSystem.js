const BASE_XP = 1000;
const XP_GROWTH = 200;

export function getLevelData(totalXP) {
  totalXP = Math.max(0, Number(totalXP) || 0);

  let level = 1;
  let xpSpent = 0;
  let xpForNextLevel = BASE_XP;

  while (totalXP >= xpSpent + xpForNextLevel) {
    xpSpent += xpForNextLevel;
    level++;
    xpForNextLevel = BASE_XP + (level - 1) * XP_GROWTH;
  }

  return {
    level,
    currentXP: totalXP - xpSpent,
    nextLevelXP: xpForNextLevel,
    totalXP,
  };
}