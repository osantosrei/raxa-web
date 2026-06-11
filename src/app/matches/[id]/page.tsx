import { MatchDetailClient } from "@/app/matches/[id]/MatchDetailClient";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchDetailPage({
  params,
}: MatchDetailPageProps) {
  const { id } = await params;

  return <MatchDetailClient id={id} />;
}
