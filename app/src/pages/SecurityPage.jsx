import "../styles/Security.css";

function SecurityPage({ user }) {

  function handlePasswordReset() {
    alert(
      "Password recovery will be connected to Supabase next."
    );
  }

  return (
    <section className="security-page">

      <div className="security-grid">

        {/* ACCOUNT STATUS */}
        <div className="security-section">

          <div className="security-section-icon">
            ◆
          </div>

          <div className="security-section-header">
            <h2>ACCOUNT SECURITY</h2>

            <p>
              Your Project Drive account is protected by
              Supabase authentication.
            </p>
          </div>

          <div className="security-status">
            <span className="security-status-dot" />

            <div>
              <strong>AUTHENTICATED</strong>
              <span>
                Your current session is active.
              </span>
            </div>
          </div>

        </div>


        {/* EMAIL */}
        <div className="security-section">

          <div className="security-section-icon">
            ✉
          </div>

          <div className="security-section-header">
            <h2>ACCOUNT EMAIL</h2>

            <p>
              Email associated with your Project Drive account.
            </p>
          </div>

          <div className="security-email">
            {user?.email || "Unavailable"}
          </div>

        </div>


        {/* PASSWORD */}
        <div className="security-section">

          <div className="security-section-icon">
            🔑
          </div>

          <div className="security-section-header">
            <h2>PASSWORD</h2>

            <p>
              Manage your account password and recovery.
            </p>
          </div>

          <div className="security-row">

            <div className="security-row-info">
              <strong>Password</strong>

              <span>
                Send a password recovery email to your
                account email.
              </span>
            </div>

            <button
              className="security-action"
              onClick={handlePasswordReset}
            >
              RESET PASSWORD
            </button>

          </div>

        </div>


        {/* MFA */}
        <div className="security-section">

          <div className="security-section-icon">
            ◈
          </div>

          <div className="security-section-header">
            <h2>MULTI-FACTOR AUTHENTICATION</h2>

            <p>
              Add another layer of protection to your account.
            </p>
          </div>

          <div className="security-row">

            <div className="security-row-info">
              <strong>MFA</strong>

              <span>
                Two-factor authentication will be available
                once the Supabase MFA flow is connected.
              </span>
            </div>

            <button
              className="security-action"
              disabled
            >
              COMING NEXT
            </button>

          </div>

        </div>


        {/* DANGER ZONE */}
        <div className="security-section security-danger">

          <div className="security-section-header">
            <h2>DANGER ZONE</h2>

            <p>
              Account actions that should be used carefully.
            </p>
          </div>

          <div className="security-row">

            <div className="security-row-info">
              <strong>Sign out</strong>

              <span>
                End your current Project Drive session.
              </span>
            </div>

            <button
              className="security-danger-button"
              onClick={() => {
                alert(
                  "Sign out is currently handled from the main account menu."
                );
              }}
            >
              SIGN OUT
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default SecurityPage;