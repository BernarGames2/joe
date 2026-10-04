import Image from "next/image";
import { LOGO_H, LOGO_SRC, LOGO_W, TEM_LOGO } from "@/lib/brand";

/**
 * Logo da casa, sempre recortado em círculo. Arquivo fornecido: public/brand/logo-joe.png.
 * Sem o arquivo, não renderiza nada (o nome em texto ao lado segura a marca).
 * Limites: mínimo 44px, máximo 96px (o arquivo é pequeno).
 */
export function Logo({ tamanho, preload = false, alt = "" }: { tamanho: number; preload?: boolean; alt?: string }) {
  if (!TEM_LOGO) return null;
  const px = Math.max(44, Math.min(96, tamanho));
  return (
    <Image
      src={LOGO_SRC}
      width={LOGO_W}
      height={LOGO_H}
      alt={alt}
      sizes={`${px}px`}
      preload={preload}
      // Arquivo minúsculo: carrega já, para nunca aparecer um círculo vazio esperando o lazy-load.
      loading={preload ? undefined : "eager"}
      style={{ width: px, height: px, borderRadius: "50%", objectFit: "cover", flex: "none" }}
    />
  );
}
