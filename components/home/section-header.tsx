type SectionHeaderProps = {
  variant?: "default" | "small";
  as?: "h1" | "h2";
  title: string;
  text: string;
  badge?: string;
};

export function SectionHeader({
  variant = "default",
  as: Heading = "h2",
  title,
  text,
  badge,
}: SectionHeaderProps) {
  if (variant === "small") {
    return (
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-6">
        <div className="flex w-full flex-col gap-6 md:w-1/2">
          {badge ? (
            <span className="text-tag-bold text-foreground uppercase">
              {badge}
            </span>
          ) : null}
          <Heading className="text-h2 text-foreground uppercase break-words max-w-full">
            {title}
          </Heading>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-6">
      <div className="flex w-full min-w-0 flex-col items-start gap-2 md:w-3/4 md:flex-row md:items-center md:gap-2">
        <Heading className="text-display-l text-foreground break-words max-w-full">
          {title}
        </Heading>
        {badge ? (
          <span className="text-tag text-foreground uppercase">{badge}</span>
        ) : null}
      </div>
      <p className="w-full max-w-[300px] text-body-m text-foreground md:max-w-[230px] md:w-1/4 md:self-end">
        {text}
      </p>
    </div>
  );
}
