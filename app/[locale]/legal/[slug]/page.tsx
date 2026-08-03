import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/header";
import { mdxComponents } from "@/lib/mdx-components";
import { remarkUnwrapImages } from "@/lib/mdx-plugins";
import { getLegalBySlug, getLegalSlugs } from "@/lib/legal";
import { routing } from "@/i18n/routing";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/home/section-header";

type LegalPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of routing.locales) {
    const slugs = await getLegalSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: LegalPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const doc = await getLegalBySlug(slug, locale);
  if (!doc) {
    const t = await getTranslations({ locale, namespace: "legal" });
    return {
      title: t("metadata.notFoundTitle"),
      description: t("metadata.notFoundDescription"),
    };
  }
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: `${doc.title}${t("metadata.titleSuffix")}`,
    description: doc.description,
    robots: { index: false, follow: true },
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
    },
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const doc = await getLegalBySlug(slug, locale);
  if (!doc) notFound();

  return (
    <main className="flex flex-col w-full items-center gap-20 pb-12 pt-20 max-w-380 md:gap-24 md:py-16 lg:gap-40 lg:pb-24 lg:py-32 px-5 md:px-6 lg:px-8">
      <div id="projects" className="flex w-full flex-col gap-12 md:gap-24">
        <SectionHeader title={doc.title} text={doc.description} />

        <article className="px-5 w-full pt-5 pb-10">
          <div className="mx-auto w-full">
            <p className="mb-8 text-eyebrow text-muted-foreground">
              Last updated: {doc.updatedAt}
            </p>
            <section className="max-w-none">
              <MDXRemote
                source={doc.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkUnwrapImages],
                  },
                }}
              />
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
