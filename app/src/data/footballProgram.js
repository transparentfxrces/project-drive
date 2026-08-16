const intensity = {
  week1: {
    low: 65,
    high: 70,
    fridayLow: 45,
    fridayHigh: 60,
  },

  week2: {
    low: 70,
    high: 75,
    fridayLow: 50,
    fridayHigh: 65,
  },

  week3: {
    low: 75,
    high: 80,
    fridayLow: 55,
    fridayHigh: 70,
  },

  week4: {
    low: 80,
    high: 85,
    fridayLow: 60,
    fridayHigh: 75,
  },

  // Wave 2

  week5: {
    low: 75,
    high: 80,
    fridayLow: 55,
    fridayHigh: 70,
  },

  week6: {
    low: 80,
    high: 85,
    fridayLow: 60,
    fridayHigh: 75,
  },

  week7: {
    low: 85,
    high: 90,
    fridayLow: 65,
    fridayHigh: 80,
  },

  week8: {
    low: 90,
    high: 95,
    fridayLow: 70,
    fridayHigh: 85,
  },
};

function buildWeek(week) {
  const i = intensity[week];

  return {
    monday: [
      {
        exercise: "Bench Press Warm Up",
        maxLift: "bench",
        sets: [
          { reps: 8, percent: 25 },
          { reps: 8, percent: 45 },
        ],
      },

      {
        exercise: "Bench Press",
        maxLift: "bench",
        sets: [
          { reps: 6, percent: i.low },
          { reps: 6, percent: i.low },
          { reps: 5, percent: i.high },
          { reps: 5, percent: i.high },
        ],
      },

      {
        exercise: "Plyo Push Ups",
        sets: [{ reps: 5 }],
      },

      {
        exercise: "Squat Warm Up",
        maxLift: "squat",
        sets: [
          { reps: 8, percent: 25 },
          { reps: 8, percent: 45 },
        ],
      },

      {
        exercise: "Squat",
        maxLift: "squat",
        sets: [
          { reps: 6, percent: i.low },
          { reps: 6, percent: i.low },
          { reps: 5, percent: i.high },
          { reps: 5, percent: i.high },
        ],
      },

      {
        exercise: "Rear Foot Elevated Jump Squat",
        sets: [{ reps: 3 }],
      },

      {
        exercise: "Step Ups",
        sets: [
          { reps: 6 },
          { reps: 6 },
        ],
      },

      {
        exercise: "Pendlay Row",
        sets: [
          { reps: 12 },
          { reps: 12 },
        ],
      },

      {
        exercise: "Anterior Curtsey Step Ups",
        sets: [
          { reps: 6 },
          { reps: 6 },
        ],
      },

      {
        exercise: "Hanging Knee Raise",
        sets: [
          { reps: 10 },
          { reps: 10 },
          { reps: 10 },
        ],
      },

      {
        exercise: "Jackknife Situps",
        sets: [
          { reps: 10 },
          { reps: 10 },
          { reps: 10 },
        ],
      },

      {
        exercise: "Star Side Plank Hip Drops",
        sets: [
          { reps: 10 },
          { reps: 10 },
          { reps: 10 },
        ],
      },
    ],

    wednesday: [
      {
        exercise: "Trap Deadlift Warm Up",
        maxLift: "deadlift",
        sets: [
          { reps: 8, percent: 25 },
          { reps: 8, percent: 45 },
        ],
      },

      {
        exercise: "Trap Deadlift",
        maxLift: "deadlift",
        sets: [
          { reps: 6, percent: i.low },
          { reps: 6, percent: i.low },
          { reps: 5, percent: i.high },
          { reps: 5, percent: i.high },
        ],
      },

      {
        exercise: "Incline Bench Warm Up",
        maxLift: "bench",
        multiplier: 0.9,
        sets: [
          { reps: 8, percent: 25 },
          { reps: 8, percent: 45 },
        ],
      },

      {
        exercise: "Incline Bench",
        maxLift: "bench",
        multiplier: 0.9,
        sets: [
          { reps: 6, percent: i.low },
          { reps: 6, percent: i.low },
          { reps: 5, percent: i.high },
          { reps: 5, percent: i.high },
        ],
      },

      {
        exercise: "Depth Jump Push Up",
        sets: [{ reps: 3 }],
      },

      {
        exercise: "Wide Grip Pull Ups",
        sets: [
          { reps: 12 },
          { reps: 12 },
        ],
      },

      {
        exercise: "SL Slider Hamstring Curl",
        sets: [
          { reps: 6 },
          { reps: 6 },
        ],
      },

      {
        exercise: "Lateral Step Ups",
        sets: [
          { reps: 12 },
          { reps: 12 },
        ],
      },

      {
        exercise: "Alt Plank",
        sets: [
          { reps: 10 },
          { reps: 10 },
          { reps: 10 },
        ],
      },

      {
        exercise: "Copenhagen Side Plank",
        sets: [
          { reps: 10 },
          { reps: 10 },
          { reps: 10 },
        ],
      },

      {
        exercise: "Back Extensions",
        sets: [
          { reps: 10 },
          { reps: 10 },
          { reps: 10 },
        ],
      },
    ],

    friday: [
      {
        exercise: "Power Clean",
        maxLift: "powerClean",
        sets: [
          { reps: 6, percent: i.fridayLow },
          { reps: 6, percent: i.fridayLow + 5 },
          { reps: 5, percent: i.fridayHigh - 5 },
          { reps: 5, percent: i.fridayHigh },
        ],
      },

      {
        exercise: "Seated Box Jumps",
        sets: [{ reps: 3 }],
      },

      {
        exercise: "Split Jerk",
        sets: [
          { reps: 3 },
          { reps: 3 },
          { reps: 3 },
        ],
      },

      {
        exercise: "Front Squat",
        maxLift: "powerClean",
        multiplier: 1.25,
        sets: [
          { reps: 8, percent: i.high + 5 },
          { reps: 8, percent: i.high + 10 },
        ],
      },

      {
        exercise: "Bench Neck",
        sets: [
          { reps: "15 sec" },
          { reps: "15 sec" },
        ],
      },

      {
        exercise: "Barbell Shrugs",
        maxLift: "powerClean",
        multiplier: 1.25,
        sets: [
          { reps: 12, percent: i.high + 5 },
          { reps: 12, percent: i.high + 10 },
        ],
      },

      {
        exercise: "Aesthetic Arms",
        sets: [
          { reps: 10 },
          { reps: 10 },
        ],
      },
    ],
  };
}

const footballProgram = {
  week1: buildWeek("week1"),
  week2: buildWeek("week2"),
  week3: buildWeek("week3"),
  week4: buildWeek("week4"),
  week5: buildWeek("week5"),
  week6: buildWeek("week6"),
  week7: buildWeek("week7"),
  week8: buildWeek("week8"),
};

export default footballProgram;