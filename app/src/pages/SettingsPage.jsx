import { useEffect, useState } from "react";
import "../styles/Settings.css";

const DEFAULT_SETTINGS = {
  units: "imperial",
  startPage: "dashboard",
  workoutReminders: true,
  questNotifications: true,
  accountNotifications: true,
  animations: true,
  compactMode: false,
};

function SettingsPage() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("projectDriveSettings");

      return saved
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(false);
  }, [settings]);

  function updateSetting(field, value) {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function saveSettings() {
    localStorage.setItem(
      "projectDriveSettings",
      JSON.stringify(settings)
    );

    setSaved(true);
  }

  return (
    <section className="settings-page">

      <div className="settings-grid">

        {/* APP PREFERENCES */}
        <div className="settings-section">

          <div className="settings-section-icon">
            ⚙
          </div>

          <div className="settings-section-header">
            <h2>APP PREFERENCES</h2>
            <p>
              Control how Project Drive behaves.
            </p>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Units</strong>
              <span>
                Choose how measurements are displayed.
              </span>
            </div>

            <div className="settings-control">
              <select
                className="settings-select"
                value={settings.units}
                onChange={(e) =>
                  updateSetting("units", e.target.value)
                }
              >
                <option value="imperial">Imperial</option>
                <option value="metric">Metric</option>
              </select>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Start Page</strong>
              <span>
                Choose where Project Drive opens.
              </span>
            </div>

            <div className="settings-control">
              <select
                className="settings-select"
                value={settings.startPage}
                onChange={(e) =>
                  updateSetting("startPage", e.target.value)
                }
              >
                <option value="dashboard">Dashboard</option>
                <option value="workout">Workout</option>
                <option value="progress">Progress</option>
                <option value="performance">Performance</option>
              </select>
            </div>
          </div>

        </div>


        {/* NOTIFICATIONS */}
        <div className="settings-section">

          <div className="settings-section-icon">
            🔔
          </div>

          <div className="settings-section-header">
            <h2>NOTIFICATIONS</h2>
            <p>
              Control Project Drive notifications.
            </p>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Workout Reminders</strong>
              <span>
                Receive reminders about planned workouts.
              </span>
            </div>

            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.workoutReminders}
                onChange={(e) =>
                  updateSetting(
                    "workoutReminders",
                    e.target.checked
                  )
                }
              />

              <span className="settings-toggle-track">
                <span className="settings-toggle-thumb" />
              </span>
            </label>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Quest & XP Updates</strong>
              <span>
                Show notifications for quests and XP progress.
              </span>
            </div>

            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.questNotifications}
                onChange={(e) =>
                  updateSetting(
                    "questNotifications",
                    e.target.checked
                  )
                }
              />

              <span className="settings-toggle-track">
                <span className="settings-toggle-thumb" />
              </span>
            </label>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Account Notifications</strong>
              <span>
                Important account and security updates.
              </span>
            </div>

            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.accountNotifications}
                onChange={(e) =>
                  updateSetting(
                    "accountNotifications",
                    e.target.checked
                  )
                }
              />

              <span className="settings-toggle-track">
                <span className="settings-toggle-thumb" />
              </span>
            </label>
          </div>

        </div>


        {/* EXPERIENCE */}
        <div className="settings-section">

          <div className="settings-section-icon">
            🎮
          </div>

          <div className="settings-section-header">
            <h2>PROJECT DRIVE EXPERIENCE</h2>
            <p>
              Personalize the way the app feels.
            </p>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Animations</strong>
              <span>
                Enable interface transitions and visual effects.
              </span>
            </div>

            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) =>
                  updateSetting(
                    "animations",
                    e.target.checked
                  )
                }
              />

              <span className="settings-toggle-track">
                <span className="settings-toggle-thumb" />
              </span>
            </label>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Compact Mode</strong>
              <span>
                Reduce spacing for a denser interface.
              </span>
            </div>

            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) =>
                  updateSetting(
                    "compactMode",
                    e.target.checked
                  )
                }
              />

              <span className="settings-toggle-track">
                <span className="settings-toggle-thumb" />
              </span>
            </label>
          </div>

        </div>

      </div>

      <div className="settings-save-row">
        <button
          className="settings-save"
          onClick={saveSettings}
        >
          {saved ? "✓ SETTINGS SAVED" : "SAVE SETTINGS"}
        </button>
      </div>

    </section>
  );
}

export default SettingsPage;