import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  className?: string;
  label?: string;
  children?: ReactNode;
};

export function ImagePlaceholder({ className, label, children }: ImagePlaceholderProps) {
  return (
    <div
      // TODO: reemplazar imagen
      role="img"
      aria-label={label ?? "Image placeholder"}
      className={cn(
        "flex items-center justify-center border border-border bg-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}
