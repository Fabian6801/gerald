import Link from "next/link";
import { services } from "./lib/services";
import Logo from "./components/logo";
import Gallery from "./components/gallery";

export default function Home() {
  return (
    <main className="wrap">
      <div className="brand-row">
        <Logo />
        <div>
          <h1>Kim Gerard</h1>
          <p>Gerard Photography</p>
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
        <p>Tell me  what you need and pick a date. I will confirm quickly.</p>
        <Link className="btn-green btn-lg" href="/book">Book a service</Link>
      </section>

      <section id="about" className="section about" aria-labelledby="about-h">
        <h2 id="about-h">About Gerard photography</h2>
        <p className="sub">Everything you may want to know before you book.</p>

        <div className="about-grid">
          <div>
            <h3>Who is GERARD</h3>
            <p>
             Hello,
              I’m Gérard.
              A photographer with a thoughtful eye for people and the moments that matter.<br/> My approach is personal: I understand what matters to you, pay attention to the details, and make photographs that feel true to the moment.

              I’m available for local assignments and remote international photo-editing projects. Let’s talk about the images you want to create..
            </p>

            <h3>Why clients choose my work</h3>
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
            <p className="steps">you enquire,<br/> we discuss,<br/> you book,<br/> we create</p>
          </div>

          <div>
            <h3>Studio details</h3>
            <dl className="facts">
              <dt>Location</dt><dd>Gihanga, Mpanda, Burundi</dd>
              <dt>Hours</dt><dd>mon - sat 9:00 - 18:00</dd>
              <dt>Phone / WhatsApp</dt><dd><a href="https://wa.me/25769270296" aria-label="Call us">+257 692 702 96</a></dd>
              <dt>Email</dt><dd>mfuranzimagerard028@gmail.com</dd>
              <dt>Payment</dt><dd>after negotiation and agreement</dd>
            </dl>

            <h3>Common questions</h3>
            <div className="faq">
              <details><summary>How do I book a session?</summary><p>Use the Book now button, fill in the form, and we will reply to confirm availability and the next steps.</p></details>
              <details><summary>How far ahead should I book?</summary><p>Weddings and events book up early, so enquire as soon as you have a date. Portraits and product shoots are often possible at shorter notice.</p></details>
              <details><summary>What should I wear?</summary><p>Choose comfortable outfits you feel confident in. Solid colours usually photograph best. We will give you more tips when you book.</p></details>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}