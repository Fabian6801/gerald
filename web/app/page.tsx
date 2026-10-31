import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { services } from "@/app/lib/services";
import { assets } from "@/app/lib/assets";
import { site, waLink } from "@/app/lib/site";
import Gallery from "@/app/components/gallery";
import Testimonials from "@/app/components/testimonials";
import BookingForm from "@/app/book/BookingForm";

// The three cards shown on the home page (prices come from app/lib/services.ts)
const featured = [
  { id: "wedding-photography", label: "Wedding" },
  { id: "portrait-sessions", label: "Portrait" },
  { id: "event-coverage", label: "Events" },
];

export default function Home() {
  const tel = site.phone.replace(/[^+\d]/g, "");

  const facts = [
    ["Location", site.location],
    ["Hours", site.hours],
    ["Phone / WhatsApp", site.phone],
    ["Email", site.email],
    ["On-location", site.onLocation],
    ["Deposit", site.deposit],
    ["Payment", site.payment],
    ["Turnaround", site.turnaround],
  ].filter(([, value]) => value);

  const faqs = [
    { q: "How do I book a session?", a: "Use the Book Now button, fill in the form, and we will reply to confirm availability and the next steps." },
    { q: "How far ahead should I book?", a: `Weddings and events book up early, so enquire as soon as you have a date. Portraits and product shoots are often possible at shorter notice.${site.leadTime ? " " + site.leadTime : ""}` },
    { q: "What should I wear?", a: "Choose comfortable outfits you feel confident in. Solid colours usually photograph best. We will give you more tips when you book." },
    ...(site.deposit ? [{ q: "Do I need to pay a deposit?", a: site.deposit }] : []),
    ...(site.originals ? [{ q: "Can I get the original files?", a: site.originals }] : []),
    ...(site.cancellation ? [{ q: "What if I need to reschedule or cancel?", a: site.cancellation }] : []),
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero" aria-label="Welcome">
        <Image className="hero-img" src={assets.hero} alt="" fill priority sizes="100vw" />
        <div className="hero-content">
          <h1>Capturing Your Moments</h1>
          <p className="hero-tag">{site.tagline}</p>
          <div className="hero-actions">
            <Link className="btn-ghost btn-lg" href="/#gallery">View Portfolio</Link>
            <Link className="btn-green btn-lg" href="/book">Book a Session</Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <Gallery />

      {/* SERVICES */}
      <section id="services" className="sec sec-band" aria-labelledby="services-h">
        <div className="wrap">
          <h2 id="services-h" className="sec-title">Services</h2>
          <p className="sec-sub">Tailored sessions for every moment</p>

          <div className="svc-grid">
            {featured.map((f) => {
              const s = services.find((x) => x.id === f.id);
              if (!s) return null;
              return (
                <Link key={f.id} className="svc-card" href={`/services#${f.id}`}>
                  <span className="svc-icon" aria-hidden="true"><i className={`fa-solid ${s.icon}`}></i></span>
                  <h3>{f.label}</h3>
                  <p>{s.short}</p>
                  <span className="svc-price">{s.from ? `From ${s.from}` : "Request a quote"}</span>
                </Link>
              );
            })}
          </div>

          <div className="svc-more">
            <Link className="btn-outline-dark" href="/services">View all services</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (only shown when you add some in app/lib/testimonials.ts) */}
      <Testimonials />

      {/* ABOUT */}
      <section id="about" className="sec about" aria-labelledby="about-h">
        <div className="wrap">
          <h2 id="about-h" className="sec-title">About {site.name}</h2>
          <p className="sec-sub">Everything you may want to know before you book.</p>

          <div className="about-intro">
            <div className="about-photo-wrap">
              <Image src={assets.gerardPhoto} alt={`${site.owner}, photographer`} fill sizes="(max-width: 720px) 100vw, 340px" />
            </div>
            <div className="about-intro-text">
              <h3>Who we are</h3>
              <p>
                {site.name} is a photography studio led by {site.owner}. We photograph weddings, portraits, families,
                fashion, products, events and travel, in the studio and on location.
              </p>
              {site.story && <p>{site.story}</p>}
            </div>
          </div>

          <div className="about-grid">
            <div>
              <h3>Why clients choose us</h3>
              <ul>
                <li>Friendly direction and posing help, so you look natural, not stiff</li>
                <li>Professional lighting and equipment for studio and on-location work</li>
                <li>Careful editing in a consistent, timeless style</li>
                <li>Clear quotes, with no surprise charges</li>
                <li>Photos delivered in a private online gallery you can share</li>
              </ul>

              <h3>How it works</h3>
              <ol className="steps">
                <li><strong>Enquire.</strong> Send a booking request or message us on WhatsApp.</li>
                <li><strong>Plan.</strong> We agree on the date, location, outfits and the shots you want{site.deposit ? ", and confirm with a deposit" : ""}.</li>
                <li><strong>Shoot.</strong> Relax and enjoy the session while we guide you.</li>
                <li><strong>Deliver.</strong> You choose your favourites, we edit them and deliver your photos in a private online gallery.{site.turnaround ? ` Typical turnaround: ${site.turnaround}.` : ""}</li>
              </ol>
            </div>

            <div>
              <h3>Studio details</h3>
              <dl className="facts">
                {facts.map(([label, value]) => (
                  <div className="fact" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              <h3>Common questions</h3>
              <div className="faq">
                {faqs.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOK */}
      <section id="book" className="sec sec-band book-section" aria-labelledby="book-h">
        <div className="wrap">
          <h2 id="book-h" className="sec-title">Book Your Session</h2>
          <p className="sec-sub">Tell us what you need and pick a date. We will confirm quickly.</p>

          <div className="contact-strip">
            {site.phone && <a href={`tel:${tel}`}><i className="fa-solid fa-phone"></i>{site.phone}</a>}
            <a href={waLink()} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i>WhatsApp</a>
            {site.email && <a href={`mailto:${site.email}`}><i className="fa-solid fa-envelope"></i>{site.email}</a>}
          </div>

          <Suspense fallback={null}>
            <BookingForm services={services} />
          </Suspense>

          <p className="book-note">
            {site.responseTime ? `We typically respond ${site.responseTime} \u2022 ` : ""}
            {site.location}
          </p>
        </div>
      </section>
    </>
  );
}
