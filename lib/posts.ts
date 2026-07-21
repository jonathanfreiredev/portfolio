import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { routing, type AppLocale } from "@/i18n/routing";

const POSTS_DIR = path.join(process.cwd(), "posts");
const FALLBACK_LOCALE: AppLocale = routing.defaultLocale;

export type Locale = AppLocale;

export type PostFrontmatter = {
  title: string;
  date: string;
  slug: string;
  description: string;
  tags?: string[];
};

export type Post = PostFrontmatter & {
  content: string;
};

export type PostSummary = PostFrontmatter & {
  readingTime: number;
  hero: string | null;
};

export type PostHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function isLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

function postsDir(locale: string): string {
  return path.join(POSTS_DIR, locale);
}

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  if (typeof value === "number") return new Date(value).toISOString().slice(0, 10);
  return "";
}

function normaliseFrontmatter(data: Record<string, unknown>, fallbackSlug: string): PostFrontmatter {
  const tags = Array.isArray(data.tags)
    ? (data.tags.filter((t) => typeof t === "string") as string[])
    : undefined;

  return {
    title: typeof data.title === "string" ? data.title : "",
    date: toIsoDate(data.date),
    slug: typeof data.slug === "string" ? data.slug : fallbackSlug,
    description: typeof data.description === "string" ? data.description : "",
    tags: tags && tags.length ? tags : undefined,
  };
}

async function listMdxFiles(locale: string): Promise<string[]> {
  let entries: string[] = [];
  try {
    const files = await fs.readdir(postsDir(locale));
    entries = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  } catch {
    return [];
  }
  return entries;
}

async function readPostFile(slug: string, locale: string): Promise<Post | null> {
  for (const ext of [".mdx", ".md"]) {
    const filePath = path.join(postsDir(locale), `${slug}${ext}`);
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

export async function getPostSlugs(locale: string): Promise<string[]> {
  if (!isLocale(locale)) return [];
  const files = await listMdxFiles(locale);
  return files.map((file) => file.replace(/\.mdx?$/, ""));
}

export async function getPostBySlug(
  slug: string,
  locale: string,
): Promise<Post | null> {
  if (!isLocale(locale)) return null;
  const primary = await readPostFile(slug, locale);
  if (primary) return primary;
  if (locale !== FALLBACK_LOCALE) {
    return readPostFile(slug, FALLBACK_LOCALE);
  }
  return null;
}

export async function getAllPosts(locale: string): Promise<PostSummary[]> {
  if (!isLocale(locale)) return [];
  const slugs = await getPostSlugs(locale);
  const posts: PostSummary[] = [];
  for (const slug of slugs) {
    const post = await getPostBySlug(slug, locale);
    if (!post) continue;
    if (!post.title || !post.date) continue;
    posts.push({
      ...post,
      readingTime: readingTimeFromText(post.content),
      hero: extractHeroImage(post.content).hero,
    });
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function readingTimeFromText(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export function extractHeroImage(content: string): { hero: string | null; content: string } {
  const match = content.match(/^\s*!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*\n/);
  if (!match) return { hero: null, content };
  return { hero: match[1], content: content.slice(match[0].length) };
}

export function extractHeadings(content: string): PostHeading[] {
  const headings: PostHeading[] = [];
  const lines = content.split(/\r?\n/);
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = line.match(/^(##|###)\s+(.+?)\s*$/);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2]
      .replace(/`/g, "")
      .replace(/\*\*?/g, "")
      .replace(/\[(.+?)\]\([^)]*\)/g, "$1")
      .trim();
    if (!text) continue;
    headings.push({
      id: headingIdFromText(text),
      text,
      level,
    });
  }
  return headings;
}

export function headingIdFromText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
