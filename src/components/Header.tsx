import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { profile } from "../profile";
import { useTheme } from "../theme";

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "#projetos", label: t.header.nav.projects },
    { href: "#formacao", label: t.header.nav.education },
    { href: "#contato", label: t.header.nav.contact },
  ];

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // Os dois botões mostram o destino: o idioma e o tema para onde o clique leva.
  const nextLang = lang === "en" ? "pt" : "en";
  const themeLabel = theme === "dark" ? t.header.theme.toLight : t.header.theme.toDark;

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#inicio">
          {profile.handle}
          <span className="caret" aria-hidden="true" />
        </a>

        <div className="header-actions">
          <button
            className="icon-button lang-button"
            type="button"
            lang={nextLang === "pt" ? "pt-BR" : "en"}
            aria-label={t.header.switchLanguage}
            title={t.header.switchLanguage}
            onClick={() => setLang(nextLang)}
          >
            {nextLang.toUpperCase()}
          </button>

          <button
            className="icon-button"
            type="button"
            aria-label={themeLabel}
            title={themeLabel}
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
              </svg>
            )}
          </button>

          <div className="menu" ref={menuRef}>
            <button
              className={`icon-button burger${open ? " is-open" : ""}`}
              type="button"
              aria-label={open ? t.header.closeMenu : t.header.openMenu}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>

            <nav id="site-menu" className={`dropdown${open ? " is-open" : ""}`} aria-label={t.header.sections}>
              {links.map((link, index) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                  <span className="dropdown-index">{String(index + 1).padStart(2, "0")}</span>
                  {link.label}
                  <span className="dropdown-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
