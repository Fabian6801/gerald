"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/Lib/supabase";
import { useAuth } from "@/app/components/AuthProvider";
import { useOnline } from "@/app/lib/useOnline";
import AuthField from "@/app/components/AuthField";
import AuthAlert from "@/app/components/AuthAlert";
import { authIssue, checkConfirm, checkPassword, strength } from "@/app/lib/authHelpers";
import type { AuthIssue } from "@/app/lib/authHelpers";

// Used for two things: choosing a new password from the emailed link, and changing it from the account page
export default function ResetPasswordForm() {
  const online = useOnline();
  const { session, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [touched, setTouched] = useState<{ password?: boolean; confirm?: boolean }>({});
  const [issue, setIssue] = useState<AuthIssue | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // LOADING: show the shape of what is coming
  if (loading) {
    return (
      <div className="auth-card" aria-busy="true">
        <div className="skeleton-line wide" />
        <div className="skeleton-line" />
        <div className="skeleton-box" />
        <div className="skeleton-box" />
      </div>
    );
  }

  // No session: the link is old, already used, or opened on another device
  if (!session) {
    return (
      <div className="auth-card">
        <div className="state-box">
          <i className="fa-regular fa-clock" aria-hidden="true"></i>
          <h1 className="auth-h2">This link has expired</h1>
          <p>Password links work once and only for a short time. Request a new link and we will email it right away.</p>
          <p className="state-actions">
            <Link className="btn-green" href="/forgot-password">Request a new link</Link>
            <Link className="btn-outline-dark" href="/login">Back to log in</Link>
          </p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="auth-card">
        <div className="success-badge" aria-hidden="true"><i className="fa-solid fa-check"></i></div>
        <h1>Password updated</h1>
        <p className="lead">Your new password is saved. You are logged in, and the old password no longer works.</p>
        <p className="state-actions">
          <Link className="btn-green" href="/account">Go to my account</Link>
          <Link className="btn-outline-dark" href="/book">Book a session</Link>
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = { password: checkPassword(password), confirm: checkConfirm(password, confirm) };
    setTouched({ password: true, confirm: true });
    setErrors(found);
    if (found.password || found.confirm) {
      setIssue(null);
      document.getElementById(found.password ? "reset-password" : "reset-confirm")?.focus();
      return;
    }
    setBusy(true);
    setIssue(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        const found = authIssue(error);
        setIssue(found);
        if (found.field === "password") setErrors({ password: found.message });
        setBusy(false);
        return;
      }
      setDone(true);
    } catch (err) {
      setIssue(authIssue(err));
    }
    setBusy(false);
  }

  const strong = strength(password);

  return (
    <div className="auth-card">
      <h1>Choose a new password</h1>
      <p className="lead">Pick a password you have not used before.</p>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <AuthField
          id="reset-password" label="New password" type="password" value={password} autoComplete="new-password" autoFocus
          onChange={(v) => {
            setPassword(v);
            if (touched.password) setErrors((x) => ({ ...x, password: checkPassword(v) }));
            if (touched.confirm) setErrors((x) => ({ ...x, confirm: checkConfirm(v, confirm) }));
          }}
          onBlur={() => { setTouched((t) => ({ ...t, password: true })); setErrors((x) => ({ ...x, password: checkPassword(password) })); }}
          error={errors.password} valid={touched.password && !errors.password}
          hint="At least 8 characters, with letters and numbers."
        />
        {password && (
          <div className="strength" aria-live="polite">
            <div className="strength-bar" aria-hidden="true">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={n <= strong.score ? `on level-${strong.score}` : undefined} />
              ))}
            </div>
            <span>Password strength: {strong.label}</span>
          </div>
        )}
        <AuthField
          id="reset-confirm" label="Confirm new password" type="password" value={confirm} autoComplete="new-password"
          onChange={(v) => { setConfirm(v); if (touched.confirm) setErrors((x) => ({ ...x, confirm: checkConfirm(password, v) })); }}
          onBlur={() => { setTouched((t) => ({ ...t, confirm: true })); setErrors((x) => ({ ...x, confirm: checkConfirm(password, confirm) })); }}
          error={errors.confirm} valid={touched.confirm && !errors.confirm}
        />

        {!online && (
          <div className="notice notice-warn" role="status">
            <i className="fa-solid fa-wifi" aria-hidden="true"></i>
            <span>You are offline. Reconnect to save your new password.</span>
          </div>
        )}
        {issue && <AuthAlert issue={issue} />}
        <button className="btn-green btn-lg" type="submit" disabled={busy || !online}>
          {!online ? "Offline: reconnect to save" : busy ? "Saving..." : "Save new password"}
        </button>
      </form>
    </div>
  );
}
