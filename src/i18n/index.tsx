import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionaries, type Dictionary, type Language } from "./dictionaries";

const STORAGE_KEY = "lang";
const DEFAULT_LANGUAGE: Language = "en";

type I18n = {
  lang: Language;
  t: Dictionary;
  setLang: (lang: Language) => void;
};

const I18nContext = createContext<I18n | null>(null);

function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in dictionaries) return saved as Language;
  } catch {
    // Storage bloqueado: segue o padrão.
  }
  return DEFAULT_LANGUAGE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(initialLanguage);
  const t = dictionaries[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Sem persistência; a troca continua valendo nesta visita.
    }
  }, [lang, t]);

  return <I18nContext.Provider value={{ lang, t, setLang }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n precisa estar dentro de <I18nProvider>");
  return context;
}
