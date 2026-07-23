import { getTranslations, setRequestLocale } from "next-intl/server";

import { Content } from "@/components/contact/content";
import { Faq } from "@/components/faq";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/motion/reveal";
import { Stats } from "@/components/stats";
import { SectionHeader } from "@/components/home/section-header";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contact.header" });

  return (
    <main className="flex flex-col w-full items-center gap-20 pb-12 pt-20 max-w-380 md:gap-24 md:py-16 lg:gap-40 lg:pb-24 lg:py-32 px-5 md:px-6 lg:px-8">
      <div id="projects" className="flex w-full flex-col gap-12 md:gap-24">
        <SectionHeader title={t("title")} text={t("subtitle")} />

        <Content />
        <Reveal
          y={30}
          className="w-full flex justify-end bg-neutral-100 dark:bg-neutral-900 p-6 md:p-8"
        >
          <div className="">
            <Stats />
          </div>
        </Reveal>
        <Separator />
        <Faq withInfoCard={false} />
      </div>
    </main>
  );
}
