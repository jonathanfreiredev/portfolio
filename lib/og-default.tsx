import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = "Jonathan Freire — AI Engineer";

/**
 * Branded default Open Graph card, localized per locale. Shared by the
 * `[locale]` segment and the blog/contact/legal segments so every page has a
 * deterministic `og:image`.
 */
export async function renderDefaultOg(locale: string) {
  const t = await getTranslations({ locale, namespace: "home.hero" });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#0A0A0A",
          color: "#FFFFFF",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <span>Jonathan Freire</span>
          <span>jonathanfreire.com</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {t("title")}
          </div>
          <div style={{ fontSize: 40, color: "rgba(255,255,255,0.8)" }}>
            {t("tagline")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {t("subTagline")}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
