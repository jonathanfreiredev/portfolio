import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import "./[locale]/globals.css";

export default async function GlobalNotFound() {
  const t = await getTranslations("notFound");
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col px-5 md:px-6 lg:px-8">
        <main className="flex w-full flex-1 flex-col items-center justify-center py-32 md:py-40">
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
      </body>
    </html>
  );
}
