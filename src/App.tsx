import dashCeeImage from "../assets/dashcee.png";
import dataModelingImage from "../assets/datamodeling.png";
import portraitImage from "../assets/eu.png";
import maringaLogo from "../assets/maringalogo.avif";
import ufmsMark from "./assets/ufms-mark.svg";

type Project = {
  title: string;
  kind: string;
  summary: string;
  image: string;
};

const maringaProjects: Project[] = [
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
      "Experimento visual para consolidar dados em um painel limpo, navegável e orientado a acompanhamento.",
    image: dashCeeImage,
  },
];

const pexDetails = [
  "Atuei como principal executante das ações do projeto, conectando processo, ERP e desenvolvimento.",
  "Desenvolvi variáveis calculadas em Pascal para estruturar campos com métricas de processo.",
  "Criei variáveis de integração para receber dados de sistemas internos de tracking, como consumo de energia.",
  "Organizei grupos de digitação e estruturas operacionais para melhorar o uso do ERP na rotina.",
];

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

const skillHighlights = [
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

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#inicio" aria-label="Carlos Romanow">
          <span className="brand-mark">CR</span>
          <span>Carlos Romanow</span>
        </a>

        <nav className="nav-links" aria-label="Navegação principal">
          <a href="#skills">Skills</a>
          <a href="#carreira">Carreira</a>
          <a href="#contato">Contato</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="inicio" aria-labelledby="hero-title">
      <div className="portrait-panel">
        <div className="portrait-shell">
          <img src={portraitImage} alt="Carlos Romanow" />
        </div>
      </div>

      <div className="intro-panel">
        <p className="eyebrow">Data Analyst · System Analytics · Development</p>
        <h1 id="hero-title">Dados com contexto, clareza e intenção.</h1>
        <div className="intro-copy">
          <p>
            Sou Carlos Romanow, um profissional de dados em construção constante. Meu interesse está
            em entender sistemas, estruturar bases e transformar regras de negócio em modelos analíticos
            confiáveis.
          </p>
          <p>
            Trabalho entre analytics engineering, estatística aplicada e desenvolvimento. Gosto de rotinas de alta produtividade relacionadas a dados, desenvolvimento e sistemas.
          </p>
        </div>

        <div className="signature-grid" aria-label="Áreas de atuação">
          <span>01 / Análise</span>
          <span>02 / Modelagem</span>
          <span>03 / Desenvolvimento</span>
          <span>04 / Visualização</span>
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

function Skills() {
  return (
    <section className="section-block skills-section" id="skills" aria-labelledby="skills-title">
      <div className="section-heading">
        <p className="eyebrow">Skills</p>
        <h2 id="skills-title">Formação.</h2>
        <p>
          Um resumo da minha formação, certificações e competências que sustentam meu trabalho com
          dados, processos e desenvolvimento aplicado.
        </p>
      </div>

      <div className="skills-layout">
        <article className="education-card">
          <img className="ufms-mark" src={ufmsMark} alt="" />
          <p className="project-kind">Formação</p>
          <h3>UFMS</h3>
          <p>Universidade Federal do Mato Grosso do Sul</p>
          <strong>Tecnologia da Informação | 2026 - 2028</strong>
        </article>

        <div className="certification-panel">
          <p className="project-kind">Certificações & Reconhecimentos</p>
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
                <strong>Ver credencial</strong>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="skill-highlight-grid">
        {skillHighlights.map((skill) => (
          <article className="skill-highlight" key={skill.title}>
            <h3>{skill.title}</h3>
            <p>{skill.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Career() {
  return (
    <section className="section-block career-section" id="carreira" aria-labelledby="career-title">
      <div className="section-heading">
        <p className="eyebrow">Carreira</p>
        <h2 id="career-title">Experiência orientada a operação.</h2>
      </div>

      <div className="career-layout">
        <article className="career-entry">
          <div className="company-heading">
            <img
              src={maringaLogo}
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <div>
              <p className="period">Set 2025 · Presente</p>
              <h3>Grupo Maringá</h3>
            </div>
          </div>
          <p>
            Atuação em análise de dados, desenvolvimento de dashboards e leitura de processos para apoiar
            decisões e rotinas internas. Destaque para a participação como principal executante no PEx -
            Projeto de Excelência de implementação do ERP SIGIND na Sinterização, conectando sistemas,
            indicadores e pessoas.
          </p>
        </article>

        <div className="skill-cloud" aria-label="Tecnologias e competências">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>

      <div className="pex-track" aria-label="Destaque PEx Programa de Excelência">
        <div className="pex-marker" aria-hidden="true" />
        <div className="pex-content">
          <p className="project-kind">PEx Programa de Excelência - Principal Executante</p>
          <h3>Implementação de ERP SIGIND na Sinterização</h3>
          <ul>
            {pexDetails.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="experience-projects" aria-label="Projetos desenvolvidos na experiência Grupo Maringá">
        {maringaProjects.map((project) => (
          <article className="experience-project" key={project.title}>
            <img src={project.image} alt={`Prévia do projeto ${project.title}`} />
            <div>
              <p className="project-kind">{project.kind}</p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contato" aria-labelledby="contact-title">
      <div className="contact-grid">
        <div>
          <p className="eyebrow">Contato</p>
          <h2 id="contact-title">Vamos construir uma conversa a partir dos dados.</h2>
        </div>

        <div className="contact-panel">
          <div className="contact-status">
            <span>Disponível</span>
            <p>
              Aberto para oportunidades em Analytics Engineering, Data Analytics, System Analytics e
              Desenvolvimento.
            </p>
          </div>

          <div className="contact-links">
            <a href="mailto:caduromanow">
              <span>
                <IconMail />
                E-mail
              </span>
              <strong>caduromanow</strong>
            </a>
            <a href="https://github.com/caduhroman" target="_blank" rel="noopener noreferrer">
              <span>
                <IconGithub />
                GitHub
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
                LinkedIn
              </span>
              <strong>Carlos Romanow</strong>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-mark">
        <span>CR</span>
      </div>
      <div>
        <strong>Carlos Romanow</strong>
        <p>Data Analyst · System Analytics · Development</p>
      </div>
      <span className="footer-year">2026</span>
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
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Skills />
        <Career />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
