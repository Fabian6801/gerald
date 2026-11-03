"use client";
import { useEffect, useRef } from "react";
import { PrivacyContent, TermsContent } from "@/app/components/LegalContent";

export type LegalKind = "terms" | "privacy";

// Shows the Terms or the Privacy Policy on top of the page, so the visitor never leaves the form.
// Closes with the round X, the green button, the Escape key, or a click outside.
export default function LegalPopup({ which, onClose }: { which: LegalKind | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (which && !dialog.open) dialog.showModal();
    if (!which && dialog.open) dialog.close();
  }, [which]);

  return (
    <dialog
      ref={ref}
      className="legal-dialog"
      aria-labelledby="legal-popup-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close(); }}
    >
      <div className="legal-dialog-head">
        <h2 id="legal-popup-title">{which === "privacy" ? "Privacy Policy" : "Terms & Licensing"}</h2>
        <button type="button" className="legal-close" aria-label="Close" onClick={() => ref.current?.close()}>&times;</button>
      </div>
      <div className="legal legal-dialog-body">
        {which === "privacy" ? <PrivacyContent /> : <TermsContent />}
      </div>
      <div className="legal-dialog-foot">
        <button type="button" className="btn-green" onClick={() => ref.current?.close()}>
          Close and return to the form
        </button>
      </div>
    </dialog>
  );
}
