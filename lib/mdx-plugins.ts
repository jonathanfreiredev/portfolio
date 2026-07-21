type MdastNode = {
  type: string;
  children?: MdastNode[];
};

export function remarkUnwrapImages() {
  return (tree: MdastNode) => {
    const walk = (node: MdastNode): void => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (
          child.type === "paragraph" &&
          child.children?.length === 1 &&
          child.children[0].type === "image"
        ) {
          node.children[i] = child.children[0];
        } else {
          walk(child);
        }
      }
    };
    walk(tree);
  };
}
