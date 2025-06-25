"use client";

import { Asset } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerOcr } from "@/services/ocr";
import { Fragment, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface IProps {
  assets: Asset[];
  token: string;
  updateAsset: (
    assetId: number,
    {
      status,
      ocrResult,
    }: {
      status: Asset["status"];
      ocrResult?: Asset["ocrResult"];
    }
  ) => void;
}
interface IAssetItemProps {
  asset: Asset;
  token: string;
  updateAsset: (
    assetId: number,
    {
      status,
      ocrResult,
    }: {
      status: Asset["status"];
      ocrResult?: Asset["ocrResult"];
    }
  ) => void;
}

export default function AssetsViewer({ assets, token, updateAsset }: IProps) {
  const [search, setSearch] = useState("");

  const filteredAssets = assets.filter(({ ocrResult: { content } }) =>
    search
      ? (content ?? "").toLowerCase().includes(search.toLowerCase().trim())
      : true
  );

  const groupedAssets = filteredAssets.reduce((acc, asset) => {
    if (acc[asset.status]) {
      acc[asset.status].push(asset);
    } else {
      acc[asset.status] = [asset];
    }
    return acc;
  }, {} as Record<string, Asset[]>);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <h1 className="text-2xl font-bold">Assets Dashboard</h1>
        <Input
          placeholder="Search content"
          className="xl:max-w-xs"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {assets.length > 0 ? (
        filteredAssets.length > 0 ? (
          Object.entries(groupedAssets)
            .sort(([statusA], [statusB]) => {
              const orderedStatusses = ["processed", "failed", "pending"];
              return (
                orderedStatusses.indexOf(statusA) -
                orderedStatusses.indexOf(statusB)
              );
            })
            .map(([status, matchingAssets], index) => (
              <Fragment key={index}>
                {index > 0 && <hr />}
                <h2 className="font-bold capitalize">{status} Assets</h2>
                {matchingAssets.map((asset) => (
                  <AssetItem
                    key={asset.assetId}
                    asset={asset}
                    token={token}
                    updateAsset={updateAsset}
                  />
                ))}
              </Fragment>
            ))
        ) : (
          <p>No matches found. Try using another search term.</p>
        )
      ) : (
        <p>
          No assets found for this page. Try picking another one to view its
          assets.
        </p>
      )}
    </div>
  );
}

function AssetItem({ asset, token, updateAsset }: IAssetItemProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="truncate max-w-[calc(100%_-_32px)]">
            {asset.assetUrl}
          </div>
        </AccordionTrigger>
        {asset.ocrResult.confidence ? (
          <AccordionContent key={asset.ocrResult.confidence}>
            {asset.type === "image" && (
              <Image
                src={asset.assetUrl}
                alt="asset image"
                width={100}
                height={100}
              />
            )}
            Asset Type: {asset.type}
            <br />
            Asset Status: {asset.status}
            <br />
            <div className="text-orange-500 font-bold">OCR Result</div>
            Content: {asset.ocrResult.content}
            <br />
            Confidence Score: {asset.ocrResult.confidence}%
          </AccordionContent>
        ) : (
          <AccordionContent key={asset.assetId}>
            {asset.type === "image" && (
              <Image
                src={asset.assetUrl}
                alt="asset image"
                width={100}
                height={100}
              />
            )}
            Asset Type: {asset.type}
            <br />
            Asset Status: {asset.status}
            {asset.status !== "processed" && (
              <div className="flex items-center gap-2 flex-wrap">
                <p className="m-0">
                  No OCR information available for this asset. Run the OCR
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      const { ocr_result } = await triggerOcr(
                        asset.assetId.toString(),
                        token
                      );
                      updateAsset(asset.assetId, {
                        status: "processed",
                        ocrResult: {
                          ...ocr_result,
                          confidence: Math.round(
                            Number(ocr_result.confidence) * 100
                          ),
                        },
                      });
                      toast("Asset processed successfully!", {
                        type: "success",
                      });
                    } catch {
                      updateAsset(asset.assetId, {
                        status: "failed",
                      });
                      toast("Failed to process asset!", {
                        type: "success",
                      });
                    }
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            )}
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
}
