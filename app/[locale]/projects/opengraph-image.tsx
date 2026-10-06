import { renderDefaultOg } from "@/lib/og-default";

export const alt = "Jonathan Freire — Projects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return renderDefaultOg(locale);
}
