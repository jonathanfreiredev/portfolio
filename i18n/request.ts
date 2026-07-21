import deepmerge from "deepmerge";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "./routing";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const activeMessages = (await import(`../locales/${locale}.json`)).default;
  const fallbackMessages =
    locale === routing.defaultLocale
      ? {}
      : (await import(`../locales/${routing.defaultLocale}.json`)).default;

  return {
    locale,
    messages: deepmerge(fallbackMessages, activeMessages, {
      isMergeableObject: isPlainObject,
    }),
    onError() {
      // Missing keys are expected before Crowdin syncs translations.
    },
  };
});
