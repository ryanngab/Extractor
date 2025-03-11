import { Footer, Navbar, ThemeProvider } from "@/components";
import { SITE_CONFIG, SUPPORTED_LOCALES, getLocalizedMetadata } from "@/config";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from "next";

const font = Inter({ subsets: ["latin"] });

// Generate metadata berdasarkan locale
export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  // Validasi locale yang didukung
  if (!SUPPORTED_LOCALES[locale as keyof typeof SUPPORTED_LOCALES]) {
    notFound();
  }
  return getLocalizedMetadata(locale as keyof typeof SUPPORTED_LOCALES);
}

// Generate static params untuk semua locale yang didukung
export function generateStaticParams() {
  return Object.keys(SUPPORTED_LOCALES).map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ 
  children, 
  params: { locale } 
}: Props) {
  // Validasi locale
  if (!SUPPORTED_LOCALES[locale as keyof typeof SUPPORTED_LOCALES]) {
    notFound();
  }

  unstable_setRequestLocale(locale);
  
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  const localeConfig = SUPPORTED_LOCALES[locale as keyof typeof SUPPORTED_LOCALES];

  return (
    <html 
      lang={locale} 
      suppressHydrationWarning
      dir={locale === 'ar' ? 'rtl' : 'ltr'} // Tambahan untuk mendukung bahasa RTL
    >
      <head>
        {/* Tambahan meta tags untuk SEO */}
        <meta name="language" content={localeConfig.unicode} />
        <meta property="og:locale" content={localeConfig.unicode} />
        {Object.entries(SUPPORTED_LOCALES).map(([key, value]) => (
          key !== locale && (
            <link 
              key={key}
              rel="alternate"
              hrefLang={key}
              href={`https://cvcoders.my.id/${key}`}
            />
          )
        ))}
        <link 
          rel="alternate" 
          hrefLang="x-default" 
          href="https://cvcoders.my.id/en" 
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased max-w-full overflow-x-hidden",
          font.className
        )}
      >
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages}
          timeZone="Asia/Jakarta"
          now={new Date()}
        >
          <ClerkProvider 
            appearance={{ baseTheme: dark }}
            localization={{locale}}
          >
            <ThemeProvider>
              <div className="relative flex min-h-screen flex-col">
                {/* <Navbar /> */}
                <main className="flex-1">{children}</main>
                {/* <Footer /> */}
              </div>
            </ThemeProvider>
          </ClerkProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
