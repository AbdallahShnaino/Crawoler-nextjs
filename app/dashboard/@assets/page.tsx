"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AssetsViewer from "@/components/Asset/AssetViewer/AssetViewer";
import { getUrlAssets } from "@/services/url";
import { Asset } from "@/lib/types";
import { Videotape } from "lucide-react";
import { useAuth } from "@/context/user";

export default function AssetsDashboardClient() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const pageId = Number(searchParams.get("pageId")) || undefined;
  const domainId = Number(searchParams.get("domainId")) || undefined;

  const updateAsset = (
    assetId: number,
    {
      status,
      ocrResult,
    }: { status: Asset["status"]; ocrResult?: Asset["ocrResult"] }
  ) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.assetId === assetId
          ? {
              ...asset,
              ...(ocrResult && { ocrResult }),
              status,
            }
          : asset
      )
    );
  };

  useEffect(() => {
    const fetchAssets = async () => {
      if (loading) return;
      if (pageId !== undefined && domainId !== undefined && token !== null) {
        setLoading(true);
        const data = await getUrlAssets(domainId, pageId, token);
        setAssets(data);
        setLoading(false);
      }
    };

    fetchAssets();
  }, [pageId, domainId, token]);

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

  if (loading) return <p>Loading assets...</p>;

  return (
    <AssetsViewer
      assets={assets ?? []}
      token={token ?? ""}
      updateAsset={updateAsset}
    />
  );
}
