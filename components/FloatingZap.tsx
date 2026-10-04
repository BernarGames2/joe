"use client";

import { useEffect, useState } from "react";
import { URL_ZAP_SIMPLES } from "@/lib/links";
import { MARGEM_CARDAPIO } from "./CardapioInterativo";
import { useComanda } from "./ComandaProvider";
import { IconeZap } from "./Icones";
import styles from "./FloatingZap.module.css";

/**
 * Botão flutuante do celular. Aparece depois do hero e some enquanto a lista do cardápio
 * (que tem a barra "Ver comanda") está na tela. Com itens, abre a comanda.
 */
export function FloatingZap() {
  const { total, abrirComanda, pulso } = useComanda();
  const [depoisDoHero, setDepoisDoHero] = useState(false);
  const [noCardapio, setNoCardapio] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const cardapio = document.getElementById("cardapio-lista");
    if (!hero || !cardapio) return;
    const obsHero = new IntersectionObserver(([e]) => setDepoisDoHero(!e.isIntersecting && e.boundingClientRect.top < 0));
    const obsCard = new IntersectionObserver(([e]) => setNoCardapio(e.isIntersecting), {
      rootMargin: MARGEM_CARDAPIO,
    });
    obsHero.observe(hero);
    obsCard.observe(cardapio);
    return () => {
      obsHero.disconnect();
      obsCard.disconnect();
    };
  }, []);

  const visivel = depoisDoHero && !noCardapio;

  return (
    <a
      href={URL_ZAP_SIMPLES}
      target="_blank"
      rel="noopener noreferrer"
      className={`so-js ${styles.botao} ${visivel ? styles.visivel : ""}`}
      aria-label={total > 0 ? `Abrir comanda (${total} ${total === 1 ? "item" : "itens"})` : "Pedir no WhatsApp"}
      onClick={(e) => {
        if (total > 0) {
          e.preventDefault();
          abrirComanda();
        }
      }}
    >
      <IconeZap tamanho={28} />
      {total > 0 ? (
        <span key={pulso} className={styles.selo}>
          {total}
        </span>
      ) : null}
    </a>
  );
}
