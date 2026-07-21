import type { Metadata } from "next";

import { client } from "@/sanity/lib/client";
import { experiencesQuery, projectsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "",
  description: "",
};

type Project = {
  _id: string;
  title: string;
  description: string;
  image?: unknown;
  url: string;
  techStack?: string[];
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

  return <main></main>;
}
