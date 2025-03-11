import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { promises as fs } from "fs";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";
import { visit } from "unist-util-visit";
import matter from "gray-matter";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// custom components imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pre from "@/components/markdown/pre";
import Note from "@/components/markdown/note";
import { Stepper, StepperItem } from "@/components/markdown/stepper";
import Image from "@/components/markdown/image";
import Link from "@/components/markdown/link";
import Files from "@/components/markdown/files";
import { Button } from "@/components/ui/button";
import CodePreviewTabs from "@/components/markdown/code-preview-tabs";
import Outlet from "@/components/markdown/outlet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// add custom components
const components = {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  pre: Pre,
  Note,
  Stepper,
  StepperItem,
  img: Image,
  a: Link,
  Files,
  table: Table,
  button: Button,
  thead: TableHeader,
  th: TableHead,
  tr: TableRow,
  tbody: TableBody,
  t: TableCell,
  CodePreviewTabs,
  Outlet,
};

// can be used for other pages like blogs, Guides etc
export async function parseMdx<Frontmatter>(rawMdx: string) {
  return await compileMDX<Frontmatter>({
    source: rawMdx,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          preProcess,
          rehypeCodeTitles,
          rehypePrism,
          rehypeSlug,
          rehypeAutolinkHeadings,
          postProcess,
        ],
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  });
}

// logic for docs

export type BaseMdxFrontmatter = {
  title: string;
  description: string;
};

function sluggify(text: string) {
  const slug = text.toLowerCase().replace(/\s+/g, "-");
  return slug.replace(/[^a-z0-9-]/g, "");
}

function justGetFrontmatterFromMD<Frontmatter>(rawMd: string): Frontmatter {
  return matter(rawMd).data as Frontmatter;
}

// for copying the code in pre
// {{ }} eslint-disable-next-line @typescript-eslint/no-explicit-any
const preProcess = () => (tree: any) => {
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      const [codeEl] = node.children;
      if (codeEl.tagName !== "code") return;
      node.raw = codeEl.children?.[0].value;
    }
  });
};

//{{}} eslint-disable-next-line @typescript-eslint/no-explicit-any
const postProcess = () => (tree: any) => {
  visit(tree, "element", (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      node.properties["raw"] = node.raw;
    }
  });
};

export type Author = {
  avatar?: string;
  handle: string;
  username: string;
  handleUrl: string;
};

export type BlogMdxFrontmatter = BaseMdxFrontmatter & {
  date: string;
  authors: Author[];
  cover: string;
  tags: string[];
};

export async function getAllBlogStaticPaths() {
  try {
    const blogFolder = path.join(process.cwd(), "/src/contents/blogs/");
    const res = await fs.readdir(blogFolder);
    return res.map((file) => file.split(".")[0]);
  } catch (err) {
    console.log(err);
  }
}
export async function getAllBlogs() {
  const blogFolder = path.join(process.cwd(), "/src/contents/blogs/");
  const files = await fs.readdir(blogFolder);
  const uncheckedRes = await Promise.all(
    files.map(async (file) => {
      if (!file.endsWith(".mdx")) return undefined;
      const filepath = path.join(process.cwd(), `/src/contents/blogs/${file}`);
      const rawMdx = await fs.readFile(filepath, "utf-8");
      return {
        ...justGetFrontmatterFromMD<BlogMdxFrontmatter>(rawMdx),
        slug: file.split(".")[0],
      };
    })
  );
  return uncheckedRes.filter((it) => !!it) as (BlogMdxFrontmatter & {
    slug: string;
  })[];
}

export async function getBlogForSlug(slug: string) {
  const blogFile = path.join(
    process.cwd(),
    "/src/contents/blogs/",

    `${slug}.mdx`
  );
  try {
    const rawMdx = await fs.readFile(blogFile, "utf-8");
    return await parseMdx<BlogMdxFrontmatter>(rawMdx);
  } catch {
    return undefined;
  }
}

export async function getBlogTocs(slug: string) {
  const blogFile = path.join(
    process.cwd(),
    "/src/contents/blogs/",
    `${slug}.mdx`
  );
  const rawMdx = await fs.readFile(blogFile, "utf-8");
  // captures between ## - #### can modify accordingly
  const headingsRegex = /^(#{2,4})\s(.+)$/gm;
  let match;
  const extractedHeadings = [];
  while ((match = headingsRegex.exec(rawMdx)) !== null) {
    const headingLevel = match[1].length;
    const headingText = match[2].trim();
    const slug = sluggify(headingText);
    extractedHeadings.push({
      level: headingLevel,
      text: headingText,
      href: `#${slug}`,
    });
  }
  return extractedHeadings;
}

export async function getPreviousNextBlog(currentSlug: string) {
  const blogs = await getAllBlogs();
  const sortedBlogs = blogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const currentIndex = sortedBlogs.findIndex(
    (blog) => blog.slug === currentSlug
  );

  return {
    prev: currentIndex > 0 ? sortedBlogs[currentIndex - 1] : null,
    next:
      currentIndex < sortedBlogs.length - 1
        ? sortedBlogs[currentIndex + 1]
        : null,
  };
}

export async function getBlogsByTag(tag: string) {
  const blogs = await getAllBlogs();
  return blogs
    .filter((blog) =>
      blog.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllTags() {
  const blogs = await getAllBlogs();
  const tags = blogs.reduce((acc: string[], blog) => {
    blog.tags?.forEach((tag) => {
      if (!acc.includes(tag.toLowerCase())) {
        acc.push(tag.toLowerCase());
      }
    });
    return acc;
  }, []);
  return tags.sort();
}

export async function getPostForSlug(slug: string) {
  // Pisahkan path menjadi bagian-bagian
  const pathParts = slug.split("/");
  const blogFile =
    path.join(process.cwd(), "/src/contents/post", ...pathParts) + ".mdx";

  try {
    const rawMdx = await fs.readFile(blogFile, "utf-8");
    return await parseMdx<PostFrontmatter>(rawMdx);
  } catch {
    return undefined;
  }
}

export interface PostFrontmatter extends BaseMdxFrontmatter {
  date?: string;
  order?: number;
}

export async function getAllPosts(novelPath: string) {
  // Gabungkan base path dengan path novel/komik yang diminta
  const postsFolder = path.join(process.cwd(), "/src/contents/post", novelPath);

  try {
    const files = await fs.readdir(postsFolder);

    const uncheckedRes = await Promise.all(
      files.map(async (file) => {
        if (!file.endsWith(".mdx")) return undefined;

        const filepath = path.join(postsFolder, file);
        const rawMdx = await fs.readFile(filepath, "utf-8");

        // Ekstrak nomor dari nama file (misalnya "chapter-1" akan mengambil 1)
        const numberMatch = file.match(/(\d+)/);
        const order = numberMatch ? parseInt(numberMatch[1], 10) : 0;

        return {
          ...justGetFrontmatterFromMD<PostFrontmatter>(rawMdx),
          // Gabungkan novelPath dengan nama file untuk slug lengkap
          slug: `${novelPath}/${file.replace(".mdx", "")}`,
          order: order,
        };
      })
    );

    // Filter undefined values dan sort berdasarkan order
    const posts = uncheckedRes
      .filter(
        (it): it is PostFrontmatter & { slug: string; order: number } => !!it
      )
      .sort((a, b) => a.order - b.order);

    return posts;
  } catch (error) {
    console.error("Error reading posts:", error);
    return [];
  }
}

export async function getAllPreviousNextPost(currentSlug: string) {
  // Dapatkan path novel/komik (semua bagian path kecuali bagian terakhir)
  const pathParts = currentSlug.split("/");
  const novelPath = pathParts.slice(0, -1).join("/");

  try {
    // Ambil semua post untuk novel/komik ini
    const posts = await getAllPosts(novelPath);

    // Cari indeks post saat ini
    const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

    return {
      prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
      next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    };
  } catch (error) {
    console.error("Error getting previous/next posts:", error);
    return {
      prev: null,
      next: null,
    };
  }
}
