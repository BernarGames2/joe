import { ENDERECO, IFOOD_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL, MAPS_URL, TEL } from "@/lib/config";
import { URL_ZAP_SIMPLES } from "@/lib/links";
import { IconeInstagram, IconePin, IconeSacola, IconeSeta, IconeTelefone, IconeZap } from "./Icones";
import { TabelaHorario } from "./TabelaHorario";
import styles from "./ComoChegar.module.css";

export function ComoChegar() {
  return (
    <section id="como-chegar" className={`secao ${styles.secao}`} aria-labelledby="como-chegar-titulo">
      <div className="container">
        <h2 id="como-chegar-titulo" className="titulo-secao">
          COMO CHEGAR
        </h2>
        <div className={styles.grade}>
          <div className={styles.endereco}>
            <IconePin tamanho={40} className={styles.pin} />
            <address className={styles.address}>
              <span className={styles.rua}>{ENDERECO.rua}</span>
              <span>
                {ENDERECO.bairro} · {ENDERECO.cidade}/{ENDERECO.uf}
              </span>
              <span className="mono">CEP {ENDERECO.cep}</span>
            </address>
            <a href={MAPS_URL} target="_blank" rel="noopener" className="btn btn-brasa">
              Abrir no Maps
              <IconeSeta />
            </a>
          </div>

          <div className={styles.horarios}>
            <h3 className={styles.subtitulo}>Horários</h3>
            <TabelaHorario />
            <p className={`nota-mono ${styles.nota}`}>Horários conforme o Google Maps. Em feriados, confirme no WhatsApp.</p>
          </div>
        </div>

        <ul className={styles.botoes}>
          <li>
            <a href={URL_ZAP_SIMPLES} target="_blank" rel="noopener noreferrer" className="btn btn-zap">
              <IconeZap />
              Chamar no WhatsApp
            </a>
          </li>
          <li>
            <a href={`tel:${TEL}`} className="btn btn-borda-giz">
              <IconeTelefone />
              Ligar
            </a>
          </li>
          <li>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="btn btn-borda-giz">
              <IconeInstagram />
              Instagram {INSTAGRAM_HANDLE}
            </a>
          </li>
          {IFOOD_URL ? (
            <li>
              <a href={IFOOD_URL} target="_blank" rel="noopener" className="btn btn-borda-giz">
                <IconeSacola />
                iFood
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}
