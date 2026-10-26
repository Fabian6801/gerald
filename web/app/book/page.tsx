import { Suspense } from "react";
import { services } from "@/web/app/lib/services";
import BookingForm from "@/web/app/book/BookingForm";

export const metadata = { title: "Book a session | Gerard Photo Studio" };

export default function BookPage() {
  return (
    <main className="wrap">
      <h1 className="page-title">Book a service</h1>
      <p style={{ color: "var(--muted)" }}>
        Fill in the form and we will reply to confirm availability.
      </p>
      <Suspense fallback={null}>
        <BookingForm services={services} />
      </Suspense>
    </main>
  );
}