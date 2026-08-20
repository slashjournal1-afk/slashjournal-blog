import { redirect } from 'next/navigation';

interface DocPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug[resolvedParams.slug.length - 1];
  redirect(`/${slug}`);
}
