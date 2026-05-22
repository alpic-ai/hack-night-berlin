export type Resource = {
  id: string;
  title: string;
  icon: string;
  desc: string;
  url: string;
  longDesc: string;
};

const QUICKSTART_URL = "https://docs.skybridge.tech/quickstart/create-new-app";

export const RESOURCES: Resource[] = [
  {
    id: "skybridge-repo",
    title: "Skybridge",
    icon: "🌉",
    desc: "Open-source framework for GPT Apps (this one!)",
    url: "https://github.com/alpic-ai/skybridge",
    longDesc:
      "Skybridge is the framework this very app is built on. React-based views, tool registration, dev tools out of the box. Star it, fork it, ship your GPT App with it.",
  },
  {
    id: "skybridge-docs",
    title: "Skybridge Docs",
    icon: "📘",
    desc: "Full Skybridge documentation",
    url: "https://docs.skybridge.tech/home",
    longDesc:
      "The complete Skybridge documentation — guides, API reference, examples. Use this as your primary source while building.",
  },
];

const QUICKSTART: Resource = {
  id: "quickstart",
  title: "Create your first app",
  icon: "🚀",
  desc: "Skybridge quickstart — create a new GPT App",
  url: QUICKSTART_URL,
  longDesc:
    "Start here. The Skybridge quickstart walks you through creating a new GPT App from scratch — install, scaffold, run, ship. Takes about 5 minutes.",
};

export function findResource(query: string | undefined): Resource | null {
  if (!query) return null;
  const q = query.toLowerCase().trim();

  if (/start|begin|first|where.+(start|begin)|quickstart|new|create/.test(q)) {
    return QUICKSTART;
  }

  const directIdHit = RESOURCES.find((r) => r.id === q);
  if (directIdHit) return directIdHit;

  if (/doc|guide|reference|home/.test(q)) {
    return RESOURCES.find((r) => r.id === "skybridge-docs") ?? null;
  }
  if (/skybridge|framework|repo|github|source/.test(q)) {
    return RESOURCES.find((r) => r.id === "skybridge-repo") ?? null;
  }

  return (
    RESOURCES.find((r) => r.title.toLowerCase().includes(q)) ??
    RESOURCES.find((r) => r.desc.toLowerCase().includes(q)) ??
    null
  );
}
