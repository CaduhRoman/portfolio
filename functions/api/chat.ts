/// <reference types="@cloudflare/workers-types" />
import { SYSTEM_PROMPT } from "./_context";

// POST /api/chat — proxy entre o widget e a Groq. A chave nunca chega ao navegador.

type Env = {
  GROQ_API_KEY: string;
  GROQ_MODEL?: string;
  /** Sem ela, o endpoint aceita perguntas sem verificação (útil antes de criar as chaves). */
  TURNSTILE_SECRET_KEY?: string;
};

type Message = { role: "user" | "assistant"; content: string };

const DEFAULT_MODEL = "openai/gpt-oss-20b";
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

// Pergunta ao Cloudflare se o token do Turnstile é legítimo. Cada token só passa uma vez.
async function verifyTurnstile(token: unknown, secret: string, ip: string) {
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  form.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  const outcome = (await res.json()) as { success?: boolean };
  return outcome.success === true;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.GROQ_API_KEY) return json({ error: "Assistant is not configured." }, 500);

  const ip = request.headers.get("cf-connecting-ip") ?? "local";
  if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

  let body: { messages?: unknown; token?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  const messages = sanitize(body.messages);
  if (!messages) return json({ error: "Invalid messages." }, 400);

  if (env.TURNSTILE_SECRET_KEY && !(await verifyTurnstile(body.token, env.TURNSTILE_SECRET_KEY, ip))) {
    return json({ error: "verification_failed" }, 403);
  }

  const model = env.GROQ_MODEL || DEFAULT_MODEL;
  // Modelos gpt-oss raciocinam antes de responder; esforço baixo basta e poupa tokens.
  const reasoning = model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {};

  const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.GROQ_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      ...reasoning,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.5,
      max_tokens: 800,
    }),
  });

  if (!upstream.ok) {
    // O detalhe fica só no log da Function; o visitante recebe um erro genérico.
    console.error("groq", upstream.status, await upstream.text());
    return json({ error: upstream.status === 429 ? "rate_limited" : "upstream_error" }, upstream.status === 429 ? 429 : 502);
  }

  const data = (await upstream.json()) as { choices?: { message?: { content?: string } }[] };
  // O chat mostra texto puro; tira o negrito em markdown que o modelo às vezes usa mesmo instruído a não usar.
  const reply = data.choices?.[0]?.message?.content?.replace(/\*\*(.+?)\*\*/g, "$1").trim();
  return reply ? json({ reply }) : json({ error: "upstream_error" }, 502);
};
