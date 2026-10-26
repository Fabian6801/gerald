"use client";
import { useEffect, useRef, useState } from "react";

const KEY = "cookie-consent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="link-btn"
      onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
    >
      Cookie settings
    </button>
  );
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
    const reopen = () => setOpen(true);
    window.addEventListener("open-cookie-settings", reopen);
    return () => window.removeEventListener("open-cookie-settings", reopen);
  }, []);

  // Freeze page scrolling while the popup is open, and focus the first button
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    acceptRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function choose(value: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="cookie-overlay">
      <div
        className="cookie-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-title"
      >
        <h2 id="cookie-title">We value your privacy</h2>
        <p>
          This site stores small pieces of data in your browser, such as your light or dark
          theme and this choice. Accepting allows optional cookies, such as analytics, if we
          add them. Declining keeps only what the site needs to work.
        </p>
        <p>
          Read our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>.
        </p>
        <div className="cookie-actions">
          <button ref={acceptRef} type="button" className="btn-green" onClick={() => choose("accepted")}>
            Accept
          </button>
          <button type="button" className="btn-outline" onClick={() => choose("declined")}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}