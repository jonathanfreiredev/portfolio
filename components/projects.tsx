"use client";

type Project = {
  _id: string;
  title: string;
  description: string;
  image?: unknown;
  url: string;
  techStack?: string[];
};

const projects: Project[] = [
  {
    _id: "mantel-azul",
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
    _id: "wandace",
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
    _id: "modern-nextjs-stack",
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
];

export function Projects() {
  if (!projects.length) {
    return <></>;
  }

  return <></>;
}
