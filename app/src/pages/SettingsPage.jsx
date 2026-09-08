import "../styles/Settings.css";

function SettingsPage({ player }) {
  return (
    <section className="settings-page">

      <div className="settings-header">
        <div>
          <span className="settings-eyebrow">
            PROJECT DRIVE
          </span>

          <h1>SETTINGS</h1>

          <p>
            Customize how Project Drive works for you.
          </p>
        </div>
      </div>

      <div className="settings-grid">

        <div className="settings-section">
          <div className="settings-section-icon">⚙</div>

          <div>
            <h2>APP PREFERENCES</h2>
            <p>
              Control your Project Drive experience.
            </p>
          </div>

          <div className="settings-placeholder">
            Preference controls coming next.
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-icon">🔔</div>

          <div>
            <h2>NOTIFICATIONS</h2>
            <p>
              Manage workout, quest, and account notifications.
            </p>
          </div>

          <div className="settings-placeholder">
            Notification controls coming next.
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-icon">🎮</div>

          <div>
            <h2>PROJECT DRIVE EXPERIENCE</h2>
            <p>
              Personalization and gameplay settings.
            </p>
          </div>

          <div className="settings-placeholder">
            XP, quests, leaderboard, and personalization controls
            will live here.
          </div>
        </div>

      </div>

    </section>
  );
}

export default SettingsPage;