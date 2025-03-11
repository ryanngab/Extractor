import { Metadata } from "next";

// Definisikan supported locales
export const SUPPORTED_LOCALES = {
  en: {
    name: "English",
    flag: "🇺🇸",
    unicode: "en_US",
    title: "CVCoders - Website & App Development Services",
    description: "CVCoders offers professional website development, app development, SEO, and digital marketing services worldwide."
  },
  id: {
    name: "Indonesia",
    flag: "🇮🇩",
    unicode: "id_ID",
    title: "CVCoders - Layanan Pengembangan Website & Aplikasi",
    description: "CVCoders menawarkan layanan pengembangan website profesional, pengembangan aplikasi, SEO, dan pemasaran digital di seluruh dunia."
  },
  ja: {
    name: "日本語",
    flag: "🇯🇵",
    unicode: "ja_JP",
    title: "CVCoders - ウェブサイト＆アプリ開発サービス",
    description: "CVCodersは、プロフェッショナルなウェブサイト開発、アプリ開発、SEO、デジタルマーケティングサービスを世界中に提供しています。"
  },
  hi: {
    name: "हिंदी",
    flag: "🇮🇳",
    unicode: "hi_IN",
    title: "CVCoders - वेबसाइट और ऐप विकास सेवाएं",
    description: "CVCoders विश्व स्तर पर पेशेवर वेबसाइट विकास, ऐप विकास, SEO और डिजिटल मार्केटिंग सेवाएं प्रदान करता है।"
  }
};

export const SITE_CONFIG: Metadata = {
    title: {
        default: "CVCoders - Global Website & App Development Services",
        template: `%s | CVCoders`
    },
    description: "CVCoders provides professional website & app development services globally, with expertise in multiple technologies and languages.",
    keywords: [
        "CVCoders",
        "global development services",
        "multilingual website",
        "international web development",
        "professional website",
        "technology blog",
        "developer",
        "programmer",
        "free templates",
        "digital products",
        "app development",
        "website optimization",
        "digital marketing",
        "software development",
        "web design",
        "full-stack developer",
        "e-commerce solutions",
        "SEO services",
        "Next.js",
        "React development",
        "Laravel services",
        "global tech solutions",
        "international programming",
        "worldwide web services"
    ],
    icons: {
        icon: [{ url: "/icons/favicon.ico" }],
        apple: [{ url: "/icons/apple-touch-icon.png" }],
    },
    openGraph: {
        title: "CVCoders - Global Website & App Development Services",
        description: "Professional website & app development services available in multiple languages worldwide",
        url: "https://cvcoders.my.id",
        siteName: "CVCoders",
        images: [
            {
                url: "/assets/og-image.png",
                width: 1200,
                height: 630,
                alt: "CVCoders Global Services"
            }
        ],
        locale: "en_US",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "CVCoders - Global Development Services",
        description: "Professional website & app development services available in multiple languages worldwide",
        images: [{ 
            url: "/assets/og-image.png",
            alt: "CVCoders Global Services"
        }],
        creator: "@cvcoders",
        site: "@cvcoders"
    },
    metadataBase: new URL("https://cvcoders.my.id"),
    alternates: {
        canonical: "https://cvcoders.my.id",
        languages: {
            "en-US": "https://cvcoders.my.id/en",
            "id-ID": "https://cvcoders.my.id/id",
            "ja-JP": "https://cvcoders.my.id/ja",
            "hi-IN": "https://cvcoders.my.id/hi"
        }
    },
    verification: {
        google: "RCbo8qWu11aKdFc7XWCDdD7-el_kFIYqBU7Y_nak8g0",
        yandex: "your-yandex-verification-code",
        // bing: "your-bing-verification-code"
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    authors: [
        { name: "CVCoders Team" },
        { url: "https://cvcoders.my.id" }
    ],
    creator: "CVCoders",
    publisher: "CVCoders",
    formatDetection: {
        email: true,
        address: true,
        telephone: true,
    },
    category: "technology"
};

// Helper function untuk metadata berdasarkan locale
export function getLocalizedMetadata(locale: keyof typeof SUPPORTED_LOCALES) {
    const localeConfig = SUPPORTED_LOCALES[locale];
    
    return {
        ...SITE_CONFIG,
        title: {
            default: localeConfig.title,
            template: `%s | CVCoders`
        },
        description: localeConfig.description,
        openGraph: {
            ...SITE_CONFIG.openGraph,
            locale: localeConfig.unicode,
            title: localeConfig.title,
            description: localeConfig.description,
        }
    };
}
