import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import {
  Author,
  getAllBlogStaticPaths,
  getBlogForSlug,
  getPreviousNextBlog,
} from "@/lib/markdown";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Toc from "@/components/toc";
import Pagination from "@/components/pagination";
import Disqus from "@/components/disqus";
import { Button } from "@/components/ui/button";
import { Container, Wrapper } from "@/components";
import Link from "next/link";
import { SUPPORTED_LOCALES } from "@/config";
import { Metadata } from "next";

type PageProps = {
  params: {
    slug: string;
    locale: string;
  };
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug, locale } = props.params;
  const localeConfig =
    SUPPORTED_LOCALES[locale as keyof typeof SUPPORTED_LOCALES];

  const res = await getBlogForSlug(slug);
  if (!res) return {};
  const { frontmatter } = res;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/resources/blog/${slug}`;

  // Generate alternate URLs untuk setiap bahasa yang didukung
  const alternateLanguages: Record<string, string> = {};
  Object.keys(SUPPORTED_LOCALES).forEach((lang) => {
    alternateLanguages[
      lang
    ] = `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/resources/blog/${slug}`;
  });

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.tags ? frontmatter.tags : [],
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: canonicalUrl,
      siteName: "CVCoders",
      locale: localeConfig.unicode,
      alternateLocale: Object.values(SUPPORTED_LOCALES).map(
        (loc) => loc.unicode
      ),
      images: [
        {
          url: frontmatter.cover,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
      type: "article",
      authors: frontmatter.authors.map((author) => author.username),
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.date,
      tags: frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@cvcoders",
      site: "@cvcoders",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [
        {
          url: frontmatter.cover,
          alt: frontmatter.title,
        },
      ],
    },
    authors: frontmatter.authors.map((author) => ({
      name: author.username,
      url: author.handleUrl,
    })),
    publisher: "CVCoders",
    robots: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllBlogStaticPaths();
  const locales = Object.keys(SUPPORTED_LOCALES);

  if (!slugs) return [];

  return slugs.flatMap((slug) =>
    locales.map((locale) => ({
      slug,
      locale,
    }))
  );
}

export default async function BlogPage({ params }: PageProps) {
  const { slug, locale } = params;

  const res = await getBlogForSlug(slug);
  if (!res) notFound();

  const disqusConfig = {
    shortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || "",
    identifier: slug,
    title: res.frontmatter.title,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/resources/blog/${slug}`,
    language: locale, // Menambahkan dukungan bahasa untuk Disqus
  };

  return (
    <Wrapper>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10">
          <div>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "!mx-0 !px-0 mb-7 !-ml-1 ",
              })}
              href={`/${locale}/resources/blog`}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Back to blog
            </Link>
            {/* Language Switcher */}
            {/* <div className="flex gap-2 mb-4">
              {Object.entries(SUPPORTED_LOCALES).map(([code, config]) => (
                <Link
                  key={code}
                  href={`/${code}/resources/blog/${slug}`}
                  className={`text-sm ${code === locale ? 'font-bold' : ''}`}
                >
                  {config.flag} {config.name}
                </Link>
              ))}
            </div> */}
            <div className="flex flex-col gap-3 pb-7 w-full mb-2">
              <p className="text-muted-foreground text-sm">
                {formatDate(res.frontmatter.date)}
              </p>
              <h1 className="sm:text-3xl text-2xl font-extrabold">
                {res.frontmatter.title}
              </h1>
              <div className="mt-6 flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">Posted by</p>
                <Authors authors={res.frontmatter.authors} locale={locale} />
              </div>
            </div>
            <div className="w-full mb-7">
              <Image
                src={res.frontmatter.cover}
                alt="cover"
                width={700}
                height={400}
                className="w-full h-[400px] rounded-md border object-cover"
              />
            </div>
            <Typography>{res.content}</Typography>
            {res.frontmatter.tags && res.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {res.frontmatter.tags.map((tag) => (
                  <Button
                    key={tag}
                    variant="secondary"
                    size="sm"
                    className="rounded-full text-xs"
                    asChild
                  >
                    <Link
                      href={`/${locale}/resources/blog/tags/${tag.toLowerCase()}`}
                    >
                      #{tag}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
            <Pagination slug={slug} locale={locale} />
            <Disqus {...disqusConfig} />
          </div>
          <Toc path={slug} />
        </div>
      </Container>
    </Wrapper>
  );
}

function Authors({ authors, locale }: { authors: Author[]; locale: string }) {
  return (
    <div className="flex items-center gap-8 flex-wrap">
      {authors.map((author) => {
        return (
          <Link
            href={author.handleUrl}
            className="flex items-center gap-2"
            key={author.username}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>
                {author.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <p className="text-sm font-medium">{author.username}</p>
              <p className="font-code text-[13px] text-muted-foreground">
                @{author.handle}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
