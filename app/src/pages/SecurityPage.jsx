import "../styles/Security.css";

function SecurityPage({ user }) {
  return (
    <section className="security-page">

      <div className="security-header">
        <div>
          <span className="security-eyebrow">
            PROJECT DRIVE
          </span>

          <h1>SECURITY</h1>

          <p>
            Manage your account and sign-in security.
          </p>
        </div>
      </div>

      <div className="security-grid">

        <div className="security-section">
          <div className="security-section-icon">◆</div>

          <div>
            <h2>ACCOUNT SECURITY</h2>

            <p>
              Your Project Drive account is protected by
              Supabase authentication.
            </p>
          </div>

          <div className="security-status">
            <span className="security-status-dot" />
            AUTHENTICATED
          </div>
        </div>

        <div className="security-section">
          <div className="security-section-icon">✉</div>

          <div>
            <h2>ACCOUNT EMAIL</h2>

            <p>
              Current sign-in email
            </p>
          </div>

          <div className="security-email">
            {user?.email || "Unavailable"}
          </div>
        </div>

        <div className="security-section">
          <div className="security-section-icon">🔑</div>

          <div>
            <h2>PASSWORD</h2>

            <p>
              Password management and recovery controls.
            </p>
          </div>

          <div className="security-placeholder">
            Password controls coming next.
          </div>
        </div>

      </div>

    </section>
  );
}

export default SecurityPage;