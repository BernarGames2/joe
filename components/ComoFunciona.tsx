import styles from "./ComoFunciona.module.css";

const PASSOS = [
  { n: "01", titulo: "Risque o que quer.", texto: "Escolha os lanches e as quantidades." },
  { n: "02", titulo: "Ajuste do seu jeito.", texto: "Escreva a observação: sem cebola, ponto da carne, o que precisar." },
  {
    n: "03",
    titulo: "Mande pro Joe.",
    texto: "A comanda abre no seu WhatsApp, pronta. O atendente confirma valor, taxa e tempo.",
  },
];

function Clipe() {
  return (
    <svg className={styles.clipe} width="26" height="58" viewBox="0 0 26 58" aria-hidden="true" focusable="false">
      <path
        d="M8 20V8.5a5 5 0 0 1 10 0V44a8 8 0 0 1-16 0V14"
        fill="none"
        stroke="#9A968C"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M8 20V8.5a5 5 0 0 1 10 0" fill="none" stroke="#D9D5CB" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function ComoFunciona() {
  return (
    <section className={`secao ${styles.secao}`} aria-labelledby="como-funciona-titulo">
      <div className="container">
        <h2 id="como-funciona-titulo" className="eyebrow">
          Como funciona
        </h2>
        <ol className={styles.passos}>
          {PASSOS.map((p) => (
            <li key={p.n} className={`sombra-papel eleva ${styles.passoWrap}`}>
              <Clipe />
              <div className={`papel serrilhado ${styles.passo}`}>
                <span className={styles.numero} aria-hidden="true">
                  {p.n}
                </span>
                <h3 className={styles.titulo}>{p.titulo}</h3>
                <p className={styles.texto}>{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
