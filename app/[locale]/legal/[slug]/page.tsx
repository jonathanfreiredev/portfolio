import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Divider } from "@/components/home/divider";
import { LegalHeader } from "@/components/legal/header";
import { mdxComponents } from "@/lib/mdx-components";
import { remarkUnwrapImages } from "@/lib/mdx-plugins";
import { getLegalBySlug, getLegalSlugs } from "@/lib/legal";
import { routing } from "@/i18n/routing";

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
    <main className="flex-1">
      <LegalHeader title={doc.title} description={doc.description} />
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-12 lg:px-20">
        <Divider />
      </div>
      <article className="mx-auto w-full max-w-[1440px] px-5 pt-10 pb-12 md:px-12 md:pt-12 md:pb-16 lg:px-20 lg:pb-24">
        <div className="mx-auto w-full max-w-[680px]">
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
    </main>
  );
}
