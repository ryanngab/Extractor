import { buttonVariants } from "@/components/ui/button";
import { getBlogsByTag } from "@/lib/markdown";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";

type PageProps = {
  params: Promise<{
    tag: string;
    locale: string;
  }>;
  searchParams?: {
    page?: string;
  };
};

const ITEMS_PER_PAGE = 6;

export default async function TagPage(props: PageProps) {
  const params = await props.params;
  const { tag, locale } = params;

  const currentPage = Number(props.searchParams?.page) || 1;

  // Ambil semua blogs dengan tag tertentu
  const allBlogs = await getBlogsByTag(tag);

  if (!allBlogs.length) {
    notFound();
  }

  // Hitung total blogs dan total halaman
  const totalBlogs = allBlogs.length;
  const totalPages = Math.ceil(totalBlogs / ITEMS_PER_PAGE);

  // Lakukan pagination secara manual
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const blogs = allBlogs.slice(startIndex, endIndex);

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <Link
        href={`/${locale}/resources/blog`}
        className={buttonVariants({
          variant: "link",
          className: "!mx-0 !px-0 mb-7 !-ml-1",
        })}
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Back to blog
      </Link>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          Posts tagged with &quot;{tag}&quot;
        </h1>
        <p className="text-muted-foreground">
          {totalBlogs} post{totalBlogs === 1 ? "" : "s"} tagged with {tag}
        </p>
      </div>

      <hr className="my-8" />

      {blogs.map((blog) => (
        <article
          key={blog.slug}
          className="flex flex-col gap-4 mb-8 border-b pb-8 last:border-0"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={blog.date}>{formatDate(blog.date)}</time>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">
                <Link
                  href={`/${locale}/resources/blog/${blog.slug}`}
                  className="hover:underline"
                >
                  {blog.title}
                </Link>
              </h2>
              <p className="text-muted-foreground">{blog.description}</p>
            </div>

            {blog.cover && (
              <Link
                href={`/${locale}/resources/blog/${blog.slug}`}
                className="relative aspect-video overflow-hidden rounded-lg"
              >
                <Image
                  src={blog.cover}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                />
              </Link>
            )}
          </div>

          <div className="flex gap-2">
            {blog.tags?.map((t) => (
              <Link
                key={t}
                href={`/${locale}/resources/blog/tags/${t.toLowerCase()}`}
                className={buttonVariants({
                  variant:
                    t.toLowerCase() === tag.toLowerCase()
                      ? "default"
                      : "secondary",
                  size: "sm",
                  className: "rounded-full text-xs",
                })}
              >
                #{t}
              </Link>
            ))}
          </div>
        </article>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link
                href={`/${locale}/resources/blog/tags/${tag}?page=${
                  currentPage - 1
                }`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Sebelumnya
              </Link>
            )}

            {Array.from({ length: totalPages }).map((_, index) => (
              <Link
                key={index}
                href={`/${locale}/resources/blog/tags/${tag}?page=${index + 1}`}
                className={buttonVariants({
                  variant: currentPage === index + 1 ? "default" : "outline",
                  size: "sm",
                })}
              >
                {index + 1}
              </Link>
            ))}

            {currentPage < totalPages && (
              <Link
                href={`/${locale}/resources/blog/tags/${tag}?page=${
                  currentPage + 1
                }`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Selanjutnya
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { tag, locale } = params;

  return {
    title: `Posts tagged with "${tag}"`,
    description: `Browse all posts tagged with ${tag}`,
  };
}
