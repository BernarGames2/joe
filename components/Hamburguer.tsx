// Ilustração original do hambúrguer em corte, estilo adesivo.
// Mesmo desenho em duas versões: montado (hero) e desmontado com legendas (A casa).
import { CAMADAS, Gradientes, T, TRACO } from "./hamburguer-desenho";
import styles from "./Hamburguer.module.css";

// Legendas da versão desmontada: [camada, texto, lado, y da legenda].
const LEGENDAS: { camada: string; texto: string; lado: "e" | "d" }[] = [
  { camada: "pao-cima", texto: "pão", lado: "d" },
  { camada: "alface", texto: "salada", lado: "e" },
  { camada: "queijo", texto: "queijo", lado: "d" },
  { camada: "carne", texto: "carne", lado: "e" },
  { camada: "pao-baixo", texto: "pão", lado: "d" },
];

// Centro vertical aproximado de cada camada no desenho montado.
const CENTRO: Record<string, number> = {
  "pao-baixo": 376,
  bacon: 347,
  carne: 311,
  queijo: 276,
  alface: 262,
  tomate: 240,
  "pao-cima": 176,
};
const BORDA: Record<string, [number, number]> = {
  "pao-baixo": [44, 356],
  carne: [46, 356],
  queijo: [44, 356],
  alface: [44, 360],
  "pao-cima": [64, 340],
};

const VAO = 30; // afastamento entre camadas na versão desmontada

export function Hamburguer({
  variante = "montado",
  idBase,
  className,
}: {
  variante?: "montado" | "desmontado";
  idBase: string;
  className?: string;
}) {
  const g = (n: string) => `${idBase}-${n}`;
  const desmontado = variante === "desmontado";
  const desloc = (i: number) => (desmontado ? -i * VAO : 0);
  const topo = desmontado ? 118 - 6 * VAO - 24 : 100;
  const viewBox = desmontado ? `-110 ${topo} 620 ${410 - topo}` : "0 0 400 460";

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={desmontado ? "Ilustração de um hambúrguer desmontado em camadas" : "Ilustração de um hambúrguer em camadas"}
      className={`${styles.svg} ${desmontado ? "" : styles.montado} ${className ?? ""}`}
    >
      <Gradientes g={g} />
      {/* sombra no chão */}
      <ellipse cx="200" cy="410" rx="150" ry="10" fill="#000" opacity=".35" />
      {CAMADAS.map((c, i) => (
        <g key={c.id} transform={desloc(i) ? `translate(0 ${desloc(i)})` : undefined}>
          <g
            className={styles.camada}
            style={{ "--i": i } as React.CSSProperties}
            stroke={TRACO}
            strokeWidth={T}
            strokeLinejoin="round"
          >
            {c.desenho(g)}
          </g>
        </g>
      ))}
      {desmontado &&
        LEGENDAS.map((l) => {
          const i = CAMADAS.findIndex((c) => c.id === l.camada);
          const y = CENTRO[l.camada] + desloc(i);
          const [xe, xd] = BORDA[l.camada];
          const dir = l.lado === "d";
          const xPonta = dir ? xd + 10 : xe - 10;
          const xTexto = dir ? xd + 64 : xe - 64;
          const curva = dir
            ? `M${xTexto - 8} ${y - 6}C${xTexto - 26} ${y - 14} ${xPonta + 22} ${y - 10} ${xPonta} ${y}`
            : `M${xTexto + 8} ${y - 6}C${xTexto + 26} ${y - 14} ${xPonta - 22} ${y - 10} ${xPonta} ${y}`;
          const ponta = dir
            ? `M${xPonta + 9} ${y - 7}L${xPonta} ${y}L${xPonta + 11} ${y + 3}`
            : `M${xPonta - 9} ${y - 7}L${xPonta} ${y}L${xPonta - 11} ${y + 3}`;
          return (
            <g key={`${l.camada}-${l.texto}`} className={styles.legenda}>
              <path d={curva} />
              <path d={ponta} />
              <text x={xTexto} y={y + 2} textAnchor={dir ? "start" : "end"} dominantBaseline="middle">
                {l.texto}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
