import { GOOGLE } from "@/lib/config";
import { Hamburguer } from "./Hamburguer";
import { HeroComanda } from "./HeroComanda";
import { Estrela, IconeCheck, IconeSeta, IconeZap } from "./Icones";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-titulo">
      <div className="container">
        <div className={styles.grade}>
          <div className={styles.texto}>
            <p className="eyebrow">HAMBURGUERIA ARTESANAL · SANTA MÔNICA · UBERLÂNDIA</p>
            <h1 id="hero-titulo" className={`display ${styles.h1}`}>
              PEÇA DIRETO
              <br />
              <span className={styles.brasa}>PRA CHAPA.</span>
            </h1>
            <p className={styles.sub}>
              Monte sua comanda aqui. Ela chega pronta no WhatsApp do Joe: itens, observações, retirada ou entrega.
            </p>
            <div className={styles.ctas}>
              <a href="#cardapio" className="btn btn-brasa">
                Montar minha comanda
              </a>
              <a href="#como-chegar" className="link-seta">
                Ver horário e endereço
                <IconeSeta />
              </a>
            </div>
          </div>

          <div className={styles.arte}>
            <div className={styles.halo} aria-hidden="true" />
            <div className={styles.faiscas} aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={styles.faisca} />
              ))}
            </div>
            <Hamburguer idBase="hero" className={styles.burger} />
            <HeroComanda />
          </div>
        </div>

        <ul className={styles.provas}>
          <li>
            <Estrela id="prova-estrela" tamanho={22} />
            <span>
              <strong>
                {GOOGLE.nota} no Google · {GOOGLE.avaliacoes} avaliações
              </strong>
            </span>
          </li>
          <li>
            <IconeCheck tamanho={22} className={styles.iconeProva} />
            <span>Hamburgueria artesanal</span>
          </li>
          <li>
            <IconeZap tamanho={22} className={styles.iconeProva} />
            <span>Pedido direto no WhatsApp</span>
          </li>
        </ul>
        <p className={`nota-mono ${styles.nota}`}>Avaliações do Google consultadas em {GOOGLE.consulta}.</p>
      </div>
    </section>
  );
}
