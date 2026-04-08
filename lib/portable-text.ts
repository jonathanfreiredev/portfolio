type PortableTextChild = {
  text?: string;
};

type PortableTextBlockLike = {
  _type?: string;
  style?: string;
  children?: PortableTextChild[];
};

export function getBlockText(block: PortableTextBlockLike): string {
  return (block.children || [])
    .map((child) => child.text || "")
    .join("")
    .trim();
}

export function headingIdFromText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
