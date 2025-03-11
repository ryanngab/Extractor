import { getPreviousNextBlog } from "@/lib/markdown";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

type PaginationProps = {
  slug: string;
  locale: string;
};

export default async function Pagination({ slug, locale }: PaginationProps) {
  const res = await getPreviousNextBlog(slug);

  return (
    <div className="grid grid-cols-2 flex-grow sm:py-10 py-7 gap-3 mb-4">
      <div>
        {res.prev && (
          <Link
            className={buttonVariants({
              variant: "outline",
              className:
                "no-underline w-full flex flex-col pl-3 !py-8 !items-start",
            })}
            href={`/${locale}/resources/blog/${res.prev.slug}`}
          >
            <span className="flex items-center text-muted-foreground text-xs">
              <ChevronLeftIcon className="w-[1rem] h-[1rem] mr-1" />
              Previous
            </span>
            <span className="mt-1 ml-1">{res.prev.title}</span>
          </Link>
        )}
      </div>
      <div>
        {res.next && (
          <Link
            className={buttonVariants({
              variant: "outline",
              className:
                "no-underline w-full flex flex-col pr-3 !py-8 !items-end",
            })}
            href={`/${locale}/resources/blog/${res.next.slug}`}
          >
            <span className="flex items-center text-muted-foreground text-xs">
              Next
              <ChevronRightIcon className="w-[1rem] h-[1rem] ml-1" />
            </span>
            <span className="mt-1 mr-1">{res.next.title}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
