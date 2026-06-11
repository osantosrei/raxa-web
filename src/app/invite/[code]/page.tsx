import { InvitePreviewClient } from "@/app/invite/[code]/InvitePreviewClient";

interface InvitePreviewPageProps {
  params: Promise<{ code: string }>;
}

export default async function InvitePreviewPage({
  params,
}: InvitePreviewPageProps) {
  const { code } = await params;

  return <InvitePreviewClient code={code} />;
}
