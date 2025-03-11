import { getAllBlogs, getAllTags } from "@/lib/markdown";
import { NAV_LINKS } from "@/utils/constants/nav-links";

export default async function sitemap() {
  const baseUrl = "https://www.cvcoders.my.id";
  const locales = ['id', 'en', 'ja', 'hi'];

  // Get All Posts from CMS
  const posts = await getAllBlogs();
  const postsUrls = posts?.flatMap((post) => 
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/resources/blog/${post.slug}`,
      lastModified: new Date(),
    }))
  ) ?? [];

  // Get All Tags
  const tags = await getAllTags();
  const tagsUrls = tags.flatMap((tag) => 
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/resources/blog/tags/${tag}`,
      lastModified: new Date(),
    }))
  );

  // Get All Nav Links
  const getNavLinks = (links: typeof NAV_LINKS): { url: string; lastModified: Date }[] => {
    return links.flatMap((link) => {
      const urls = locales.flatMap((locale) => [
        {
          url: `${baseUrl}/${locale}${link.href}`,
          lastModified: new Date(),
        },
      ]);

      if (link.menu) {
        const menuUrls = link.menu.flatMap((item) => 
          locales.map((locale) => ({
            url: `${baseUrl}/${locale}${item.href}`,
            lastModified: new Date(),
          }))
        );
        urls.push(...menuUrls);
      }

      return urls;
    });
  };

  const navUrls = getNavLinks(NAV_LINKS);

  // Add locale root paths
  const localeRootUrls = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...localeRootUrls,
    ...postsUrls,
    ...tagsUrls,
    ...navUrls,
  ];
}
