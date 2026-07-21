import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./[locale]/globals.css";

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

export const metadata: Metadata = {
  title: "Jonathan Freire | Digital Product Architect",
  description: "Your product, built right from the start.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = routing.locales.includes(cookieLocale as (typeof routing.locales)[number])
    ? cookieLocale
    : routing.defaultLocale;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col px-5 md:px-6 lg:px-8">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
