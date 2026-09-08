import { useState } from "react";
import "./Header.css";

function Header({
  name,
  grade,
  position,
  team,
  userEmail,
  onSignOut,
  onAccountProfile,
  onSettings,
  onSecurity,
}) {
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="sl-header">
      <div className="sl-header-overlay" />

      <div className="sl-header-content">

        <div className="hunter-rank">
          <span>PROJECT DRIVE SYSTEM</span>
        </div>

        <h1>PROJECT DRIVE</h1>

        <h2>{name}</h2>

        <p>
          {grade} • {position}
        </p>

        <p>{team}</p>

      </div>

      <div className="header-account">
        <button
          type="button"
          className="header-account-button"
          onClick={() => setAccountOpen((open) => !open)}
          aria-expanded={accountOpen}
          aria-haspopup="menu"
        >
          <span className="header-account-status" />

          <span className="header-account-text">
            <span className="header-account-label">
              CURRENT ATHLETE
            </span>

            <strong>
              {name || "ATHLETE"}
            </strong>
          </span>

          <span
            className={`header-account-chevron ${
              accountOpen ? "open" : ""
            }`}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>

        {accountOpen && (
          <div className="header-account-menu" role="menu">

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setAccountOpen(false);
                onAccountProfile?.();
              }}
            >
              <span>◈</span>

              <span>
                <strong>ACCOUNT & PROFILE</strong>
                <small>
                  Manage your athlete profile
                </small>
              </span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setAccountOpen(false);
                onSettings?.();
              }}
            >
              <span>⚙</span>

              <span>
                <strong>SETTINGS</strong>
                <small>
                  Customize Project Drive
                </small>
              </span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setAccountOpen(false);
                onSecurity?.();
              }}
            >
              <span>◆</span>

              <span>
                <strong>SECURITY</strong>
                <small>
                  Account and sign-in controls
                </small>
              </span>
            </button>

            <div className="header-account-divider" />

            <button
              type="button"
              role="menuitem"
              className="header-account-signout"
              onClick={() => {
                setAccountOpen(false);
                onSignOut?.();
              }}
            >
              <span>↪</span>

              <span>
                <strong>SIGN OUT</strong>
                <small>
                  End this session
                </small>
              </span>
            </button>

          </div>
        )}
      </div>
    </header>
  );
}

export default Header;