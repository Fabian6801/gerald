import { site } from "@/app/lib/site";

// The text of the Privacy Policy and Terms. Used by the /privacy and /terms pages
// AND by the pop-up window in the booking form, so the wording is always the same.

export function PrivacyContent() {
  return(
    <>
      {site.lastUpdated && <p className="lead">Last updated: {site.lastUpdated}</p>}

      <p>
        Gerard respects your privacy. This page explains what information
        I collect, why, and what I do with it.
      </p>

      <h2>What I collect</h2>
      <p>When you send a booking request, I collect:</p>
      <ul>
        <li>Your name, phone or WhatsApp number and email address</li>
        <li>The service you want, your preferred date and the location</li>
        <li>Any details you write in the message box</li>
        <li>The time you agreed to this policy and our Terms</li>
      </ul> 

      <h2>Why I use it</h2>
      <ul>
        <li>To reply to your request and confirm availability</li>
        <li>To plan, deliver and invoice the service you book</li>
        <li>To keep a record of our agreement with you</li>
      </ul>
      <p>I do not sell your information, and I do not use it for unrelated marketing without asking you first.</p>

      <h2>Where it is stored</h2>
      <p>
        Booking requests are saved in a secure database provided by Supabase. The website is hosted by Vercel.
        These providers process data on our behalf. Booking details are used only by {site.owner} .
      </p>

      {site.retention && (
        <>
          <h2>How long I keep it</h2>
          <p>
            I keep booking details for {site.retention} after your session, or as long as the law requires, and
            then delete them.
          </p>
        </>
      )}

      <h2>Cookies and browser storage</h2>
      <p>This site stores small items in your browser:</p>
      <ul>
        <li><strong>Theme</strong>: remembers whether you chose light or dark mode.</li>
        <li><strong>Cookie choice</strong>: remembers whether you accepted or declined optional cookies.</li>
        <li>
          <strong>Booking form draft</strong>: keeps what you have typed in the booking form, so you do not lose it
          if you leave the page by mistake. It stays on your device only, and is deleted when you send the form or
          close the tab.
        </li>
      </ul>
      <p>
        Optional cookies, such as analytics, are used only if you click Accept. You can change your choice at any
        time using &ldquo;Cookie settings&rdquo; in the footer. The site also loads icons from Font Awesome, which may
        receive your IP address when a page loads.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask me to show you, correct or delete the information I hold about you. Contact me using the
        details below and I will reply promptly.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a> &middot; {site.phone}
        <br />
        {site.location}
      </p>
    
    </>
  );
} 


export function TermsContent() {
  return (
    <>
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
    </>
  );
}
