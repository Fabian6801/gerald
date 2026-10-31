import Link from "next/link";
import Year from "./Year";
import { CookieSettingsButton } from "./CookieBanner";
import { site } from "@/app/lib/site";

const socials = [
  { key: "instagram", cls: "ig", icon: "fa-instagram", label: "Instagram" },
  { key: "facebook", cls: "fb", icon: "fa-facebook-f", label: "Facebook" },
  { key: "tiktok", cls: "tt", icon: "fa-tiktok", label: "TikTok" },
  { key: "youtube", cls: "yt", icon: "fa-youtube", label: "YouTube" },
] as const;

export default function Footer() {
  const tel = site.phone.replace(/[^+\d]/g, "");
  const links = socials.filter((s) => site.social[s.key]);

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-line">
          <span>&copy; <Year /> {site.name}</span>
          {site.location && (<><span>&bull;</span><span>{site.location}</span></>)}
          {site.phone && (<><span>&bull;</span><a href={`tel:${tel}`}>{site.phone}</a></>)}
          {site.email && (<><span>&bull;</span><a href={`mailto:${site.email}`}>{site.email}</a></>)}
        </div>

        {links.length > 0 && (
          <div className="social">
            {links.map((s) => (
              <a key={s.key} href={site.social[s.key]} className={s.cls} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                <i className={`fa-brands ${s.icon}`}></i>
              </a>
            ))}
          </div>
        )}

        <div className="footer-line">
          <span>All photographs &copy; {site.owner}</span>
          <span>&bull;</span>
          <Link href="/privacy">Privacy</Link>
          <span>&bull;</span>
          <Link href="/terms">Terms</Link>
          <span>&bull;</span>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
