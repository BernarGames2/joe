// Dados da casa. Tudo que muda (horário, links, flags) mora aqui e só aqui.
// Itens marcados "a confirmar" dependem da dona antes de publicar.

/** Número do WhatsApp (link da bio do Instagram: wa.link/o44gv7 → 55 34 3234-3651). */
export const WHATSAPP = "553432343651";
export const TEL = "+553432343651";
export const TEL_EXIBICAO = "(34) 3234-3651";

export const NOME = "Joe Burger Artesanal";
export const INSTAGRAM_HANDLE = "@joeburguerartesanal";
export const INSTAGRAM_URL = "https://www.instagram.com/joeburguerartesanal/";
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Joe+Burger+Artesanal+Uberl%C3%A2ndia&query_place_id=ChIJW8FJQGBFpJQRn8daxQhun_Y";

/** Link do iFood (a confirmar). Vazio = botão e menção ao iFood ficam ocultos. */
export const IFOOD_URL: string = "";

/** "Negócio de família" (a confirmar com a dona). */
export const SHOW_FAMILY: boolean = false;

/** Domínio próprio. Vazio = sem canonical e sitemap sem host. */
export const SITE_URL: string = "";

export const ENDERECO = {
  rua: "Rua Antônio Marciano de Ávila, 1523",
  bairro: "Santa Mônica",
  cidade: "Uberlândia",
  uf: "MG",
  cep: "38408-244",
} as const;

/** Nota pública no Google, com a data da consulta. Conferir antes de republicar. */
export const GOOGLE = {
  nota: "4,9",
  avaliacoes: 446,
  consulta: "03/10/2026",
} as const;

/** Avaliações reais do Google (a dona aprova antes de publicar). */
export const AVALIACOES = [
  { texto: "Melhor hambúrguer de Uberlândia, a dona é muito simpática", autor: "Meurys M." },
  { texto: "Atendimento rápido e é muito gostoso.", autor: "Thayna B." },
  { texto: "Hambúrguer de qualidade, rápida entrega.", autor: "Cristiano G." },
] as const;

export const TIMEZONE = "America/Sao_Paulo";

/**
 * Horário (Google Maps; a confirmar: o Instagram fala em "a partir das 19h").
 * Minutos desde 00:00 no dia em que a janela COMEÇA. Janela = [início, fim).
 * Fim acima de 1440 = passa da meia-noite (1500 = 01:00 do dia seguinte).
 * 0 = domingo … 6 = sábado.
 */
export const HORARIO: Readonly<Record<number, readonly (readonly [number, number])[]>> = {
  0: [[1080, 1440]], // dom 18:00–24:00
  1: [], // seg fechado
  2: [[1080, 1440]], // ter
  3: [[1080, 1440]], // qua
  4: [[1080, 1440]], // qui
  5: [[1080, 1500]], // sex 18:00–01:00
  6: [[1080, 1500]], // sáb 18:00–01:00
};
