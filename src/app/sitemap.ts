import type {MetadataRoute} from "next";
import {SITE_URL} from "@/utils/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      path: "/",
      priority: 1,
    },
    {
      path: "/editor",
      priority: 0.9,
    },
  ] as const;

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
