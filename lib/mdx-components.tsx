import type { ComponentProps, ReactNode } from "react";
import Image from "next/image";
import {
  type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";

import { headingIdFromText } from "@/lib/posts";

export const rehypePrettyCodeOptions: Partial<RehypePrettyCodeOptions> = {
  theme: {
    light: "github-light",
    dark: "github-dark",
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
  "data-meta"?: string;
};

function MdxPre(props: PreProps) {
  const { children, ...rest } = props;
  const language = props["data-language"];
  const meta = props["data-meta"];
  const label = meta?.trim() || language || "code";

  return (
    <div className="my-6 max-w-full overflow-hidden rounded-[2px] border border-primary/10 text-sm">
      <div className="flex items-center justify-between border-b border-primary/10 bg-card px-4 py-2">
        <span className="block max-w-full truncate text-eyebrow text-muted-foreground">
          {label}
        </span>
      </div>
      <pre {...rest}>{children}</pre>
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

  code: ({ children, className }: ComponentProps<"code">) => {
    const isBlock = typeof className === "string" && className.startsWith("language-");
    if (isBlock) return <code className={className}>{children}</code>;
    return (
      <code className="rounded-[2px] bg-primary/10 px-[0.3rem] py-[0.1rem] font-mono text-sm text-foreground">
        {children}
      </code>
    );
  },

  pre: MdxPre,
  img: MdxImage,
};
