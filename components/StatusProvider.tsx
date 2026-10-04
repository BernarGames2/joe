"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { HORARIO, TIMEZONE } from "@/lib/config";
import { agoraEm, calcularStatus, type Agora, type Status } from "@/lib/horario";

type Valor = { ms: number; agora: Agora; status: Status };

const Ctx = createContext<Valor | null>(null);

/**
 * Relógio da casa. O servidor passa o instante do request (`inicial`), então o HTML
 * já sai com o status certo; no cliente o valor é atualizado a cada 30 s.
 */
export function StatusProvider({ inicial, children }: { inicial: number; children: React.ReactNode }) {
  const [ms, setMs] = useState(inicial);

  useEffect(() => {
    setMs(Date.now());
    const t = window.setInterval(() => setMs(Date.now()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const valor = useMemo(() => {
    const agora = agoraEm(new Date(ms), TIMEZONE);
    return { ms, agora, status: calcularStatus(agora, HORARIO) };
  }, [ms]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useStatus(): Valor {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStatus fora do StatusProvider");
  return v;
}

const fmtData = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIMEZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const fmtHora = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** "04/10/2026" e "21:37" no horário de Brasília. */
export function dataHora(ms: number): { data: string; hora: string } {
  const d = new Date(ms);
  return { data: fmtData.format(d), hora: fmtHora.format(d) };
}
