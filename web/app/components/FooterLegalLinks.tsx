"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PrivacyContent, TermsContent } from "@/app/components/LegalContent";

type Kind = "terms" | "privacy";

// The "Privacy" and "Terms" links in the footer. A normal click opens the text in a rounded pop-up
// on top of the page the visitor is already on. Ctrl/Cmd-click still opens the full page.
export default function FooterLegalLinks() {
  const ref = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<Kind | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (kind && !dialog.open) dialog.showModal();
    if (!kind && dialog.open) dialog.close();
  }, [kind]);

  function open(e: React.MouseEvent<HTMLAnchorElement>, which: Kind) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setKind(which);
  }

  return (
    <>
      <Link href="/privacy" onClick={(e) => open(e, "privacy")}>Privacy</Link>
      <span>&bull;</span>
      <Link href="/terms" onClick={(e) => open(e, "terms")}>Terms</Link>

      <dialog
        ref={ref}
        className="legal-dialog"
        aria-labelledby="footer-legal-title"
        onClose={() => setKind(null)}
        onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close(); }}
      >
        <div className="legal-dialog-head">
          <h2 id="footer-legal-title">{kind === "privacy" ? "Privacy Policy" : "Terms & Licensing"}</h2>
          <button type="button" className="legal-close" aria-label="Close" onClick={() => ref.current?.close()}>&times;</button>
        </div>
        <div className="legal legal-dialog-body">
          {kind === "privacy" ? <PrivacyContent /> : <TermsContent />}
        </div>
        <div className="legal-dialog-foot">
          <button type="button" className="btn-green" onClick={() => ref.current?.close()}>Close</button>
        </div>
      </dialog>
    </>
  );
}
