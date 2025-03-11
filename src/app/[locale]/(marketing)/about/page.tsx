import { Container, Wrapper } from "@/components";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Youtube, Facebook, Instagram, BookOpen, Tag, Package } from "lucide-react";
import { getAllBlogs, getAllTags, getBlogsByTag } from "@/lib/markdown";
import { Metadata } from "next";
import { SUPPORTED_LOCALES } from "@/config";
import { getTranslations } from 'next-intl/server';

type Props = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const localeConfig = SUPPORTED_LOCALES[locale as keyof typeof SUPPORTED_LOCALES];
  const t = await getTranslations('about');

  return {
    title: await t('meta.title'),
    description: await t('meta.description'),
    openGraph: {
      title: await t('meta.title'),
      description: await t('meta.description'),
      type: "website",
      locale: localeConfig.unicode,
      alternateLocale: Object.values(SUPPORTED_LOCALES).map(loc => loc.unicode),
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/about`,
      languages: Object.keys(SUPPORTED_LOCALES).reduce((acc, lang) => ({
        ...acc,
        [lang]: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/about`
      }), {})
    }
  };
}

async function getStats() {
  const blogs = await getAllBlogs();
  const tags = await getAllTags();
  const productsBlogs = await getBlogsByTag('products');
  
  return {
    youtube: 1000,
    facebook: 500,
    instagram: 750,
    blogs: blogs?.length || 0,
    tags: tags?.length || 0,
    products: productsBlogs?.length || 0
  };
}

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
};

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="p-6 flex flex-col items-center text-center space-y-2">
      <div className="p-3 bg-primary/10 rounded-full">
        {icon}
      </div>
      <h3 className="font-semibold text-xl">{title}</h3>
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}

export default async function Page({ params: { locale } }: Props) {
  const stats = await getStats();
  const t = await getTranslations('about');

  return (
    <Wrapper>
      <Container>
        <div className="py-12 space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{await t('title')}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {await t('description')}
            </p>
          </div>

          {/* Image and Description */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square">
              <Image
                src="/assets/about-image.jpg"
                alt={await t('team_image_alt')}
                fill
                className="object-cover rounded-2xl"
                priority
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">{await t('story.title')}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{await t('story.paragraph1')}</p>
                <p>{await t('story.paragraph2')}</p>
                <p>{await t('story.paragraph3')}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title={await t('stats.youtube.title')}
              value={stats.youtube.toLocaleString(locale)}
              icon={<Youtube className="w-6 h-6 text-primary" />}
              description={await t('stats.youtube.description')}
            />
            <StatCard
              title={await t('stats.facebook.title')}
              value={stats.facebook.toLocaleString(locale)}
              icon={<Facebook className="w-6 h-6 text-primary" />}
              description={await t('stats.facebook.description')}
            />
            <StatCard
              title={await t('stats.instagram.title')}
              value={stats.instagram.toLocaleString(locale)}
              icon={<Instagram className="w-6 h-6 text-primary" />}
              description={await t('stats.instagram.description')}
            />
            <StatCard
              title={await t('stats.blogs.title')}
              value={stats.blogs}
              icon={<BookOpen className="w-6 h-6 text-primary" />}
              description={await t('stats.blogs.description')}
            />
            <StatCard
              title={await t('stats.tags.title')}
              value={stats.tags}
              icon={<Tag className="w-6 h-6 text-primary" />}
              description={await t('stats.tags.description')}
            />
            <StatCard
              title={await t('stats.products.title')}
              value={stats.products}
              icon={<Package className="w-6 h-6 text-primary" />}
              description={await t('stats.products.description')}
            />
          </div>

          {/* YouTube Subscribe Card */}
          <div className="bg-gradient-to-r from-red-500 to-red-700 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">{await t('youtube_card.title')}</h2>
                <p className="text-white/90">{await t('youtube_card.description')}</p>
              </div>
              <a
                href="https://www.youtube.com/@Cvcoders"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors"
              >
                {await t('youtube_card.cta')}
              </a>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="https://facebook.com/cvcoders"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Facebook className="w-6 h-6" />
              <span>{await t('social.facebook')}</span>
            </a>
            <a
              href="https://www.instagram.com/cv.coders/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <Instagram className="w-6 h-6" />
              <span>{await t('social.instagram')}</span>
            </a>
            <a
              href="https://youtube.com/@cvcoders"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <Youtube className="w-6 h-6" />
              <span>{await t('social.youtube')}</span>
            </a>
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}
