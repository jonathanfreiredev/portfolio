import Image from "next/image";
import { format } from "date-fns";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SectionHeader } from "@/components/home/section-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/posts";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";

type BlogPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const feedPath =
    locale === routing.defaultLocale ? "/blog/rss.xml" : `/${locale}/blog/rss.xml`;
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      ...buildAlternates("/blog", locale),
      types: { "application/rss+xml": feedPath },
    },
    openGraph: buildOpenGraph({
      title: t("title"),
      description: t("description"),
      locale,
      path: "/blog",
    }),
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const posts = await getAllPosts(locale);

  return (
    <main className="flex flex-col w-full items-center gap-20 pb-12 pt-20 max-w-380 md:gap-24 md:py-16 lg:gap-40 lg:pb-24 lg:py-32 px-5 md:px-6 lg:px-8">
      <section className="flex w-full flex-col gap-12 md:gap-24">
      <SectionHeader as="h1" title={t("title")} text={t("description")} />
      {!posts.length ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("empty")}</CardTitle>
            <CardDescription>
              {t("emptyDescription", { folder: `posts/${locale}/` })}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
      <div className="space-y-6">
        {posts.map((post) => {
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border border-primary/10 bg-card p-6 transition-colors hover:border-primary/20"
            >
              <article className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
                {post.hero ? (
                  <Image
                    src={post.hero}
                    alt={post.title}
                    width={1000}
                    height={600}
                    className="h-36 w-full border border-primary/10 object-cover"
                  />
                ) : null}
                <div className="space-y-2">
                  <p className="text-eyebrow text-muted-foreground">
                    {format(new Date(post.date), "MMMM dd, yyyy")} ·{" "}
                    {post.readingTime} {t("readingTime")}
                  </p>
                  <h2 className="text-2xl">{post.title}</h2>
                  <p className="line-clamp-2 text-body-s text-muted-foreground">
                    {post.description.slice(0, 160)}
                  </p>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
      </section>
    </main>
  );
}
