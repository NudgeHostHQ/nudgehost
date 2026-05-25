import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/blog-post";
import { blogContentMap } from "@/lib/blog-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

type Params = { slug: string };

export async function generateStaticParams() {
  return Object.keys(blogContentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogContentMap[slug];
  if (!post) return {};

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `${siteUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate,
      authors: [post.author],
    },
  };
}

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = blogContentMap[slug];
  if (!post) notFound();

  return <BlogPostPage post={post} />;
}
