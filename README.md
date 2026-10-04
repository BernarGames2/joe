# Joe Burger Artesanal — site "A Comanda"

Site de uma página da Joe Burger Artesanal (Santa Mônica, Uberlândia/MG). O cardápio é uma comanda:
o cliente risca os lanches, escreve a observação, informa nome e retirada/entrega, e a comanda abre
pronta no WhatsApp da casa.

Next.js 16 (App Router) + TypeScript + CSS Modules. Sem biblioteca de animação.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # testes do horário e da mensagem do WhatsApp (node:test)
npm run build      # build de produção (inclui checagem de tipos)
```

Node 22.18 ou mais novo (os testes rodam TypeScript direto no Node).

## Onde mexer (sem tocar em componente)

| O quê | Arquivo |
| --- | --- |
| Horário, telefone, links, iFood, "negócio de família", domínio, avaliações | `lib/config.ts` |
| Cardápio (categorias, itens, descrição, foto) | `data/menu.json` |
| Logo | `public/brand/logo-joe.png` |

- **Horário**: `HORARIO` em minutos desde 00:00, no dia em que a janela começa (`1500` = 01:00 do dia
  seguinte). A barra "chapa acesa/apagada", a tabela, o rodapé, o texto "de terça a domingo, à noite",
  a meta description e o JSON-LD saem todos daí.
- **iFood**: preencher `IFOOD_URL` faz aparecer o botão e a frase do iFood.
- **Negócio de família**: `SHOW_FAMILY = true` (só depois de a dona confirmar).
- **Domínio**: preencher `SITE_URL` liga o canonical e o sitemap com host.
- **Cardápio**: trocar `data/menu.json` basta. Item sem `desc` não mostra parágrafo; item sem `photo`
  não reserva espaço. Para foto, salvar em `public/cardapio/` e pôr `"photo": "/cardapio/arquivo.jpg"`.
  Itens com `"exemplo": true` fazem o build avisar no console. `price` não é exibido.
- **Logo**: basta colocar o arquivo em `public/brand/logo-joe.png` e fazer o build. Sem o arquivo, o
  header e o rodapé mostram só o nome em texto (o build avisa). Recorte sempre circular, entre 44 e 96 px.

A pasta `refs/` (fotos do Instagram, só referência de identidade) está no `.gitignore` e nunca é publicada.

## Deploy (Vercel)

Importar o repositório na Vercel; não precisa de configuração. O endereço do deploy é usado
automaticamente nas URLs da imagem de compartilhamento enquanto `SITE_URL` estiver vazio.

## QA

Os scripts de `scripts/qa/` usam Playwright (`npm i --no-save playwright && npx playwright install chromium`)
e recebem a URL do site:

```bash
npm run build && npm start &
node scripts/qa/telas.cjs     # 360/390/768/1280, com e sem JS, rolagem horizontal, console, 404
node scripts/qa/fluxo.cjs     # comanda completa até a URL do wa.me (texto conferido caractere a caractere)
node scripts/qa/a11y.cjs      # prefers-reduced-motion e navegação por teclado
node scripts/qa/palavras.cjs  # "R$", "Lorem", "A CONFIRMAR", "FOTO", "inigual"… e "melhor" só na citação
```

As imagens vão para `qa-saida/` (ignorada pelo git).
