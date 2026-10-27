import type { CSSProperties, ReactNode } from "react";
import cardPato from "../../assets/projects/card-cavaleiro_pato.svg";
import cardMilho from "../../assets/projects/card-soldados_milho.svg";
import cardPorquinho from "../../assets/projects/card-porquinho.svg";
import framepilotIcon from "../../assets/projects/framepilot-icon.png";
import tavern from "../../assets/projects/guerra-tavern.jpg";
import tavernaIcon from "../../assets/projects/taverna-icon.png";
import { useI18n } from "../i18n";
import type { Dictionary } from "../i18n/dictionaries";

type Project = {
  id: "taverna" | "guerra" | "framepilot";
  name: string;
  badge: string;
  icon?: string;
  link?: { href: string; label: string };
  meta?: string;
  tagline: string;
  tags: string[];
  visual: ReactNode;
};

type Copy = Dictionary["projects"];

function TavernaVisual({ tasks }: { tasks: string[] }) {
  return (
    <div className="tw" aria-hidden="true">
      <div className="tw-row is-done">
        <i />
        <span>{tasks[0]}</span>
        <b>Merge</b>
      </div>
      <div className="tw-row is-running">
        <i />
        <span>{tasks[1]}</span>
        <em>Codex</em>
      </div>
      <div className="tw-row">
        <i />
        <span>{tasks[2]}</span>
        <em>Claude</em>
      </div>
    </div>
  );
}

// Os nomes das cartas são do próprio jogo e não se traduzem.
const hand = [
  { src: cardPorquinho, name: "Porquinho" },
  { src: cardMilho, name: "Soldados de Milho" },
  { src: cardPato, name: "Cavaleiro Pato" },
];

function GuerraVisual({ cardAlt }: { cardAlt: string }) {
  return (
    <div className="hand">
      {hand.map((card, index) => (
        <img
          key={card.name}
          src={card.src}
          alt={`${cardAlt}: ${card.name}`}
          style={{ "--i": index - 1 } as CSSProperties}
          width="220"
          height="316"
        />
      ))}
    </div>
  );
}

function FramePilotVisual({ prompt }: { prompt: string }) {
  return (
    <div className="fp" aria-hidden="true">
      <p className="fp-chat">{prompt}</p>
      <div className="fp-timeline">
        <div className="fp-track">
          <span style={{ width: "22%" }} className="is-cut" />
          <span style={{ width: "40%" }} />
          <span style={{ width: "30%" }} />
        </div>
        <div className="fp-track fp-track--text">
          <span style={{ width: "34%", marginLeft: "24%" }} />
          <span style={{ width: "26%" }} />
        </div>
        <div className="fp-track fp-track--audio">
          <span style={{ width: "92%" }} />
        </div>
        <span className="fp-playhead" />
      </div>
    </div>
  );
}

function buildProjects(copy: Copy): Project[] {
  return [
    {
      id: "taverna",
      name: "Taverna Harness",
      badge: copy.taverna.badge,
      icon: tavernaIcon,
      link: { href: "https://github.com/CaduhRoman/taverna-harness", label: copy.taverna.link },
      tagline: copy.taverna.tagline,
      tags: copy.taverna.tags,
      visual: <TavernaVisual tasks={copy.taverna.tasks} />,
    },
    {
      id: "guerra",
      name: copy.guerra.name,
      badge: copy.guerra.badge,
      link: { href: "https://guerra-de-cartas.vercel.app", label: copy.guerra.link },
      tagline: copy.guerra.tagline,
      tags: copy.guerra.tags,
      visual: <GuerraVisual cardAlt={copy.guerra.cardAlt} />,
    },
    {
      id: "framepilot",
      name: "FramePilot",
      badge: copy.framepilot.badge,
      icon: framepilotIcon,
      meta: copy.framepilot.meta,
      tagline: copy.framepilot.tagline,
      tags: copy.framepilot.tags,
      visual: <FramePilotVisual prompt={copy.framepilot.prompt} />,
    },
  ];
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={`proj proj--${project.id}`}
      style={project.id === "guerra" ? ({ "--tavern": `url(${tavern})` } as CSSProperties) : undefined}
    >
      <div className="proj-visual">{project.visual}</div>
      <div className="proj-body">
        <header className="proj-head">
          {project.icon && <img className="proj-icon" src={project.icon} alt="" width="36" height="36" />}
          <h3>{project.name}</h3>
          <span className="badge">{project.badge}</span>
        </header>
        <p className="proj-tagline">{project.tagline}</p>
        <footer className="proj-foot">
          <ul className="tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          {project.link ? (
            <a className="proj-link" href={project.link.href} target="_blank" rel="noopener noreferrer">
              {project.link.label}
            </a>
          ) : (
            <span className="proj-link">{project.meta}</span>
          )}
        </footer>
      </div>
    </article>
  );
}

export function Projects() {
  const { t } = useI18n();

  return (
    <div className="projects">
      {buildProjects(t.projects).map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
