import { CtaFinalSub } from "./CtaFinalSub";
import { SEMENTES } from "./hamburguer-desenho";
import { IconeZap } from "./Icones";
import { ZapLink } from "./ZapLink";
import styles from "./CtaFinal.module.css";

/** Hambúrguer em estilo carimbo (silhueta + 2 tons), só decoração no desktop. */
function CarimboBurger() {
  return (
    <svg className={styles.carimbo} viewBox="30 110 340 300" aria-hidden="true" focusable="false">
      <g fill="#0E0F10" stroke="#F26B1D" strokeWidth="7" strokeLinejoin="round">
        <path d="M54 352H346C356 352 361 358 359 367C352 390 330 401 300 401H100C70 401 48 390 41 367C39 358 44 352 54 352Z" />
        <path d="M54 284C84 278 140 281 200 279S318 280 348 285C360 295 362 327 351 337C320 344 262 341 200 343S82 344 52 338C39 327 41 295 54 284Z" />
        <path d="M40 260H360L350 282H286C281 282 279 286 279 291V299C279 311 261 311 261 299V291C261 286 258 282 253 282H132C126 282 123 286 123 292V312C123 326 103 326 103 312V291C103 286 99 282 94 282H50Z" />
        <path d="M48 222C44 160 110 118 200 118S356 160 352 222C352 230 346 236 338 236H62C54 236 48 230 48 222Z" />
      </g>
      <g fill="#F26B1D">
        {SEMENTES.map(([x, y, r]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="6.5" ry="3" transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </g>
    </svg>
  );
}

export function CtaFinal() {
  return (
    <section className={styles.cta} aria-labelledby="cta-titulo">
      <div className={`container ${styles.dentro}`}>
        <h2 id="cta-titulo" className={`display ${styles.titulo}`}>
          FOME? A CHAPA TÁ ESPERANDO.
        </h2>
        <CtaFinalSub className={styles.sub} />
        <div className={styles.botoes}>
          <a href="#cardapio" className="btn btn-carvao">
            Montar minha comanda
          </a>
          <ZapLink className={`btn btn-borda ${styles.borda}`}>
            <IconeZap />
            Chamar no Zap
          </ZapLink>
        </div>
      </div>
      <CarimboBurger />
    </section>
  );
}
