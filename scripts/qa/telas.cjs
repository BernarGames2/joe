// QA 2 e 4: página inteira em 360/390/768/1280 (com e sem JavaScript), sem rolagem horizontal,
// console limpo e sem requisição quebrada. Uso: node scripts/qa/telas.cjs [url]
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
const URL_SITE = process.argv[2] || 'http://localhost:3000';
const SAIDA = path.resolve(process.env.QA_SAIDA || 'qa-saida');
fs.mkdirSync(SAIDA, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  let falhou = false;
  for (const js of [true, false]) {
    for (const w of [360, 390, 768, 1280]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 800 : 900 }, javaScriptEnabled: js });
      const page = await ctx.newPage();
      const erros = [];
      page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) erros.push(`${m.type()}: ${m.text()}`); });
      page.on('pageerror', (e) => erros.push('pageerror: ' + e.message));
      page.on('response', (r) => { if (r.status() >= 400) erros.push(`HTTP ${r.status()} ${r.url()}`); });
      await page.goto(URL_SITE, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      const arquivo = path.join(SAIDA, `pagina-${w}${js ? '' : '-sem-js'}.png`);
      await page.screenshot({ path: arquivo, fullPage: true });
      const ok = sw <= cw && erros.length === 0;
      falhou ||= !ok;
      console.log(`${ok ? 'ok ' : 'XX '} ${String(w).padEnd(4)} ${js ? 'com JS' : 'sem JS'}  rolagem-x=${sw > cw ? 'SIM' : 'não'}  ${erros.join(' | ') || 'console limpo'}  → ${path.relative(process.cwd(), arquivo)}`);
      await ctx.close();
    }
  }
  await browser.close();
  console.log('Abra as imagens e confira: H1 inteiro, nenhuma caixa vazia, ilustração nítida, comanda legível.');
  process.exit(falhou ? 1 : 0);
})();
