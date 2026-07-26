"use client";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

export default function CalEmbed() {
  const t = useTranslations("contact.meeting");
  const locale = useLocale();

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "20min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <>
      <h3 className="text-lead p-1">{t("title")}</h3>
      <Cal
        namespace="20min"
        calOrigin="https://cal.eu/"
        calLink="jonathan-freire/20min"
        lang={locale}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{
          layout: "month_view",
          useSlotsViewOnSmallScreen: "true",
          theme: "auto",
        }}
      />
    </>
  );
}
