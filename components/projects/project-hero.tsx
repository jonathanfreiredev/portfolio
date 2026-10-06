import { ArrowLeft, ArrowUpRight, Code2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CloudinaryImage } from "@/components/projects/cloudinary-image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Project, ProjectMeta } from "@/lib/projects";
import { cn } from "@/lib/utils";

type ProjectHeroProps = {
  project: Project;
  meta: ProjectMeta;
  locale: string;
};

export async function ProjectHero({ project, meta, locale }: ProjectHeroProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const hasSite = Boolean(meta.url);
  const hasRepo = Boolean(meta.repo);

  return (
    <section className="w-full border-b border-primary/10 pb-12 pt-8 md:pb-20 md:pt-14">
      <Link
        href="/projects"
        className="mb-10 inline-flex items-center gap-2 text-eyebrow uppercase text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {t("allProjects")}
      </Link>

      <div className="grid gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-end md:gap-16">
        <div className="flex min-w-0 flex-col gap-7">
          <div className="flex flex-wrap items-center gap-3 text-eyebrow uppercase text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span
                className="size-1.5 rounded-full bg-foreground"
                aria-hidden="true"
              />
              {project.statusLabel || t(`status.${meta.status}`)}
            </span>
          </div>

          <h1 className="text-display-l max-w-[18ch] text-foreground">
            {project.title}
          </h1>

          <p className="max-w-[44ch] text-lead text-foreground/80">
            {project.tagline}
          </p>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-tag uppercase text-muted-foreground">
            {meta.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {hasSite ? (
              <Button asChild size="lg">
                <a href={meta.url ?? undefined} target="_blank" rel="noreferrer noopener">
                  {t("visitSite")}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            ) : null}
            {hasRepo ? (
              <Button asChild size="lg" variant={hasSite ? "outline" : "default"}>
                <a href={meta.repo ?? undefined} target="_blank" rel="noreferrer noopener">
                  <Code2 aria-hidden="true" />
                  {t("viewRepo")}
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden border border-primary/10 bg-card md:aspect-square">
          <CloudinaryImage
            src={meta.cover}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
            aria-hidden="true"
          />
          <div className="absolute left-1/2 top-1/2 flex size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-lg md:size-36">
            {meta.slug === "modern-nextjs-stack" ? (
              <div className="w-full p-5 text-center text-lg leading-tight text-white/90 md:text-xl">
                <p>Modern</p>
                <p className="text-xl font-bold md:text-2xl">Next.js</p>
                <p>Stack</p>
              </div>
            ) : (
              <CloudinaryImage
                src={meta.logo}
                alt=""
                fill
                sizes="144px"
                className={cn(
                  "object-contain p-5",
                  (meta.slug === "wandace" || meta.slug === "foodie") && "p-8",
                )}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
