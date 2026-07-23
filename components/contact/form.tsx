"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const INPUT_CLASSES =
  "block w-full border-0 border-b border-border bg-transparent py-3 pr-3 text-body-m text-foreground placeholder:text-muted-foreground/70 focus:border-foreground focus:border-b-2 focus:pb-[11px] focus:outline-none focus-visible:outline-none";

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-tag text-foreground uppercase">
      {children}
    </label>
  );
}

export function Form() {
  const t = useTranslations("contact.form");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!data.get("Name") || !data.get("Email") || !data.get("Message")) {
      setError("Please fill in all fields.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Reveal
        y={30}
        className="flex h-full w-full flex-col gap-10 bg-neutral-100 dark:bg-neutral-900 p-6 md:p-8"
      >
        <h2 className="text-h3 text-foreground uppercase">{t("title")}</h2>
        <p className="text-lead text-foreground">{t("success")}</p>
      </Reveal>
    );
  }

  return (
    <Reveal
      y={30}
      className="flex h-full w-full flex-col gap-10 bg-neutral-100 dark:bg-neutral-900 p-6 md:p-8"
    >
      <h2 className="text-h3 text-foreground uppercase">{t("title")}</h2>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-6"
        noValidate
      >
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-2">
          <div className="flex w-full flex-col gap-3">
            <FieldLabel htmlFor="contact-name">{t("nameLabel")}</FieldLabel>
            <input
              id="contact-name"
              name="Name"
              type="text"
              required
              placeholder={t("namePlaceholder")}
              autoComplete="name"
              className={cn(INPUT_CLASSES)}
            />
          </div>

          <div className="flex w-full flex-col gap-3">
            <FieldLabel htmlFor="contact-email">{t("emailLabel")}</FieldLabel>
            <input
              id="contact-email"
              name="Email"
              type="email"
              required
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              className={cn(INPUT_CLASSES)}
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          <FieldLabel htmlFor="contact-message">{t("messageLabel")}</FieldLabel>
          <textarea
            id="contact-message"
            name="Message"
            required
            rows={5}
            placeholder={t("messagePlaceholder")}
            className={cn(INPUT_CLASSES, "resize-y")}
          />
        </div>

        {error ? (
          <p className="text-helper text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex w-full flex-col gap-3 pt-2">
          <Button type="submit" className="self-start px-6 py-3">
            <span className="inline-flex items-center gap-2">
              {t("submit")}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </span>
          </Button>
        </div>
      </form>
    </Reveal>
  );
}
