import { site } from "@/app/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: "How Gerard Photo Studio collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="wrap inner legal">
      <h1 className="page-title">Privacy Policy</h1>
      {site.lastUpdated && <p className="lead">Last updated: {site.lastUpdated}</p>}

      <p>
        {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This page explains what information
        we collect, why, and what we do with it.
      </p>

      <h2>What we collect</h2>
      <p>When you send a booking request, we collect:</p>
      <ul>
        <li>Your name, phone or WhatsApp number and email address</li>
        <li>The service you want, your preferred date and the location</li>
        <li>Any details you write in the message box</li>
        <li>The time you agreed to this policy and our Terms</li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To reply to your request and confirm availability</li>
        <li>To plan, deliver and invoice the service you book</li>
        <li>To keep a record of our agreement with you</li>
      </ul>
      <p>We do not sell your information, and we do not use it for unrelated marketing without asking you first.</p>

      <h2>Where it is stored</h2>
      <p>
        Booking requests are saved in a secure database provided by Supabase. The website is hosted by Vercel.
        These providers process data on our behalf. Booking details are used only by {site.owner} and the
        studio team.
      </p>

      {site.retention && (
        <>
          <h2>How long we keep it</h2>
          <p>
            We keep booking details for {site.retention} after your session, or as long as the law requires, and
            then delete them.
          </p>
        </>
      )}

      <h2>Cookies and browser storage</h2>
      <p>This site stores small items in your browser:</p>
      <ul>
        <li><strong>Theme</strong>: remembers whether you chose light or dark mode.</li>
        <li><strong>Cookie choice</strong>: remembers whether you accepted or declined optional cookies.</li>
      </ul>
      <p>
        Optional cookies, such as analytics, are used only if you click Accept. You can change your choice at any
        time using &ldquo;Cookie settings&rdquo; in the footer. The site also loads icons from Font Awesome, which may
        receive your IP address when a page loads.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us to show you, correct or delete the information we hold about you. Contact us using the
        details below and we will reply promptly.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a> &middot; {site.phone}
        <br />
        {site.location}
      </p>
    </div>
  );
}
