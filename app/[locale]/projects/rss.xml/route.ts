import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getAllProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function pathFor(locale: string, path: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${siteUrl}${prefix}${path}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response("Not found", { status: 404 });
  }

  const t = await getTranslations({ locale, namespace: "projects" });
  const projects = await getAllProjects(locale);

  const feedUrl = pathFor(locale, "/projects/rss.xml");
  const hubUrl = pathFor(locale, "/projects");

  const latest = projects
    .map((project) => project.updatedAt)
    .filter(Boolean)
    .sort()
    .reverse()[0];

  const lastBuildDate = latest
    ? new Date(latest).toUTCString()
    : new Date().toUTCString();

  const items = projects
    .map((project) => {
      const url = pathFor(locale, `/projects/${project.meta.slug}`);
      const pubDate = project.updatedAt
        ? new Date(project.updatedAt).toUTCString()
        : new Date().toUTCString();
      return `    <item>
      <title>${escapeXml(project.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(project.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jonathan Freire — ${escapeXml(t("hubTitle"))}</title>
    <link>${hubUrl}</link>
    <description>${escapeXml(t("hubDescription"))}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
