"use client";

import { HORARIO } from "@/lib/config";
import { tabelaHorario } from "@/lib/horario";
import { useStatus } from "./StatusProvider";
import styles from "./ComoChegar.module.css";

const LINHAS = tabelaHorario(HORARIO);

export function TabelaHorario() {
  const { agora } = useStatus();
  return (
    <table className={styles.tabela}>
      <caption className="sr-only">Horário de funcionamento</caption>
      <tbody>
        {LINHAS.map((l) => {
          const hoje = l.dia === agora.dia;
          return (
            <tr key={l.dia} className={hoje ? styles.hoje : undefined} aria-current={hoje ? "date" : undefined}>
              <th scope="row" suppressHydrationWarning>
                {l.nome}
                {hoje ? <span className={styles.selo}>hoje</span> : null}
              </th>
              <td className={l.fechado ? styles.fechado : undefined}>{l.texto}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
