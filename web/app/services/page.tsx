import Link from "next/link";
import Image from "next/image";
import { services } from "@/app/lib/services";

export const metadata = {
  title: "Services",
  description: "Wedding, portrait, family, fashion, commercial, corporate, event, travel, editing and print services from Gerard Photo Studio.",
};

export default function ServicesPage() {
  return (
    <div className="wrap inner">
      <h1 className="page-title">Services</h1>
      <p className="lead">Everything we offer. Pick one to book directly.</p>

      <div className="svc-detail-grid">
        {services.map((s) => (
          <article className="svc-detail" id={s.id} key={s.id}>
            {s.image && (
              <div className="svc-detail-img">
                <Image src={s.image} alt={s.title} fill sizes="(max-width: 860px) 100vw, 560px" />
              </div>
            )}
            <div className="svc-detail-body">
              <div className="svc-detail-head">
                <span className="svc-icon-sm" aria-hidden="true"><i className={`fa-solid ${s.icon}`}></i></span>
                <h2>{s.title}</h2>
              </div>
              <p>{s.long}</p>

              {s.includes.length > 0 && (
                <ul className="ticks">
                  {s.includes.map((x) => <li key={x}>{x}</li>)}
                </ul>
              )}

              <dl className="svc-meta">
                <div><dt>Good for</dt><dd>{s.goodFor}</dd></div>
                {s.duration && <div><dt>Duration</dt><dd>{s.duration}</dd></div>}
                <div><dt>Price</dt><dd>{s.from ? `From ${s.from}` : "Request a quote"}</dd></div>
              </dl>

              <Link className="btn-green" href={`/book?service=${s.id}`}>Book this service</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
