"use client";

import { SectionHeader } from "@/components/home/section-header";
import { cn } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";

type Project = {
  id: string;
  title: string;
  description: string;
  imagePublicId: string;
  logoPublicId: string;
  url: string | null;
  techStack: string[];
};

function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations(`home.projects.items.${project.id}`);

  const teckStack = project.techStack.join(", ");

  return (
    <div className="group flex w-full flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <div className="relative w-full aspect-square">
        <CldImage
          src={project.imagePublicId}
          alt={t("title")}
          fill={true}
          sizes="50vw"
          loading="eager"
        />

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-30 h-30 bg-white/10 
              backdrop-blur-lg 
              border border-white/20 
              shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] 
              rounded-2xl 
              text-white flex items-center justify-center lg:w-40 lg:h-40"
        >
          {project.id === "modern-nextjs-stack" ? (
            <div className="text-xl text-white/90 w-full p-5">
              <p>Modern</p>
              <p className="text-2xl font-bold text-white/90 text-center">
                NEXT.js
              </p>
              <p className="text-end">Stack</p>
            </div>
          ) : (
            <CldImage
              src={project.logoPublicId}
              alt={t("title")}
              fill={true}
              sizes="160px"
              className={cn(
                "w-auto h-auto object-contain",
                (project.id === "wandace" || project.id === "foodie") &&
                  "p-4 lg:p-8",
              )}
            />
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-end gap-2">
          <span className="bg-foreground/30 px-3 py-1.5 text-tag text-background uppercase text-end">
            {t("title")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-1">
        <span className="text-foreground/45 text-tag uppercase">
          {teckStack}
        </span>
        <h3 className="text-body-l text-foreground/80">{t("description")}</h3>
      </div>
    </div>
  );
}

export function Projects() {
  const t = useTranslations("home.projects");

  const projects: Project[] = [
    {
      id: "mantel-azul",
      title: "Mantel Azul · AI Cooking Assistant",
      description:
        "A social cooking platform where AI turns any photo into a recipe — built full stack, from computer vision integrations to real-time sharing and image generation.",
      url: "https://mantelazul.com",
      imagePublicId: "portfolio/mantel-azul-bg",
      logoPublicId: "portfolio/mantel-azul-logo",
      techStack: [
        "Next.js",
        "tRPC",
        "Vercel AI SDK",
        "OpenAI",
        "Flux",
        "PostgreSQL",
      ],
    },
    {
      id: "wandace",
      title: "Wandace · Unified Commerce Platform",
      description:
        "A full-featured commerce SaaS for retail, built from scratch — I owned the architecture end-to-end, from database design to cloud infrastructure, payments, and marketing integrations.",
      url: "https://wandace.com",
      imagePublicId: "portfolio/wandace-bg",
      logoPublicId: "portfolio/wandace-logo",
      techStack: [
        "Next.js",
        "NestJS",
        "GraphQL",
        "PostgreSQL",
        "Stripe",
        "Azure",
        "Docker",
      ],
    },
    {
      id: "modern-nextjs-stack",
      title: "Modern Next.js Stack · Open Source Boilerplate",
      description:
        "A production-ready Next.js starter with auth, type-safe DB, and a polished UI out of the box — zero setup overhead.",
      url: "https://github.com/jonathanfreiredev/modern-nextjs-stack",
      imagePublicId: "portfolio/modern-nextjs-stack-bg",
      logoPublicId: "portfolio/logo-modern-nextjs-stack",
      techStack: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "Better-Auth",
        "Zod",
        "Tailwind",
      ],
    },
    {
      id: "foodie",
      title: "Foodie · Digital Menu Platform",
      description:
        "Restaurants upload a photo or PDF of their physical menu — AI parses it into a fully branded digital experience with ordering and payment at the table.",
      url: null,
      imagePublicId: "portfolio/foodie-bg",
      logoPublicId: "portfolio/logo-foodie",
      techStack: ["Next.js", "TypeScript", "OpenAI API", "Prisma", "Vercel"],
    },
  ];

  return (
    <section id="projects" className="flex w-full flex-col gap-12 md:gap-24">
      <SectionHeader title={t("title")} text={t("text")} />

      <div className="grid grid-cols-1 gap-x-2 gap-y-12 md:grid-cols-2 md:gap-x-2 md:gap-y-24">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
