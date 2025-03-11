import { Container, Wrapper } from "@/components";
import Disqus from "@/components/disqus";
import Fullscreen from "@/components/fullscreen";
import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import {
  getPostForSlug,
  getAllPosts,
  getAllPreviousNextPost,
} from "@/lib/markdown";
import { ArrowLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string[];
    locale: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const fullPath = params.slug.join("/");
  const post = await getPostForSlug(fullPath);

  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug, locale } = params;
  const fullPath = params.slug.join("/");
  const post = await getPostForSlug(fullPath);

  if (!post) {
    notFound();
  }

  const { prev, next } = await getAllPreviousNextPost(fullPath);

  return (
    <Wrapper>
      <Container>
        <Fullscreen />
        <Typography>
          <div className="cursor-pointer">{post.content}</div>
        </Typography>
        <div className="flex justify-between mt-8">
          {prev && (
            <Link
              className={buttonVariants({
                variant: "outline",
              })}
              href={`/resources/blog/post/${prev.slug}`}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Previous
            </Link>
          )}

          {next && (
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "ml-auto",
              })}
              href={`/resources/blog/post/${next.slug}`}
            >
              Next <ArrowLeftIcon className="w-4 h-4 ml-1.5 rotate-180" />
            </Link>
          )}
        </div>

        <div className="mt-10">
          <Disqus
            shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || ""}
            identifier={slug.toString()}
            title={post.frontmatter.title}
            url={`${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/resources/blog/post/${fullPath}`}
          />
        </div>
      </Container>
    </Wrapper>
  );
}
