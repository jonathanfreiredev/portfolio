"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { urlFor } from "@/sanity/lib/image"

type Project = {
  _id: string
  title: string
  description: string
  image?: unknown
  url: string
  techStack?: string[]
}

type ProjectCardsProps = {
  projects: Project[]
}

export function ProjectCards({ projects }: ProjectCardsProps) {
  if (!projects.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No projects yet</CardTitle>
          <CardDescription>
            Start adding projects in Sanity Studio to see them here.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid gap-4 md:grid-cols-2"
    >
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.45, delay: index * 0.03, ease: "easeOut" }}
          whileHover={{
            y: -6,
            boxShadow: "0 20px 60px -30px color-mix(in oklab, var(--color-primary) 30%, transparent)",
          }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl"
        >
          <Card className="h-full border-primary/15 bg-card/60 backdrop-blur-xl">
            {project.image ? (
              <Image
                src={urlFor(project.image).width(900).height(500).url()}
                alt={project.title}
                width={900}
                height={500}
                className="h-48 w-full border-b border-primary/10 object-cover"
              />
            ) : null}
            <CardHeader className="pb-2">
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2 border-t border-primary/10 pt-4">
              {(project.techStack || []).map((tech) => (
                <Badge key={tech} variant="outline" className="bg-primary/5 font-mono text-[11px]">
                  {tech}
                </Badge>
              ))}
              <Link
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Ver proyecto
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
