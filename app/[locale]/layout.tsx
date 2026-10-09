import { Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const vazirmatn = Vazirmatn({ subsets: ["arabic"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "fa") {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", vazirmatn.variable)}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <DirectionProvider direction={locale === "fa" ? "rtl" : "ltr"}>
              {children}
            </DirectionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
