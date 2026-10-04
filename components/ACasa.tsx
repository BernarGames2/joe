import { HORARIO, IFOOD_URL, SHOW_FAMILY } from "@/lib/config";
import { resumoDias } from "@/lib/horario";
import { Hamburguer } from "./Hamburguer";
import styles from "./ACasa.module.css";

export function ACasa() {
  return (
    <section id="casa" className={`secao ${styles.secao}`} aria-labelledby="casa-titulo">
      <div className={`container ${styles.grade}`}>
        <div className={styles.texto}>
          <p className="eyebrow">A casa</p>
          <h2 id="casa-titulo" className="titulo-secao">
            HAMBÚRGUER ARTESANAL, FEITO NA CHAPA, NO BAIRRO.
          </h2>
          <p className={styles.corpo}>
            O Joe Burger fica na Santa Mônica e atende {resumoDias(HORARIO)}.
            {IFOOD_URL ? " Você pode pedir pelo site, pelo WhatsApp ou pelo iFood." : null}
            {SHOW_FAMILY ? " É negócio de família." : null}
          </p>
        </div>
        <div className={styles.arte}>
          <Hamburguer variante="desmontado" idBase="casa" />
        </div>
      </div>
    </section>
  );
}
