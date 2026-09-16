import { Geist, Geist_Mono, Vazirmatn } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const vazirmatn = Vazirmatn({subsets:['arabic'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{locale: string}>
}>) {
  const {locale} = await params
    if (!routing.locales.includes(locale as 'en' | 'fa')) {
    notFound()
  }
  const {message} = await getMessages()

  return (
    <html
      lang={locale}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", vazirmatn.variable)}
    >
      <body>
        <NextIntlClientProvider messages={message}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
