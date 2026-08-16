import { useState, useEffect } from "react";

function ProfilePage({
  player,
  updatePlayer,
  updateSeasonGoal,
  streak,
  workoutsLogged,
}) {
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingGoals, setEditingGoals] = useState(false);

  const [form, setForm] = useState(player);

  useEffect(() => {
    setForm(player);
  }, [player]);

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
      <h2>👤 Athlete Profile</h2>

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
                value={form.height}
                onChange={(e) =>
                  handleChange("height", e.target.value)
                }
              />

              <input
                className="profile-input"
                value={form.weight}
                onChange={(e) =>
                  handleChange("weight", e.target.value)
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
              <p><strong>Height:</strong> {player.height}</p>
              <p><strong>Weight:</strong> {player.weight}</p>
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