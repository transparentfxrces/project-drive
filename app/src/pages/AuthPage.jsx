import { useState } from "react";

import {
  signIn,
  signUp,
} from "../services/auth";

import "../styles/Auth.css";

export default function AuthPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [mode, setMode] =
    useState("signin");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setMessage(
        "Enter your email and password."
      );

      return;
    }

    try {
      setLoading(true);
      setMessage("");

      if (mode === "signup") {
  await signUp(
    email.trim(),
    password
  );

  setMessage(
    "Account created. Check your email, confirm your account, then sign in."
  );

  setMode("signin");
  setPassword("");
} else {
        await signIn(
          email.trim(),
          password
        );

        setMessage(
          "Access granted."
        );
      }
    } catch (error) {
      setMessage(
        error.message ||
          "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode((current) =>
      current === "signin"
        ? "signup"
        : "signin"
    );

    setMessage("");
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">

        <div className="auth-eyebrow">
          PROJECT DRIVE
        </div>

        <h1 className="auth-title">
          SYSTEM ACCESS
        </h1>

        <p className="auth-subtitle">
          {mode === "signin"
            ? "Enter your athlete account."
            : "Initialize your athlete account."}
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            EMAIL
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="athlete@email.com"
            autoComplete="email"
          />

          <label>
            PASSWORD
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="Enter password"
            autoComplete={
              mode === "signin"
                ? "current-password"
                : "new-password"
            }
          />

          <button
            className="auth-primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "CONNECTING..."
              : mode === "signin"
              ? "SIGN IN"
              : "CREATE ACCOUNT"}
          </button>
        </form>

        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        <div className="auth-switch">
          <span>
            {mode === "signin"
              ? "New athlete?"
              : "Already registered?"}
          </span>

          <button
            type="button"
            onClick={switchMode}
          >
            {mode === "signin"
              ? "CREATE ACCOUNT"
              : "SIGN IN"}
          </button>
        </div>

      </div>
    </div>
  );
}