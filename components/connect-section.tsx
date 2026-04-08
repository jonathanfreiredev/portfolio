"use client"

import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { motion, useMotionValue, useSpring } from "motion/react"

const links = [
  { href: "https://github.com", label: "GitHub", icon: Github },
  { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
  { href: "mailto:hello@example.com", label: "Email", icon: Mail },
]

function MagneticLink({
  href,
  label,
  Icon,
}: {
  href: string
  label: string
  Icon: typeof Github
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mx = useSpring(x, { stiffness: 260, damping: 20 })
  const my = useSpring(y, { stiffness: 260, damping: 20 })

  return (
    <motion.div
      style={{ x: mx, y: my }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const dx = event.clientX - (rect.left + rect.width / 2)
        const dy = event.clientY - (rect.top + rect.height / 2)
        x.set(dx * 0.18)
        y.set(dy * 0.18)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
    >
      <Link
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className="flex items-center gap-2 rounded-xl border border-primary/15 bg-card/50 px-4 py-3 text-sm backdrop-blur-xl"
      >
        <Icon className="size-4" />
        {label}
      </Link>
    </motion.div>
  )
}

export function ConnectSection() {
  return (
    <section className="space-y-4 rounded-2xl border border-primary/15 bg-card/40 p-6 backdrop-blur-xl">
      <h2 className="text-2xl">Connect</h2>
      <p className="text-sm text-muted-foreground">
        Let&apos;s collaborate on product design systems, frontend architecture, and polished user experiences.
      </p>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <MagneticLink key={link.label} href={link.href} label={link.label} Icon={link.icon} />
        ))}
      </div>
    </section>
  )
}
