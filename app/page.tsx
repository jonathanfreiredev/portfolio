import type { Metadata } from "next";

import { ConnectSection } from "@/components/connect-section";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Hero } from "@/components/hero";
import { ProjectCards } from "@/components/project-cards";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { client } from "@/sanity/lib/client";
import { experiencesQuery, projectsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Jonathan Freire | Portfolio",
  description:
    "Portfolio built with Next.js, Sanity and motion, showcasing projects and technical blog posts.",
};

type Project = {
  _id: string;
  title: string;
  description: string;
  image?: unknown;
  url: string;
  techStack?: string[];
};

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

export default async function Home() {
  let projects: Project[] = [];
  let experiences: Experience[] = [];

  try {
    const [projectData, experienceData] = await Promise.all([
      client.fetch<Project[]>(projectsQuery, {}, { next: { revalidate: 60 } }),
      client.fetch<Experience[]>(
        experiencesQuery,
        {},
        { next: { revalidate: 60 } },
      ),
    ]);
    projects = projectData;
    experiences = experienceData;
  } catch {
    projects = [];
    experiences = [];
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-20">
      <Hero />
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Core Expertise</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Full-Stack Development",
              desc: "TypeScript across the entire stack — Next.js and Nest.js on the frontend and backend, GraphQL and REST for APIs, with a focus on type safety and long-term maintainability.",
            },
            {
              title: "Third-Party Integrations",
              desc: "From bi-directional CRM sync to payment providers and AI services. I've built and maintained production integrations that keep business data consistent across platforms.",
            },
            {
              title: "Cloud Infrastructure & Databases",
              desc: "Database design with PostgreSQL and TypeORM, containerization with Docker, and cloud deployment on Azure and AWS — with an eye on security and cost efficiency.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="border-primary/15 bg-card/60 backdrop-blur-xl"
            >
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-medium text-foreground">
          Professional Trajectory
        </h2>
        <ExperienceTimeline experiences={experiences} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Selected Works</h2>
        <ProjectCards projects={projects} />
      </section>

      <ConnectSection />
    </main>
  );
}
