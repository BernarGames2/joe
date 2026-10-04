import { ENDERECO, HORARIO, IFOOD_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL, MAPS_URL, NOME, TEL, TEL_EXIBICAO } from "@/lib/config";
import { resumoHorarios } from "@/lib/horario";
import { URL_ZAP_SIMPLES } from "@/lib/links";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grade}`}>
        <div className={styles.marca}>
          <Logo tamanho={56} />
          <p className={styles.nome}>{NOME}</p>
        </div>

        <div className={styles.bloco}>
          <h2 className={styles.rotulo}>Endereço</h2>
          <p>
            {ENDERECO.rua}
            <br />
            {ENDERECO.bairro} · {ENDERECO.cidade}/{ENDERECO.uf}
            <br />
            CEP {ENDERECO.cep}
          </p>
        </div>

        <div className={styles.bloco}>
          <h2 className={styles.rotulo}>Horários</h2>
          <ul>
            {resumoHorarios(HORARIO).map((h) => (
              <li key={h.dias}>
                <span className={styles.dias}>{h.dias.charAt(0).toUpperCase() + h.dias.slice(1)}</span> · {h.texto}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.bloco}>
          <h2 className={styles.rotulo}>Contato</h2>
          <ul className={styles.links}>
            <li>
              <a href={URL_ZAP_SIMPLES} target="_blank" rel="noopener noreferrer">
                WhatsApp {TEL_EXIBICAO}
              </a>
            </li>
            <li>
              <a href={`tel:${TEL}`}>Ligar</a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener">
                Instagram {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>
              <a href={MAPS_URL} target="_blank" rel="noopener">
                Google Maps
              </a>
            </li>
            {IFOOD_URL ? (
              <li>
                <a href={IFOOD_URL} target="_blank" rel="noopener">
                  iFood
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="container">
        <p className={styles.final}>© 2026 Joe Burger Artesanal · Site por Webcreate</p>
      </div>
    </footer>
  );
}
