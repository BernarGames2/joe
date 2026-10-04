import { TEM_LOGO } from "@/lib/brand";
import { IconeZap } from "./Icones";
import { Logo } from "./Logo";
import { MenuMobile } from "./MenuMobile";
import { LINKS_NAV } from "./nav";
import { ZapLink } from "./ZapLink";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.dentro}`}>
        <a href="#topo" className={styles.marca} aria-label="Joe Burger Artesanal, voltar ao topo">
          <Logo tamanho={48} preload />
          {/* Com logo, no celular estreito fica só o logo (logo + botão + menu). */}
          <span className={`${styles.nome} ${TEM_LOGO ? styles.nomeComLogo : ""}`}>JOE BURGER</span>
        </a>
        <nav aria-label="Principal" className={styles.nav}>
          <ul>
            {LINKS_NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.texto}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.acoes}>
          <ZapLink className={`btn btn-zap ${styles.zap}`}>
            <IconeZap />
            Pedir no Zap
          </ZapLink>
          <MenuMobile />
        </div>
      </div>
    </header>
  );
}
