import { AVALIACOES, GOOGLE, MAPS_URL } from "@/lib/config";
import { Estrela, IconeSeta } from "./Icones";
import styles from "./Avaliacoes.module.css";

export function Avaliacoes() {
  const nota = Number(GOOGLE.nota.replace(",", "."));
  return (
    <section id="avaliacoes" className={`secao ${styles.secao}`} aria-labelledby="avaliacoes-titulo">
      <div className="container">
        <h2 id="avaliacoes-titulo" className="titulo-secao">
          O BAIRRO JÁ AVALIOU
        </h2>
        <div className={styles.grade}>
          <div className={styles.nota}>
            <p className={styles.numero}>
              <span className="sr-only">Nota </span>
              {GOOGLE.nota}
            </p>
            <div className={styles.estrelas} role="img" aria-label={`${GOOGLE.nota} de 5 estrelas`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Estrela key={i} id={`estrela-${i}`} tamanho={32} fracao={Math.max(0, Math.min(1, nota - (i - 1)))} />
              ))}
            </div>
            <p className={styles.legenda}>
              {GOOGLE.avaliacoes} avaliações no Google (consulta em {GOOGLE.consulta})
            </p>
            <a href={MAPS_URL} target="_blank" rel="noopener" className={`btn btn-borda-giz ${styles.todas}`}>
              Ver todas no Google
              <IconeSeta />
            </a>
          </div>
          <ul className={styles.lista}>
            {AVALIACOES.map((a) => (
              <li key={a.autor} className={`sombra-papel eleva ${styles.itemWrap}`}>
                <figure className={`papel serrilhado ${styles.item}`}>
                  <blockquote className={styles.citacao}>
                    <p>“{a.texto}”</p>
                  </blockquote>
                  <figcaption className={styles.credito}>— {a.autor}, avaliação no Google</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
