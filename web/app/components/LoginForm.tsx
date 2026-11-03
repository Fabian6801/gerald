"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/Lib/supabase";
import { useAuth } from "@/app/components/AuthProvider";
import { useOnline } from "@/app/lib/useOnline";
import AuthField from "@/app/components/AuthField";
import AuthAlert from "@/app/components/AuthAlert";
import { authIssue, checkEmail, safeNext } from "@/app/lib/authHelpers";
import type { AuthIssue } from "@/app/lib/authHelpers";

type Errors = { email?: string; password?: string };

const DRAFT_KEY = "login-draft"; // only the email is kept, never the password

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const online = useOnline();
  const { user, loading, expired } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [issue, setIssue] = useState<AuthIssue | null>(null);
  const [busy, setBusy] = useState(false);
  const [resent, setResent] = useState(false);

  // If the visitor left this page and came back, put their email back
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) setEmail(saved);
    } catch {}
  }, []);

  // Already logged in: go straight to where they were heading
  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [loading, user, next, router]);

  const checkPassword = (v: string) => (v ? undefined : "Enter your password.");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found: Errors = { email: checkEmail(email), password: checkPassword(password) };
    setTouched({ email: true, password: true });
    setErrors(found);
    if (found.email || found.password) {
      setIssue(null);
      document.getElementById(found.email ? "login-email" : "login-password")?.focus();
      return;
    }

    setBusy(true);
    setIssue(null);
    setResent(false);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        const found = authIssue(error);
        setIssue(found);
        if (found.field) setErrors({ [found.field]: found.message });
        setBusy(false);
        return;
      }
      try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
      router.replace(next); // the page changes, so the button stays busy until then
    } catch (err) {
      setIssue(authIssue(err));
      setBusy(false);
    }
  }

  async function resend() {
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email: email.trim() });
      if (error) setIssue(authIssue(error));
      else setResent(true);
    } catch (err) {
      setIssue(authIssue(err));
    }
  }

  return (
    <div className="auth-card">
      <h1>Log in</h1>
      <p className="lead">Welcome back. Log in to see your booking requests.</p>

      {expired && (
        <div className="notice notice-warn" role="status">
          <i className="fa-solid fa-clock" aria-hidden="true"></i>
          <span>You were signed out. Log in again to continue.</span>
        </div>
      )}
      {!expired && params.get("next") && (
        <div className="notice" role="status">
          <i className="fa-solid fa-lock" aria-hidden="true"></i>
          <span>Log in to continue.</span>
        </div>
      )}

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <AuthField
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); try { sessionStorage.setItem(DRAFT_KEY, v); } catch {} if (touched.email) setErrors((x) => ({ ...x, email: checkEmail(v) })); }}
          onBlur={() => { setTouched((t) => ({ ...t, email: true })); setErrors((x) => ({ ...x, email: checkEmail(email) })); }}
          error={errors.email}
          valid={touched.email && !errors.email && email.length > 0}
          autoComplete="email"
          placeholder="you@example.com"
          autoFocus
        />
        <AuthField
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={(v) => { setPassword(v); if (touched.password) setErrors((x) => ({ ...x, password: checkPassword(v) })); }}
          onBlur={() => { setTouched((t) => ({ ...t, password: true })); setErrors((x) => ({ ...x, password: checkPassword(password) })); }}
          error={errors.password}
          autoComplete="current-password"
          aside={<Link href="/forgot-password" className="auth-aside-link">Forgot your password?</Link>}
        />

        {!online && (
          <div className="notice notice-warn" role="status">
            <i className="fa-solid fa-wifi" aria-hidden="true"></i>
            <span>You are offline. Reconnect to log in.</span>
          </div>
        )}
        {issue && <AuthAlert issue={issue} onResend={resend} resent={resent} />}

        <button className="btn-green btn-lg" type="submit" disabled={busy || !online}>
          {!online ? "Offline: reconnect to log in" : busy ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="auth-switch">
        New here? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Create an account</Link>
      </p>
      <p className="auth-switch">
        Prefer not to sign up? <Link href="/book">Book as a guest</Link>
      </p>
    </div>
  );
}
