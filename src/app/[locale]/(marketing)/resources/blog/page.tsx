import AnimationContainer from "@/components/global/animation-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import MagicCard from "@/components/ui/magic-card";
import { Author, BlogMdxFrontmatter, getAllBlogs } from "@/lib/markdown";
import { formatDate2, stringToDate } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import TagsFilter from "@/components/blog/tags-filter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "AriaDocs - Blog",
};

export default async function BlogIndexPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { 
    query?: string; 
    tags?: string; 
    page?: string;
    perPage?: string;
    sort?: string;
  };
}) {
  const query = searchParams.query || '';
  const tagsParam = searchParams.tags || '';
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = Number(searchParams.perPage) || 9;
  const sort = searchParams.sort || 'newest';

  const selectedTags = tagsParam ? tagsParam.split(',') : [];

  const allBlogs = await getAllBlogs();
  
  let sortedBlogs = [...allBlogs];
  if (sort === 'newest') {
    sortedBlogs = sortedBlogs.sort(
      (a, b) => stringToDate(b.date).getTime() - stringToDate(a.date).getTime()
    );
  } else if (sort === 'oldest') {
    sortedBlogs = sortedBlogs.sort(
      (a, b) => stringToDate(a.date).getTime() - stringToDate(b.date).getTime()
    );
  }
  
  const filteredBlogs = sortedBlogs.filter(blog => {
    const matchesSearch = query 
      ? blog.title.toLowerCase().includes(query.toLowerCase()) || 
        blog.description.toLowerCase().includes(query.toLowerCase())
      : true;
    
    const matchesTags = selectedTags.length > 0
      ? selectedTags.every(tag => blog.tags && blog.tags.includes(tag))
      : true;

    return matchesSearch && matchesTags;
  });
  
  const allTags = Array.from(
    new Set(
      allBlogs
        .flatMap(blog => blog.tags || [])
        .filter(Boolean)
    )
  );
  
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center pb-20">
        <AnimationContainer delay={0.1} className="w-full">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
            Blog
          </h1>
          <p className="text-base md:text-lg mt-6 text-center text-muted-foreground">
            All the latest blogs and news, straight from the team.
          </p>
        </AnimationContainer>

        <AnimationContainer delay={0.15} className="w-full mt-8 max-w-3xl mx-auto px-4">
          {/* Tags Filter dengan Live Search */}
          <TagsFilter allTags={allTags} currentTag={tagsParam} />
        </AnimationContainer>

        <AnimationContainer delay={0.2} className="w-full pt-12">
          <div className="flex flex-col items-center justify-center max-w-6xl mx-auto px-4 md:px-0">
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Tidak ada artikel yang ditemukan.</p>
                <Link 
                  href={`/${locale}/resources/blog`}
                  className="mt-4 inline-block text-primary hover:underline"
                >
                  Lihat semua artikel
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedBlogs.map((blog) => (
                    <BlogCard {...blog} slug={blog.slug} key={blog.slug} locale={locale} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12 gap-2">
                    <PaginationControls 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      query={query}
                      tags={tagsParam}
                      sort={sort}
                      locale={locale}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </AnimationContainer>
      </div>
    </>
  );
}

function BlogCard({
  date,
  title,
  description,
  slug,
  cover,
  authors,
  locale,
}: BlogMdxFrontmatter & { slug: string; locale: string }) {
  return (
    <>
      <MagicCard className="p-0 md:p-0 relative">
        <Link
          href={`/${locale}/resources/blog/${slug}`}
          className="w-full h-full absolute -z-1 inset-0"
        ></Link>
        <Card className="group border-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-40 lg:h-52 overflow-hidden">
              <Image
                src={cover}
                alt={title}
                width={1024}
                height={1024}
                unoptimized
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col items-start justify-start mt-4">
              <CardTitle className="text-lg font-semibold text-foreground/80 group-hover:text-foreground transition-all duration-300">
                {title}
              </CardTitle>
              <CardDescription className="mt-2">
                {description.length > 100
                  ? `${description.substring(0, 100)}...`
                  : description}
              </CardDescription>
            </div>
            <div className="flex items-center justify-between w-full mt-auto">
              <p className="text-[13px] text-muted-foreground">
                Published on {formatDate2(date)}
              </p>
              <AvatarGroup users={authors} />
            </div>
          </CardContent>
        </Card>
      </MagicCard>
    </>
  );
}

function AvatarGroup({ users, max = 4 }: { users: Author[]; max?: number }) {
  const displayUsers = users.slice(0, max);
  const remainingUsers = Math.max(users.length - max, 0);

  return (
    <div className="flex items-center">
      {displayUsers.map((user, index) => (
        <Avatar
          key={user.username}
          className={`inline-block border-2 w-9 h-9 border-background ${
            index !== 0 ? "-ml-3" : ""
          } `}
        >
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingUsers > 0 && (
        <Avatar className="-ml-3 inline-block border-2 border-background hover:translate-y-1 transition-transform">
          <AvatarFallback>+{remainingUsers}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

// Perbarui definisi PaginationControls
function PaginationControls({
  currentPage,
  totalPages,
  query,
  tags,
  sort,
  locale,
}: {
  currentPage: number;
  totalPages: number;
  query?: string;
  tags?: string;
  sort?: string;
  locale: string;
}) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (tags) params.set('tags', tags);
    if (sort) params.set('sort', sort);
    params.set('page', page.toString());
    
    return `/${locale}/resources/blog?${params.toString()}`;
  };

  // Fungsi untuk menentukan halaman yang ditampilkan (untuk pagination dengan banyak halaman)
  const getVisiblePages = (currentPage: number, totalPages: number) => {
    // Tampilkan maksimal 5 nomor halaman
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Jika total halaman <= 5, tampilkan semua
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Selalu tampilkan halaman saat ini dan 2 halaman di sekitarnya jika mungkin
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Pastikan kita menampilkan tepat maxVisiblePages
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);
  const showStartEllipsis = visiblePages[0] > 1;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={createPageUrl(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Halaman pertama jika tidak termasuk dalam visiblePages */}
        {showStartEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink href={createPageUrl(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {/* Halaman-halaman yang terlihat */}
        {visiblePages.map(page => (
          <PaginationItem key={page}>
            <PaginationLink 
              href={createPageUrl(page)} 
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Halaman terakhir jika tidak termasuk dalam visiblePages */}
        {showEndEllipsis && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={createPageUrl(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext 
            href={createPageUrl(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
