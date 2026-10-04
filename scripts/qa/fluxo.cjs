// QA 3: fluxo completo da comanda (desktop e celular) + popup bloqueado. Uso: node scripts/qa/fluxo.cjs [url]
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const URL_SITE = process.argv[2] || 'http://localhost:3000';
const SHOTS = require('node:path').resolve(process.env.QA_SAIDA || 'qa-saida');
require('node:fs').mkdirSync(SHOTS, { recursive: true });

const ESPERADO = [
  'Olá, Joe Burger! Quero fazer um pedido:',
  '',
  '2x Joe Burger — obs: sem cebola',
  '1x Batata frita',
  '',
  'Nome: Ana Lúcia',
  'Entrega',
  'Endereço: Rua das Flores, 10 — portão azul',
  '',
  'Pode confirmar valor e tempo? Obrigado!',
].join('\n');

function stubOpen(bloquear) {
  return `window.__aberto = []; window.open = function (u) { window.__aberto.push(String(u)); return ${bloquear ? 'null' : '{ opener: 1 }'}; };`;
}

(async () => {
  const browser = await chromium.launch();
  const erros = [];

  // ---------- desktop ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript(stubOpen(false));
    const page = await ctx.newPage();
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) erros.push('desktop ' + m.type() + ': ' + m.text()); });
    page.on('pageerror', (e) => erros.push('desktop pageerror: ' + e.message));
    await page.goto(URL_SITE, { waitUntil: 'networkidle' });

    // enviar vazio: erro inline + foco no papel vazio
    await page.getByRole('button', { name: 'Mandar a comanda no WhatsApp' }).click();
    await page.getByText('Risque pelo menos um lanche antes de mandar.').waitFor();
    assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Sua comanda está vazia. Toque no + de um lanche.');
    console.log('ok  vazio bloqueia, foco no papel vazio');

    await page.getByRole('button', { name: 'Adicionar Joe Burger à comanda' }).click();
    await page.getByRole('button', { name: 'Adicionar Batata frita à comanda' }).click();
    // aumenta a quantidade pelo + do item e pelo + da linha
    await page.getByRole('button', { name: /^Adicionar Joe Burger à comanda/ }).click();
    await page.getByRole('button', { name: 'Um Joe Burger a mais' }).click();
    await page.getByRole('button', { name: 'Um Joe Burger a menos' }).click();
    const linhas = await page.locator('#comanda li').allInnerTexts();
    assert.match(linhas[0], /2x JOE BURGER/);
    assert.match(linhas[1], /1x BATATA FRITA/);
    console.log('ok  2 itens, qty ajustada:', linhas.map((l) => l.split('\n')[0]).join(' | '));
    assert.match(await page.locator('[aria-live="polite"]').innerText(), /Joe Burger/);
    console.log('ok  aria-live anunciou:', (await page.locator('[aria-live="polite"]').innerText()).trim());

    await page.getByRole('textbox', { name: 'Observação para Joe Burger' }).fill('sem cebola');
    await page.getByLabel('Nome').fill('Ana Lúcia');
    await page.getByRole('radio', { name: 'Entrega' }).check();
    await page.getByRole('button', { name: 'Mandar a comanda no WhatsApp' }).click();
    await page.getByText('Escreva o endereço para a entrega.').waitFor();
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'comanda-endereco');
    assert.equal(await page.evaluate(() => window.__aberto.length), 0);
    console.log('ok  entrega sem endereço bloqueia com erro inline e foco no endereço');
    const cor = await page.locator('#erro-endereco').evaluate((e) => getComputedStyle(e).color);
    assert.equal(cor, 'rgb(200, 40, 30)');
    console.log('ok  erro em --carimbo', cor);

    await page.getByLabel('Endereço e referência').fill('Rua das Flores, 10 — portão azul');
    await page.getByRole('button', { name: 'Mandar a comanda no WhatsApp' }).click();
    await page.locator('text=ENVIADA').waitFor();
    await page.screenshot({ path: SHOTS + '/fluxo-carimbo-1280.png', clip: { x: 820, y: 100, width: 460, height: 800 } });
    await page.waitForFunction(() => window.__aberto.length === 1, null, { timeout: 3000 });
    const url = await page.evaluate(() => window.__aberto[0]);
    const u = new URL(url);
    assert.equal(u.origin + u.pathname, 'https://wa.me/553432343651');
    const texto = u.searchParams.get('text');
    assert.equal(texto, ESPERADO);
    assert.equal(decodeURIComponent(url.split('?text=')[1]), ESPERADO);
    console.log('ok  wa.me/553432343651, texto idêntico ao formato (acentos e \\n íntegros)');
    console.log('---- URL ----\n' + url + '\n---- texto ----\n' + texto + '\n-------------');

    await page.getByRole('button', { name: 'Limpar comanda' }).waitFor();
    console.log('ok  comanda mantida com botão "Limpar comanda"');

    // persistência
    await page.reload({ waitUntil: 'networkidle' });
    assert.match((await page.locator('#comanda li').allInnerTexts())[0], /2x JOE BURGER/);
    console.log('ok  comanda sobrevive ao recarregar (localStorage)');
    await page.getByRole('button', { name: 'Limpar comanda' }).click();
    await page.getByText('Sua comanda está vazia.', { exact: false }).waitFor();
    console.log('ok  limpar comanda');
    await ctx.close();
  }

  // ---------- popup bloqueado ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript(stubOpen(true));
    const page = await ctx.newPage();
    await page.goto(URL_SITE, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Adicionar Gigante à comanda' }).click();
    await page.getByLabel('Nome').fill('Zé');
    await page.getByRole('button', { name: 'Mandar a comanda no WhatsApp' }).click();
    const link = page.getByRole('link', { name: 'Abrir WhatsApp' });
    await link.waitFor({ timeout: 3000 });
    const href = await link.getAttribute('href');
    assert.ok(href.startsWith('https://wa.me/553432343651?text='));
    assert.equal(new URL(href).searchParams.get('text').split('\n')[2], '1x Gigante');
    console.log('ok  popup bloqueado → link "Abrir WhatsApp" no lugar do botão');
    await ctx.close();
  }

  // ---------- celular ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await ctx.addInitScript(stubOpen(false));
    const page = await ctx.newPage();
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) erros.push('mobile ' + m.type() + ': ' + m.text()); });
    await page.goto(URL_SITE, { waitUntil: 'networkidle' });
    const barra = page.getByRole('button', { name: /Ver comanda/ });
    assert.equal(await barra.isVisible(), false);
    await page.locator('#cardapio').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Adicionar Burger Vip à comanda' }).click();
    await page.waitForTimeout(300);
    assert.equal(await barra.isVisible(), true);
    assert.match((await barra.innerText()).replace(/\s+/g, ' '), /Ver comanda \(1\)/);
    console.log('ok  barra do celular aparece no cardápio:', (await barra.innerText()).replace(/\s+/g, ' '));
    await page.screenshot({ path: SHOTS + '/fluxo-barra-390.png' });
    await barra.click();
    const dialogo = page.getByRole('dialog');
    await dialogo.waitFor();
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Fechar');
    await page.screenshot({ path: SHOTS + '/fluxo-sheet-390.png' });
    // foco preso: Shift+Tab a partir do primeiro vai para o último dentro do diálogo
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.getElementById('comanda').contains(document.activeElement)), true);
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.getElementById('comanda').contains(document.activeElement)), true);
    }
    console.log('ok  bottom sheet com foco preso (16 tabs dentro)');
    await page.keyboard.press('Escape');
    await dialogo.waitFor({ state: 'detached' }).catch(() => {});
    assert.equal(await page.getByRole('dialog').count(), 0);
    assert.match(await page.evaluate(() => document.activeElement?.innerText || ''), /Ver comanda/);
    console.log('ok  Esc fecha e devolve o foco para "Ver comanda"');

    // botão flutuante: some no cardápio, aparece fora dele, com selo
    await page.locator('#avaliacoes').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const flutuante = page.getByRole('link', { name: /Abrir comanda \(1 item\)/ });
    assert.equal(await flutuante.isVisible(), true);
    await page.screenshot({ path: SHOTS + '/fluxo-flutuante-390.png' });
    await flutuante.click();
    await page.getByRole('dialog').waitFor();
    console.log('ok  botão flutuante com selo abre a comanda');
    await ctx.close();
  }

  await browser.close();
  console.log(erros.length ? 'CONSOLE:\n' + erros.join('\n') : 'ok  console limpo');
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
