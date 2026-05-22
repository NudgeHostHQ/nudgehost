import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpokePage } from "@/components/spoke-page";
import { hostSilo, hostContentMap } from "@/lib/host-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nudgehost.com";

type Params = { slug: string };

export async function generateStaticParams() {
  return Object.keys(hostContentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = hostContentMap[slug];
  if (!content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `/host/${slug}` },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${siteUrl}/host/${slug}`,
      type: "website",
    },
  };
}

export default async function HostSpokePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = hostContentMap[slug];
  if (!content) notFound();

  return <SpokePage content={content} silo={hostSilo} />;
}
