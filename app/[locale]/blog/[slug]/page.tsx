import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { TableOfContents } from "@/components/table-of-contents";
import { mdxComponents, rehypePrettyCodeOptions } from "@/lib/mdx-components";
import {
  rehypeCodeTitleToData,
  remarkCodeMetaToTitle,
  remarkUnwrapImages,
} from "@/lib/mdx-plugins";
import {
  extractHeadings,
  extractHeroImage,
  getPostBySlug,
  getPostSlugs,
} from "@/lib/posts";
import { routing } from "@/i18n/routing";
import { buildAlternates, buildOpenGraph, siteUrl } from "@/lib/seo";

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
      robots: { index: false, follow: false },
    };
  }

  const feedPath =
    locale === routing.defaultLocale ? "/blog/rss.xml" : `/${locale}/blog/rss.xml`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      ...buildAlternates(`/blog/${slug}`, locale),
      types: { "application/rss+xml": feedPath },
    },
    openGraph: buildOpenGraph({
      title: post.title,
      description: post.description,
      locale,
      path: `/blog/${slug}`,
      type: "article",
    }),
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

  const postUrl = `${siteUrl}${buildAlternates(`/blog/${slug}`, locale).canonical}`;
  const homeUrl = `${siteUrl}${buildAlternates("/", locale).canonical}`;
  const blogUrl = `${siteUrl}${buildAlternates("/blog", locale).canonical}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: locale,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    url: postUrl,
    author: { "@id": `${siteUrl}/#person` },
    publisher: { "@id": `${siteUrl}/#person` },
    ...(hero
      ? {
          image: {
            "@type": "ImageObject",
            url: hero,
            width: 1400,
            height: 800,
          },
        }
      : {}),
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: blogUrl },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-12 md:px-12 md:py-16 lg:px-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogPostingSchema, breadcrumbSchema]),
        }}
      />
      <div className="grid gap-12 lg:grid-cols-[1fr_220px]">
        <article className="mx-auto w-full min-w-0 max-w-[680px] space-y-6">
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
              sizes="(max-width: 680px) 100vw, 680px"
              loading="eager"
              className="h-auto w-full border border-primary/10 object-cover"
            />
          ) : null}

          <section className="min-w-0 max-w-none">
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkUnwrapImages, remarkCodeMetaToTitle],
                  rehypePlugins: [
                    [rehypePrettyCode, rehypePrettyCodeOptions],
                    rehypeCodeTitleToData,
                  ],
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
