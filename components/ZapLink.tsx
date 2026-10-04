"use client";

import { URL_ZAP_SIMPLES } from "@/lib/links";
import { useComanda } from "./ComandaProvider";

/**
 * Link pro WhatsApp com a mensagem simples. Se já houver itens na comanda,
 * abre a comanda em vez disso (a mensagem da comanda só sai pelo painel).
 */
export function ZapLink({
  className,
  children,
  sempreSimples = false,
}: {
  className?: string;
  children: React.ReactNode;
  sempreSimples?: boolean;
}) {
  const { total, abrirComanda } = useComanda();
  return (
    <a
      href={URL_ZAP_SIMPLES}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        if (!sempreSimples && total > 0) {
          e.preventDefault();
          abrirComanda();
        }
      }}
    >
      {children}
    </a>
  );
}
