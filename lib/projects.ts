import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { routing, type AppLocale } from "@/i18n/routing";

const PROJECTS_DIR = path.join(process.cwd(), "projects");
const FALLBACK_LOCALE: AppLocale = routing.defaultLocale;

export type Locale = AppLocale;

export const PROJECT_SLUGS = [
  "mantel-azul",
  "wandace",
  "modern-nextjs-stack",
  "foodie",
] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export type ProjectStatus = "live" | "open-source" | "archived";

/**
 * Language-neutral facts about each project. The narrative and the localized
 * copy live in `projects/<locale>/<slug>.mdx`.
 */
export type ProjectMeta = {
  slug: ProjectSlug;
  order: number;
  status: ProjectStatus;
  /** Cloudinary public id used as the cover on the home and project pages. */
  cover: string;
  /** Cloudinary public id of the project logo used inside the glass tile. */
  logo: string;
  /** Live product, when there is one. */
  url: string | null;
  /** Public repository, when there is one. */
  repo: string | null;
  stack: string[];
};

export const PROJECT_META: Record<ProjectSlug, ProjectMeta> = {
  "mantel-azul": {
    slug: "mantel-azul",
    order: 1,
    status: "live",
    cover: "portfolio/mantel-azul-bg",
    logo: "portfolio/mantel-azul-logo",
    url: "https://mantelazul.com",
    repo: "https://github.com/jonathanfreiredev/mantelazul",
    stack: ["Next.js", "tRPC", "Vercel AI SDK", "OpenAI", "Chroma", "PostgreSQL"],
  },
  wandace: {
    slug: "wandace",
    order: 2,
    status: "live",
    cover: "portfolio/wandace-bg",
    logo: "portfolio/wandace-logo",
    url: "https://wandace.com",
    repo: null,
    stack: ["Next.js", "NestJS", "GraphQL", "RabbitMQ", "PostgreSQL", "Stripe"],
  },
  "modern-nextjs-stack": {
    slug: "modern-nextjs-stack",
    order: 3,
    status: "open-source",
    cover: "portfolio/modern-nextjs-stack-bg",
    logo: "portfolio/logo-modern-nextjs-stack",
    url: null,
    repo: "https://github.com/jonathanfreiredev/modern-nextjs-stack",
    stack: ["Next.js", "TypeScript", "Prisma", "Better-Auth", "Zod", "Tailwind"],
  },
  foodie: {
    slug: "foodie",
    order: 4,
    status: "archived",
    cover: "portfolio/foodie-bg",
    logo: "portfolio/logo-foodie",
    url: null,
    repo: "https://github.com/jatidevelopments/foodie",
    stack: [
      "Next.js",
      "TypeScript",
      "OpenAI",
      "Prisma",
      "Stripe Connect",
      "AWS",
    ],
  },
};

export function isProjectSlug(value: string): value is ProjectSlug {
  return (PROJECT_SLUGS as readonly string[]).includes(value);
}

export function getProjectMeta(slug: string): ProjectMeta | null {
  return isProjectSlug(slug) ? PROJECT_META[slug] : null;
}

export function getAllProjectMeta(): ProjectMeta[] {
  return PROJECT_SLUGS.map((slug) => PROJECT_META[slug]).sort(
    (a, b) => a.order - b.order,
  );
}

export function nextProjectMeta(slug: string): ProjectMeta | null {
  const all = getAllProjectMeta();
  const index = all.findIndex((project) => project.slug === slug);
  if (index < 0) return null;
  return all[(index + 1) % all.length] ?? null;
}

export type ProjectFrontmatter = {
  title: string;
  tagline: string;
  description: string;
  role: string;
  timeline: string;
  /** Company the project was built for, or "Personal project". */
  context: string;
  statusLabel: string;
  highlights: string[];
  updatedAt: string;
  slug: string;
};

export type Project = ProjectFrontmatter & {
  content: string;
};

function isLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

function projectsDir(locale: string): string {
  return path.join(PROJECTS_DIR, locale);
}

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  if (typeof value === "number") return new Date(value).toISOString().slice(0, 10);
  return "";
}

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function normaliseFrontmatter(
  data: Record<string, unknown>,
  fallbackSlug: string,
): ProjectFrontmatter {
  return {
    title: typeof data.title === "string" ? data.title : "",
    tagline: typeof data.tagline === "string" ? data.tagline : "",
    description: typeof data.description === "string" ? data.description : "",
    role: typeof data.role === "string" ? data.role : "",
    timeline: typeof data.timeline === "string" ? data.timeline : "",
    context: typeof data.context === "string" ? data.context : "",
    statusLabel: typeof data.statusLabel === "string" ? data.statusLabel : "",
    highlights: toStringList(data.highlights),
    updatedAt: toIsoDate(data.updatedAt),
    slug: typeof data.slug === "string" ? data.slug : fallbackSlug,
  };
}

async function listMdxFiles(locale: string): Promise<string[]> {
  let entries: string[] = [];
  try {
    const files = await fs.readdir(projectsDir(locale));
    entries = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  } catch {
    return [];
  }
  return entries;
}

async function readProjectFile(
  slug: string,
  locale: string,
): Promise<Project | null> {
  for (const ext of [".mdx", ".md"]) {
    const filePath = path.join(projectsDir(locale), `${slug}${ext}`);
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = matter(raw);
      return {
        ...normaliseFrontmatter(parsed.data, slug),
        content: parsed.content,
      };
    } catch {
      continue;
    }
  }
  return null;
}

export async function getProjectSlugs(locale: string): Promise<string[]> {
  if (!isLocale(locale)) return [];
  const files = await listMdxFiles(locale);
  return files.map((file) => file.replace(/\.mdx?$/, ""));
}

export async function getProjectBySlug(
  slug: string,
  locale: string,
): Promise<Project | null> {
  if (!isLocale(locale)) return null;
  const primary = await readProjectFile(slug, locale);
  if (primary) return primary;
  if (locale !== FALLBACK_LOCALE) {
    return readProjectFile(slug, FALLBACK_LOCALE);
  }
  return null;
}

export type ProjectSummary = Project & { meta: ProjectMeta };

export async function getAllProjects(locale: string): Promise<ProjectSummary[]> {
  if (!isLocale(locale)) return [];
  const projects: ProjectSummary[] = [];
  for (const slug of PROJECT_SLUGS) {
    const project = await getProjectBySlug(slug, locale);
    if (!project) continue;
    projects.push({ ...project, meta: PROJECT_META[slug] });
  }
  return projects;
}
