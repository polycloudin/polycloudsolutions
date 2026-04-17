import type { MetadataRoute } from "next";
import { posts } from "./blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://polycloud.in";
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/digital`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/consulting`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/solutions/ca-firm`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/solutions/d2c`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/solutions/local-business`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
