"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WHATSAPP } from "@/lib/config";
import { ITENS } from "@/lib/menu";
import { mensagemComanda, urlWhatsApp, type Modo } from "@/lib/whatsapp";
import { DESKTOP, MAX_POR_LINHA, useComanda } from "./ComandaProvider";
import { IconeFechar, IconeLixeira, IconeMais, IconeMenos, IconeZap } from "./Icones";
import { dataHora, useStatus } from "./StatusProvider";
import { useDialogo } from "./useDialogo";
import { useMedia } from "./useMedia";
import styles from "./Comanda.module.css";

const ESPERA_CARIMBO = 700;

type Erros = { itens?: string; nome?: string; endereco?: string };

export function Comanda() {
  const c = useComanda();
  const { ms } = useStatus();
  const { data, hora } = dataHora(ms);
  const desktop = useMedia(DESKTOP);
  const modal = c.sheetAberto && !desktop;

  const painelRef = useRef<HTMLElement>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const enderecoRef = useRef<HTMLTextAreaElement>(null);
  const vaziaRef = useRef<HTMLParagraphElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);

  const [tentou, setTentou] = useState(false);
  const [carimbando, setCarimbando] = useState(false);
  const [linkBloqueado, setLinkBloqueado] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const fechar = useCallback(() => c.setSheetAberto(false), [c.setSheetAberto]);
  useDialogo(painelRef, modal, fechar);

  // Passou para o desktop com o sheet aberto: fecha o sheet (o painel vira coluna).
  useEffect(() => {
    if (desktop && c.sheetAberto) c.setSheetAberto(false);
  }, [desktop, c.sheetAberto, c.setSheetAberto]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Mudou a comanda depois de enviar: some o link de fallback.
  useEffect(() => {
    if (!c.enviada) setLinkBloqueado(null);
  }, [c.enviada]);

  const erros: Erros = {};
  if (tentou) {
    if (c.linhas.length === 0) erros.itens = "Risque pelo menos um lanche antes de mandar.";
    if (!c.nome.trim()) erros.nome = "Escreva seu nome.";
    if (c.modo === "entrega" && !c.endereco.trim()) erros.endereco = "Escreva o endereço para a entrega.";
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (carimbando) return;
    setTentou(true);
    const semItens = c.linhas.length === 0;
    const semNome = !c.nome.trim();
    const semEndereco = c.modo === "entrega" && !c.endereco.trim();
    if (semItens || semNome || semEndereco) {
      const alvo = semItens ? vaziaRef.current : semNome ? nomeRef.current : enderecoRef.current;
      alvo?.focus();
      c.anunciar("A comanda tem campos para corrigir.");
      return;
    }

    const texto = mensagemComanda({
      linhas: c.linhas.map((l) => ({ nome: ITENS.get(l.itemId)?.nome ?? l.itemId, qty: l.qty, obs: l.obs })),
      nome: c.nome,
      modo: c.modo,
      endereco: c.endereco,
    });
    const url = urlWhatsApp(WHATSAPP, texto);

    setCarimbando(true);
    setLinkBloqueado(null);
    timer.current = window.setTimeout(() => {
      const janela = window.open(url, "_blank");
      if (janela) {
        janela.opener = null;
        c.anunciar("Comanda enviada. O WhatsApp abriu em outra aba.");
      } else {
        setLinkBloqueado(url);
        c.anunciar("O navegador bloqueou a nova aba. Toque em Abrir WhatsApp.");
      }
      c.marcarEnviada();
      setCarimbando(false);
      setTentou(false);
    }, ESPERA_CARIMBO);
  }

  function remover(itemId: string) {
    c.remover(itemId);
    tituloRef.current?.focus();
  }

  const mostraCarimbo = carimbando || (c.enviada && c.linhas.length > 0);

  return (
    <>
      {modal ? <div className={styles.fundo} onClick={fechar} aria-hidden="true" /> : null}
      <aside
        id="comanda"
        ref={painelRef}
        className={`${styles.painel} ${c.sheetAberto ? styles.aberto : ""}`}
        aria-labelledby="comanda-titulo"
        role={modal ? "dialog" : undefined}
        aria-modal={modal ? true : undefined}
      >
        <div className={styles.sheetTopo}>
          <p className={styles.sheetTitulo}>Sua comanda</p>
          <button type="button" className={styles.fechar} onClick={fechar} data-foco-inicial>
            <IconeFechar />
            Fechar
          </button>
        </div>

        <div className={`sombra-papel ${styles.papelWrap}`}>
          <form className={`papel serrilhado ${styles.papel}`} onSubmit={enviar} noValidate>
            <header className={styles.topo}>
              <h3 id="comanda-titulo" ref={tituloRef} tabIndex={-1} className={styles.titulo}>
                COMANDA Nº ___
              </h3>
              <p className={styles.data} suppressHydrationWarning>
                {data} · {hora}
              </p>
            </header>

            <div className={styles.corpo}>
              {c.linhas.length === 0 ? (
                <p
                  ref={vaziaRef}
                  tabIndex={-1}
                  className={styles.vazia}
                  aria-describedby={erros.itens ? "erro-itens" : undefined}
                >
                  Sua comanda está vazia. Toque no + de um lanche.
                </p>
              ) : (
                <ul className={styles.linhas}>
                  {c.linhas.map((l) => {
                    const nome = ITENS.get(l.itemId)?.nome ?? l.itemId;
                    return (
                      <li key={l.itemId} className={`${styles.linha} ${c.recem === l.itemId ? styles.escrevendo : ""}`}>
                        <div className={styles.linhaTopo}>
                          <span className={styles.linhaTexto}>
                            {l.qty}x {nome.toUpperCase()}
                          </span>
                          <span className={styles.pontilhado} aria-hidden="true" />
                          <span className={styles.controles}>
                            <button
                              type="button"
                              className={styles.ctrl}
                              aria-label={l.qty === 1 ? `Tirar ${nome} da comanda` : `Um ${nome} a menos`}
                              onClick={() => (l.qty === 1 ? remover(l.itemId) : c.mudarQty(l.itemId, l.qty - 1))}
                            >
                              <IconeMenos tamanho={18} strokeWidth={2.5} />
                            </button>
                            <button
                              type="button"
                              className={styles.ctrl}
                              aria-label={`Um ${nome} a mais`}
                              disabled={l.qty >= MAX_POR_LINHA}
                              onClick={() => c.mudarQty(l.itemId, l.qty + 1)}
                            >
                              <IconeMais tamanho={18} strokeWidth={2.5} />
                            </button>
                            <button
                              type="button"
                              className={styles.ctrl}
                              aria-label={`Remover ${nome} da comanda`}
                              onClick={() => remover(l.itemId)}
                            >
                              <IconeLixeira tamanho={18} />
                            </button>
                          </span>
                        </div>
                        <input
                          type="text"
                          className={styles.obs}
                          value={l.obs}
                          maxLength={140}
                          placeholder="alguma observação?"
                          aria-label={`Observação para ${nome}`}
                          onChange={(e) => c.mudarObs(l.itemId, e.target.value)}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
              {erros.itens ? (
                <p id="erro-itens" className={styles.erro}>
                  {erros.itens}
                </p>
              ) : null}

              {mostraCarimbo ? (
                <div className={`${styles.carimbo} ${carimbando ? styles.batendo : ""}`} aria-hidden="true">
                  ENVIADA
                </div>
              ) : null}
            </div>

            <div className={styles.campos}>
              <div className={styles.campo}>
                <label htmlFor="comanda-nome" className={styles.rotulo}>
                  Nome
                </label>
                <input
                  id="comanda-nome"
                  ref={nomeRef}
                  type="text"
                  className={styles.entrada}
                  autoComplete="name"
                  required
                  maxLength={80}
                  value={c.nome}
                  aria-invalid={erros.nome ? true : undefined}
                  aria-describedby={erros.nome ? "erro-nome" : undefined}
                  onChange={(e) => c.mudarCampo("nome", e.target.value)}
                />
                {erros.nome ? (
                  <p id="erro-nome" className={styles.erro}>
                    {erros.nome}
                  </p>
                ) : null}
              </div>

              <fieldset className={styles.campo}>
                <legend className={styles.rotulo}>Retirada ou entrega</legend>
                <div className={styles.segmentado}>
                  {(["retirada", "entrega"] as Modo[]).map((m) => (
                    <label key={m} className={styles.segmento}>
                      <input
                        type="radio"
                        name="comanda-modo"
                        value={m}
                        checked={c.modo === m}
                        onChange={() => c.mudarModo(m)}
                      />
                      <span>{m === "retirada" ? "Retirada" : "Entrega"}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {c.modo === "entrega" ? (
                <div className={styles.campo}>
                  <label htmlFor="comanda-endereco" className={styles.rotulo}>
                    Endereço e referência
                  </label>
                  <textarea
                    id="comanda-endereco"
                    ref={enderecoRef}
                    className={`${styles.entrada} ${styles.area}`}
                    autoComplete="street-address"
                    required
                    rows={2}
                    maxLength={240}
                    value={c.endereco}
                    aria-invalid={erros.endereco ? true : undefined}
                    aria-describedby={erros.endereco ? "erro-endereco" : undefined}
                    onChange={(e) => c.mudarCampo("endereco", e.target.value)}
                  />
                  {erros.endereco ? (
                    <p id="erro-endereco" className={styles.erro}>
                      {erros.endereco}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <p className={styles.aviso}>O atendente confirma valor, taxa de entrega e tempo.</p>

            {linkBloqueado ? (
              <a href={linkBloqueado} target="_blank" rel="noopener noreferrer" className={`btn btn-zap ${styles.enviar}`}>
                <IconeZap />
                Abrir WhatsApp
              </a>
            ) : (
              <button type="submit" className={`btn btn-zap ${styles.enviar}`} aria-disabled={carimbando || undefined}>
                <IconeZap />
                Mandar a comanda no WhatsApp
              </button>
            )}

            {c.enviada && c.linhas.length > 0 ? (
              <button
                type="button"
                className={styles.limpar}
                onClick={() => {
                  c.limpar();
                  tituloRef.current?.focus();
                }}
              >
                Limpar comanda
              </button>
            ) : null}
          </form>
        </div>
      </aside>
    </>
  );
}
