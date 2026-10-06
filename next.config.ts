import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isProduction = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-tooltip",
    ],
  },
  compiler: {
    removeConsole: isProduction
      ? { exclude: ["error", "warn"] }
      : false,
  },
  async rewrites() {
    // The default locale has no URL prefix (localePrefix: "as-needed"), but the
    // middleware skips paths with a dot, so map the clean feed URLs explicitly.
    // "en" is routing.defaultLocale (see i18n/routing.ts).
    return [
      { source: "/blog/rss.xml", destination: "/en/blog/rss.xml" },
      { source: "/projects/rss.xml", destination: "/en/projects/rss.xml" },
    ];
  },
  async headers() {
    const securityHeaders = {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
      ],
    };
    if (isProduction) return [securityHeaders];
    return [
      securityHeaders,
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
