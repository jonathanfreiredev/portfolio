"use client";

type Project = {
  _id: string;
  title: string;
  description: string;
  image?: unknown;
  url: string;
  techStack?: string[];
};

type ProjectsProps = {
  projects: Project[];
};

export function Projects({ projects }: ProjectsProps) {
  if (!projects.length) {
    return <></>;
  }

  return <></>;
}
