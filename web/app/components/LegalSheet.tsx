"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Makes the Privacy and Terms pages look like a pop-up: a rounded card in the middle of a dimmed screen,
// with a round X at the top right. It closes with the X, the Close button, the Escape key or a click outside.
export default function LegalSheet({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter();

  function close() {
    if (window.history.length > 1) router.back(); // back to the page the visitor came from
    else router.push("/");
  }

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // the page behind does not scroll
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="legal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <section className="legal-sheet" role="dialog" aria-modal="true" aria-labelledby="legal-sheet-title">
        <div className="legal-sheet-head">
          <h1 id="legal-sheet-title">{title}</h1>
          <button type="button" className="legal-close" aria-label="Close" onClick={close}>&times;</button>
        </div>
        <div className="legal legal-sheet-body">{children}</div>
        <div className="legal-sheet-foot">
          <button type="button" className="btn-green" onClick={close}>Close</button>
        </div>
      </section>
    </div>
  );
}
