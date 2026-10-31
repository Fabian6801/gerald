import { testimonials } from "@/app/lib/testimonials";

export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="sec" aria-labelledby="testimonials-h">
      <div className="wrap">
        <h2 id="testimonials-h" className="sec-title">Kind Words</h2>
        <p className="sec-sub">What our clients say</p>
        <div className="quote-grid">
          {testimonials.map((t, i) => (
            <figure className="quote-card" key={i}>
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption>
                {t.name}
                {t.detail && <span>{t.detail}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
