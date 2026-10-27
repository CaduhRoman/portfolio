import { useEffect, useMemo, useRef } from "react";

// Romi em pixel art: a nuvem é gerada a partir de círculos numa grade, no mesmo
// estilo do personagem do hero. Desenhada num canvas minúsculo e ampliada sem suavização.

export type MascotMood = "idle" | "thinking" | "talking";

type Props = {
  mood: MascotMood;
  hovered: boolean;
  /** Muda a cada clique; cada mudança dá um "boing" no corpo. */
  poke: number;
};

const W = 28;
const H = 24;
// Margem em volta da nuvem para os tracinhos e a deformação não cortarem.
const PAD = 3;
const COLORS = { o: "#1b1b1f", w: "#f4f5fa", s: "#cdd1e0", h: "#ffffff" };

// Gomos da nuvem: [x, y, raio] em pixels da grade.
const LOBES: [number, number, number][] = [
  [14, 14, 8.2],
  [9, 11, 5.4],
  [17.5, 9.5, 5.6],
  [7.5, 16, 4.6],
  [20.5, 15, 5.2],
];

type Pixel = { x: number; y: number; c: keyof typeof COLORS };

function buildCloud(): Pixel[] {
  const filled = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < W && y < H && LOBES.some(([cx, cy, r]) => (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 < r * r);

  const pixels: Pixel[] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (filled(x, y)) {
        // Sombra embaixo, brilho no topo à esquerda: a luz vem de cima.
        const c = !filled(x + 1, y + 2) || !filled(x, y + 2) ? "s" : !filled(x - 1, y - 2) && filled(x + 1, y) ? "h" : "w";
        pixels.push({ x, y, c });
      } else if (filled(x + 1, y) || filled(x - 1, y) || filled(x, y + 1) || filled(x, y - 1)) {
        pixels.push({ x, y, c: "o" });
      }
    }
  }
  return pixels;
}

// Os tracinhos ficam fora da nuvem, então precisam contrastar com o fundo da página.
const sparkColor = "#9aa0b4";

const reducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mola amortecida 1D: dá o "exagero e volta" que faz o corpo parecer gelatina.
function spring(s: { x: number; v: number }, target: number, k: number, c: number, dt: number) {
  s.v += (-k * (s.x - target) - c * s.v) * dt;
  s.x += s.v * dt;
}

// Tracinhos de "surpresa" no canto, como na referência.
const SPARK_PIXELS = [
  [1, 5],
  [2, 6],
  [3, 7],
  [5, 1],
  [5, 2],
  [6, 3],
];

export default function Mascot({ mood, hovered, poke }: Props) {
  const cloud = useMemo(buildCloud, []);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);

  // O loop lê as props daqui para não reiniciar a cada render.
  const live = useRef({ mood, hovered });
  live.current = { mood, hovered };

  const sim = useRef({
    px: 0,
    py: 0,
    speed: 0,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    tilt: { x: 0, v: 0 },
    squash: { x: 1, v: 0 },
    hop: { x: 0, v: 0 },
    energy: 0,
    blinkAt: 2,
    blink: 0,
  });

  // Cada clique empurra as molas: achata, pula e chacoalha.
  useEffect(() => {
    if (!poke) return;
    const s = sim.current;
    s.squash.v -= 7;
    s.hop.v -= 9;
    s.tilt.v += (Math.random() - 0.5) * 120;
    s.energy = 1;
  }, [poke]);

  useEffect(() => {
    const s = sim.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const onMove = (e: PointerEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      s.px = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2)));
      s.py = Math.max(-1, Math.min(1, (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2)));
      const dt = Math.max(e.timeStamp - s.lastT, 1);
      s.speed = Math.min(s.speed + (Math.hypot(e.clientX - s.lastX, e.clientY - s.lastY) / dt) * 0.08, 1.5);
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.lastT = e.timeStamp;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const px = (x: number, y: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(x + PAD, y + PAD, 1, 1);
    };

    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - prev) / 1000, 1 / 30);
      prev = now;
      const t = now / 1000;
      const { mood, hovered } = live.current;
      const motion = reducedMotion ? 0.3 : 1;

      // Velocidade do mouse decai sozinha e vira "energia" que agita o corpo.
      s.speed *= Math.exp(-dt * 3);
      const moodEnergy = mood === "thinking" ? 0.6 : mood === "talking" ? 0.4 : hovered ? 0.3 : 0;
      s.energy += (Math.max(s.speed, moodEnergy) - s.energy) * Math.min(1, dt * 4);

      // Inclina para o lado do cursor, com balanço ocioso e tremidinha quando agitado.
      const wobble = Math.sin(t * 18) * s.energy * 3;
      const thinking = mood === "thinking" ? Math.sin(t * 3) * 8 : 0;
      spring(s.tilt, (s.px * 12 + Math.sin(t * 0.8) * 3 + thinking + wobble) * motion, 60, 8, dt);

      // Squash & stretch preservando volume; "falando" pulsa.
      const talk = mood === "talking" ? Math.sin(t * 16) * 0.05 : 0;
      spring(s.squash, 1 + talk + Math.sin(t * 2.2) * 0.02 * motion, 140, 9, dt);
      spring(s.hop, 0, 70, 9, dt);
      const sy = s.squash.x;
      const sx = 1 / Math.sqrt(Math.max(sy, 0.5));
      const bob = (Math.sin(t * 1.8) * 0.6 * motion + Math.min(s.hop.x, 0.5)) * 4;

      const canvas = canvasRef.current!;
      canvas.style.transform = `translateY(${bob}%) rotate(${s.tilt.x}deg) scale(${sx}, ${sy})`;
      // A sombra encolhe quando ele sobe.
      const lift = Math.max(0, -bob) / 10;
      shadowRef.current!.style.transform = `scaleX(${1 - lift * 0.4})`;
      shadowRef.current!.style.opacity = String(1 - lift * 0.6);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of cloud) px(p.x, p.y, COLORS[p.c]);

      // Olhos andam pixel a pixel na direção do cursor.
      const look = mood === "thinking" ? { x: 1, y: -1 } : { x: Math.round(s.px * 2), y: Math.round(s.py * 1.5) };
      if (t > s.blinkAt) {
        s.blink = 1;
        s.blinkAt = t + 2.5 + Math.random() * 3.5;
      }
      s.blink = Math.max(0, s.blink - dt * 8);
      // Piscando vira um tracinho; pensando, olhos semicerrados.
      const eyeH = s.blink > 0.15 ? 1 : mood === "thinking" ? 2 : 4;
      for (const ex of [12, 17]) {
        const x = ex + look.x;
        const y = 13 + look.y + (4 - eyeH);
        for (let dy = 0; dy < eyeH; dy++) for (let dx = 0; dx < 2; dx++) px(x + dx, y + dy, COLORS.o);
        if (eyeH > 2) px(x, y, COLORS.h);
      }

      // Tracinhos de "surpresa": aparecem e saltitam quando algo acontece.
      const spark = Math.min(1, s.energy * 1.4 + (hovered ? 0.5 : 0));
      if (spark > 0.15) {
        const lift = Math.round(-spark * 1.5 + Math.sin(t * 6) * spark);
        for (const [x, y] of SPARK_PIXELS) px(x - 2, y - 2 + lift, sparkColor);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [cloud]);

  return (
    <div ref={wrapRef} className="mascot" aria-hidden="true">
      <span ref={shadowRef} className="mascot-shadow" />
      <canvas ref={canvasRef} width={W + PAD * 2} height={H + PAD * 2} />
    </div>
  );
}
