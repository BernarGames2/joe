"use client";

import { useCallback, useRef, useState } from "react";
import { TEL, TEL_EXIBICAO } from "@/lib/config";
import { IconeFechar, IconeMenu, IconeTelefone, IconeZap } from "./Icones";
import { LINKS_NAV } from "./nav";
import { useDialogo } from "./useDialogo";
import { ZapLink } from "./ZapLink";
import styles from "./MenuMobile.module.css";

export function MenuMobile() {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const fechar = useCallback(() => setAberto(false), []);
  useDialogo(ref, aberto, fechar);

  return (
    <>
      <button
        type="button"
        className={`so-js ${styles.botao}`}
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        aria-label="Abrir menu"
        onClick={() => setAberto(true)}
      >
        <IconeMenu tamanho={24} />
      </button>
      <div
        id="menu-mobile"
        ref={ref}
        className={styles.overlay}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!aberto}
      >
        <div className={styles.topo}>
          <span className={styles.titulo}>JOE BURGER</span>
          <button type="button" className={styles.botao} aria-label="Fechar menu" onClick={fechar} data-foco-inicial>
            <IconeFechar tamanho={24} />
          </button>
        </div>
        <nav aria-label="Menu do celular">
          <ul className={styles.links}>
            {LINKS_NAV.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => {
                    if (ref.current) ref.current.dataset.irPara = l.href;
                    fechar();
                  }}
                >
                  {l.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.rodape}>
          <ZapLink className="btn btn-zap">
            <IconeZap />
            Pedir no Zap
          </ZapLink>
          <a className="btn btn-borda-giz" href={`tel:${TEL}`}>
            <IconeTelefone />
            {TEL_EXIBICAO}
          </a>
        </div>
      </div>
    </>
  );
}
