import { site } from "@/app/lib/site";

export const metadata = {
  title: "Terms & Licensing",
  description: "Booking, payment, delivery, copyright and licensing terms for Gerard Photo Studio.",
};

export default function TermsPage() {
  return (
    <div className="wrap inner legal">
      <h1 className="page-title">Terms &amp; Licensing</h1>
      {site.lastUpdated && <p className="lead">Last updated: {site.lastUpdated}</p>}

      <p>By sending a booking request, you agree to these terms.</p>

      <h2>Bookings</h2>
      <ul>
        <li>A request is not a confirmed booking until we confirm it with you.</li>
        {site.deposit && <li>Your date is reserved once we confirm and receive the deposit: {site.deposit}.</li>}
        <li>Prices and what is included are agreed in writing before the session.</li>
      </ul>

      {site.payment && (
        <>
          <h2>Payment</h2>
          <p>We accept: {site.payment}.</p>
        </>
      )}

      {site.cancellation && (
        <>
          <h2>Rescheduling and cancellation</h2>
          <p>{site.cancellation}</p>
        </>
      )}

      <h2>Delivery</h2>
      <p>
        Edited photos are delivered in a private online gallery
        {site.turnaround ? `. Typical turnaround: ${site.turnaround}.` : "."} Delivery times may change for large events.
      </p>

      <h2>Copyright and licensing</h2>
      <ul>
        <li>All photographs are &copy; {site.owner} and remain our property.</li>
        <li>You receive a personal licence to print and share your photos. Commercial use needs written permission.</li>
        <li>Please do not remove watermarks, resell or re-edit the photos without permission.</li>
      </ul>

      <h2>Use of your photos by us</h2>
      <p>
        We may show selected photos in our portfolio and on social media. If you would prefer that we do not,
        please tell us before the session.
      </p>

      {site.originals && (
        <>
          <h2>Original files</h2>
          <p>{site.originals}</p>
        </>
      )}

      {site.liability && (
        <>
          <h2>Liability</h2>
          <p>{site.liability}</p>
        </>
      )}

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a> &middot; {site.phone}
      </p>
    </div>
  );
}
