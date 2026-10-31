import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="wrap inner notfound">
      <h1 className="page-title">Page not found</h1>
      <p className="lead">The page you are looking for does not exist or has moved.</p>
      <p><Link className="btn-green btn-lg" href="/">Back to home</Link></p>
    </div>
  );
}
