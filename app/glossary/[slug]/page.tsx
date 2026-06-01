import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlossaryPage } from "@/components/glossary-page";
import { glossaryContentMap } from "@/lib/glossary-content";
import { OG_IMAGE } from "@/lib/og";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

type Params = { slug: string };

export async function generateStaticParams() {
  return Object.keys(glossaryContentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = glossaryContentMap[slug];
  if (!content) return {};

  return {
    title: content.title,
    description: content.metaDescription,
    alternates: { canonical: `/glossary/${slug}` },
    openGraph: {
      title: content.title,
      description: content.metaDescription,
      url: `${siteUrl}/glossary/${slug}`,
      type: "article",
      images: OG_IMAGE,
    },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = glossaryContentMap[slug];
  if (!content) notFound();

  return <GlossaryPage content={content} />;
}
