"use client";

import { useEffect, useState } from "react";
import { CATEGORIAS, type Item } from "@/lib/menu";
import { Comanda } from "./Comanda";
import { useComanda } from "./ComandaProvider";
import { IconeMais, IconeSacola } from "./Icones";
import styles from "./Cardapio.module.css";

function ItemLinha({ item, n, miniatura }: { item: Item; n: number; miniatura?: React.ReactNode }) {
  const { linhas, adicionar } = useComanda();
  const qty = linhas.find((l) => l.itemId === item.id)?.qty ?? 0;
  return (
    <li className={styles.item}>
      {miniatura ?? null}
      <div className={styles.itemCorpo}>
        <div className={styles.itemLinha}>
          <span className={styles.itemN} aria-hidden="true">
            {String(n).padStart(2, "0")}
          </span>
          <h4 className={styles.itemNome}>{item.nome}</h4>
          <span className={styles.leader} aria-hidden="true" />
          {qty > 0 ? (
            <span className={styles.qtd} aria-hidden="true">
              {qty}x
            </span>
          ) : null}
        </div>
        {item.desc ? <p className={styles.desc}>{item.desc}</p> : null}
      </div>
      <button
        type="button"
        className={styles.mais}
        aria-label={`Adicionar ${item.nome} à comanda${qty > 0 ? ` (${qty} na comanda)` : ""}`}
        onClick={() => adicionar(item.id)}
      >
        <IconeMais tamanho={22} strokeWidth={3} />
      </button>
    </li>
  );
}

function Abas() {
  const [ativa, setAtiva] = useState(CATEGORIAS[0]?.id);

  useEffect(() => {
    const secoes = CATEGORIAS.map((c) => document.getElementById(`cat-${c.id}`)).filter(
      (el): el is HTMLElement => !!el,
    );
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setAtiva(e.target.id.replace(/^cat-/, ""));
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    secoes.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <nav className={styles.abas} aria-label="Categorias do cardápio">
      <ul>
        {CATEGORIAS.map((c) => (
          <li key={c.id}>
            <a
              href={`#cat-${c.id}`}
              className={styles.aba}
              aria-current={ativa === c.id ? "true" : undefined}
              onClick={() => setAtiva(c.id)}
            >
              {c.nome}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Faixa da tela em que o cardápio "conta" como visível (barra da comanda × botão flutuante). */
export const MARGEM_CARDAPIO = "0px 0px -30% 0px";

/** `miniaturas`: imagens já renderizadas no servidor (Cardapio.tsx), por id do item. */
export function CardapioInterativo({ miniaturas = {} }: { miniaturas?: Record<string, React.ReactNode> }) {
  const { total, pulso, anuncio, setSheetAberto, sheetAberto } = useComanda();
  const [barraVisivel, setBarraVisivel] = useState(false);
  let n = 0;

  useEffect(() => {
    const menu = document.getElementById("cardapio-lista");
    if (!menu) return;
    const obs = new IntersectionObserver(([e]) => setBarraVisivel(e.isIntersecting), { rootMargin: MARGEM_CARDAPIO });
    obs.observe(menu);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={styles.grade}>
      <div id="cardapio-lista" className={styles.menu}>
        <Abas />
        {CATEGORIAS.map((c) => (
          <section key={c.id} id={`cat-${c.id}`} className={styles.categoria} aria-labelledby={`cat-${c.id}-titulo`}>
            <h3 id={`cat-${c.id}-titulo`} className={styles.catTitulo}>
              {c.nome}
            </h3>
            <ul className={styles.itens}>
              {c.itens.map((item) => (
                <ItemLinha key={item.id} item={item} n={++n} miniatura={miniaturas[item.id]} />
              ))}
            </ul>
          </section>
        ))}

        <div className={`so-js ${styles.barra} ${barraVisivel ? styles.barraVisivel : ""}`}>
          <button
            type="button"
            className={`btn btn-brasa ${styles.barraBotao}`}
            aria-haspopup="dialog"
            aria-expanded={sheetAberto}
            aria-controls="comanda"
            onClick={() => setSheetAberto(true)}
          >
            <IconeSacola />
            Ver comanda{" "}
            <span key={pulso} className={`${styles.selo} ${pulso > 0 ? styles.pula : ""}`}>
              ({total})
            </span>
          </button>
        </div>
      </div>

      <Comanda />

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {anuncio}
      </p>
    </div>
  );
}
