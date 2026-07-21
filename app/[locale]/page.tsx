import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutIntro } from "@/components/home/about-intro";
import { Cta } from "@/components/home/cta";
import { Divider } from "@/components/home/divider";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { Pricing } from "@/components/home/pricing";
import { Projects } from "@/components/home/projects";
import { Services } from "@/components/home/services";
import { TheStudio } from "@/components/home/the-studio";
import { Workflow } from "@/components/home/workflow";

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
    <div className="mx-auto w-full max-w-[1440px]">
      <Hero />
      <div className="flex flex-col gap-12 px-5 py-12 md:gap-24 md:px-12 md:py-16 lg:gap-40 lg:px-20 lg:py-24">
        <AboutIntro />
        <Divider />
        <Projects />
        <Divider />
        <TheStudio />
        <Divider />
        <Services />
        <Divider />
        <Workflow />
        <Divider />
        <Pricing />
        <Faq />
        <Cta />
      </div>
    </div>
  );
}
