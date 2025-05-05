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
interface IProps {
  assets: Asset[];
  token: string;
}

export default function AssetsViewer({ assets, token }: IProps) {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-8">Assets Dashboard</h1>

      {assets && assets.length > 0 ? (
        assets.map((asset) => (
          <Accordion key={asset.assetId} type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>{asset.assetUrl}</AccordionTrigger>
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="m-0">
                      No OCR information available for this asset. Run the OCR
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        await triggerOcr(asset.assetId.toString(), token);
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
        ))
      ) : (
        <p>
          No assets found for this page. Try picking another one to view its
          assets.
        </p>
      )}
    </div>
  );
}
