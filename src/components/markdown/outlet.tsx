"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OutletProps {
  path: string;
}

interface ChapterInfo {
  slug: string;
  title: string;
  number: number;
}

export default function Outlet({ path: dirPath }: OutletProps) {
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah chapter per halaman

  // Hitung total halaman dan chapter yang ditampilkan
  const totalPages = Math.ceil(chapters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChapters = chapters.slice(startIndex, endIndex);

  useEffect(() => {
    async function loadChapters() {
      try {
        const cleanPath = dirPath.replace(/^\/+|\/+$/g, "");
        console.log("🔍 Fetching from:", `/api/chapters?path=${cleanPath}`);

        const response = await fetch(`/api/chapters?path=${cleanPath}`);
        if (!response.ok) throw new Error("Gagal mengambil data chapter");

        const data = await response.json();
        setChapters(data);
      } catch (err) {
        setError("Gagal memuat daftar chapter");
      } finally {
        setLoading(false);
      }
    }

    loadChapters();
  }, [dirPath]);

  if (loading) return <div>Memuat daftar chapter...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (chapters.length === 0) return <div>Tidak ada chapter ditemukan</div>;

  return (
    <div className="outlet-container space-y-4">
      <h2 className="text-2xl font-bold mb-4">Daftar Chapter</h2>
      {currentChapters.map((chapter) => (
        <Card key={chapter.slug}>
          <Link
            href={`${dirPath}/${chapter.slug}`}
            passHref
            className="border rounded-md p-4 no-underline flex flex-col gap-0.5"
          >
            <div className="flex justify-between">
              <h4 className="!my-0">{chapter.title}</h4>
              <span className="text-muted-foreground">
                Chapter {chapter.number}
              </span>
            </div>
            {/* <p className="text-sm text-muted-foreground !my-0">
              {chapter.description}
            </p> */}
          </Link>
        </Card>
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Sebelumnya
        </Button>
        <div className="text-sm">
          Halaman {currentPage} dari {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}
