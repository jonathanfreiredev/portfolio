type SectionHeaderProps = {
  variant?: "default" | "small";
  title: string;
  text: string;
  badge?: string;
};

export function SectionHeader({ variant = "default", title, text, badge }: SectionHeaderProps) {
  if (variant === "small") {
    return (
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-6">
        <div className="flex w-full flex-col gap-6 md:w-1/2">
          {badge ? (
            <span className="text-tag-bold text-foreground uppercase">{badge}</span>
          ) : null}
          <h2 className="text-h2 text-foreground uppercase">{title}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-6">
      <div className="flex w-full flex-col items-start gap-2 md:w-3/4 md:flex-row md:items-center md:gap-2">
        <h2 className="text-display-l text-foreground">{title}</h2>
        {badge ? <span className="text-tag text-foreground uppercase">{badge}</span> : null}
      </div>
      <p className="w-full max-w-[230px] text-body-m text-foreground md:w-1/4 md:self-end">
        {text}
      </p>
    </div>
  );
}
