import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProjectHero } from "@/components/projects/project-hero";
import { ProjectHighlights } from "@/components/projects/project-highlights";
import { ProjectMetaStrip } from "@/components/projects/project-meta";
import { ProjectNext } from "@/components/projects/project-next";
import { TableOfContents } from "@/components/table-of-contents";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { mdxComponents, rehypePrettyCodeOptions } from "@/lib/mdx-components";
import {
  rehypeCodeTitleToData,
  remarkCodeMetaToTitle,
  remarkUnwrapImages,
} from "@/lib/mdx-plugins";
import { extractHeadings } from "@/lib/posts";
import {
  getProjectBySlug,
  getProjectMeta,
  nextProjectMeta,
  PROJECT_SLUGS,
} from "@/lib/projects";
import { buildAlternates, buildOpenGraph, siteUrl } from "@/lib/seo";

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of routing.locales) {
    for (const slug of PROJECT_SLUGS) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const project = await getProjectBySlug(slug, locale);
  if (!project) {
    const t = await getTranslations({ locale, namespace: "projects" });
    return {
      title: t("notFoundTitle"),
      description: t("notFoundDescription"),
      robots: { index: false, follow: false },
    };
  }

  const feedPath =
    locale === routing.defaultLocale
      ? "/projects/rss.xml"
      : `/${locale}/projects/rss.xml`;

  return {
    title: project.title,
    description: project.description,
    alternates: {
      ...buildAlternates(`/projects/${slug}`, locale),
      types: { "application/rss+xml": feedPath },
    },
    openGraph: buildOpenGraph({
      title: project.title,
      description: project.description,
      locale,
      path: `/projects/${slug}`,
      type: "article",
    }),
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const project = await getProjectBySlug(slug, locale);
  const meta = getProjectMeta(slug);
  if (!project || !meta) notFound();

  const t = await getTranslations({ locale, namespace: "projects" });
  const headings = extractHeadings(project.content);

  const nextMeta = nextProjectMeta(slug);
  const nextProject = nextMeta
    ? await getProjectBySlug(nextMeta.slug, locale)
    : null;

  const projectUrl = `${siteUrl}${buildAlternates(`/projects/${slug}`, locale).canonical}`;
  const homeUrl = `${siteUrl}${buildAlternates("/", locale).canonical}`;
  const hubUrl = `${siteUrl}${buildAlternates("/projects", locale).canonical}`;

  const workSchema = {
    "@context": "https://schema.org",
    "@type":
      meta.status === "open-source"
        ? "SoftwareSourceCode"
        : "SoftwareApplication",
    "@id": `${projectUrl}#work`,
    name: project.title,
    description: project.description,
    url: meta.url ?? projectUrl,
    inLanguage: locale,
    author: { "@id": `${siteUrl}/#person` },
    creator: { "@id": `${siteUrl}/#person` },
    keywords: meta.stack.join(", "),
    ...(meta.status === "open-source"
      ? { programmingLanguage: "TypeScript", codeRepository: meta.repo ?? undefined }
      : {}),
    ...(meta.repo && meta.status !== "open-source"
      ? { codeRepository: meta.repo }
      : {}),
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      { "@type": "ListItem", position: 2, name: t("hubTitle"), item: hubUrl },
      { "@type": "ListItem", position: 3, name: project.title, item: projectUrl },
    ],
  };

  return (
    <main className="flex flex-col w-full items-center gap-20 pb-12 pt-20 max-w-380 md:gap-24 md:py-16 lg:gap-40 lg:pb-24 lg:py-32 px-5 md:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([workSchema, breadcrumbSchema]),
        }}
      />

      <div className="flex w-full flex-col gap-12 md:gap-24">
        <ProjectHero project={project} meta={meta} locale={locale} />
        <ProjectMetaStrip project={project} locale={locale} />
        <ProjectHighlights highlights={project.highlights} locale={locale} />

        <div className="grid gap-12 lg:grid-cols-[1fr_220px]">
          <article className="mx-auto w-full min-w-0 max-w-[680px]">
            <MDXRemote
              source={project.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkUnwrapImages, remarkCodeMetaToTitle],
                  rehypePlugins: [
                    [rehypePrettyCode, rehypePrettyCodeOptions],
                    rehypeCodeTitleToData,
                  ],
                },
              }}
            />
          </article>
          <TableOfContents headings={headings} />
        </div>

        {nextProject && nextMeta ? (
          <ProjectNext
            project={{ ...nextProject, meta: nextMeta }}
            locale={locale}
          />
        ) : null}

        <section className="flex w-full flex-col items-start gap-6 border-t border-primary/10 pt-12 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[40ch] text-lead text-foreground">
            {t("ctaText")}
          </p>
          <Button asChild size="lg">
            <Link href="/contact">{t("startProject")}</Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
