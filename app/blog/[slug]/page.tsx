import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

import { TableOfContents } from "@/components/table-of-contents";
import { mdxComponents, rehypePrettyCodeOptions } from "@/lib/mdx-components";
import { remarkUnwrapImages } from "@/lib/mdx-plugins";
import {
  extractHeadings,
  extractHeroImage,
  getPostBySlug,
  getPostSlugs,
} from "@/lib/posts";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const LOCALE = "en";

export async function generateStaticParams() {
  const slugs = await getPostSlugs(LOCALE);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, LOCALE);

  if (!post) {
    return {
      title: "Post not found",
      description: "The requested article does not exist.",
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
  const { slug } = await params;
  const post = await getPostBySlug(slug, LOCALE);

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
