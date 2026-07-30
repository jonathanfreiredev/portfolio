import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutIntro } from "@/components/home/about-intro";
import { Cta } from "@/components/home/cta";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/home/hero";
import { MoreAboutMe } from "@/components/home/more-about-me";
import { Pricing } from "@/components/home/pricing";
import { Separator } from "@/components/ui/separator";

const Projects = dynamic(() =>
  import("@/components/home/projects").then((mod) => mod.Projects)
);
const Services = dynamic(() =>
  import("@/components/home/services").then((mod) => mod.Services)
);
const Workflow = dynamic(() =>
  import("@/components/home/workflow").then((mod) => mod.Workflow)
);

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("siteTitle"),
    description: t("siteDescription"),
  };
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-col w-full items-center">
      <Hero />
      <div className="flex flex-col gap-20 py-12 max-w-380 md:gap-24 md:py-16 lg:gap-40 lg:py-24 px-5 md:px-6 lg:px-8">
        <AboutIntro translations="home.aboutIntro" />
        <Projects />
        <Separator />
        <MoreAboutMe />
        <Separator />
        <Services />
        <Separator />
        <Workflow />
        <Separator />
        <Pricing />
        <Faq />
        <Separator />
        <Cta />
      </div>
    </main>
  );
}
