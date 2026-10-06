import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";

type ProjectHighlightsProps = {
  highlights: string[];
  locale: string;
};

export async function ProjectHighlights({
  highlights,
  locale,
}: ProjectHighlightsProps) {
  if (!highlights.length) return null;
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <Reveal as="section" className="w-full">
      <h2 className="text-eyebrow uppercase text-muted-foreground">
        {t("highlights")}
      </h2>
      <ul className="mt-6 grid gap-px border border-primary/10 bg-primary/10 md:grid-cols-2">
        {highlights.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 bg-background p-5 md:p-6"
          >
            <span
              className="mt-2 size-1 shrink-0 rounded-full bg-foreground"
              aria-hidden="true"
            />
            <span className="text-body-l text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
