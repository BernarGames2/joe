// Ícones próprios: traço 2px, extremidades arredondadas, cor = currentColor.
import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { tamanho?: number };

function Base({ tamanho = 20, children, ...rest }: Props) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Balão de conversa com fone (WhatsApp, desenhado à mão). */
export function IconeZap(p: Props) {
  return (
    <Base {...p}>
      <path d="M4.2 19.8 5.3 16A8.3 8.3 0 1 1 8.4 19z" />
      <path d="M9.1 8.6c.2-.5.6-.6.9-.6h.4c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.4c0 .3-.1.7-.6.9-.6.3-1.6.4-3-.3a8.6 8.6 0 0 1-3.6-3.6c-.6-1.4-.5-2.4-.2-3z" />
    </Base>
  );
}

export function IconePin(p: Props) {
  return (
    <Base {...p}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </Base>
  );
}

export function IconeRelogio(p: Props) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Base>
  );
}

export function IconeInstagram(p: Props) {
  return (
    <Base {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17 7h.01" />
    </Base>
  );
}

export function IconeSeta(p: Props) {
  return (
    <Base {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Base>
  );
}

export function IconeMais(p: Props) {
  return (
    <Base {...p}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  );
}

export function IconeMenos(p: Props) {
  return (
    <Base {...p}>
      <path d="M5 12h14" />
    </Base>
  );
}

export function IconeLixeira(p: Props) {
  return (
    <Base {...p}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5L18 7M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
    </Base>
  );
}

export function IconeCheck(p: Props) {
  return (
    <Base {...p}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Base>
  );
}

export function IconeTelefone(p: Props) {
  return (
    <Base {...p}>
      <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </Base>
  );
}

export function IconeMenu(p: Props) {
  return (
    <Base {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

export function IconeFechar(p: Props) {
  return (
    <Base {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Base>
  );
}

export function IconeSacola(p: Props) {
  return (
    <Base {...p}>
      <path d="M5 8h14l-1 12H6zM9 8V6.5a3 3 0 0 1 6 0V8" />
    </Base>
  );
}

/** Estrela cheia (preenchida), com recorte opcional para nota fracionada. */
export function Estrela({ fracao = 1, id, tamanho = 28 }: { fracao?: number; id: string; tamanho?: number }) {
  const d = "M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z";
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={24 * fracao} height="24" />
        </clipPath>
      </defs>
      <path d={d} fill="none" stroke="var(--mostarda)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d={d} fill="var(--mostarda)" clipPath={`url(#${id})`} />
    </svg>
  );
}
