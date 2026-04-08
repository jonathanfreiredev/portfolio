"use client"

import Link from "next/link"
import { MenuIcon } from "lucide-react"
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { useState } from "react"

import { ModeToggle } from "@/components/mode-toggle"
import { ReadingProgress } from "@/components/reading-progress"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { usePathname } from "next/navigation"

export function Navbar() {
  const isProduction = process.env.NODE_ENV === "production";
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [compact, setCompact] = useState(false)

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0
    setCompact(current > 24)
    setHidden(current > 140 && current > previous)
  })

  const isStudio = usePathname().includes("/studio");

  if (isStudio) return null;

  return (
    <motion.header
      initial={false}
      animate={{
        y: hidden ? -84 : 0,
        scale: compact ? 0.97 : 1,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="sticky top-3 z-50 mx-auto w-[min(980px,calc(100%-1rem))] rounded-2xl border border-primary/15 bg-background/65 shadow-lg backdrop-blur-xl"
    >
      <ReadingProgress />
      <div className="mx-auto flex h-14 w-full items-center justify-between px-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Jonathan Freire
          </Link>
        </motion.div>
        <nav className="hidden items-center gap-2 md:flex">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/blog"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
          </motion.div>
          {!isProduction && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/studio"
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Studio
              </Link>
            </motion.div>
          )}
          <ModeToggle />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <MenuIcon />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[82%] max-w-sm">
              <SheetHeader>
                <SheetTitle>Navegación</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3 px-4 py-2">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="rounded-lg border px-4 py-4 text-lg font-medium"
                  >
                    Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/blog"
                    className="rounded-lg border px-4 py-4 text-lg font-medium"
                  >
                    Blog
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
