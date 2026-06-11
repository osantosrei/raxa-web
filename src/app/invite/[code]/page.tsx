import { InvitePreviewClient } from "@/app/invite/[code]/InvitePreviewClient";

interface InvitePreviewPageProps {
  params: Promise<{ code: string }>;
}

/**
 * Renders the invite preview page for a given invite code.
 *
 * @param params - A promise that resolves to an object with `code`, the invite code string.
 * @returns A React element that renders `InvitePreviewClient` for the provided `code`.
 */
export default async function InvitePreviewPage({
  params,
}: InvitePreviewPageProps) {
  const { code } = await params;

  return <InvitePreviewClient code={code} />;
}
