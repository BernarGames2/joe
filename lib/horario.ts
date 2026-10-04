// Status "chapa acesa / apagada". Funções puras: recebem o horário e o instante,
// para poder testar sem relógio e usar igual no servidor e no cliente.

export type Janela = readonly [number, number];
export type Horario = Readonly<Record<number, readonly Janela[]>>;

/** Dia da semana (0 = domingo) e minutos desde 00:00, no fuso da casa. */
export type Agora = { dia: number; minutos: number };

export type Proxima = { emDias: number; dia: number; inicio: number };

export type Status =
  | { aberto: true; fim: number }
  | { aberto: false; descansaHoje: boolean; proxima: Proxima | null };

const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const DIAS_CURTOS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const DIAS_TITULO = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const SEMANA_A_PARTIR_DE_SEGUNDA = [1, 2, 3, 4, 5, 6, 0];
const WEEKDAY_EN: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const partesFmt = new Map<string, Intl.DateTimeFormat>();

/** Dia e minutos do instante `date` no fuso `timeZone`. */
export function agoraEm(date: Date, timeZone: string): Agora {
  let fmt = partesFmt.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    partesFmt.set(timeZone, fmt);
  }
  let dia = 0;
  let hora = 0;
  let minuto = 0;
  for (const p of fmt.formatToParts(date)) {
    if (p.type === "weekday") dia = WEEKDAY_EN[p.value] ?? 0;
    else if (p.type === "hour") hora = Number(p.value) % 24;
    else if (p.type === "minute") minuto = Number(p.value);
  }
  return { dia, minutos: hora * 60 + minuto };
}

function janelas(horario: Horario, dia: number): readonly Janela[] {
  return horario[dia] ?? [];
}

export function calcularStatus(agora: Agora, horario: Horario): Status {
  const { dia, minutos } = agora;

  for (const [ini, fim] of janelas(horario, dia)) {
    if (minutos >= ini && minutos < fim) return { aberto: true, fim };
  }
  // Janela de ontem que passou da meia-noite (sex 18h → sáb 01h).
  const ontem = (dia + 6) % 7;
  for (const [ini, fim] of janelas(horario, ontem)) {
    const m = minutos + 1440;
    if (m >= ini && m < fim) return { aberto: true, fim };
  }

  let proxima: Proxima | null = null;
  for (let d = 0; d <= 7 && !proxima; d++) {
    const diaX = (dia + d) % 7;
    const inicios = janelas(horario, diaX)
      .map(([ini]) => ini)
      .sort((a, b) => a - b);
    for (const ini of inicios) {
      if (d === 0 && ini <= minutos) continue;
      proxima = { emDias: d, dia: diaX, inicio: ini };
      break;
    }
  }

  return { aberto: false, descansaHoje: janelas(horario, dia).length === 0, proxima };
}

/** 1080 → "18h", 1440 → "00h", 1500 → "01h", 1110 → "18h30". */
export function hora(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, "0")}h${m ? String(m).padStart(2, "0") : ""}`;
}

export function nomeDia(dia: number): string {
  return DIAS[dia] ?? "";
}

/** "hoje", "amanhã" ou o nome do dia. */
export function quando(p: Proxima): string {
  if (p.emDias === 0) return "hoje";
  if (p.emDias === 1) return "amanhã";
  return nomeDia(p.dia);
}

/** Textos da barra de status: título em caixa alta + detalhe. */
export function textoStatus(s: Status): { titulo: string; detalhe: string } {
  if (s.aberto) return { titulo: "CHAPA ACESA", detalhe: `pedidos até ${hora(s.fim)}` };
  if (!s.proxima) return { titulo: "CHAPA APAGADA", detalhe: "confirme o horário no WhatsApp" };
  if (s.descansaHoje) {
    return {
      titulo: "A CHAPA DESCANSA HOJE",
      detalhe: `volta ${nomeDia(s.proxima.dia)} às ${hora(s.proxima.inicio)}`,
    };
  }
  return { titulo: "CHAPA APAGADA", detalhe: `acende ${quando(s.proxima)} às ${hora(s.proxima.inicio)}` };
}

/** "acende hoje às 18h" / "acende terça às 18h" — usado no CTA final. */
export function quandoAcende(s: Status): string | null {
  if (s.aberto || !s.proxima) return null;
  const q = s.descansaHoje ? nomeDia(s.proxima.dia) : quando(s.proxima);
  return `${q} às ${hora(s.proxima.inicio)}`;
}

function juntar(lista: string[]): string {
  if (lista.length <= 1) return lista.join("");
  return `${lista.slice(0, -1).join(", ")} e ${lista[lista.length - 1]}`;
}

/** "de terça a domingo, à noite" (derivado do horário, para o texto não divergir). */
export function resumoDias(horario: Horario): string {
  const abertos = SEMANA_A_PARTIR_DE_SEGUNDA.map((d) => janelas(horario, d).length > 0);
  const dias = SEMANA_A_PARTIR_DE_SEGUNDA.filter((_, i) => abertos[i]);
  if (dias.length === 0) return "";

  let texto: string;
  if (dias.length === 7) {
    texto = "todos os dias";
  } else {
    // Sequência contínua na semana circular? Procura o único "buraco".
    const inicioRun = abertos.findIndex((a, i) => a && !abertos[(i + 6) % 7]);
    let n = 0;
    while (n < 7 && abertos[(inicioRun + n) % 7]) n++;
    const continuo = n === dias.length && n >= 3;
    texto = continuo
      ? `de ${nomeDia(SEMANA_A_PARTIR_DE_SEGUNDA[inicioRun])} a ${nomeDia(SEMANA_A_PARTIR_DE_SEGUNDA[(inicioRun + n - 1) % 7])}`
      : juntar(dias.map(nomeDia));
  }

  const todasANoite = dias.every((d) => janelas(horario, d).every(([ini]) => ini >= 17 * 60));
  return todasANoite ? `${texto}, à noite` : texto;
}

export type LinhaTabela = { dia: number; nome: string; texto: string; fechado: boolean };

/** Linhas da tabela de horários, de segunda a domingo. */
export function tabelaHorario(horario: Horario): LinhaTabela[] {
  return SEMANA_A_PARTIR_DE_SEGUNDA.map((dia) => {
    const js = janelas(horario, dia);
    return {
      dia,
      nome: DIAS_TITULO[dia],
      fechado: js.length === 0,
      texto: js.length === 0 ? "Fechado" : js.map(([a, b]) => `${hora(a)} – ${hora(b)}`).join(" · "),
    };
  });
}

/** Agrupa dias com o mesmo horário: [{ dias: "ter, qua, qui e dom", texto: "18h – 00h" }, …]. */
export function resumoHorarios(horario: Horario): { dias: string; texto: string }[] {
  const grupos = new Map<string, number[]>();
  for (const dia of SEMANA_A_PARTIR_DE_SEGUNDA) {
    const js = janelas(horario, dia);
    const chave = js.length === 0 ? "Fechado" : js.map(([a, b]) => `${hora(a)} – ${hora(b)}`).join(" · ");
    grupos.set(chave, [...(grupos.get(chave) ?? []), dia]);
  }
  const lista = [...grupos.entries()].map(([texto, dias]) => ({
    dias: juntar(dias.map((d) => DIAS_CURTOS[d])),
    texto,
  }));
  // Fechado por último.
  return lista.sort((a, b) => Number(a.texto === "Fechado") - Number(b.texto === "Fechado"));
}

const DOW_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function hhmm(min: number): string {
  const h = Math.floor(min / 60) % 24;
  return `${String(h).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

/** openingHoursSpecification (schema.org), agrupado por horário igual. */
export function openingHoursSpecification(horario: Horario) {
  const grupos = new Map<string, { opens: string; closes: string; dias: string[] }>();
  for (const dia of SEMANA_A_PARTIR_DE_SEGUNDA) {
    for (const [a, b] of janelas(horario, dia)) {
      const opens = hhmm(a);
      const closes = hhmm(b);
      const chave = `${opens}-${closes}`;
      const g = grupos.get(chave) ?? { opens, closes, dias: [] };
      g.dias.push(DOW_SCHEMA[dia]);
      grupos.set(chave, g);
    }
  }
  return [...grupos.values()].map((g) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: g.dias,
    opens: g.opens,
    closes: g.closes,
  }));
}
