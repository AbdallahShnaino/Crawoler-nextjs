import AssetsViewer from "@/components/Asset/AssetViewer/AssetViewer";
import { requireAuth } from "@/context/auth";
import { Asset } from "@/lib/types";
import { getUrlAssets } from "@/services/url";
import { Videotape } from "lucide-react";

export default async function AssetsDashboard({
  searchParams,
}: {
  searchParams: { pageId?: string; domainId?: string };
}) {
  /* 
  const mockAssets: Asset[] = [
    {
      assetId: 1,
      pageId: 100,
      assetUrl: "https://example.com/page1",
      type: "image",
      status: "completed",
      ocrResult: [
        { content: "Welcome to Example", confidence: 0.96 },
        { content: "Page Header", confidence: 0.93 },
      ],
    },
    {
      assetId: 2,
      pageId: 100,
      assetUrl: "https://example.com/page1",
      type: "script",
      status: "pending",
      ocrResult: [],
    },
    {
      assetId: 3,
      pageId: 101,
      assetUrl: "https://example.com/page2",
      type: "image",
      status: "completed",
      ocrResult: [{ content: "Login Form", confidence: 0.88 }],
    },
    {
      assetId: 4,
      pageId: 102,
      assetUrl: "https://example.com/page3",
      type: "image",
      status: "failed",
      ocrResult: [],
    },
    {
      assetId: 5,
      pageId: 102,
      assetUrl: "https://example.com/page3",
      type: "image",
      status: "processing",
      ocrResult: [{ content: "Loading...", confidence: 0.0 }],
    },
  ];
  
  */
  const { token } = await requireAuth();
  const pageId = Number(searchParams.pageId) || undefined;
  const domainId = Number(searchParams.domainId) || undefined;

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
