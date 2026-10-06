import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SectionHeader } from "@/components/home/section-header";
import { ProjectsGrid } from "@/components/home/projects";
import { routing } from "@/i18n/routing";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "projects" });
  const feedPath =
    locale === routing.defaultLocale
      ? "/projects/rss.xml"
      : `/${locale}/projects/rss.xml`;

  return {
    title: t("hubTitle"),
    description: t("hubDescription"),
    alternates: {
      ...buildAlternates("/projects", locale),
      types: { "application/rss+xml": feedPath },
    },
    openGraph: buildOpenGraph({
      title: t("hubTitle"),
      description: t("hubDescription"),
      locale,
      path: "/projects",
    }),
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <main className="flex flex-col w-full items-center gap-20 pb-12 pt-20 max-w-380 md:gap-24 md:py-16 lg:gap-40 lg:pb-24 lg:py-32 px-5 md:px-6 lg:px-8">
      <section className="flex w-full flex-col gap-12 md:gap-24">
        <SectionHeader as="h1" title={t("hubTitle")} text={t("hubDescription")} />
        <ProjectsGrid />
      </section>
    </main>
  );
}
