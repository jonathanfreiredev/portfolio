"use client";

import { CldImage } from "next-cloudinary";
import type { ComponentProps } from "react";

/**
 * next-cloudinary's CldImage uses React hooks but the package has no
 * "use client" directive, so it can only be rendered from a client boundary.
 * This thin wrapper gives server components a way to render it.
 */
export function CloudinaryImage(props: ComponentProps<typeof CldImage>) {
  return <CldImage {...props} />;
}
