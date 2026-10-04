import Image from "next/image";
import { CATEGORIAS } from "@/lib/menu";
import { CardapioInterativo } from "./CardapioInterativo";
import styles from "./Cardapio.module.css";

export function Cardapio() {
  // Miniatura 72px só para item com foto real; sem foto, nada ocupa o lugar.
  const miniaturas = Object.fromEntries(
    CATEGORIAS.flatMap((c) => c.itens)
      .filter((i) => i.photo)
      .map((i) => [
        i.id,
        <Image key={i.id} src={i.photo!} width={72} height={72} sizes="72px" alt="" className={styles.miniatura} />,
      ]),
  );
  return (
    <section id="cardapio" className={`secao ${styles.secao}`} aria-labelledby="cardapio-titulo">
      <div className="container">
        <div className={styles.cabeca}>
          <h2 id="cardapio-titulo" className="titulo-secao">
            O CARDÁPIO É A COMANDA.
          </h2>
          <p className={styles.sub}>Toque no + para riscar um item.</p>
        </div>
        <CardapioInterativo miniaturas={miniaturas} />
      </div>
    </section>
  );
}
