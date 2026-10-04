"use client";

import { CATEGORIAS } from "@/lib/menu";
import { dataHora, useStatus } from "./StatusProvider";
import styles from "./Hero.module.css";

/** Comanda decorativa do hero: cabeçalho, hora do Brasil e os 2 primeiros itens do cardápio. */
export function HeroComanda() {
  const { ms } = useStatus();
  const { data, hora } = dataHora(ms);
  const itens = CATEGORIAS.flatMap((c) => c.itens).slice(0, 2);
  return (
    <div className={`sombra-papel ${styles.comandaWrap}`} aria-hidden="true">
      <div className={`papel serrilhado ${styles.comanda}`}>
        <p className={styles.comandaTopo}>COMANDA Nº 001 — JOE BURGER</p>
        <p className={styles.comandaHora} suppressHydrationWarning>
          {data} · {hora}
        </p>
        <ul className={styles.comandaLinhas}>
          {itens.map((i) => (
            <li key={i.id}>
              <span className={styles.comandaItem}>1x {i.nome.toUpperCase()}</span>
              <span className={styles.pontilhado} />
              <span className={styles.ok}>ok</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
