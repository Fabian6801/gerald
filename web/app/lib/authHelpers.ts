// Shared checks and friendly messages for the sign-up, log-in and password pages.
// Every message says WHAT is wrong and HOW to fix it.

export type AuthIssue = {
  kind: "input" | "network" | "server" | "unconfirmed";
  message: string;
  field?: "email" | "password";
};

export function checkName(raw: string): string | undefined {
  const v = raw.trim();
  if (!v) return "Enter your full name, for example John Doe.";
  if (v.length < 2) return "That name looks too short. Enter your full name, for example John Doe.";
  return undefined;
}

export function checkEmail(raw: string): string | undefined {
  const v = raw.trim();
  if (!v) return "Enter your email address, for example name@gmail.com.";
  if (!v.includes("@")) return "Add an @ sign, like name@gmail.com.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Add a domain after the @, like name@gmail.com.";
  return undefined;
}

export function checkPassword(v: string): string | undefined {
  if (!v) return "Enter a password.";
  if (v.length < 8) return `Use at least 8 characters. You have ${v.length}.`;
  if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v)) return "Mix letters and numbers, for example Studio2026.";
  return undefined;
}

export function checkConfirm(password: string, confirm: string): string | undefined {
  if (!confirm) return "Type your password again to confirm it.";
  if (confirm !== password) return "The two passwords do not match. Type the same password in both boxes.";
  return undefined;
}

// 0 to 4, with a label, for the strength bar under the password box
export function strength(v: string): { score: number; label: string } {
  if (!v) return { score: 0, label: "" };
  if (v.length < 8) return { score: 0, label: "Too short" };
  let score = 1;
  if (v.length >= 12) score++;
  if (/[A-Za-z]/.test(v) && /[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v) || (/[a-z]/.test(v) && /[A-Z]/.test(v))) score++;
  return { score, label: ["Too short", "Weak", "Fair", "Good", "Strong"][score] };
}

// Only allow redirects to pages on this site (never to another website)
export function safeNext(next: string | null, fallback = "/account"): string {
  if (next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\")) return next;
  return fallback;
}

// Turns whatever Supabase (or the network) reports into a clear message
export function authIssue(error: unknown): AuthIssue {
  const e = (error ?? {}) as { message?: string; code?: string; status?: number; name?: string };
  const text = `${e.code ?? ""} ${e.message ?? ""}`.toLowerCase();

  if (e.name === "AuthRetryableFetchError" || /failed to fetch|networkerror|network request failed|load failed/.test(text)) {
    return { kind: "network", message: "We could not reach our server. Check your internet connection, then try again." };
  }
  if (/invalid_credentials|invalid login credentials/.test(text)) {
    return { kind: "input", field: "password", message: "That email and password do not match. Check both and try again, or reset your password." };
  }
  if (/email_not_confirmed|email not confirmed/.test(text)) {
    return { kind: "unconfirmed", field: "email", message: "Your email address is not confirmed yet. Open the confirmation email we sent you and click the link, or resend it." };
  }
  if (/user_already_exists|already registered|already been registered/.test(text)) {
    return { kind: "input", field: "email", message: "An account with this email already exists. Log in instead, or reset your password." };
  }
  if (/same_password|different from the old/.test(text)) {
    return { kind: "input", field: "password", message: "Choose a password you have not used before." };
  }
  if (/weak_password|password should be|password is too/.test(text)) {
    return { kind: "input", field: "password", message: "That password is too easy to guess. Use at least 8 characters with letters and numbers." };
  }
  if (/rate_limit|rate limit|too many/.test(text) || e.status === 429) {
    return { kind: "input", message: "Too many attempts. Please wait a few minutes, then try again." };
  }
  if (/otp_expired|token has expired|expired|invalid.*token/.test(text)) {
    return { kind: "input", message: "This link has expired or was already used. Request a new one and try again." };
  }
  return { kind: "server", message: "Something went wrong on our side, not yours. Please try again in a moment." };
}