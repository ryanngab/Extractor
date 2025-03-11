
import { getAllBlogs, getBlogForSlug } from "@/lib/markdown";
import Image from "next/image";
import { notFound } from "next/navigation";
export const size = {
  width: 1200,
  height: 630,
};
export const alt = "Expolorer | Blog";
import { ImageResponse } from "next/og"; // ✅ Impor ImageResponse dengan benar
export const contentType = "image/png";


export default async function og({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const res = await getBlogForSlug(slug);

  if (!res) notFound();

  return new ImageResponse(
    (
      <div tw="relative flex w-full h-full flex items-center justify-center">
        {/* Background */}
        <div tw="absolute flex inset-0">
          <Image
            tw="flex flex-1"
            src={res.frontmatter.cover}
            alt="cover"
            // src={products?.image + "&w=1200&h=630&auto=format&q=75"}
            width={50}
            height={50}
          />
          {/* Overlay */}
          <div tw="absolute flex inset-0 bg-black bg-opacity-50" />
        </div>
        <div tw="flex flex-col text-neutral-50">
          {/* Title */}
          <div tw="text-7xl font-bold">
          {res.frontmatter.title}
          </div>
          {/* Tags */}
          <div tw="flex mt-6 flex-wrap items-center text-4xl text-neutral-200">
            <div tw="w-4 h-4 mx-6 rounded-full bg-neutral-300 " />
            <div tw="w-4 h-4 mx-6 rounded-full bg-neutral-300" />
          </div>
        </div>
      </div>
    ),
    size
  );
}
