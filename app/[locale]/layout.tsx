import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import {
  buildOpenGraph,
  buildTwitter,
  isProduction,
  siteUrl,
} from "@/lib/seo";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Geist_Mono, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "metadata" });

  const verification = {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  };

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("siteTitle"),
      template: "%s | Jonathan Freire",
    },
    description: t("siteDescription"),
    applicationName: "Jonathan Freire",
    openGraph: buildOpenGraph({
      title: t("siteTitle"),
      description: t("siteDescription"),
      locale,
      path: "/",
    }),
    twitter: buildTwitter({
      title: t("siteTitle"),
      description: t("siteDescription"),
    }),
    robots: isProduction
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
    ...(Object.keys(verification).length ? { verification } : {}),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  const knowsAbout = [
    "AI engineering",
    "Large language models",
    "Retrieval-augmented generation",
    "AI agents",
    "Tool calling",
    "Model Context Protocol",
    "TypeScript",
    "Python",
  ];

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Jonathan Freire",
    url: siteUrl,
    jobTitle: "AI Engineer",
    description: "AI engineer and software engineer based in Berlin. I build production LLM applications: RAG, agents and MCP integrations, in TypeScript and Python.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
    sameAs: [
      "https://github.com/jonathanfreiredev",
      "https://www.linkedin.com/in/jonathan-freire/",
    ],
    knowsAbout,
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Jonathan Freire",
    alternateName: "jonathanfreire.com",
    url: siteUrl,
    description: "Intelligent systems, built to ship.",
    inLanguage: locale,
    publisher: { "@id": `${siteUrl}/#person` },
  };

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col items-center"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personSchema, webSiteSchema]),
          }}
        />
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        {/* <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/1da8e5662d2a0f5a30f0570d/script.js"
          strategy="lazyOnload"
        /> */}
        <Script
          id="reveal-observer"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(){var els=document.querySelectorAll('[data-reveal]');if(!els.length||!('IntersectionObserver' in window))return;var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){var d=parseFloat(e.target.getAttribute('data-delay')||'0');e.target.style.animationDelay=d+'s';e.target.classList.add('is-in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -10% 0px',threshold:0});els.forEach(function(el){io.observe(el);});})();`,
          }}
        />
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
