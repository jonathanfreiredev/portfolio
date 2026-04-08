import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";

import { TableOfContents } from "@/components/table-of-contents";
import { portableTextComponents } from "@/lib/portable-text-components";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { postBySlugQuery, postsQuery } from "@/sanity/lib/queries";

type PostDetail = {
  _id: string;
  title: string;
  slug: string;
  date: string;
  image?: unknown;
  body?: Array<{
    _key: string;
    _type: string;
    style?: string;
    children?: Array<{ _key: string; _type: string; text?: string }>;
  }>;
};

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

type PostSlugItem = {
  slug?: { current?: string };
};

type PostSeo = {
  title: string;
  excerpt?: string;
  image?: unknown;
};

const postSeoBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    "excerpt": coalesce(pt::text(body)[0...160], ""),
    image
  }
`;

export async function generateStaticParams() {
  let posts: PostSlugItem[] = [];
  try {
    posts = await client.fetch<PostSlugItem[]>(
      postsQuery,
      {},
      { next: { revalidate: 60 } },
    );
  } catch {
    posts = [];
  }

  return posts
    .map((post) => post.slug?.current)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  let post: PostSeo | null = null;
  try {
    post = await client.fetch<PostSeo | null>(
      postSeoBySlugQuery,
      { slug },
      { next: { revalidate: 60 } },
    );
  } catch {
    post = null;
  }

  if (!post) {
    return {
      title: "Post no encontrado",
      description: "El artículo solicitado no existe.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.image
        ? [urlFor(post.image).width(1200).height(630).url()]
        : [],
    },
  };
}

export default async function PostPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let post: PostDetail | null = null;
  try {
    post = await client.fetch<PostDetail | null>(
      postBySlugQuery,
      { slug },
      { next: { revalidate: 60 } },
    );
  } catch {
    post = null;
  }

  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_250px]">
        <article className="space-y-6">
          <p className="font-mono text-sm text-muted-foreground">
            {format(new Date(post.date), "MMMM dd, yyyy")}
          </p>
          <h1 className="text-3xl md:text-4xl">{post.title}</h1>

          {post.image ? (
            <Image
              src={urlFor(post.image).width(1400).height(800).url()}
              alt={post.title}
              width={1400}
              height={800}
              loading="eager"
              className="rounded-xl border border-primary/10 object-cover"
            />
          ) : null}

          <section className="px-4 py-2 max-w-none">
            <PortableText
              value={post.body || []}
              components={portableTextComponents}
            />
          </section>
        </article>
        <TableOfContents body={post.body || []} />
      </div>
    </main>
  );
}
