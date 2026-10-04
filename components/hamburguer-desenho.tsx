// Desenho do hambúrguer (sem CSS), compartilhado pela página e pela imagem de Open Graph.
// Contorno grosso em carvão, preenchimento chapado com um degradê sutil por camada,
// brilho curto em branco 25%.

export const TRACO = "#0E0F10";
export const T = 5; // espessura do contorno

export type Camada = { id: string; nome: string; desenho: (g: (n: string) => string) => React.ReactNode };

// Gergelim: posição, rotação.
export const SEMENTES: [number, number, number][] = [
  [132, 152, -24], [170, 139, -10], [208, 135, 4], [246, 141, 16], [281, 155, 28],
  [104, 178, -34], [148, 170, -14], [190, 163, 0], [230, 166, 12], [270, 176, 24],
  [308, 186, 36], [126, 202, -20], [212, 194, 6], [292, 207, 30],
];

// Camadas de baixo para cima (ordem de pintura). Cada uma é um <g> separado.
export const CAMADAS: Camada[] = [
  {
    id: "pao-baixo",
    nome: "pão de baixo",
    desenho: (g) => (
      <g>
        <path
          d="M54 352H346C356 352 361 358 359 367C352 390 330 401 300 401H100C70 401 48 390 41 367C39 358 44 352 54 352Z"
          fill={`url(#${g("pao2")})`}
        />
        <path d="M76 372C86 384 100 389 122 390" stroke="#fff" strokeOpacity=".25" strokeWidth="7" strokeLinecap="round" fill="none" />
      </g>
    ),
  },
  {
    id: "bacon",
    nome: "bacon",
    desenho: (g) => (
      <g>
        <path
          d="M50 340C76 330 104 330 128 338S178 348 204 338 254 328 280 338 328 348 352 336L354 354C330 366 306 362 280 356S230 346 204 356 154 366 128 356 76 348 48 358Z"
          fill={`url(#${g("bacon")})`}
        />
        <path
          d="M70 346C92 340 110 342 128 347S176 354 204 347 254 338 280 347 322 352 338 346"
          stroke="#F2A58B"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    ),
  },
  {
    id: "carne",
    nome: "carne",
    desenho: (g) => (
      <g>
        <path
          d="M54 284C84 278 140 281 200 279S318 280 348 285C360 295 362 327 351 337C320 344 262 341 200 343S82 344 52 338C39 327 41 295 54 284Z"
          fill={`url(#${g("carne")})`}
        />
        <g stroke="#2A140B" strokeWidth="5" strokeLinecap="round" opacity=".75">
          <path d="M92 300l26 20" />
          <path d="M150 297l26 20" />
          <path d="M208 296l26 20" />
          <path d="M266 297l26 20" />
        </g>
        <path d="M70 296C64 304 63 316 66 324" stroke="#fff" strokeOpacity=".25" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>
    ),
  },
  {
    id: "queijo",
    nome: "queijo",
    desenho: (g) => (
      <g>
        <path
          d="M40 264H360L350 286H286C281 286 279 290 279 295V303C279 315 261 315 261 303V295C261 290 258 286 253 286H132C126 286 123 290 123 296V316C123 330 103 330 103 316V295C103 290 99 286 94 286H50Z"
          fill={`url(#${g("queijo")})`}
        />
        <path d="M108 296V312" stroke="#fff" strokeOpacity=".3" strokeWidth="4" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "alface",
    nome: "salada",
    desenho: (g) => (
      <g>
        <path
          d="M46 246H354C364 250 366 262 356 268C342 282 326 280 316 270C304 284 284 284 274 270C262 284 242 284 232 270C220 284 200 284 190 270C178 284 158 284 148 270C136 284 116 284 106 270C94 284 72 284 60 272C40 266 36 252 46 246Z"
          fill={`url(#${g("alface")})`}
        />
        <path d="M120 258H170M220 256H262" stroke="#fff" strokeOpacity=".25" strokeWidth="4" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "tomate",
    nome: "tomate",
    desenho: (g) => (
      <g>
        <rect x="64" y="226" width="148" height="26" rx="13" fill={`url(#${g("tomate")})`} />
        <rect x="190" y="228" width="148" height="26" rx="13" fill={`url(#${g("tomate")})`} />
        <path d="M84 244H120M300 246H316" stroke="#fff" strokeOpacity=".3" strokeWidth="4" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "pao-cima",
    nome: "pão de cima",
    desenho: (g) => (
      <g>
        <path
          d="M48 222C44 160 110 118 200 118S356 160 352 222C352 230 346 236 338 236H62C54 236 48 230 48 222Z"
          fill={`url(#${g("pao")})`}
        />
        <g fill="#FBF0D6" stroke={TRACO} strokeWidth="2">
          {SEMENTES.map(([x, y, r]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="6.5" ry="3" transform={`rotate(${r} ${x} ${y})`} />
          ))}
        </g>
        <path d="M82 190C88 166 106 148 132 136" stroke="#fff" strokeOpacity=".25" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>
    ),
  },
];

export function Gradientes({ g }: { g: (n: string) => string }) {
  const v = (id: string, a: string, b: string) => (
    <linearGradient id={g(id)} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={a} />
      <stop offset="1" stopColor={b} />
    </linearGradient>
  );
  return (
    <defs>
      {v("pao", "#F2AE58", "#D07B2C")}
      {v("pao2", "#E8A251", "#B96B26")}
      {v("tomate", "#E8503E", "#B92E22")}
      {v("alface", "#86BE48", "#4E8B2B")}
      {v("queijo", "#FFD45A", "#F2A41C")}
      {v("carne", "#73402A", "#3F2013")}
      {v("bacon", "#D2533A", "#A43722")}
    </defs>
  );
}

