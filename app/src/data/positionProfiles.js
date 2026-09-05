const positionProfiles = {
  OFFENSE: {
    label: "Offense",
    positions: {
      QB: {
        label: "Quarterback",
        goals: [
          "Improve throwing development",
          "Improve footwork and movement",
          "Improve decision-making",
          "Build arm-care and recovery habits",
          "Build consistency",
        ],
        quests: [
          "Complete a quarterback technique session",
          "Complete a footwork or movement session",
          "Complete a throwing-development session",
          "Complete a recovery session",
          "Log 3 training sessions this week",
        ],
      },

      RB: {
        label: "Running Back",
        goals: [
          "Improve acceleration",
          "Improve agility and change of direction",
          "Improve ball security",
          "Improve conditioning",
          "Build consistency",
        ],
        quests: [
          "Complete an acceleration session",
          "Complete an agility session",
          "Complete a ball-security session",
          "Complete a conditioning session",
          "Log 3 training sessions this week",
        ],
      },

      FB: {
        label: "Fullback",
        goals: [
          "Improve lower-body strength",
          "Improve blocking technique",
          "Improve acceleration",
          "Improve conditioning",
          "Build consistency",
        ],
        quests: [
          "Complete a lower-body strength session",
          "Complete a blocking-technique session",
          "Complete an acceleration session",
          "Complete a conditioning session",
          "Log 3 training sessions this week",
        ],
      },

      WR: {
        label: "Wide Receiver",
        goals: [
          "Improve speed",
          "Improve route technique",
          "Improve catching consistency",
          "Improve agility",
          "Build consistency",
        ],
        quests: [
          "Complete a route-technique session",
          "Complete a speed session",
          "Complete a catching session",
          "Complete an agility session",
          "Log 3 training sessions this week",
        ],
      },

      TE: {
        label: "Tight End",
        goals: [
          "Improve strength",
          "Improve route technique",
          "Improve blocking technique",
          "Improve movement quality",
          "Build consistency",
        ],
        quests: [
          "Complete a strength session",
          "Complete a route-technique session",
          "Complete a blocking-technique session",
          "Complete a movement session",
          "Log 3 training sessions this week",
        ],
      },

      OT: {
        label: "Offensive Tackle",
        goals: [
          "Improve lower-body strength",
          "Improve footwork",
          "Improve leverage",
          "Improve blocking technique",
          "Build consistency",
        ],
        quests: [
          "Complete a lower-body strength session",
          "Complete a footwork session",
          "Complete a leverage session",
          "Complete a blocking-technique session",
          "Log 3 training sessions this week",
        ],
      },

      OG: {
        label: "Offensive Guard",
        goals: [
          "Improve lower-body strength",
          "Improve core stability",
          "Improve footwork",
          "Improve leverage and blocking technique",
          "Build consistency",
        ],
        quests: [
          "Complete a lower-body strength session",
          "Complete a core-stability session",
          "Complete a footwork session",
          "Complete a blocking-technique session",
          "Log 3 training sessions this week",
        ],
      },

      C: {
        label: "Center",
        goals: [
          "Improve lower-body strength",
          "Improve core and trunk stability",
          "Improve explosive first-step movement",
          "Improve footwork and leverage",
          "Improve hand placement and blocking technique",
          "Build consistency",
        ],
        quests: [
          "Complete a lower-body strength session",
          "Complete a core and stability session",
          "Complete a first-step or movement session",
          "Complete a blocking-technique session",
          "Log 3 training sessions this week",
        ],
      },
    },
  },

  DEFENSE: {
    label: "Defense",
    positions: {
      DE: {
        label: "Defensive End",
        goals: [
          "Improve strength",
          "Improve first-step explosiveness",
          "Improve leverage",
          "Improve pass-rush technique",
          "Build consistency",
        ],
        quests: [
          "Complete a strength session",
          "Complete a first-step quickness session",
          "Complete a leverage session",
          "Complete a pass-rush technique session",
          "Log 3 training sessions this week",
        ],
      },

      DT: {
        label: "Defensive Tackle",
        goals: [
          "Improve lower-body strength",
          "Improve upper-body strength",
          "Improve first-step explosiveness",
          "Improve leverage and hand technique",
          "Build consistency",
        ],
        quests: [
          "Complete a strength session",
          "Complete a first-step quickness session",
          "Complete a leverage session",
          "Complete a hand-technique session",
          "Log 3 training sessions this week",
        ],
      },

      NT: {
        label: "Nose Tackle",
        goals: [
          "Improve lower-body strength",
          "Improve upper-body strength",
          "Improve first-step explosiveness",
          "Improve leverage",
          "Improve hand placement",
          "Improve gap-control technique",
          "Build consistency",
        ],
        quests: [
          "Complete a lower-body strength session",
          "Complete an upper-body strength session",
          "Complete a first-step quickness session",
          "Complete a leverage or hand-technique session",
          "Log 3 training sessions this week",
        ],
      },

      EDGE: {
        label: "EDGE",
        goals: [
          "Improve explosiveness",
          "Improve speed",
          "Improve leverage",
          "Improve pass-rush technique",
          "Build consistency",
        ],
        quests: [
          "Complete an explosiveness session",
          "Complete a speed session",
          "Complete a leverage session",
          "Complete a pass-rush technique session",
          "Log 3 training sessions this week",
        ],
      },

      LB: {
        label: "Linebacker",
        goals: [
          "Improve strength",
          "Improve agility",
          "Improve reaction",
          "Improve tackling technique",
          "Build consistency",
        ],
        quests: [
          "Complete a strength session",
          "Complete an agility session",
          "Complete a reaction session",
          "Complete a tackling-technique session",
          "Log 3 training sessions this week",
        ],
      },

      OLB: {
        label: "Outside Linebacker",
        goals: [
          "Improve speed",
          "Improve agility",
          "Improve strength",
          "Improve pass-rush technique",
          "Build consistency",
        ],
        quests: [
          "Complete a speed session",
          "Complete an agility session",
          "Complete a strength session",
          "Complete a pass-rush technique session",
          "Log 3 training sessions this week",
        ],
      },

      ILB: {
        label: "Inside Linebacker",
        goals: [
          "Improve strength",
          "Improve reaction",
          "Improve agility",
          "Improve tackling technique",
          "Build consistency",
        ],
        quests: [
          "Complete a strength session",
          "Complete a reaction session",
          "Complete an agility session",
          "Complete a tackling-technique session",
          "Log 3 training sessions this week",
        ],
      },

      MLB: {
        label: "Middle Linebacker",
        goals: [
          "Improve strength",
          "Improve reaction",
          "Improve change of direction",
          "Improve tackling technique",
          "Build consistency",
        ],
        quests: [
          "Complete a strength session",
          "Complete a reaction session",
          "Complete a change-of-direction session",
          "Complete a tackling-technique session",
          "Log 3 training sessions this week",
        ],
      },

      CB: {
        label: "Cornerback",
        goals: [
          "Improve speed",
          "Improve reaction",
          "Improve agility",
          "Improve coverage technique",
          "Build consistency",
        ],
        quests: [
          "Complete a speed session",
          "Complete a reaction session",
          "Complete an agility session",
          "Complete a coverage-technique session",
          "Log 3 training sessions this week",
        ],
      },

      S: {
        label: "Safety",
        goals: [
          "Improve speed",
          "Improve reaction",
          "Improve agility",
          "Improve coverage and tackling technique",
          "Build consistency",
        ],
        quests: [
          "Complete a speed session",
          "Complete a reaction session",
          "Complete an agility session",
          "Complete a coverage or tackling session",
          "Log 3 training sessions this week",
        ],
      },

      FS: {
        label: "Free Safety",
        goals: [
          "Improve speed",
          "Improve reaction",
          "Improve range and movement",
          "Improve coverage technique",
          "Build consistency",
        ],
        quests: [
          "Complete a speed session",
          "Complete a reaction session",
          "Complete a movement session",
          "Complete a coverage-technique session",
          "Log 3 training sessions this week",
        ],
      },

      SS: {
        label: "Strong Safety",
        goals: [
          "Improve strength",
          "Improve reaction",
          "Improve tackling technique",
          "Improve coverage technique",
          "Build consistency",
        ],
        quests: [
          "Complete a strength session",
          "Complete a reaction session",
          "Complete a tackling-technique session",
          "Complete a coverage-technique session",
          "Log 3 training sessions this week",
        ],
      },
    },
  },

  SPECIAL_TEAMS: {
    label: "Special Teams",
    positions: {
      K: {
        label: "Kicker",
        goals: [
          "Improve kicking technique",
          "Improve consistency",
          "Improve movement quality",
          "Build recovery habits",
          "Build consistency",
        ],
        quests: [
          "Complete a kicking-technique session",
          "Complete a consistency session",
          "Complete a movement session",
          "Complete a recovery session",
          "Log 3 training sessions this week",
        ],
      },

      P: {
        label: "Punter",
        goals: [
          "Improve punting technique",
          "Improve consistency",
          "Improve movement quality",
          "Build recovery habits",
          "Build consistency",
        ],
        quests: [
          "Complete a punting-technique session",
          "Complete a consistency session",
          "Complete a movement session",
          "Complete a recovery session",
          "Log 3 training sessions this week",
        ],
      },

      LS: {
        label: "Long Snapper",
        goals: [
          "Improve snapping consistency",
          "Improve movement quality",
          "Improve technique",
          "Improve core stability",
          "Build consistency",
        ],
        quests: [
          "Complete a snapping-technique session",
          "Complete a movement session",
          "Complete a technique session",
          "Complete a core-stability session",
          "Log 3 training sessions this week",
        ],
      },
    },
  },
};

export function getPositionProfileByCode(code) {
  const normalized = String(code || "").trim().toUpperCase();

  if (!normalized) return null;

  for (const group of Object.values(positionProfiles)) {
    for (const [label, position] of Object.entries(group.positions)) {
      if (
        position.code === normalized ||
        label.trim().toUpperCase() === normalized
      ) {
        return position;
      }
    }
  }

  return null;
}

export default positionProfiles;