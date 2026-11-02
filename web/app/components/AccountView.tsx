"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/Lib/supabase";
import { useAuth } from "@/app/components/AuthProvider";
import { useOnline } from "@/app/lib/useOnline";

type Booking = {
  id: string;
  created_at: string;
  service: string | null;
  preferred_date: string | null;
  location: string | null;
  status: string | null;
};
type Load = "loading" | "ready" | "error";

const STATUS: Record<string, { label: string; tone: string }> = {
  pending: { label: "Awaiting confirmation", tone: "pending" },
  confirmed: { label: "Confirmed", tone: "ok" },
  completed: { label: "Completed", tone: "done" },
  cancelled: { label: "Cancelled", tone: "off" },
};

function niceDate(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AccountView() {
  const router = useRouter();
  const online = useOnline();
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [load, setLoad] = useState<Load>("loading");
  const [attempt, setAttempt] = useState(0);

  // Not logged in: send them to log in, then back here
  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/account");
  }, [loading, user, router]);

  // Row level security means each person can only ever read their own bookings
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoad("loading");
    (async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("id, created_at, service, preferred_date, location, status")
          .order("created_at", { ascending: false });
        if (cancelled) return;
        if (error || !data) throw new Error(error?.message || "No data");
        setBookings(data as Booking[]);
        setLoad("ready");
      } catch {
        if (!cancelled) setLoad("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, attempt]);

  // Back online: try again by itself
  useEffect(() => {
    if (online && load === "error") setAttempt((a) => a + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  if (loading || !user) {
    return (
      <div className="wrap inner" aria-busy="true">
        <div className="skeleton-line wide" />
        <div className="skeleton-line" />
        <div className="skeleton-box tall" />
      </div>
    );
  }

  const fullName = typeof user.user_metadata?.full_name === "string" ? (user.user_metadata.full_name as string) : "";
  const first = fullName.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <div className="wrap inner">
      <h1 className="page-title">Hello, {first}</h1>
      <p className="lead">Follow your booking requests and manage your account here.</p>

      <div className="account-grid">
        <aside className="contact-card">
          <h2>Your details</h2>
          <ul>
            {fullName && <li><i className="fa-solid fa-user" aria-hidden="true"></i><span>{fullName}</span></li>}
            <li><i className="fa-solid fa-envelope" aria-hidden="true"></i><span>{user.email}</span></li>
          </ul>
          <p className="account-links">
            <Link className="btn-outline-dark" href="/reset-password">Change password</Link>
            <Link className="btn-outline-dark" href="/logout">Log out</Link>
          </p>
        </aside>

        <section aria-labelledby="my-bookings">
          <div className="account-head">
            <h2 id="my-bookings">My booking requests</h2>
            <Link className="btn-green" href="/book">New request</Link>
          </div>

          {load === "loading" && (
            <div aria-busy="true">
              <div className="skeleton-box tall" />
              <div className="skeleton-box tall" />
            </div>
          )}

          {load === "error" && (
            <div className="state-box" role="alert">
              <i className="fa-regular fa-circle-xmark" aria-hidden="true"></i>
              <h3>We could not load your requests</h3>
              <p>
                {online
                  ? "This is a problem on our side, not yours. Your requests are safe. Please try again in a moment."
                  : "Your device seems to be offline. Check your internet connection, then try again."}
              </p>
              <p className="state-actions">
                <button type="button" className="btn-green" onClick={() => setAttempt((a) => a + 1)}>Try again</button>
              </p>
            </div>
          )}

          {load === "ready" && bookings.length === 0 && (
            <div className="state-box">
              <i className="fa-regular fa-calendar" aria-hidden="true"></i>
              <h3>No booking requests yet</h3>
              <p>When you send a booking request while logged in, you can follow it here. Requests sent before you made an account are not listed.</p>
              <p className="state-actions">
                <Link className="btn-green" href="/book">Book a session</Link>
              </p>
            </div>
          )}

          {load === "ready" && bookings.length > 0 && (
            <ul className="booking-list">
              {bookings.map((b) => {
                const s = STATUS[(b.status || "pending").toLowerCase()] ?? { label: b.status || "Pending", tone: "pending" };
                return (
                  <li key={b.id} className="booking-item">
                    <div className="booking-item-main">
                      <strong>{b.service || "Booking request"}</strong>
                      <span className={`status status-${s.tone}`}>{s.label}</span>
                    </div>
                    <dl className="booking-item-meta">
                      <div><dt>Sent</dt><dd>{niceDate(b.created_at)}</dd></div>
                      {b.preferred_date && <div><dt>Preferred date</dt><dd>{niceDate(b.preferred_date)}</dd></div>}
                      {b.location && <div><dt>Location</dt><dd>{b.location}</dd></div>}
                    </dl>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
