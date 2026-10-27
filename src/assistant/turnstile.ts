// Cloudflare Turnstile: um "captcha invisível". Ele roda verificações no navegador e entrega um
// token de uso único que a Function confere antes de chamar a Groq.
// Docs: https://developers.cloudflare.com/turnstile/

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Sem site key configurada, o chat funciona sem a proteção (útil enquanto você não criou as chaves).
export const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

let scriptPromise: Promise<TurnstileApi> | null = null;

// Só baixa o script quando o chat é aberto pela primeira vez.
function loadScript() {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile")));
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// Um widget por chat aberto. Cada token vale para uma pergunta só; depois de usado,
// o widget é resetado e gera o próximo em segundo plano.
// onInteractive avisa quando o Cloudflare passa a pedir um clique (true) e quando ele acaba (false).
export function createTurnstile(container: HTMLElement, lang: string, onInteractive?: (needed: boolean) => void) {
  let widgetId: string | null = null;
  let token: string | null = null;
  let waiting: ((token: string) => void)[] = [];
  let failed: ((error: Error) => void)[] = [];

  const ready = loadScript().then((api) => {
    widgetId = api.render(container, {
      sitekey: SITE_KEY,
      // Invisível, a não ser que o Cloudflare desconfie e precise de um clique.
      appearance: "interaction-only",
      language: lang === "pt" ? "pt-br" : "en",
      callback: (t: string) => {
        token = t;
        waiting.forEach((resolve) => resolve(t));
        waiting = [];
        failed = [];
      },
      "expired-callback": () => (token = null),
      "before-interactive-callback": () => onInteractive?.(true),
      "after-interactive-callback": () => onInteractive?.(false),
      "error-callback": () => {
        onInteractive?.(false);
        failed.forEach((reject) => reject(new Error("turnstile")));
        waiting = [];
        failed = [];
      },
    });
    return api;
  });

  return {
    /** Entrega um token novo e já pede o próximo. */
    async take(): Promise<string> {
      const api = await ready;
      const t =
        token ??
        (await new Promise<string>((resolve, reject) => {
          waiting.push(resolve);
          failed.push(reject);
        }));
      token = null;
      if (widgetId) api.reset(widgetId);
      return t;
    },
    destroy() {
      ready.then((api) => widgetId && api.remove(widgetId)).catch(() => {});
    },
  };
}
