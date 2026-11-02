"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/Lib/supabase";
import { useOnline } from "@/app/lib/useOnline";
import AuthField from "@/app/components/AuthField";
import AuthAlert from "@/app/components/AuthAlert";
import { authIssue, checkEmail } from "@/app/lib/authHelpers";
import type { AuthIssue } from "@/app/lib/authHelpers";

export default function ForgotPasswordForm() {
  const online = useOnline();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [issue, setIssue] = useState<AuthIssue | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState("");

  async function send(address: string) {
    setBusy(true);
    setIssue(null);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(address, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) {
        setIssue(authIssue(err));
        setBusy(false);
        return;
      }
      setSentTo(address);
    } catch (err) {
      setIssue(authIssue(err));
    }
    setBusy(false);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const message = checkEmail(email);
    setTouched(true);
    setError(message);
    if (message) {
      document.getElementById("forgot-email")?.focus();
      return;
    }
    void send(email.trim());
  }

  if (sentTo) {
    return (
      <div className="auth-card">
        <div className="success-badge" aria-hidden="true"><i className="fa-solid fa-envelope-circle-check"></i></div>
        <h1>Check your email</h1>
        <p className="lead">
          If an account exists for <strong>{sentTo}</strong>, we have sent a link to choose a new password. The link
          works for a limited time.
        </p>
        <h2 className="auth-h2">What happens next</h2>
        <ol className="next-steps">
          <li>Open the email (look in Spam or Promotions if you do not see it).</li>
          <li>Click the link and choose a new password.</li>
          <li>Log in with your new password.</li>
        </ol>
        {issue && <AuthAlert issue={issue} />}
        <p className="state-actions">
          <button type="button" className="btn-outline-dark" disabled={busy || !online} onClick={() => void send(sentTo)}>
            {busy ? "Sending..." : "Send it again"}
          </button>
          <Link className="link-inline" href="/login">Back to log in</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h1>Reset your password</h1>
      <p className="lead">Enter the email you signed up with and we will send you a link to choose a new password.</p>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <AuthField
          id="forgot-email" label="Email" type="email" value={email} autoComplete="email" placeholder="you@example.com" autoFocus
          onChange={(v) => { setEmail(v); if (touched) setError(checkEmail(v)); }}
          onBlur={() => { setTouched(true); setError(checkEmail(email)); }}
          error={error} valid={touched && !error && email.length > 0}
        />
        {!online && (
          <div className="notice notice-warn" role="status">
            <i className="fa-solid fa-wifi" aria-hidden="true"></i>
            <span>You are offline. Reconnect to send the link.</span>
          </div>
        )}
        {issue && <AuthAlert issue={issue} />}
        <button className="btn-green btn-lg" type="submit" disabled={busy || !online}>
          {!online ? "Offline: reconnect to send" : busy ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="auth-switch"><Link href="/login">Back to log in</Link></p>
    </div>
  );
}
