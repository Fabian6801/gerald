"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

type Service = { id: string; title: string };

export default function BookingForm({ services }: { services: Service[] }) {
  const params = useSearchParams();
  const preselected = params.get("service") ?? "";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setErrorMsg("");

    const data = Object.fromEntries(new FormData(form).entries());

        // check terms agreement
    if (!data.terms_agreement) {
      throw new Error("You must agree to Terms, Privacy and Licensing.");
    }
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="booking-form" role="status">
        <h2>Thank you!</h2>
        <p>Your booking request has been sent. I will reply soon to confirm availability.</p>
      </div>
    );
  }


  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <label>Full name <input type="text" name="name" required autoComplete="name" placeholder="e.g. John Doe" /></label>
      <label>Phone / WhatsApp <input type="tel" name="phone" required  placeholder="e.g. +257 23456789" /></label>
      <label>Email <input type="email" name="email" required  placeholder="johndoe@gmail.com" /></label>
      <label>Service
        <select id="service" name="service" required defaultValue={preselected}>
          <option value="">Choose a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </label>
      <label>Preferred date <input type="date" name="date" /></label>
      <label>Location / venue <input type="text" name="location" placeholder="e.g. Gitega, Burundi" /></label>
      <label>Tell us about your shoot <textarea name="message" rows={5}></textarea></label>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />

      {status === "error" && <p role="alert" style={{ color: "rgb(250, 11, 11)" }}>{errorMsg}</p>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', marginTop: '20px', marginBottom: '16px' }}>
        <input 
          type="checkbox" 
          name="terms_agreement" 
          id="agree" 
          value="true"
          style={{ width: '16px', height: '16px', accentColor: '#16a34a' }}
        />
        <label htmlFor="agree" style={{ fontSize: '14px', color: 'white', cursor: 'pointer', margin: 0 }}>
         <p>I agree to <a href="/terms" target="_blank" style={{ textDecoration: 'underline', fontWeight: 600 }}>Terms</a>, <a href="/privacy" target="_blank" style={{ textDecoration: 'underline', fontWeight: 600 }}>Privacy</a> & <a href="/licensing" target="_blank" style={{ textDecoration: 'underline', fontWeight: 600 }}>Licensing</a></p>
        </label>
      </div>
      <button className="btn-green btn-lg" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send booking request"}
      </button>
    </form>
  );
}