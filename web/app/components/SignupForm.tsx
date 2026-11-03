"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/Lib/supabase";
import { useAuth } from "@/app/components/AuthProvider";
import { useOnline } from "@/app/lib/useOnline";
import AuthField from "@/app/components/AuthField";
import AuthAlert from "@/app/components/AuthAlert";
import LegalPopup from "@/app/components/LegalPopup";
import type { LegalKind } from "@/app/components/LegalPopup";
import { authIssue, checkConfirm, checkEmail, checkName, checkPassword, safeNext, strength } from "@/app/lib/authHelpers";
import type { AuthIssue } from "@/app/lib/authHelpers";

type FieldName = "name" | "email" | "password" | "confirm" | "terms";
type Errors = Partial<Record<FieldName, string>>;

const DRAFT_KEY = "signup-draft"; // only the name and email are kept, never the password

export default function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const online = useOnline();
  const { user, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [issue, setIssue] = useState<AuthIssue | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [resent, setResent] = useState(false);
  const [legal, setLegal] = useState<LegalKind | null>(null);
  const [restored, setRestored] = useState(false);

  // If the visitor left this page and came back, put their name and email back
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as { name?: string; email?: string };
      if (draft.name) setName(draft.name);
      if (draft.email) setEmail(draft.email);
      if (draft.name || draft.email) setRestored(true);
    } catch {}
  }, []);

  function remember(nextName: string, nextEmail: string) {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ name: nextName, email: nextEmail })); } catch {}
  }

  function startOver() {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
    setName(""); setEmail(""); setPassword(""); setConfirm(""); setTerms(false);
    setErrors({}); setTouched({}); setIssue(null); setRestored(false);
  }

  useEffect(() => {
    if (!loading && user && !sentTo) router.replace(next);
  }, [loading, user, next, router, sentTo]);

  const rules: Record<FieldName, (v: { name: string; email: string; password: string; confirm: string; terms: boolean }) => string | undefined> = {
    name: (v) => checkName(v.name),
    email: (v) => checkEmail(v.email),
    password: (v) => checkPassword(v.password),
    confirm: (v) => checkConfirm(v.password, v.confirm),
    terms: (v) => (v.terms ? undefined : "Tick the box to agree to the Terms and Privacy Policy."),
  };
  const ORDER: FieldName[] = ["name", "email", "password", "confirm", "terms"];
  const FOCUS: Record<FieldName, string> = { name: "signup-name", email: "signup-email", password: "signup-password", confirm: "signup-confirm", terms: "signup-terms" };

  const values = { name, email, password, confirm, terms };
  const touch = (f: FieldName, nextValues = values) => {
    setTouched((t) => ({ ...t, [f]: true }));
    setErrors((x) => ({ ...x, [f]: rules[f](nextValues) }));
  };
  const live = (f: FieldName, nextValues: typeof values) => {
    if (touched[f]) setErrors((x) => ({ ...x, [f]: rules[f](nextValues) }));
    // keep the "confirm" message honest when the first password changes
    if (f === "password" && touched.confirm) setErrors((x) => ({ ...x, confirm: rules.confirm(nextValues) }));
  };
  const ok = (f: FieldName) => Boolean(touched[f] && !errors[f]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found: Errors = {};
    for (const f of ORDER) {
      const message = rules[f](values);
      if (message) found[f] = message;
    }
    setTouched({ name: true, email: true, password: true, confirm: true, terms: true });
    setErrors(found);
    const first = ORDER.find((f) => found[f]);
    if (first) {
      setIssue(null);
      document.getElementById(FOCUS[first])?.focus();
      return;
    }

    setBusy(true);
    setIssue(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}${next}`,
        },
      });
      if (error) {
        const found = authIssue(error);
        setIssue(found);
        if (found.field) setErrors({ [found.field]: found.message });
        setBusy(false);
        return;
      }
      // Supabase hides whether an email is already registered by returning a user with no identities
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        const message = "An account with this email already exists. Log in instead, or reset your password.";
        setErrors({ email: message });
        setIssue({ kind: "input", field: "email", message });
        setBusy(false);
        return;
      }
      try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
      if (data.session) {
        router.replace(next); // email confirmation is switched off: they are already logged in
        return;
      }
      setSentTo(email.trim());
      setBusy(false);
    } catch (err) {
      setIssue(authIssue(err));
      setBusy(false);
    }
  }

  async function resend() {
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email: sentTo, options: { emailRedirectTo: `${window.location.origin}${next}` } });
      if (error) setIssue(authIssue(error));
      else setResent(true);
    } catch (err) {
      setIssue(authIssue(err));
    }
  }

  // SUCCESS: confirm, reassure, then show what happens next
  if (sentTo) {
    return (
      <div className="auth-card">
        <div className="success-badge" aria-hidden="true"><i className="fa-solid fa-envelope-circle-check"></i></div>
        <h1>Check your email</h1>
        <p className="lead">
          We sent a confirmation link to <strong>{sentTo}</strong>. Your account is created and waits only for that click.
        </p>
        <h2 className="auth-h2">What happens next</h2>
        <ol className="next-steps">
          <li>Open the email from {`Gerard Photo Studio`} (look in Spam or Promotions if you do not see it).</li>
          <li>Click the link in it. You will be logged in automatically.</li>
          <li>Book a session and follow your requests from your account.</li>
        </ol>
        {issue && <AuthAlert issue={issue} />}
        <p className="state-actions">
          <button type="button" className="btn-outline-dark" onClick={resend} disabled={resent}>
            {resent ? "Sent again. Check your inbox" : "Resend the email"}
          </button>
          <button type="button" className="link-inline" onClick={() => { setSentTo(""); setResent(false); setIssue(null); }}>
            Wrong email? Start over
          </button>
        </p>
      </div>
    );
  }

  const strong = strength(password);

  return (
    <div className="auth-card">
      <h1>Create your account</h1>
      <p className="lead">Follow your booking requests and book faster next time. It takes a minute.</p>

      {restored && (
        <div className="notice" role="status">
          <i className="fa-solid fa-floppy-disk" aria-hidden="true"></i>
          <span>We kept your name and email from earlier.</span>
          <button type="button" className="link-inline" onClick={startOver}>Start over</button>
        </div>
      )}

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <AuthField
          id="signup-name" label="Full name" value={name} autoComplete="name" placeholder="e.g. John Doe" autoFocus
          onChange={(v) => { setName(v); remember(v, email); live("name", { ...values, name: v }); }}
          onBlur={() => touch("name")}
          error={errors.name} valid={ok("name")}
        />
        <AuthField
          id="signup-email" label="Email" type="email" value={email} autoComplete="email" placeholder="you@example.com"
          onChange={(v) => { setEmail(v); remember(name, v); live("email", { ...values, email: v }); }}
          onBlur={() => touch("email")}
          error={errors.email} valid={ok("email")}
        />
        <AuthField
          id="signup-password" label="Password" type="password" value={password} autoComplete="new-password"
          onChange={(v) => { setPassword(v); live("password", { ...values, password: v }); }}
          onBlur={() => touch("password")}
          error={errors.password} valid={ok("password")}
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
          id="signup-confirm" label="Confirm password" type="password" value={confirm} autoComplete="new-password"
          onChange={(v) => { setConfirm(v); live("confirm", { ...values, confirm: v }); }}
          onBlur={() => touch("confirm")}
          error={errors.confirm} valid={ok("confirm")}
        />

        <div className="auth-field">
          <label className="consent">
            <input
              id="signup-terms"
              type="checkbox"
              checked={terms}
              aria-invalid={errors.terms ? true : undefined}
              onChange={(e) => { setTerms(e.target.checked); live("terms", { ...values, terms: e.target.checked }); setTouched((t) => ({ ...t, terms: true })); setErrors((x) => ({ ...x, terms: e.target.checked ? undefined : rules.terms({ ...values, terms: false }) })); }}
            />
            <span>
              I agree to the <button type="button" className="link-inline" onClick={() => setLegal("terms")}>Terms</button> and{" "}
              <button type="button" className="link-inline" onClick={() => setLegal("privacy")}>Privacy Policy</button>.
            </span>
          </label>
          {errors.terms && (
            <small className="field-error">
              <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {errors.terms}
            </small>
          )}
        </div>

        {!online && (
          <div className="notice notice-warn" role="status">
            <i className="fa-solid fa-wifi" aria-hidden="true"></i>
            <span>You are offline. Your details are kept on this page. Reconnect to create your account.</span>
          </div>
        )}
        {issue && <AuthAlert issue={issue} />}

        <button className="btn-green btn-lg" type="submit" disabled={busy || !online}>
          {!online ? "Offline: reconnect to continue" : busy ? "Creating your account..." : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`}>Log in</Link>
      </p>

      <LegalPopup which={legal} onClose={() => setLegal(null)} />
    </div>
  );
}
