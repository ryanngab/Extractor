"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function TagsList({ tags }: { tags: string[] }) {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 20;

  // Menghitung total halaman
  const totalPages = Math.ceil(tags.length / tagsPerPage);

  // Mendapatkan tag untuk halaman saat ini
  const indexOfLastTag = currentPage * tagsPerPage;
  const indexOfFirstTag = indexOfLastTag - tagsPerPage;
  const currentTags = tags.slice(indexOfFirstTag, indexOfLastTag);

  // Fungsi untuk mengganti halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="pt-16 pb-8 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-32">
      <h1 className="text-3xl font-bold mb-6">{t("tags.title")}</h1>
      <div className="flex flex-wrap gap-3">
        {currentTags.map((tag) => (
          <Link
            key={tag}
            href={`/resources/blog/tags/${tag}`}
            className="px-4 py-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-label="Halaman sebelumnya"
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-label="Halaman berikutnya"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
