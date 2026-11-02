import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { services } from "@/app/lib/services";
import { site } from "@/app/lib/site";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const noSession = { persistSession: false, autoRefreshToken: false };

const supabase = createClient(url, anon, { auth: noSession });

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const PHONE = /^\+?[0-9 ]{7,19}$/;
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

  // Each message says which field is wrong and how to fix it. "field" lets the form mark that exact box.
  const bad = (message: string, field: string) =>
    NextResponse.json({ error: message, field }, { status: 400 });

  if (!name) return bad("Enter your full name, for example John Doe.", "name");
  if (!service) return bad("Choose the service you want from the list.", "service");
  if (!PHONE.test(phone)) return bad("Use digits and spaces only (7 to 19 digits), for example +257 79 123 456.", "phone");
  if (!EMAIL.test(email)) return bad("Add a domain after the @, like name@gmail.com.", "email");
  if (date) {
    // Allow today in any time zone: reject only dates before yesterday (UTC)
    const earliest = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    if (!DATE.test(date) || date < earliest) return bad("That date has passed. Pick today or a later date.", "date");
  }
  if (!consent) return bad("Tick the box to agree to the Terms and Privacy Policy.", "consent");

  // Is the visitor logged in? Then this request is linked to their account.
  // A missing or expired login is not an error: the request is saved as a guest booking.
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  let userId: string | null = null;
  if (token) {
    const { data: found } = await supabase.auth.getUser(token);
    userId = found.user?.id ?? null;
  }
  const db = userId
    ? createClient(url, anon, { auth: noSession, global: { headers: { Authorization: `Bearer ${token}` } } })
    : supabase;

  const { error } = await db.from("bookings").insert([
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
      user_id: userId,
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

  return NextResponse.json({ success: true, linked: userId !== null });
}