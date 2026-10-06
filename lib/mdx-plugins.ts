type MdNode = {
  type: string;
  tagName?: string;
  value?: string;
  meta?: string;
  properties?: Record<string, unknown>;
  children?: MdNode[];
};

function walk(node: MdNode, visit: (node: MdNode) => void): void {
  visit(node);
  if (node.children) {
    for (const child of node.children) walk(child, visit);
  }
}

/**
 * Fenced code blocks in this blog use the file path as the code-block meta
 * (e.g. ```` ```tsx components/review-card.tsx ````). rehype-pretty-code only
 * understands `title="..."`, so rewrite a bare meta string into a title before
 * it runs.
 */
export function remarkCodeMetaToTitle() {
  return (tree: MdNode) => {
    walk(tree, (node) => {
      if (node.type !== "code") return;
      const meta = node.meta?.trim();
      if (!meta || /\btitle=/.test(meta)) return;
      node.meta = `title="${meta.replace(/"/g, '\\"')}"`;
    });
  };
}

/**
 * rehype-pretty-code renders the `title` as a sibling `<figcaption>` of the
 * `<pre>`. Move its text onto the `pre` as `data-title` and drop the caption so
 * the code block component can render it in its own header (next to the copy
 * button).
 */
export function rehypeCodeTitleToData() {
  return (tree: MdNode) => {
    walk(tree, (node) => {
      if (
        node.tagName !== "figure" ||
        !node.properties ||
        !("data-rehype-pretty-code-figure" in node.properties) ||
        !node.children
      ) {
        return;
      }

      const titleIndex = node.children.findIndex(
        (child) =>
          child.tagName === "figcaption" &&
          child.properties?.["data-rehype-pretty-code-title"] !== undefined,
      );
      if (titleIndex < 0) return;

      const titleNode = node.children[titleIndex];
      const text = (titleNode.children ?? [])
        .map((child) => child.value ?? "")
        .join("");

      const pre = node.children.find((child) => child.tagName === "pre");
      if (pre?.properties) pre.properties["data-title"] = text;

      node.children.splice(titleIndex, 1);
    });
  };
}

export function remarkUnwrapImages() {
  return (tree: MdNode) => {
    walk(tree, (node) => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (
          child.type === "paragraph" &&
          child.children?.length === 1 &&
          child.children[0].type === "image"
        ) {
          node.children[i] = child.children[0];
        }
      }
    });
  };
}
