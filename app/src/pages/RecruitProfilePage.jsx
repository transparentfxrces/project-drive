import "../styles/RecruitProfile.css";

import { useState, useEffect, } from "react";

function formatLabel(value = "") {
  return String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function firstValue(...values) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== ""
  );
}

function normalizeAchievements(achievements) {
  if (Array.isArray(achievements)) {
    return achievements.map((achievement, index) => {
      if (typeof achievement === "string") {
        return {
          id: achievement,
          title: formatLabel(achievement),
          description: "",
          unlocked: true,
        };
      }

      return {
        id:
          achievement.id ||
          achievement.key ||
          `achievement-${index}`,
        title:
          achievement.title ||
          achievement.name ||
          formatLabel(
            achievement.id ||
              achievement.key ||
              `Achievement ${index + 1}`
          ),
        description: achievement.description || "",
        unlocked:
          achievement.unlocked ??
          achievement.completed ??
          achievement.earned ??
          true,
      };
    });
  }

  if (achievements && typeof achievements === "object") {
    return Object.entries(achievements).map(([key, value]) => {
      if (value && typeof value === "object") {
        return {
          id: key,
          title: value.title || value.name || formatLabel(key),
          description: value.description || "",
          unlocked:
            value.unlocked ??
            value.completed ??
            value.earned ??
            false,
        };
      }

      return {
        id: key,
        title: formatLabel(key),
        description: "",
        unlocked: Boolean(value),
      };
    });
  }

  return [];
}

function makeProfile(player, metrics, recruitProfile) {
  const savedMetrics = recruitProfile.metrics || {};

  return {
    name: firstValue(recruitProfile.name, player.name, ""),
    position: firstValue(
      recruitProfile.position,
      player.position,
      ""
    ),
    team: firstValue(recruitProfile.team, player.team, ""),
    school: firstValue(
      recruitProfile.school,
      player.school,
      player.team,
      ""
    ),
    grade: firstValue(recruitProfile.grade, player.grade, ""),
    graduationYear: firstValue(
      recruitProfile.graduationYear,
      recruitProfile.gradYear,
      player.graduationYear,
      player.gradYear,
      ""
    ),
    jerseyNumber: firstValue(
      recruitProfile.jerseyNumber,
      recruitProfile.jersey,
      player.jerseyNumber,
      player.jersey,
      ""
    ),
    height: firstValue(
      recruitProfile.height,
      player.height,
      ""
    ),
    weight: firstValue(
      recruitProfile.weight,
      player.weight,
      ""
    ),
    gpa: firstValue(recruitProfile.gpa, player.gpa, ""),
    sat: firstValue(recruitProfile.sat, player.sat, ""),
    act: firstValue(recruitProfile.act, player.act, ""),
    ncaaId: firstValue(
      recruitProfile.ncaaId,
      player.ncaaId,
      ""
    ),
    hudl: firstValue(
      recruitProfile.hudl,
      recruitProfile.hudlLink,
      player.hudl,
      player.hudlLink,
      ""
    ),
    highlightLink: firstValue(
      recruitProfile.highlightLink,
      recruitProfile.highlights,
      player.highlightLink,
      player.highlights,
      ""
    ),
    email: firstValue(
      recruitProfile.email,
      player.email,
      ""
    ),
    phone: firstValue(
      recruitProfile.phone,
      player.phone,
      ""
    ),
    summary: firstValue(
      recruitProfile.summary,
      recruitProfile.bio,
      recruitProfile.coachNotes,
      player.bio,
      player.summary,
      player.coachNotes,
      ""
    ),
    metrics: {
  bench: firstValue(
    metrics.bench,
    metrics.benchPress,
    ""
  ),

  squat: firstValue(
    metrics.squat,
    metrics.backSquat,
    ""
  ),

  powerClean: firstValue(
    metrics.powerClean,
    metrics.clean,
    metrics.hangClean,
    ""
  ),

  deadlift: firstValue(
    metrics.deadlift,
    metrics.hexBar,
    metrics.trapBar,
    ""
  ),

  forty: firstValue(
    metrics.forty,
    metrics.fortyYard,
    metrics.fortyYardDash,
    savedMetrics.forty,
    savedMetrics.fortyYard,
    savedMetrics.fortyYardDash,
    ""
  ),

  vertical: firstValue(
    metrics.vertical,
    metrics.verticalJump,
    savedMetrics.vertical,
    savedMetrics.verticalJump,
    ""
  ),
},
  };
}

function displayValue(value, fallback = "—") {
  return value === undefined || value === null || value === ""
    ? fallback
    : value;
}

function EditableValue({
  editing,
  value,
  onChange,
  type = "text",
  placeholder = "",
  ariaLabel,
}) {
  if (!editing) {
    return <>{displayValue(value)}</>;
  }

  return (
    <input
      className="recruit-edit-input"
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function RecruitProfilePage({
  player = {},
  metrics = {},
  recruitProfile = {},
  setRecruitProfile = () => {},
  achievements = {},
  streak = 0,
  workoutsLogged = 0,
  level = 1,
  xp = 0,
}) {
  const initialProfile = () =>
    makeProfile(player, metrics, recruitProfile);

  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  const normalizedAchievements =
    normalizeAchievements(achievements);
  const unlockedAchievements = normalizedAchievements.filter(
    (achievement) => achievement.unlocked
  );
  const displayedAchievements = unlockedAchievements.slice(0, 6);

  const profile = editing ? draft : savedProfile;
  const playerName = displayValue(profile.name, "Player Name");
  const position = displayValue(profile.position, "Position");
  const team = displayValue(profile.team, "Team");
  const grade = displayValue(profile.grade, "Grade Not Added");
  const graduationYear = displayValue(profile.graduationYear);
  const jerseyNumber = displayValue(profile.jerseyNumber);
  const height = displayValue(profile.height);
  const weight = displayValue(profile.weight);

  useEffect(() => {
  if (editing) return;

  setSavedProfile((previous) => ({
    ...previous,

    metrics: {
      ...previous.metrics,

      bench:
        metrics.bench ??
        metrics.benchPress ??
        "",

      squat:
        metrics.squat ??
        metrics.backSquat ??
        "",

      powerClean:
        metrics.powerClean ??
        metrics.clean ??
        metrics.hangClean ??
        "",

      deadlift:
        metrics.deadlift ??
        metrics.hexBar ??
        metrics.trapBar ??
        "",
    },
  }));
}, [
  metrics.bench,
  metrics.benchPress,
  metrics.squat,
  metrics.backSquat,
  metrics.powerClean,
  metrics.clean,
  metrics.hangClean,
  metrics.deadlift,
  metrics.hexBar,
  metrics.trapBar,
  editing,
]);

  function updateField(field, value) {
    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateMetric(field, value) {
    setDraft((previous) => ({
      ...previous,
      metrics: {
        ...previous.metrics,
        [field]: value,
      },
    }));
  }

  function startEditing() {
    setDraft({
      ...savedProfile,
      metrics: { ...savedProfile.metrics },
    });
    setShareMessage("");
    setEditing(true);
  }

  function cancelEditing() {
    setDraft({
      ...savedProfile,
      metrics: { ...savedProfile.metrics },
    });
    setShareMessage("");
    setEditing(false);
  }

  function saveChanges() {
    const nextProfile = {
      ...draft,
      metrics: { ...draft.metrics },
    };

    setSavedProfile(nextProfile);
    setRecruitProfile((previous = {}) => ({
      ...previous,
      ...nextProfile,
      metrics: {
        ...(previous.metrics || {}),
        ...nextProfile.metrics,
      },
    }));
    setEditing(false);
    setShareMessage("Profile changes saved.");

    window.setTimeout(() => {
      setShareMessage("");
    }, 2500);
  }

  function handleExportPDF() {
    window.print();
  }

  async function handleCopyProfile() {
    const profileText = [
      `${playerName} Recruiting Profile`,
      `${position} • ${team}`,
      `School: ${displayValue(profile.school, "Not added")}`,
      `Grade: ${grade}`,
      `Graduation Year: ${graduationYear}`,
      `Height: ${height}`,
      `Weight: ${weight}`,
      `Workouts Logged: ${workoutsLogged}`,
      `Current Streak: ${streak}`,
      `Level: ${level}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(
        `${profileText}\n\n${window.location.href}`
      );
      setShareMessage("Profile details copied.");
    } catch {
      setShareMessage("Could not copy automatically.");
    }

    window.setTimeout(() => {
      setShareMessage("");
    }, 2500);
  }

  function handleEmailProfile() {
    const subject = encodeURIComponent(
      `${playerName} Football Recruiting Profile`
    );
    const body = encodeURIComponent(`Hello Coach,

I am sharing my football recruiting profile.

Name: ${playerName}
Position: ${position}
Team: ${team}
Grade: ${grade}
Graduation Year: ${graduationYear}
Height: ${height}
Weight: ${weight}

Hudl: ${profile.hudl || "Not added"}
Highlights: ${profile.highlightLink || "Not added"}

Thank you for your time.`);

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  const measurementFields = [
  {
    label: "Height",
    value: profile.height,
    update: (value) =>
      updateField("height", value),
    placeholder: `5'10"`,
  },

  {
    label: "Weight",
    value: profile.weight,
    update: (value) =>
      updateField("weight", value),
    placeholder: "190 lbs",
  },

  {
    label: "Bench Press",
    value: profile.metrics.bench,
    synced: true,
  },

  {
    label: "Squat",
    value: profile.metrics.squat,
    synced: true,
  },

  {
    label: "Power Clean",
    value: profile.metrics.powerClean,
    synced: true,
  },

  {
    label: "Deadlift",
    value: profile.metrics.deadlift,
    synced: true,
  },

  {
    label: "40-Yard Dash",
    value: profile.metrics.forty,
    update: (value) =>
      updateMetric("forty", value),
    placeholder: "5.10 sec",
  },

  {
    label: "Vertical",
    value: profile.metrics.vertical,
    update: (value) =>
      updateMetric("vertical", value),
    placeholder: "26 in",
  },
];

  return (
    <main className={`recruit-page${editing ? " is-editing" : ""}`}>
      <section className="recruit-hero">
        <div className="recruit-hero-glow" />

        <div className="recruit-avatar">
          <span>{String(playerName).charAt(0).toUpperCase()}</span>
        </div>

        <div className="recruit-identity">
          <p className="recruit-eyebrow">PROJECT DRIVE RECRUIT</p>

          {editing ? (
            <input
              className="recruit-edit-input recruit-name-input"
              value={profile.name}
              placeholder="Player name"
              aria-label="Player name"
              onChange={(event) =>
                updateField("name", event.target.value)
              }
            />
          ) : (
            <h1>{playerName}</h1>
          )}

          <p className="recruit-subtitle">
            <EditableValue
              editing={editing}
              value={profile.position}
              placeholder="Position"
              ariaLabel="Position"
              onChange={(value) => updateField("position", value)}
            />
            <span>•</span>
            <EditableValue
              editing={editing}
              value={profile.team}
              placeholder="Team"
              ariaLabel="Team"
              onChange={(value) => updateField("team", value)}
            />
          </p>

          <div className="recruit-tags">
            <span>
              <EditableValue
                editing={editing}
                value={profile.grade}
                placeholder="Rising Junior"
                ariaLabel="Grade"
                onChange={(value) => updateField("grade", value)}
              />
            </span>
            <span>
              Class of{" "}
              <EditableValue
                editing={editing}
                value={profile.graduationYear}
                type="number"
                placeholder="2028"
                ariaLabel="Graduation year"
                onChange={(value) =>
                  updateField("graduationYear", value)
                }
              />
            </span>
            <span>
              #
              <EditableValue
                editing={editing}
                value={profile.jerseyNumber}
                type="number"
                placeholder="Number"
                ariaLabel="Jersey number"
                onChange={(value) =>
                  updateField("jerseyNumber", value)
                }
              />
            </span>
          </div>
        </div>

        <div className="recruit-rank-card">
          <span className="rank-label">PLAYER LEVEL</span>
          <strong>{level}</strong>
          <span className="rank-xp">{xp} XP</span>
        </div>
      </section>

      <section className="recruit-actions">
        {!editing && (
          <>
            <button
              type="button"
              className="recruit-action primary"
              onClick={handleExportPDF}
            >
              <span>▣</span>
              Export PDF
            </button>

            <button
              type="button"
              className="recruit-action"
              onClick={handleCopyProfile}
            >
              <span>⌁</span>
              Copy Profile
            </button>

            <button
              type="button"
              className="recruit-action"
              onClick={handleEmailProfile}
            >
              <span>✉</span>
              Email Coach
            </button>

            <button
              type="button"
              className="recruit-action"
              onClick={startEditing}
            >
              Edit Profile
            </button>
          </>
        )}

        {editing && (
          <>
            <button
              type="button"
              className="recruit-action primary"
              onClick={saveChanges}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="recruit-action"
              onClick={cancelEditing}
            >
              Cancel
            </button>
          </>
        )}

        {shareMessage && (
          <p className="share-message" role="status">
            {shareMessage}
          </p>
        )}
      </section>

      <div className="recruit-layout">
        <div className="recruit-main-column">
          <section className="recruit-panel">
            <div className="recruit-panel-heading">
              <div>
                <p className="panel-kicker">VERIFIED DATA</p>
                <h2>Athletic Measurements</h2>
              </div>
              <span className="panel-symbol">◇</span>
            </div>

            <div className="measurement-grid">

  {measurementFields.map((field) => (

    <article
      className={`measurement-card ${
        field.synced
          ? "synced-measurement"
          : ""
      }`}
      key={field.label}
    >

      <span>{field.label}</span>

      <strong>

        {field.synced ? (

          displayValue(field.value)

        ) : (

          <EditableValue
            editing={editing}
            value={field.value}
            placeholder={
              field.placeholder
            }
            ariaLabel={field.label}
            onChange={field.update}
          />

        )}

      </strong>

      {field.synced && (

        <small className="sync-status">
          ◇ SYNCED WITH PERFORMANCE
        </small>

      )}

    </article>

  ))}

</div>
          </section>

          <section className="recruit-panel">
            <div className="recruit-panel-heading">
              <div>
                <p className="panel-kicker">DEVELOPMENT</p>
                <h2>Performance Summary</h2>
              </div>
              <span className="panel-symbol">↗</span>
            </div>

            <div className="performance-grid">
              <article>
                <strong>{workoutsLogged}</strong>
                <span>Workouts Logged</span>
              </article>
              <article>
                <strong>{streak}</strong>
                <span>Current Streak</span>
              </article>
              <article>
                <strong>{unlockedAchievements.length}</strong>
                <span>Achievements</span>
              </article>
              <article>
                <strong>{level}</strong>
                <span>Player Level</span>
              </article>
            </div>
          </section>

          <section className="recruit-panel">
            <div className="recruit-panel-heading">
              <div>
                <p className="panel-kicker">MILESTONES</p>
                <h2>Achievements</h2>
              </div>
              <span className="achievement-count">
                {unlockedAchievements.length} unlocked
              </span>
            </div>

            {displayedAchievements.length > 0 ? (
              <div className="achievement-list">
                {displayedAchievements.map((achievement) => (
                  <article
                    className="recruit-achievement"
                    key={achievement.id}
                  >
                    <div className="achievement-icon">◆</div>
                    <div>
                      <h3>{achievement.title}</h3>
                      <p>
                        {achievement.description ||
                          "Training milestone completed."}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="recruit-empty-state">
                <span>◇</span>
                <div>
                  <h3>No achievements unlocked yet</h3>
                  <p>
                    Completed milestones will appear on your recruiting
                    profile.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="recruit-panel">
            <div className="recruit-panel-heading">
              <div>
                <p className="panel-kicker">COACH EVALUATION</p>
                <h2>Player Summary</h2>
              </div>
            </div>

            {editing ? (
              <textarea
                className="recruit-edit-input recruit-summary-input"
                value={profile.summary}
                rows="6"
                placeholder="Describe your strengths, development, technique, and goals."
                aria-label="Player summary"
                onChange={(event) =>
                  updateField("summary", event.target.value)
                }
              />
            ) : (
              <p className="player-summary">
                {profile.summary ||
                  `${playerName} is a ${String(
                    position
                  ).toLowerCase()} focused on consistent development, strength, technique, and becoming a dependable contributor for ${team}.`}
              </p>
            )}
          </section>
        </div>

        <aside className="recruit-side-column">
          <section className="recruit-panel compact-panel">
            <div className="recruit-panel-heading">
              <div>
                <p className="panel-kicker">PLAYER INFO</p>
                <h2>Profile</h2>
              </div>
            </div>

            <dl className="profile-details">
              {[
                ["School", "school"],
                ["Position", "position"],
                ["Grade", "grade"],
                ["Graduation", "graduationYear"],
                ["Jersey", "jerseyNumber"],
              ].map(([label, field]) => (
                <div key={field}>
                  <dt>{label}</dt>
                  <dd>
                    {field === "jerseyNumber" && !editing ? "#" : ""}
                    <EditableValue
                      editing={editing}
                      value={profile[field]}
                      type={
                        field === "graduationYear" ||
                        field === "jerseyNumber"
                          ? "number"
                          : "text"
                      }
                      placeholder={label}
                      ariaLabel={label}
                      onChange={(value) => updateField(field, value)}
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="recruit-panel compact-panel">
            <div className="recruit-panel-heading">
              <div>
                <p className="panel-kicker">ACADEMICS</p>
                <h2>Student Profile</h2>
              </div>
            </div>

            <dl className="profile-details">
              {[
                ["GPA", "gpa", "text"],
                ["SAT", "sat", "number"],
                ["ACT", "act", "number"],
                ["NCAA ID", "ncaaId", "text"],
              ].map(([label, field, type]) => (
                <div key={field}>
                  <dt>{label}</dt>
                  <dd>
                    <EditableValue
                      editing={editing}
                      value={profile[field]}
                      type={type}
                      placeholder={label}
                      ariaLabel={label}
                      onChange={(value) => updateField(field, value)}
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="recruit-panel compact-panel">
            <div className="recruit-panel-heading">
              <div>
                <p className="panel-kicker">RECRUITING</p>
                <h2>Links</h2>
              </div>
            </div>

            {editing ? (
              <div className="recruit-links recruit-edit-links">
                <label>
                  <span>Hudl URL</span>
                  <input
                    className="recruit-edit-input"
                    type="url"
                    value={profile.hudl}
                    placeholder="https://www.hudl.com/..."
                    onChange={(event) =>
                      updateField("hudl", event.target.value)
                    }
                  />
                </label>
                <label>
                  <span>Highlights URL</span>
                  <input
                    className="recruit-edit-input"
                    type="url"
                    value={profile.highlightLink}
                    placeholder="https://..."
                    onChange={(event) =>
                      updateField(
                        "highlightLink",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>
            ) : (
              <div className="recruit-links">
                {profile.hudl ? (
                  <a
                    href={profile.hudl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>▶</span>
                    View Hudl
                  </a>
                ) : (
                  <div className="disabled-link">
                    <span>▶</span>
                    Hudl Not Added
                  </div>
                )}

                {profile.highlightLink ? (
                  <a
                    href={profile.highlightLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>★</span>
                    View Highlights
                  </a>
                ) : (
                  <div className="disabled-link">
                    <span>★</span>
                    Highlights Not Added
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="recruit-panel compact-panel">
            <div className="recruit-panel-heading">
              <div>
                <p className="panel-kicker">CONTACT</p>
                <h2>Player Contact</h2>
              </div>
            </div>

            <dl className="profile-details">
              <div>
                <dt>Email</dt>
                <dd>
                  <EditableValue
                    editing={editing}
                    value={profile.email}
                    type="email"
                    placeholder="player@email.com"
                    ariaLabel="Email"
                    onChange={(value) => updateField("email", value)}
                  />
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <EditableValue
                    editing={editing}
                    value={profile.phone}
                    type="tel"
                    placeholder="Phone number"
                    ariaLabel="Phone"
                    onChange={(value) => updateField("phone", value)}
                  />
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default RecruitProfilePage;