import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpokePage } from "@/components/spoke-page";
import { devToolsSilo, devToolsContentMap } from "@/lib/dev-tools-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nudgehost.com";

type Params = { slug: string };

export async function generateStaticParams() {
  return Object.keys(devToolsContentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = devToolsContentMap[slug];
  if (!content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `/dev-tools/${slug}` },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${siteUrl}/dev-tools/${slug}`,
      type: "website",
    },
  };
}

export default async function DevToolSpokePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = devToolsContentMap[slug];
  if (!content) notFound();

  return <SpokePage content={content} silo={devToolsSilo} />;
}
