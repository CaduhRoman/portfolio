import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "../i18n";
import Mascot, { type MascotMood } from "./Mascot";
import { createTurnstile, SITE_KEY } from "./turnstile";

type Message = { role: "user" | "assistant"; content: string };

const INTRO_KEY = "assistant-intro-seen";

const reducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function introSeen() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

// Caminho da entrada: vem da esquerda, cruza o meio da tela e faz um arco até o canto.
// Os pontos são relativos à posição final do botão, que é onde ele já está no layout.
function flyIn(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const at = (x: number, y: number) => `translate(${x - rect.left - rect.width / 2}px, ${y - rect.top - rect.height / 2}px)`;

  return el.animate(
    [
      { transform: `${at(-rect.width, vh * 0.62)} rotate(-20deg)`, offset: 0 },
      { transform: `${at(vw * 0.25, vh * 0.42)} rotate(8deg)`, offset: 0.25 },
      { transform: `${at(vw * 0.5, vh * 0.5)} rotate(-6deg) scale(1.35)`, offset: 0.45 },
      { transform: `${at(vw * 0.72, vh * 0.28)} rotate(10deg) scale(1.2)`, offset: 0.68 },
      { transform: `${at(vw * 0.9, vh * 0.45)} rotate(-4deg)`, offset: 0.85 },
      { transform: "translate(0, 0)", offset: 1 },
    ],
    { duration: 2600, delay: 700, easing: "cubic-bezier(0.45, 0, 0.25, 1)", fill: "backwards" },
  );
}


export function ChatWidget() {
  const { t, lang } = useI18n();
  const copy = t.assistant;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mood, setMood] = useState<MascotMood>("idle");
  const [hovered, setHovered] = useState(false);
  const [poke, setPoke] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  // Decidido uma vez na montagem; o efeito abaixo pode rodar duas vezes no StrictMode.
  const [playIntro] = useState(() => !introSeen());
  const [entering, setEntering] = useState(playIntro && !reducedMotion);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const turnstile = useRef<ReturnType<typeof createTurnstile> | null>(null);

  // O Turnstile só existe com o painel aberto; o token da primeira pergunta já vai sendo gerado.
  useEffect(() => {
    if (!open || !SITE_KEY || !captchaRef.current) return;
    const ts = createTurnstile(captchaRef.current, lang);
    turnstile.current = ts;
    return () => {
      ts.destroy();
      turnstile.current = null;
    };
  }, [open, lang]);

  // Primeira visita da sessão: entrada animada e balão de apresentação.
  useEffect(() => {
    if (!playIntro) return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // Sem persistência; a animação pode repetir num recarregamento.
    }

    let hideTimer = 0;
    const land = () => {
      setEntering(false);
      setPoke((n) => n + 1);
      setShowIntro(true);
      hideTimer = window.setTimeout(() => setShowIntro(false), 9000);
    };

    const el = launcherRef.current;
    if (!el || reducedMotion) {
      const t = window.setTimeout(land, 800);
      return () => window.clearTimeout(t);
    }
    // O delay da animação deixa a página assentar; durante ele a nuvem já fica fora da tela.
    const anim = flyIn(el);
    anim.onfinish = land;
    return () => {
      window.clearTimeout(hideTimer);
      anim.cancel();
    };
  }, [playIntro]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    setMood("thinking");

    let token: string | undefined;
    try {
      token = turnstile.current ? await turnstile.current.take() : undefined;
    } catch {
      setError(copy.errors.verification);
      setMood("idle");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next, token }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setError(
          data.error === "rate_limited"
            ? copy.errors.rate_limited
            : data.error === "verification_failed"
              ? copy.errors.verification
              : copy.errors.generic,
        );
        setMood("idle");
        return;
      }
      setMessages([...next, { role: "assistant", content: data.reply }]);
      setMood("talking");
      setPoke((n) => n + 1);
      window.setTimeout(() => setMood("idle"), 1600);
    } catch {
      setError(copy.errors.generic);
      setMood("idle");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function toggle() {
    setShowIntro(false);
    setOpen((o) => !o);
    setPoke((n) => n + 1);
  }

  return (
    <div className={`assistant${open ? " assistant--open" : ""}`}>
      {open && (
        <section className="assistant-panel" role="dialog" aria-label={copy.subtitle}>
          <header className="assistant-head">
            <div>
              <strong>{copy.name}</strong>
              <span>{copy.subtitle}</span>
            </div>
            <button type="button" className="assistant-close" onClick={() => setOpen(false)} aria-label={copy.close}>
              ×
            </button>
          </header>

          <div className="assistant-messages" ref={listRef} aria-live="polite">
            <p className="bubble bubble--assistant">{copy.greeting}</p>
            {messages.map((m, i) => (
              <p key={i} className={`bubble bubble--${m.role}`}>
                {m.content}
              </p>
            ))}
            {loading && <p className="bubble bubble--assistant bubble--typing">{copy.thinking}</p>}
            {error && <p className="assistant-error">{error}</p>}
          </div>

          {messages.length === 0 && (
            <div className="assistant-suggestions">
              {copy.suggestions.map((s) => (
                <button key={s} type="button" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={captchaRef} className="assistant-captcha" />

          <form className="assistant-form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={copy.placeholder}
              maxLength={600}
              aria-label={copy.placeholder}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              {copy.send}
            </button>
          </form>
        </section>
      )}

      {showIntro && !open && (
        <div className="assistant-intro" role="status">
          <button type="button" className="assistant-intro-text" onClick={toggle}>
            {copy.intro}
          </button>
          <button type="button" className="assistant-intro-close" onClick={() => setShowIntro(false)} aria-label={copy.dismiss}>
            ×
          </button>
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        className={`assistant-launcher${entering ? " assistant-launcher--entering" : ""}`}
        onClick={toggle}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        aria-label={open ? copy.close : copy.open}
        aria-expanded={open}
      >
        <Mascot mood={mood} hovered={hovered} poke={poke} />
      </button>
    </div>
  );
}
