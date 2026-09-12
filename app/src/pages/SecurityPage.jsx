import { useState } from "react";
import "../styles/Security.css";
import { sendPasswordReset } from "../services/auth";

function SecurityPage({ user, onSignOut }) {
  const [resetStatus, setResetStatus] = useState("idle");
  const [resetError, setResetError] = useState("");

  async function handlePasswordReset() {
    if (!user?.email) {
      setResetStatus("error");
      setResetError("No account email is available.");
      return;
    }

    setResetStatus("loading");
    setResetError("");

    try {
      await sendPasswordReset(
        user.email,
        `${window.location.origin}/reset-password`
      );

      setResetStatus("success");
    } catch (error) {
      console.error("Password reset failed:", error);
      setResetStatus("error");
      setResetError(
        error?.message || "Unable to send password recovery email."
      );
    }
  }

  return (
    <section className="security-page">
      <div className="security-grid">
        {/* ACCOUNT STATUS */}
        <div className="security-section">
          <div className="security-section-icon">◆</div>

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
              <span>Your current session is active.</span>
            </div>
          </div>
        </div>

        {/* EMAIL */}
        <div className="security-section">
          <div className="security-section-icon">✉</div>

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
          <div className="security-section-icon">🔑</div>

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
                Send a password recovery email to your account
                email.
              </span>
            </div>

            <button
              className="security-action"
              onClick={handlePasswordReset}
              disabled={resetStatus === "loading"}
            >
              {resetStatus === "loading"
                ? "SENDING..."
                : "RESET PASSWORD"}
            </button>
          </div>

          {resetStatus === "success" && (
            <div className="security-message security-success">
              ✓ Password recovery email sent.
            </div>
          )}

          {resetStatus === "error" && (
            <div className="security-message security-error">
              {resetError}
            </div>
          )}
        </div>

        {/* MFA */}
        <div className="security-section">
          <div className="security-section-icon">◈</div>

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
                Two-factor authentication will be connected
                through Supabase in a later step.
              </span>
            </div>

            <button className="security-action" disabled>
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
              onClick={onSignOut}
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