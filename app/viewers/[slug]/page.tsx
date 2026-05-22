import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpokePage } from "@/components/spoke-page";
import { viewersSilo, viewersContentMap } from "@/lib/viewers-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

type Params = { slug: string };

export async function generateStaticParams() {
  return Object.keys(viewersContentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = viewersContentMap[slug];
  if (!content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `/viewers/${slug}` },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${siteUrl}/viewers/${slug}`,
      type: "website",
    },
  };
}

export default async function ViewerSpokePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = viewersContentMap[slug];
  if (!content) notFound();

  return <SpokePage content={content} silo={viewersSilo} />;
}
