"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { site, waLink } from "@/app/lib/site";
import { useOnline } from "@/app/lib/useOnline";
import { PrivacyContent, TermsContent } from "@/app/components/LegalContent";

type Service = { id: string; title: string };
type Status = "idle" | "sending" | "sent";
type Legal = "terms" | "privacy";
type FieldName = "name" | "phone" | "email" | "service" | "date" | "consent";
type Errors = Partial<Record<FieldName, string>>;
type FormAlert = { kind: "input" | "network" | "server"; title: string; message: string };
type Summary = { name: string; service: string; date: string; phone: string; email: string };

const DRAFT_KEY = "booking-draft";
const FIELDS: FieldName[] = ["name", "phone", "email", "service", "date", "consent"];
const REQUIRED: FieldName[] = ["name", "phone", "email", "service"];

// Every message says WHICH field is wrong and HOW to fix it
function check(field: FieldName, values: Record<string, string>, consent: boolean, today: string): string | undefined {
  const v = (values[field] ?? "").trim();
  switch (field) {
    case "name":
      if (!v) return "Enter your full name, for example John Doe.";
      if (v.length < 2) return "That name looks too short. Enter your full name, for example John Doe.";
      return undefined;
    case "phone":
      if (!v) return "Enter a phone number we can reach you on, for example +257 79 123 456.";
      if (!/^\+?[0-9 ]{7,19}$/.test(v)) return "Use digits and spaces only (7 to 19 digits), for example +257 79 123 456.";
      return undefined;
    case "email":
      if (!v) return "Enter your email address, for example name@gmail.com.";
      if (!v.includes("@")) return "Add an @ sign, like name@gmail.com.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Add a domain after the @, like name@gmail.com.";
      return undefined;
    case "service":
      if (!v) return "Choose the service you want from the list.";
      return undefined;
    case "date":
      if (v && today && v < today) return "That date has passed. Pick today or a later date.";
      return undefined;
    case "consent":
      if (!consent) return "Tick the box to agree to the Terms and Privacy Policy.";
      return undefined;
  }
}

function readForm(form: HTMLFormElement) {
  const values: Record<string, string> = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === "string") values[key] = value;
  });
  const consentBox = form.elements.namedItem("consent");
  const consent = consentBox instanceof HTMLInputElement ? consentBox.checked : false;
  return { values, consent };
}

export default function BookingForm({ services }: { services: Service[] }) {
  const params = useSearchParams();
  const preselected = params.get("service") ?? "";
  const online = useOnline();
  const formRef = useRef<HTMLFormElement>(null);
  const legalRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [formAlert, setFormAlert] = useState<FormAlert | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [restored, setRestored] = useState(false);
  const [today, setToday] = useState("");
  const [legal, setLegal] = useState<Legal>("terms");

  useEffect(() => {
    // Earliest date a client can pick (today), using their own date
    setToday(new Date().toLocaleDateString("en-CA"));

    // SESSION SAFE: put back anything the client typed before, if they left the page by mistake
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      const form = formRef.current;
      if (!raw || !form) return;
      const saved = JSON.parse(raw) as Record<string, string>;
      let any = false;
      for (const [name, value] of Object.entries(saved)) {
        if (name === "service" && preselected) continue; // the service chosen on the link wins
        const field = form.elements.namedItem(name);
        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLSelectElement ||
          field instanceof HTMLTextAreaElement
        ) {
          field.value = value;
          if (value.trim()) any = true;
        }
      }
      if (any) setRestored(true);
    } catch {}
  }, [preselected]);

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

  function startOver() {
    formRef.current?.reset();
    try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
    setRestored(false);
    setErrors({});
    setTouched({});
    setFormAlert(null);
  }

  function focusField(name: FieldName) {
    const el = formRef.current?.elements.namedItem(name);
    if (el instanceof HTMLElement) el.focus();
  }

  function validateField(name: FieldName) {
    const form = formRef.current;
    if (!form) return;
    const { values, consent } = readForm(form);
    setErrors((prev) => ({ ...prev, [name]: check(name, values, consent, today) }));
  }

  // VALIDATION: flag the exact field, inline, when the visitor leaves it
  function onBlur(e: React.FocusEvent<HTMLFormElement>) {
    const name = (e.target as HTMLInputElement).name as FieldName;
    if (!FIELDS.includes(name)) return;
    setTouched((t) => ({ ...t, [name]: true }));
    validateField(name);
  }

  // ...and clear the message the moment they fix it
  function onInput(e: React.FormEvent<HTMLFormElement>) {
    saveDraft();
    const name = (e.target as HTMLInputElement).name as FieldName;
    if (FIELDS.includes(name) && touched[name]) validateField(name);
  }

  function openLegal(which: Legal) {
    setLegal(which);
    legalRef.current?.showModal();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const { values, consent } = readForm(form);

    const found: Errors = {};
    for (const f of FIELDS) {
      const message = check(f, values, consent, today);
      if (message) found[f] = message;
    }
    setTouched({ name: true, phone: true, email: true, service: true, date: true, consent: true });
    setErrors(found);

    const first = FIELDS.find((f) => found[f]);
    if (first) {
      const count = Object.keys(found).length;
      setFormAlert({
        kind: "input",
        title: "Please check your details",
        message: `${count} ${count === 1 ? "field needs" : "fields need"} your attention. ${count === 1 ? "It is" : "They are"} marked in red below.`,
      });
      focusField(first);
      return;
    }

    setStatus("sending");
    setFormAlert(null);
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      let json: { error?: string; field?: string } = {};
      try { json = await res.json(); } catch {}

      if (res.ok) {
        // SUCCESS: confirm, reassure, then show what happens next
        setSummary({
          name: String(values.name || "").trim().split(" ")[0],
          service: services.find((s) => s.id === values.service)?.title ?? "",
          date: values.date || "",
          phone: values.phone || "",
          email: values.email || "",
        });
        try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
        form.reset();
        setErrors({});
        setTouched({});
        setRestored(false);
        setStatus("sent");
        return;
      }

      setStatus("idle");
      if (res.status >= 400 && res.status < 500) {
        // Their side: tell them which field and how to fix it
        const field = FIELDS.find((f) => f === json.field);
        if (field && json.error) {
          setErrors({ [field]: json.error });
          focusField(field);
        }
        setFormAlert({
          kind: "input",
          title: "Please check your details",
          message: json.error || "Something in the form needs fixing. Please check it and try again.",
        });
      } else {
        // Our side: say so, keep their details, offer another way
        setFormAlert({
          kind: "server",
          title: "This one is on us, not you",
          message: "Something went wrong on our side. Your details are still in the form, so nothing is lost. Try again in a moment, or send the same request on WhatsApp.",
        });
      }
    } catch {
      setStatus("idle");
      setFormAlert({
        kind: "network",
        title: "No connection",
        message: "We could not reach our server. Your details are still in the form. Check your internet connection, then press Send again.",
      });
    }
  }

  if (status === "sent" && summary) {
    return (
      <div className="booking-success" role="status">
        <div className="success-badge" aria-hidden="true"><i className="fa-solid fa-check"></i></div>
        <h2>Thank you{summary.name ? `, ${summary.name}` : ""}! Your request is in.</h2>
        <p className="success-lead">
          We have received your booking request{summary.service ? ` for ${summary.service}` : ""}. Nothing is booked yet:
          we will contact you to confirm availability{site.responseTime ? ` ${site.responseTime}` : ""}. Your details are stored securely and used only to
          handle this booking.
        </p>

        <dl className="success-summary">
          {summary.service && <div><dt>Service</dt><dd>{summary.service}</dd></div>}
          {summary.date && <div><dt>Preferred date</dt><dd>{summary.date}</dd></div>}
          <div><dt>We will contact you on</dt><dd>{summary.phone} or {summary.email}</dd></div>
        </dl>

        <h3>What happens next</h3>
        <ol className="next-steps">
          <li>We review your request and check our calendar.</li>
          <li>We contact you to confirm the date and the details.</li>
          <li>{site.deposit ? `You confirm your date with the deposit: ${site.deposit}.` : "We agree the price and details with you in writing."}</li>
          <li>We meet on the day and create your photos.</li>
        </ol>

        <p className="booking-success-actions">
          <Link className="btn-green" href="/">Back to home</Link>
          <a className="btn-outline-dark" href={waLink()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
        </p>
      </div>
    );
  }

  const cls = (f: FieldName) =>
    errors[f] ? "is-invalid" : touched[f] && REQUIRED.includes(f) ? "is-valid" : undefined;
  const aria = (f: FieldName) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `err-${f}` : undefined,
  });
  const ok = (f: FieldName) => Boolean(touched[f] && !errors[f] && REQUIRED.includes(f));
  const msg = (f: FieldName) =>
    errors[f] ? (
      <small id={`err-${f}`} className="field-error">
        <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {errors[f]}
      </small>
    ) : null;

  return (
    <>
      <form ref={formRef} className="booking-form" onSubmit={onSubmit} onInput={onInput} onBlur={onBlur} noValidate>
        {/* SESSION SAFE: tell them their details were saved */}
        {restored && (
          <div className="notice" role="status">
            <i className="fa-solid fa-floppy-disk" aria-hidden="true"></i>
            <span>We saved the details you typed earlier.</span>
            <button type="button" className="link-inline" onClick={startOver}>Start over</button>
          </div>
        )}

        <label>
          <span>Full name <b className="req" aria-hidden="true">*</b>{ok("name") && <i className="ok" aria-hidden="true">&#10003;</i>}</span>
          <input type="text" name="name" required maxLength={100} autoComplete="name" placeholder="e.g. John Doe" className={cls("name")} {...aria("name")} />
          {msg("name")}
        </label>
        <label>
          <span>Phone / WhatsApp <b className="req" aria-hidden="true">*</b>{ok("phone") && <i className="ok" aria-hidden="true">&#10003;</i>}</span>
          <input type="tel" name="phone" required inputMode="tel" autoComplete="tel" placeholder="e.g. +257 79 123 456" className={cls("phone")} {...aria("phone")} />
          {msg("phone")}
        </label>
        <label>
          <span>Email <b className="req" aria-hidden="true">*</b>{ok("email") && <i className="ok" aria-hidden="true">&#10003;</i>}</span>
          <input type="email" name="email" required autoComplete="email" placeholder="you@example.com" className={cls("email")} {...aria("email")} />
          {msg("email")}
        </label>
        <label>
          <span>Service <b className="req" aria-hidden="true">*</b>{ok("service") && <i className="ok" aria-hidden="true">&#10003;</i>}</span>
          <select name="service" required defaultValue={preselected} className={cls("service")} {...aria("service")}>
            <option value="">Choose a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
          {msg("service")}
        </label>
        <label>
          <span>Preferred date</span>
          <input type="date" name="date" min={today || undefined} className={cls("date")} {...aria("date")} />
          {msg("date")}
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
          <input type="checkbox" name="consent" required {...aria("consent")} />
          <span>
            I agree to the{" "}
            <button type="button" className="link-inline" onClick={() => openLegal("terms")}>Terms</button> and{" "}
            <button type="button" className="link-inline" onClick={() => openLegal("privacy")}>Privacy Policy</button>,
            and allow my details to be stored to handle this booking.
          </span>
        </label>
        {errors.consent && (
          <small id="err-consent" className="field-error consent-error">
            <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {errors.consent}
          </small>
        )}

        {/* Hidden spam trap: real visitors never fill this in */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />

        {/* NO INTERNET: keep the form, say what works */}
        {!online && (
          <div className="notice notice-warn" role="status">
            <i className="fa-solid fa-wifi" aria-hidden="true"></i>
            <span>You are offline. Your details are kept on this page. The Send button works again when you reconnect.</span>
          </div>
        )}

        {/* ERROR: what went wrong, whose fault, how to fix it */}
        {formAlert && (
          <div className={`form-alert form-alert-${formAlert.kind}`} role="alert">
            <strong>{formAlert.title}</strong>
            <p>{formAlert.message}</p>
            {formAlert.kind !== "input" && (
              <p className="form-alert-actions">
                <button type="submit" className="btn-outline-dark">Try again</button>
                <a className="btn-outline-dark" href={waLink("Hello, I tried to book a session on your website but it did not go through.")} target="_blank" rel="noopener noreferrer">
                  Send on WhatsApp
                </a>
              </p>
            )}
          </div>
        )}

        <button className="btn-green btn-lg" type="submit" disabled={status === "sending" || !online}>
          {!online ? "Offline: reconnect to send" : status === "sending" ? "Sending..." : "Send booking request"}
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
