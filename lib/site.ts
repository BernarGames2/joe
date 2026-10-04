import { SITE_URL } from "./config";

/**
 * Base para URLs absolutas (Open Graph, JSON-LD). Usa o domínio próprio quando existir;
 * senão o endereço do deploy na Vercel; senão localhost (desenvolvimento).
 */
export function baseUrl(): string {
  if (SITE_URL) return SITE_URL.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : "http://localhost:3000";
}
