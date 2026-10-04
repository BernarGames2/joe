// Definido em next.config.ts no build: "1" quando public/brand/logo-joe.png existe.
export const TEM_LOGO = process.env.TEM_LOGO === "1";
export const LOGO_SRC = "/brand/logo-joe.png";
/** Tamanho do arquivo fornecido (135x130). Trocar se o original tiver outra proporção. */
export const LOGO_W = 135;
export const LOGO_H = 130;
