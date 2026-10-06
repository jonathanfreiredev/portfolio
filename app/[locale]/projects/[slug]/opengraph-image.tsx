import { renderProjectOg } from "@/lib/og-project";
import { getProjectBySlug, getProjectMeta } from "@/lib/projects";

export const alt = "Jonathan Freire — Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug, locale);
  const meta = getProjectMeta(slug);

  if (!project || !meta) {
    const { renderDefaultOg } = await import("@/lib/og-default");
    return renderDefaultOg(locale);
  }

  return renderProjectOg(project, meta, locale);
}
