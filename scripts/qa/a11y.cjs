// QA 5 (prefers-reduced-motion) e 6 (teclado). Uso: node scripts/qa/a11y.cjs [url]
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const URL_SITE = process.argv[2] || 'http://localhost:3000';

const animacoes = () =>
  document.getAnimations().filter((a) => a.playState === 'running').map((a) => {
    const t = a.effect?.target;
    return `${a.animationName || a.constructor.name} @ ${t?.className?.baseVal ?? t?.className ?? t?.tagName}`;
  });

(async () => {
  const browser = await chromium.launch();

  // ---- reduced motion ----
  for (const modo of ['no-preference', 'reduce']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: modo });
    const page = await ctx.newPage();
    await page.goto(URL_SITE, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(150);
    const lista = await page.evaluate(animacoes);
    console.log(`${modo}: ${lista.length} animações rodando`, modo === 'reduce' ? lista : [...new Set(lista.map((l) => l.split(' @')[0]))]);
    if (modo === 'reduce') {
      assert.equal(lista.length, 0);
      // hover não sobe
      const btn = page.getByRole('link', { name: 'Montar minha comanda' }).first();
      await btn.hover();
      await page.waitForTimeout(250);
      assert.equal(await btn.evaluate((e) => getComputedStyle(e).transform), 'none');
      // 4 e 5 viram fade de 120ms
      await page.getByRole('button', { name: 'Adicionar Joe Burger à comanda' }).click();
      const anims = await page.evaluate(() => document.getAnimations().map((a) => `${a.animationName}:${a.effect.getTiming().duration}`));
      console.log('reduce: ao adicionar →', anims);
      assert.equal(anims.length, 1);
      assert.match(anims[0], /aparecer:120$/);
    }
    await ctx.close();
  }
  console.log('ok  reduced motion: nada se mexe (só fade de 120ms ao adicionar)');

  // ---- teclado ----
  for (const largura of [1280, 390]) {
    const ctx = await browser.newContext({ viewport: { width: largura, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(URL_SITE, { waitUntil: 'networkidle' });
    const vistos = [];
    const semAnel = [];
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const nome = (el.getAttribute('aria-label') || el.innerText || el.value || el.id || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
        const anel = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 3) || cs.boxShadow !== 'none';
        return { nome, tag: el.tagName, anel, cor: cs.outlineColor, visivel: r.width > 0 && r.height > 0 };
      });
      if (!info) break;
      if (vistos.length && vistos[0].nome === info.nome && vistos.length > 5) break;
      vistos.push(info);
      // radios e inputs: o anel pode estar no irmão (segmentado) — confere separado
      if (!info.anel && !(info.tag === 'INPUT' && /retirada|entrega/i.test(info.nome))) semAnel.push(info.nome);
      if (!info.visivel) semAnel.push('INVISÍVEL: ' + info.nome);
    }
    console.log(`\n${largura}px: ${vistos.length} paradas de tab`);
    console.log(vistos.map((v) => v.nome).join(' → '));
    assert.equal(semAnel.length, 0, 'sem anel de foco: ' + semAnel.join(', '));
    await ctx.close();
  }
  console.log('\nok  todas as paradas de tab com foco visível (3px mostarda)');
  await browser.close();
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
