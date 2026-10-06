import { ImageResponse } from "next/og";

import { extractHeroImage, getPostBySlug } from "@/lib/posts";

export const alt = "Jonathan Freire — Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();
    return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);
  const title = post?.title ?? "Jonathan Freire";

  const hero = post ? extractHeroImage(post.content).hero : null;
  const heroData = hero ? await fetchImageAsDataUrl(hero) : null;

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
          position: "relative",
        }}
      >
        {heroData ? (
          <img
            src={heroData}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.35,
            }}
          />
        ) : null}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <span>Jonathan Freire</span>
          <span>Blog</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? 60 : 76,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            maxWidth: "960px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          jonathanfreire.com
        </div>
      </div>
    ),
    { ...size },
  );
}
