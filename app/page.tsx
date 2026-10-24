import Link from "next/link";
import { services } from "@/app/lib/services";
import Logo from "@/app/components/logo";
import Gallery from "@/app/components/gallery";

export default function Home() {
  return (
    <main className="wrap">
      <div className="brand-row">
        <Logo />
        <div>
          <h1>Kim Gerard</h1>
          <p>Gerard Photo Studio</p>
        </div>
      </div>

      <Gallery />

      <section id="services" className="section" aria-labelledby="services-h">
        <h2 id="services-h">View my services</h2>
        <p className="sub">Choose a service to see what is included and how it works.</p>
        <ul className="services">
          {services.map((s) => (
            <li className="service" key={s.id}>
              <Link href={`/services#${s.id}`}>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
                <span className="more">View details &rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="book" className="book" aria-labelledby="book-h">
        <h2 id="book-h">Book now</h2>
        <p>Tell us what you need and pick a date. We will confirm quickly.</p>
        <Link className="btn-green btn-lg" href="/book">Book a service</Link>
      </section>

      <section id="about" className="section about" aria-labelledby="about-h">
        <h2 id="about-h">About Gerard Photo Studio</h2>
        <p className="sub">Everything you may want to know before you book.</p>

        <div className="about-grid">
          <div>
            <h3>Who we are</h3>
            <p>
              Gerard Photo Studio is a photography studio led by Kim Gerard. We photograph weddings, portraits, families, fashion, products, events and travel, in the studio and on location.{" "}
            </p>

            <h3>Why clients choose us</h3>
            <ul>
              <li>Friendly direction and posing help, so you look natural, not stiff</li>
              <li>Professional lighting and equipment for studio and on-location work</li>
              <li>Careful editing in a consistent, timeless style.</li>
            </ul>

            <a
              className="whatsapp-float"
              href="https://wa.me/25769270296"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>

            <h3>How it works</h3>
            <ol className="steps">
              <li><strong>Enquire.</strong></li>
              <li><strong>Plan.</strong></li>
              <li><strong>Shoot.</strong> </li>
              <li><strong>Deliver.</strong><span className="todo">(within X days)</span>.</li>
            </ol>
          </div>

          <div>
            <h3>Studio details</h3>
            <dl className="facts">
              <dt>Location</dt><dd><span className="todo">Street, Town, Country</span></dd>
              <dt>Hours</dt><dd><span className="todo">Mon to Fri 9:00 to 18:00, Sat 10:00 to 16:00</span></dd>
              <dt>Phone / WhatsApp</dt><dd><span className="todo">+000 000 000 000</span></dd>
              <dt>Email</dt><dd><span className="todo">hello@example.com</span></dd>
              <dt>On-location</dt><dd><span className="todo">Yes, travel fee applies beyond X km</span></dd>
              <dt>Deposit</dt><dd><span className="todo">X% to confirm your date</span></dd>
              <dt>Payment</dt><dd><span className="todo">Mobile money, bank transfer, cash</span></dd>
              <dt>Turnaround</dt><dd><span className="todo">X days for edited photos</span></dd>
            </dl>

            <h3>Common questions</h3>
            <div className="faq">
              <details><summary>How do I book a session?</summary><p>Use the Book now button, fill in the form, and we will reply to confirm availability and the next steps.</p></details>
              <details><summary>How far ahead should I book?</summary><p>Weddings and events book up early, so enquire as soon as you have a date. Portraits and product shoots are often possible at shorter notice. <span className="todo">Add your usual lead time.</span></p></details>
              <details><summary>What should I wear?</summary><p>Choose comfortable outfits you feel confident in. Solid colours usually photograph best. We will give you more tips when you book.</p></details>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}