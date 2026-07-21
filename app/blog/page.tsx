import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllPosts } from "@/lib/posts";

const LOCALE = "en";

export default async function BlogPage() {
  const posts = await getAllPosts(LOCALE);

  return (
    <main className="mx-auto flex w-full max-w-[1024px] flex-1 flex-col gap-12 px-5 py-12 md:px-12 md:py-16 lg:px-20 lg:py-24">
      <h1>Blog</h1>
      {!posts.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No posts yet</CardTitle>
            <CardDescription>
              Add your first post in <code>posts/{LOCALE}/</code> to publish it here.
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
                    {post.readingTime} min read
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
    </main>
  );
}
