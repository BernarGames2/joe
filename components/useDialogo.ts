"use client";

import { useEffect, type RefObject } from "react";

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Diálogo modal acessível: prende o foco dentro de `ref`, Esc fecha,
 * trava a rolagem da página e devolve o foco a quem abriu.
 */
export function useDialogo(ref: RefObject<HTMLElement | null>, aberto: boolean, fechar: () => void) {
  useEffect(() => {
    if (!aberto) return;
    const el = ref.current;
    if (!el) return;
    const anterior = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const overflowAntes = html.style.overflow;
    html.style.overflow = "hidden";

    const focaveis = () =>
      Array.from(el.querySelectorAll<HTMLElement>(FOCAVEIS)).filter((f) => f.offsetParent !== null || f === document.activeElement);

    // Foco inicial: primeiro elemento marcado com data-foco-inicial, senão o primeiro focável.
    const inicial = el.querySelector<HTMLElement>("[data-foco-inicial]") ?? focaveis()[0];
    inicial?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        fechar();
        return;
      }
      if (e.key !== "Tab" || !el) return;
      const lista = focaveis();
      if (lista.length === 0) return;
      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];
      const ativo = document.activeElement;
      if (e.shiftKey && (ativo === primeiro || !el.contains(ativo))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (ativo === ultimo || !el.contains(ativo))) {
        e.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = overflowAntes;
      // Fechou por um link interno (data-ir-para="#secao"): o foco vai para a seção de destino.
      const destino = el.dataset.irPara;
      delete el.dataset.irPara;
      const alvo = destino ? document.querySelector<HTMLElement>(destino) : null;
      if (alvo) {
        if (!alvo.hasAttribute("tabindex")) alvo.setAttribute("tabindex", "-1");
        alvo.focus({ preventScroll: true });
      } else if (anterior && document.contains(anterior)) {
        anterior.focus({ preventScroll: true });
      }
    };
  }, [aberto, ref, fechar]);
}
