import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { TableOfContents } from "@/components/table-of-contents";
import { mdxComponents, rehypePrettyCodeOptions } from "@/lib/mdx-components";
import { remarkUnwrapImages } from "@/lib/mdx-plugins";
import {
  extractHeadings,
  extractHeroImage,
  getPostBySlug,
  getPostSlugs,
} from "@/lib/posts";
import { routing } from "@/i18n/routing";

type BlogDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of routing.locales) {
    const slugs = await getPostSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    const t = await getTranslations({ locale, namespace: "blog" });
    return {
      title: t("postNotFoundTitle"),
      description: t("postNotFoundDescription"),
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images: (() => {
        const hero = extractHeroImage(post.content).hero;
        return hero ? [{ url: hero }] : [];
      })(),
    },
  };
}

export default async function PostPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const { hero, content } = extractHeroImage(post.content);
  const headings = extractHeadings(content);

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-12 md:px-12 md:py-16 lg:px-20 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_220px]">
        <article className="mx-auto w-full max-w-[680px] space-y-6">
          <p className="text-eyebrow text-muted-foreground">
            {format(new Date(post.date), "MMMM dd, yyyy")}
          </p>
          <h1>{post.title}</h1>

          {hero ? (
            <Image
              src={hero}
              alt={post.title}
              width={1400}
              height={800}
              loading="eager"
              className="border border-primary/10 object-cover"
            />
          ) : null}

          <section className="max-w-none">
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkUnwrapImages],
                  rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
                },
              }}
            />
          </section>
        </article>
        <TableOfContents headings={headings} />
      </div>
    </main>
  );
}
