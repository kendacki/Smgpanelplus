import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/services",
    "/blog",
    "/about",
    "/contact",
    "/faq",
    "/child-panel",
    "/api-docs",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
