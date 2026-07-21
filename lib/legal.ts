import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { routing, type AppLocale } from "@/i18n/routing";

const LEGAL_DIR = path.join(process.cwd(), "legal");
const FALLBACK_LOCALE: AppLocale = routing.defaultLocale;

export type Locale = AppLocale;

export type LegalFrontmatter = {
  title: string;
  description: string;
  updatedAt: string;
  slug: string;
};

export type Legal = LegalFrontmatter & {
  content: string;
};

function isLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

function legalDir(locale: string): string {
  return path.join(LEGAL_DIR, locale);
}

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  if (typeof value === "number") return new Date(value).toISOString().slice(0, 10);
  return "";
}

function normaliseFrontmatter(
  data: Record<string, unknown>,
  fallbackSlug: string,
): LegalFrontmatter {
  return {
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    updatedAt: toIsoDate(data.updatedAt),
    slug: typeof data.slug === "string" ? data.slug : fallbackSlug,
  };
}

async function listMdxFiles(locale: string): Promise<string[]> {
  let entries: string[] = [];
  try {
    const files = await fs.readdir(legalDir(locale));
    entries = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  } catch {
    return [];
  }
  return entries;
}

async function readLegalFile(
  slug: string,
  locale: string,
): Promise<Legal | null> {
  for (const ext of [".mdx", ".md"]) {
    const filePath = path.join(legalDir(locale), `${slug}${ext}`);
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

export async function getLegalSlugs(locale: string): Promise<string[]> {
  if (!isLocale(locale)) return [];
  const files = await listMdxFiles(locale);
  return files.map((file) => file.replace(/\.mdx?$/, ""));
}

export async function getLegalBySlug(
  slug: string,
  locale: string,
): Promise<Legal | null> {
  if (!isLocale(locale)) return null;
  const primary = await readLegalFile(slug, locale);
  if (primary) return primary;
  if (locale !== FALLBACK_LOCALE) {
    return readLegalFile(slug, FALLBACK_LOCALE);
  }
  return null;
}
