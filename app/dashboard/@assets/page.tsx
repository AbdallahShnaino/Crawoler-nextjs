import AssetsViewer from "@/components/Asset/AssetViewer/AssetViewer";
import { requireAuth } from "@/context/auth";
import { Asset } from "@/lib/types";
import { getUrlAssets } from "@/services/url";
import { Videotape } from "lucide-react";

export default async function AssetsDashboard({
  searchParams,
}: {
  searchParams: Promise<{ pageId?: string; domainId?: string }>;
}) {
  const { pageId: rawPageId, domainId: rawDomainId } = await searchParams;
  const pageId = Number(rawPageId) || undefined;
  const domainId = Number(rawDomainId) || undefined;
  const { token } = await requireAuth();

  const assets: Asset[] | null =
    pageId !== undefined && domainId !== undefined
      ? await getUrlAssets(domainId, pageId, token)
      : null;

  if (pageId === undefined) {
    return (
      <div className="flex flex-col items-center justify-start h-screen mt-20 text-sm	">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">🔒 Locked</h1>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          Click on
          <Videotape /> to set its assets and unlock the assets dashboard.
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          If you don&apos;t see <Videotape size={22} /> icon, don&apos;t worry —
          just wait until the page crawling job is completed.
        </p>
      </div>
    );
  }
  return <AssetsViewer assets={assets ?? []} token={token} />;
}
