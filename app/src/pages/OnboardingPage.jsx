import { useState } from "react";
import "../styles/Onboarding.css";

const initialForm = {
  name: "",
  school: "",
  grade: "",
  graduationYear: "",
  position: "",
  jersey: "",
  height: "",
  weight: "",
  dominantHand: "",
  gpa: "",
  seasonGoals: [],
};

const goalOptions = [
  "Increase strength",
  "Improve speed",
  "Improve conditioning",
  "Improve technique",
  "Prevent injuries",
  "Build consistency",
  "Prepare for competition",
];

export default function OnboardingPage({
  player,
  updatePlayer,
}) {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    ...initialForm,
    ...player,
    seasonGoals:
      player?.seasonGoals?.length
        ? player.seasonGoals
        : [],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function toggleGoal(goal) {
    setForm((prev) => {
      const alreadySelected =
        prev.seasonGoals.includes(goal);

      return {
        ...prev,
        seasonGoals: alreadySelected
          ? prev.seasonGoals.filter(
              (item) => item !== goal
            )
          : [...prev.seasonGoals, goal],
      };
    });
  }

  function canContinue() {
    if (step === 1) {
      return (
        form.name.trim() &&
        form.school.trim() &&
        form.grade &&
        form.graduationYear &&
        form.position
      );
    }

    if (step === 2) {
      return (
        form.height &&
        form.weight &&
        form.dominantHand
      );
    }

    return true;
  }

  function nextStep() {
    setError("");

    if (!canContinue()) {
      setError(
        "Complete the required fields before continuing."
      );
      return;
    }

    setStep((current) =>
      Math.min(current + 1, 3)
    );
  }

  function previousStep() {
    setError("");
    setStep((current) =>
      Math.max(current - 1, 1)
    );
  }

  async function finishProfile() {
    setError("");

    if (!canContinue()) {
      setError(
        "Complete the required fields before finishing."
      );
      return;
    }

    try {
      setSaving(true);

      await updatePlayer({
        ...form,
        name: form.name.trim(),
        school: form.school.trim(),
        profileCompleted: true,
      });
    } catch (err) {
      console.error(
        "Error finishing athlete profile:",
        err
      );

      setError(
        err?.message ||
          "We couldn't save your profile. Try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-shell">

        <div className="onboarding-topbar">
          <div>
            <div className="onboarding-brand">
              PROJECT DRIVE
            </div>

            <div className="onboarding-status">
              ATHLETE INITIALIZATION
            </div>
          </div>

          <div className="onboarding-step-count">
            {step}/3
          </div>
        </div>

        <div className="onboarding-progress">
          <div
            className="onboarding-progress-fill"
            style={{
              width: `${(step / 3) * 100}%`,
            }}
          />
        </div>

        <section className="onboarding-hero">
          <div className="onboarding-eyebrow">
            NEW ATHLETE DETECTED
          </div>

          <h1>
            BUILD YOUR
            <span> ATHLETE PROFILE</span>
          </h1>

          <p>
            Tell Project Drive who you are so we
            can personalize your training, goals,
            performance data, and dashboard.
          </p>
        </section>

        <section className="onboarding-card">

          {step === 1 && (
            <>
              <div className="onboarding-section-heading">
                <span>01</span>
                <div>
                  <h2>IDENTITY</h2>
                  <p>
                    Start with the basics.
                  </p>
                </div>
              </div>

              <div className="onboarding-grid">

                <label>
                  Full Name
                  <input
                    value={form.name}
                    onChange={(e) =>
                      handleChange(
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>

                <label>
                  School
                  <input
                    value={form.school}
                    onChange={(e) =>
                      handleChange(
                        "school",
                        e.target.value
                      )
                    }
                    placeholder="School name"
                  />
                </label>

                <label>
                  Grade
                  <select
                    value={form.grade}
                    onChange={(e) =>
                      handleChange(
                        "grade",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select grade
                    </option>
                    <option value="Freshman">
                      Freshman
                    </option>
                    <option value="Sophomore">
                      Sophomore
                    </option>
                    <option value="Junior">
                      Junior
                    </option>
                    <option value="Senior">
                      Senior
                    </option>
                  </select>
                </label>

                <label>
                  Graduation Year
                  <input
                    type="number"
                    value={form.graduationYear}
                    onChange={(e) =>
                      handleChange(
                        "graduationYear",
                        e.target.value
                      )
                    }
                    placeholder="2029"
                  />
                </label>

                <label>
                  Position
                  <input
                    value={form.position}
                    onChange={(e) =>
                      handleChange(
                        "position",
                        e.target.value
                      )
                    }
                    placeholder="e.g. WR, QB, LB"
                  />
                </label>

                <label>
                  Jersey Number
                  <input
                    type="number"
                    value={form.jersey}
                    onChange={(e) =>
                      handleChange(
                        "jersey",
                        e.target.value
                      )
                    }
                    placeholder="00"
                  />
                </label>

              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="onboarding-section-heading">
                <span>02</span>
                <div>
                  <h2>ATHLETIC PROFILE</h2>
                  <p>
                    This helps Project Drive
                    understand your training needs.
                  </p>
                </div>
              </div>

              <div className="onboarding-grid">

                <label>
                  Height
                  <input
                    value={form.height}
                    onChange={(e) =>
                      handleChange(
                        "height",
                        e.target.value
                      )
                    }
                    placeholder={`e.g. 5'10"`}
                  />
                </label>

                <label>
                  Weight
                  <input
                    value={form.weight}
                    onChange={(e) =>
                      handleChange(
                        "weight",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 165 lbs"
                  />
                </label>

                <label>
                  Dominant Hand
                  <select
                    value={form.dominantHand}
                    onChange={(e) =>
                      handleChange(
                        "dominantHand",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select hand
                    </option>
                    <option value="Right">
                      Right
                    </option>
                    <option value="Left">
                      Left
                    </option>
                    <option value="Ambidextrous">
                      Ambidextrous
                    </option>
                  </select>
                </label>

                <label>
                  GPA
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={form.gpa}
                    onChange={(e) =>
                      handleChange(
                        "gpa",
                        e.target.value
                      )
                    }
                    placeholder="Optional"
                  />
                </label>

              </div>

              <div className="onboarding-info-box">
                <strong>
                  WHY WE ASK
                </strong>

                <p>
                  Your athletic profile will eventually
                  help Project Drive determine which
                  workouts, metrics, recovery signals,
                  and goals are most relevant to you.
                </p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="onboarding-section-heading">
                <span>03</span>
                <div>
                  <h2>YOUR MISSION</h2>
                  <p>
                    Pick the areas you want to improve.
                  </p>
                </div>
              </div>

              <div className="goal-grid">
                {goalOptions.map((goal) => {
                  const selected =
                    form.seasonGoals.includes(goal);

                  return (
                    <button
                      key={goal}
                      type="button"
                      className={`goal-option ${
                        selected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        toggleGoal(goal)
                      }
                    >
                      <span className="goal-check">
                        {selected ? "✓" : "+"}
                      </span>

                      <span>{goal}</span>
                    </button>
                  );
                })}
              </div>

              <div className="onboarding-final-message">
                <div className="onboarding-final-icon">
                  ⚡
                </div>

                <div>
                  <strong>
                    READY TO ENTER PROJECT DRIVE?
                  </strong>

                  <p>
                    Finish your profile and we'll take
                    you straight to your athlete dashboard.
                  </p>
                </div>
              </div>
            </>
          )}

          {error && (
            <div
              className="onboarding-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="onboarding-actions">

            {step > 1 ? (
              <button
                type="button"
                className="onboarding-back"
                onClick={previousStep}
                disabled={saving}
              >
                BACK
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                className="onboarding-primary"
                onClick={nextStep}
              >
                CONTINUE
                <span>→</span>
              </button>
            ) : (
              <button
                type="button"
                className="onboarding-primary finish"
                onClick={finishProfile}
                disabled={saving}
              >
                {saving
                  ? "INITIALIZING..."
                  : "FINISH PROFILE"}
                <span>→</span>
              </button>
            )}

          </div>

        </section>

        <div className="onboarding-footer">
          <span>
            PROJECT DRIVE
          </span>

          <span>
            BUILD YOURSELF. TRACK EVERYTHING.
          </span>
        </div>

      </div>
    </div>
  );
}