import { useEffect, useMemo, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GitHubProject, loadFeaturedProjects } from "./github";

type GitHubProjectsProps = {
  language: "pt" | "en";
};

const labels = {
  pt: {
    eyebrow: "Projetos",
    title: "Meus trabalhos",
    description:
      "Uma seleção dos meus trabalhos com análise de dados e desenvolvimento de sistemas.",
    loading: "Carregando repositórios",
    updated: "Atualizado em",
    readmeUnavailable: "README indisponível para este projeto.",
    empty: "Nenhum repositório configurado para destaque.",
    viewProject: "Ver projeto",
    github: "GitHub",
    demo: "Demo",
    close: "Fechar",
  },
  en: {
    eyebrow: "Projects",
    title: "Selected work.",
    description:
      "Selected projects in data analysis and systems development.",
    loading: "Loading repositories",
    updated: "Updated on",
    readmeUnavailable: "README unavailable for this project.",
    empty: "No repositories configured for display.",
    viewProject: "View project",
    github: "GitHub",
    demo: "Demo",
    close: "Close",
  },
};

export function GitHubProjects({ language }: GitHubProjectsProps) {
  const [projects, setProjects] = useState<GitHubProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<GitHubProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const content = labels[language];

  useEffect(() => {
    let isMounted = true;

    loadFeaturedProjects()
      .then((loadedProjects) => {
        if (isMounted) {
          setProjects(loadedProjects);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [attempt]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", Boolean(selectedProject));

    return () => document.body.classList.remove("modal-open");
  }, [selectedProject]);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => Number(b.featured) - Number(a.featured)),
    [projects],
  );

  return (
    <section className="section-block github-projects-section" id="projetos" aria-labelledby="github-projects-title">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="github-projects-title">{content.title}</h2>
        <p>{content.description}</p>
      </div>

      {isLoading ? (
        <div className="github-loading" data-reveal>
          <span />
          {content.loading}
        </div>
      ) : sortedProjects.length > 0 ? (
        <div className="github-project-grid">
          {sortedProjects.map((project) => (
            <article className="github-project-card is-visible" data-reveal key={project.repo}>
              <div className="github-card-top">
                <p className="project-kind">{project.language ?? "Repository"}</p>
                {project.updatedAt && <span>{formatDate(project.updatedAt, language)}</span>}
              </div>

              <h3>{project.name}</h3>
              <p>{project.description ?? (language === "pt" ? "Consulte os detalhes deste projeto." : "Explore this project's details.")}</p>
              {project.error && <button type="button" onClick={() => setAttempt((value) => value + 1)}>{language === "pt" ? "Tentar carregar novamente" : "Retry loading"}</button>}

              <div className="github-meta">
                <span>{project.repo}</span>
              </div>

              {project.topics.length > 0 && (
                <div className="github-topic-row">
                  {project.topics.slice(0, 5).map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>
              )}

              <div className="github-actions">
                <button type="button" onClick={() => setSelectedProject(project)}>
                  {content.viewProject}
                </button>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {content.github}
                </a>
                {project.homepage && (
                  <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                    {content.demo}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="github-error" data-reveal>
          {content.empty}
        </p>
      )}

      {selectedProject && (
        <ProjectModal project={selectedProject} content={content} language={language} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}

function ProjectModal({
  project,
  content,
  language,
  onClose,
}: {
  project: GitHubProject;
  content: (typeof labels)["pt"];
  language: "pt" | "en";
  onClose: () => void;
}) {
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href], button, [tabindex="0"]') ?? []);
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); previous?.focus(); };
  }, [onClose]);

  const resolveUrl = (url: string | undefined, image: boolean) => {
    if (!url || url.startsWith("#") || /^[a-z][a-z\d+.-]*:/i.test(url)) return url;
    const resolved = new URL(url, project.readmeUrl ?? `https://raw.githubusercontent.com/${project.repo}/HEAD/README.md`);
    if (!image && resolved.hostname === "raw.githubusercontent.com") {
      const [, owner, repo, ...path] = resolved.pathname.split("/");
      return `https://github.com/${owner}/${repo}/blob/${path.join("/")}${resolved.search}${resolved.hash}`;
    }
    return resolved.href;
  };
  return (
    <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <button className="modal-backdrop" tabIndex={-1} type="button" aria-label={content.close} onClick={onClose} />
      <article className="project-modal-panel" ref={panel}>
        <header className="project-modal-header">
          <div>
            <p className="project-kind">{project.language ?? project.repo}</p>
            <h2 id="project-modal-title">{project.name}</h2>
            {project.updatedAt && <span>
              {content.updated} {formatDate(project.updatedAt, language)}
            </span>}
          </div>
          <button type="button" onClick={onClose}>
            {content.close}
          </button>
        </header>

        <div className="readme-surface">
          {project.readme ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              img: ({ src, alt }) => <img src={resolveUrl(src, true)} alt={alt ?? ""} loading="lazy" />,
              a: ({ href, children }) => <a href={resolveUrl(href, false)} target={href?.startsWith("#") ? undefined : "_blank"} rel="noopener noreferrer">{children}</a>,
            }}>{project.readme}</ReactMarkdown>
          ) : (
            <p className="github-error">{project.error ?? content.readmeUnavailable}</p>
          )}
        </div>
      </article>
    </div>
  );
}

function formatDate(date: string, language: "pt" | "en") {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(language === "pt" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
