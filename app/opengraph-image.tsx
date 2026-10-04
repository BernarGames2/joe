import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CAMADAS, Gradientes, T, TRACO } from "@/components/hamburguer-desenho";
import { LOGO_SRC, TEM_LOGO } from "@/lib/brand";

export const alt = "Joe Burger Artesanal — Peça direto pra chapa.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TEXTO = "JOE BURGER ARTESANAL Peça direto pra chapa.";

/** Big Shoulders 900 (corte Display) direto do Google Fonts; sem rede, cai na fonte padrão. */
async function fonte(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Big+Shoulders:opsz,wght@72,900&text=${encodeURIComponent(TEXTO)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

async function logo(): Promise<string | null> {
  if (!TEM_LOGO) return null;
  try {
    const buf = await readFile(join(process.cwd(), "public", LOGO_SRC));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image() {
  const [dadosFonte, logoSrc] = await Promise.all([fonte(), logo()]);
  const g = (n: string) => `og-${n}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          backgroundColor: "#0E0F10",
          backgroundImage: "radial-gradient(circle at 78% 50%, rgba(242,107,29,0.42), rgba(242,107,29,0) 42%)",
          fontFamily: dadosFonte ? "Big Shoulders" : undefined,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} width={96} height={96} alt="" style={{ borderRadius: 48, marginBottom: 32 }} />
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", fontSize: 112, fontWeight: 900, lineHeight: 0.9, color: "#F5F1E8" }}>
            <span>JOE BURGER</span>
            <span>ARTESANAL</span>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 64, fontWeight: 900, color: "#F26B1D" }}>
            Peça direto pra chapa.
          </div>
        </div>
        <svg width="400" height="460" viewBox="0 0 400 460">
          {Gradientes({ g })}
          <ellipse cx="200" cy="410" rx="150" ry="10" fill="#000" opacity=".35" />
          {CAMADAS.map((c) => (
            <g key={c.id} stroke={TRACO} strokeWidth={T} strokeLinejoin="round">
              {c.desenho(g)}
            </g>
          ))}
        </svg>
      </div>
    ),
    {
      ...size,
      fonts: dadosFonte ? [{ name: "Big Shoulders", data: dadosFonte, weight: 900, style: "normal" }] : undefined,
    },
  );
}
