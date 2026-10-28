import "./globals.css";
import Header from "./components/header";
import Footer from "./components/Footer";
import { assets } from "@/app/lib/assets";

;export const metadata = {
  title: "Kim Gerard | Gerard Photo Studio",
  description:
    "Weddings, portraits, fashion, commercial, travel and event photography by Kim Gerard.",
  icons: { icon: assets.icon, apple: assets.appleIcon },
};

const themeScript = `try{var t=localStorage.getItem("theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning datascrolling-behaviour="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body id="top">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}