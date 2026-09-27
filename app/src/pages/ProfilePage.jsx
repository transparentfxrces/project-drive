import { useState, useEffect } from "react";

function ProfilePage({
  player,
  updatePlayer,
  updateSeasonGoal,
  streak,
  workoutsLogged,
  units = "imperial",
}) {
  console.log("ProfilePage units:", units);
  
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingGoals, setEditingGoals] = useState(false);

  const [form, setForm] = useState(player);

  useEffect(() => {
  setForm({
    ...player,
    height: parseHeightToInches(player.height),
    weight: player.weight,
  });
}, [player]);

  function parseHeightToInches(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  const text = String(value).trim();

  // Handles values like 5'5", 5' 5", or 5'5
  if (text.includes("'")) {
    const parts = text.split("'");

    const feet = Number(parts[0].trim());
    const inches = Number(
      parts[1].replace('"', "").trim()
    );

    if (
      Number.isFinite(feet) &&
      Number.isFinite(inches)
    ) {
      return feet * 12 + inches;
    }
  }

  const numericValue = Number(text);

  if (!Number.isFinite(numericValue)) {
    return value;
  }

  return numericValue;
}

function formatHeight(height) {
  const numericHeight = parseHeightToInches(height);

  if (!Number.isFinite(Number(numericHeight))) {
    return height;
  }

  if (units === "metric") {
    return `${(Number(numericHeight) * 2.54).toFixed(1)} cm`;
  }

  const feet = Math.floor(Number(numericHeight) / 12);
  const inches = Number(numericHeight) % 12;

  return `${feet}'${inches}"`;
}

function getInputHeight(height) {
  const numericHeight = parseHeightToInches(height);

  if (numericHeight === "") {
    return "";
  }

  if (!Number.isFinite(Number(numericHeight))) {
    return height;
  }

  if (units === "metric") {
    return (Number(numericHeight) * 2.54).toFixed(1);
  }

  return numericHeight;
}

function parseInputHeight(value) {
  if (value === "") return "";

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return value;
  }

  if (units === "metric") {
    return numericValue / 2.54;
  }

  return numericValue;
}

function formatWeight(weight) {
  const numericWeight = Number(weight);

  if (!Number.isFinite(numericWeight)) {
    return weight;
  }

  if (units === "metric") {
    return `${(numericWeight * 0.45359237).toFixed(1)} kg`;
  }

  return `${numericWeight} lbs`;
}

function getInputWeight(weight) {
  if (weight === "" || weight === null || weight === undefined) {
    return "";
  }

  const numericWeight = Number(weight);

  if (!Number.isFinite(numericWeight)) {
    return weight;
  }

  if (units === "metric") {
    return (numericWeight * 0.45359237).toFixed(1);
  }

  return weight;
}

function parseInputWeight(value) {
  if (value === "") return "";

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return value;
  }

  if (units === "metric") {
    return numericValue / 0.45359237;
  }

  return numericValue;
}

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function savePlayerInfo() {
    updatePlayer(form);
    setEditingInfo(false);
  }

  return (
    <>
  <div className="profile-intro">
    <span>ATHLETE PROFILE</span>
    <h2>PLAYER OVERVIEW</h2>
    <p>
      Your identity, training activity, and season objectives.
    </p>
  </div>

  <div className="profile-grid">

        {/* PLAYER INFORMATION */}

        <div className="profile-card">

          <div className="profile-card-header">

            <h3>Player Information</h3>

            {!editingInfo ? (
              <button
                className="edit-button"
                onClick={() => setEditingInfo(true)}
              >
                Edit
              </button>
            ) : (
              <button
                className="save-button"
                onClick={savePlayerInfo}
              >
                Save
              </button>
            )}

          </div>

          {editingInfo ? (
            <>
              <input
                className="profile-input"
                value={form.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
              />

              <input
                className="profile-input"
                value={form.grade}
                onChange={(e) =>
                  handleChange("grade", e.target.value)
                }
              />

              <input
                className="profile-input"
                value={form.position}
                onChange={(e) =>
                  handleChange("position", e.target.value)
                }
              />

              <input
                className="profile-input"
                value={form.team}
                onChange={(e) =>
                  handleChange("team", e.target.value)
                }
              />

              <input
  className="profile-input"
  value={getInputHeight(form.height)}
  onChange={(e) =>
    handleChange(
      "height",
      parseInputHeight(e.target.value)
    )
  }
/>

              <input
  className="profile-input"
  value={getInputWeight(form.weight)}
  onChange={(e) =>
    handleChange(
      "weight",
      parseInputWeight(e.target.value)
    )
  }
/>

              <input
                className="profile-input"
                value={form.jersey}
                onChange={(e) =>
                  handleChange("jersey", e.target.value)
                }
              />

              <input
                className="profile-input"
                value={form.graduationYear}
                onChange={(e) =>
                  handleChange(
                    "graduationYear",
                    e.target.value
                  )
                }
              />

              <input
                className="profile-input"
                value={form.dominantHand}
                onChange={(e) =>
                  handleChange(
                    "dominantHand",
                    e.target.value
                  )
                }
              />

              <input
                className="profile-input"
                value={form.gpa}
                onChange={(e) =>
                  handleChange("gpa", e.target.value)
                }
              />
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {player.name}</p>
              <p><strong>Grade:</strong> {player.grade}</p>
              <p><strong>Position:</strong> {player.position}</p>
              <p><strong>Team:</strong> {player.team}</p>
              <p><strong>Height:</strong>{""} {formatHeight(player.height)}</p>
              <p><strong>Weight:</strong> {formatWeight(player.weight)}</p>
              <p><strong>Jersey:</strong> {player.jersey}</p>
              <p><strong>Graduation:</strong> {player.graduationYear}</p>
              <p><strong>Dominant Hand:</strong> {player.dominantHand}</p>
              <p><strong>GPA:</strong> {player.gpa}</p>
            </>
          )}

        </div>

        {/* TRAINING */}

        <div className="profile-card">

          <h3>Training Summary</h3>

          <p>
            <strong>Current Streak:</strong> {streak} days
          </p>

          <p>
            <strong>Total Workouts:</strong> {workoutsLogged}
          </p>

          <p>
            <strong>Status:</strong> Active Athlete 💪
          </p>

        </div>

        {/* GOALS */}

        <div className="profile-card">

          <div className="profile-card-header">

            <h3>Season Goals</h3>

            {!editingGoals ? (
              <button
                className="edit-button"
                onClick={() =>
                  setEditingGoals(true)
                }
              >
                Edit
              </button>
            ) : (
              <button
                className="save-button"
                onClick={() =>
                  setEditingGoals(false)
                }
              >
                Save
              </button>
            )}

          </div>

          {player.seasonGoals.map(
            (goal, index) =>

              editingGoals ? (

                <input
                  key={index}
                  className="profile-input"
                  value={goal}
                  onChange={(e) =>
                    updateSeasonGoal(
                      index,
                      e.target.value
                    )
                  }
                />

              ) : (

                <p key={index}>
                  • {goal}
                </p>

              )
          )}

        </div>

      </div>

      <div className="version-footer">
        Project Drive • Athlete Performance Tracker
      </div>

    </>
  );
}

export default ProfilePage;