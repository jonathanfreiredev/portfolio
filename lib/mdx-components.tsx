import type { ComponentProps, ReactNode } from "react";
import Image from "next/image";
import {
  type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";

import { CodeCopyButton } from "@/components/code-copy-button";
import { headingIdFromText } from "@/lib/posts";
import { cn } from "@/lib/utils";

export const rehypePrettyCodeOptions: Partial<RehypePrettyCodeOptions> = {
  theme: {
    // High-contrast variants: the default github-light tokens (e.g. the
    // constant orange #E36209) only reach ~3.5:1 on white and fail WCAG AA.
    light: "github-light-high-contrast",
    dark: "github-dark-high-contrast",
  },
  keepBackground: false,
  defaultLang: "plaintext",
};

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "number") return String(node);
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function Heading({ level, children }: { level: 2 | 3 | 4 | 5 | 6; children?: ReactNode }) {
  const Tag = `h${level}` as const;
  const text = extractText(children);
  const id = headingIdFromText(text) || `section-${level}`;
  const styles: Record<number, string> = {
    2: "mt-8 mb-3 scroll-mt-24",
    3: "mt-7 mb-2 scroll-mt-24",
    4: "mt-6 mb-2 scroll-mt-24",
    5: "mt-5 mb-1 scroll-mt-24",
    6: "mt-5 mb-1 scroll-mt-24",
  };
  return (
    <Tag id={id} className={styles[level]}>
      {children}
    </Tag>
  );
}

type LinkProps = ComponentProps<"a"> & { href?: string };

function MdxLink({ href = "", children, ...rest }: LinkProps) {
  const isInternal = href.startsWith("/");
  return (
    <a
      href={href}
      rel={isInternal ? undefined : "noreferrer noopener"}
      target={isInternal ? undefined : "_blank"}
      className="text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
      {...rest}
    >
      {children}
    </a>
  );
}

type PreProps = ComponentProps<"pre"> & {
  "data-language"?: string;
  "data-title"?: string;
};

function MdxPre({
  children,
  className,
  "data-language": language,
  "data-title": dataTitle,
  ...rest
}: PreProps) {
  const label = dataTitle?.trim() || language || "code";

  return (
    <div
      data-code-block=""
      className="my-6 min-w-0 max-w-full overflow-hidden rounded-[2px] border border-primary/10 text-sm"
    >
      <div className="flex items-center justify-between gap-4 border-b border-primary/10 bg-card px-4 py-2">
        <span className="block min-w-0 truncate text-eyebrow text-muted-foreground">
          {label}
        </span>
        <CodeCopyButton />
      </div>
      <pre {...rest} className={cn("max-w-full", className)}>
        {children}
      </pre>
    </div>
  );
}

type MdxImageProps = ComponentProps<"img"> & { src?: string; alt?: string };

function MdxImage({ src, alt }: MdxImageProps) {
  if (!src) return null;
  return (
    <figure className="my-8 space-y-3">
      <div className="relative aspect-video overflow-hidden border border-primary/10">
        <Image
          src={src}
          alt={alt || ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {alt ? (
        <figcaption className="text-caption text-muted-foreground">{alt}</figcaption>
      ) : null}
    </figure>
  );
}

function MdxTable({ children }: ComponentProps<"table">) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-[2px] border border-primary/10">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

function MdxTableRow({ children }: ComponentProps<"tr">) {
  return <tr className="border-b border-primary/10 last:border-b-0">{children}</tr>;
}

function MdxTableCell({
  children,
  ...rest
}: ComponentProps<"td"> & { scope?: string }) {
  return (
    <td {...rest} className="px-4 py-3 align-top leading-relaxed text-foreground">
      {children}
    </td>
  );
}

function MdxTableHeader({ children }: ComponentProps<"th">) {
  return (
    <th className="bg-card px-4 py-3 text-left align-top font-medium">
      <span className="text-eyebrow text-muted-foreground">{children}</span>
    </th>
  );
}

export const mdxComponents = {
  h2: (props: ComponentProps<"h2">) => <Heading level={2} {...props} />,
  h3: (props: ComponentProps<"h3">) => <Heading level={3} {...props} />,
  h4: (props: ComponentProps<"h4">) => <Heading level={4} {...props} />,
  h5: (props: ComponentProps<"h5">) => <Heading level={5} {...props} />,
  h6: (props: ComponentProps<"h6">) => <Heading level={6} {...props} />,

  p: ({ children }: ComponentProps<"p">) => (
    <p className="mb-4 leading-[1.5] text-foreground last:mb-0">{children}</p>
  ),

  a: (props: LinkProps) => <MdxLink {...props} />,

  ul: ({ children }: ComponentProps<"ul">) => (
    <ul className="mb-5 ml-6 list-disc space-y-3 text-foreground marker:text-muted-foreground">
      {children}
    </ul>
  ),

  ol: ({ children }: ComponentProps<"ol">) => (
    <ol className="mb-5 ml-6 list-decimal space-y-3 text-foreground marker:text-muted-foreground">
      {children}
    </ol>
  ),

  li: ({ children }: ComponentProps<"li">) => (
    <li className="marker:text-muted-foreground">{children}</li>
  ),

  blockquote: ({ children }: ComponentProps<"blockquote">) => (
    <blockquote className="my-6 border-l-2 border-foreground pl-6 text-quote text-foreground">
      {children}
    </blockquote>
  ),

  code: ({ children, className, ...rest }: ComponentProps<"code">) => {
    const isBlock =
      (typeof className === "string" && className.startsWith("language-")) ||
      (rest as Record<string, unknown>)["data-language"] !== undefined;
    if (isBlock) {
      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    }
    return (
      <code className="rounded-[2px] bg-primary/10 px-[0.3rem] py-[0.1rem] font-mono text-sm text-foreground">
        {children}
      </code>
    );
  },

  pre: MdxPre,
  img: MdxImage,

  table: (props: ComponentProps<"table">) => <MdxTable {...props} />,
  thead: ({ children }: ComponentProps<"thead">) => (
    <thead className="border-b border-primary/10">{children}</thead>
  ),
  tbody: ({ children }: ComponentProps<"tbody">) => <tbody>{children}</tbody>,
  tr: (props: ComponentProps<"tr">) => <MdxTableRow {...props} />,
  th: (props: ComponentProps<"th">) => <MdxTableHeader {...props} />,
  td: (props: ComponentProps<"td">) => <MdxTableCell {...props} />,
};
