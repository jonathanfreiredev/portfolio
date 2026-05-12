"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="grid items-center gap-10 rounded-2xl border border-primary/15 bg-card/55 p-6 backdrop-blur-xl md:grid-cols-[1.2fr_0.8fr] md:p-8"
    >
      <div>
        <Badge
          variant="outline"
          className="mb-5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        >
          <span className="mr-1.5 inline-flex size-2 animate-pulse rounded-full bg-emerald-500" />
          Available for work
        </Badge>

        <h1 className="text-4xl leading-tight md:text-5xl">
          Building full-stack systems made to last.
        </h1>

        <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
          Software Engineer and ex-Founder with a focus on TypeScript across the
          entire stack, from database architecture to cloud deployment.
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[18rem] md:max-w-sm">
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-2 shadow-[0_20px_80px_-45px_rgba(16,185,129,0.6)] backdrop-blur-xl">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-8 -top-8 size-32 rounded-full bg-emerald-500/25 blur-3xl"
            animate={{
              x: [0, 16, -8, 0],
              y: [0, -10, 12, 0],
              scale: [1, 1.08, 0.96, 1],
            }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-10 -right-8 size-36 rounded-full bg-sky-500/20 blur-3xl"
            animate={{
              x: [0, -14, 10, 0],
              y: [0, 12, -10, 0],
              scale: [1, 0.94, 1.06, 1],
            }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-400/10 via-transparent to-sky-400/10"
            animate={{ rotate: [0, 8, 0, -8, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          />

          <Image
            src="https://res.cloudinary.com/ddjovluur/image/upload/v1775658098/portfolio/me-cv_tuzgxf.jpg"
            alt="Jonathan Freire profile photo"
            width={720}
            height={900}
            priority
            className="relative z-10 h-[300px] w-full rounded-xl border border-white/25 object-cover object-top md:h-auto md:max-h-[430px]"
          />
        </div>
      </div>
    </motion.section>
  );
}
