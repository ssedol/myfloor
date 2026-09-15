import type { MetadataRoute } from "next";
import { TIPS } from "@/content/tips";

const BASE_URL = "https://myfloor.website";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
    { path: "", priority: 1, changeFrequency: "monthly" },
    { path: "/guide", priority: 0.8, changeFrequency: "monthly" },
    { path: "/tips", priority: 0.8, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/install", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
  ];

  return [
    ...pages.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    ...TIPS.map((tip) => ({
      url: `${BASE_URL}/tips/${tip.slug}`,
      lastModified: new Date(tip.updated),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
