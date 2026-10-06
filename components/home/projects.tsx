"use client";

import { SectionHeader } from "@/components/home/section-header";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";

type Project = {
  id: string;
  title: string;
  description: string;
  imagePublicId: string;
  logoPublicId: string;
  techStack: string[];
};

const PROJECTS: Project[] = [
  {
    id: "mantel-azul",
    title: "Mantel Azul · AI Cooking Assistant",
    description:
      "A multilingual recipe app with an AI cooking assistant. Turn a photo or a handwritten card into a recipe, search your own collection by meaning, and plan the week with your household.",
    imagePublicId: "portfolio/mantel-azul-bg",
    logoPublicId: "portfolio/mantel-azul-logo",
    techStack: [
      "Next.js",
      "tRPC",
      "Vercel AI SDK",
      "OpenAI",
      "Chroma",
      "PostgreSQL",
    ],
  },
  {
    id: "wandace",
    title: "Wandace · Multi-channel Retail Platform",
    description:
      "A retail platform for small merchants in Latin America: online stores, a point-of-sale app, inventory, orders, and catalog sync to marketplaces and messaging channels.",
    imagePublicId: "portfolio/wandace-bg",
    logoPublicId: "portfolio/wandace-logo",
    techStack: [
      "Next.js",
      "NestJS",
      "GraphQL",
      "RabbitMQ",
      "PostgreSQL",
      "Stripe",
    ],
  },
  {
    id: "modern-nextjs-stack",
    title: "Modern Next.js Stack · Open Source Boilerplate",
    description:
      "A production-ready Next.js starter with auth, a type-safe database, and a polished UI out of the box, so you skip the setup week.",
    imagePublicId: "portfolio/modern-nextjs-stack-bg",
    logoPublicId: "portfolio/logo-modern-nextjs-stack",
    techStack: ["Next.js", "TypeScript", "Prisma", "Better-Auth", "Zod", "Tailwind"],
  },
  {
    id: "foodie",
    title: "Foodie · Digital Menu Platform",
    description:
      "Restaurants upload a photo or PDF of their menu and AI turns it into a digital menu with QR ordering and payment at the table.",
    imagePublicId: "portfolio/foodie-bg",
    logoPublicId: "portfolio/logo-foodie",
    techStack: ["Next.js", "TypeScript", "OpenAI", "Prisma", "Stripe Connect", "AWS"],
  },
];

function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations(`home.projects.items.${project.id}`);

  const teckStack = project.techStack.join(", ");

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex w-full flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative w-full aspect-square">
        <CldImage
          src={project.imagePublicId}
          alt={t("title")}
          fill={true}
          sizes="50vw"
          crop="fill"
          aspectRatio="1:1"
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
        <span className="text-muted-foreground text-tag uppercase">
          {teckStack}
        </span>
        <p className="text-body-l text-foreground/80">{t("description")}</p>
      </div>
    </Link>
  );
}

export function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 gap-x-2 gap-y-12 md:grid-cols-2 md:gap-x-2 md:gap-y-24">
      {PROJECTS.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export function Projects() {
  const t = useTranslations("home.projects");

  return (
    <section id="projects" className="flex w-full flex-col gap-12 md:gap-24">
      <SectionHeader title={t("title")} text={t("text")} />

      <ProjectsGrid />
    </section>
  );
}
