"use client";

import { quandoAcende } from "@/lib/horario";
import { useStatus } from "./StatusProvider";

export function CtaFinalSub({ className }: { className?: string }) {
  const { status } = useStatus();
  const acende = quandoAcende(status);
  return (
    <p className={className} suppressHydrationWarning>
      {acende
        ? `A chapa acende ${acende}. Dá pra deixar a comanda pronta.`
        : "Monte sua comanda ou chame no WhatsApp."}
    </p>
  );
}
