// QA 8 e 9: palavras proibidas (texto, HTML e atributos), 404 e console. Uso: node scripts/qa/palavras.cjs [url]
const { chromium } = require('playwright');
const log = console.log;
console.log = (...a) => { if (String(a[0]).startsWith('XX')) process.exitCode = 1; log(...a); };
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const quebradas = [];
  page.on('response', (r) => { if (r.status() >= 400) quebradas.push(r.status() + ' ' + r.url()); });
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) quebradas.push('console ' + m.type() + ': ' + m.text()); });
  await page.goto(process.argv[2] || 'http://localhost:3000', { waitUntil: 'networkidle' });
  const texto = await page.evaluate(() => document.body.innerText);
  const html = await page.content();
  const alts = await page.evaluate(() => [...document.querySelectorAll('[alt],[aria-label],[title],[placeholder]')].map((e) => [e.getAttribute('alt'), e.getAttribute('aria-label'), e.getAttribute('title'), e.getAttribute('placeholder')].filter(Boolean).join(' ')).join(' | '));
  for (const [nome, re] of [['R$', /R\$/], ['Lorem', /lorem/i], ['A CONFIRMAR', /a confirmar/i], ['FOTO', /foto/i], ['inigual', /inigual/i], ['experiência gastronômica', /experi[eê]ncia gastron/i], ['sabor', /sabor/i]]) {
    const t = (texto.match(new RegExp(re, 'g')) || []).length, h = (html.match(new RegExp(re, 'g')) || []).length, a = (alts.match(new RegExp(re, 'g')) || []).length;
    console.log(`${t === 0 && h === 0 && a === 0 ? 'ok ' : 'XX '} ${nome.padEnd(26)} texto=${t} html=${h} atributos=${a}`);
  }
  // "melhor" só dentro das aspas da avaliação
  const ocorr = [...texto.matchAll(/.{0,40}melhor.{0,40}/gi)].map((m) => m[0]);
  const fora = ocorr.filter((o) => !/“melhor hambúrguer de uberlândia/i.test(o));
  console.log(`${fora.length === 0 ? 'ok ' : 'XX '} "melhor" só na citação: ${JSON.stringify(ocorr)}`);
  const emojis = (texto.replace(/©/g, '').match(/\p{Extended_Pictographic}/gu)) || [];
  console.log(`${emojis.length === 0 ? 'ok ' : 'XX '} emoji no texto: ${emojis.length}`);
  console.log(quebradas.length ? 'XX  ' + quebradas.join('\n    ') : 'ok  sem 404 e console limpo');
  await browser.close();
})();
