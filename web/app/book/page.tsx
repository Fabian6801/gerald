import { Suspense } from "react";
import { services } from "@/app/lib/services";
import { site, waLink } from "@/app/lib/site";
import BookingForm from "./BookingForm";

export const metadata = {
  title: "Book a session",
  description: "Request a photography session with Gerard Photo Studio. Choose a service and a date, and we will confirm availability.",
};

export default function BookPage() {
  const tel = site.phone.replace(/[^+\d]/g, "");

  return (
    <div className="wrap inner">
      <h1 className="page-title">Book a session</h1>
      <p className="lead">Fill in the form and we will reply to confirm availability.</p>

      <div className="book-layout">
        <Suspense fallback={null}>
          <BookingForm services={services} />
        </Suspense>

        <aside className="contact-card" aria-label="Contact details">
          <h2>Prefer to talk?</h2>
          <ul>
            {site.phone && (
              <li><i className="fa-solid fa-phone"></i><span><a href={`tel:${tel}`}>{site.phone}</a></span></li>
            )}
            <li><i className="fa-brands fa-whatsapp"></i><span><a href={waLink()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></span></li>
            {site.email && (
              <li><i className="fa-solid fa-envelope"></i><span><a href={`mailto:${site.email}`}>{site.email}</a></span></li>
            )}
            {site.location && (
              <li><i className="fa-solid fa-location-dot"></i><span>{site.location}</span></li>
            )}
            {site.hours && (
              <li><i className="fa-solid fa-clock"></i><span>{site.hours}</span></li>
            )}
          </ul>
          {site.responseTime && <p className="contact-note">We typically respond {site.responseTime}.</p>}
        </aside>
      </div>
    </div>
  );
}
