// Mensagens do WhatsApp. Funções puras (testadas em whatsapp.test.ts).

export type Modo = "retirada" | "entrega";

export type LinhaPedido = { nome: string; qty: number; obs: string };

export const MENSAGEM_SIMPLES = "Olá, Joe Burger! Vim pelo site e queria fazer um pedido.";

/** Junta espaços e quebras de linha num texto de uma linha só. */
function umaLinha(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export function mensagemComanda(p: {
  linhas: LinhaPedido[];
  nome: string;
  modo: Modo;
  endereco: string;
}): string {
  const itens = p.linhas.map((l) => {
    const obs = umaLinha(l.obs);
    return `${l.qty}x ${l.nome}${obs ? ` — obs: ${obs}` : ""}`;
  });
  const partes = [
    "Olá, Joe Burger! Quero fazer um pedido:",
    "",
    ...itens,
    "",
    `Nome: ${umaLinha(p.nome)}`,
    p.modo === "entrega" ? "Entrega" : "Retirada",
  ];
  if (p.modo === "entrega") partes.push(`Endereço: ${umaLinha(p.endereco)}`);
  partes.push("", "Pode confirmar valor e tempo? Obrigado!");
  return partes.join("\n");
}

export function urlWhatsApp(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
