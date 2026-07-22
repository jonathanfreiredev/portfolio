import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutIntro } from "@/components/home/about-intro";
import { Cta } from "@/components/home/cta";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/home/hero";
import { Pricing } from "@/components/home/pricing";
import { Projects } from "@/components/home/projects";
import { Services } from "@/components/home/services";
import { MoreAboutMe } from "@/components/home/more-about-me";
import { Workflow } from "@/components/home/workflow";
import { Separator } from "@/components/ui/separator";

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
