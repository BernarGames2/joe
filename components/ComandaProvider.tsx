"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ITENS } from "@/lib/menu";
import type { Modo } from "@/lib/whatsapp";

export const MAX_POR_LINHA = 20;
const CHAVE = "joe-comanda-v1";

export type Linha = { itemId: string; qty: number; obs: string };

type Estado = {
  linhas: Linha[];
  nome: string;
  modo: Modo;
  endereco: string;
  /** A comanda já foi mandada pro WhatsApp e não mudou desde então. */
  enviada: boolean;
};

type Acao =
  | { tipo: "carregar"; estado: Partial<Estado> }
  | { tipo: "adicionar"; itemId: string }
  | { tipo: "qty"; itemId: string; qty: number }
  | { tipo: "obs"; itemId: string; obs: string }
  | { tipo: "campo"; campo: "nome" | "endereco"; valor: string }
  | { tipo: "modo"; modo: Modo }
  | { tipo: "enviada" }
  | { tipo: "limpar" };

const VAZIO: Estado = { linhas: [], nome: "", modo: "retirada", endereco: "", enviada: false };

function reducer(s: Estado, a: Acao): Estado {
  switch (a.tipo) {
    case "carregar":
      return { ...s, ...a.estado };
    case "adicionar": {
      const existe = s.linhas.find((l) => l.itemId === a.itemId);
      const linhas = existe
        ? s.linhas.map((l) => (l.itemId === a.itemId ? { ...l, qty: Math.min(MAX_POR_LINHA, l.qty + 1) } : l))
        : [...s.linhas, { itemId: a.itemId, qty: 1, obs: "" }];
      return { ...s, linhas, enviada: false };
    }
    case "qty": {
      const qty = Math.min(MAX_POR_LINHA, a.qty);
      const linhas =
        qty <= 0 ? s.linhas.filter((l) => l.itemId !== a.itemId) : s.linhas.map((l) => (l.itemId === a.itemId ? { ...l, qty } : l));
      return { ...s, linhas, enviada: false };
    }
    case "obs":
      return { ...s, linhas: s.linhas.map((l) => (l.itemId === a.itemId ? { ...l, obs: a.obs } : l)), enviada: false };
    case "campo":
      return { ...s, [a.campo]: a.valor, enviada: false };
    case "modo":
      return { ...s, modo: a.modo, enviada: false };
    case "enviada":
      return { ...s, enviada: true };
    case "limpar":
      return { ...VAZIO, nome: s.nome, modo: s.modo, endereco: s.endereco };
  }
}

/** Lê o que ficou salvo, descartando itens que saíram do cardápio. Nunca lança. */
function lerSalvo(): Partial<Estado> | null {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const d = JSON.parse(bruto) as Partial<Estado>;
    const linhas = Array.isArray(d.linhas)
      ? d.linhas
          .filter((l): l is Linha => !!l && typeof l.itemId === "string" && ITENS.has(l.itemId) && Number.isFinite(l.qty))
          .map((l) => ({
            itemId: l.itemId,
            qty: Math.max(1, Math.min(MAX_POR_LINHA, Math.round(l.qty))),
            obs: typeof l.obs === "string" ? l.obs : "",
          }))
      : [];
    return {
      linhas,
      nome: typeof d.nome === "string" ? d.nome : "",
      modo: d.modo === "entrega" ? "entrega" : "retirada",
      endereco: typeof d.endereco === "string" ? d.endereco : "",
      enviada: d.enviada === true && linhas.length > 0,
    };
  } catch {
    return null;
  }
}

type Valor = Estado & {
  total: number;
  adicionar: (itemId: string) => void;
  mudarQty: (itemId: string, qty: number) => void;
  remover: (itemId: string) => void;
  mudarObs: (itemId: string, obs: string) => void;
  mudarCampo: (campo: "nome" | "endereco", valor: string) => void;
  mudarModo: (modo: Modo) => void;
  marcarEnviada: () => void;
  limpar: () => void;
  /** Item adicionado por último nesta visita (para a linha "se escrever"). */
  recem: string | null;
  /** Conta as adições, para o selo da barra dar um pulinho. */
  pulso: number;
  anuncio: string;
  anunciar: (texto: string) => void;
  sheetAberto: boolean;
  setSheetAberto: (v: boolean) => void;
  /** Abre a comanda: bottom sheet no celular, rola até o painel no desktop. */
  abrirComanda: () => void;
};

const Ctx = createContext<Valor | null>(null);

export const DESKTOP = "(min-width: 1024px)";

export function ComandaProvider({ children }: { children: React.ReactNode }) {
  const [estado, dispatch] = useReducer(reducer, VAZIO);
  const [carregado, setCarregado] = useState(false);
  const [recem, setRecem] = useState<string | null>(null);
  const [pulso, setPulso] = useState(0);
  const [anuncio, setAnuncio] = useState("");
  const [sheetAberto, setSheetAberto] = useState(false);
  const alterna = useRef(false);

  useEffect(() => {
    const salvo = lerSalvo();
    if (salvo) dispatch({ tipo: "carregar", estado: salvo });
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch {
      // Sem localStorage (aba anônima, bloqueio): a comanda só não sobrevive ao recarregar.
    }
  }, [estado, carregado]);

  const anunciar = useCallback((texto: string) => {
    // Alterna um espaço invisível para o leitor de tela repetir avisos iguais.
    alterna.current = !alterna.current;
    setAnuncio(texto + (alterna.current ? " " : ""));
  }, []);

  const estadoRef = useRef(estado);
  estadoRef.current = estado;

  const adicionar = useCallback(
    (itemId: string) => {
      const item = ITENS.get(itemId);
      if (!item) return;
      const atual = estadoRef.current.linhas.find((l) => l.itemId === itemId);
      if (atual && atual.qty >= MAX_POR_LINHA) {
        anunciar(`Máximo de ${MAX_POR_LINHA} ${item.nome} por comanda.`);
        return;
      }
      dispatch({ tipo: "adicionar", itemId });
      if (!atual) setRecem(itemId);
      setPulso((p) => p + 1);
      anunciar(atual ? `${item.nome}: ${atual.qty + 1} na comanda.` : `${item.nome} adicionado à comanda.`);
    },
    [anunciar],
  );

  const mudarQty = useCallback(
    (itemId: string, qty: number) => {
      const nome = ITENS.get(itemId)?.nome ?? "Item";
      dispatch({ tipo: "qty", itemId, qty });
      anunciar(qty <= 0 ? `${nome} removido da comanda.` : `${nome}: ${Math.min(qty, MAX_POR_LINHA)} na comanda.`);
    },
    [anunciar],
  );

  const abrirComanda = useCallback(() => {
    if (window.matchMedia(DESKTOP).matches) {
      const painel = document.getElementById("comanda");
      painel?.scrollIntoView({ block: "start" });
      document.getElementById("comanda-titulo")?.focus({ preventScroll: true });
    } else {
      setSheetAberto(true);
    }
  }, []);

  const valor = useMemo<Valor>(
    () => ({
      ...estado,
      total: estado.linhas.reduce((n, l) => n + l.qty, 0),
      adicionar,
      mudarQty,
      remover: (itemId) => mudarQty(itemId, 0),
      mudarObs: (itemId, obs) => dispatch({ tipo: "obs", itemId, obs }),
      mudarCampo: (campo, v) => dispatch({ tipo: "campo", campo, valor: v }),
      mudarModo: (modo) => dispatch({ tipo: "modo", modo }),
      marcarEnviada: () => dispatch({ tipo: "enviada" }),
      limpar: () => {
        dispatch({ tipo: "limpar" });
        setRecem(null);
        anunciar("Comanda limpa.");
      },
      recem,
      pulso,
      anuncio,
      anunciar,
      sheetAberto,
      setSheetAberto,
      abrirComanda,
    }),
    [estado, adicionar, mudarQty, recem, pulso, anuncio, anunciar, sheetAberto, abrirComanda],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useComanda(): Valor {
  const v = useContext(Ctx);
  if (!v) throw new Error("useComanda fora do ComandaProvider");
  return v;
}
