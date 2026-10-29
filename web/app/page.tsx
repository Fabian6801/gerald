import { Suspense } from "react";
import Link from "next/link";
import { services } from "@/app/lib/services";
import { assets } from "@/app/lib/assets";
import Gallery from "@/app/components/gallery";
import BookingForm from "@/app/book/serviceSelect"; // the booking form component in app/book

// The three cards shown on the home page. Type a price (e.g. "$350") to show "From $350".
const featured = [
  { id: "wedding-photography", title: "Wedding", icon: "fa-ring", price: "" },
  { id: "portrait-sessions", title: "Portrait", icon: "fa-camera", price: "" },
  { id: "event-coverage", title: "Events", icon: "fa-champagne-glasses", price: "" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero" aria-label="Welcome">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-img" src={assets.hero} alt="" fetchPriority="high" />
        <div className="hero-content">
          <h1>Capturing Your Moments</h1>
          <p className="hero-tag">Wedding, portrait &amp; events photography — elegant, timeless, natural</p>
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
              return (
                <Link key={f.id} className="svc-card" href={`/services#${f.id}`}>
                  <span className="svc-icon" aria-hidden="true"><i className={`fa-solid ${f.icon}`}></i></span>
                  <h3>{f.title}</h3>
                  <p>{s?.short}</p>
                  <span className="svc-price">
                    {f.price ? `From ${f.price}` : <span className="todo">Add price</span>}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="svc-more">
            <Link className="btn-outline-dark" href="/services">View all services</Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="sec about" aria-labelledby="about-h">
        <div className="wrap">
          <h2 id="about-h" className="sec-title">About Gerard Photo Studio</h2>
          <p className="sec-sub">Everything you may want to know before you book.</p>

          <div className="about-intro">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="about-photo" src={assets.gerardPhoto} alt="Kim Gerard, photographer" />
            <div className="about-intro-text">
              <h3>Who we are</h3>
              <p>
                Gerard Photo Studio is a photography studio led by Kim Gerard. We photograph weddings, portraits, families, fashion, products, events and travel, in the studio and on location.{" "}
                <span className="todo">Add your story here: how you started, your style, years of experience, awards or published work.</span>
              </p>
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
                <li><strong>Plan.</strong> We agree on the date, location, outfits and the shots you want, and confirm with a deposit.</li>
                <li><strong>Shoot.</strong> Relax and enjoy the session while we guide you.</li>
                <li><strong>Deliver.</strong> You choose your favourites, we edit them and deliver your photos <span className="todo">within X days</span>.</li>
              </ol>
            </div>

            <div>
              <h3>Studio details</h3>
              <dl className="facts">
                <dt>Location</dt><dd>Gihanga, Burundi</dd>
                <dt>Hours</dt><dd><span className="todo">Mon to Fri 9:00 to 18:00, Sat 10:00 to 16:00</span></dd>
                <dt>Phone / WhatsApp</dt><dd>+257 69270296</dd>
                <dt>Email</dt><dd>mfuranzimagerard028@gmail.com</dd>
                <dt>On-location</dt><dd><span className="todo">Yes, travel fee applies beyond X km</span></dd>
                <dt>Deposit</dt><dd><span className="todo">X% to confirm your date</span></dd>
                <dt>Payment</dt><dd><span className="todo">Mobile money, bank transfer, cash</span></dd>
                <dt>Turnaround</dt><dd><span className="todo">X days for edited photos</span></dd>
              </dl>

              <h3>Common questions</h3>
              <div className="faq">
                <details><summary>How do I book a session?</summary><p>Use the Book Now button, fill in the form, and we will reply to confirm availability and the next steps.</p></details>
                <details><summary>How far ahead should I book?</summary><p>Weddings and events book up early, so enquire as soon as you have a date. Portraits and product shoots are often possible at shorter notice. <span className="todo">Add your usual lead time.</span></p></details>
                <details><summary>What should I wear?</summary><p>Choose comfortable outfits you feel confident in. Solid colours usually photograph best. We will give you more tips when you book.</p></details>
                <details><summary>Can I get the original files?</summary><p><span className="todo">Explain your policy on edited files, full-resolution files and prints.</span></p></details>
                <details><summary>What if I need to reschedule or cancel?</summary><p><span className="todo">Add your reschedule and cancellation terms.</span></p></details>
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
          <Suspense fallback={null}>
            <BookingForm services={services} />
          </Suspense>
          <p className="book-note">We typically respond within 24 hours &bull; Gihanga, Burundi</p>
        </div>
      </section>

      {/* WHATSAPP BUTTON */}
      <a
        className="whatsapp-float"
        href="https://wa.me/25769270296?text=Hello%2C%20I%20would%20like%20to%20book%20a%20session"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </>
  );
}
