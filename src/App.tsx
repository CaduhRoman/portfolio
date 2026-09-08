import { useEffect, useState } from "react";
import dashCeeImage from "../assets/dashcee.png";
import dataModelingImage from "../assets/datamodeling.png";
import maringaLogo from "../assets/maringalogo-cropped.png";
import spriteImage from "../assets/mysprite.gif";
import favicon from "../assets/favicon.png";
import { GitHubProjects } from "./GitHubProjects";
import ufmsMark from "./assets/ufms-blue-mark.svg";

type Language = "pt" | "en";

type Project = {
  title: string;
  kind: string;
  summary: string;
  image: string;
};

const copy = {
  pt: {
    nav: { skills: "Skills", projects: "Projetos", career: "Carreira", contact: "Contato" },
    hero: {
      eyebrow: "Data Analyst · System Analytics · Development",
      title: "Eu construo, analiso e aprendo com dados.",
      paragraphs: [
        "Sou o Cadu, um profissional de dados em construção constante. Meu interesse está em entender sistemas, estruturar bases e transformar regras de negócio em modelos analíticos confiáveis.",
        "Trabalho entre analytics engineering, estatística aplicada e desenvolvimento. Gosto de rotinas de alta produtividade relacionadas a dados, desenvolvimento e sistemas.",
      ],
      pillars: ["Análise", "Modelagem", "Engenharia", "Visualização"],
    },
    skills: {
      eyebrow: "Skills",
      title: "Minha Formação.",
      description:
        "Um resumo da minha formação, certificações e competências que sustentam meu trabalho com dados, processos e desenvolvimento aplicado.",
      educationLabel: "Superior",
      postgraduateLabel: "Pós-graduação",
      postgraduateStatus: "Loading...",
      postgraduateDescription: "Próximo passo acadêmico em definição.",
      university: "Universidade Federal do Mato Grosso do Sul",
      degreeName: "Tecnologia da Informação",
      degreePeriod: "2026 - 2028",
      certificationsLabel: "Certificações & Reconhecimentos",
      credential: "Ver credencial",
      highlights: [
        {
          title: "Data Analytics",
          description: "Facilidade com gráficos, indicadores, estatística aplicada e leitura de contexto.",
        },
        {
          title: "System Analytics",
          description: "Entendimento de sistemas, processos e regras de negócio por trás dos dados.",
        },
        {
          title: "Comunicação",
          description: "Trabalho em equipe, inglês fluente e clareza para explicar análises e decisões.",
        },
      ],
    },
    career: {
      eyebrow: "Carreira",
      title: "Minha experiência.",
      period: "Set 2025 · Presente",
      startDate: "2025-09-01",
      company: "Grupo Maringá",
      description:
        "Atuação em análise de dados, desenvolvimento de dashboards e leitura de processos para apoiar decisões e rotinas internas. Destaque para a participação como principal executante no PEx - Projeto de Excelência de implementação do ERP SIGIND na Sinterização, conectando sistemas, indicadores e pessoas.",
      pexLabel: "PEx Projeto de Excelência",
      pexTitle: "Implementação de ERP SIGIND na Sinterização",
      pexDetails: [
        "Atuei como principal executante das ações do projeto, conectando processo, ERP e desenvolvimento.",
        "Desenvolvi variáveis calculadas em Pascal para estruturar campos com métricas de processo.",
        "Criei variáveis de integração para receber dados de sistemas internos de tracking, como consumo de energia.",
        "Organizei grupos de digitação e estruturas operacionais para melhorar o uso do ERP na rotina.",
      ],
      projectsLabel: "Projetos desenvolvidos na experiência Grupo Maringá",
      projects: [
        {
          title: "Modelagem de Dados",
          kind: "Estrutura analítica",
          summary:
            "Organização de tabelas, relações e regras de negócio para criar uma base confiável antes da visualização.",
          image: dataModelingImage,
        },
        {
          title: "Painel CEE",
          kind: "Business intelligence",
          summary:
            "Dashboard operacional orientado a estatística de processo aplicada, trazendo dados diários sobre consumo de energia, produção e indicadores de qualidade.",
          image: dashCeeImage,
        },
      ],
    },
    contact: {
      eyebrow: "Contato",
      title: "Vamos conversar.",
      status: "Disponível",
      available:
        "Aberto para oportunidades em Analytics Engineering, Data Analytics, System Analytics e Desenvolvimento.",
      email: "E-mail",
      github: "GitHub",
      linkedin: "LinkedIn",
    },
    footer: "Data Analyst · System Analytics · Development",
  },
  en: {
    nav: { skills: "Skills", projects: "Projects", career: "Career", contact: "Contact" },
    hero: {
      eyebrow: "Data Analyst · System Analytics · Development",
      title: "I build, analyze, and learn from data.",
      paragraphs: [
        "I am Carlos Romanow, a data professional in constant development. My interest is in understanding systems, structuring data foundations and translating business rules into reliable analytical models.",
        "I work across analytics engineering, applied statistics and development. I enjoy high-productivity routines related to data, systems and practical analytical solutions.",
      ],
      pillars: ["Analysis", "Modeling", "Engineering", "Visualization"],
    },
    skills: {
      eyebrow: "Skills",
      title: "Education.",
      description:
        "A summary of the education, certifications and practical skills that support my work with data, processes and applied development.",
      educationLabel: "Undergraduate",
      postgraduateLabel: "Postgraduate",
      postgraduateStatus: "Loading...",
      postgraduateDescription: "Next academic step in progress.",
      university: "Federal University of Mato Grosso do Sul",
      degreeName: "Information Technology",
      degreePeriod: "2026 - 2028",
      certificationsLabel: "Certifications & Recognition",
      credential: "View credential",
      highlights: [
        {
          title: "Data Analytics",
          description: "Comfort with charts, indicators, applied statistics and contextual analysis.",
        },
        {
          title: "System Analytics",
          description: "Understanding systems, processes and business rules behind the data.",
        },
        {
          title: "Communication",
          description: "Teamwork, fluent English and clarity when explaining analysis and decisions.",
        },
      ],
    },
    career: {
      eyebrow: "Career",
      title: "My experience.",
      period: "Sep 2025 · Present",
      startDate: "2025-09-01",
      company: "Grupo Maringá",
      description:
        "Work in data analysis, dashboard development and process understanding to support internal decisions and routines. Highlighted participation as the main executor in the PEx - Excellence Program project for implementing the SIGIND ERP in the Sintering area, connecting systems, indicators and people.",
      pexLabel: "PEx Excellence Program - Main Executor",
      pexTitle: "SIGIND ERP Implementation in Sintering",
      pexDetails: [
        "Acted as the main executor of project actions, connecting process, ERP and development work.",
        "Developed calculated variables in Pascal to structure fields with process metrics.",
        "Created integration variables to receive data from internal tracking systems, such as energy consumption.",
        "Organized input groups and operational structures to improve ERP usage in daily routines.",
      ],
      projectsLabel: "Projects developed during the Grupo Maringá experience",
      projects: [
        {
          title: "Data Modeling",
          kind: "Analytical structure",
          summary:
            "Organization of tables, relationships and business rules to create a reliable foundation before visualization.",
          image: dataModelingImage,
        },
        {
          title: "CEE Dashboard",
          kind: "Business intelligence",
          summary:
            "Operational dashboard using applied process statistics, with daily energy consumption, production and quality indicators.",
          image: dashCeeImage,
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's talk.",
      status: "Available",
      available:
        "Open to opportunities in Analytics Engineering, Data Analytics, System Analytics and Development.",
      email: "E-mail",
      github: "GitHub",
      linkedin: "LinkedIn",
    },
    footer: "Data Analyst · System Analytics · Development",
  },
} satisfies Record<Language, Record<string, unknown>>;

const certifications = [
  {
    title: "Python for Data Science, AI & Development - IBM",
    url: "https://www.coursera.org/account/accomplishments/verify/OMHH2GVVVYIX",
  },
  {
    title: "EF SET English Certificate 70/100 - C1 Advanced",
    url: "https://cert.efset.org/hNG8au",
  },
  {
    title: "Data Visualization and Dashboards with Excel and Cognos - IBM",
    url: "https://www.coursera.org/account/accomplishments/verify/O4EEO9S3NLFF",
  },
  {
    title: "Data Analytics Essentials - Coursera",
    url: "https://www.credly.com/badges/183fd62c-9e25-4819-a23d-ba0416178f96/linked_in_profile",
  },
  {
    title: "Menção Honrosa OBMEP 2017",
    url: "https://premiacao.obmep.org.br/2017/verRelatorioPremiadosMencao-SP.1.do.htm",
  },
  {
    title: "Menção Honrosa OBMEP 2018",
    url: "https://premiacao.obmep.org.br/2018/verRelatorioPremiadosMencao-SP.1.do.htm",
  },
];

const skills = [
  "Power BI",
  "SQL Oracle",
  "Pascal",
  "Excel / VBA",
  "ETL",
  "Desenvolvimento",
  "Dashboards",
  "Processos",
  "Data modeling",
  "System analytics",
];

const pexTags = ["PASCAL", "SQL", "DATA STRUCTURING", "ERP"];

function Header({ content }: { content: (typeof copy)[Language] }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#inicio" aria-label="Carlos Romanow">
          <span className="brand-name">caduhroman</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#carreira">{content.nav.career}</a>
          <a href="#skills">{content.nav.skills}</a>
          <a href="#projetos">{content.nav.projects}</a>
          <a href="#contato">{content.nav.contact}</a>
        </nav>
      </div>
    </header>
  );
}

function LanguageSwitch({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  return (
    <div className="language-switch" aria-label="Language selector">
      <button className={language === "pt" ? "active" : ""} type="button" onClick={() => onChange("pt")}>
        <span>🇧🇷</span>
        PT
      </button>
      <button className={language === "en" ? "active" : ""} type="button" onClick={() => onChange("en")}>
        <span>🇺🇸</span>
        EN
      </button>
    </div>
  );
}

function Hero({
  content,
  language,
  onLanguageChange,
}: {
  content: (typeof copy)[Language];
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  return (
    <section className="hero-section" id="inicio" aria-labelledby="hero-title">
      <div className="portrait-panel" data-reveal>
        <LanguageSwitch language={language} onChange={onLanguageChange} />
        <div className="portrait-shell sprite-shell">
          <img src={spriteImage} alt="Sprite 360 de Carlos Romanow" />
        </div>
      </div>

      <div className="intro-panel" data-reveal>
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1 id="hero-title">{content.hero.title}</h1>
        <div className="intro-copy">
          {content.hero.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="signature-grid" aria-label="Professional focus areas">
          {content.hero.pillars.map((pillar, index) => (
            <span className={index === 2 ? "active" : ""} key={pillar}>
              {pillar}
            </span>
          ))}
        </div>
      </div>

      <div className="hero-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="web-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}

function Skills({ content }: { content: (typeof copy)[Language] }) {
  return (
    <section className="section-block skills-section" id="skills" aria-labelledby="skills-title">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">{content.skills.eyebrow}</p>
        <h2 id="skills-title">{content.skills.title}</h2>
        <p>{content.skills.description}</p>
      </div>

      <div className="skills-layout">
        <div className="education-grid">
          <article className="education-card education-card-main" data-reveal>
            <div className="education-logo-panel" aria-hidden="true">
              <img className="ufms-mark" src={ufmsMark} alt="" />
            </div>

            <div className="education-info">
              <p className="project-kind">{content.skills.educationLabel}</p>
              <h3>UFMS</h3>
              <p>{content.skills.university}</p>

              <div className="education-meta">
                <span>{content.skills.degreeName}</span>
                <span>{content.skills.degreePeriod}</span>
              </div>
            </div>
          </article>

          <article className="education-card postgraduate-card" data-reveal>
            <p className="project-kind">{content.skills.postgraduateLabel}</p>
            <h3>{content.skills.postgraduateStatus}</h3>
            <p>{content.skills.postgraduateDescription}</p>
          </article>
        </div>

        <div className="certification-panel" data-reveal>
          <div className="panel-title-row">
            <p className="project-kind">{content.skills.certificationsLabel}</p>
            <span aria-hidden="true" />
          </div>
          <div className="certification-list">
            {certifications.map((certification, index) => (
              <a
                className="certification-item"
                href={certification.url}
                target="_blank"
                rel="noopener noreferrer"
                key={certification.title}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{certification.title}</p>
                <strong>{content.skills.credential}</strong>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="skill-highlight-grid">
        {content.skills.highlights.map((skill) => (
          <article className="skill-highlight" data-reveal key={skill.title}>
            <h3>{skill.title}</h3>
            <p>{skill.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Career({ content, language }: { content: (typeof copy)[Language]; language: Language }) {
  return (
    <section className="section-block career-section" id="carreira" aria-labelledby="career-title">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">{content.career.eyebrow}</p>
        <h2 id="career-title">{content.career.title}</h2>
      </div>

      <div className="career-layout">
        <article className="career-entry" data-reveal>
          <div className="company-heading">
            <img src={maringaLogo} alt="" />
            <div>
              <div className="career-period">
                <p className="period">{content.career.period}</p>
                <span>{calculateTenure(content.career.startDate, language)}</span>
              </div>
              <h3>{content.career.company}</h3>
            </div>
          </div>
          <p>{content.career.description}</p>
        </article>

        <div className="skill-cloud" data-reveal aria-label="Technologies and skills">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>

      <div className="career-contributions" data-reveal>
        <div className="contributions-heading">
          <p className="project-kind">{language === "pt" ? "Participações e contribuições" : "Participation and contributions"}</p>
          <span>{content.career.company}</span>
        </div>

        <div className="pex-track" aria-label={content.career.pexLabel}>
          <div className="pex-marker" aria-hidden="true" />
          <div className="pex-content">
            <div>
              <p className="project-kind">{content.career.pexLabel}</p>
              <h3>{content.career.pexTitle}</h3>
              <ul>
                {content.career.pexDetails.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>

            <div className="pex-tags" aria-label="Tecnologias usadas no PEx">
              {pexTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="experience-projects" aria-label={content.career.projectsLabel}>
          {(content.career.projects as Project[]).map((project) => (
            <article className="experience-project" data-reveal key={project.title}>
              <img src={project.image} alt={`${project.title} preview`} />
              <div>
                <p className="project-kind">{project.kind}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function calculateTenure(startDate: string, language: Language) {
  const [year, month, day] = startDate.split("-").map(Number);
  const start = new Date(year, month - 1, day);
  const today = new Date();

  let months = (today.getFullYear() - start.getFullYear()) * 12 + today.getMonth() - start.getMonth();

  if (today.getDate() < start.getDate()) {
    months -= 1;
  }

  months = Math.max(months, 0);

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (language === "en") {
    return formatTenureEn(years, remainingMonths);
  }

  return formatTenurePt(years, remainingMonths);
}

function formatTenurePt(years: number, months: number) {
  const parts = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "ano" : "anos"}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "mês" : "meses"}`);
  }

  return parts.length > 0 ? parts.join(" e ") : "menos de 1 mês";
}

function formatTenureEn(years: number, months: number) {
  const parts = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  }

  return parts.length > 0 ? parts.join(" and ") : "less than 1 month";
}

function Contact({ content }: { content: (typeof copy)[Language] }) {
  return (
    <section className="contact-section" id="contato" aria-labelledby="contact-title">
      <div className="contact-grid">
        <div data-reveal>
          <p className="eyebrow">{content.contact.eyebrow}</p>
          <h2 id="contact-title">{content.contact.title}</h2>
        </div>

        <div className="contact-panel" data-reveal>
          <div className="contact-status">
            <span>{content.contact.status}</span>
            <p>{content.contact.available}</p>
          </div>

          <div className="contact-links">
            <a href="mailto:caduromanow@hotmail.com">
              <span>
                <IconMail />
                {content.contact.email}
              </span>
              <strong>caduromanow@hotmail.com</strong>
            </a>
            <a href="https://github.com/caduhroman" target="_blank" rel="noopener noreferrer">
              <span>
                <IconGithub />
                {content.contact.github}
              </span>
              <strong>@caduhroman</strong>
            </a>
            <a
              href="https://www.linkedin.com/in/carlos-eduardo-romanow-silva-076260281/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <IconLinkedin />
                {content.contact.linkedin}
              </span>
              <strong>Carlos Romanow</strong>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ content }: { content: (typeof copy)[Language] }) {
  return (
    <footer className="site-footer">
      <img className="footer-favicon" src={favicon} alt="" width="48" height="48" />
      <div>
        <strong className="footer-name">caduhroman</strong>
        <p>{content.footer}</p>
      </div>
      <span className="footer-year">{new Date().getFullYear()}</span>
    </footer>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5a8.5 8.5 0 0 0-2.7 16.6c.4.1.5-.2.5-.4v-1.5c-2.2.5-2.7-.9-2.7-.9-.4-.9-.9-1.1-.9-1.1-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4a3.1 3.1 0 0 1 .8-2.2 2.9 2.9 0 0 1 .1-2.2s.7-.2 2.3.8a8.1 8.1 0 0 1 4.2 0c1.6-1 2.3-.8 2.3-.8.4 1 .2 1.8.1 2.2a3.1 3.1 0 0 1 .8 2.2c0 3.1-1.9 3.8-3.6 4 .3.2.5.7.5 1.4v2.1c0 .2.1.5.5.4A8.5 8.5 0 0 0 12 3.5Z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 9h3v10H5z" />
      <path d="M6.5 5.2a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4Z" />
      <path d="M11 9h3v1.4c.5-.8 1.4-1.6 3-1.6 2.2 0 3.5 1.4 3.5 4.4V19h-3v-5.3c0-1.4-.5-2.2-1.6-2.2-1.2 0-1.9.8-1.9 2.2V19h-3z" />
    </svg>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>("pt");
  const content = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  }, [language]);

  useEffect(() => {
    const visibleClass = "is-visible";
    const revealSelector = "[data-reveal]";
    const revealItems = () => document.querySelectorAll<HTMLElement>(revealSelector);
    const revealAll = () => revealItems().forEach((item) => item.classList.add(visibleClass));

    if (!("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px 40px 0px", threshold: 0 },
    );

    const observeHiddenItems = () => {
      revealItems().forEach((item) => {
        if (!item.classList.contains(visibleClass)) {
          observer.observe(item);
        }
      });
    };

    observeHiddenItems();

    const mutationObserver = new MutationObserver(observeHiddenItems);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Header content={content} />
      <main>
        <Hero content={content} language={language} onLanguageChange={setLanguage} />
        <Career content={content} language={language} />
        <Skills content={content} />
        <GitHubProjects language={language} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </>
  );
}
