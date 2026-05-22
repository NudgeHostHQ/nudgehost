import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpokePage } from "@/components/spoke-page";
import { convertersSilo, convertersContentMap } from "@/lib/converters-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nudgehost.com";

type Params = { slug: string };

export async function generateStaticParams() {
  return Object.keys(convertersContentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = convertersContentMap[slug];
  if (!content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `/converters/${slug}` },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${siteUrl}/converters/${slug}`,
      type: "website",
    },
  };
}

export default async function ConverterSpokePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = convertersContentMap[slug];
  if (!content) notFound();

  return <SpokePage content={content} silo={convertersSilo} />;
}
