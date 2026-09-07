import { featuredRepositories } from "./projectsConfig";

export type GitHubProject = {
  repo: string;
  featured: boolean;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  updatedAt: string;
  readme: string | null;
  error: string | null;
};

type GitHubRepoResponse = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  updated_at: string;
  pushed_at: string;
};

type GitHubReadmeResponse = {
  content: string;
  encoding: string;
};

const projectCache = new Map<string, Promise<GitHubProject>>();

export function loadFeaturedProjects() {
  return Promise.all(featuredRepositories.map((item) => loadGitHubProject(item.repo, item.featured)));
}

function loadGitHubProject(repo: string, featured: boolean) {
  const cached = projectCache.get(repo);

  if (cached) {
    return cached;
  }

  const request = fetchGitHubProject(repo, featured);
  projectCache.set(repo, request);
  return request;
}

async function fetchGitHubProject(repo: string, featured: boolean): Promise<GitHubProject> {
  const emptyProject: GitHubProject = {
    repo,
    featured,
    name: repo.split("/").at(-1) ?? repo,
    description: null,
    url: `https://github.com/${repo}`,
    homepage: null,
    language: null,
    topics: [],
    updatedAt: "",
    readme: null,
    error: null,
  };

  try {
    const repoResponse = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!repoResponse.ok) {
      const readme = await fetchRawReadme(repo);
      const fallback = getProjectFallbackFromReadme(repo, readme.content);

      return {
        ...emptyProject,
        ...fallback,
        readme: readme.content,
        error: readme.content ? null : getGitHubErrorMessage(repoResponse.status, "repository"),
      };
    }

    const repoData = (await repoResponse.json()) as GitHubRepoResponse;
    const readme = await fetchReadme(repo);

    return {
      repo,
      featured,
      name: repoData.name,
      description: repoData.description ?? getReadmeExcerpt(readme.content),
      url: repoData.html_url,
      homepage: repoData.homepage || null,
      language: repoData.language,
      topics: repoData.topics ?? [],
      updatedAt: repoData.pushed_at || repoData.updated_at,
      readme: readme.content,
      error: readme.error,
    };
  } catch {
    return {
      ...emptyProject,
      error: "Network failure while loading this repository.",
    };
  }
}

async function fetchReadme(repo: string): Promise<{ content: string | null; error: string | null }> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/readme`, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (response.status === 404) {
      const fallbackReadme = await fetchRawReadme(repo);
      return fallbackReadme.content ? fallbackReadme : { content: null, error: "README not found for this repository." };
    }

    if (!response.ok) {
      const fallbackReadme = await fetchRawReadme(repo);
      return fallbackReadme.content ? fallbackReadme : { content: null, error: getGitHubErrorMessage(response.status, "README") };
    }

    const data = (await response.json()) as GitHubReadmeResponse;

    if (data.encoding !== "base64") {
      return { content: null, error: "Unsupported README encoding returned by GitHub." };
    }

    return { content: decodeBase64(data.content), error: null };
  } catch {
    return { content: null, error: "Network failure while loading the README." };
  }
}

async function fetchRawReadme(repo: string): Promise<{ content: string | null; error: string | null }> {
  const [owner, repoName] = repo.split("/");

  if (!owner || !repoName) {
    return { content: null, error: "Invalid repository name." };
  }

  const candidates = ["main", "master"].flatMap((branch) => [
    `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/README.md`,
    `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/readme.md`,
  ]);

  for (const url of candidates) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return { content: await response.text(), error: null };
      }
    } catch {
      continue;
    }
  }

  return { content: null, error: "README not found for this repository." };
}

function decodeBase64(content: string) {
  const binary = window.atob(content.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function getProjectFallbackFromReadme(repo: string, readme: string | null) {
  const repoName = repo.split("/").at(-1) ?? repo;

  return {
    name: getReadmeTitle(readme) ?? repoName,
    description: getReadmeExcerpt(readme),
  };
}

function getReadmeTitle(readme: string | null) {
  if (!readme) {
    return null;
  }

  const heading = readme
    .split("\n")
    .map((line) => line.trim())
    .find((line) => /^#\s+/.test(line));

  return heading?.replace(/^#\s+/, "").trim() || null;
}

function getReadmeExcerpt(readme: string | null) {
  if (!readme) {
    return null;
  }

  const paragraph = readme
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n/g, " ").trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("!") && !block.startsWith("[!"));

  if (!paragraph) {
    return null;
  }

  const cleanParagraph = paragraph
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[`*_>]/g, "")
    .trim();

  return cleanParagraph.length > 220 ? `${cleanParagraph.slice(0, 217).trim()}...` : cleanParagraph;
}

function getGitHubErrorMessage(status: number, resource: string) {
  if (status === 404) {
    return `GitHub ${resource} not found.`;
  }

  if (status === 403 || status === 429) {
    return "GitHub API rate limit reached. Try again later.";
  }

  return `GitHub returned ${status} while loading the ${resource}.`;
}
