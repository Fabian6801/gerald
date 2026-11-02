import type { MetadataRoute } from "next";
import { site } from "@/app/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/account", "/logout", "/reset-password"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}