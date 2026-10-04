import type { NextConfig } from "next";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// O logo entra trocando o arquivo; sem ele, o site mostra só o nome em texto.
const temLogo = existsSync(join(process.cwd(), "public/brand/logo-joe.png"));
if (!temLogo) {
  console.warn("[joe] AVISO: public/brand/logo-joe.png não encontrado — header e rodapé ficam só com o nome em texto.");
}

type MenuJson = { categorias: { itens: { exemplo?: boolean }[] }[] };
const menu = JSON.parse(readFileSync(join(process.cwd(), "data/menu.json"), "utf8")) as MenuJson;
if (menu.categorias.some((c) => c.itens.some((i) => i.exemplo))) {
  console.warn(
    "[joe] AVISO: menu com itens de exemplo — substituir pelo cardápio real antes de publicar para o cliente final",
  );
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { TEM_LOGO: temLogo ? "1" : "" },
  images: { formats: ["image/avif", "image/webp"] },
  // ~10 KB de CSS: vai inline no HTML e a primeira pintura não espera outra requisição.
  experimental: { inlineCss: true },
};

export default nextConfig;
