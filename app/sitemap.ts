import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

// Sem domínio definido, o sitemap sai vazio (não publica host provisório).
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) return [];
  return [{ url: SITE_URL, changeFrequency: "monthly", priority: 1 }];
}
