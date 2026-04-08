"use client"

import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"

type HeroProps = {
  projectsCount: number
  postsCount: number
}

export function Hero({ projectsCount, postsCount }: HeroProps) {
  const title = "Building fast interfaces with Next.js and Sanity"

  return (
    <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-2xl border border-primary/15 bg-card/55 p-6 backdrop-blur-xl"
      >
        <Badge
          variant="outline"
          className="mb-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        >
          <span className="mr-1.5 inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
          Available for work
        </Badge>
        <h1 className="text-4xl md:text-5xl">
          {title.split(" ").map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.045, duration: 0.35 }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          High-end portfolio with editorial blog, interactive motion design, and a modern CMS workflow.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="grid gap-4"
      >
        <div className="rounded-2xl border border-primary/15 bg-card/55 p-5 backdrop-blur-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Projects
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tighter">{projectsCount}</p>
        </div>
        <div className="rounded-2xl border border-primary/15 bg-card/55 p-5 backdrop-blur-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Posts
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tighter">{postsCount}</p>
        </div>
      </motion.div>
    </section>
  )
}
