import type { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { getBlockText, headingIdFromText } from "@/lib/portable-text";
import { urlFor } from "@/sanity/lib/image";
import { JSX } from "react";

const Heading = ({ level, children, value }: any) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const text = getBlockText(value);
  const id = headingIdFromText(text || `section-${level}`);

  // Reducimos los mb (margin-bottom) y ajustamos mt (margin-top)
  const styles = {
    2: "text-3xl font-bold tracking-tight text-foreground mt-8 mb-3 scroll-mt-24",
    3: "text-2xl font-semibold tracking-tight text-foreground mt-7 mb-2 scroll-mt-24",
    4: "text-xl font-semibold text-foreground mt-6 mb-2 scroll-mt-24",
    5: "text-lg font-medium text-foreground mt-5 mb-1 scroll-mt-24",
    6: "text-base font-medium text-foreground mt-5 mb-1 scroll-mt-24",
  };

  return (
    <Tag id={id} className={styles[level as keyof typeof styles]}>
      {children}
    </Tag>
  );
};

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: (props) => <Heading level={2} {...props} />,
    h3: (props) => <Heading level={3} {...props} />,
    h4: (props) => <Heading level={4} {...props} />,
    h5: (props) => <Heading level={5} {...props} />,
    h6: (props) => <Heading level={6} {...props} />,

    normal: ({ children }) => {
      const childrenArray = Array.isArray(children) ? children : [children];

      const isEmpty = childrenArray.every(
        (child) => !child || (typeof child === "string" && child.trim() === ""),
      );

      if (isEmpty) {
        return <div className="h-4" aria-hidden="true" />;
      }

      return (
        <p className="mb-4 leading-7 text-zinc-800 dark:text-zinc-200 last:mb-0">
          {children}
        </p>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary/40 bg-primary/5 py-3 pl-6 pr-4 italic text-foreground rounded-r-lg">
        {children}
      </blockquote>
    ),
  },

  list: {
    // Reducimos mb-8 a mb-5 y space-y-3 a space-y-2
    bullet: ({ children }) => (
      <ul className="mb-5 ml-6 list-disc space-y-2 text-zinc-700 dark:text-zinc-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-6 list-decimal space-y-2 text-zinc-700 dark:text-zinc-300">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="pl-1 marker:text-primary">{children}</li>
    ),
    number: ({ children }) => (
      <li className="pl-1 marker:font-bold marker:text-primary">{children}</li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      const target = !value.href.startsWith("/") ? "_blank" : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          target={target}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="relative rounded bg-primary/10 px-[0.3rem] py-[0.1rem] font-mono text-sm font-medium text-foreground">
        {children}
      </code>
    ),
  },

  types: {
    image: ({ value }) => (
      <figure className="my-8 space-y-3">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-primary/10 shadow-xl">
          <Image
            src={urlFor(value).width(1400).height(900).url()}
            alt={value.alt || "Article visual content"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
        {value.caption && (
          <figcaption className="text-center text-sm text-zinc-500 dark:text-zinc-400 italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
};
