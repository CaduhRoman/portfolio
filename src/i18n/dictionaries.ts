// Todo texto visível do site mora aqui. O inglês define a forma; o português precisa ter as mesmas chaves.

const en = {
  meta: {
    title: "Carlos Romanow · Software & AI Engineer",
    description: "Software & AI engineer building agents, games and developer tools. See Taverna Harness, Guerra de Cartas and FramePilot.",
  },
  header: {
    nav: { projects: "My projects", education: "Education", contact: "Contact" },
    openMenu: "Open menu",
    closeMenu: "Close menu",
    sections: "Sections",
    switchLanguage: "Ver em português",
    theme: { toLight: "Switch to light mode", toDark: "Switch to dark mode" },
  },
  hero: {
    role: "Software & AI engineer",
    bio: "I build AI products end to end: from the first commit to deploy, across agents, games and developer tools.",
    location: "Brazil",
    cta: "See projects",
    socials: "Social links",
    characterAlt: "Pixel-art character of Carlos Romanow spinning",
    photoAlt: "Photo of Carlos Romanow",
  },
  projects: {
    title: "My projects",
    lead: "What I'm building right now.",
    taverna: {
      badge: "In progress",
      tagline: "Claude Code, Codex and Copilot at one table, each task in its own worktree.",
      tags: ["C#", "Avalonia", "Agents"],
      link: "github ↗",
      tasks: ["Tab system", "Permissions popover", "Summarize context"],
    },
    guerra: {
      name: "Card War",
      badge: "Beta",
      tagline: "Real-time card battles in the browser, 1v1 or 2v2 online.",
      tags: ["Three.js", "Next.js", "Supabase"],
      link: "play ↗",
      cardAlt: "Card",
    },
    framepilot: {
      badge: "MVP",
      tagline: "Video editing through chat: Claude writes the cuts in Remotion.",
      tags: ["Electron", "Remotion", "Claude Code"],
      meta: "desktop app",
      prompt: "cut the intro and add captions",
    },
  },
  education: {
    title: "Education",
    lead: "My academic foundation and what I've collected along the way.",
    degree: {
      level: "Bachelor's",
      course: "Information Technology",
      school: "Federal University of Mato Grosso do Sul",
      status: "In progress",
    },
    postgrad: {
      level: "Postgraduate",
      course: "Next step being defined",
      status: "Coming soon",
    },
    certsTitle: "Certifications & awards",
    certs: {
      ibmPython: "Python for Data Science, AI & Development",
      efset: "EF SET English Certificate · C1 Advanced",
      ibmDataviz: "Data Visualization and Dashboards with Excel and Cognos",
      dataAnalytics: "Data Analytics Essentials",
      obmep2017: "Honorable Mention, Brazilian Math Olympiad (OBMEP) 2017",
      obmep2018: "Honorable Mention, Brazilian Math Olympiad (OBMEP) 2018",
    },
  },
  contact: {
    title: "Let's build something?",
    text: "Reach out and let's develop a project together.",
    socials: "Contact",
  },
};

export type Dictionary = typeof en;

const pt: Dictionary = {
  meta: {
    title: "Carlos Romanow · Engenheiro de software & IA",
    description: "Engenheiro de software & IA construindo agentes, jogos e ferramentas para devs. Veja Taverna Harness, Guerra de Cartas e FramePilot.",
  },
  header: {
    nav: { projects: "Meus projetos", education: "Minha formação", contact: "Contato" },
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    sections: "Seções",
    switchLanguage: "View in English",
    theme: { toLight: "Mudar para o modo claro", toDark: "Mudar para o modo escuro" },
  },
  hero: {
    role: "Engenheiro de software & IA",
    bio: "Construo produtos com IA de ponta a ponta: do primeiro commit ao deploy, passando por agentes, jogos e ferramentas para devs.",
    location: "Brasil",
    cta: "Ver projetos",
    socials: "Redes",
    characterAlt: "Personagem pixelado de Carlos Romanow girando",
    photoAlt: "Foto de Carlos Romanow",
  },
  projects: {
    title: "Meus projetos",
    lead: "O que estou construindo agora.",
    taverna: {
      badge: "Em construção",
      tagline: "Claude Code, Codex e Copilot numa mesa só, cada task na sua worktree.",
      tags: ["C#", "Avalonia", "Agentes"],
      link: "github ↗",
      tasks: ["Sistema de abas", "Popover de permissões", "Resumir contexto"],
    },
    guerra: {
      name: "Guerra de Cartas",
      badge: "Beta",
      tagline: "Batalha de cartas em tempo real no navegador, 1v1 ou 2v2 online.",
      tags: ["Three.js", "Next.js", "Supabase"],
      link: "jogar ↗",
      cardAlt: "Carta",
    },
    framepilot: {
      badge: "MVP",
      tagline: "Edição de vídeo por chat: o Claude escreve os cortes em Remotion.",
      tags: ["Electron", "Remotion", "Claude Code"],
      meta: "app desktop",
      prompt: "corta a intro e põe legenda",
    },
  },
  education: {
    title: "Minha formação",
    lead: "A base acadêmica e o que fui colecionando no caminho.",
    degree: {
      level: "Graduação",
      course: "Tecnologia da Informação",
      school: "Universidade Federal de Mato Grosso do Sul",
      status: "Em andamento",
    },
    postgrad: {
      level: "Pós-graduação",
      course: "Próximo passo em definição",
      status: "Em breve",
    },
    certsTitle: "Certificações & reconhecimentos",
    certs: {
      ibmPython: "Python for Data Science, AI & Development",
      efset: "EF SET English Certificate · C1 Advanced",
      ibmDataviz: "Data Visualization and Dashboards with Excel and Cognos",
      dataAnalytics: "Data Analytics Essentials",
      obmep2017: "Menção Honrosa OBMEP 2017",
      obmep2018: "Menção Honrosa OBMEP 2018",
    },
  },
  contact: {
    title: "Vamos construir algo?",
    text: "Me contate para desenvolvermos um projeto juntos.",
    socials: "Contato",
  },
};

export const dictionaries = { en, pt };
export type Language = keyof typeof dictionaries;
