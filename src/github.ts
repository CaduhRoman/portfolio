import { featuredRepositories } from "./projectsConfig";

export type GitHubProject = {
  repo: string;
  featured: boolean;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
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
  stargazers_count: number;
  topics?: string[];
  updated_at: string;
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
    stars: 0,
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
      return { ...emptyProject, error: getGitHubErrorMessage(repoResponse.status, "repository") };
    }

    const repoData = (await repoResponse.json()) as GitHubRepoResponse;
    const readme = await fetchReadme(repo);

    return {
      repo,
      featured,
      name: repoData.name,
      description: repoData.description,
      url: repoData.html_url,
      homepage: repoData.homepage || null,
      language: repoData.language,
      stars: repoData.stargazers_count,
      topics: repoData.topics ?? [],
      updatedAt: repoData.updated_at,
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
      return { content: null, error: "README not found for this repository." };
    }

    if (!response.ok) {
      return { content: null, error: getGitHubErrorMessage(response.status, "README") };
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

function decodeBase64(content: string) {
  const binary = window.atob(content.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
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
