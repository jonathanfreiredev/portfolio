import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-5 py-32 md:px-12 md:py-40 lg:px-20">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-10 text-center">
        <h1 className="text-h1 text-foreground uppercase">{t("title")}</h1>
        <p className="text-body-m text-foreground">{t("description")}</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Button asChild>
            <Link href="/">{t("goHome")}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/contact">{t("contact")}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
