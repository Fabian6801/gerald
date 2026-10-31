// ONE PLACE FOR YOUR BUSINESS DETAILS.
// Fill in a value to show it on the website. Leave it as "" and it stays hidden,
// so visitors never see an empty or "to do" placeholder.
export const site = {
  name: "Gerard Photo Studio",
  owner: "Kim Gerard",
  tagline: "Wedding, portrait & events photography — elegant, timeless, natural",
  description:
    "Weddings, portraits, fashion, commercial, travel and event photography by Kim Gerard.",

  // Contact
  city: "Gihanga",
  countryCode: "BI",
  location: "Gihanga, Burundi",
  phone: "+257 69270296",
  whatsapp: "25769270296", // digits only, with the country code, no +
  email: "mfuranzimagerard028@gmail.com",

  // Public address of the site. After deploying, set NEXT_PUBLIC_SITE_URL on Vercel
  // to your domain (for example https://gerardphotostudio.com).
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  // Full web addresses of your social pages. "" hides that icon.
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
  },

  // About section, FAQ and Terms. "" hides the line.
  story: "", // a paragraph about you: how you started, your style, experience
  hours: "", // e.g. "Mon to Fri 9:00 to 18:00, Sat 10:00 to 16:00"
  onLocation: "", // e.g. "Yes, a travel fee applies beyond 20 km"
  deposit: "", // e.g. "30% to confirm your date"
  payment: "", // e.g. "Mobile money, bank transfer or cash"
  turnaround: "", // e.g. "14 days for edited photos"
  leadTime: "", // e.g. "For weddings, book at least 3 months ahead."
  originals: "", // your policy on original / full-resolution files
  cancellation: "", // your reschedule and cancellation terms
  liability: "", // your liability terms (have these checked by a professional)
  responseTime: "", // e.g. "within 24 hours". Shown under the booking form.

  // Legal pages
  retention: "", // e.g. "24 months" (how long booking details are kept)
  lastUpdated: "", // e.g. "October 2026"
};

export const waLink = (text = "Hello, I would like to book a session") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;