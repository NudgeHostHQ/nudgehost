import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpokePage } from "@/components/spoke-page";
import { featuresSilo, featuresContentMap } from "@/lib/features-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

type Params = { slug: string };

export async function generateStaticParams() {
  return Object.keys(featuresContentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = featuresContentMap[slug];
  if (!content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `/features/${slug}` },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${siteUrl}/features/${slug}`,
      type: "website",
    },
  };
}

export default async function FeatureSpokePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = featuresContentMap[slug];
  if (!content) notFound();

  return <SpokePage content={content} silo={featuresSilo} />;
}
