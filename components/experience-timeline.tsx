"use client";

import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { portableTextComponents } from "@/lib/portable-text-components";

type PortableBlock = {
  _key: string;
  _type: string;
  style?: string;
  children?: Array<{ _key: string; _type: string; text?: string }>;
};

type Experience = {
  _id: string;
  company: string;
  role: string;
  location: string;
  isCurrentJob?: boolean;
  startDate: string;
  endDate?: string;
  description: string;
  skills?: string[];
};

type ExperienceTimelineProps = {
  experiences: Experience[];
};

function formatMonthYear(date?: string) {
  if (!date) return "";
  return format(new Date(date), "MMM yyyy");
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  if (!experiences.length) return null;

  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 h-full w-px bg-border/70" />

      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="space-y-8"
      >
        {experiences
          .sort(
            (a, b) =>
              new Date(b.endDate || b.startDate).getTime() -
              new Date(a.endDate || a.startDate).getTime(),
          )
          .map((experience) => (
            <motion.li
              key={experience._id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative"
            >
              <div
                className={`absolute -left-[1.6rem] top-2 size-3 rounded-full border border-primary/30 bg-background ${
                  experience.isCurrentJob
                    ? "animate-pulse border-emerald-500/40 bg-emerald-500/70"
                    : ""
                }`}
              />

              <article className="space-y-3 rounded-xl border border-primary/10 bg-card/45 p-5 backdrop-blur-xl">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-lg text-foreground">{experience.role}</h3>
                  <p className="text-base text-foreground/95">
                    {experience.company}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="font-mono text-xs uppercase tracking-wide text-foreground/70">
                    {formatMonthYear(experience.startDate)} -{" "}
                    {experience.isCurrentJob
                      ? "Present"
                      : formatMonthYear(experience.endDate)}
                  </span>
                  <span className="hidden text-primary/30 md:inline">/</span>
                  <span>{experience.location}</span>
                </div>

                {/* <div className="text-sm text-muted-foreground">
                  {experience.description}
                </div> */}

                <div className="flex flex-wrap gap-2 pt-1">
                  {(experience.skills || []).map((skill) => (
                    <Badge
                      key={`${experience._id}-${skill}`}
                      variant="outline"
                      className="bg-primary/4 font-mono text-[11px] text-muted-foreground"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </article>
            </motion.li>
          ))}
      </motion.ol>
    </div>
  );
}
