"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const PAGES = [
  { path: "/services", label: "Services" },
  { path: "/book", label: "Book a session" },
  { path: "/privacy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms & Licensing" },
];

// How many single-letter changes turn a into b (used to guess what the visitor meant)
function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = temp;
    }
  }
  return row[b.length];
}

export default function NotFound() {
  const [guess, setGuess] = useState<{ path: string; label: string } | null>(null);

  useEffect(() => {
    const typed = window.location.pathname.toLowerCase().replace(/\/+$/, "");
    const ranked = PAGES.map((p) => ({ ...p, d: distance(typed, p.path) })).sort((a, b) => a.d - b.d);
    if (ranked[0] && ranked[0].d <= 3) setGuess(ranked[0]);
  }, []);

  return (
    <div className="wrap inner notfound">
      <h1 className="page-title">We can&rsquo;t find that page</h1>
      <p className="lead">The address may have a typo, or the page has moved.</p>

      {guess && (
        <p className="did-you-mean">
          Did you mean <Link href={guess.path}>{guess.label}</Link>?
        </p>
      )}

      <p className="lead">Popular pages</p>
      <p className="chip-row">
        <Link className="tab" href="/">Home</Link>
        <Link className="tab" href="/#gallery">Gallery</Link>
        <Link className="tab" href="/services">Services</Link>
        <Link className="tab" href="/book">Book a session</Link>
      </p>
      <p><Link className="btn-green btn-lg" href="/">Back to home</Link></p>
    </div>
  );
}
