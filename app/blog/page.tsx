import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { postsQuery } from "@/sanity/lib/queries";

type Post = {
  _id: string;
  title: string;
  slug?: { current?: string };
  date: string;
  image?: unknown;
  excerpt?: string;
};

function readingTimeFromText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export default async function BlogPage() {
  let posts: Post[] = [];
  try {
    posts = await client.fetch<Post[]>(
      postsQuery,
      {},
      { next: { revalidate: 60 } },
    );
  } catch {
    posts = [];
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-12 md:py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      {!posts.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No posts yet</CardTitle>
            <CardDescription>
              Add your first post in Sanity Studio to publish it here.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
      <div className="space-y-4">
        {posts.map((post) => {
          const slug = post.slug?.current;
          if (!slug) return null;

          const readingTime = readingTimeFromText(post.excerpt || post.title);

          return (
            <Link
              key={post._id}
              href={`/blog/${slug}`}
              className="group block rounded-2xl border border-primary/15 bg-card/55 p-4 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-35px_color-mix(in_oklab,var(--color-primary)_50%,transparent)]"
            >
              <article className="grid gap-4 md:grid-cols-[220px_1fr] md:items-center">
                {post.image ? (
                  <Image
                    src={urlFor(post.image).width(1000).height(600).url()}
                    alt={post.title}
                    width={1000}
                    height={600}
                    className="h-36 w-full rounded-xl border border-primary/10 object-cover"
                  />
                ) : null}
                <div className="space-y-2">
                  <p className="font-mono text-xs text-muted-foreground">
                    {format(new Date(post.date), "MMMM dd, yyyy")} ·{" "}
                    {readingTime} min read
                  </p>
                  <h2 className="text-2xl group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {(post.excerpt || "").slice(0, 160)}
                  </p>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
