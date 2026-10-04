import menuData from "@/data/menu.json";

// O cardápio vem inteiro de data/menu.json: trocar o arquivo basta.
// `price` existe no JSON mas o site não exibe preço.
export type Item = {
  id: string;
  nome: string;
  desc?: string;
  price?: number | null;
  /** Caminho em /public (ex.: "/cardapio/joe-burger.jpg"). Sem foto, a linha não reserva espaço. */
  photo?: string | null;
  exemplo?: boolean;
};

export type Categoria = { id: string; nome: string; itens: Item[] };

export const CATEGORIAS: Categoria[] = (menuData as { categorias: Categoria[] }).categorias.filter(
  (c) => c.itens.length > 0,
);

export const ITENS: ReadonlyMap<string, Item> = new Map(
  CATEGORIAS.flatMap((c) => c.itens.map((i) => [i.id, i] as const)),
);
