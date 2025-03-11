import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dirPath = searchParams.get("path");

  if (!dirPath) {
    return NextResponse.json(
      { error: "Parameter path tidak ditemukan" },
      { status: 400 }
    );
  }

  // Normalisasi path
  const cleanPath = decodeURIComponent(dirPath).replace(/^\/+|\/+$/g, "");

  // Keamanan tambahan
  if (cleanPath.includes("..")) {
    return NextResponse.json({ error: "Path tidak valid" }, { status: 400 });
  }

  try {
    // 🔥 Tambahkan log ini untuk debugging
    const realPath = path.join(process.cwd(), "src/contents", cleanPath);
    console.log("Mencari folder di:", realPath);

    // Periksa apakah direktori ada sebelum membaca
    const dirExists = await fs.stat(realPath).catch(() => null);
    if (!dirExists) {
      console.error("⚠️ Folder tidak ditemukan:", realPath);
      return NextResponse.json(
        { error: "Folder tidak ditemukan" },
        { status: 404 }
      );
    }

    // Membaca direktori
    const files = await fs.readdir(realPath);
    console.log("📂 File ditemukan:", files);

    // Filter hanya file .mdx
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    if (mdxFiles.length === 0) {
      console.warn("⚠️ Tidak ada file MDX di dalam folder:", realPath);
      return NextResponse.json([], { status: 200 });
    }

    // Proses file
    const chapters = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(realPath, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data } = matter(fileContent);

        // const chapterMatch = file.match(/chapter(\d+)\.mdx$/i);
        // const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : 0;

        const chapterMatch = file.match(/(\d+)/); // Cari angka pertama dalam nama file
        const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : 0;

        return {
          slug: file.replace(".mdx", ""),
          title: data.title || `Chapter ${chapterNumber}`,
          number: chapterNumber,
        };
      })
    );

    chapters.sort((a, b) => a.number - b.number);
    return NextResponse.json(chapters);
  } catch (error) {
    console.error("❌ Error membaca direktori chapter:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar chapter" },
      { status: 500 }
    );
  }
}
