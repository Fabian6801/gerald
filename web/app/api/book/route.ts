import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { services } from "@/app/lib/services";
import { site } from "@/app/lib/site";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const PHONE = /^\+?[0-9 ]{7,20}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Sends an email through Resend (https://resend.com). Skipped when RESEND_API_KEY is not set.
async function sendEmail(payload: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error("Email failed:", res.status, await res.text());
  } catch (err) {
    console.error("Email failed:", err);
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Spam trap: real visitors never fill this hidden field
  if (clean(body.website)) return NextResponse.json({ success: true });

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 200);
  const serviceId = clean(body.service, 60);
  const date = clean(body.date, 20);
  const location = clean(body.location, 200);
  const details = clean(body.message);
  const consent = clean(body.consent, 10) === "on";

  const service = services.find((s) => s.id === serviceId);

  if (!name || !service) {
    return NextResponse.json({ error: "Please fill in your name and choose a service." }, { status: 400 });
  }
  if (!PHONE.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number, for example +257 79 123 456." }, { status: 400 });
  }
  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (date) {
    // Allow today in any time zone: reject only dates before yesterday (UTC)
    const earliest = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    if (!DATE.test(date) || date < earliest) {
      return NextResponse.json({ error: "Please choose a date that is not in the past." }, { status: 400 });
    }
  }
  if (!consent) {
    return NextResponse.json({ error: "Please tick the box to accept the Terms and Privacy Policy." }, { status: 400 });
  }

  const { error } = await supabase.from("bookings").insert([
    {
      client_name: name,
      phone,
      email,
      service: service.title,
      preferred_date: date || null,
      location: location || null,
      details: details || null,
      status: "pending",
      accepted_terms: true,
      accepted_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }

  // Emails are optional and never stop a booking from being saved
  const from = process.env.RESEND_FROM || `${site.name} <onboarding@resend.dev>`;
  const ownerEmail = process.env.BOOKING_TO_EMAIL || site.email;

  await sendEmail({
    from,
    to: [ownerEmail],
    reply_to: email,
    subject: `New booking request: ${service.title} (${name})`,
    text: [
      `Name: ${name}`,
      `Phone / WhatsApp: ${phone}`,
      `Email: ${email}`,
      `Service: ${service.title}`,
      `Preferred date: ${date || "not given"}`,
      `Location: ${location || "not given"}`,
      "",
      "Message:",
      details || "(none)",
    ].join("\n"),
  });

  // The client confirmation needs a verified domain in Resend, so it is sent only when RESEND_FROM is set
  if (process.env.RESEND_FROM) {
    await sendEmail({
      from,
      to: [email],
      reply_to: ownerEmail,
      subject: `We received your booking request | ${site.name}`,
      text: [
        `Hello ${name.split(" ")[0]},`,
        "",
        `Thank you for your booking request for ${service.title}. We have received it and will contact you soon to confirm availability.`,
        "",
        `${site.name}`,
        `${site.phone}`,
      ].join("\n"),
    });
  }

  return NextResponse.json({ success: true });
}