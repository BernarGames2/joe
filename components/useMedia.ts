"use client";

import { useSyncExternalStore } from "react";

/** true/false para uma media query. No servidor (e na hidratação) devolve false. */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
