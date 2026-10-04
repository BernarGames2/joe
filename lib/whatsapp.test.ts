import { test } from "node:test";
import assert from "node:assert/strict";
import { MENSAGEM_SIMPLES, mensagemComanda, urlWhatsApp } from "./whatsapp.ts";

test("mensagem da comanda com entrega", () => {
  const texto = mensagemComanda({
    linhas: [
      { nome: "Joe Burger", qty: 2, obs: "sem cebola" },
      { nome: "Batata frita", qty: 1, obs: "" },
    ],
    nome: "Ana",
    modo: "entrega",
    endereco: "Rua das Flores, 10 — portão azul",
  });
  assert.equal(
    texto,
    [
      "Olá, Joe Burger! Quero fazer um pedido:",
      "",
      "2x Joe Burger — obs: sem cebola",
      "1x Batata frita",
      "",
      "Nome: Ana",
      "Entrega",
      "Endereço: Rua das Flores, 10 — portão azul",
      "",
      "Pode confirmar valor e tempo? Obrigado!",
    ].join("\n"),
  );
});

test("retirada não leva endereço; quebras de linha do usuário viram espaço", () => {
  const texto = mensagemComanda({
    linhas: [{ nome: "Gigante", qty: 1, obs: "  ponto\nda carne  " }],
    nome: " João ",
    modo: "retirada",
    endereco: "ignorado",
  });
  assert.equal(
    texto,
    "Olá, Joe Burger! Quero fazer um pedido:\n\n1x Gigante — obs: ponto da carne\n\nNome: João\nRetirada\n\nPode confirmar valor e tempo? Obrigado!",
  );
});

test("URL do wa.me com acentos e quebras de linha codificados", () => {
  const url = urlWhatsApp("553432343651", MENSAGEM_SIMPLES);
  assert.ok(url.startsWith("https://wa.me/553432343651?text="));
  assert.equal(new URL(url).searchParams.get("text"), MENSAGEM_SIMPLES);
  assert.ok(urlWhatsApp("1", "a\nb").endsWith("a%0Ab"));
});
