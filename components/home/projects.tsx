"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { SectionHeader } from "@/components/home/section-header";
import { ImagePlaceholder } from "@/components/home/image-placeholder";

type Project = {
  id: string;
  title: string;
  description: string;
  image?: string;
  url: string | null;
  techStack: string[];
};

function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations(`home.projects.items.${project.id}`);

  const teckStack = project.techStack.join(", ");

  return (
    <div className="group flex w-full flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <div className="relative w-full">
        <ImagePlaceholder
          // TODO: reemplazar imagen
          label={t("title")}
          className="aspect-square w-full"
        />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-end gap-2">
          <span className="bg-foreground/10 px-3 py-1.5 text-tag text-background uppercase text-end">
            {t("description")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-1">
        <span className="text-foreground/45 text-tag uppercase">
          {teckStack}
        </span>
        <h3 className="text-h4 text-foreground uppercase">{t("title")}</h3>
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
        "An AI-powered cooking community where users can create recipes from photos using computer vision, get personalized culinary assistance, and share their cooking in real time. I built the full stack — from the cookbook system and social features to the AI integrations using the Vercel AI SDK and Flux for image generation.",
      url: "https://mantelazul.com",
      techStack: [
        "Next.js",
        "tRPC",
        "TailwindCSS",
        "Shadcn",
        "Vercel AI SDK (OpenAI)",
        "Flux (Image Generation)",
        "Prisma",
        "PostgreSQL",
        "Better Auth",
      ],
    },
    {
      id: "wandace",
      title: "Wandace · Unified Commerce Platform",
      description:
        "A sales and management platform for retail businesses, built from scratch. I led the architecture end-to-end, covering database design, cloud infrastructure on Azure, and integrations with payment providers and marketing engines.",
      url: "https://wandace.com",
      techStack: [
        "Next.js",
        "Nest.js",
        "TypeScript",
        "PostgreSQL",
        "TypeORM",
        "GraphQL (Apollo)",
        "tRPC",
        "NextAuth.js",
        "Passport",
        "Stripe",
        "Azure",
        "Docker",
        "Mantine",
        "Next-intl",
      ],
    },
    {
      id: "modern-nextjs-stack",
      title: "Modern Next.js Stack · Open Source Boilerplate",
      description:
        "A production-ready Next.js boilerplate with authentication, database logic, and a modern UI setup out of the box. Built for developers who want a solid, type-safe foundation without the initial setup overhead.",
      url: "https://github.com/jonathanfreiredev/modern-nextjs-stack",
      techStack: [
        "TypeScript",
        "Next.js",
        "next-safe-action",
        "Better-Auth",
        "Prisma",
        "Tailwind",
        "Zod",
      ],
    },
    {
      id: "foodie",
      title: "Foodie · Digital Menu Platform",
      description:
        "A digital menu platform for restaurants, accessible via QR code from the table. Restaurants could upload a photo or PDF of their physical menu and the system would automatically parse it into a fully customised digital menu. Customers could browse, order, and pay directly from the table. Built a full order management system with per-table and online order tracking, and a unique branded experience for each venue.",
      url: null,
      techStack: [
        "TypeScript",
        "Next.js",
        "Prisma",
        "NextAuth.js",
        "OpenAI API",
        "CSS",
        "Vercel",
      ],
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
