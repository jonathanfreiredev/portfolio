import type { Metadata } from "next"

import { ConnectSection } from "@/components/connect-section"
import { Hero } from "@/components/hero"
import { ProjectCards } from "@/components/project-cards"
import { client } from "@/sanity/lib/client"
import { postsQuery, projectsQuery } from "@/sanity/lib/queries"

export const metadata: Metadata = {
  title: "Jonathan Freire | Portfolio",
  description:
    "Portfolio built with Next.js, Sanity and motion, showcasing projects and technical blog posts.",
}

type Project = {
  _id: string
  title: string
  description: string
  image?: unknown
  url: string
  techStack?: string[]
}

type Post = {
  _id: string
}

export default async function Home() {
  let projects: Project[] = []
  let posts: Post[] = []

  try {
    ;[projects, posts] = await Promise.all([
      client.fetch<Project[]>(projectsQuery, {}, { next: { revalidate: 60 } }),
      client.fetch<Post[]>(postsQuery, {}, { next: { revalidate: 60 } }),
    ])
  } catch {
    projects = []
    posts = []
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-20">
      <Hero projectsCount={projects.length} postsCount={posts.length} />
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Proyectos destacados</h2>
        <ProjectCards projects={projects} />
      </section>
      <section className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        Configura <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>,{" "}
        <code>NEXT_PUBLIC_SANITY_DATASET</code> y{" "}
        <code>NEXT_PUBLIC_SANITY_API_VERSION</code> para conectar tu contenido
        de Sanity.
      </section>
      <ConnectSection />
    </main>
  );
}
