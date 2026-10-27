import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "../i18n";
import Mascot, { type MascotMood } from "./Mascot";

type Message = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "assistant-chat";

// A conversa vive só nesta aba; fechar o site esquece tudo.
function loadHistory(): Message[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Message[]) : [];
  } catch {
    return [];
  }
}

export function ChatWidget() {
  const { t } = useI18n();
  const copy = t.assistant;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mood, setMood] = useState<MascotMood>("idle");
  const [hovered, setHovered] = useState(false);
  const [poke, setPoke] = useState(0);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Sem persistência; a conversa continua na memória.
    }
  }, [messages]);

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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setError(data.error === "rate_limited" ? copy.errors.rate_limited : copy.errors.generic);
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

      <button
        type="button"
        className="assistant-launcher"
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
