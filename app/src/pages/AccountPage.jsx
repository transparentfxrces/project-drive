import "../styles/Account.css";

import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import SecurityPage from "./SecurityPage";

function AccountPage({
  section,
  setSection,
  player,
  updatePlayer,
  updateSeasonGoal,
  streak,
  workoutsLogged,
  xp,
  level,
  nextLevelXP,
  achievements,
  user,
  onBack,
}) {
  const sections = [
    {
      id: "profile",
      icon: "👤",
      label: "PROFILE",
      description: "Your Project Drive identity",
    },
    {
      id: "settings",
      icon: "⚙",
      label: "SETTINGS",
      description: "Customize your experience",
    },
    {
      id: "security",
      icon: "◆",
      label: "SECURITY",
      description: "Protect your account",
    },
  ];

  return (
    <section className="account-page">
      <div className="account-header">
        <button className="account-back" onClick={onBack}>
          ← BACK TO PROJECT DRIVE
        </button>

        <span className="account-eyebrow">PROJECT DRIVE</span>

        <h1>ACCOUNT</h1>

        <p>Manage your profile, preferences, and security.</p>
      </div>

      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-sidebar-label">ACCOUNT</div>

          <nav className="account-nav">
            {sections.map((item) => (
              <button
                key={item.id}
                className={`account-nav-item ${
                  section === item.id ? "active" : ""
                }`}
                onClick={() => setSection(item.id)}
              >
                <span className="account-nav-icon">{item.icon}</span>

                <span className="account-nav-copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="account-content">
          {section === "profile" && (
            <ProfilePage
              player={player}
              updatePlayer={updatePlayer}
              updateSeasonGoal={updateSeasonGoal}
              streak={streak}
              workoutsLogged={workoutsLogged}
              xp={xp}
              level={level}
              nextLevelXP={nextLevelXP}
              achievements={achievements}
            />
          )}

          {section === "settings" && <SettingsPage player={player} />}

          {section === "security" && <SecurityPage user={user} />}
        </main>
      </div>
    </section>
  );
}

export default AccountPage;