"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { waLink } from "@/app/lib/site";
import { PrivacyContent, TermsContent } from "@/app/components/LegalContent";

type Service = { id: string; title: string };
type Status = "idle" | "sending" | "sent" | "error";
type Legal = "terms" | "privacy";

const DRAFT_KEY = "booking-draft";

export default function BookingForm({ services }: { services: Service[] }) {
  const params = useSearchParams();
  const preselected = params.get("service") ?? "";
  const formRef = useRef<HTMLFormElement>(null);
  const legalRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sentName, setSentName] = useState("");
  const [today, setToday] = useState("");
  const [legal, setLegal] = useState<Legal>("terms");

  useEffect(() => {
    // Earliest date a client can pick (today), using their own date
    setToday(new Date().toLocaleDateString("en-CA"));

    // Put back anything the client typed before, if they left the page by mistake
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      const form = formRef.current;
      if (!raw || !form) return;
      const saved = JSON.parse(raw) as Record<string, string>;
      for (const [name, value] of Object.entries(saved)) {
        if (name === "service" && preselected) continue; // the service chosen on the link wins
        const field = form.elements.namedItem(name);
        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLSelectElement ||
          field instanceof HTMLTextAreaElement
        ) {
          field.value = value;
        }
      }
    } catch {}
  }, [preselected]);

  // Saves the form in this browser tab every time something is typed
  function saveDraft() {
    const form = formRef.current;
    if (!form) return;
    const draft: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string" && key !== "consent" && key !== "website") draft[key] = value;
    });
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {}
  }

  function openLegal(which: Legal) {
    setLegal(which);
    legalRef.current?.showModal();
  }

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
      try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
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
    <>
      <form ref={formRef} className="booking-form" onSubmit={onSubmit} onInput={saveDraft}>
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
            I agree to the{" "}
            <button type="button" className="link-inline" onClick={() => openLegal("terms")}>Terms</button> and{" "}
            <button type="button" className="link-inline" onClick={() => openLegal("privacy")}>Privacy Policy</button>,
            and allow my details to be stored to handle this booking.
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

      {/* Pop-up with the Terms or Privacy Policy: the visitor never leaves the form */}
      <dialog
        ref={legalRef}
        className="legal-dialog"
        aria-labelledby="legal-title"
        onClick={(e) => { if (e.target === e.currentTarget) legalRef.current?.close(); }}
      >
        <div className="legal-dialog-head">
          <h2 id="legal-title">{legal === "privacy" ? "Privacy Policy" : "Terms & Licensing"}</h2>
          <button type="button" className="legal-close" aria-label="Close" onClick={() => legalRef.current?.close()}>&times;</button>
        </div>
        <div className="legal legal-dialog-body">
          {legal === "privacy" ? <PrivacyContent /> : <TermsContent />}
        </div>
        <div className="legal-dialog-foot">
          <button type="button" className="btn-green" onClick={() => legalRef.current?.close()}>
            Close and return to the form
          </button>
        </div>
      </dialog>
    </>
  );
}
