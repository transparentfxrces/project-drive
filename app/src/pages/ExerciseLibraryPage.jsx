import React, { useMemo, useState } from "react";
import "../styles/ExerciseLibrary.css";
import positionProfiles from "../data/positionProfiles";

const exerciseDetails = {
  "Bench Press": {
    develops: "Upper-body pressing strength, chest, shoulders, and triceps.",
    howTo:
      "Set your shoulders against the bench, keep your feet planted, lower the bar under control, then press it upward without bouncing it off your chest.",
    cues: [
      "Keep your shoulder blades pulled back.",
      "Keep your feet planted.",
      "Control the lowering phase.",
      "Press smoothly instead of bouncing.",
    ],
    equipment: "Barbell, plates, and bench",
    mistakes: [
      "Letting the shoulders roll forward",
      "Bouncing the bar",
      "Lifting the feet off the floor",
    ],
  },

  "Incline Bench Press": {
    develops:
      "Upper-chest pressing strength plus shoulders and triceps.",
    howTo:
      "Set the bench to an incline, stabilize your upper back, lower the weight with control, and press back up while maintaining your position.",
    cues: [
      "Keep your upper back stable.",
      "Lower with control.",
      "Keep wrists stacked over your forearms.",
      "Do not turn the movement into a shoulder-only press.",
    ],
    equipment: "Barbell or dumbbells and incline bench",
    mistakes: [
      "Using excessive bench angle",
      "Losing upper-back position",
      "Dropping the weight too quickly",
    ],
  },

  "Decline Bench Press": {
    develops: "Chest and triceps pressing strength.",
    howTo:
      "Secure yourself on the decline bench, lower the weight under control, and press it upward while keeping your body stable.",
    cues: [
      "Stay securely positioned.",
      "Keep the movement controlled.",
      "Maintain consistent bar path.",
    ],
    equipment: "Barbell or dumbbells and decline bench",
    mistakes: [
      "Losing body position",
      "Using uncontrolled reps",
      "Going heavier than your technique allows",
    ],
  },

  "Dumbbell Bench Press": {
    develops:
      "Chest, shoulders, triceps, and unilateral pressing control.",
    howTo:
      "Lie on the bench with a dumbbell in each hand, lower both weights with control, then press them back up while keeping your shoulders stable.",
    cues: [
      "Keep both sides controlled.",
      "Maintain stable shoulders.",
      "Use a comfortable range of motion.",
    ],
    equipment: "Dumbbells and bench",
    mistakes: [
      "Letting one side move much faster",
      "Dropping the dumbbells",
      "Losing shoulder position",
    ],
  },

  "Cable Fly": {
    develops: "Chest control and horizontal pressing strength.",
    howTo:
      "Stand between the cable handles, maintain a stable stance, and bring your hands together in a controlled arc before returning slowly.",
    cues: [
      "Keep a soft bend in the elbows.",
      "Move through the chest rather than swinging.",
      "Control both directions.",
    ],
    equipment: "Cable machine",
    mistakes: [
      "Using momentum",
      "Overextending the shoulders",
      "Turning it into a press",
    ],
  },

  "Push Ups": {
    develops: "Chest, shoulders, triceps, and trunk stability.",
    howTo:
      "Start in a strong plank position, lower your body under control, then press the floor away to return to the starting position.",
    cues: [
      "Keep your body in one line.",
      "Brace your core.",
      "Keep your hands in a comfortable position.",
      "Control every rep.",
    ],
    equipment: "None",
    mistakes: [
      "Sagging the hips",
      "Flaring the elbows excessively",
      "Cutting reps short",
    ],
  },

  "Barbell Row": {
    develops: "Upper-back strength, lats, and pulling control.",
    howTo:
      "Hinge into a stable position, keep your torso controlled, pull the bar toward your torso, then lower it without losing your position.",
    cues: [
      "Brace your trunk.",
      "Keep the spine stable.",
      "Pull with your back.",
      "Avoid using momentum.",
    ],
    equipment: "Barbell and plates",
    mistakes: [
      "Rounding the back",
      "Jerking the bar",
      "Turning the movement into a shrug",
    ],
  },

  "Lat Pulldown": {
    develops: "Lat strength, upper-back strength, and pulling mechanics.",
    howTo:
      "Sit securely at the machine, pull the bar toward your upper chest while keeping your torso controlled, then return it slowly.",
    cues: [
      "Keep your chest tall.",
      "Pull your elbows down.",
      "Control the return.",
    ],
    equipment: "Lat pulldown machine",
    mistakes: [
      "Swinging backward",
      "Pulling behind the neck",
      "Using excessive momentum",
    ],
  },

  "Pull Ups": {
    develops: "Lats, upper back, grip, and body-control strength.",
    howTo:
      "Start from a controlled hanging position, pull your body upward using your back and arms, then lower under control.",
    cues: [
      "Keep your trunk controlled.",
      "Drive your elbows down.",
      "Avoid excessive swinging.",
    ],
    equipment: "Pull-up bar",
    mistakes: [
      "Kipping or swinging unnecessarily",
      "Using partial reps",
      "Losing control on the way down",
    ],
  },

  "Seated Cable Row": {
    develops: "Upper-back strength, lats, and scapular control.",
    howTo:
      "Sit tall, brace your trunk, pull the handle toward your torso, squeeze your upper back, then slowly return.",
    cues: [
      "Keep your torso stable.",
      "Pull elbows toward your sides.",
      "Control the eccentric portion.",
    ],
    equipment: "Cable row machine",
    mistakes: [
      "Rocking the torso",
      "Shrugging the shoulders",
      "Rushing the return",
    ],
  },

  "Single Arm Row": {
    develops: "Back strength, shoulder control, and unilateral pulling.",
    howTo:
      "Support yourself in a stable position, pull the weight toward your torso, then lower it under control.",
    cues: [
      "Keep your torso stable.",
      "Pull toward the hip or lower ribs.",
      "Keep the shoulder controlled.",
    ],
    equipment: "Dumbbell or cable",
    mistakes: [
      "Twisting the torso",
      "Shrugging",
      "Using momentum",
    ],
  },

  "Overhead Press": {
    develops: "Shoulder and triceps strength with trunk stability.",
    howTo:
      "Start with the weight around shoulder height, brace your trunk, press overhead, then lower under control.",
    cues: [
      "Brace your core.",
      "Keep the weight controlled.",
      "Avoid excessive back arching.",
    ],
    equipment: "Barbell or dumbbells",
    mistakes: [
      "Overarching the lower back",
      "Using leg drive when it is not intended",
      "Losing control overhead",
    ],
  },

  "Dumbbell Shoulder Press": {
    develops: "Shoulder strength and unilateral pressing control.",
    howTo:
      "Start with dumbbells around shoulder height, press them upward under control, then return to the starting position.",
    cues: [
      "Keep your trunk stable.",
      "Press smoothly.",
      "Keep both arms controlled.",
    ],
    equipment: "Dumbbells and bench",
    mistakes: [
      "Overarching the back",
      "Using momentum",
      "Letting one arm dominate",
    ],
  },

  "Lateral Raise": {
    develops: "Shoulder strength and control through the lateral plane.",
    howTo:
      "With light weights, raise your arms outward in a controlled motion, then lower them slowly.",
    cues: [
      "Use controlled movement.",
      "Keep a slight bend in the elbows.",
      "Avoid swinging the weights.",
    ],
    equipment: "Dumbbells or cables",
    mistakes: [
      "Using momentum",
      "Going heavier than your control allows",
      "Shrugging excessively",
    ],
  },

  "Rear Delt Fly": {
    develops: "Rear shoulder and upper-back control.",
    howTo:
      "Hinge or sit in a supported position, move the arms outward while maintaining control, then return slowly.",
    cues: [
      "Keep your torso stable.",
      "Move from the shoulders.",
      "Use controlled resistance.",
    ],
    equipment: "Dumbbells or machine",
    mistakes: [
      "Swinging",
      "Shrugging",
      "Using excessive weight",
    ],
  },

  "Front Raise": {
    develops: "Anterior shoulder strength and control.",
    howTo:
      "Raise the weight in front of you with control, then lower it slowly without swinging.",
    cues: [
      "Keep the movement smooth.",
      "Avoid momentum.",
      "Stop at a comfortable height.",
    ],
    equipment: "Dumbbells or plates",
    mistakes: [
      "Swinging the weight",
      "Using excessive load",
      "Arching the back",
    ],
  },

  "Barbell Curl": {
    develops: "Biceps strength and elbow-flexion control.",
    howTo:
      "Stand tall with the bar, keep your elbows controlled near your sides, curl the weight upward, then lower it slowly.",
    cues: [
      "Keep elbows controlled.",
      "Avoid swinging.",
      "Control the lowering phase.",
    ],
    equipment: "Barbell and plates",
    mistakes: [
      "Leaning backward",
      "Swinging the bar",
      "Using excessive weight",
    ],
  },

  "Hammer Curl": {
    develops: "Biceps, brachialis, and grip strength.",
    howTo:
      "Hold the dumbbells with a neutral grip, curl them upward while keeping the elbows controlled, then lower slowly.",
    cues: [
      "Keep palms facing inward.",
      "Stay tall.",
      "Control each rep.",
    ],
    equipment: "Dumbbells",
    mistakes: [
      "Swinging",
      "Moving the elbows excessively",
      "Rushing the lowering phase",
    ],
  },

  "Tricep Pushdown": {
    develops: "Triceps strength and elbow-extension control.",
    howTo:
      "Keep your elbows close to your sides, press the cable downward, then return under control.",
    cues: [
      "Keep elbows stable.",
      "Use controlled reps.",
      "Avoid leaning heavily into the movement.",
    ],
    equipment: "Cable machine",
    mistakes: [
      "Moving the elbows",
      "Using bodyweight to force reps",
      "Rushing the return",
    ],
  },

  "Skull Crushers": {
    develops: "Triceps strength and controlled elbow extension.",
    howTo:
      "Lie on a bench, lower the weight toward the upper forehead area with controlled elbows, then extend the arms back upward.",
    cues: [
      "Keep elbows controlled.",
      "Use a manageable load.",
      "Move slowly and deliberately.",
    ],
    equipment: "EZ-bar or dumbbells and bench",
    mistakes: [
      "Letting elbows flare excessively",
      "Using too much weight",
      "Dropping the weight quickly",
    ],
  },

  "Preacher Curl": {
    develops: "Biceps strength with controlled elbow flexion.",
    howTo:
      "Place your upper arms against the preacher pad, curl the weight upward, then lower it under control.",
    cues: [
      "Keep your arms supported.",
      "Use a controlled range.",
      "Do not bounce out of the bottom.",
    ],
    equipment: "Preacher bench and barbell or dumbbells",
    mistakes: [
      "Using momentum",
      "Dropping into the bottom position",
      "Using excessive weight",
    ],
  },

  Squat: {
    develops: "Lower-body strength, leg drive, and trunk control.",
    howTo:
      "Set your stance comfortably, brace your trunk, sit down under control, then drive through the floor to stand.",
    cues: [
      "Brace before each rep.",
      "Keep your feet planted.",
      "Track your knees in line with your feet.",
      "Control the descent.",
    ],
    equipment: "Squat rack, barbell, and plates",
    mistakes: [
      "Losing trunk position",
      "Letting the knees collapse inward",
      "Rushing the descent",
    ],
  },

  Deadlift: {
    develops: "Posterior-chain strength, hip drive, and trunk stability.",
    howTo:
      "Set up with the weight close to your body, brace your trunk, push through the floor, and stand tall while keeping the load controlled.",
    cues: [
      "Keep the weight close.",
      "Brace before lifting.",
      "Push the floor away.",
      "Finish tall without excessive leaning.",
    ],
    equipment: "Barbell and plates",
    mistakes: [
      "Rounding the back",
      "Starting with the weight too far away",
      "Jerking the bar from the floor",
    ],
  },

  "Romanian Deadlift": {
    develops: "Hamstrings, glutes, hip-hinge mechanics, and posterior-chain control.",
    howTo:
      "Start tall, push your hips backward while keeping the weight close, lower until you reach a comfortable range, then drive the hips forward.",
    cues: [
      "Think hips back.",
      "Keep the weight close.",
      "Maintain a stable trunk.",
      "Feel the hamstrings load.",
    ],
    equipment: "Barbell or dumbbells",
    mistakes: [
      "Squatting instead of hinging",
      "Letting the weight drift away",
      "Going deeper than your control allows",
    ],
  },

  "Leg Press": {
    develops: "Lower-body strength through the quads and glutes.",
    howTo:
      "Set your position securely, lower the platform under control, then press it away while maintaining stable body position.",
    cues: [
      "Keep your hips stable.",
      "Control the descent.",
      "Keep your feet planted.",
    ],
    equipment: "Leg press machine",
    mistakes: [
      "Allowing the hips to lift",
      "Using uncontrolled range",
      "Locking the knees aggressively",
    ],
  },

  "Leg Extension": {
    develops: "Quadriceps strength and knee-extension control.",
    howTo:
      "Sit securely against the pad, extend the lower legs smoothly, then return the weight under control.",
    cues: [
      "Stay seated.",
      "Use controlled movement.",
      "Avoid swinging.",
    ],
    equipment: "Leg extension machine",
    mistakes: [
      "Using momentum",
      "Lifting the hips",
      "Rushing the return",
    ],
  },

  "Hamstring Curl": {
    develops: "Hamstring strength and knee-flexion control.",
    howTo:
      "Set the machine correctly, curl the pad toward you under control, then slowly return.",
    cues: [
      "Keep your body stable.",
      "Control both directions.",
      "Use a manageable load.",
    ],
    equipment: "Hamstring curl machine",
    mistakes: [
      "Lifting the hips",
      "Using momentum",
      "Rushing the eccentric phase",
    ],
  },

  "Walking Lunges": {
    develops: "Single-leg strength, balance, and lower-body control.",
    howTo:
      "Step forward into a controlled lunge, stabilize, drive through the front foot, and continue into the next step.",
    cues: [
      "Stay balanced.",
      "Keep the front foot planted.",
      "Control each step.",
    ],
    equipment: "None or dumbbells",
    mistakes: [
      "Taking unstable steps",
      "Letting the knee collapse inward",
      "Rushing the movement",
    ],
  },

  "Calf Raises": {
    develops: "Calf strength and lower-leg control.",
    howTo:
      "Start with your feet stable, raise your heels under control, pause briefly, then lower slowly.",
    cues: [
      "Use full controlled movement.",
      "Keep your weight balanced.",
      "Avoid bouncing.",
    ],
    equipment: "Machine, dumbbells, or bodyweight",
    mistakes: [
      "Bouncing through reps",
      "Using partial range",
      "Losing balance",
    ],
  },

  "Sled Push": {
    develops: "Lower-body drive, acceleration strength, and conditioning.",
    howTo:
      "Set your body at a strong forward angle, drive through the ground, and move the sled with controlled powerful steps.",
    cues: [
      "Keep a strong forward lean.",
      "Push through the floor.",
      "Use short, powerful steps.",
    ],
    equipment: "Weighted sled",
    mistakes: [
      "Standing too upright",
      "Taking uncontrolled steps",
      "Loading beyond your ability to maintain technique",
    ],
  },

  "Farmer Carry": {
    develops: "Grip, trunk stability, posture, and whole-body control.",
    howTo:
      "Hold a weight in each hand, stand tall, brace your trunk, and walk with controlled steps.",
    cues: [
      "Stay tall.",
      "Keep your shoulders controlled.",
      "Brace your trunk.",
      "Walk smoothly.",
    ],
    equipment: "Dumbbells, kettlebells, or farmer handles",
    mistakes: [
      "Leaning side to side",
      "Shrugging excessively",
      "Taking unstable steps",
    ],
  },

  Sprint: {
    develops: "Acceleration, speed, coordination, and athletic movement.",
    howTo:
      "Start in a stable athletic position, accelerate with controlled powerful steps, and maintain good posture as you build speed.",
    cues: [
      "Drive through the ground.",
      "Use powerful arm action.",
      "Stay controlled during acceleration.",
      "Prioritize technique over forcing speed.",
    ],
    equipment: "Open training space",
    mistakes: [
      "Starting out of balance",
      "Overstriding",
      "Losing posture",
    ],
  },

  Bike: {
    develops: "Conditioning and lower-body endurance.",
    howTo:
      "Set the bike appropriately, maintain a controlled cadence, and adjust resistance according to the planned training effort.",
    cues: [
      "Keep a consistent rhythm.",
      "Maintain stable posture.",
      "Follow the intended effort level.",
    ],
    equipment: "Stationary bike",
    mistakes: [
      "Using excessive resistance",
      "Poor seat setup",
      "Starting far harder than planned",
    ],
  },

  Row: {
    develops: "Conditioning plus coordinated leg, trunk, and upper-body work.",
    howTo:
      "Drive with the legs, transition through the trunk, finish with the arms, then return smoothly in the opposite order.",
    cues: [
      "Legs first.",
      "Keep the trunk controlled.",
      "Finish the pull smoothly.",
      "Recover under control.",
    ],
    equipment: "Rowing machine",
    mistakes: [
      "Pulling mostly with the arms",
      "Rushing the recovery",
      "Overextending the back",
    ],
  },

  "Jump Rope": {
    develops: "Foot speed, rhythm, coordination, and conditioning.",
    howTo:
      "Keep the jumps small and rhythmic while rotating the rope with your wrists and maintaining a consistent cadence.",
    cues: [
      "Stay light on your feet.",
      "Keep jumps low.",
      "Use your wrists to turn the rope.",
    ],
    equipment: "Jump rope",
    mistakes: [
      "Jumping excessively high",
      "Using large arm circles",
      "Losing rhythm",
    ],
  },

  Plank: {
    develops: "Core and trunk stability.",
    howTo:
      "Support yourself on your forearms or hands and toes, brace your trunk, and maintain a straight controlled body position.",
    cues: [
      "Brace your core.",
      "Keep your hips controlled.",
      "Breathe steadily.",
    ],
    equipment: "None",
    mistakes: [
      "Sagging the hips",
      "Raising the hips too high",
      "Holding your breath",
    ],
  },

  "Dead Bug": {
    develops: "Core control, coordination, and trunk stability.",
    howTo:
      "Lie on your back, brace your trunk, move opposite limbs away from your body while keeping your lower back controlled, then return.",
    cues: [
      "Keep your trunk stable.",
      "Move slowly.",
      "Control the return.",
    ],
    equipment: "None",
    mistakes: [
      "Arching the lower back",
      "Moving too quickly",
      "Losing core tension",
    ],
  },

  "Glute Bridge": {
    develops: "Glute strength, hip control, and posterior-chain activation.",
    howTo:
      "Lie on your back with your feet planted, brace your trunk, drive through your feet, and lift your hips under control.",
    cues: [
      "Drive through the feet.",
      "Squeeze the glutes at the top.",
      "Keep the ribs controlled.",
    ],
    equipment: "None or resistance band",
    mistakes: [
      "Overarching the lower back",
      "Pushing mostly through the toes",
      "Rushing the reps",
    ],
  },

  "Lateral Shuffle": {
    develops: "Lateral movement, footwork, balance, and change-of-direction control.",
    howTo:
      "Stay in an athletic stance and move laterally with controlled quick steps while maintaining your balance.",
    cues: [
      "Stay low and controlled.",
      "Keep your feet coordinated.",
      "Push from the outside foot.",
    ],
    equipment: "Open training space",
    mistakes: [
      "Crossing the feet unnecessarily",
      "Standing too upright",
      "Losing balance during direction changes",
    ],
  },

  "Single-Leg Balance": {
    develops: "Balance, ankle control, hip stability, and single-leg coordination.",
    howTo:
      "Stand on one leg with a controlled posture and maintain your balance while keeping the supporting foot stable.",
    cues: [
      "Keep your knee softly bent.",
      "Stay tall.",
      "Control the supporting foot.",
    ],
    equipment: "None",
    mistakes: [
      "Locking the knee",
      "Letting the foot collapse",
      "Rushing progression",
    ],
  },
};

function getExerciseDetails(exercise, positionLabel) {
  const details = exerciseDetails[exercise];

  if (details) {
    return details;
  }

  return {
    develops: "Supplemental athletic development and movement quality.",
    howTo:
      "Use a controlled range of motion, maintain stable body position, and follow the technique taught by your coach.",
    cues: [
      "Prioritize controlled technique.",
      "Use an appropriate level of resistance.",
      "Stop if you cannot maintain good form.",
    ],
    equipment: "Depends on exercise",
    mistakes: [
      "Using more resistance than you can control",
      "Rushing repetitions",
      "Ignoring technique feedback",
    ],
    positionNote: `${exercise} is included as supplemental work for ${positionLabel}.`,
  };
}

function ExerciseDetails({ exercise, positionLabel }) {
  const details = getExerciseDetails(exercise, positionLabel);

  return (
    <span
      className="exercise-library-details"
      onClick={(event) => event.stopPropagation()}
    >
      <span className="exercise-library-details-grid">
        <span className="exercise-library-detail-block">
          <span className="exercise-library-detail-label">
            DEVELOPS
          </span>
          <span>{details.develops}</span>
        </span>

        <span className="exercise-library-detail-block">
          <span className="exercise-library-detail-label">
            EQUIPMENT
          </span>
          <span>{details.equipment}</span>
        </span>

        <span className="exercise-library-detail-block">
          <span className="exercise-library-detail-label">
            HOW TO
          </span>
          <span>{details.howTo}</span>
        </span>

        <span className="exercise-library-detail-block">
          <span className="exercise-library-detail-label">
            KEY CUES
          </span>

          <span className="exercise-library-detail-list">
            {details.cues.map((cue) => (
              <span key={cue}>• {cue}</span>
            ))}
          </span>
        </span>

        <span className="exercise-library-detail-block">
          <span className="exercise-library-detail-label">
            COMMON MISTAKES
          </span>

          <span className="exercise-library-detail-list">
            {details.mistakes.map((mistake) => (
              <span key={mistake}>• {mistake}</span>
            ))}
          </span>
        </span>

        {details.positionNote && (
          <span className="exercise-library-detail-block">
            <span className="exercise-library-detail-label">
              POSITION NOTE
            </span>
            <span>{details.positionNote}</span>
          </span>
        )}
      </span>
    </span>
  );
}

function ExerciseLibraryPage({
  player,
  exerciseLibrary = {},
  positionExercises = {},
}) {
  const [activeSection, setActiveSection] = useState("position");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedExercise, setExpandedExercise] = useState(null);

  const position = player?.position || "";
  const positionGroup = player?.positionGroup || "";

  /*
   * Resolve the player's saved position into the key used by
   * positionExercises.
   *
   * Examples:
   * "Center" -> "C"
   * "Strong Safety" -> "SS"
   * "Free Safety" -> "FS"
   * "Cornerback" -> "CB"
   *
   * We also support generalized defensive-back labels such as:
   * "DB"
   * "Defensive Back"
   * "Defensive Backs"
   */
  const positionCode = useMemo(() => {
    const normalizedPosition = position.trim().toLowerCase();

    if (!normalizedPosition) {
      return "";
    }

    const defensiveBackAliases = [
      "db",
      "defensive back",
      "defensive backs",
      "defensive backfield",
    ];

    if (defensiveBackAliases.includes(normalizedPosition)) {
      return "DB";
    }

    /*
     * Match against the actual positionProfiles structure.
     *
     * The positionProfiles file uses keys such as:
     * C, WR, SS, FS, etc.
     *
     * Onboarding saves the human-readable label, so we match
     * against both the key and profile label.
     */
    const group = positionProfiles[positionGroup];

    if (group?.positions) {
      const matchingEntry = Object.entries(group.positions).find(
        ([code, profile]) => {
          const normalizedCode = String(code || "")
            .trim()
            .toLowerCase();

          const normalizedLabel = String(profile?.label || "")
            .trim()
            .toLowerCase();

          const normalizedProfileCode = String(profile?.code || "")
            .trim()
            .toLowerCase();

          return (
            normalizedCode === normalizedPosition ||
            normalizedLabel === normalizedPosition ||
            normalizedProfileCode === normalizedPosition
          );
        }
      );

      if (matchingEntry?.[0]) {
        return matchingEntry[0];
      }
    }

    const positionAliases = {
      center: "C",

      "corner back": "CB",
      cornerback: "CB",

      safety: "S",
      "free safety": "FS",
      "strong safety": "SS",

      linebacker: "LB",
      "outside linebacker": "OLB",
      "inside linebacker": "ILB",
      "middle linebacker": "MLB",

      "defensive end": "DE",
      "defensive tackle": "DT",
      nose: "NT",
      edge: "EDGE",

      quarterback: "QB",
      "running back": "RB",
      fullback: "FB",
      "wide receiver": "WR",
      "tight end": "TE",

      "offensive tackle": "OT",
      "offensive guard": "OG",

      kicker: "K",
      punter: "P",
      "long snapper": "LS",
    };

    return positionAliases[normalizedPosition] || position.toUpperCase();
  }, [positionGroup, position]);

  /*
   * Display label.
   *
   * DB is intentionally displayed as "Defensive Back".
   */
  const positionLabel = useMemo(() => {
    if (positionCode === "DB") {
      return "Defensive Back";
    }

    const profile =
      positionProfiles[positionGroup]?.positions?.[positionCode];

    return profile?.label || position || "Your Position";
  }, [positionGroup, positionCode, position]);

  /*
   * Get personalized exercises.
   *
   * Normal positions use their exact position array.
   *
   * Generalized DB combines the defensive-back exercise pools.
   */
  const personalizedExercises = useMemo(() => {
    let exercises = [];

    if (positionCode === "DB") {
      const defensiveBackPositions = [
        "CB",
        "S",
        "FS",
        "SS",
      ];

      exercises = defensiveBackPositions.flatMap(
        (code) => positionExercises[code] || []
      );
    } else {
      exercises = positionExercises[positionCode] || [];
    }

    const uniqueExercises = [...new Set(exercises)];

    return uniqueExercises.filter((exercise) =>
      exercise
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [positionExercises, positionCode, searchTerm]);

  /*
   * Full exercise library.
   */
  const allExercises = useMemo(() => {
    return Object.entries(exerciseLibrary)
      .map(([category, exercises]) => ({
        category,
        exercises: exercises.filter((exercise) =>
          exercise
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((group) => group.exercises.length > 0);
  }, [exerciseLibrary, searchTerm]);

  function toggleExercise(exercise) {
    setExpandedExercise((current) =>
      current === exercise ? null : exercise
    );
  }

  return (
    <main className="exercise-library-page">
      <section className="exercise-library-hero">
        <div>
          <span className="exercise-library-eyebrow">
            PROJECT DRIVE // DEVELOPMENT
          </span>

          <h1>Exercise Library</h1>

          <p>
            Explore exercises and find supplemental work built
            around your position.
          </p>
        </div>

        <div className="exercise-library-position">
          <span>POSITION</span>
          <strong>{positionLabel}</strong>
        </div>
      </section>

      <section className="exercise-library-controls">
        <div className="exercise-library-tabs">
          <button
            type="button"
            className={
              activeSection === "position" ? "active" : ""
            }
            onClick={() => {
              setActiveSection("position");
              setExpandedExercise(null);
            }}
          >
            Position Development
          </button>

          <button
            type="button"
            className={
              activeSection === "all" ? "active" : ""
            }
            onClick={() => {
              setActiveSection("all");
              setExpandedExercise(null);
            }}
          >
            Full Library
          </button>
        </div>

        <label className="exercise-library-search">
          <span>Search exercises</span>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setExpandedExercise(null);
            }}
            placeholder="Search..."
          />
        </label>
      </section>

      {activeSection === "position" ? (
        <section className="exercise-library-section">
          <div className="exercise-library-section-heading">
            <div>
              <span className="exercise-library-eyebrow">
                PERSONALIZED
              </span>

              <h2>
                {positionLabel} Development
              </h2>
            </div>

            <span className="exercise-library-count">
              {personalizedExercises.length} exercises
            </span>
          </div>

          {personalizedExercises.length > 0 ? (
            <div className="exercise-library-grid">
              {personalizedExercises.map((exercise) => {
                const isExpanded =
                  expandedExercise === exercise;

                return (
                  <button
                    type="button"
                    className={`exercise-library-card ${
                      isExpanded ? "expanded" : ""
                    }`}
                    key={exercise}
                    onClick={() => toggleExercise(exercise)}
                    aria-expanded={isExpanded}
                  >
                    <span className="exercise-library-card-top">
                      <span className="exercise-library-icon">
                        ◆
                      </span>

                      <span className="exercise-library-badge">
                        {positionLabel}
                      </span>
                    </span>

                    <strong>{exercise}</strong>

                    {isExpanded && (
                      <ExerciseDetails
                        exercise={exercise}
                        positionLabel={positionLabel}
                      />
                    )}

                    <span className="exercise-library-card-footer">
                      {isExpanded
                        ? "Close details"
                        : "View exercise"}

                      <span>
                        {isExpanded ? "↑" : "→"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="exercise-library-empty">
              <strong>
                No position exercises found.
              </strong>

              <span>
                Finish your athlete profile or try another
                search.
              </span>
            </div>
          )}
        </section>
      ) : (
        <section className="exercise-library-section">
          <div className="exercise-library-section-heading">
            <div>
              <span className="exercise-library-eyebrow">
                TRAINING DATABASE
              </span>

              <h2>Full Exercise Library</h2>
            </div>
          </div>

          {allExercises.length > 0 ? (
            <div className="exercise-library-categories">
              {allExercises.map(
                ({ category, exercises }) => (
                  <div
                    className="exercise-library-category"
                    key={category}
                  >
                    <div className="exercise-library-category-heading">
                      <h3>{category}</h3>

                      <span>
                        {exercises.length}
                      </span>
                    </div>

                    <div className="exercise-library-list">
                      {exercises.map((exercise) => {
                        const isExpanded =
                          expandedExercise === exercise;

                        return (
                          <button
                            type="button"
                            className={`exercise-library-list-item ${
                              isExpanded ? "expanded" : ""
                            }`}
                            key={exercise}
                            onClick={() =>
                              toggleExercise(exercise)
                            }
                            aria-expanded={isExpanded}
                          >
                            <span className="exercise-library-list-main">
                              <span>{exercise}</span>

                              {isExpanded && (
                                <ExerciseDetails
                                  exercise={exercise}
                                  positionLabel={positionLabel}
                                />
                              )}
                            </span>

                            <span className="exercise-library-list-toggle">
                              {isExpanded ? "−" : "+"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="exercise-library-empty">
              <strong>No exercises found.</strong>

              <span>
                Try a different search.
              </span>
            </div>
          )}
        </section>
      )}

      <section className="exercise-library-note">
        <div className="exercise-library-note-icon">
          i
        </div>

        <div>
          <strong>
            How this fits Project Drive
          </strong>

          <p>
            Your normal Workout stays focused on the
            coach/team program. This library is for exploring
            exercises and building supplemental position
            development.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ExerciseLibraryPage;