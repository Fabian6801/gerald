"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { waLink } from "@/app/lib/site";

type Service = { id: string; title: string };
type Status = "idle" | "sending" | "sent" | "error";

export default function BookingForm({ services }: { services: Service[] }) {
  const params = useSearchParams();
  const preselected = params.get("service") ?? "";
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sentName, setSentName] = useState("");
  const [today, setToday] = useState("");

  // Earliest date a client can pick (today). Set in the browser so it uses their own date.
  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-CA"));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setErrorMsg("");

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setSentName(String(data.name || "").split(" ")[0]);
      form.reset();
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="booking-success" role="status">
        <h2>Thank you{sentName ? `, ${sentName}` : ""}!</h2>
        <p>Your booking request has been sent. We will contact you soon to confirm availability and the next steps.</p>
        <p className="booking-success-actions">
          <Link className="btn-green" href="/">Back to home</Link>
          <a className="btn-outline-dark" href={waLink()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
        </p>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <label>
        <span>Full name <b className="req" aria-hidden="true">*</b></span>
        <input type="text" name="name" required maxLength={100} autoComplete="name" placeholder="e.g. John Doe" />
      </label>
      <label>
        <span>Phone / WhatsApp <b className="req" aria-hidden="true">*</b></span>
        <input
          type="tel"
          name="phone"
          required
          inputMode="tel"
          autoComplete="tel"
          pattern="[+]?[0-9 ]{7,19}"
          title="Digits and spaces only, for example +257 79 123 456"
          placeholder="e.g. +257 79 123 456"
        />
      </label>
      <label>
        <span>Email <b className="req" aria-hidden="true">*</b></span>
        <input type="email" name="email" required autoComplete="email" placeholder="you@example.com" />
      </label>
      <label>
        <span>Service <b className="req" aria-hidden="true">*</b></span>
        <select name="service" required defaultValue={preselected}>
          <option value="">Choose a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Preferred date</span>
        <input type="date" name="date" min={today || undefined} />
      </label>
      <label>
        <span>Location / venue</span>
        <input type="text" name="location" maxLength={200} placeholder="e.g. Gitega, Burundi" />
      </label>
      <label>
        <span>Tell us about your shoot</span>
        <textarea name="message" rows={4} maxLength={2000} placeholder="Date, number of people, the style you like, anything we should know"></textarea>
      </label>

      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          I agree to the <Link href="/terms" target="_blank">Terms</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link>, and
          allow my details to be stored to handle this booking.
        </span>
      </label>

      {/* Hidden spam trap: real visitors never fill this in */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />

      {status === "error" && <p role="alert" className="form-error">{errorMsg}</p>}

      <button className="btn-green btn-lg" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send booking request"}
      </button>
    </form>
  );
}
