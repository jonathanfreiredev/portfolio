"use client"

import { motion, useScroll, useSpring } from "motion/react"
import { usePathname } from "next/navigation"

export function ReadingProgress() {
  const pathname = usePathname()
  const isBlogDetail = /^\/blog\/[^/]+/.test(pathname)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20 })

  if (!isBlogDetail) return null

  return (
    <motion.div
      style={{ scaleX }}
      className="absolute top-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-primary/80 via-primary to-primary/70"
    />
  )
}
