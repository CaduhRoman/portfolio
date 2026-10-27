import characterGif from "../assets/character.gif";
import sideSprite from "../assets/character-side.png";
import { Avatar } from "./components/Avatar";
import { ChatWidget } from "./assistant/ChatWidget";
import { Header } from "./components/Header";
import { useI18n } from "./i18n";
import { certifications, education, profile } from "./profile";
import { Projects } from "./projects";

const icons = {
  github: (
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.3-1.69-1.3-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  ),
  linkedin: (
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  ),
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </g>
  ),
  email: (
    <path
      d="M3 5.5h18v13H3z M3.5 6l8.5 7 8.5-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  ),
};

// Ícones de linha para a formação: um traço só, sem preenchimento.
const lineIcons = {
  cap: <path d="M2 9l10-5 10 5-10 5L2 9Zm4 2.2V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.8M22 9v6" />,
  course: <path d="M4 4h12l4 4v12H4V4Zm12 0v4h4M8 12h8M8 16h5" />,
  language: (
    <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  ),
  award: <path d="M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-3.5 10.9L7 21l5-2.5 5 2.5-1.5-7.1" />,
};

function LineIcon({ name }: { name: keyof typeof lineIcons }) {
  return (
    <svg
      className="line-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {lineIcons[name]}
    </svg>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: keyof typeof icons }) {
  const external = !href.startsWith("mailto:");
  return (
    <a
      className="social"
      href={href}
      aria-label={label}
      title={label}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {icons[icon]}
      </svg>
    </a>
  );
}

function SectionHead({ index, title, lead }: { index: string; title: string; lead: string }) {
  return (
    <div className="section-head">
      <span className="section-index">{index}</span>
      <h2>{title}</h2>
      <p>{lead}</p>
    </div>
  );
}

export default function App() {
  const { t } = useI18n();
  const { name, links } = profile;

  return (
    <>
      <Header />

      <main id="inicio">
        <section className="container hero">
          <div className="hero-copy">
            <div className="hero-identity">
              <Avatar alt={t.hero.photoAlt} />
              <div>
                <p className="hero-kicker">
                  <span className="dot" aria-hidden="true" />
                  {t.hero.role}
                </p>
                <h1>{name}</h1>
              </div>
            </div>
            <p className="bio">{t.hero.bio}</p>
            <p className="location">
              <svg viewBox="0 0 12 16" aria-hidden="true">
                <path d="M6 0a6 6 0 0 1 6 6c0 4.5-6 10-6 10S0 10.5 0 6a6 6 0 0 1 6-6Zm0 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
              </svg>
              {t.hero.location}
            </p>
            <div className="hero-actions">
              <a className="button" href="#projetos">
                {t.hero.cta}
              </a>
              <nav className="socials" aria-label={t.hero.socials}>
                <SocialLink href={links.github} label="GitHub" icon="github" />
                <SocialLink href={links.linkedin} label="LinkedIn" icon="linkedin" />
                <SocialLink href={links.instagram} label="Instagram @romanow.dev" icon="instagram" />
                <SocialLink href={`mailto:${links.email}`} label="E-mail" icon="email" />
              </nav>
            </div>
          </div>

          <img className="hero-character" src={characterGif} alt={t.hero.characterAlt} width="322" height="596" />
        </section>

        <section id="projetos" className="container section">
          <SectionHead index="01" title={t.projects.title} lead={t.projects.lead} />
          <Projects />
        </section>

        <section id="formacao" className="container section">
          <SectionHead index="02" title={t.education.title} lead={t.education.lead} />
          <div className="education">
            <div className="degrees">
              {education.map((item) => {
                const copy = t.education[item.id];
                const school = "school" in copy ? copy.school : undefined;
                return (
                  <article key={item.id} className={`degree${school ? "" : " degree--pending"}`}>
                    <span className="degree-mark">
                      {item.logo ? <img src={item.logo} alt="" width="40" height="40" /> : <LineIcon name="cap" />}
                    </span>
                    <div>
                      <div className="degree-top">
                        <span className="degree-level">{copy.level}</span>
                        <span className="degree-status">{copy.status}</span>
                      </div>
                      <h3>{copy.course}</h3>
                      {school && <p>{school}</p>}
                      {item.period && <p className="degree-period">{item.period}</p>}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="certs">
              <h3>{t.education.certsTitle}</h3>
              <ul>
                {certifications.map((cert) => (
                  <li key={cert.id}>
                    <a href={cert.url} target="_blank" rel="noopener noreferrer">
                      <LineIcon name={cert.kind} />
                      <span className="cert-title">{t.education.certs[cert.id]}</span>
                      <span className="cert-issuer">{cert.issuer}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="contato" className="container section">
          <div className="contact">
            <div>
              <span className="section-index">03</span>
              <h2>{t.contact.title}</h2>
              <p>{t.contact.text}</p>
            </div>
            <div className="contact-actions">
              <a className="contact-email" href={`mailto:${links.email}`}>
                {links.email}
              </a>
              <nav className="socials" aria-label={t.contact.socials}>
                <SocialLink href={links.github} label="GitHub" icon="github" />
                <SocialLink href={links.linkedin} label="LinkedIn" icon="linkedin" />
                <SocialLink href={links.instagram} label="Instagram @romanow.dev" icon="instagram" />
              </nav>
            </div>
          </div>
        </section>
      </main>

      <footer className="container footer">
        <img className="footer-sprite" src={sideSprite} alt="" width="40" height="65" />
        <span>
          © {new Date().getFullYear()} {name}
        </span>
      </footer>

      <ChatWidget />
    </>
  );
}
