import Link from "next/link";
import { services } from "../lib/services";

export const metadata = { title: "Services | Gerard Photo Studio" };

export default function ServicesPage() {
  return (
    <main className="wrap">
      <h1 className="page-title">Services</h1>
      <p className="sub" style={{ color: "var(--muted)" }}>
        Everything we offer. Pick one to book directly.
      </p>

      {services.map((s: any) => (
        <article className="service-detail" id={s.id} key={s.id}>
          <h2>{s.title}</h2>
          <p>{s.long}</p>
          <p className="meta">Good for: {s.goodFor}</p>
          <p className="meta">
            Duration: {s.duration}
            <span className="todo">add time</span>
          </p>
          <Link className="btn-green" href={`/book?service=${s.id}`}>
            Book this service
          </Link>
        </article>
      ))}
    </main>
  );
}