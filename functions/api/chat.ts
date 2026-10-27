/// <reference types="@cloudflare/workers-types" />
import { SYSTEM_PROMPT } from "./_context";

// POST /api/chat — proxy entre o widget e a Groq. A chave nunca chega ao navegador.

type Env = {
  GROQ_API_KEY: string;
  GROQ_MODEL?: string;
};

type Message = { role: "user" | "assistant"; content: string };

const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const MAX_HISTORY = 10;
const MAX_CHARS = 600;

// Limite por IP, por instância. Não é à prova de tudo, mas segura abuso casual.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function sanitize(input: unknown): Message[] | null {
  if (!Array.isArray(input)) return null;
  const messages = input
    .filter(
      (m): m is Message =>
        m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim() !== "",
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  return messages.length && messages[messages.length - 1].role === "user" ? messages : null;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.GROQ_API_KEY) return json({ error: "Assistant is not configured." }, 500);

  const ip = request.headers.get("cf-connecting-ip") ?? "local";
  if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  const messages = sanitize(body.messages);
  if (!messages) return json({ error: "Invalid messages." }, 400);

  const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.GROQ_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: env.GROQ_MODEL || DEFAULT_MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.5,
      max_tokens: 300,
    }),
  });

  if (!upstream.ok) {
    console.error("groq", upstream.status, await upstream.text());
    return json({ error: upstream.status === 429 ? "rate_limited" : "upstream_error" }, upstream.status === 429 ? 429 : 502);
  }

  const data = (await upstream.json()) as { choices?: { message?: { content?: string } }[] };
  const reply = data.choices?.[0]?.message?.content?.trim();
  return reply ? json({ reply }) : json({ error: "upstream_error" }, 502);
};
