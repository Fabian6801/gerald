"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "./logo";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const close = () => setOpen(false);

  const fullName = typeof user?.user_metadata?.full_name === "string" ? (user.user_metadata.full_name as string) : "";
  const label = fullName.split(" ")[0] || user?.email?.split("@")[0] || "Account";

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" onClick={close}>
          <Logo />
          <span className="brand-name">Gerard<br />Photo Studio</span>
        </Link>

        <nav id="site-nav" className={`nav-links${open ? " open" : ""}`} aria-label="Main">
          <Link href="/" onClick={close}>Home</Link>
          <Link href="/#gallery" onClick={close}>Portfolio</Link>
          <Link href="/services" onClick={close}>Services</Link>
          <Link href="/#about" onClick={close}>About</Link>
          <Link href="/#book" onClick={close}>Contact</Link>

          {/* Account links inside the phone menu */}
          {!loading && (user ? (
            <>
              <Link className="nav-auth-mobile" href="/account" onClick={close}>My account ({label})</Link>
              <Link className="nav-auth-mobile" href="/logout" onClick={close}>Log out</Link>
            </>
          ) : (
            <>
              <Link className="nav-auth-mobile" href="/login" onClick={close}>Log in</Link>
              <Link className="nav-auth-mobile" href="/signup" onClick={close}>Sign up</Link>
            </>
          ))}
        </nav>

        <div className="nav-actions">
          {/* Account links on a computer */}
          <div className="nav-auth">
            {!loading && (user ? (
              <>
                <Link href="/account" className="nav-user"><i className="fa-regular fa-circle-user" aria-hidden="true"></i> {label}</Link>
                <Link href="/logout">Log out</Link>
              </>
            ) : (
              <>
                <Link href="/login">Log in</Link>
                <Link href="/signup" className="nav-signup">Sign up</Link>
              </>
            ))}
          </div>

          <button id="theme-toggle" className="icon-btn" type="button" aria-label="Toggle dark and light mode" onClick={toggleTheme}>
            <svg className="icon-moon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
            <svg className="icon-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </button>
          <Link className="btn-green" href="/book" onClick={close}>Book Now</Link>
          <button type="button" className="menu-btn" aria-label="Menu" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
