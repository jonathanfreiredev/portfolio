import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

import type { ProjectMeta } from "@/lib/projects";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Branded Open Graph card for a single project. Falls back to plain labels so
 * a missing translation never breaks the build.
 */
export async function renderProjectOg(
  project: { title: string; tagline: string },
  meta: ProjectMeta,
  locale: string,
) {
  let statusLabel: string = meta.status;
  try {
    const t = await getTranslations({ locale, namespace: "projects.status" });
    statusLabel = t(meta.status);
  } catch {
    // fall back to the raw status key
  }

  const stack = meta.stack.slice(0, 4).join("  ·  ");

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
            fontSize: 24,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          <span>Jonathan Freire</span>
          <span>{statusLabel}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.25,
              color: "rgba(255,255,255,0.82)",
              maxWidth: 900,
            }}
          >
            {project.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {stack}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
