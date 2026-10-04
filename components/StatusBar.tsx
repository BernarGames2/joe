"use client";

import { TEL, TEL_EXIBICAO } from "@/lib/config";
import { textoStatus } from "@/lib/horario";
import { useStatus } from "./StatusProvider";
import styles from "./StatusBar.module.css";

export function StatusBar() {
  const { status } = useStatus();
  const { titulo, detalhe } = textoStatus(status);
  return (
    <div className={styles.barra}>
      <div className={`container ${styles.dentro}`}>
        <p className={styles.status} role="status">
          <span className={`${styles.ponto} ${status.aberto ? styles.aceso : ""}`} aria-hidden="true" />
          <span suppressHydrationWarning>
            <strong>{titulo}</strong> · {detalhe}
          </span>
        </p>
        <a className={styles.tel} href={`tel:${TEL}`}>
          {TEL_EXIBICAO}
        </a>
      </div>
    </div>
  );
}
