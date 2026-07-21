"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import type { PostHeading } from "@/lib/posts"

type TableOfContentsProps = {
  headings: PostHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const t = useTranslations("tableOfContents")
  const items = useMemo(() => headings.filter((h) => Boolean(h.text)), [headings])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (!items.length) return

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

    items.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <aside className="sticky top-24 hidden h-fit lg:block">
      <p className="mb-4 pl-4 text-eyebrow text-muted-foreground">{t("title")}</p>
      <nav className="relative">
        {items.map((heading) => (
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
              "relative block py-1.5 pl-4 text-sm transition-colors",
              heading.level === 3 && "pl-7 text-xs",
              activeId === heading.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {activeId === heading.id ? (
              <motion.span
                layoutId="toc-active"
                className="absolute left-0 top-0 h-full w-0.5 bg-foreground"
              />
            ) : null}
            {heading.text}
          </a>
        ))}
      </nav>
    </aside>
  )
}
