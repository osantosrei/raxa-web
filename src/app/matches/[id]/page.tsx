import { MatchDetailClient } from "@/app/matches/[id]/MatchDetailClient";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Page component that renders the match detail view for a specific match id.
 *
 * @param params - A promise that resolves to an object containing the route parameter `id`
 * @returns A React element that renders the match detail client for the provided `id`
 */
export default async function MatchDetailPage({
  params,
}: MatchDetailPageProps) {
  const { id } = await params;

  return <MatchDetailClient id={id} />;
}
