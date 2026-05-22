import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpokePage } from "@/components/spoke-page";
import { useCasesSilo, useCasesContentMap } from "@/lib/use-cases-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nudgehost.com";

type Params = { slug: string };

export async function generateStaticParams() {
  return Object.keys(useCasesContentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = useCasesContentMap[slug];
  if (!content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `/use-cases/${slug}` },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${siteUrl}/use-cases/${slug}`,
      type: "website",
    },
  };
}

export default async function UseCaseSpokePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = useCasesContentMap[slug];
  if (!content) notFound();

  return <SpokePage content={content} silo={useCasesSilo} />;
}
