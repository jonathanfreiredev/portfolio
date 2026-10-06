"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeCopyButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const container = buttonRef.current?.closest("[data-code-block]");
    const code = container?.querySelector("code");
    const text = code?.textContent ?? "";

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context); ignore.
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy code"}
      className="flex shrink-0 items-center gap-1.5 text-eyebrow uppercase text-muted-foreground transition-colors hover:text-foreground"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-3.5" />
      ) : (
        <Copy aria-hidden="true" className="size-3.5" />
      )}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
