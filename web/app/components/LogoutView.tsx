"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/components/AuthProvider";

export default function LogoutView() {
  const { signOut } = useAuth();
  const [done, setDone] = useState(false);

  // Logs the visitor out as soon as this page opens
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await signOut();
      if (!cancelled) setDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [signOut]);

  if (!done) {
    return (
      <div className="auth-card" aria-busy="true" role="status">
        <h1>Logging you out...</h1>
        <p className="lead">One moment.</p>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="success-badge" aria-hidden="true"><i className="fa-solid fa-check"></i></div>
      <h1>You are logged out</h1>
      <p className="lead">
        You have been signed out on this device, and the booking details you were typing were cleared from this
        browser. Your account and your booking requests are safe.
      </p>
      <p className="state-actions">
        <Link className="btn-green" href="/login">Log in again</Link>
        <Link className="btn-outline-dark" href="/">Back to home</Link>
      </p>
    </div>
  );
}
