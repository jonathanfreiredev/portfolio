"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { getBlockText, headingIdFromText } from "@/lib/portable-text"

type TocBlock = {
  _key: string
  _type: string
  style?: string
  children?: Array<{ text?: string }>
}

type Heading = {
  id: string
  text: string
  level: "h2" | "h3"
}

type TableOfContentsProps = {
  body: TocBlock[]
}

export function TableOfContents({ body }: TableOfContentsProps) {
  const headings = useMemo<Heading[]>(() => {
    return body
      .filter((block) => block?._type === "block" && (block.style === "h2" || block.style === "h3"))
      .map((block) => {
        const text = getBlockText(block)
        return {
          id: headingIdFromText(text || block._key),
          text,
          level: block.style as "h2" | "h3",
        }
      })
      .filter((heading) => Boolean(heading.text))
  }, [body])

  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: [0.1, 1],
      }
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <aside className="sticky top-24 hidden h-fit rounded-2xl border border-primary/15 bg-card/45 p-4 shadow-lg backdrop-blur-xl lg:block">
      <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Contenido</p>
      <nav className="relative space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(event) => {
              event.preventDefault()
              const el = document.getElementById(heading.id)
              if (!el) return
              el.scrollIntoView({ behavior: "smooth", block: "start" })
              history.replaceState(null, "", `#${heading.id}`)
            }}
            className={cn(
              "relative block rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground",
              heading.level === "h3" && "ml-4 text-xs",
              activeId === heading.id && "bg-muted/60 text-foreground"
            )}
          >
            {activeId === heading.id ? (
              <motion.span
                layoutId="toc-active"
                className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary"
              />
            ) : null}
            {heading.text}
          </a>
        ))}
      </nav>
    </aside>
  )
}
