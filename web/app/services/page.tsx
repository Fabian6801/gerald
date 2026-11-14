"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { services } from "@/app/lib/services";
// Round X at the top right of the Terms and Privacy pages: goes back to where the visitor came from
export  function PageCloseButton() {
  const router = useRouter();
  function close() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return (
    <button type="button" className="legal-close page-close" aria-label="Close and go back" onClick={close}>
      &times;
    </button>
  );
}

export default function Services() {
  return (
    <div>
      <div className="card">
        <h2 className="page-title">Services</h2>
        <p className="lead">Everything I offer. Pick one to book directly.</p>

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
                  <h3>{s.title}</h3>
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
    </div>
  );
}
