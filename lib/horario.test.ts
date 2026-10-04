import { test } from "node:test";
import assert from "node:assert/strict";
import { HORARIO, TIMEZONE } from "./config.ts";
import {
  agoraEm,
  calcularStatus,
  openingHoursSpecification,
  quandoAcende,
  resumoDias,
  resumoHorarios,
  textoStatus,
  type Agora,
} from "./horario.ts";

const DOM = 0, SEG = 1, TER = 2, QUA = 3, QUI = 4, SEX = 5, SAB = 6;
const em = (dia: number, h: number, m = 0): Agora => ({ dia, minutos: h * 60 + m });
const status = (a: Agora) => calcularStatus(a, HORARIO);
const barra = (a: Agora) => {
  const t = textoStatus(status(a));
  return `${t.titulo} · ${t.detalhe}`;
};

test("seg 20:00 → fechado, próxima ter 18h", () => {
  const s = status(em(SEG, 20));
  assert.equal(s.aberto, false);
  assert.ok(!s.aberto && s.proxima);
  assert.deepEqual(!s.aberto && s.proxima, { emDias: 1, dia: TER, inicio: 1080 });
  assert.equal(barra(em(SEG, 20)), "A CHAPA DESCANSA HOJE · volta terça às 18h");
});

test("ter 17:59 → fechado, acende hoje às 18h", () => {
  assert.equal(status(em(TER, 17, 59)).aberto, false);
  assert.equal(barra(em(TER, 17, 59)), "CHAPA APAGADA · acende hoje às 18h");
});

test("ter 18:00 → aberto até 00h", () => {
  assert.equal(status(em(TER, 18)).aberto, true);
  assert.equal(barra(em(TER, 18)), "CHAPA ACESA · pedidos até 00h");
});

test("qua 23:59 → aberto; qui 00:00 → fechado, acende hoje às 18h", () => {
  assert.equal(status(em(QUA, 23, 59)).aberto, true);
  assert.equal(status(em(QUI, 0)).aberto, false);
  assert.equal(barra(em(QUI, 0)), "CHAPA APAGADA · acende hoje às 18h");
});

test("sex 23:30 → aberto até 01h", () => {
  assert.equal(barra(em(SEX, 23, 30)), "CHAPA ACESA · pedidos até 01h");
});

test("sáb 00:30 → aberto (janela de sexta)", () => {
  assert.equal(status(em(SAB, 0, 30)).aberto, true);
  assert.equal(barra(em(SAB, 0, 30)), "CHAPA ACESA · pedidos até 01h");
});

test("sáb 01:00 → fechado (fim da janela já conta como fechado)", () => {
  assert.equal(status(em(SAB, 1)).aberto, false);
  assert.equal(barra(em(SAB, 1)), "CHAPA APAGADA · acende hoje às 18h");
});

test("dom 23:59 → aberto; seg 00:00 → a chapa descansa hoje · volta terça às 18h", () => {
  assert.equal(status(em(DOM, 23, 59)).aberto, true);
  assert.equal(status(em(SEG, 0)).aberto, false);
  assert.equal(barra(em(SEG, 0)), "A CHAPA DESCANSA HOJE · volta terça às 18h");
});

test("depois do expediente → acende amanhã", () => {
  // dom 00:30: janela de sábado ainda aberta; dom 01:30 já fechou e reabre no mesmo dia.
  assert.equal(status(em(DOM, 0, 30)).aberto, true);
  assert.equal(barra(em(DOM, 1, 30)), "CHAPA APAGADA · acende hoje às 18h");
  // Casa que fecha antes da meia-noite: às 23:30 a próxima abertura é amanhã.
  const cedo = { ...HORARIO, 2: [[1080, 1380]] as const };
  const t = textoStatus(calcularStatus(em(TER, 23, 30), cedo));
  assert.equal(`${t.titulo} · ${t.detalhe}`, "CHAPA APAGADA · acende amanhã às 18h");
  // Folga no meio da semana: volta no dia seguinte, pelo nome.
  const folga = { ...HORARIO, 3: [] as const };
  const f = textoStatus(calcularStatus(em(QUA, 0, 30), folga));
  assert.equal(`${f.titulo} · ${f.detalhe}`, "A CHAPA DESCANSA HOJE · volta quinta às 18h");
});

test("CTA final: quando acende", () => {
  assert.equal(quandoAcende(status(em(TER, 12))), "hoje às 18h");
  assert.equal(quandoAcende(status(em(SEG, 12))), "terça às 18h");
  assert.equal(quandoAcende(status(em(TER, 19))), null);
});

test("fuso America/Sao_Paulo (UTC−3, sem horário de verão)", () => {
  // 2026-10-03 é sábado. 03:30 UTC = sáb 00:30 em São Paulo.
  assert.deepEqual(agoraEm(new Date("2026-10-03T03:30:00Z"), TIMEZONE), { dia: SAB, minutos: 30 });
  // 2026-10-06 é terça. 21:00 UTC = 18:00 em São Paulo.
  assert.deepEqual(agoraEm(new Date("2026-10-06T21:00:00Z"), TIMEZONE), { dia: TER, minutos: 1080 });
  // Meia-noite vira 0, não 24.
  assert.deepEqual(agoraEm(new Date("2026-10-05T03:00:00Z"), TIMEZONE), { dia: SEG, minutos: 0 });
});

test("textos derivados do horário", () => {
  assert.equal(resumoDias(HORARIO), "de terça a domingo, à noite");
  assert.deepEqual(resumoHorarios(HORARIO), [
    { dias: "ter, qua, qui e dom", texto: "18h – 00h" },
    { dias: "sex e sáb", texto: "18h – 01h" },
    { dias: "seg", texto: "Fechado" },
  ]);
  assert.deepEqual(openingHoursSpecification(HORARIO), [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Sunday"], opens: "18:00", closes: "00:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"], opens: "18:00", closes: "01:00" },
  ]);
});
