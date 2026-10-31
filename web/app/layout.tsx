import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Header from "@/app/components/header";
import Footer from "@/app/components/Footer";
import CookieBanner from "@/app/components/CookieBanner";
import { assets } from "@/app/lib/assets";
import { site, waLink } from "@/app/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const fullTitle = `${site.owner} | ${site.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: fullTitle, template: `%s | ${site.name}` },
  description: site.description,
  icons: { icon: assets.icon, apple: assets.appleIcon },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: fullTitle,
    description: site.description,
    images: [{ url: assets.hero, width: 1600, height: 900, alt: `${site.name}: wedding and portrait photography` }],
  },
  twitter: { card: "summary_large_image", title: fullTitle, description: site.description, images: [assets.hero] },
};

// Helps Google show the studio properly in search results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  image: assets.hero,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.countryCode },
  sameAs: Object.values(site.social).filter(Boolean),
};

const themeScript = `try{var t=localStorage.getItem("theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={poppins.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body id="top">
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CookieBanner />

        <a
          className="whatsapp-float"
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
        >
          <i className="fa-brands fa-whatsapp"></i>
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
