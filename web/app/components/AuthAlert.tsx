import type { AuthIssue } from "@/app/lib/authHelpers";

const TITLES = {
  input: "Please check your details",
  network: "No connection",
  server: "This one is on us, not you",
  unconfirmed: "Confirm your email first",
} as const;

// The box that explains what went wrong, whose fault it is, and how to fix it
export default function AuthAlert({
  issue,
  onResend,
  resent,
}: {
  issue: AuthIssue;
  onResend?: () => void;
  resent?: boolean;
}) {
  const tone = issue.kind === "unconfirmed" ? "network" : issue.kind;
  return (
    <div className={`form-alert form-alert-${tone}`} role="alert">
      <strong>{TITLES[issue.kind]}</strong>
      <p>{issue.message}</p>
      {issue.kind === "unconfirmed" && onResend && (
        <p className="form-alert-actions">
          <button type="button" className="btn-outline-dark" onClick={onResend} disabled={resent}>
            {resent ? "Email sent. Check your inbox" : "Resend confirmation email"}
          </button>
        </p>
      )}
    </div>
  );
}
