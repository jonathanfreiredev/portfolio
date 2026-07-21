import { getTranslations, setRequestLocale } from "next-intl/server";

import { Header } from "@/components/contact/header";
import { Content } from "@/components/contact/content";
import { Stats } from "@/components/contact/stats";
import { Faq } from "@/components/contact/faq";
import { Divider } from "@/components/home/divider";

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

  return (
    <>
      <Header />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-5 py-12 md:px-12 md:gap-24 md:py-16 lg:gap-40 lg:px-20 lg:py-24">
        <Content />
        <Stats />
        <Divider />
        <Faq />
      </div>
    </>
  );
}
