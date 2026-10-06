import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutIntro } from "@/components/home/about-intro";
import { Cta } from "@/components/home/cta";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/home/hero";
import { MoreAboutMe } from "@/components/home/more-about-me";
// Pricing section temporarily removed from the page. The component is kept at
// components/home/pricing.tsx. Re-enable this import and the <Pricing /> render below to restore it.
// import { Pricing } from "@/components/home/pricing";
import { Separator } from "@/components/ui/separator";
import { FAQ_COUNT, SERVICE_COUNT } from "@/lib/constants";
import { buildAlternates, buildOpenGraph, siteUrl } from "@/lib/seo";

const Projects = dynamic(() =>
  import("@/components/home/projects").then((mod) => mod.Projects),
);
const Services = dynamic(() =>
  import("@/components/home/services").then((mod) => mod.Services),
);
const Workflow = dynamic(() =>
  import("@/components/home/workflow").then((mod) => mod.Workflow),
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
    alternates: buildAlternates("/", locale),
    openGraph: buildOpenGraph({
      title: t("siteTitle"),
      description: t("siteDescription"),
      locale,
      path: "/",
    }),
  };
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home.faq.questions" });
  const tServices = await getTranslations({
    locale,
    namespace: "home.services",
  });
  const tMeta = await getTranslations({ locale, namespace: "metadata" });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.from({ length: FAQ_COUNT }).map((_, i) => ({
      "@type": "Question",
      name: t(`${i}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`${i}.answer`),
      },
    })),
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#service`,
    name: "Jonathan Freire",
    description: tMeta("siteDescription"),
    url: siteUrl,
    areaServed: "Worldwide",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
    provider: { "@id": `${siteUrl}/#person` },
    priceRange: "€€",
    knowsAbout: [
      "AI engineering",
      "Large language models",
      "Retrieval-augmented generation",
      "AI agents",
      "Tool calling",
      "Model Context Protocol",
      "TypeScript",
      "Python",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: tServices("title"),
      itemListElement: Array.from({ length: SERVICE_COUNT }).map((_, i) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: tServices(`items.${i}.title`),
          description: tServices(`items.${i}.text`),
        },
      })),
    },
  };

  return (
    <main className="flex flex-col w-full items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqSchema, professionalServiceSchema]),
        }}
      />
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
        {/* Pricing section temporarily removed. Re-enable the import and this line to restore it. */}
        {/* <Pricing /> */}
        <Faq />
        <Separator />
        <Cta />
      </div>
    </main>
  );
}
